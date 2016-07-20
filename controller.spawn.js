var statService = require('service.stats');
var constants = require('constants');

function spawnCreep(spawn, modules, role, memory) {

    var result = spawn.canCreateCreep(modules, undefined);

    if (result == 0) {

        memory.home = spawn.room.name;
        memory.phase = spawn.room.memory.phase.id;
        memory.role = role;

        var newName = spawn.createCreep(modules, undefined, memory);
        console.log('Spawning ' + newName + ' phase ' + spawn.room.memory.phase.id + ' ' + role + ' creep with ' + modules);
        return true;
    }

    return false;
}

function renewCreepsInRange(spawn) {
    var targets = spawn.pos.findInRange(FIND_MY_CREEPS, 1, {
        filter: (creep) => {
            return creep.memory.renew == spawn.id && !creep.memory.deprecated && creep.ticksToLive < constants.renew.upper_bound;
        }
    });

    if (targets.length > 0) {
        spawn.renewCreep(targets[0]);
    }
}

function dispatchRenew(spawn)
{
    if(!spawn.memory.renewQ)
    {
	return;
    }

    while(spawn.memory.renewQ.length > 0)
    {
	var next = Game.getObjectById(spawn.memory.renewQ[0]);
	
	if(!next
	   || next.ticksToLive >= constants.renew.upper_bound
	   || next.memory.deprecated)
	{
	    spawn.memory.renewQ.splice(0, 1);

	    if(next)
	    {
		next.memory.renew = undefined;
	    }
	    
	    continue;
	}

	if(next.memory.renew)
	{
	    return;
	}	 

	next.memory.renew = spawn.id;
	console.log(next.name + ' is now allowed to renew itself');	    

	return;
    }
}


function spawnCreepsByRoomPhase(spawn) {

    var spawnCount = spawn.room.find(FIND_SOURCES).length;
    
    if(Memory.ctrl && Memory.ctrl.remote_sources)
    {	
	remoteSources = Memory.ctrl.remote_sources[spawn.room.name];

	if(remoteSources)
	{
	    spawnCount += remoteSources.length;
	}	    
    }
    
    var existingCreeps = [];

    // Count existing creeps per role
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.home != spawn.room.name || !creep.memory.role) {
            continue;
        }

        if (!(creep.memory.role in existingCreeps)) {
            existingCreeps[creep.memory.role] = {current: 0, deprec: 0};
        }

	if (creep.memory.phase == spawn.room.memory.phase.id)
	{
            existingCreeps[creep.memory.role].current = existingCreeps[creep.memory.role].current + 1;
        }
	else {
            existingCreeps[creep.memory.role].deprec = existingCreeps[creep.memory.role].deprec + 1;
        }
    }

    // Deprecate creeps that have upgrades already
    var deprecated = spawn.room.find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.deprecated });

    if (deprecated.length < 1) {
	for (var name in Game.creeps) {
	    var creep = Game.creeps[name];

	    if (creep.memory.home != spawn.room.name || !creep.memory.role) {
		continue;
	    }
	    
	    var typeDefinition = spawn.room.memory.phase.creeps[creep.memory.role];
            var countTarget = typeDefinition.count;

            if (typeDefinition.perSource) {
                countTarget = typeDefinition.count * spawnCount;
            }
	    
	    if (creep.memory.phase < spawn.room.memory.phase.id
		&& countTarget != 0
		&& (existingCreeps[creep.memory.role].current + existingCreeps[creep.memory.role].deprec) > countTarget) {
		creep.memory.deprecated = spawn;
		console.log('Poor deprecated ' + creep.name + ' is waiting to be recycled');
		break;
	    }
	}
    }

    // Spawn creeps
    for (var currentSpawnIteration = 1; currentSpawnIteration <= spawnCount; currentSpawnIteration++) {
        for (var role in spawn.room.memory.phase.creeps) {
            
            var typeDefinition = spawn.room.memory.phase.creeps[role];
            var countTarget = typeDefinition.count;

            if (typeDefinition.perSource) {
                countTarget = typeDefinition.count * currentSpawnIteration;
            }
            
            //console.log("Spawn Iteration: " + currentSpawnIteration + " for role " + role + " " + existingCreeps[role] + " / " + countTarget)
    	    
            if (countTarget > 0 && (!(role in existingCreeps) || existingCreeps[role].current < countTarget)) {
                spawnCreep(spawn, createModules(typeDefinition.modules), role, typeDefinition.memory);
		return;
            }
        }
    }

    // Deprecate creeps that have no upgrades (since now all are spawned)
    var deprecated = spawn.room.find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.deprecated });

    if (deprecated.length < 1) {
	for (var name in Game.creeps) {
	    var creep = Game.creeps[name];

	    if (creep.memory.home != spawn.room.name || !creep.memory.role) {
		continue;
	    }
   
	    var typeDefinition = spawn.room.memory.phase.creeps[creep.memory.role];
            var countTarget = typeDefinition.count;

            if (typeDefinition.perSource) {
                countTarget = typeDefinition.count * spawnCount;
            }
	    
	    if (creep.memory.phase < spawn.room.memory.phase.id
		&& (existingCreeps[creep.memory.role].current + existingCreeps[creep.memory.role].deprec) > countTarget) {
		creep.memory.deprecated = spawn.id;
		console.log('Poor deprecated ' + creep.name + ' is waiting to be recycled');
		break;
	    }
	}
    }

    var cycle = spawn.pos.findInRange(FIND_MY_CREEPS, 1, { filter: (creep) => creep.memory.deprecated && creep.memory.deprecated.id == spawn.id });
    if (cycle.length > 0) {
	console.log(cycle[0].name + ' gets recycled');
	spawn.recycleCreep(cycle[0]);
	return;
    }


}

function createModules(definition){
    
    var modules = [];
    _.forEach(definition, function(line) {
	modules = modules.concat(_.times(line.count, (c) => line.module));	
    });
    return modules;
}

function removeDeadCreeps() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Dead creep ' + name + ' removed from memory');
        }
    }
}

module.exports = {

    dispatchRenew: function (){
	for (var spwn in Game.spawns) {
            var spawn = Game.spawns[spwn];

	    dispatchRenew(spawn);	    
        }
    },
    spawnCreeps: function(){
	for (var spwn in Game.spawns) {
	    var spawn = Game.spawns[spwn];

            if (spawn.spawning) {
                continue;
            }

            spawnCreepsByRoomPhase(spawn);            
	}
    },
    removeDead: function(){
	for (var spwn in Game.spawns) {
	    var spawn = Game.spawns[spwn];

            if (spawn.spawning) {
		return;
            }
        }
        removeDeadCreeps();
    },
    renewCreepsInRange: function () {

        for (var spwn in Game.spawns) {
            var spawn = Game.spawns[spwn];

	    
            if (spawn.spawning) {
                continue;
            }

            renewCreepsInRange(spawn);
        }
    },
    writeStats: function () {

	for (var spwn in Game.spawns) {
            var spawn = Game.spawns[spwn];

	    
            statService.write('spawns.' + spawn.name + '.energy', spawn.energy, 'g');
        }
    }
};
