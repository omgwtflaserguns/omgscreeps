
var constants = require('constants');


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
		    modules: [
			{ module: WORK, count: 2},  // 200
			{ module: CARRY, count: 1}, //  50
			{ module: MOVE, count: 1}   //  50			
		    ],
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
                    modules: [
			{ module: WORK, count: 3},  // 300
			{ module: CARRY, count: 2}, // 100
			{ module: MOVE, count: 3}   // 150			
		    ],
		    memory: {}
                },
                miner: {
                    perSource: true,
                    count: 2,
		    modules: [
			{ module: WORK, count: 5},  // 500
			{ module: MOVE, count: 1}   //  50			
		    ],
                    memory: {}
                },
                carrier: {
                    perSource: true,
                    count: 3,
		    modules: [
			{ module: CARRY, count: 6}, // 300
			{ module: MOVE, count: 5}   // 250			
		    ],
                    memory: {}
                },
                builder: {
                    perSource: false,
                    count: 3,
		    modules: [
			{ module: WORK, count: 4},  // 400
			{ module: CARRY, count: 2}, // 100
			{ module: MOVE, count: 1}   //  50			
		    ],
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
		    modules: [
			{ module: WORK, count: 4},  // 400
			{ module: CARRY, count: 4}, // 200
			{ module: MOVE, count: 4}   // 200			
		    ],
                    memory: {}
                },
                miner: {
                    perSource: true,
                    count: 2,
		    modules: [
			{ module: WORK, count: 7},  // 700
			{ module: MOVE, count: 2}   // 100			
		    ],
                    memory: {}
                },
                carrier: {
                    perSource: true,
                    count: 3,
		    modules: [
			{ module: CARRY, count: 8}, // 400
			{ module: MOVE, count: 8}   // 400			
		    ],
                    memory: {}
                },
                builder: {
                    perSource: false,
                    count: 3,
		    modules: [
			{ module: WORK, count: 5},  // 500
			{ module: CARRY, count: 3}, // 150
			{ module: MOVE, count: 3}   // 150			
		    ],
                    memory: {}
                }
            },
            build: {
                roads: true
            }
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
            id: 4,
            creeps: {
                harvester: {
                    perSource: false,
                    count: 1,
                    modules: [
			{ module: WORK, count: 6},  // 600
			{ module: CARRY, count: 7}, // 350
			{ module: MOVE, count: 7}   // 350			
		    ],
                    memory: {}
                },
                miner: {
                    perSource: true,
                    count: 2,
		    modules: [
			{ module: WORK, count: 10},  // 1000
			{ module: MOVE, count: 6}    //  300			
		    ],
                    memory: {}
                },
                carrier: {
                    perSource: true,
                    count: 3,
		    modules: [
			{ module: CARRY, count: 13}, // 650
			{ module: MOVE, count: 13}   // 650			
		    ],
                    memory: {}
                },
                builder: {
                    perSource: false,
                    count: 3,
		    modules: [
			{ module: WORK, count: 8},  // 800
			{ module: CARRY, count: 5}, // 250
			{ module: MOVE, count: 5}   // 250			
		    ],
                    memory: {}
                },
		melee:{
		    perSource: false,
		    count: 3,
		    modules: [
			{ module: ATTACK, count: 10},  // 800
			{ module: MOVE, count: 10}     // 500			
		    ],
		    modules: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
		    memory: {}
		}
            },
            build: {
                roads: true
            }
        }
    }
    /* Phase 5
    Spawner             300
    30x Extension      1500
    -----------------------
    Gesamt             1800
    */
    else {
	room.memory.phase = {
            id: 5,
            creeps: {
                harvester: {
                    perSource: false,
                    count: 1,
                    modules: [
			{ module: WORK, count: 6},   // 600
			{ module: CARRY, count: 12}, // 600
			{ module: MOVE, count: 12}   // 600			
		    ],
                    memory: {}
                },
                miner: {
                    perSource: true,
                    count: 2,
		    modules: [
			{ module: WORK, count: 12},  // 1200
			{ module: MOVE, count: 12}   //  600			
		    ],
                    memory: {}
                },
                carrier: {
                    perSource: true,
                    count: 3,
		    modules: [
			{ module: CARRY, count: 18}, // 900
			{ module: MOVE, count: 18}   // 900			
		    ],
                    memory: {}
                },
                builder: {
                    perSource: false,
                    count: 3,
		    modules: [
			{ module: WORK, count: 8},   // 800
			{ module: CARRY, count: 10}, // 500
			{ module: MOVE, count: 10}   // 500			
		    ],
                    memory: {}
                },
		melee:{
		    perSource: false,
		    count: 3,
		    modules: [
			{ module: ATTACK, count: 15},  // 1200
			{ module: MOVE, count: 12}     //  600			
		    ],
		    memory: {}
		}
            },
            build: {
                roads: true
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
        var next = q[0];        
        var pos = room.getPositionAt(next.x, next.y);
        var result = room.createConstructionSite(pos, structure)
	
	if(result == ERR_RCL_NOT_ENOUGH)
	{
	    return false;
	}

	q.splice(0,1);
	
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

    var building = buildFromQ(room, room.memory.build.nearSpawnQ, STRUCTURE_TOWER);

    if(!building)
    {
        building = buildFromQ(room, room.memory.build.nearSpawnQ, STRUCTURE_EXTENSION);
    }

    if(!building && room.memory.phase.build.roads === true)
    {
        building = buildFromQ(room, room.memory.build.roadQ, STRUCTURE_ROAD);
    }
}

function dispatchRenew(room)
{
    if(!room.memory.renewQ)
    {
	return;
    }

    // TODO: Rooms without spawns
    			    
    while(room.memory.renewQ.length > 0)
    {
	var next = Game.getObjectById(room.memory.renewQ[0]);
	
	if(!next
	   || next.ticksToLive >= constants.renew.upper_bound
	   || next.memory.deprecated)
	{
	    room.memory.renewQ.splice(0, 1);

	    if(next)
	    {
		next.memory.renew = undefined;
	    }
	    
	    continue;
	}

	if(next.memory.renew)
	{
	    return;
	}	 
	
	next.memory.renew = next.pos.findClosestByRange(room.find(FIND_MY_SPAWNS)).id;
	console.log(next.name + ' is now allowed to renew itself');
	return;
    }
}
    
module.exports = {

    setCurrentPhase: function (){
	for (var name in Game.rooms) {
            var room = Game.rooms[name];
            
	    setCurrentPhase(room);
        }
    },
    dispatchRenew: function (){
	for (var name in Game.rooms) {
            var room = Game.rooms[name];
            
	    dispatchRenew(room);
        }
    },
    createConstructionSites: function (){
	for (var name in Game.rooms) {
            var room = Game.rooms[name];
            
	    createConstructionSites(room);
        }
    }
};
