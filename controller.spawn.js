
var constants = require('constants');

function spawnCreep(spawn, modules, role, memory) {
    if (spawn.canCreateCreep(modules, undefined) == 0) {

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

function spawnCreepsByRoomPhase(spawn) {

    var spawnCount = spawn.room.find(FIND_SOURCES).length;

    var existingCreeps = [];

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.home != spawn.room.name || creep.memory.phase != spawn.room.memory.phase.id) {
            continue;
        }

        if (!creep.memory.role) {
            console.log("Creep " + creep.name + " has no role!");
            continue;
        }

        if (!(creep.memory.role in existingCreeps)) {
            existingCreeps[creep.memory.role] = 1;
        }
        else {
            existingCreeps[creep.memory.role] = existingCreeps[creep.memory.role] + 1;
        }
    }


    for (var currentSpawnIteration = 1; currentSpawnIteration <= spawnCount; currentSpawnIteration++) {
        for (var role in spawn.room.memory.phase.creeps) {

            
            var typeDefinition = spawn.room.memory.phase.creeps[role];
            var countTarget = typeDefinition.count;

            if (typeDefinition.perSource) {
                countTarget = typeDefinition.count * currentSpawnIteration;
            }
            
            //console.log("Spawn Iteration: " + currentSpawnIteration + " for role " + role + " " + existingCreeps[role] + " / " + countTarget)
            
            if (countTarget > 0 && (!(role in existingCreeps) || existingCreeps[role] < countTarget)) {
                return spawnCreep(spawn, typeDefinition.modules, role, typeDefinition.memory);
            }
        }
    }

    // All new creeps are spawned, harvest old ones...
    deprecateCreeps(spawn);
}

function deprecateCreeps(spawn) {
    var deprecated = spawn.room.find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.deprecated });

    if (deprecated.length < 1) {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];

            if (creep.memory.home != spawn.room.name) {
                continue;
            }

            if (creep.memory.phase < spawn.room.memory.phase.id) {
                creep.memory.deprecated = spawn;
                console.log('Poor deprecated ' + creep.name + ' is waiting to be recycled');
                break;
            }
        }
    }

    var cycle = spawn.pos.findInRange(FIND_MY_CREEPS, 1, { filter: (creep) => creep.memory.deprecated && creep.memory.deprecated.id == spawn.id });
    if (cycle.length > 0) {
        console.log(cycle[0].name + ' gets recycled');
        spawn.recycleCreep(cycle[0]);
    }
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
    }
};
