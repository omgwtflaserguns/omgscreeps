
var roomController = require('controller.room');
var creepController = require('controller.creep');
var spawnController = require('controller.spawn');

module.exports.loop = function () {
    
   roomController.run();

   spawnController.run();

   creepController.run();
}
