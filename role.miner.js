var traitRenew = require('trait.renew');
var traitDeprecated = require('trait.deprecated');
var traitMine = require('trait.mine');

module.exports = {    
    run: function (creep) {
        if (!traitDeprecated.deprecated(creep) && !traitRenew.renew(creep)) {
            traitMine.mineToFloor(creep);
        }
    }
};


