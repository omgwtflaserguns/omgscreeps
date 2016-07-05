var traitRenew = require('trait.renew');
var traitDeprecated = require('trait.deprecated');
var _ = require('lodash');

module.exports = {

    run: function(creep){

	// TODO Attacking stuff
	
	
	
	traitRenew.renew(creep);
	traitDeprecated.deprecate(creep);
    }    
}
