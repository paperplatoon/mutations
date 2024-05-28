//(stateObj, monsterIndex, moveIndex) 
function createDiv(classListArray, textString=false) {
    let tempDiv = document.createElement('div');
    for (let i=0; i < classListArray.length; i++) {
        tempDiv.classList.add(classListArray[i]);
    }
    if (textString) {
        tempDiv.textContent = textString
    }
    return tempDiv
}

function createMoveDiv(stateObj, monsterIndex, moveIndex, isPlayer)  {
    let monster = (isPlayer) ? stateObj.player.monsterArray[monsterIndex] : stateObj.opponent.monsterArray[monsterIndex]
    let move =  monster.moves[moveIndex]
    const moveDiv = createDiv(["move-div", "column"])
    const moveTopRowDiv = createDiv(["move-top-row-div", "row", "space-evenly"])
    const moveName = createDiv(["move-name-div"], move.name)
    const moveEnergy = createDiv(["move-energy-cost-div"], (move.energyGained - move.energyReq))
    moveTopRowDiv.append(moveEnergy, moveName)
    const moveText = createDiv(["move-text-div"], move.text(stateObj, monsterIndex, moveIndex, isPlayer))
    moveDiv.append(moveTopRowDiv, moveText)
    return moveDiv
}

function createEndTurnButton(stateObj) {
    const endTurnDiv = createDiv(["end-turn-button", "centered"], "End Turn")
    endTurnDiv.onclick = async function() {
        await enemyTurn(stateObj)
    }
    return endTurnDiv
}

function createMonsterDiv(stateObj, monsterIndex, isPlayer) {
    let monster = (isPlayer) ? stateObj.player.monsterArray[monsterIndex] : stateObj.opponent.monsterArray[monsterIndex]

    const monsterDiv = createDiv(["monster-div"])
    const monsterTopRowDiv = createDiv(["monster-top-row-div", "row", "space-evenly"])
    const monsterNameDiv = createDiv(["monster-name-div"], monster.name)
    const monsterEnergyDiv = createDiv(["monster-energy-div", "centered"], ("Energy: " + monster.currentEnergy))
    monsterNameDiv.onclick = async function(){
    }
    const monsterHPDiv = createDiv(["monster-hp"], ("HP: " + monster.currentHP + "/" + monster.maxHP))
    monsterTopRowDiv.append(monsterNameDiv, monsterHPDiv)

    const monsterMovesDiv = createDiv(["monster-moves-div"])
    for (let i=0; i<monster.moves.length; i++) {
        let moveDiv = createMoveDiv(stateObj, monsterIndex, i, isPlayer)
        if (isPlayer && monster.currentEnergy >= monster.moves[i].energyReq && monster.hasMoved === false) {
            moveDiv.classList.add("player-move")
            moveDiv.onclick = async function() {
                await monster.moves[i].action(stateObj, monsterIndex, i)
            }
        }
        monsterMovesDiv.append(moveDiv)
    }

    const avatarDiv = document.createElement('img');
    avatarDiv.classList.add("avatar");
    avatarDiv.src = monster.avatar;
    avatarDiv.setAttribute("draggable", "false")
    if (isPlayer) {
        if (monsterIndex === stateObj.targetedPlayerMonster) {
            avatarDiv.classList.add("player-targeted")
        } else {
            avatarDiv.onclick = async function() {
                await changePlayerMonster(stateObj, monsterIndex)
            }
        }
    } else {
        if (monsterIndex === stateObj.targetedMonster) {
            avatarDiv.classList.add("opponent-targeted")
        } else {
            avatarDiv.onclick = async function() {
                await changeEnemyMonster(stateObj, monsterIndex)
            }
        }
    }

    monsterDiv.append(monsterTopRowDiv, monsterEnergyDiv, avatarDiv, monsterMovesDiv)
    return monsterDiv
}

function createScreenDiv(stateObj) {
    console.log("creating screen div")
    document.body.innerHTML = ''

    const screenDiv = createDiv(["screen-div", "column"])
    const monstersDiv = createDiv(["monsters-div", "row", "space-evenly"])

    const playerSideDiv = createDiv(["side-div", "row", "space-evenly"])
    console.log(stateObj.player.monsterArray)
    if (stateObj.player.monsterArray) {
        for (i=0; i < stateObj.player.monsterArray.length; i++) {
            let monsterDiv = createMonsterDiv(stateObj, i, true)
            playerSideDiv.append(monsterDiv)
        }
    }
    

    const opponentSideDiv = createDiv(["side-div", "row", "space-evenly"])
    for (i=0; i < stateObj.opponent.monsterArray.length; i++) {
        let monsterDiv = createMonsterDiv(stateObj, i, false)
        opponentSideDiv.append(monsterDiv)
    }
    
    const mutationsDiv = createDiv(["mutations-array-div", "row", "centered"])
    for (i=0; i < stateObj.player.mutationArray.length; i++) {
        mutateDiv = createMutationDiv(stateObj, stateObj.player.mutationArray[i])
        mutationsDiv.append(mutateDiv)
    }
    endTurnButton = createEndTurnButton(stateObj)
    mutationsDiv.append(endTurnButton)

    monstersDiv.append(playerSideDiv, opponentSideDiv)
    screenDiv.append(monstersDiv, mutationsDiv)
    document.body.append(screenDiv)
}

function createMutationDiv(stateObj, mutation) {
    const mutationDiv = createDiv(["mutation-div", "column", "centered", "space-evenly"])
    const mutationNameDiv = createDiv(["mutation-name", "centered"], mutation.name)
    const mutationTextDiv = createDiv(["mutation-text", "centered"], mutation.text)
    mutationDiv.append(mutationNameDiv, mutationTextDiv)
    if (stateObj.playerUsedMutationThisTurn === false) {
        mutationDiv.onclick = async function(){
            console.log("clicked mutation div")
            await mutation.action(stateObj)
        }
        mutationDiv.classList.add("mutation-div-active")
    }
    
    
    return mutationDiv
}