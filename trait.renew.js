
module.exports = {
    renew: function(creep)
    {
        if(creep.ticksToLive >= 1000)
        {
            creep.memory.renew = false;
        }
        else if(creep.ticksToLive < 500)
        {
            var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS, {filter: (spwn) => !spwn.spawning});
            if(spawn)
            {
                creep.memory.renew = true;
                creep.moveTo(spawn);   
                creep.say('renew');         
                return true; 
            }
            else
            {
                creep.memory.renew = false;
                return false;
            }          
        }
        return false;        
    }
};