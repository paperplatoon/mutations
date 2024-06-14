

squirrel = {
    id: 0,
    name: "Squirrel",
    avatar: ["img/otter1.png", "img/otter2.png", "img/otter3.png" ],
    mutations: 0,
    currentHP: 40,
    maxHP: 40,
    strength: 0,
    currentEnergy: 0,
    moves: [
      {...claw},
      {...powerFeed}
    ],
    hasMoved: false,
    startCombatWithEnergy: 0,
    nextAttackDamage: 0,
}

squirrel1 = {
  id: 1,
  name: "Squirrel",
  avatar: "img/squirrel.jpg",
  mutations: 0,
  currentHP: 40,
  maxHP: 40,
  strength: 0,
  currentEnergy: 0,
  moves: [
    {...swipe},
    {...plotRevenge}
  ],
  hasMoved: false,
  startCombatWithEnergy: 0,
  nextAttackDamage: 0,
}

chipmunk = {
  id: 2,
  name: "Rabid Chipmunk",
  currentHP: 30,
  maxHP: 30,
  strength: 0,
  currentEnergy: 0,
  avatar: ["img/chipmunk1.png", "img/chipmunk2.png", "img/chipmunk3.png" ],
  mutations: 0,
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
  avatar: ["img/bat1.png", "img/bat2.png", "img/bat3.png" ],
  mutations: 0,
  moves: [
    {...bloodsucker},
    {...diveBomb}
  ],
  hasMoved: false,
  startCombatWithEnergy: 0,
  nextAttackDamage: 0,
}

turtle = {
  id: 5,
  name: "Test",
  currentHP: 35,
  maxHP: 35,
  strength: 0,
  currentEnergy: 0,
  avatar: ["img/turtle1.png", "img/turtle2.png", "img/turtle3.png" ],
  mutations: 0,
  moves: [
    {...heal},
    {...fullHeal}
  ],
  hasMoved: false,
  startCombatWithEnergy: 0,
  nextAttackDamage: 0,
}

bunny = {
  id: 5,
  name: "Bunny",
  currentHP: 35,
  maxHP: 35,
  strength: 0,
  currentEnergy: 0,
  avatar: ["img/bunny1.png", "img/bunny2.png", "img/bunny3.png" ],
  mutations: 0,
  moves: [
    {...energize},
    {...unleash}
  ],
  hasMoved: false,
  startCombatWithEnergy: 0,
  nextAttackDamage: 0,
}

enemyArray = [chipmunk, vampireBat, turtle]




































