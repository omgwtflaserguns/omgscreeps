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
		creep.say('renew');
		
		if(spawn.room.name != creep.room.name)
		{
		    var exitDir = Game.map.findExit(creep.room, spawn.room.name);
		    var exit = creep.pos.findClosestByRange(exitDir);
		    creep.moveTo(exit);
		}
		else
		{                
                    creep.moveTo(spawn);                                               
		}
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
	    var room = Game.rooms[creep.memory.home];
	    var spawn = room.find(FIND_MY_SPAWNS)[0];
	    
	    if(!spawn.memory.renewQ)
	    {
		spawn.memory.renewQ = [];
	    }
	    if(!spawn.memory.renewQ.includes(creep.id))
	    {
		spawn.memory.renewQ.push(creep.id);
	    }
	}
        return false;        
    }
};
