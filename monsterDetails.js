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
      damageDealt: 7,
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
    currentHP: 40,
    maxHP: 40,
    currentEnergy: 0,
    nextAttackDamage: 0,
    moves: [
      {...swipe},
      {...claw},
      {...plotRevenge}
    ],
    hasMoved: false,
}

mutation1 = {
  name: "mutation 1",
  text: "A random attack deals 2-3 more damage",
  action: async (stateObj) => {
    let monster = stateObj.player.monsterArray[stateObj.targetedPlayerMonster]
    const filteredMoves = monster.moves.filter(move => move.type === "attack");
    let moveName = filteredMoves[Math.floor(Math.random() * filteredMoves.length)].name
    let moveIndex = monster.moves.findIndex(move => move.name === moveName)
    let amountToIncrease = randomIntegerInRange(2, 3)
    stateObj = await attackDamageIncrease(stateObj, stateObj.targetedPlayerMonster, moveIndex, amountToIncrease)
    stateObj = await playerUsedMutation(stateObj)
    await updateState(stateObj);
  }
}

mutation2 = {
  name: "mutation 2",
  text: "A random attack hits 1 more time",
  action: async (stateObj) => {
    let monster = stateObj.player.monsterArray[stateObj.targetedPlayerMonster]
    const filteredMoves = monster.moves.filter(move => move.type === "attack");
    let moveName = filteredMoves[Math.floor(Math.random() * filteredMoves.length)].name
    let moveIndex = monster.moves.findIndex(move => move.name === moveName)
    stateObj = await attackTimesIncrease(stateObj, stateObj.targetedPlayerMonster, moveIndex, 1)
    stateObj = await playerUsedMutation(stateObj)
    await updateState(stateObj);
  }
}
