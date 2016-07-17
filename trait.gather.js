function setTarget(creep) {

    var rooms = [creep.memory.home];

    if(Memory.ctrl && Memory.ctrl.remote_sources)
    {	
	remoteSources = Memory.ctrl.remote_sources[creep.memory.home];

	if(remoteSources)
	{
	    _.forEach(remoteSources, (remoteSource) => {		   		

		if(!rooms.includes(remoteSource.room))
		{
		    rooms.push(remoteSource.room);
		}
	    });
	}	    
    }    

    var srcCount = new Array();    
    _.forEach(rooms, (name) => {
	var room = Game.rooms[name];
	if(!room)
	{
	    return;
	}
	var sources = room.find(FIND_DROPPED_RESOURCES, { filter: (res) => { return res.resourceType == RESOURCE_ENERGY} });

	if(sources)
	{
	    _.forEach(sources, (source) =>{
		srcCount[source.id] = {room: name, id: source.id, count: 0}
	    });
	}

    });
    
    for (var name in Game.creeps) {
        var current = Game.creeps[name];
        if (current.memory.gatherTarget) {
            if (current.memory.gatherTarget in srcCount) {
                srcCount[current.memory.gatherTarget].count = srcCount[current.memory.gatherTarget].count + 1;
            }
        }
    }

    var min = 10000;
    var minSrc = undefined;
    
    for (var id in srcCount) {
        var src = srcCount[id];

        if (src.count < min) {
            minSrc = src;
            min = src.count;
        }
    }

    if (minSrc) {
        creep.memory.gatherTarget = minSrc.id;
	creep.memory.gatherTargetRoom = minSrc.room;
	return true;
    }
    return false;
}

function gather(creep, target){
    var result = creep.pickup(target);

    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
        return true;
    }    
    else if (result == OK)
    {
        return true;
    }
    else if (result != ERR_BUSY) {
        console.log(creep.name + ' error mining: ' + result);
        return false;
    } 
}

module.exports = {

    gather: function (creep) {
        if (creep.carry.energy == creep.carryCapacity || (!creep.memory.mining && creep.carry.energy != 0)) {
            creep.memory.gathering = false;
            creep.memory.gatherTarget = undefined;
            
            return false;
        }

        if (!creep.memory.gathering) {
            creep.memory.gathering = true;
        }

        if (!creep.memory.gatherTarget || !creep.memory.gatherTargetRoom) {
            if(!setTarget(creep))
            {
                creep.memory.gathering = false;                
                return false;
            }
        }

	if(creep.room.name != creep.memory.gatherTargetRoom){	    
	    var exitDir = Game.map.findExit(creep.room, creep.memory.gatherTargetRoom);
	    var exit = creep.pos.findClosestByRange(exitDir);
	    creep.moveTo(exit);
	    return true;
	}

        var target = Game.getObjectById(creep.memory.gatherTarget);        

        if (!target) {
            creep.memory.gatherTarget = undefined;
            return true;
        }

        var gathering = gather(creep, target);

        creep.memory.gathering = gathering;
                
        return gathering; 
    }
};
