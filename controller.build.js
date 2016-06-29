
function removeFlagsByColor(room, color) {
    var flags = room.find(FIND_FLAGS, { filter: (flag) => flag.color == color });
    if (flags) {
        for (var id in flags) {
            var flag = flags[id];
            flag.remove();
        }
    }
}

function planRoads(room) {

    removeFlagsByColor(room, COLOR_GREY);

    var spawns = room.find(FIND_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_SPAWN });
    var sources = room.find(FIND_SOURCES);

    var roadQ = [];

    for (var spawnId in spawns) {
        var spawn = spawns[spawnId];
        for (var sourceId in sources) {
            var source = sources[sourceId];

            var path = spawn.pos.findPathTo(source, { ignoreCreeps: true });


            for (var i = 0; i < path.length; i++) {
                var line = path[i];
                room.getPositionAt(line.x, line.y).createFlag(undefined, COLOR_GREY);                
                 
                roadQ.push({ x: line.x, y: line.y });
            }
        }
    }

    if (!room.memory.build) {
        room.memory.build = {};
    }
    room.memory.build.roadQ = roadQ;
}

function planExtensions(room) {

    removeFlagsByColor(room, COLOR_BLUE);
    
    var sources = room.find(FIND_SOURCES);

    var extensionQ = [];

    for (var sourceId in sources) {
        var source = sources[sourceId];

        
        //room.getPositionAt(line.x, line.y).createFlag(undefined, COLOR_BLUE);
        
    }

    if (!room.memory.build) {
        room.memory.build = {};
    }
    room.memory.build.extensionQ = extensionQ;
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