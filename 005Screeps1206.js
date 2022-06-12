module.exports.loop = function () {
    console.log("-----------(New Tick)-----------")
    
    const G_LIMIT = 12
    const FIGHTER_LIMIT = 1 
    const BUILDER_LIMIT = 2
    const CREEP_LIMIT = G_LIMIT + FIGHTER_LIMIT + BUILDER_LIMIT
    let creepCount = Object.keys(Game.creeps).length
    let gathererCount = 0
    let fighterCount = 0
    let builderCount = 0
    
    // buildings
    const extensions = Game.spawns['Karma2'].room.find(FIND_MY_STRUCTURES, {
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
    
    // Spawn Creeps
    console.log('Energy avaliable: ' + Game.rooms['E5S39'].energyAvailable)
    // if energyAvaliable = 400 ->
    // energyStructures array to draw energy from
    // build bigger version of whatever (maybe just add move to anything? and create component lists here)
    if( (Game.spawns['Karma2'].store.getUsedCapacity(RESOURCE_ENERGY) >= 300) && (gathererCount < G_LIMIT) ) {
        let creepName = 'Gatherer-' + nameRng
        Game.spawns['Karma2'].spawnCreep( [WORK, WORK, CARRY, MOVE], creepName )
        console.log('New gatherer: ' + creepName)
    } else if( (Game.spawns['Karma2'].store.getUsedCapacity(RESOURCE_ENERGY) >= 300) && (builderCount < BUILDER_LIMIT) ) {
        let creepName = 'Builder-' + nameRng
        Game.spawns['Karma2'].spawnCreep( [CARRY, CARRY, WORK, MOVE, MOVE], creepName )
        console.log('New builder: ' + creepName)
    } else if( (Game.spawns['Karma2'].store.getUsedCapacity(RESOURCE_ENERGY) >= 300) && (fighterCount < FIGHTER_LIMIT) ) {
        let creepName = 'Fighter-' + nameRng
        Game.spawns['Karma2'].spawnCreep( [ATTACK, ATTACK, MOVE, MOVE, TOUGH], creepName )
        console.log('New fighter: ' + creepName)
    }
    
    // construction sites
    // create 2 spaces above spawn 
    let conNorthX = Game.spawns['Karma2'].pos.x
    let conNorthY = Game.spawns['Karma2'].pos.y - 2
    // create 2 spaces right of spawn
    let conEastX = Game.spawns['Karma2'].pos.x + 2
    let conEastY = Game.spawns['Karma2'].pos.y
    // create 2 spaces south of spawn
    let conSouthX = Game.spawns['Karma2'].pos.x
    let conSouthY = Game.spawns['Karma2'].pos.y + 2
    // build sites
    Game.rooms.E5S39.createConstructionSite(conNorthX, conNorthY, STRUCTURE_EXTENSION)
    Game.rooms.E5S39.createConstructionSite(conEastX, conEastY, STRUCTURE_EXTENSION)
    Game.rooms.E5S39.createConstructionSite(conSouthX, conSouthY, STRUCTURE_EXTENSION)
    
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
            
            // if energy at capacity, find nearest unfinished conscturction site and build
            if(currentCreep.store[RESOURCE_ENERGY] >= currentCreep.store.getCapacity()) {
                let target = currentCreep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)
                currentCreep.moveTo(target, { reusePath: 15 })
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
                        console.log('ttt')
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






