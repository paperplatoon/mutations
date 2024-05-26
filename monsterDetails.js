
swipe = {
    name: "Swipe",
    text: (stateObj, monsterIndex, moveIndex)  => { 
      let monster = stateObj.player.monsterArray[monsterIndex]
      let move =  monster.moves[moveIndex]
      let textString = `Deal ${move.damageDealt + monster.nextAttackDamage} damage`;
      if (move.damageTimes > 1) {
        textString += ` ${move.damageTimes} times`
      }
      return textString
    },
    energyReq: 0,
    energyGained: 1,
    damageDealt: 7,
    damageTimes: 1,
    upgrades: 0,
    energyCost: 1,
    action: async (stateObj, monsterIndex, moveIndex) => {
      let damage = stateObj.player.monsterArray[monsterIndex].moves[moveIndex].damageDealt + stateObj.player.monsterArray[monsterIndex].nextAttackDamage
      let damageTimes = stateObj.player.monsterArray[monsterIndex].moves[moveIndex].damageTimes
      stateObj = await gainEnergy(stateObj, monsterIndex, moveIndex);
      stateObj = await dealDamage(stateObj, (damage*damageTimes))
      await updateState(stateObj);
    }
  }

  claw = {
    name: "Claw",
    text: (stateObj, monsterIndex, moveIndex)  => { 
      let monster = stateObj.player.monsterArray[monsterIndex]
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
    energyCost: 1,
    action: async (stateObj, monsterIndex, moveIndex) => {
      let damage = stateObj.player.monsterArray[monsterIndex].moves[moveIndex].damageDealt + stateObj.player.monsterArray[monsterIndex].nextAttackDamage
      let damageTimes = stateObj.player.monsterArray[monsterIndex].moves[moveIndex].damageTimes
      stateObj = await gainEnergy(stateObj, monsterIndex, moveIndex);
      console.log("after claw monster has " + stateObj.player.monsterArray[monsterIndex].currentEnergy)
      stateObj = await dealDamage(stateObj, (damage*damageTimes))
      console.log("after claw damage monster has " + stateObj.player.monsterArray[monsterIndex].currentEnergy)
      await updateState(stateObj);
    }
}

plotRevenge = {
  name: "Plot Revenge",
  text: (stateObj, monsterIndex, moveIndex) => {
    let monster = stateObj.player.monsterArray[monsterIndex]
    let missingHP = monster.maxHP - monster.currentHP
    let textString = `Your next attack deals ${missingHP} damage (increases when HP is lower)`;
    return textString
  },
  energyReq: 4,
  energyGained: 0,
  damageDealt: 0,
  upgrades: 0,
  energyCost: 1,
  action: async (stateObj, monsterIndex, moveIndex) => {
    let monster = stateObj.player.monsterArray[monsterIndex]
    let missingHP = monster.maxHP - monster.currentHP
    stateObj = await gainNextAttackDamage(stateObj, monsterIndex, missingHP)
    stateObj = await gainEnergy(stateObj, monsterIndex, moveIndex);
    await updateState(stateObj);
  }
}

squirrel = {
    name: "Squirrel",
    currentHP: 50,
    maxHP: 50,
    currentEnergy: 0,
    nextAttackDamage: 0,
    moves: [
        swipe,
        claw,
        plotRevenge
    ],
    hasAttacked: false,
}
