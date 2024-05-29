swipe = {
      name: "Swipe",
      text: (stateObj, monsterIndex, moveIndex, isPlayer)  => { 
        let monster = (isPlayer) ? stateObj.player.monsterArray[monsterIndex] : stateObj.opponent.monsterArray[monsterIndex]
        let move =  monster.moves[moveIndex]
        let textString = `Deal ${move.damageDealt + monster.nextAttackDamage} damage`;
        if (move.damageTimes > 1) {
          textString += ` ${move.damageTimes} times`
        }
        return textString
      },
      energyReq: 0,
      type: "attack",
      energyGained: 1,
      damageDealt: 6,
      damageTimes: 1,
      upgrades: 0,
      action: async (stateObj, monsterIndex, moveIndex) => {
        let damage = stateObj.player.monsterArray[monsterIndex].moves[moveIndex].damageDealt + stateObj.player.monsterArray[monsterIndex].nextAttackDamage
        let damageTimes = stateObj.player.monsterArray[monsterIndex].moves[moveIndex].damageTimes
        stateObj = await gainEnergy(stateObj, monsterIndex, moveIndex);
        stateObj = await dealDamage(stateObj, (damage*damageTimes))
        stateObj = await monsterMoved(stateObj, monsterIndex)
        await updateState(stateObj);
      },
}

claw = {
    name: "Claw",
    type: "attack",
    text: (stateObj, monsterIndex, moveIndex, isPlayer)  => { 
      let monster = (isPlayer) ? stateObj.player.monsterArray[monsterIndex] : stateObj.opponent.monsterArray[monsterIndex]
      let move =  monster.moves[moveIndex]
      let textString = `Deal ${move.damageDealt + monster.nextAttackDamage} damage`;
      if (move.damageTimes > 1) {
        textString += ` ${move.damageTimes} times`
      }
      return textString
    },
    energyReq: 0,
    energyGained: 2,
    damageDealt: 2,
    damageTimes: 2,
    upgrades: 0,
    action: async (stateObj, monsterIndex, moveIndex) => {
      let damage = stateObj.player.monsterArray[monsterIndex].moves[moveIndex].damageDealt + stateObj.player.monsterArray[monsterIndex].nextAttackDamage
      let damageTimes = stateObj.player.monsterArray[monsterIndex].moves[moveIndex].damageTimes
      stateObj = await gainEnergy(stateObj, monsterIndex, moveIndex);
      stateObj = await dealDamage(stateObj, (damage*damageTimes))
      stateObj = await monsterMoved(stateObj, monsterIndex)
      await updateState(stateObj);
    }
}

plotRevenge = {
  name: "Plot Revenge",
  type: "skill",
  text: (stateObj, monsterIndex, moveIndex, isPlayer) => {
    let monster = (isPlayer) ? stateObj.player.monsterArray[monsterIndex] : stateObj.opponent.monsterArray[monsterIndex]
    let missingHP = monster.maxHP - monster.currentHP
    let textString = `Your next attack deals ${missingHP} damage (increases when HP is lower)`;
    return textString
  },
  energyReq: 4,
  energyGained: 0,
  damageDealt: 0,
  upgrades: 0,
  action: async (stateObj, monsterIndex, moveIndex) => {
    let monster = stateObj.player.monsterArray[monsterIndex]
    let missingHP = monster.maxHP - monster.currentHP
    stateObj = await gainNextAttackDamage(stateObj, monsterIndex, missingHP)
    stateObj = await gainEnergy(stateObj, monsterIndex, moveIndex);
    stateObj = await monsterMoved(stateObj, monsterIndex)
    await updateState(stateObj);
  }
}

squirrel = {
    name: "Squirrel",
    avatar: "img/squirrel.jpg",
    currentHP: 40,
    maxHP: 40,
    currentEnergy: 0,
    
    moves: [
      {...swipe},
      {...claw},
      {...plotRevenge}
    ],
    hasMoved: false,
    startCombatWithEnergy: 0,
    nextAttackDamage: 0,
}

commonAggressionMutation = {
  name: "Aggression+ (common)",
  text: "A random attack deals 1-2 more damage",
  action: async (stateObj, index) => {
    let monster = stateObj.player.monsterArray[stateObj.targetedPlayerMonster]
    const filteredMoves = monster.moves.filter(move => move.type === "attack");
    let moveName = filteredMoves[Math.floor(Math.random() * filteredMoves.length)].name
    let moveIndex = monster.moves.findIndex(move => move.name === moveName)
    let amountToIncrease = randomIntegerInRange(1, 2)
    stateObj = await attackDamageIncrease(stateObj, stateObj.targetedPlayerMonster, moveIndex, amountToIncrease)
    stateObj = await playerUsedMutation(stateObj, index)
    await updateState(stateObj);
  }
}

uncommonAggressionMutation = {
  name: "Aggression+ (uncommon)",
  text: "A random attack deals 2-3 more damage",
  action: async (stateObj, index) => {
    let monster = stateObj.player.monsterArray[stateObj.targetedPlayerMonster]
    const filteredMoves = monster.moves.filter(move => move.type === "attack");
    let moveName = filteredMoves[Math.floor(Math.random() * filteredMoves.length)].name
    let moveIndex = monster.moves.findIndex(move => move.name === moveName)
    let amountToIncrease = randomIntegerInRange(2, 3)
    stateObj = await attackDamageIncrease(stateObj, stateObj.targetedPlayerMonster, moveIndex, amountToIncrease)
    stateObj = await playerUsedMutation(stateObj, index)
    await updateState(stateObj);
  }
}

rareAggressionMutation = {
  name: "Aggression+ (rare)",
  text: "A random attack deals 4-5 more damage",
  action: async (stateObj, index) => {
    let monster = stateObj.player.monsterArray[stateObj.targetedPlayerMonster]
    const filteredMoves = monster.moves.filter(move => move.type === "attack");
    let moveName = filteredMoves[Math.floor(Math.random() * filteredMoves.length)].name
    let moveIndex = monster.moves.findIndex(move => move.name === moveName)
    let amountToIncrease = randomIntegerInRange(4, 5)
    stateObj = await attackDamageIncrease(stateObj, stateObj.targetedPlayerMonster, moveIndex, amountToIncrease)
    stateObj = await playerUsedMutation(stateObj, index)
    await updateState(stateObj);
  }
}

uncommonSpeedMutation = {
  name: "Speed+ (uncommon)",
  text: "A random attack hits 1 more time",
  action: async (stateObj, index) => {
    let monster = stateObj.player.monsterArray[stateObj.targetedPlayerMonster]
    const filteredMoves = monster.moves.filter(move => move.type === "attack");
    let moveName = filteredMoves[Math.floor(Math.random() * filteredMoves.length)].name
    let moveIndex = monster.moves.findIndex(move => move.name === moveName)
    stateObj = await attackTimesIncrease(stateObj, stateObj.targetedPlayerMonster, moveIndex, 1)
    stateObj = await playerUsedMutation(stateObj, index)
    await updateState(stateObj);
  }
}

rareSpeedMutation = {
  name: "Speed+ (rare)",
  text: "A random attack hits 2 more time",
  action: async (stateObj, index) => {
    let monster = stateObj.player.monsterArray[stateObj.targetedPlayerMonster]
    const filteredMoves = monster.moves.filter(move => move.type === "attack");
    let moveName = filteredMoves[Math.floor(Math.random() * filteredMoves.length)].name
    let moveIndex = monster.moves.findIndex(move => move.name === moveName)
    stateObj = await attackTimesIncrease(stateObj, stateObj.targetedPlayerMonster, moveIndex, 2)
    stateObj = await playerUsedMutation(stateObj, index)
    await updateState(stateObj);
  }
}

//HERE
commonBulkMutation = {
  name: "HP+ (common)",
  text: "Subject gains 3-5 more HP",
  action: async (stateObj, index) => {
    let amountToIncrease = randomIntegerInRange(3, 5)
    stateObj = await hpIncrease(stateObj, stateObj.targetedPlayerMonster, amountToIncrease)
    stateObj = await playerUsedMutation(stateObj, index)
    await updateState(stateObj);
  }
}

uncommonBulkMutation = {
  name: "HP+ (uncommon)",
  text: "Subject gains 5-7 more HP",
  action: async (stateObj, index) => {
    let amountToIncrease = randomIntegerInRange(5, 8)
    stateObj = await attackDamageIncrease(stateObj, stateObj.targetedPlayerMonster, amountToIncrease)
    stateObj = await playerUsedMutation(stateObj, index)
    await updateState(stateObj);
  }
}

rareBulkMutation = {
  name: "HP+ (rare)",
  text: "Subject gains 8-11 more HP",
  action: async (stateObj, index) => {
    let amountToIncrease = randomIntegerInRange(8, 11)
    stateObj = await hpIncrease(stateObj, stateObj.targetedPlayerMonster, amountToIncrease)
    stateObj = await playerUsedMutation(stateObj, index)
    await updateState(stateObj);
  }
}

uncommonEnergyMutation = {
  name: "Energy+ (uncommon)",
  text: "Subject starts combat with 1 extra energy",
  action: async (stateObj, index) => {
    stateObj = await startCombatWithEnergyIncrease(stateObj, stateObj.targetedPlayerMonster, 1)
    stateObj = await playerUsedMutation(stateObj, index)
    await updateState(stateObj);
  }
}

rareEnergyMutation = {
  name: "Energy+ (rare)",
  text: "Subject starts combat with 2 extra energy",
  action: async (stateObj, index) => {
    stateObj = await startCombatWithEnergyIncrease(stateObj, stateObj.targetedPlayerMonster, 2)
    stateObj = await playerUsedMutation(stateObj, index)
    await updateState(stateObj);
  }
}

//first attack deals extra damage
//something that costs energy costs 1 less

let commonMutationPool = [commonAggressionMutation, commonBulkMutation]
let uncommonMutationPool = [uncommonAggressionMutation, uncommonBulkMutation, uncommonSpeedMutation, uncommonEnergyMutation]
let rareMutationPool = [rareAggressionMutation, rareBulkMutation, rareSpeedMutation, rareEnergyMutation]

let startingMutationArray = [commonAggressionMutation, commonAggressionMutation, commonAggressionMutation, commonAggressionMutation,
  uncommonAggressionMutation, uncommonAggressionMutation, uncommonSpeedMutation, commonBulkMutation, 
  commonBulkMutation, commonBulkMutation, commonBulkMutation, uncommonBulkMutation]