// Set roles
var roleGatherer = require('role.gatherer')
var roleBuilder = require('role.builder')
var roleFighter = require('role.fighter')

module.exports.loop = function () {


    // create creeps

    // con sites

    // Creep loop
    // for ...
    if (creep.memory.role == 'gatherer') {
        // gatherer: harvest, deposit, (upgrade currently)
        roleGatherer.run(creep)
    } else if (creep.memory.role == 'builder') {
        // builder: harvest, build, upgrade (all gatherer + build currently)
        roleBuilder.run(creep)
    } else if (creep.memory.role == 'fighter') {
        // fighter: idle, seek and attack (maybe change to tiny capacity to work a bit)
        roleFighter.run(creep)
    }
    
    // console logging
};
