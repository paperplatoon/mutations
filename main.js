

state = {
    player: {
        name: "Player",
        monsterArray: [squirrel, squirrel],
        mutationArray: [mutation1, mutation2],
    },

    opponent: {
        name: "Opponent",
        monsterArray: [chipmunk, vampireBat],
    },
    playerMonster: false,
    enemyMonster: false,
    targetedMonster: 0,
    targetedPlayerMonster: 0,
    playerUsedMutationThisTurn: false,
}


async function updateState(newStateObj) {
    state = {...newStateObj}
    stateObj = await checkForDeath(state)
    createScreenDiv(state)
    return state
}


async function gainEnergy(stateObj, monsterIndex, moveIndex) {
    stateObj = immer.produce(stateObj, (newState) => {
        let monster = newState.player.monsterArray[monsterIndex]
        let move = monster.moves[moveIndex]
        monster.currentEnergy -= move.energyReq 
        monster.currentEnergy += move.energyGained
      })
      return stateObj
}

async function dealDamage(stateObj, DamageNumber) {
    stateObj = immer.produce(stateObj, (newState) => {   
        newState.opponent.monsterArray[newState.targetedMonster].currentHP -= DamageNumber  
    })
      return stateObj
}

async function gainNextAttackDamage(stateObj, playerMonsterIndex, damageToGain) {
    stateObj = immer.produce(stateObj, (newState) => {   
        newState.player.monsterArray[playerMonsterIndex].nextAttackDamage += damageToGain  
      })
    return stateObj
}

async function attackDamageIncrease(stateObj, playerMonsterIndex, moveIndex, amountToIncrease)  {
    stateObj = immer.produce(stateObj, (newState) => {   
        newState.player.monsterArray[playerMonsterIndex].moves[moveIndex].damageDealt += amountToIncrease  
      })
    return stateObj
}

async function attackTimesIncrease(stateObj, playerMonsterIndex, moveIndex, amountToIncrease)  {
    stateObj = immer.produce(stateObj, (newState) => {   
        newState.player.monsterArray[playerMonsterIndex].moves[moveIndex].damageTimes += amountToIncrease  
      })
    return stateObj
}

async function monsterMoved(stateObj, playerMonsterIndex)  {
    stateObj = immer.produce(stateObj, (newState) => {   
        newState.player.monsterArray[playerMonsterIndex].hasMoved = true  
      })
    return stateObj
}

async function playerUsedMutation(stateObj)  {
    stateObj = immer.produce(stateObj, (newState) => {   
        newState.playerUsedMutationThisTurn = true  
      })
    return stateObj
}

function randomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max-min + 1) + min)
}

async function enemyDealDamage(stateObj, DamageNumber) {
    let monsterIndex = stateObj.player.monsterArray.findIndex(monster => monster.currentHP <= DamageNumber)
    let chosenIndex = (monsterIndex !== -1 ) ? monsterIndex : Math.floor(Math.random() * stateObj.player.monsterArray.length)
    stateObj = immer.produce(stateObj, (newState) => {   
        newState.player.monsterArray[chosenIndex].currentHP -= DamageNumber  
    })
      return stateObj
}

async function enemyHeal(stateObj, monsterIndex, healNumber) {
    let missingHP = stateObj.opponent.monsterArray[monsterIndex].maxHP - stateObj.opponent.monsterArray[monsterIndex].currentHP
    stateObj = immer.produce(stateObj, (newState) => {   
        if (missingHP >= healNumber) {
            newState.opponent.monsterArray[monsterIndex].currentHP += healNumber
        } else {
            newState.opponent.monsterArray[monsterIndex].currentHP = newState.opponent.monsterArray[monsterIndex].maxHP
        }
          
    })
    return stateObj
}

async function enemyGainEnergy(stateObj, monsterIndex, moveIndex) {
    stateObj = immer.produce(stateObj, (newState) => {
        let monster = newState.opponent.monsterArray[monsterIndex]
        let move = monster.moves[moveIndex]
        monster.currentEnergy -= move.energyReq 
        monster.currentEnergy += move.energyGained
      })
      return stateObj
}

async function pickEnemyMove(stateObj, monsterIndex) {
    let monster = stateObj.opponent.monsterArray[monsterIndex]
    let currentMoveIndex = 0
    for (let i=0; i < monster.moves.length; i++) {
        if (monster.moves[i].energyReq <= monster.currentEnergy) {
            currentMoveIndex = i
        }
    }
    return currentMoveIndex
}

async function resetPlayerTurn(stateObj) {
    stateObj = immer.produce(stateObj, (newState) => {
        newState.playerUsedMutationThisTurn = false;
        newState.player.monsterArray.forEach(monster => {
            monster.hasMoved = false;
        });
    })
    return stateObj
}

async function enemyTurn(stateObj) {
    console.log(stateObj.opponent.monsterArray.length)
    for (let i =0; i < stateObj.opponent.monsterArray.length; i++) {
        enemyMoveIndex = await pickEnemyMove(stateObj, i)
        stateObj = await stateObj.opponent.monsterArray[i].moves[enemyMoveIndex].action(stateObj, i, enemyMoveIndex)
    }
    stateObj = await resetPlayerTurn(stateObj)
    await updateState(stateObj)
}

async function chooseEnemy(stateObj) {
    const [index1, index2] = getUniqueRandomIndexes(enemyArray, 2);
    stateObj = immer.produce(stateObj, (newState) => {
        newState.opponent.monsterArray = [enemyArray[index1], enemyArray[index2]];
    })
    return stateObj
}

function getUniqueRandomIndexes(array, count) {
    let indexes = [];
    while (indexes.length < count) {
        let index = Math.floor(Math.random() * array.length);
        if (!indexes.includes(index)) {
            indexes.push(index);
        }
    }
    return indexes;
}

async function resetPlayerStats(stateObj) {
    stateObj = immer.produce(stateObj, (newState) => {
        newState.targetedPlayerMonster = 0
        newState.targetedMonster = 0
        newState.playerUsedMutationThisTurn = false
        newState.player.monsterArray.forEach(monster => {
            monster.hasMoved = false;
            monster.currentHP = monster.maxHP
            monster.currentEnergy = 0;
        })
    })
    return stateObj
}

async function startEncounter(stateObj) {
    stateObj = await chooseEnemy(stateObj)
    stateObj = await resetPlayerStats(stateObj)
    stateObj = await updateState(stateObj)
    await createScreenDiv(stateObj)
}

async function checkForDeath(stateObj) {
    stateObj = immer.produce(stateObj, (newState) => {
        for (let i = newState.player.monsterArray.length - 1; i >= 0; i--) {
            let monster = newState.player.monsterArray[i];
            if (monster.currentHP <= 0) {
                console.log(monster.name + " fainted!");
                newState.player.monsterArray.splice(i, 1);
            }
        }

        for (let i = newState.opponent.monsterArray.length - 1; i >= 0; i--) {
            let monster = newState.opponent.monsterArray[i];
            if (monster.currentHP <= 0) {
                console.log(monster.name + " fainted!");
                newState.opponent.monsterArray.splice(i, 1);
            }
        }
    })

    if (stateObj.player.monsterArray.length < 1) {
        console.log("player lost!")
        stateObj = await startEncounter(stateObj)
    } else if (stateObj.opponent.monsterArray.length < 1) {
        console.log("player won!")
        stateObj = await startEncounter(stateObj)
    }
    return stateObj
}

startEncounter(state)