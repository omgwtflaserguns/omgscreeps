var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleBuilder = require('role.builder');
var roleMelee = require('role.melee');
var statService = require('service.stats');

function executeRole(creep) {
    
    if (creep.memory.role == 'harvester') {
        roleHarvester.run(creep);
    }
    else if (creep.memory.role == 'miner') {
        roleMiner.run(creep);
    }
    else if (creep.memory.role == 'carrier') {
        roleCarrier.run(creep);
    }
    else if (creep.memory.role == 'builder') {
        roleBuilder.run(creep);
    }
    else if (creep.memory.role == 'melee') {
        roleMelee.run(creep);
    }
}

function moveInHomelessCreep(creep) {
    if (!creep.memory.home) {
        creep.memory.home = creep.room.name;
        console.log('Homeless ' + creep.name + ' found his home in ' + creep.room.name);
    }
}

function writeStats(){

    var harvesters = 0;
    var miners = 0;
    var carrier = 0;
    var builder = 0;
    var melee = 0;
    
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

	if (creep.memory.role == 'harvester') {
	    harvesters++;
	}
	else if (creep.memory.role == 'miner') {
	    miners++;
	}
	else if (creep.memory.role == 'carrier') {
	    carrier++;
	}
	else if (creep.memory.role == 'builder') {
	    builder++;
	}
	else if (creep.memory.role == 'melee') {
	    melee++;
	}	
    }

    statService.write('creeps.roles.harvester.count', harvesters, 'g');
    statService.write('creeps.roles.miner.count', miners, 'g');
    statService.write('creeps.roles.carrier.count', carrier, 'g');
    statService.write('creeps.roles.builder.count', builder, 'g');
    statService.write('creeps.roles.melee.count', melee, 'g');	
}

module.exports = {
    run: function () {

	for (var name in Game.creeps) {
            var creep = Game.creeps[name];
	    
            moveInHomelessCreep(creep);
            executeRole(creep);
        }
    },
    writeStats: function(){
	writeStats();
    }
};
