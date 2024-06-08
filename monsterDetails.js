swipe = {
      name: "Swipe",
      text: (monsterArray, monsterIndex, moveIndex)  => { 
        let monster = monsterArray[monsterIndex]
        let move =  monster.moves[moveIndex]
        let textString = `Deal ${calcMonsterDamage(monster, move)} damage`;
        if (move.damageTimes > 1) {
          textString += ` ${move.damageTimes} times`
        }
        return textString
      },
      energyReq: 0,
      type: "attack",
      energyGained: 1,
      damage: 6,
      damageTimes: 1,
      upgrades: 0,
      action: async (stateObj, monsterIndex, moveIndex, isPlayer) => {
        stateObj = await gainEnergy(stateObj, monsterIndex, moveIndex, isPlayer);
        stateObj = await dealDamage(stateObj, monsterIndex, moveIndex, isPlayer)
        stateObj = await monsterMoved(stateObj, monsterIndex, isPlayer)
        await updateState(stateObj);
        if (!isPlayer) {
          return stateObj
        }
      },
}

claw = {
    name: "Claw",
    type: "attack",
    text: (monsterArray, monsterIndex, moveIndex) => { 
      let monster = monsterArray[monsterIndex]
      let move =  monster.moves[moveIndex]
      let textString = `Deal ${calcMonsterDamage(monster, move)} damage`;
      if (move.damageTimes > 1) {
        textString += ` ${move.damageTimes} times`
      }
      return textString
    },
    energyReq: 0,
    energyGained: 2,
    damage: 2,
    damageTimes: 2,
    upgrades: 0,
    action: async (stateObj, monsterIndex, moveIndex, isPlayer) => {
      stateObj = await gainEnergy(stateObj, monsterIndex, moveIndex, isPlayer);
      stateObj = await dealDamage(stateObj, monsterIndex, moveIndex, isPlayer)
      stateObj = await monsterMoved(stateObj, monsterIndex, isPlayer)
      await updateState(stateObj);
      if (!isPlayer) {
        return stateObj
      }
    }
}

plotRevenge = {
  name: "Plot Revenge",
  type: "skill",
  text: (monsterArray, monsterIndex, moveIndex)=> {
    let monster = monsterArray[monsterIndex]
    let move =  monster.moves[moveIndex]
    let missingHP = monster.maxHP - monster.currentHP
    let textString = `Your next attack deals ${missingHP} damage (increases when HP is lower)`;
    return textString
  },
  energyReq: 4,
  energyGained: 0,
  damage: 0,
  upgrades: 0,
  action: async (stateObj, monsterIndex, moveIndex, isPlayer) => {
    let monster = (isPlayer) ? stateObj.player.fightMonsterArray[monsterIndex] : stateObj.opponent.fightMonsterArray[monsterIndex]
    let missingHP = monster.maxHP - monster.currentHP
    stateObj = await gainNextAttackDamage(stateObj, monsterIndex, missingHP, isPlayer)
    stateObj = await gainEnergy(stateObj, monsterIndex, moveIndex, isPlayer);
    stateObj = await monsterMoved(stateObj, monsterIndex, isPlayer)
    await updateState(stateObj);
    if (!isPlayer) {
      return stateObj
    }
  }
}

unleash = {
  name: "Unleash",
  type: "attack",
  text: (monsterArray, monsterIndex, moveIndex)=> {
    let monster = monsterArray[monsterIndex]
    let move =  monster.moves[moveIndex]
    let missingHP = monster.maxHP - monster.currentHP
    let textString = `Deals ${calcMonsterDamage(monster, move) + missingHP} damage (increases when HP is lower)`;
    if (move.damageTimes > 1) {
      textString += ` ${move.damageTimes} times`
    }
    return textString
  },
  energyReq: 4,
  energyGained: 0,
  damage: 8,
  damageTimes: 1,
  upgrades: 0,
  action: async (stateObj, monsterIndex, moveIndex, isPlayer) => {
    let monster = (isPlayer) ? stateObj.player.fightMonsterArray[monsterIndex] : stateObj.opponent.fightMonsterArray[monsterIndex]
    let missingHP = monster.maxHP - monster.currentHP
    stateObj = await gainEnergy(stateObj, monsterIndex, moveIndex, isPlayer);
    stateObj = await dealDamage(stateObj, monsterIndex, moveIndex, isPlayer, missingHP)
    stateObj = await monsterMoved(stateObj, monsterIndex, isPlayer)
    await updateState(stateObj);
    if (!isPlayer) {
      return stateObj
    }
  }
}

squirrel = {
    id: 0,
    name: "Squirrel",
    avatar: "img/squirrel.jpg",
    currentHP: 40,
    maxHP: 40,
    strength: 0,
    currentEnergy: 0,
    moves: [
      {...swipe},
      {...claw},
      {...unleash}
    ],
    hasMoved: false,
    startCombatWithEnergy: 0,
    nextAttackDamage: 0,
}

squirrel1 = {
  id: 1,
  name: "Squirrel",
  avatar: "img/squirrel.jpg",
  currentHP: 40,
  maxHP: 40,
  strength: 0,
  currentEnergy: 0,
  moves: [
    {...swipe},
    {...claw},
    {...unleash}
  ],
  hasMoved: false,
  startCombatWithEnergy: 0,
  nextAttackDamage: 0,
}

//
//have two different actions - one to set the state action and the moveIndex, and one to trigger?
//clicking on the move sets the moveIndexForMutation??
//selectedMutationAction(stateObj, monsterIndex, i)
commonAggressionMutation = {
  name: "Aggression+ (common)",
  text: "An attack deals 1-2 more damage",
  pickAttack: true,
  action: async (stateObj, monsterIndex, moveIndex) => {
    if (stateObj.selectedMutationAction) {
      let amountToIncrease = randomIntegerInRange(1, 2)
      stateObj = await attackDamageIncrease(stateObj, monsterIndex, moveIndex, amountToIncrease)
      stateObj = await playerUsedMutation(stateObj, stateObj.selectedMutationIndex)
    }
    
    await updateState(stateObj);
  }
}

uncommonAggressionMutation = {
  name: "Aggression+ (uncommon)",
  text: "An attack deals 2-3 more damage",
  pickAttack: true,
  action: async (stateObj, monsterIndex, moveIndex) => {
      if (stateObj.selectedMutationAction) {
        let amountToIncrease = randomIntegerInRange(2, 3)
        stateObj = await attackDamageIncrease(stateObj, monsterIndex, moveIndex, amountToIncrease)
        stateObj = await playerUsedMutation(stateObj, stateObj.selectedMutationIndex)
      }
    await updateState(stateObj);
  }
}

rareAggressionMutation = {
  name: "Aggression+ (rare)",
  text: "An attack deals 4-5 more damage",
  pickAttack: true,
  action: async (stateObj, monsterIndex, moveIndex) => {
    if (stateObj.selectedMutationAction) {
      let amountToIncrease = randomIntegerInRange(4, 5)
      stateObj = await attackDamageIncrease(stateObj, monsterIndex, moveIndex, amountToIncrease)
      stateObj = await playerUsedMutation(stateObj, stateObj.selectedMutationIndex)
    }
  await updateState(stateObj);
}
}

uncommonSpeedMutation = {
  name: "Speed+ (uncommon)",
  text: "An attack hits 1 more time",
  pickAttack: true,
  action: async (stateObj, monsterIndex, moveIndex) => {
    if (stateObj.selectedMutationAction) {
      stateObj = await attackTimesIncrease(stateObj, monsterIndex, moveIndex, 1)
      stateObj = await playerUsedMutation(stateObj, stateObj.selectedMutationIndex)
    }
    await updateState(stateObj);
  }
}

rareSpeedMutation = {
  name: "Speed+ (rare)",
  text: "An attack hits 2 more times",
  pickAttack: true,
  action: async (stateObj, monsterIndex, moveIndex) => {
    if (stateObj.selectedMutationAction) {
      stateObj = await attackTimesIncrease(stateObj, monsterIndex, moveIndex, 2)
      stateObj = await playerUsedMutation(stateObj, stateObj.selectedMutationIndex)
    }
    await updateState(stateObj);
  }
}

//HERE
commonBulkMutation = {
  name: "HP+ (common)",
  text: "Subject gains 3-5 more HP",
  pickAttack: false,
  action: async (stateObj, mutationIndex) => {
    let amountToIncrease = randomIntegerInRange(3, 5)
    stateObj = await hpIncrease(stateObj, stateObj.targetedPlayerMonster, amountToIncrease)
    stateObj = await playerUsedMutation(stateObj, mutationIndex)
    await updateState(stateObj);
  }
}

uncommonBulkMutation = {
  name: "HP+ (uncommon)",
  text: "Subject gains 5-7 more HP",
  pickAttack: false,
  action: async (stateObj, mutationIndex) => {
    let amountToIncrease = randomIntegerInRange(5, 8)
    stateObj = await hpIncrease(stateObj, stateObj.targetedPlayerMonster, amountToIncrease)
    stateObj = await playerUsedMutation(stateObj, mutationIndex)
    await updateState(stateObj);
  }
}

rareBulkMutation = {
  name: "HP+ (rare)",
  text: "Subject gains 8-11 more HP",
  pickAttack: false,
  action: async (stateObj, mutationIndex) => {
    let amountToIncrease = randomIntegerInRange(8, 11)
    stateObj = await hpIncrease(stateObj, stateObj.targetedPlayerMonster, amountToIncrease)
    stateObj = await playerUsedMutation(stateObj, mutationIndex)
    await updateState(stateObj);
  }
}

uncommonEnergyMutation = {
  name: "Energy+ (uncommon)",
  text: "Subject starts combat with 1 extra energy",
  pickAttack: false,
  action: async (stateObj, mutationIndex) => {
    stateObj = await startCombatWithEnergyIncrease(stateObj, stateObj.targetedPlayerMonster, 1)
    stateObj = await playerUsedMutation(stateObj, mutationIndex)
    await updateState(stateObj);
  }
}

rareEnergyMutation = {
  name: "Energy+ (rare)",
  text: "Subject starts combat with 2 extra energy",
  pickAttack: false,
  action: async (stateObj, mutationIndex) => {
    stateObj = await startCombatWithEnergyIncrease(stateObj, stateObj.targetedPlayerMonster, 2)
    stateObj = await playerUsedMutation(stateObj, mutationIndex)
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