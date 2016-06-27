var traitRenew = require('trait.renew');
var traitDeprecated = require('trait.deprecated');

var roleUpgrader = {

    run: function (creep) {
        if (!traitDeprecated.deprecated(creep) && !traitRenew.renew(creep)) {

            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }               
            } else {
                var upgrade = creep.upgradeController(creep.room.controller)
                if (upgrade == ERR_NOT_IN_RANGE || upgrade == ERR_NOT_ENOUGH_RESOURCES) {
                    creep.moveTo(creep.room.controller);
                }
                else if (upgrade != OK)
                {
                    console.log(creep.name + " error on upgrade: " + upgrade);
                }
            }
        }
    }
};

module.exports = roleUpgrader;
