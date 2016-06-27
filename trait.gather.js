function setTarget(creep) {

    var sources = creep.room.find(FIND_SOURCES, { filter: (src) => { return src.energy >= creep.carryCapacity } });

    if (!sources || sources.length == 0) {
        console.log(creep.name + " has nothing to gather.")
        return true;
    }

    var srcCount = new Array();
    for (var id in sources) {
        var src = sources[id];
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
    for (var id in sources) {
        var src = sources[id];

        if (srcCount[src.id] < min) {
            minSrc = src.id;
            min = srcCount[src.id];
        }
    }

    if (minSrc) {
        creep.memory.gatherTarget = minSrc;
    }
}

module.exports = {

    gather: function (creep) {

        if (creep.carry.energy == creep.carryCapacity || (!creep.memory.gathering && creep.carry.energy != 0)) {
            creep.memory.gathering = false;
            creep.memory.gatherTarget = undefined;
            return false;
        }

        if (!creep.memory.gathering) {
            creep.memory.gathering = true;
        }

        var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

        if (dropped) {
            if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropped);
            }
            return true;
        }

        if (!creep.memory.gatherTarget) {
            setTarget(creep);
        }

        var sources = creep.room.find(FIND_SOURCES);
        var target = undefined;
        for (var name in sources) {
            var src = sources[name];
            if (src.id == creep.memory.gatherTarget) {
                target = src;
            }
        }

        if (!target) {
            creep.memory.gatherTarget = undefined;
            return true;
        }

        var hrvst = creep.harvest(target);

        if (hrvst == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        else if (hrvst == ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.gatherTarget = undefined;
        }

        return true;
    }
};
