
module.exports = {
    deprecated: function (creep) {
        if (creep.memory.deprecated) {

            var spawn = Game.getObjectById(creep.memory.deprecated);
            if(spawn)
            {
		creep.drop(RESOURCE_ENERGY);
		creep.say('deprecated');
		
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
            }
            else
            {
                creep.memory.deprecated = undefined;
                return false;
            }          

            creep.say('deprecated');
            return true;
        }
        return false;
    }
};
