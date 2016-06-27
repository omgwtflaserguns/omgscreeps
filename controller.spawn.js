function spawnCreep(spawn, modules, role) {
    if (spawn.canCreateCreep(modules, undefined) == 0) {
        var newName = spawn.createCreep(modules, undefined, { home: spawn.room.name, phase: spawn.room.memory.phase.id, role: role });
        console.log('Spawning ' + newName + ' phase ' + spawn.room.memory.phase.id + ' ' + role + ' creep with ' + modules);
        return true;
    }
    return false;
}

function renewCreepsInRange(spawn) {
    var targets = spawn.pos.findInRange(FIND_MY_CREEPS, 1, {
        filter: (creep) => {
            return creep.ticksToLive < 1000;
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

    for (var role in spawn.room.memory.phase.creeps) {

        var typeDefinition = spawn.room.memory.phase.creeps[role];

        if (typeDefinition.perSource) {
            typeDefinition.count = typeDefinition.count * spawnCount;
        }

        if (typeDefinition.count > 0 && (!(role in existingCreeps) || existingCreeps[role] < typeDefinition.count)) {
            return spawnCreep(spawn, typeDefinition.modules, role);            
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
    run: function () {

        var spawning = false;
        for (var spwn in Game.spawns) {
            var spawn = Game.spawns[spwn];

            if (spawn.spawning) {
                spawning = true;
                continue;
            }

            spawning = spawning || spawnCreepsByRoomPhase(spawn);           

            renewCreepsInRange(spawn);
        }
        
        if (!spawning) {
            if (Game.time % 50 == 0) {
                removeDeadCreeps();                
            }
        }
    }
};