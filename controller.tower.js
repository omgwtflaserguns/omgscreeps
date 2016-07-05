
var _ = require('lodash');


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

    return false;
}

function maintainStructures(tower){

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
		      
		      
    
    
