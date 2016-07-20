var traitRenew = require('trait.renew');
var traitDeprecated = require('trait.deprecated');
var traitSquad = require('trait.squad');
var _ = require('lodash');

module.exports = {
    run: function(creep){

	if(!traitRenew.renew(creep) && !traitDeprecated.deprecated(creep) && !traitSquad.squad(creep))
	{	
	    var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: (creep) => creep.owner.username != 'Gadgetroch'});

	    if(target){
		var result = creep.attack(target);

		if(result == ERR_NOT_IN_RANGE)
		{
		    creep.moveTo(target);
		}
	     
	    }
	    else {
		creep.moveTo(25,25);			    
	    }
	}
    }    
}
