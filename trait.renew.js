var constants = require('constants');


module.exports = {
    renew: function(creep)
    {	
        if(creep.ticksToLive >= constants.renew.upper_bound)
        {
            creep.memory.renew = undefined;	    
        }
	else  if(creep.memory.renew)
        {
            var spawn = Game.getObjectById(creep.memory.renew);
            if(spawn)
            {
                creep.drop(RESOURCE_ENERGY);
                creep.moveTo(spawn);   
                creep.say('renew');         
                return true; 
            }
            else
            {
                creep.memory.renew = undefined;
                return false;
            }          
        }
	else if(creep.ticksToLive < constants.renew.lower_bound)
	{
	    if(!creep.room.memory.renewQ)
	    {
		creep.room.memory.renewQ = [];
	    }
	    if(!creep.room.memory.renewQ.includes(creep.id))
	    {
		creep.room.memory.renewQ.push(creep.id);
	    }
	}
        return false;        
    }
};
