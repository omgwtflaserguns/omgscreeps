
module.exports = {

    squad: function(creep){

	var squadName = creep.memory.squad;
	if(!squadName)
	{
	    return false;
	}

	var squad = Memory.squads[squadName];
	if(!squad)
	{
	    creep.memory.squad = undefined;
	    return false;
	}

	if(squad.target && creep.room.name != squad.target)
	{
	    var exitDir = Game.map.findExit(creep.room, squad.target);
	    var exit = creep.pos.findClosestByRange(exitDir);
	    creep.moveTo(exit);
	    return true;
	}	
	return false;
    }
}
