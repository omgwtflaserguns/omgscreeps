var roomController = require('controller.room');
var buildController = require('controller.build');
var creepController = require('controller.creep');
var spawnController = require('controller.spawn');

module.exports.loop = function () {

    roomController.run();

    spawnController.run();

    creepController.run();

    buildController.run();
}
