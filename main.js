var roomController = require('controller.room');
var buildController = require('controller.build');
var creepController = require('controller.creep');
var spawnController = require('controller.spawn');
var towerController = require('controller.tower');
var troopController = require('controller.troop');

module.exports.loop = function () {

    // 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
    
    if(Game.time % 3 == 0)
    {
	console.log('RoomController - set Phase');
	roomController.setCurrentPhase();
    }

    if(Game.time % 5 == 0)
    {	
	roomController.dispatchRenew();
    }

    if(Game.time % 13 == 0)
    {
	console.log('RoomController - build');
	roomController.createConstructionSites();
    }

    if(Game.time % 19 == 0)
    {
	console.log('SpawnController - spawn');
	spawnController.spawnCreeps();
    }
    
    spawnController.renewCreepsInRange();
    
    creepController.run();

    towerController.run();
    
    if(Game.time % 47 == 0)
    {
	console.log('TroopController - spawn');
	troopController.spawnTroops();
    }

    if(Game.time % 53 == 0)
    {
	console.log('BuildController - Plan Roads');
	buildController.planRoads();
    }

    if(Game.time % 59 == 0)
    {
	console.log('BuildController - Plan Near Spawn');
	buildController.planNearSpawn();
    }

    if(Game.time % 97 == 0)
    {
	console.log('SpawnController - remove dead');
	spawnController.removeDead();
    }

}
