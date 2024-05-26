
state = {
    player: {
        name: "Player",
        monsterArray: [squirrel],
        mutationArray: [],
    },

    opponent: {
        name: "Opponent",
        monsterArray: [squirrel],
    },
    playerMonster: false,
    enemyMonster: false,
    targetedMonster: 0,
}




function createDiv(classListName, textString=false) {
    let tempDiv = document.createElement('div');
    tempDiv.classList.add(classListName);
    if (textString) {
        tempDiv.textContent = textString
    }
    return tempDiv
}
//(stateObj, monsterIndex, moveIndex) 
function createMoveDiv(stateObj, monsterIndex, moveIndex)  {
    let monster = stateObj.player.monsterArray[monsterIndex]
    let move =  monster.moves[moveIndex]
    const moveDiv = createDiv("move-div")
    const moveName = createDiv("move-name-div", move.name)
    const moveEnergy = createDiv("move-energy-cost-div", (move.energyGained - move.energyReq))
    const moveText = createDiv("move-energy-cost-div", move.text(stateObj, monsterIndex, moveIndex))
    moveDiv.append(moveEnergy, moveName, moveText)
    return moveDiv
}

function createMonsterDiv(stateObj, monsterIndex, isPlayer) {
    let monster = (isPlayer) ? stateObj.player.monsterArray[monsterIndex] : stateObj.opponent.monsterArray[monsterIndex]

    const monsterDiv = createDiv("monster-div")
    const monsterTopRowDiv = createDiv("monster-top-row-div")
    const monsterNameDiv = createDiv("monster-name-div", monster.name)
    const monsterEnergyDiv = createDiv("monster-energy-div", ("Energy: " + monster.currentEnergy))
    monsterNameDiv.onclick = async function(){
        console.log("clicked name div")
    }
    const monsterHPDiv = createDiv("monster-hp", ("HP: " + monster.currentHP + "/" + monster.maxHP))
    monsterTopRowDiv.append(monsterNameDiv, monsterHPDiv, monsterEnergyDiv)

    const monsterMovesDiv = createDiv("monster-moves-div")
    for (let i=0; i<monster.moves.length; i++) {
        let moveDiv = createMoveDiv(stateObj, monsterIndex, i)
        if (isPlayer && monster.currentEnergy >= monster.moves[i].energyReq) {
            console.log("creating move")
            moveDiv.onclick = async function() {
                console.log("clicked moveDiv")
                console.log(monster.moves[i])
                await monster.moves[i].action(stateObj, monsterIndex, i)
            }
        }
        monsterMovesDiv.append(moveDiv)
    }

    monsterDiv.append(monsterTopRowDiv, monsterMovesDiv)
    return monsterDiv
}

function createScreenDiv(stateObj) {
    document.body.innerHTML = ''

    const screenDiv = createDiv("screen-div")

    const playerSideDiv = createDiv("side-div")
    for (i=0; i < stateObj.player.monsterArray.length; i++) {
        monsterDiv = createMonsterDiv(stateObj, i, true)
        playerSideDiv.append(monsterDiv)
    }

    const opponentSideDiv = createDiv("side-div")
    for (i=0; i < stateObj.opponent.monsterArray.length; i++) {
        monsterDiv = createMonsterDiv(stateObj, i, false)
        opponentSideDiv.append(monsterDiv)
    }
    
    screenDiv.append(playerSideDiv, opponentSideDiv)
    document.body.append(screenDiv)
}

async function updateState(newStateObj) {
    state = {...newStateObj}
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
      console.log(stateObj.player.monsterArray[monsterIndex].name + " has " + stateObj.player.monsterArray[monsterIndex].currentEnergy + " after move")
      return stateObj
}

async function dealDamage(stateObj, DamageNumber) {
    console.log("inside deal damage, monster has " + stateObj.player.monsterArray[0].currentEnergy)
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

createScreenDiv(state)