
function setCurrentPhase(room) {

    var oldPhase = undefined;
    if(room.memory.phase)
    {
	oldPhase = room.memory.phase.id;
    }

    /* Phase 1 
    Spawner             300
    -----------------------
    Gesamt              300
    */
    if (room.energyCapacityAvailable <= 300) {
        room.memory.phase = {
            id: 1,
            creeps: {
                harvester: {
                    perSource: false,
                    count: 10,
                    modules: [WORK, WORK, CARRY, MOVE],
                    memory: {}
                },
                miner: {
                    perSource: false,
                    count: 0,
                    modules: [],
                    memory: {}
                },
                carrier: {
                    perSource: false,
                    count: 0,
                    modules: [],
                    memory: {}
                },
                builder: {
                    perSource: false,
                    count: 0,
                    modules: [],
                    memory: {}
                }
            },
            build: {
                roads: false,
                extensionCount: 0
            }
        }
    }
    /* Phase 2 
    Spawner             300
    5x Extension        250
    -----------------------
    Gesamt              550
    */
    else if (room.energyCapacityAvailable <= 550) {
        room.memory.phase = {
            id: 2,
            creeps: {
                harvester: {
                    perSource: false,
                    count: 2,
                    modules: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
                    memory: {}
                },
                miner: {
                    perSource: true,
                    count: 2,
                    modules: [WORK, WORK, WORK, WORK, WORK, MOVE],
                    memory: {}
                },
                carrier: {
                    perSource: true,
                    count: 3,
                    modules: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                    memory: {}
                },
                builder: {
                    perSource: true,
                    count: 2,
                    modules: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
                    memory: {}
                }
            },
            build: {
                roads: true,
                extensionCount: 5
            }
        }
    }
    /* Phase 3 
    Spawner             300
    10x Extension       500
    -----------------------
    Gesamt              800
    */
    else if (room.energyCapacityAvailable <= 800) {
        room.memory.phase = {
            id: 3,
            creeps: {
                harvester: {
                    perSource: false,
                    count: 2,
                    modules: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                    memory: {}
                },
                miner: {
                    perSource: true,
                    count: 2,
                    modules: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
                    memory: {}
                },
                carrier: {
                    perSource: true,
                    count: 4,
                    modules: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,  MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    memory: {}
                },
                builder: {
                    perSource: true,
                    count: 2,
                    modules: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                    memory: {}
                }
            },
            build: {
                roads: true,
                extensionCount: 10
            }
        }
    }

    if(oldPhase && oldPhase != room.memory.phase.id)
    {
	Game.notify("Phase Change in room " + room.name + " " + oldPhase + " -> " + room.memory.phase.id);
    }
}

function buildFromQ(room, q, structure)
{
    if(!q)
    {
        return false;
    }
    
    while(q.length > 0)
    {
        var next = q.splice(0, 1)[0];        
        var pos = room.getPositionAt(next.x, next.y);
        var result = room.createConstructionSite(pos, structure)
        if (result == OK)
        {            
            return true;
        }        
    }
    return false;
}

function createConstructionSites(room) {

    if(!room.memory.build)
    {
        return;
    }

    var sites = room.find(FIND_CONSTRUCTION_SITES)    
    if(sites.length > 0)
    {
        return;
    }

    var building = buildFromQ(room, room.memory.build.extensionQ, STRUCTURE_EXTENSION);

    if(!building && room.memory.phase.build.roads === true)
    {
        building = buildFromQ(room, room.memory.build.roadQ, STRUCTURE_ROAD);
    }    
}

module.exports = {
    run: function () {

        for (var name in Game.rooms) {
            var room = Game.rooms[name];

            setCurrentPhase(room);

            createConstructionSites(room);
        }
    }
};
