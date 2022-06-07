module.exports.loop = function () {
    console.log("-----------(New Tick)-----------")
    
    const G_LIMIT = 35
    const FIGHTER_LIMIT = 45
    let creepCount = Object.keys(Game.creeps).length
    let nameRng = Math.floor(Math.random() * 100001)
    
    // Spawn Creeps
    if( (Game.spawns['FirstAttempt'].store.getUsedCapacity(RESOURCE_ENERGY) >= 300) && (creepCount < G_LIMIT) ) {
        let creepName = 'WWCM-' + nameRng
        Game.spawns['FirstAttempt'].spawnCreep( [WORK, WORK, CARRY, MOVE], creepName )
        console.log('New gatherer: ' + creepName)
    } else if( (Game.spawns['FirstAttempt'].store.getUsedCapacity(RESOURCE_ENERGY) >= 270) && (creepCount < FIGHTER_LIMIT) ) {
        let creepName = 'AAMMT-' + nameRng
        Game.spawns['FirstAttempt'].spawnCreep( [ATTACK, ATTACK, MOVE, MOVE, TOUGH], creepName )
        console.log('New fighter: ' + creepName)
    }
    
    // Creep Loop
    for(let i in Game.creeps) {
        let currentCreep = Game.creeps[i]
        
        // Handle Fighters
        if ( currentCreep.body[0].type == 'attack' ) {
            currentCreep.moveTo(42, 4)
        }
    
        // Handle Gatherers
        if ( currentCreep.body[0].type == 'work' ) {

            if(currentCreep.store[RESOURCE_ENERGY] < currentCreep.store.getCapacity()) {
                let target = currentCreep.pos.findClosestByPath(FIND_SOURCES)
                currentCreep.moveTo(target)
                currentCreep.harvest(target)
            } else {
                let target = currentCreep.pos.findClosestByPath(FIND_MY_SPAWNS)
                currentCreep.moveTo(target)
            }
            
            // Upgrade controller when at the chosen creep limit
            if( (creepCount >= G_LIMIT) && (currentCreep.store[RESOURCE_ENERGY] >= 0) ){
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
    }
    
    // Logging
    console.log("Number of creeps: " + creepCount)
}






