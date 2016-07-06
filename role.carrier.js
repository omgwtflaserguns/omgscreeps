var traitGather = require('trait.gather');
var traitRenew = require('trait.renew');
var traitDeprecated = require('trait.deprecated');
var constants = require('constants');
var _ = require('lodash');

function transfer(creep, target){
    var result = creep.transfer(target, RESOURCE_ENERGY)

    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
    else if (result != OK && result != ERR_BUSY) {
        console.log(creep.name + ' error on transfer: ' + result);
    }
}

module.exports = {    
    run: function (creep) {

        if (!traitDeprecated.deprecated(creep) && !traitRenew.renew(creep) && !traitGather.gather(creep)) {

	    if(creep.carry.energy == 0)
	    {
		creep.moveTo(25,25);
	    }
	    
	    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER
			&& structure.energyCapacity - structure.energy > constants.treshold.energy_tower;
                }
            });

	    if(!target)
	    {
		target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
			return (structure.structureType == STRUCTURE_EXTENSION
                            || structure.structureType == STRUCTURE_SPAWN
			   )
                        && structure.energy < structure.energyCapacity;
                    }
		});
	    }  
	    
            if (target) {
                transfer(creep, target);
            }
            else {
                var targets = _.filter(Game.creeps, { memory: { role: 'builder' } });
				
                var max = -1;
                var target = undefined;
                for (var name in targets) {
                    var current = targets[name];

		    if(current.memory.renew)
		    {
			continue;
		    }
		    
                    var builderSpace = current.carryCapacity - _.sum(current.carry);                    
                    if (builderSpace > max) {
                        target = current;
                        max = builderSpace;
                    }
                }

                if (target) {
                    transfer(creep, target);
                }
                else
                {
                    console.log(creep.name + " no one needs energy...");
                }                
            }

        }
    }
};


