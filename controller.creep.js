var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleBuilder = require('role.builder');
var roleMelee = require('role.melee');

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

module.exports = {
    run: function () {

	for (var name in Game.creeps) {
            var creep = Game.creeps[name];
	    
            moveInHomelessCreep(creep);
            executeRole(creep);
        }
    }
};
