
var _ = require('lodash');
var constants = require('constants');

function attackInvaders(tower){

    var hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    if(hostile)
    {
	tower.attack(hostile);
	return true;
    }
    return false;
}

function healCreeps(tower){

    var healable = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (creep) => creep.hitsMax - creep.hits > constants.heal_treshold});

    if(healable)
    {
	tower.heal(healable);
	return true;
    }
    
    return false;
}

function maintainStructures(tower){

    var repairable = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (struct) => struct.hitsMax - struct.hits > constants.repair_treshold});
   
    if(!repairable)
    {
	repairable = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: (struct) => struct.structureType == STRUCTURE_ROAD && struct.hitsMax - struct.hits > constants.repair_treshold});
    }

    if(repairable)
    {
	tower.repair(repairable);
	return true;
    }
    
    return false;
}

module.exports = {

    run: function(){

	var towers = _.filter(Game.structures, {structureType: STRUCTURE_TOWER});

	towers.forEach(function(tower) {
	    if(!attackInvaders(tower) && !healCreeps(tower))
	    {
		maintainStructures(tower);
	    }	    
	});
    }
}
		      
		      
    
    
