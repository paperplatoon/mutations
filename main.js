

state = {
    player: {
        name: "Player",
        monsterArray: [squirrel, squirrel],
        fullMutationArray: [...startingMutationArray],
        temporaryFullMutationArray: [...startingMutationArray],
        mutationArray: [],
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

    playerStartingMutations: 3,
}


async function updateState(newStateObj) {
    newStateObj = await checkForDeath(newStateObj)
    state = {...newStateObj}
    createScreenDiv(state)
    return state
}

function shuffleArray(array) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
}

async function pause(timeValue) {
    return new Promise(res => setTimeout(res, timeValue))
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

async function hpIncrease(stateObj, playerMonsterIndex, amountToIncrease)  {
    stateObj = immer.produce(stateObj, (newState) => {   
        newState.player.monsterArray[playerMonsterIndex].currentHP += amountToIncrease
        newState.player.monsterArray[playerMonsterIndex].maxHP += amountToIncrease  
      })
    return stateObj
}

async function startCombatWithEnergyIncrease(stateObj, playerMonsterIndex, amountToIncrease)  {
    stateObj = immer.produce(stateObj, (newState) => {   
        newState.player.monsterArray[playerMonsterIndex].startCombatWithEnergyIncrease += amountToIncrease 
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

async function playerUsedMutation(stateObj, index)  {
    stateObj = immer.produce(stateObj, (newState) => {   
        newState.playerUsedMutationThisTurn = true  
        let removeIndex = newState.player.fullMutationArray.findIndex(mutation => mutation.name === newState.player.mutationArray[index].name)
        newState.player.mutationArray.splice(index, 1)
        newState.player.fullMutationArray.splice(removeIndex, 1)
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

async function drawMutationCard(stateObj) {
    if (stateObj.player.fullMutationArray.length > 0) {
        stateObj = immer.produce(stateObj, (newState) => {
            newState.player.mutationArray.push(stateObj.player.fullMutationArray[0])
            newState.player.temporaryFullMutationArray.splice(0, 1)
        })
        await updateState(stateObj)
    }
    return stateObj
}

async function resetPlayerTurn(stateObj) {
    stateObj = immer.produce(stateObj, (newState) => {
        newState.playerUsedMutationThisTurn = false;
        newState.player.monsterArray.forEach(monster => {
            monster.hasMoved = false;
        });
    })
    if (stateObj.player.mutationArray.length < 3) {
        stateObj = await drawMutationCard(stateObj)
    }
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

async function changePlayerMonster(stateObj, monIndex) {
    stateObj = immer.produce(stateObj, (newState) => {
        newState.targetedPlayerMonster = monIndex;
    })
    await updateState(stateObj)
}

async function changeEnemyMonster(stateObj, monIndex) {
    stateObj = immer.produce(stateObj, (newState) => {
        newState.targetedMonster = monIndex;
    })
    await updateState(stateObj)
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

function getRandomMutationPool() {
    const rand = Math.random();
    if (rand < 0.75) {
        return commonMutationPool;
    } else if (rand < 0.95) {
        return uncommonMutationPool;
    } else {
        return rareMutationPool;
    }
}

function pickRewardMutations() {
    const selectedMutations = [];
    const pickedMutations = new Set();

    while (selectedMutations.length < 3) {
        const mutationPool = getRandomMutationPool();
        const mutationIndex = Math.floor(Math.random() * mutationPool.length);
        const mutation = mutationPool[mutationIndex];

        if (!pickedMutations.has(mutation)) {
            selectedMutations.push(mutation);
            pickedMutations.add(mutation);
        }
    }
    return selectedMutations;
}

async function pickStartingMutations(stateObj) {
    for (let i=0; i < stateObj.playerStartingMutations; i++) {
        stateObj = await drawMutationCard(stateObj)
        await pause(300)
    }
    return stateObj
}

async function resetPlayerStats(stateObj) {
    stateObj = immer.produce(stateObj, (newState) => {
        newState.targetedPlayerMonster = 0
        newState.targetedMonster = 0
        newState.playerUsedMutationThisTurn = false
        newState.player.monsterArray.forEach(monster => {
            monster.hasMoved = false;
            monster.currentHP = monster.maxHP
            monster.currentEnergy = monster.startCombatWithEnergy;
        })
        //shuffle and pick mutations
        newState.player.mutationArray = [];
        newState.player.temporaryFullMutationArray = [...newState.player.fullMutationArray]
        newState.player.fullMutationArray = shuffleArray(newState.player.fullMutationArray)
    })
    stateObj = await pickStartingMutations(stateObj)
    return stateObj
}

async function startEncounter(stateObj) {
    stateObj = await chooseEnemy(stateObj)
    stateObj = await resetPlayerStats(stateObj)
    stateObj = await updateState(stateObj)
    return stateObj
}

async function checkForDeath(stateObj) {
    stateObj = immer.produce(stateObj, (newState) => {
        for (let i = newState.player.monsterArray.length - 1; i >= 0; i--) {
            let monster = newState.player.monsterArray[i];
            if (monster.currentHP <= 0) {
                console.log(monster.name + " fainted!");
                newState.player.monsterArray.splice(i, 1);
                newState.targetedPlayerMonster = 0
            }
        }

        for (let i = newState.opponent.monsterArray.length - 1; i >= 0; i--) {
            let monster = newState.opponent.monsterArray[i];
            if (monster.currentHP <= 0) {
                console.log(monster.name + " fainted!");
                newState.opponent.monsterArray.splice(i, 1);
                newState.targetedMonster = 0
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