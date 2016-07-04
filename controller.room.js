
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
    if (room.energyCapacityAvailable < 550) {
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
                roads: false
            }
        }
    }
    /* Phase 2 
    Spawner             300
    5x Extension        250
    -----------------------
    Gesamt              550
    */
    else if (room.energyCapacityAvailable < 800) {
        room.memory.phase = {
            id: 2,
            creeps: {
                harvester: {
                    perSource: false,
                    count: 1,
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
                    count: 2,
                    modules: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                    memory: {}
                },
                builder: {
                    perSource: true,
                    count: 1,
                    modules: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
                    memory: {}
                }
            },
            build: {
                roads: true
            }
        }
    }
    /* Phase 3 
    Spawner             300
    10x Extension       500
    -----------------------
    Gesamt              800
    */
    else if (room.energyCapacityAvailable < 1300) {
        room.memory.phase = {
            id: 3,
            creeps: {
                harvester: {
                    perSource: false,
                    count: 1,
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
                    count: 2,
                    modules: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,  MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    memory: {}
                },
                builder: {
                    perSource: true,
                    count: 1,
                    modules: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                    memory: {}
                }
            },
            build: {
                roads: true
            }
        }
	/* Phase 4
	Spawner             300
	20x Extension      1000
	-----------------------
	Gesamt             1300
	*/
	else if (room.energyCapacityAvailable < 1800) {
        room.memory.phase = {
            id: 3,
            creeps: {
                harvester: {
                    perSource: false,
                    count: 1,
                    modules: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    memory: {}
                },
                miner: {
                    perSource: true,
                    count: 2,
                    modules: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    memory: {}
                },
                carrier: {
                    perSource: true,
                    count: 2,
                    modules: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    memory: {}
                },
                builder: {
                    perSource: true,
                    count: 1,
                    modules: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARREY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                    memory: {}
                }
            },
            build: {
                roads: true
            }
        }
	/* Phase 5
	Spawner             300
	30x Extension      1500
	-----------------------
	Gesamt             1800
	*/
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
