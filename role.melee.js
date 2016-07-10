var traitRenew = require('trait.renew');
var traitDeprecated = require('trait.deprecated');
var traitSquad = require('trait.squad');
var _ = require('lodash');

module.exports = {
    run: function(creep){

	if(!traitSquad.squad(creep))
	{	
	    var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

	    if(target){
		var result = creep.attack(target);

		if(result == ERR_NOT_IN_RANGE)
		{
		    creep.moveTo(target);
		}
	     
	    }
	    else {
		if(!traitRenew.renew(creep) && !traitDeprecated.deprecated(creep)){
		    creep.moveTo(25,25);
		}	    
	    }
	}
    }    
}
