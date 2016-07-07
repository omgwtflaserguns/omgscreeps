
var _ = require('lodash');
var constants = require('constants');

module.exports = {
    formSquads: function(){
	
	var squads = {};
	var squadless = [];
	var troops = [];

	if(Memory.squads)
	{
	    squads = Memory.squads;
	}
		
	for(var name in Game.creeps)
	{
	    var creep = Game.creeps[name];
	    if(creep.memory.role == 'melee'){
		troops.push(creep);
	    }	    
	}

	_.forEach(troops, function(creep){
	    
	    if(!creep.memory.squad)
	    {
		squadless.push(creep);
	    }
	    else
	    {
		var squad = creep.memory.squad;
		if(!squads[squad])
		{
		    squads[squad] = { name: squad, creeps: []};
		}
		if(squads[squad].creeps.indexOf(creep.name) == -1)
		{
		    squads[squad].creeps.push(creep.name);
		}
	    }
	});
    
	while(squadless.length > 0)
	{
	    _.forEach(squads, function(squad){
		while(squad.creeps.length < constants.squads.melee && squadless.length > 0)
		{
		    squad.creeps.push(squadless.splice(0,1)[0].name);
		}
	    });
	    
	    if(squadless.length > 0)
	    {
		var squadname = 'Squad-' + (_.size(squads) + 1);
		squads[squadname] = {name: squadname, creeps: []};
		console.log(squadname + ' created');
	    }
	}

	_.forEach(squads, function(squad){

	    var toRemove = [];
	    
	    _.forEach(squad.creeps, function(name){
		
		var creep = Game.creeps[name];

		if(!creep)
		{
		    console.log(squad.name + ' farewells ' + name);
		    toRemove.push(name);
		}
		else if(creep.memory.squad != squad.name)
		{
		    console.log(name + ' is now proud member of ' + squad.name);
		    creep.memory.squad = squad.name;
		}		
	    });

	    squad.creeps = _.filter(squad.creeps, (n) => toRemove.indexOf(n) == -1);
	});

	Memory.squads = squads;
    }
}
