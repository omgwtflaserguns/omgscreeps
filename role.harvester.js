var traitGather = require('trait.gather');
var traitRenew = require('trait.renew');
var traitDeprecated = require('trait.deprecated');

module.exports = {
    hasTargets: function (room) {

    },
    run: function (creep) {

        if (!traitDeprecated.deprecated(creep) && !traitRenew.renew(creep) && !traitGather.gather(creep)) {
            
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION
                        || structure.structureType == STRUCTURE_SPAWN)
                        && structure.energy < structure.energyCapacity;
                }
            });

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
                var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (target) {
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
    }
};


