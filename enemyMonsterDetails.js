enemyBite = {
    name: "Bite",
    type: "attack",
    text: (stateObj, monsterIndex, moveIndex)  => { 
      let monster = stateObj.opponent.monsterArray[monsterIndex]
      let move =  monster.moves[moveIndex]
      let textString = `Deal ${move.damageDealt + monster.nextAttackDamage} damage`;
      if (move.damageTimes > 1) {
        textString += ` ${move.damageTimes} times`
      }
      return textString
    },
    energyReq: 0,
    energyGained: 1,
    damageDealt: 10,
    damageTimes: 1,
    upgrades: 0,
    energyCost: 1,
    action: async (stateObj, monsterIndex, moveIndex) => {
      let damage = stateObj.opponent.monsterArray[monsterIndex].moves[moveIndex].damageDealt + stateObj.opponent.monsterArray[monsterIndex].nextAttackDamage
      let damageTimes = stateObj.opponent.monsterArray[monsterIndex].moves[moveIndex].damageTimes
      stateObj = await enemyGainEnergy(stateObj, monsterIndex, moveIndex);
      stateObj = await enemyDealDamage(stateObj, (damage*damageTimes))
      await updateState(stateObj);
      return stateObj
    }
}

enemyDemolish = {
    name: "Demolish",
    type: "attack",
    text: (stateObj, monsterIndex, moveIndex)  => { 
      let monster = stateObj.opponent.monsterArray[monsterIndex]
      let move =  monster.moves[moveIndex]
      let textString = `Deal ${move.damageDealt + monster.nextAttackDamage} damage`;
      if (move.damageTimes > 1) {
        textString += ` ${move.damageTimes} times`
      }
      return textString
    },
    energyReq: 4,
    energyGained: 0,
    damageDealt: 20,
    damageTimes: 1,
    upgrades: 0,
    action: async (stateObj, monsterIndex, moveIndex) => {
      let damage = stateObj.opponent.monsterArray[monsterIndex].moves[moveIndex].damageDealt + stateObj.opponent.monsterArray[monsterIndex].nextAttackDamage
      let damageTimes = stateObj.opponent.monsterArray[monsterIndex].moves[moveIndex].damageTimes
      stateObj = await enemyGainEnergy(stateObj, monsterIndex, moveIndex);
      stateObj = await enemyDealDamage(stateObj, (damage*damageTimes))
      await updateState(stateObj);
    }
}

enemyBloodsucker = {
    name: "Bloodsucker",
    type: "attack",
    text: (stateObj, monsterIndex, moveIndex)  => { 
      let monster = stateObj.opponent.monsterArray[monsterIndex]
      let move =  monster.moves[moveIndex]
      let textString = `Deal ${move.damageDealt + monster.nextAttackDamage} damage. Heal ${move.damageDealt + monster.nextAttackDamage} HP`;
      if (move.damageTimes > 1) {
        textString += ` ${move.damageTimes} times`
      }
      return textString
    },
    energyReq: 0,
    energyGained: 1,
    damageDealt: 4,
    damageTimes: 1,
    upgrades: 0,
    action: async (stateObj, monsterIndex, moveIndex) => {
      let damage = stateObj.opponent.monsterArray[monsterIndex].moves[moveIndex].damageDealt + stateObj.opponent.monsterArray[monsterIndex].nextAttackDamage
      let damageTimes = stateObj.opponent.monsterArray[monsterIndex].moves[moveIndex].damageTimes
      stateObj = await enemyGainEnergy(stateObj, monsterIndex, moveIndex);
      stateObj = await enemyDealDamage(stateObj, (damage*damageTimes))
      stateObj = await enemyHeal(stateObj, monsterIndex, (damage*damageTimes))
      await updateState(stateObj);
      return stateObj
    }
}

enemyDiveBomb = {
    name: "Infection",
    type: "attack",
    text: (stateObj, monsterIndex, moveIndex)  => { 
      let monster = stateObj.opponent.monsterArray[monsterIndex]
      let move =  monster.moves[moveIndex]
      let textString = `Deal ${move.damageDealt + monster.nextAttackDamage} damage. Heal `;
      if (move.damageTimes > 1) {
        textString += ` ${move.damageTimes} times`
      }
      return textString
    },
    energyReq: 4,
    energyGained: 0,
    damageDealt: 15,
    damageTimes: 1,
    upgrades: 0,
    action: async (stateObj, monsterIndex, moveIndex) => {
      let damage = stateObj.opponent.monsterArray[monsterIndex].moves[moveIndex].damageDealt + stateObj.opponent.monsterArray[monsterIndex].nextAttackDamage
      let damageTimes = stateObj.opponent.monsterArray[monsterIndex].moves[moveIndex].damageTimes
      stateObj = await enemyGainEnergy(stateObj, monsterIndex, moveIndex);
      stateObj = await enemyDealDamage(stateObj, (damage*damageTimes))
      await updateState(stateObj);
      return stateObj
    }
}

chipmunk = {
    name: "Rabid Chipmunk",
    currentHP: 30,
    maxHP: 30,
    currentEnergy: 0,
    nextAttackDamage: 0,
    moves: [
      {...enemyBite},
      {...enemyDemolish}
    ],
    hasAttacked: false,
}

vampireBat = {
    name: "Vampire Bat",
    currentHP: 30,
    maxHP: 30,
    currentEnergy: 0,
    nextAttackDamage: 0,
    moves: [
      {...enemyBloodsucker},
      {...enemyDiveBomb}
    ],
    hasAttacked: false,
}

enemyArray = [chipmunk, vampireBat]