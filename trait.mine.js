function setMineTarget(creep) {
    var sources = creep.room.find(FIND_SOURCES, { filter: (src) => { return src.energy >= creep.carryCapacity } });

    if (!sources || sources.length == 0) {
        console.log(creep.name + " has nothing to mine.")        
    }

    var srcCount = new Array();
    for (var id in sources) {
        var src = sources[id];
        srcCount[src.id] = 0;
    }

    for (var name in Game.creeps) {
        var current = Game.creeps[name];
        if (current.memory.mineTarget) {
            if (current.memory.mineTarget in srcCount) {
                srcCount[current.memory.mineTarget] = srcCount[current.memory.mineTarget] + 1;
            }
        }
    }

    var min = 10000;
    var minSrc = undefined;
    for (var id in sources) {
        var src = sources[id];

        if (srcCount[src.id] < min) {
            minSrc = src.id;
            min = srcCount[src.id];
        }
    }

    if (minSrc) {
        creep.memory.mineTarget = minSrc;
    }
}

function mine(creep, target){
    var result = creep.harvest(target);

    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
        return true;
    }
    else if (result == ERR_NOT_ENOUGH_RESOURCES) {
        creep.memory.mineTarget = undefined;
        return true;
    }
    else if (result == OK)
    {
        return true;
    }
    else if (result != ERR_BUSY) {
        console.log(creep.name + ' error mining: ' + result);
        return false;
    }    
}

module.exports = {

    mineToCreep: function (creep) {        
        if (creep.carry.energy == creep.carryCapacity || (!creep.memory.mining && creep.carry.energy != 0)) {
            creep.memory.mining = false;
            creep.memory.mineTarget = undefined;            
            return false;
        }

        if (!creep.memory.mining) {
            creep.memory.mining = true;
        }

        if (!creep.memory.mineTarget) {
            setMineTarget(creep);
        }

        var target = Game.getObjectById(creep.memory.mineTarget);        

        if (!target) {
            creep.memory.mineTarget = undefined;
            return true;
        }

        var mining = mine(creep, target);

        creep.memory.mining = mining;
                
        return mining;
    },
    mineToFloor: function (creep) {
        if (!creep.memory.mineTarget) {
            setMineTarget(creep);
        }

        var target = Game.getObjectById(creep.memory.mineTarget);

        if (!target) {
            creep.memory.mineTarget = undefined;
            return true;
        }

        var mining = mine(creep, target);
        creep.memory.mining = mining;

        return mining;                
    }
}