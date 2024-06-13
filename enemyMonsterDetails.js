//enemy that gains strength and last attack is a multi-hit
//enemy that deals more damage when HP is low
//enemy that gains Dex to scale too fast
//


bite = {
    name: "Bite",
    type: "attack",
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
    energyGained: 1,
    damage: 10,
    damageTimes: 1,
    upgrades: 0,
    energyCost: 0,
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

demolish = {
    name: "Demolish",
    type: "attack",
    text: (monsterArray, monsterIndex, moveIndex)  => { 
      let monster = monsterArray[monsterIndex]
      let move =  monster.moves[moveIndex]
      let textString = `Deal ${calcMonsterDamage(monster, move)} damage`;
      if (move.damageTimes > 1) {
        textString += ` ${move.damageTimes} times`
      }
      return textString
    },
    energyReq: 2,
    energyGained: 0,
    damage: 20,
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
    }
}

bloodsucker = {
    name: "Bloodsucker",
    type: "attack",
    text: (monsterArray, monsterIndex, moveIndex)  => { 
      let monster = monsterArray[monsterIndex]
      let move =  monster.moves[moveIndex]
      let textString = `Deal ${calcMonsterDamage(monster, move)} damage `;
      if (move.damageTimes > 1) {
        textString += `${move.damageTimes} times`
      }
      textString += `. Heal ${calcMonsterDamage(monster, move)} HP`;
      return textString
    },
    energyReq: 0,
    energyGained: 1,
    damage: 5,
    damageTimes: 1,
    upgrades: 0,
    action: async (stateObj, monsterIndex, moveIndex, isPlayer) => {
      let monster = (isPlayer) ? stateObj.player.fightMonsterArray[monsterIndex] : stateObj.opponent.fightMonsterArray[monsterIndex] 
      let move =  monster.moves[moveIndex]
      stateObj = await gainEnergy(stateObj, monsterIndex, moveIndex, isPlayer);
      stateObj = await dealDamage(stateObj, monsterIndex, moveIndex, isPlayer)
      stateObj = await restoreHP(stateObj, monsterIndex, calcMonsterDamage(monster, move), isPlayer)
      await updateState(stateObj);
      if (!isPlayer) {
        return stateObj
      }
    }
}

diveBomb = {
    name: "Infection",
    type: "attack",
    text: (monsterArray, monsterIndex, moveIndex)  => { 
      let monster = monsterArray[monsterIndex]
      let move =  monster.moves[moveIndex]
      let textString = `Deal ${calcMonsterDamage(monster, move)} damage `;
      if (move.damageTimes > 1) {
        textString += `${move.damageTimes} times`
      }
      textString += `. Heal ${calcMonsterDamage(monster, move)} HP`;
      return textString
    },
    energyReq: 4,
    energyGained: 0,
    damage: 15,
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
    }
}

chipmunk = {
    id: 2,
    name: "Rabid Chipmunk",
    currentHP: 30,
    maxHP: 30,
    strength: 0,
    currentEnergy: 0,
    avatar: "img/chipmunk.jpg",
    moves: [
      {...bite},
      {...demolish}
    ],
    hasMoved: false,
    startCombatWithEnergy: 0,
    nextAttackDamage: 0,
}

vampireBat = {
    id: 3,
    name: "Vampire Bat",
    currentHP: 30,
    maxHP: 30,
    strength: 0,
    currentEnergy: 0,
    avatar: "img/bat.jpg",
    moves: [
      {...bloodsucker},
      {...diveBomb}
    ],
    hasMoved: false,
    startCombatWithEnergy: 0,
    nextAttackDamage: 0,
}

enemyArray = [chipmunk, vampireBat]