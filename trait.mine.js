function setMineTarget(creep) {

    var home = Game.rooms[creep.memory.home];
    var sources = home.find(FIND_SOURCES, { filter: (src) => { return src.energy >= creep.carryCapacity } });
    
    var srcCount = new Array();
    for (var id in sources) {
        var src = sources[id];
        srcCount[src.id] = {room: home.name, id: src.id, count: 0};
    }

    if(Memory.ctrl && Memory.ctrl.remote_sources)
    {	
	remoteSources = Memory.ctrl.remote_sources[home.name];

	if(remoteSources)
	{
	    _.forEach(remoteSources, (remoteSource) => {		   		
		srcCount[remoteSource.id] = {room: remoteSource.room, id: remoteSource.id, count: 0};
	    });
	}	    
    }    
    
    for (var name in Game.creeps) {
        var current = Game.creeps[name];
        if (current.memory.mineTarget) {
            if (current.memory.mineTarget in srcCount) {
                srcCount[current.memory.mineTarget].count = srcCount[current.memory.mineTarget].count + 1;
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
        creep.memory.mineTarget = minSrc.id;
	creep.memory.mineTargetRoom = minSrc.room;	
    }
}

function mine(creep, target){
    var result = creep.harvest(target);

    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
        return true;
    }
    else if (result == ERR_NOT_ENOUGH_RESOURCES) {        
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

    mineToCreep: function (creep) {        
        if (creep.carry.energy == creep.carryCapacity || (!creep.memory.mining && creep.carry.energy != 0)) {
            creep.memory.mining = false;
            creep.memory.mineTarget = undefined;            
            return false;
        }

        if (!creep.memory.mining) {
            creep.memory.mining = true;
        }

        if (!creep.memory.mineTarget || !creep.memory.mineTargetRoom) {
            setMineTarget(creep);
        }

	if(creep.room.name != creep.memory.mineTargetRoom){	    
	    var exitDir = Game.map.findExit(creep.room, creep.memory.mineTargetRoom);
	    var exit = creep.pos.findClosestByRange(exitDir);
	    creep.moveTo(exit);
	    return true;
	}
	
        var target = Game.getObjectById(creep.memory.mineTarget);        

        if (!target) {
            creep.memory.mineTarget = undefined;
            return true;
        }

        var mining = mine(creep, target);

        creep.memory.mining = mining;
                
        return mining;
    },
    mineToFloor: function (creep) {
        if (!creep.memory.mineTarget || !creep.memory.mineTargetRoom) {
            setMineTarget(creep);
        }

	if(creep.room.name != creep.memory.mineTargetRoom){	    
	    var exitDir = Game.map.findExit(creep.room, creep.memory.mineTargetRoom);
	    var exit = creep.pos.findClosestByRange(exitDir);
	    creep.moveTo(exit);
	    return true;
	}
		
        var target = Game.getObjectById(creep.memory.mineTarget);

        if (!target) {
            creep.memory.mineTarget = undefined;
            return true;
        }

        var mining = mine(creep, target);
        creep.memory.mining = mining;

        return mining;                
    }
}
