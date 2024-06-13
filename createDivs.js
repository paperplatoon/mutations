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


function createMoveDiv(stateObj, monsterIndex, moveIndex, isPlayer, outsideFight=false)  {
    let monsterArray = false
    if (isPlayer) {
        monsterArray = (outsideFight) ? stateObj.player.fullMonsterArray : stateObj.player.fightMonsterArray 
    } else {
        monsterArray = stateObj.opponent.fightMonsterArray
    }
    monster = monsterArray[monsterIndex]
    let move =  monster.moves[moveIndex]
    const moveDiv = createDiv(["move-div", "column"])
    const moveTopRowDiv = createDiv(["move-top-row-div", "row", "space-evenly"])
    const moveName = createDiv(["move-name-div"], move.name)
    const moveEnergy = createDiv(["move-energy-cost-div"], (move.energyGained - move.energyReq))
    moveTopRowDiv.append(moveEnergy, moveName)
    const moveText = createDiv(["move-text-div"], move.text(monsterArray, monsterIndex, moveIndex))
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
    let monster = (isPlayer) ? stateObj.player.fightMonsterArray[monsterIndex] : stateObj.opponent.fightMonsterArray[monsterIndex]

    const monsterDiv = createDiv(["monster-div"])
    const monsterTopRowDiv = createDiv(["monster-top-row-div", "row", "space-evenly"])
    const monsterNameDiv = createDiv(["monster-name-div"], monster.name)
    const monsterEnergyDiv = createDiv(["monster-energy-div", "centered"], ("Energy: " + monster.currentEnergy))
    const monsterHPDiv = createDiv(["monster-hp"], ("HP: " + monster.currentHP + "/" + monster.maxHP))
    monsterTopRowDiv.append(monsterNameDiv, monsterHPDiv)

    const monsterMovesDiv = createDiv(["monster-moves-div"])
    for (let i=0; i<monster.moves.length; i++) {
        let moveDiv = createMoveDiv(stateObj, monsterIndex, i, isPlayer)
        if (stateObj.selectedMutationAction) {
            if (stateObj.doesMoveQualify(monster.moves[i]) && isPlayer) {
                moveDiv.classList.add("move-to-pick")
                moveDiv.onclick = async function() {
                    console.log("firing mutation after move click" )
                    await stateObj.selectedMutationAction(stateObj, monsterIndex, i)
                }
            }
            //change so if selectedMutationAction, is not showing player-move
        } else {
            if (isPlayer && monster.currentEnergy >= monster.moves[i].energyReq && monster.hasMoved === false) {
                moveDiv.classList.add("player-move")
                moveDiv.onclick = async function() {
                    await monster.moves[i].action(stateObj, monsterIndex, i, isPlayer)
                }
            } else if (!isPlayer) {
                let moveIndex = pickEnemyMove(stateObj, monsterIndex)
                console.log("move index for enemy at index " + monsterIndex + " is " + moveIndex)
                if (moveIndex === i) {
                    console.log("adding enemy move to move " + i + "for monster at index " + monsterIndex)
                    moveDiv.classList.add("enemy-move")
                }
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
            avatarDiv.classList.add("player-pulse")
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

    const playerSideDiv = createDiv(["side-div", "player-side-div", "row", "space-evenly"])
    if (stateObj.player.fightMonsterArray) {
        for (let i=0; i < stateObj.player.fightMonsterArray.length; i++) {
            let monsterDiv = createMonsterDiv(stateObj, i, true)
            playerSideDiv.append(monsterDiv)
        }
    }

    const opponentSideDiv = createDiv(["side-div", "opponent-side-div", "row", "space-evenly"])
    for (let i=0; i < stateObj.opponent.fightMonsterArray.length; i++) {
        let monsterDiv = createMonsterDiv(stateObj, i, false)
        opponentSideDiv.append(monsterDiv)
    }
    
    const mutationsDiv = createDiv(["mutations-array-div", "row", "centered"])
    for (let i=0; i < stateObj.player.handMutationArray.length; i++) {
        mutateDiv = createMutationDiv(stateObj, stateObj.player.handMutationArray[i], i)
        mutationsDiv.append(mutateDiv)
    }
    endTurnButton = createEndTurnButton(stateObj)
    mutationsDiv.append(endTurnButton)

    monstersDiv.append(playerSideDiv, opponentSideDiv)
    screenDiv.append(monstersDiv, mutationsDiv)
    const chooseMonsterDiv = createChooseMonster(stateObj)
    document.body.append(screenDiv, chooseMonsterDiv)
    if (stateObj.playerCaptureBalls > 0 && stateObj.opponent.fightMonsterArray[stateObj.targetedMonster].currentHP <= 5) {
        let captureDiv = createUseCaptureBall(stateObj)
        document.body.append(captureDiv) 
    }

}


function createMutationDiv(stateObj, mutation, mutationArrayIndex, ) {
    const mutationDiv = createDiv(["mutation-div", "column", "centered", "space-evenly"])
    const mutationNameDiv = createDiv(["mutation-name", "centered"], mutation.name)
    const mutationTextDiv = createDiv(["mutation-text", "centered"], mutation.text)
    mutationDiv.append(mutationNameDiv, mutationTextDiv)
    if (stateObj.playerUsedMutationThisTurn === false) {
        mutationDiv.onclick = async function(){
            if (stateObj.player.handMutationArray[mutationArrayIndex].pickAttack) {
                stateObj = immer.produce(stateObj, (newState) => {
                    newState.selectedMutationAction = newState.player.handMutationArray[mutationArrayIndex].action
                    newState.selectedMutationIndex = mutationArrayIndex
                    newState.doesMoveQualify = mutation.mutationCheck
                })
                await updateState(stateObj)
            } else {
                await stateObj.player.handMutationArray[mutationArrayIndex].action(stateObj, mutationArrayIndex)
            }
            
            
        }
        mutationDiv.classList.add("mutation-div-active")
    }
    return mutationDiv
}

function renderPickMutation(stateObj, mutationArray, index) {
    const mutationDiv = createDiv(["mutation-div", "column", "centered", "space-evenly"])
    const mutationNameDiv = createDiv(["mutation-name", "centered"], mutationArray[index].name)
    const mutationTextDiv = createDiv(["mutation-text", "centered"], mutationArray[index].text)
    mutationDiv.append(mutationNameDiv, mutationTextDiv)
    mutationDiv.onclick = async function(){
        console.log("clicked mutation div")
        await addMutation(stateObj, mutationArray, index)
    }
    mutationDiv.classList.add("mutation-div-active")
    document.body.append(mutationDiv)
}

function renderPickMonster(stateObj, index) {
    let monster = stateObj.player.fullMonsterArray[index]
    const monsterDiv = createDiv(["monster-div"])
    const monsterTopRowDiv = createDiv(["monster-top-row-div", "row", "space-evenly"])
    const monsterNameDiv = createDiv(["monster-name-div"], monster.name)
    const monsterHPDiv = createDiv(["monster-hp"], ("HP: " + monster.currentHP + "/" + monster.maxHP))
    monsterTopRowDiv.append(monsterNameDiv, monsterHPDiv)

    const monsterMovesDiv = createDiv(["monster-moves-div"])
    for (let i=0; i<monster.moves.length; i++) {
        let moveDiv = createMoveDiv(stateObj, index, i, true, true)
        moveDiv.classList.add("player-move")
        monsterMovesDiv.append(moveDiv)
    }

    const avatarDiv = document.createElement('img');
    avatarDiv.classList.add("avatar");
    avatarDiv.src = monster.avatar;
    avatarDiv.setAttribute("draggable", "false")
    if (index < 2) {
        avatarDiv.classList.add("player-targeted")
    } else {
        button1 = createDiv(["choose-monster-button"], "Make Monster 1")
        button1.onclick = async function(){
            console.log("fire makeMonster")
            await makeMonster(stateObj, index, 0)
        }
        button2 = createDiv(["choose-monster-button"], "Make Monster 2")
        button2.onclick = async function(){
            await makeMonster(stateObj, index, 1)
        }
    }

    monsterDiv.append(monsterTopRowDiv, avatarDiv, monsterMovesDiv)
    if (index >= 2) {
        monsterDiv.append(button1, button2)
    }
    return monsterDiv
}

function createReturnToFightDiv(stateObj) {
    const returnDiv = createDiv(["change-status-button"], "Return to Fight")
    returnDiv.onclick = async function(){
        stateObj = await changeStatus(stateObj, Status.inFight)
        await updateState(stateObj)
    }
    return returnDiv
}

function createUseCaptureBall(stateObj) {
    const returnDiv = createDiv(["change-status-button"], "Catch Target Pokemon (" + stateObj.playerCaptureBalls + ")")
    returnDiv.onclick = async function(){
        stateObj = await catchTargetMonster(stateObj)
        await updateState(stateObj)
    }
    return returnDiv
}

function createChooseMonster(stateObj) {
    const returnDiv = createDiv(["change-status-button"], "Choose Monster Order")
    returnDiv.onclick = async function(){
        console.log("clicked choose Monster")
        stateObj = await changeStatus(stateObj, Status.choosingMonsterOrder)
        await updateState(stateObj)
    }
    return returnDiv
}