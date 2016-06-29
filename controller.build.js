
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
        room.getPositionAt(line.x, line.y).createFlag(undefined, COLOR_GREY);
        q.push({ x: line.x, y: line.y });
    }
    return q;
}

function planRoads(room) {

    removeFlagsByColor(room, COLOR_GREY);

    var spawns = room.find(FIND_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_SPAWN });
    var sources = room.find(FIND_SOURCES);
    var controller = room.controller;

    var roadQ = [];

    for (var spawnId in spawns) {
        var spawn = spawns[spawnId];
        for (var sourceId in sources) {
            var source = sources[sourceId];

            roadQ.concat(planRoadsBetween(room, spawn.pos, source.pos));
        }
        roadQ.concat(planRoadsBetween(room, spawn.pos, controller.pos));
    }

    if (!room.memory.build) {
        room.memory.build = {};
    }
    room.memory.build.roadQ = roadQ;
}

function planExtensions(room) {

    removeFlagsByColor(room, COLOR_BLUE);

    var spawn = room.find(FIND_MY_SPAWNS)[0];
    var extensionQ = [];

    var distance = 1;
    while (extensionQ.length < room.memory.phase.build.extensionCount) {
        var top = spawn.pos.y - distance;
        var left = spawn.pos.x - distance;
        var bottom = spawn.pos.y + distance;
        var right = spawn.pos.x + distance;

        var coords = room.lookAtArea(top, left, bottom, right);

        for (var x = left + 1; x < right; x++) {
            for (var y = top + 1; y < bottom; y++) {

                var above = coors[y - 1][x];
                
                // TODO check if blocked
                // TODO check if used before in this loop
            }
        }

        distance++;

        if (lookObject.type == LOOK_CREEPS && lookObject[LOOK_CREEPS].getActiveBodyparts(ATTACK) == 0) {
            creep.moveTo(lookObject.creep);
        }
    }

    //room.getPositionAt(line.x, line.y).createFlag(undefined, COLOR_BLUE);

    if (!room.memory.build) {
        room.memory.build = {};
    }
    room.memory.build.extensionQ = extensionQ;
}

function isCoordBlocked(coord) {
    coord.forEach(function (obj) {
        if (obj.type == LOOK_STRUCTURE 
        || obj.type == LOOK_CONSTRUCTION_SITES 
        || (obj.type == LOOK_TERRAIN && obj.terrain == TERRAIN_MASK_WALL)
        {
            return true;
        }
    });
    return false;
}

module.exports = {
    run: function () {

        var flagCount = 0;

        for (var roomId in Game.rooms) {
            var room = Game.rooms[roomId];

            planRoads(room);
        }
    }
}