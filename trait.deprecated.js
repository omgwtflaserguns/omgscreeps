
module.exports = {
    deprecated: function (creep) {
        if (creep.memory.deprecated) {
            creep.moveTo(creep.memory.deprecated.pos.x, creep.memory.deprecated.pos.y);
            creep.say('deprecated');
            return true;
        }
        return false;
    }
};