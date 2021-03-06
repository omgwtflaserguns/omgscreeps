
var _ = require('lodash');

function removeFlagsByColor(room, color) {
    var flags = room.find(FIND_FLAGS, { filter: (flag) => flag.color == color });
    if (flags) {
        for (var id in flags) {
            var flag = flags[id];
            flag.remove();
        }
    }
}

function planRoadsBetween(room, posA, posB) {
    var path = posA.findPathTo(posB, { ignoreCreeps: true });
    var q = [];
    for (var i = 0; i < path.length; i++) {
        var line = path[i];
        //room.getPositionAt(line.x, line.y).createFlag(undefined, COLOR_GREY);
        q.push({ x: line.x, y: line.y });
    }
    return q;
}

function planRoads(room) {

    //removeFlagsByColor(room, COLOR_GREY);

    var spawns = room.find(FIND_MY_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_SPAWN });
    var sources = room.find(FIND_SOURCES);
    var controller = room.controller;

    var roadQ = [];
   
    for (var spawnId in spawns) {
        var spawn = spawns[spawnId];

	roadQ.push({ x: spawn.pos.x - 1, y: spawn.pos.y });
	roadQ.push({ x: spawn.pos.x + 1, y: spawn.pos.y });
	roadQ.push({ x: spawn.pos.x, y: spawn.pos.y - 1 });
	roadQ.push({ x: spawn.pos.x, y: spawn.pos.y + 1 });

	for (var sourceId in sources) {
            var source = sources[sourceId];

            roadQ = roadQ.concat(planRoadsBetween(room, spawn.pos, source.pos));
	}

	if(Memory.ctrl && Memory.ctrl.remote_sources)
	{
	    remoteSources = Memory.ctrl.remote_sources[room.name];

	    if(remoteSources)
	    {
		_.forEach(remoteSources, (remoteSource) => {
		    
		    var exitDir = Game.map.findExit(spawn.room, remoteSource.room);
		    var exit = spawn.pos.findClosestByRange(exitDir);
		    roadQ = roadQ.concat(planRoadsBetween(room, spawn.pos, exit));
		});
	    }	    
	}
	
        roadQ = roadQ.concat(planRoadsBetween(room, spawn.pos, controller.pos));
    }

    if (!room.memory.build) {
        room.memory.build = {};
    }
    room.memory.build.roadQ = roadQ;
}

function planNearSpawn(room) {

    removeFlagsByColor(room, COLOR_BLUE);

    var spawn = room.find(FIND_MY_SPAWNS)[0];

    if(!spawn)
    {
	return;
    }
    
    var nearSpawnQ = [];

    var distance = 1;
    var done = 0;
    while (nearSpawnQ.length < 15) {
        var top = spawn.pos.y - distance;
        var left = spawn.pos.x - distance;
        var bottom = spawn.pos.y + distance;
        var right = spawn.pos.x + distance;

        var coords = room.lookAtArea(top, left, bottom, right);

        for (var x = left + 1; x < right; x++) {

	    if((x < 0 && x > done * -1) || (x > 0 && x < done)){
		continue;
	    }
	    
            for (var y = top + 1; y < bottom; y++) {

		if((y < 0 && y > done * -1) || (y > 0 && y < done)){
		    continue;
		}

		var above = coords[y - 1][x];
		var beyond = coords[y + 1][x];
		var toLeft = coords[y][x - 1];
		var toRight = coords[y][x + 1];

		if(!isCoordBlocked(above)		   
		   && !isCoordBlocked(beyond)
		   && !isCoordBlocked(toLeft)
		   && !isCoordBlocked(toRight)
		   && !isCoordInQ(x-1, y, nearSpawnQ)
		   && !isCoordInQ(x+1, y, nearSpawnQ)
		   && !isCoordInQ(x, y-1, nearSpawnQ)
		   && !isCoordInQ(x, y+1, nearSpawnQ))
		{
		    nearSpawnQ.push({x: x, y: y});
		    //room.getPositionAt(x, y).createFlag(undefined, COLOR_BLUE);		    
		}
            }
        }
	done = distance;
	distance = distance + 2;    
    }

    
    if (!room.memory.build) {
        room.memory.build = {};
    }    
    room.memory.build.nearSpawnQ = nearSpawnQ;
}

function planWall(room){
    
}

function isCoordInQ(x, y, q){
    for (var i = 0; i < q.length; i++)
    {
	if(q[i].x == x && q[i].y == y)
	{
	    return true;
	}
    }
    return false;
}

function isCoordBlocked(coord) {
    coord.forEach(function (obj) {
        if (obj.type == LOOK_STRUCTURES
	|| obj.type == LOOK_FLAGS
        || obj.type == LOOK_CONSTRUCTION_SITES 
        || (obj.type == LOOK_TERRAIN && obj.terrain == TERRAIN_MASK_WALL))
        {
            return true;
        }
    });
    return false;
}

module.exports = {
    planRoads: function(){
	for (var roomId in Game.rooms) {
            var room = Game.rooms[roomId];

	    planRoads(room);	    
        }
    },
    planNearSpawn: function(){
	for (var roomId in Game.rooms) {
            var room = Game.rooms[roomId];

	    planNearSpawn(room);	    
        }
    }
}
