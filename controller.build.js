
module.exports = {
    planRoads: function () {
        var flagCount = 0;
        for (var roomId in Game.rooms) {
            var room = Game.rooms[roomId];

            var flags = room.find(FIND_FLAGS);
            if (flags) {
                for (var id in flags) {
                    var flag = flags[id];
                    flag.remove();
                }
            }

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
                        room.getPositionAt(line.x, line.y).createFlag(flagCount + "_Road", COLOR_GREY);
                        flagCount = flagCount + 1;                       

                        roadQ.push({x: line.x, y: line.y});
                    }
                }
            }

            if(!room.memory.build)
            {
                room.memory.build = {};
            }
            room.memory.build.roadQ = roadQ;
        }
    }    
}