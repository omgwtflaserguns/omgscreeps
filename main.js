var roomController = require('controller.room');
var buildController = require('controller.build');
var creepController = require('controller.creep');
var spawnController = require('controller.spawn');
var towerController = require('controller.tower');
var squadController = require('controller.squads');

module.exports.loop = function () {

    // 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97


    if(!Memory.ctrl)
    {
	Memory.ctrl = {
	    remote_sources: {}
	};
    }
    
    if(Game.time % 3 == 0)
    {
	roomController.setCurrentPhase();
    }
    
    if(Game.time % 5 == 0)
    {	
	spawnController.dispatchRenew();
    }

    if(Game.time % 13 == 0)
    {
	roomController.createConstructionSites();
    }

    if(Game.time % 7 == 0)
    {
	spawnController.spawnCreeps();
    }

    if(Game.time % 11 == 0)
    {
	squadController.formSquads();
    }
    
    spawnController.renewCreepsInRange();
    
    creepController.run();

    towerController.run();

    if(Game.time % 4 == 0)
    {
	buildController.planRoads();
    }

    if(Game.time % 59 == 0)
    {
	buildController.planNearSpawn();
    }

    if(Game.time % 97 == 0)
    {
	spawnController.removeDead();
    }   
}
