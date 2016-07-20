

module.exports = {

    write: function(name, value, type){
	if(!Memory.stats)
	{
	    Memory.stats = {};	    
	}

	Memory.stats[name] = {name: 'screeps.' + name, value: value, type: type};
    }
}
