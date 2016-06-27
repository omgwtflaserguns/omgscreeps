var traitRenew = require('trait.renew');
var traitDeprecated = require('trait.deprecated');

module.exports = {
    hasTargets: function (room) {

    },
    run: function (creep) {

        if (!traitDeprecated.deprecated(creep) && !traitRenew.renew(creep)) {

            if (!creep.memory.mineTarget) {
                var sources = creep.room.find(FIND_SOURCES, { filter: (src) => { return src.energy >= creep.carryCapacity } });

                if (!sources || sources.length == 0) {
                    console.log(creep.name + " has nothing to mine.")
                    return true;
                }

                var srcCount = new Array();
                for (var id in sources) {
                    var src = sources[id];
                    srcCount[src.id] = 0
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

            var target = Game.getObjectById(creep.memory.mineTarget);
            var hrvst = creep.harvest(target);

            if (hrvst == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            else if (hrvst == ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.mineTarget = undefined;
            }
            else if (hrvst != OK && hrvst != ERR_BUSY)
            {
                console.log(creep.name + ' error mining: ' + hrvst);
            }
        }
    }
};


