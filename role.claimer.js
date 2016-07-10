
module.exports = {

    run: function(creep){

	targetRoom = creep.memory.room;
		
	if(!targetRoom)
	{
	    creep.say('No Room');
	    return;
	}

	if(creep.room.name != targetRoom)
	{
	    var exitDir = Game.map.findExit(creep.room, targetRoom);
	    var exit = creep.pos.findClosestByRange(exitDir);
	    creep.moveTo(exit);
	}

	claim = creep.memory.claim;

	if(claim && claim == true)
	{
	    if(creep.room.controller) {
		if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
		    creep.moveTo(creep.room.controller);
		}
	    }
	}
    }
}
