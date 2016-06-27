
function setCurrentPhase(room)
{
    /* Phase 1 
    Spawner             300
    -----------------------
    Gesamt              300
    */
    if (room.energyCapacityAvailable <= 300) {
        room.memory.phase = {
            id: 1,
            creeps:{
                harvester:{
                    perSource: false,
                    count: 10,
                    modules: [WORK, WORK, CARRY, MOVE]
                },                
                miner: {
                    perSource: false,
                    count: 0,
                    modules: []
                },
                carrier: {
                    perSource: false,
                    count: 0,
                    modules: []
                },
                builder: {
                    perSource: false,
                    count: 0,
                    modules: []
                }
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
            creeps:{
                harvester:{
                    perSource: false,
                    count: 0,
                    modules: []
                },                
                miner: {
                    perSource: true,
                    count: 1,
                    modules: [WORK, WORK, WORK, WORK, WORK, MOVE]
                },
                carrier: {
                    perSource: true,
                    count: 2,
                    modules: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
                },
                builder: {
                    perSource: true,
                    count: 1,
                    modules: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE]
                }
            }     
        }
    }  
    
}

function buildExtensions(room)
{

}

module.exports = {
    run: function(){

        for(var name in Game.rooms)
        {            
            var room = Game.rooms[name];
            
            setCurrentPhase(room);            

            buildExtensions(room);            
        }       
    }
};