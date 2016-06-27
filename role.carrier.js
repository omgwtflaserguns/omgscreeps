var traitGather = require('trait.gather');
var traitRenew = require('trait.renew');
var traitDeprecated = require('trait.deprecated');
var _ = require('lodash');

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
                var trans = creep.transfer(target, RESOURCE_ENERGY)

                if (trans == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else if (trans != OK) {
                    console.log(creep.name + ' error on transfer: ' + trans);
                }
            }
            else {
                var targets = _.filter(Game.creeps, { memory: { role: 'builder' } });


                var max = -1;
                var target = undefined;
                for (var name in targets) {
                    var current = targets[name];

                    var builderSpace = current.carryCapacity - _.sum(current.carry);                    
                    if (builderSpace > max) {
                        target = current;
                        max = builderSpace;
                    }
                }

                if (target) {
                    var trans = creep.transfer(target, RESOURCE_ENERGY)

                    if (trans == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    else if (trans != OK) {
                        console.log(creep.name + ' error on transfer: ' + trans);
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


