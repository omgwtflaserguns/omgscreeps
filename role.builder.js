var traitRenew = require('trait.renew');
var traitDeprecated = require('trait.deprecated');
var constants = require('constants');

function build(creep, target) {
    var result = creep.build(target);

    if (result == ERR_NOT_IN_RANGE || result == ERR_NOT_ENOUGH_RESOURCES) {
        creep.moveTo(target);
    }
    else if (result != OK && result != ERR_BUSY && result != ERR_NOT_ENOUGH_RESOURCES) {
        console.log(creep.name + ' error on build: ' + result);
    }
}

function transfer(creep, target){
    var result = creep.transfer(target, RESOURCE_ENERGY)

    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
    else if (result != OK && result != ERR_BUSY && result != ERR_NOT_ENOUGH_RESOURCES) {
        console.log(creep.name + ' error on transfer: ' + result);
    }
}

module.exports = {

    run: function (creep) {
        if (!traitDeprecated.deprecated(creep) && !traitRenew.renew(creep)) {

            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

            if (target) {
                build(creep, target);
            }
	    else {

		if(creep.pos.getRangeTo(creep.room.controller) > constants.range.builder_controller)
		{
		    creep.moveTo(creep.room.controller);
		}
		else
		{
                    transfer(creep, creep.room.controller);
		}
            }
        }
    }
};
