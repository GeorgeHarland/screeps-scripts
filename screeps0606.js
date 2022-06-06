module.exports.loop = function () {
    console.log("-----------(New Tick)-----------")
    
    const DG_LIMIT = 30
    const FIGHTER_LIMIT = 10
    let creepCount = Object.keys(Game.creeps).length
    console.log(creepCount)
    
    // Spawn Creeps
    if( (Game.spawns['FirstAttempt'].store.getUsedCapacity(RESOURCE_ENERGY) >= 300) && (creepCount < DG_LIMIT) ) {
        let creepName = 'DG-' + ( creepCount + 1 )
        Game.spawns['FirstAttempt'].spawnCreep( [WORK, WORK, CARRY, MOVE], creepName )
        console.log('New creep: ' + creepName)
    }
    
    // Creep Loop
    for(let i in Game.creeps) {
        let currentCreep = Game.creeps[i]
        
        // Harvest or return to base
        if(currentCreep.store[RESOURCE_ENERGY] < currentCreep.store.getCapacity()) {
            let target = currentCreep.pos.findClosestByPath(FIND_SOURCES)
            currentCreep.moveTo(target)
            currentCreep.harvest(target)
        } else {
            let target = currentCreep.pos.findClosestByPath(FIND_MY_SPAWNS)
            currentCreep.moveTo(target)
        }
        
        // Upgrade controller when at the chosen creep limit
        if( (creepCount >= DG_LIMIT) && (currentCreep.store[RESOURCE_ENERGY] >= 0) ){
            let target = currentCreep.room.controller
            if(currentCreep.pos.getRangeTo(target) <= 3) {
                 currentCreep.upgradeController(target)
            } else {
                currentCreep.moveTo(target)
            }
        }
        
        // Transfer to spawn
        let target = currentCreep.pos.findClosestByPath(FIND_MY_SPAWNS)
        if( (currentCreep.pos.getRangeTo(target) == 1) && (currentCreep.store[RESOURCE_ENERGY] > 0) ){
            currentCreep.transfer(target, RESOURCE_ENERGY)
        }
    }
    
    // Logging
    console.log("Number of gatherers: " + creepCount)
}






