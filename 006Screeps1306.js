module.exports.loop = function () {
    console.log("-----------(New Tick)-----------")
    
    const G_LIMIT = 11
    const FIGHTER_LIMIT = 1 
    const BUILDER_LIMIT = 3
    const CREEP_LIMIT = G_LIMIT + FIGHTER_LIMIT + BUILDER_LIMIT
    let creepCount = Object.keys(Game.creeps).length
    let gathererCount = 0
    let fighterCount = 0
    let builderCount = 0
    
    let coreSpawn = Game.spawns['Karma2']
    let coreRoom = Game.rooms['E5S39']
    let conRoom = Game.rooms.E5S39
    
    // buildings
    const extensions = coreSpawn.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });
    
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
    console.log('Energy avaliable: ' + coreRoom.energyAvailable)
    
    // Spawn components
    let creepName = '300-'
    let gaComp = [WORK, WORK, CARRY, MOVE]
    let buComp = [CARRY, CARRY, WORK, MOVE, MOVE]
    let fiComp = [ATTACK, ATTACK, MOVE, MOVE, TOUGH]
    
    // Change creep components based on energy avaliable
    if (coreRoom.energyAvailable >= 500 && CREEP_LIMIT > creepCount) {
        creepName = '500-'
        gaComp = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
        buComp = [CARRY, CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE]
        fiComp = [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, TOUGH]
    } else if (coreRoom.energyAvailable >= 400 && CREEP_LIMIT > creepCount) {
        creepName = '400-'
        gaComp = [WORK, WORK, CARRY, CARRY, CARRY, MOVE]
        buComp = [CARRY, CARRY, CARRY, WORK, WORK, MOVE]
        fiComp = [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, TOUGH]
    }
        
    // Spawn Creeps
    if( (coreSpawn.store.getUsedCapacity(RESOURCE_ENERGY) >= 300) && (gathererCount < G_LIMIT) ) {
        creepName = creepName + 'Gatherer-' + nameRng
        coreSpawn.spawnCreep( gaComp, creepName )
        console.log('New gatherer: ' + creepName)
    } else if( (coreSpawn.store.getUsedCapacity(RESOURCE_ENERGY) >= 300) && (builderCount < BUILDER_LIMIT) ) {
        creepName = creepName + 'Builder-' + nameRng
        coreSpawn.spawnCreep( buComp, creepName )
        console.log('New builder: ' + creepName)
    } else if( (coreSpawn.store.getUsedCapacity(RESOURCE_ENERGY) >= 300) && (fighterCount < FIGHTER_LIMIT) ) {
        creepName = creepName + 'Fighter-' + nameRng
        coreSpawn.spawnCreep( fiComp, creepName )
        console.log('New fighter: ' + creepName)
    }
        
    // build construction sites
    // extensions
    conRoom.createConstructionSite(coreSpawn.pos.x, coreSpawn.pos.y - 2, STRUCTURE_EXTENSION)
    conRoom.createConstructionSite(coreSpawn.pos.x + 2, coreSpawn.pos.y - 2, STRUCTURE_EXTENSION)
    conRoom.createConstructionSite(coreSpawn.pos.x + 2, coreSpawn.pos.y, STRUCTURE_EXTENSION)
    conRoom.createConstructionSite(coreSpawn.pos.x, coreSpawn.pos.y + 2, STRUCTURE_EXTENSION)
    conRoom.createConstructionSite(coreSpawn.pos.x - 2, coreSpawn.pos.y, STRUCTURE_EXTENSION)
    // roads
    conRoom.createConstructionSite(coreSpawn.pos.x, coreSpawn.pos.y - 3, STRUCTURE_ROAD)
    conRoom.createConstructionSite(coreSpawn.pos.x + 1, coreSpawn.pos.y - 3, STRUCTURE_ROAD)
    conRoom.createConstructionSite(coreSpawn.pos.x + 2, coreSpawn.pos.y - 3, STRUCTURE_ROAD)
    conRoom.createConstructionSite(coreSpawn.pos.x + 3, coreSpawn.pos.y - 3, STRUCTURE_ROAD)
    conRoom.createConstructionSite(coreSpawn.pos.x + 3, coreSpawn.pos.y - 2, STRUCTURE_ROAD)
    conRoom.createConstructionSite(coreSpawn.pos.x + 3, coreSpawn.pos.y - 1, STRUCTURE_ROAD)
    conRoom.createConstructionSite(coreSpawn.pos.x + 3, coreSpawn.pos.y, STRUCTURE_ROAD)
    conRoom.createConstructionSite(coreSpawn.pos.x + 3, coreSpawn.pos.y + 1, STRUCTURE_ROAD)
    conRoom.createConstructionSite(coreSpawn.pos.x + 3, coreSpawn.pos.y + 2, STRUCTURE_ROAD)
    
    // Creep Loop
    for(let i in Game.creeps) {
        let currentCreep = Game.creeps[i]
        
        // Handle Fighters
        if ( currentCreep.body[0].type == 'attack' ) {
            currentCreep.moveTo(30, 1, { reusePath: 15 })
            
            let target = currentCreep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
            if(currentCreep.pos.getRangeTo(target) <= 1) {
                currentCreep.attack(target)
            } else {
                currentCreep.moveTo(target, { reusePath: 15 })
            }
            
        }
        
        // Handle Builders
        if ( currentCreep.body[0].type == 'carry') {
            
            currentCreep.moveTo(22, 10, { reusePath: 15 })
            
            // if energy under limit, harvest energy
            if(currentCreep.store[RESOURCE_ENERGY] < currentCreep.store.getCapacity()) {
                let target = currentCreep.pos.findClosestByPath(FIND_SOURCES)
                currentCreep.moveTo(target, { reusePath: 15 })
                currentCreep.harvest(target)
            }
            
            let target = currentCreep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)
            
            // if energy at capacity, moves to construction site
            if( (currentCreep.store[RESOURCE_ENERGY] == currentCreep.store.getCapacity()) && ((currentCreep.pos.getRangeTo(target) > 3)) ) {
                currentCreep.moveTo(target, { reusePath: 15 })
            }
            
            // if any energy and in range of construction site, will build
            if((currentCreep.pos.getRangeTo(target) <= 3) && (currentCreep.store[RESOURCE_ENERGY] > 0)) {
                currentCreep.build(target)
            }
        }
    
        // Handle Gatherers
        if ( currentCreep.body[0].type == 'work' ) {
            
            // Go to harvest energy or return to spawn
            if(currentCreep.store[RESOURCE_ENERGY] < currentCreep.store.getCapacity()) {
                let target = currentCreep.pos.findClosestByPath(FIND_SOURCES)
                currentCreep.moveTo(target, { reusePath: 15 })
                currentCreep.harvest(target)
            } else {
                let target = currentCreep.pos.findClosestByPath(FIND_MY_SPAWNS)
                currentCreep.moveTo(target, { reusePath: 15 })
            }
            
            // Upgrade controller instead when at the chosen creep count
            if( (creepCount >= CREEP_LIMIT) && (currentCreep.store[RESOURCE_ENERGY] > 0) ){
                let target = currentCreep.room.controller
                if(currentCreep.pos.getRangeTo(target) <= 3) {
                     currentCreep.upgradeController(target)
                } else {
                    currentCreep.moveTo(target, { reusePath: 15 })
                }
            }
            
            // Transfer to spawn
            let target = currentCreep.pos.findClosestByPath(FIND_MY_SPAWNS)
            if( (currentCreep.pos.getRangeTo(target) == 1) && (currentCreep.store[RESOURCE_ENERGY] > 0) ){
                currentCreep.transfer(target, RESOURCE_ENERGY)
            }
            
            for(let i in extensions) {
                if (extensions[i].store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    if ( currentCreep.store[RESOURCE_ENERGY] == currentCreep.store.getCapacity(RESOURCE_ENERGY) ) {
                        currentCreep.moveTo(extensions[i], { reusePath: 15 })
                    }
                    if ( (currentCreep.pos.getRangeTo(extensions[i]) == 1) && (currentCreep.store[RESOURCE_ENERGY] > 0) ) {
                        currentCreep.transfer(extensions[i], RESOURCE_ENERGY)
                    }
                }
            }
        }
    }
    
    // Logging
    console.log('Gatherers: ' + gathererCount + ' / ' + G_LIMIT)
    console.log('Fighters: ' + fighterCount + ' / ' + FIGHTER_LIMIT)
    console.log('Builders ' + builderCount + ' / ' + BUILDER_LIMIT)
    console.log('Total creeps: ' + creepCount + ' / ' + CREEP_LIMIT)
    console.log('Extensions: ' + extensions.length);
}






