function setTarget(creep) {

    var resources = creep.room.find(FIND_DROPPED_RESOURCES, { filter: (res) => res.resourceType == RESOURCE_ENERGY});

    if (!resources || resources.length == 0) {        
        return false;
    }

    var srcCount = new Array();
    for (var id in resources) {
        var src = resources[id];
        srcCount[src.id] = 0
    }

    for (var name in Game.creeps) {
        var current = Game.creeps[name];
        if (current.memory.gatherTarget) {
            if (current.memory.gatherTarget in srcCount) {
                srcCount[current.memory.gatherTarget] = srcCount[current.memory.gatherTarget] + 1;
            }
        }
    }

    var min = 10000;
    var minSrc = undefined;
    for (var id in resources) {
        var src = resources[id];

        if (srcCount[src.id] < min) {
            minSrc = src.id;
            min = srcCount[src.id];
        }
    }

    if (minSrc) {
        creep.memory.gatherTarget = minSrc;
        return true;
    }
    else
    {
        return false;
    }
}

function gather(creep, target){
    var result = creep.pickup(target);

    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
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

    gather: function (creep) {
        if (creep.carry.energy == creep.carryCapacity || (!creep.memory.mining && creep.carry.energy != 0)) {
            creep.memory.gathering = false;
            creep.memory.gatherTarget = undefined;
            
            return false;
        }

        if (!creep.memory.gathering) {
            creep.memory.gathering = true;
        }

        if (!creep.memory.gatherTarget) {
            if(!setTarget(creep))
            {
                creep.memory.gathering = false;                
                return false;
            }
        }

        var target = Game.getObjectById(creep.memory.gatherTarget);        

        if (!target) {
            creep.memory.gatherTarget = undefined;
            return true;
        }

        var gathering = gather(creep, target);

        creep.memory.gathering = gathering;
                
        return gathering; 
    }
};
