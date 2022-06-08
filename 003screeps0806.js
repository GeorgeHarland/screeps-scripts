module.exports.loop = function () {
    console.log("-----------(New Tick)-----------")
    
    const G_LIMIT = 40
    const FIGHTER_LIMIT = 5
    const BUILDER_LIMIT = 1
    let harvestLimit = G_LIMIT - 10
    let creepCount = Object.keys(Game.creeps).length
    let gathererCount = 0
    let fighterCount = 0
    let buildercount = 0
    
    // counting creeps of each type
    for (let i in Game.creeps) {
        let thisCreep = Game.creeps[i]
        if (thisCreep.body[0].type == 'attack') {
            fighterCount += 1
        }
        if (thisCreep.body[0].type == 'work') {
            gathererCount += 1
        }
        if (thisCreep.body[0].type == 'carry') {
            builderCount += 1
        }
    }
    
    let nameRng = Math.floor(Math.random() * 100001)
    
    // Spawn Creeps
    if( (Game.spawns['FirstAttempt'].store.getUsedCapacity(RESOURCE_ENERGY) >= 300) && (gathererCount < G_LIMIT) ) {
        let creepName = 'Gatherer-' + nameRng
        Game.spawns['FirstAttempt'].spawnCreep( [WORK, WORK, CARRY, MOVE], creepName )
        console.log('New gatherer: ' + creepName)
    } else if( (Game.spawns['FirstAttempt'].store.getUsedCapacity(RESOURCE_ENERGY) >= 300) && (builderCount < BUILDER_LIMIT) ) {
        let creepName = 'Builder-' + nameRng
        Game.spawns['FirstAttempt'].spawnCreep( [CARRY, CARRY, WORK, MOVE, MOVE], creepName )
        console.log('New builder: ' + creepName)
    } else if( (Game.spawns['FirstAttempt'].store.getUsedCapacity(RESOURCE_ENERGY) >= 300) && (fighterCount < FIGHTER_LIMIT) ) {
        let creepName = 'Fighter-' + nameRng
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
        
        // Handle Builders
        if ( currentCreep.body[0].type == 'carry') {
            currentCreep.moveTo(27, 3)
        }
    
        // Handle Gatherers
        if ( currentCreep.body[0].type == 'work' ) {
            
            // Go to harvest energy or return to spawn
            if(currentCreep.store[RESOURCE_ENERGY] < currentCreep.store.getCapacity()) {
                let target = currentCreep.pos.findClosestByPath(FIND_SOURCES)
                currentCreep.moveTo(target)
                currentCreep.harvest(target)
            } else {
                let target = currentCreep.pos.findClosestByPath(FIND_MY_SPAWNS)
                currentCreep.moveTo(target)
            }
            
            // Upgrade controller instead when at the chosen gatherer count (harvestLimit)
            if( (gathererCount >= harvestLimit) && (currentCreep.store[RESOURCE_ENERGY] >= 0) ){
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
    console.log('Gatherers: ' + gathererCount)
    console.log('Fighters: ' + fighterCount)
    console.log("Total creeps: " + creepCount)
}
