
module.exports = {
    renew: function(creep)
    {
        if(creep.ticksToLive >= 1000)
        {
            creep.memory.renew = false;
        }
        else if(creep.ticksToLive < 500)
        {
            creep.memory.renew = true;
        }

        if(creep.memory.renew)
        {            
            var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
            creep.moveTo(spawn);   
            creep.say('renew');         
            return true;            
        }
        return false;        
    }
};