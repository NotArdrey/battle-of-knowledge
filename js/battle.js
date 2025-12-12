// battle.js - Complete working version

// ========== GLOBAL VARIABLES ==========
let playerHp = 100;
let enemyHp = 100;
let currentQuestion = null;
let questionIndex = 0;
let currentEra = '';
let currentHero = null;
let currentVillain = null;
let currentLanguageLoaded = '';
let currentShuffledAnswers = [];
let questions = []; // QUESTIONS ARRAY - THIS WAS MISSING!

// Boss mechanics
let isBossBattle = false;
let bossName = null;
let enemiesDefeated = 0;
let totalEnemiesBeforeBoss = 3;

// Boss definitions
const bossDefinitions = {
    'early-spanish': {
        bossName: 'Ferdinand Magellan',
        isBoss: true,
        preBossEnemies: ['Spanish Soldier'],
        enemiesBeforeBoss: 2
    },
    'late-spanish': {
        bossName: 'Late Spanish Commander Era',
        isBoss: true,
        preBossEnemies: ['Spanish Soldier'],
        enemiesBeforeBoss: 3
    },
    'american-colonial': {
        bossName: 'Commodore George Dewey',
        isBoss: true,
        preBossEnemies: ['American Soldier'],
        enemiesBeforeBoss: 2
    },
    'ww2': {
        bossName: null,
        isBoss: false,
        preBossEnemies: [],
        enemiesBeforeBoss: 0
    }
};

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Character type definitions
const swordUsers = ['Lapu-Lapu', 'Raja Humabon', 'Ferdinand Magellan', 'Spanish Soldier', 
                    'Andres Bonifacio', 'Emilio Aguinaldo', 'Commodore George Dewey', 'General Juan Luna'];
const gunUsers = ['American Soldier', 'Douglas MacArthur', 'Japanese Soldier', 'Late Spanish Commander Era'];
const magicUsers = ['Jose Rizal', 'Apolinario Mabini'];

// ========== INITIALIZATION ==========
function initBattle() {
    console.log('Initializing battle...');
    
    // Get selected era
    const selectedEra = localStorage.getItem('selectedEra') || 'early-spanish';
    currentEra = selectedEra === 'all' ? getRandomEra() : selectedEra;
    localStorage.setItem('currentBattleEra', currentEra);
    
    // Reset battle state
    playerHp = 100;
    enemyHp = 100;
    questionIndex = 0;
    isBossBattle = false;
    enemiesDefeated = 0;
    
    // Set boss info
    const bossDef = bossDefinitions[currentEra];
    if (bossDef && bossDef.bossName) {
        bossName = bossDef.bossName;
        totalEnemiesBeforeBoss = bossDef.enemiesBeforeBoss;
        console.log(`Boss: ${bossName}, enemies before boss: ${totalEnemiesBeforeBoss}`);
    } else {
        bossName = null;
        totalEnemiesBeforeBoss = 0;
    }
    
    // Set background
    setEraBackground(currentEra);
    
    // Load questions
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    loadQuestionsForEra(currentEra, currentLanguage);
    currentLanguageLoaded = currentLanguage;
    
    // Select hero
    selectHero();
    
    // Select initial villain (regular enemy)
    selectInitialVillain();
    
    // Update UI
    updateEnemyDisplay();
    updateCharacterSprites();
    updateHP();
    
    // Load first question
    loadQuestion();
    
    // Hide loading overlay
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
    }, 500);
}

// ========== HELPER FUNCTIONS ==========
function getRandomEra() {
    const eras = Object.keys(eraData);
    return eras[Math.floor(Math.random() * eras.length)];
}

function getUnlockedHeroesForEra(eraKey) {
    const unlockedHeroes = JSON.parse(localStorage.getItem('unlockedHeroes')) || {};
    return unlockedHeroes[eraKey] || [0];
}

function setEraBackground(eraKey) {
    const era = eraData[eraKey];
    const battleAreaBg = document.getElementById('battleAreaBackground');
    
    if (era && era.background && battleAreaBg) {
        battleAreaBg.style.backgroundImage = `url('${era.background}')`;
    }
}

function loadQuestionsForEra(eraKey, language) {
    // Check if questionsData exists
    if (typeof questionsData !== 'undefined' && questionsData[eraKey] && questionsData[eraKey][language]) {
        questions = [...questionsData[eraKey][language]];
    } else {
        // Fallback to default questions
        questions = [{
            question: 'Who was the first Filipino hero to resist Spanish colonization?',
            answers: ['Lapu-Lapu', 'Jose Rizal', 'Andres Bonifacio', 'Emilio Aguinaldo'],
            correct: 'Lapu-Lapu'
        }];
    }
    shuffleArray(questions);
}

function selectHero() {
    const selectedHeroIndex = localStorage.getItem('selectedHero');
    const unlockedHeroes = getUnlockedHeroesForEra(currentEra);
    const heroes = eraData[currentEra].heroes;
    
    if (selectedHeroIndex !== null && heroes[selectedHeroIndex] && unlockedHeroes.includes(parseInt(selectedHeroIndex))) {
        currentHero = heroes[parseInt(selectedHeroIndex)];
    } else {
        currentHero = heroes[unlockedHeroes[0]];
    }
    
    document.getElementById('playerName').textContent = currentHero.name;
    localStorage.removeItem('selectedHero');
}

function selectInitialVillain() {
    const bossDef = bossDefinitions[currentEra];
    
    if (bossDef && bossDef.preBossEnemies.length > 0) {
        // Get a pre-boss enemy
        const villains = eraData[currentEra].villains;
        const preBossEnemies = villains.filter(v => bossDef.preBossEnemies.includes(v.name));
        
        if (preBossEnemies.length > 0) {
            const randomIndex = Math.floor(Math.random() * preBossEnemies.length);
            currentVillain = preBossEnemies[randomIndex];
        } else {
            currentVillain = villains[0];
        }
    } else {
        // No boss in this era, use any villain
        const villains = eraData[currentEra].villains;
        const randomIndex = Math.floor(Math.random() * villains.length);
        currentVillain = villains[randomIndex];
    }
    
    document.getElementById('enemyName').textContent = currentVillain.name;
}

function getNextVillain() {
    const bossDef = bossDefinitions[currentEra];
    
    if (isBossBattle && bossDef && bossDef.bossName) {
        // We're in a boss battle, return the boss
        const villains = eraData[currentEra].villains;
        return villains.find(v => v.name === bossDef.bossName) || villains[0];
    } else if (bossDef && bossDef.preBossEnemies.length > 0) {
        // Get another pre-boss enemy
        const villains = eraData[currentEra].villains;
        const preBossEnemies = villains.filter(v => bossDef.preBossEnemies.includes(v.name));
        
        if (preBossEnemies.length > 0) {
            const randomIndex = Math.floor(Math.random() * preBossEnemies.length);
            return preBossEnemies[randomIndex];
        }
    }
    
    // Fallback
    const villains = eraData[currentEra].villains;
    return villains[0];
}

// ========== UI FUNCTIONS ==========
function updateEnemyDisplay() {
    const enemyNameElement = document.getElementById('enemyName');
    const enemyCounter = document.getElementById('enemyCounter');
    const bossDef = bossDefinitions[currentEra];
    
    if (isBossBattle && bossDef && bossDef.bossName) {
        // BOSS
        enemyNameElement.textContent = `BOSS: ${currentVillain.name} 👑`;
        enemyNameElement.className = 'character-name boss-name';
        
        if (enemyCounter) {
            enemyCounter.innerHTML = '<span class="text-red-400">⚔️ BOSS BATTLE ⚔️</span>';
            enemyCounter.classList.remove('hidden');
        }
    } else {
        // REGULAR ENEMY
        enemyNameElement.textContent = currentVillain.name;
        enemyNameElement.className = 'character-name';
        
        if (enemyCounter && bossDef && bossDef.bossName) {
            const remaining = totalEnemiesBeforeBoss - enemiesDefeated;
            if (remaining > 0) {
                enemyCounter.innerHTML = `Enemies until boss: <span class="text-yellow-400">${remaining}</span>`;
                enemyCounter.classList.remove('hidden');
            } else {
                enemyCounter.classList.add('hidden');
            }
        }
    }
}

function updateCharacterSprites() {
    const playerSprite = document.getElementById('playerSprite');
    const enemySprite = document.getElementById('enemySprite');
    
    if (currentHero && currentHero.folder) {
        playerSprite.src = `${currentHero.folder}/${currentHero.idle}`;
    }
    
    if (currentVillain && currentVillain.folder) {
        enemySprite.src = `${currentVillain.folder}/${currentVillain.idle}`;
    }
}

function updateHP() {
    const playerHpBar = document.getElementById('playerHpBar');
    const enemyHpBar = document.getElementById('enemyHpBar');
    
    playerHpBar.style.width = `${playerHp}%`;
    
    // Boss has 150 HP, regular enemy has 100 HP
    const enemyMaxHp = isBossBattle ? 150 : 100;
    const enemyHpPercent = (enemyHp / enemyMaxHp) * 100;
    enemyHpBar.style.width = `${enemyHpPercent}%`;
    
    // Update HP text
    document.getElementById('playerHpText').textContent = `${playerHp}/100`;
    document.getElementById('enemyHpText').textContent = `${enemyHp}/${enemyMaxHp}`;
}

// ========== QUESTION FUNCTIONS ==========
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadQuestion() {
    if (questionIndex >= questions.length) {
        questionIndex = 0;
        shuffleArray(questions);
    }
    
    currentQuestion = questions[questionIndex];
    document.getElementById('questionText').textContent = currentQuestion.question;
    
    // Shuffle answers
    currentShuffledAnswers = [...currentQuestion.answers];
    shuffleArray(currentShuffledAnswers);
    
    // Update answer buttons
    ['A', 'B', 'C', 'D'].forEach((letter, index) => {
        const textElement = document.getElementById(`answer${letter}Text`);
        if (textElement && currentShuffledAnswers[index]) {
            textElement.textContent = currentShuffledAnswers[index];
        }
    });
    
    enableAnswers();
}

function selectAnswer(index) {
    disableAnswers();
    
    const selectedAnswer = currentShuffledAnswers[index];
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    // Highlight answers
    const buttons = ['A', 'B', 'C', 'D'];
    const selectedButton = document.getElementById(`answer${buttons[index]}`);
    
    if (isCorrect) {
        selectedButton.classList.add('correct');
        attackEnemy();
    } else {
        selectedButton.classList.add('incorrect');
        // Show correct answer
        buttons.forEach((btn, i) => {
            if (currentShuffledAnswers[i] === currentQuestion.correct) {
                document.getElementById(`answer${btn}`).classList.add('correct');
            }
        });
        attackPlayer();
    }
    
    // Reset and load next question
    setTimeout(() => {
        buttons.forEach(btn => {
            const button = document.getElementById(`answer${btn}`);
            button.classList.remove('correct', 'incorrect');
        });
        
        if (enemyHp > 0 && playerHp > 0) {
            questionIndex++;
            loadQuestion();
        }
    }, 2000);
}

function enableAnswers() {
    ['A', 'B', 'C', 'D'].forEach(letter => {
        const button = document.getElementById(`answer${letter}`);
        if (button) button.disabled = false;
    });
}

function disableAnswers() {
    ['A', 'B', 'C', 'D'].forEach(letter => {
        const button = document.getElementById(`answer${letter}`);
        if (button) button.disabled = true;
    });
}

// ========== BATTLE FUNCTIONS ==========
function attackEnemy() {
    let damage = Math.floor(Math.random() * 16) + 15; // 15-30
    if (isBossBattle) damage = Math.floor(damage * 0.7); // Bosses take less damage
    
    enemyHp = Math.max(0, enemyHp - damage);
    
    // Visual effects
    setCharacterState('player', 'attack');
    document.getElementById('playerCharacter').classList.add('attacking');
    
    setTimeout(() => {
        document.getElementById('playerCharacter').classList.remove('attacking');
        setCharacterState('enemy', 'hurt');
        updateHP();
        
        if (enemyHp <= 0) {
            enemiesDefeated++;
            
            const bossDef = bossDefinitions[currentEra];
            if (bossDef && bossDef.bossName && !isBossBattle && enemiesDefeated >= totalEnemiesBeforeBoss) {
                // Start boss battle
                isBossBattle = true;
                currentVillain = getNextVillain();
                enemyHp = 150; // Boss HP
                updateEnemyDisplay();
                updateHP();
                
                // Show boss warning
                showBossWarning();
                
                // Continue with next question
                questionIndex++;
                loadQuestion();
            } else if (isBossBattle) {
                // Boss defeated
                victory();
            } else {
                // Regular enemy defeated
                setTimeout(() => {
                    enemyHp = 100;
                    currentVillain = getNextVillain();
                    updateEnemyDisplay();
                    updateHP();
                    setCharacterState('enemy', 'idle');
                    
                    questionIndex++;
                    loadQuestion();
                }, 1000);
            }
        }
        
        setTimeout(() => {
            setCharacterState('enemy', 'idle');
        }, 1000);
    }, 600);
}

function attackPlayer() {
    let damage = Math.floor(Math.random() * 16) + 15; // 15-30
    if (isBossBattle) damage = Math.floor(damage * 1.5); // Bosses deal more damage
    
    playerHp = Math.max(0, playerHp - damage);
    
    // Visual effects
    setCharacterState('enemy', 'attack');
    document.getElementById('enemyCharacter').classList.add('attacking');
    
    setTimeout(() => {
        document.getElementById('enemyCharacter').classList.remove('attacking');
        setCharacterState('player', 'hurt');
        updateHP();
        
        if (playerHp <= 0) {
            defeat();
        }
        
        setTimeout(() => {
            setCharacterState('player', 'idle');
        }, 1000);
    }, 600);
}

function setCharacterState(character, state) {
    const sprite = character === 'player' ? document.getElementById('playerSprite') : document.getElementById('enemySprite');
    const characterData = character === 'player' ? currentHero : currentVillain;
    
    if (!characterData || !characterData.folder) return;
    
    const spriteFile = characterData[state] || characterData.idle;
    sprite.src = `${characterData.folder}/${spriteFile}`;
    
    if (state !== 'idle') {
        setTimeout(() => {
            sprite.src = `${characterData.folder}/${characterData.idle}`;
        }, 1200);
    }
}

// ========== BOSS FUNCTIONS ==========
function showBossWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.id = 'bossWarning';
    warningDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ef4444, #dc2626, #7f1d1d);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 0 50px rgba(239, 68, 68, 0.7);
        animation: boss-warning 2s ease-out;
    `;
    
    warningDiv.innerHTML = `
        <div class="text-3xl mb-2">⚠️ BOSS BATTLE ⚠️</div>
        <div class="text-xl">${bossName} has appeared!</div>
    `;
    
    document.body.appendChild(warningDiv);
    
    setTimeout(() => {
        if (warningDiv.parentNode) {
            warningDiv.remove();
        }
    }, 2000);
}

// ========== VICTORY/DEFEAT ==========
function victory() {
    setCharacterState('player', 'victory');
    setCharacterState('enemy', 'hurt');
    
    setTimeout(() => {
        unlockHeroAndShowVictory();
    }, 1000);
}

function defeat() {
    setCharacterState('player', 'hurt');
    setCharacterState('enemy', 'victory');
    
    setTimeout(() => {
        document.getElementById('defeatModal').classList.remove('hidden');
    }, 1000);
}

function unlockHeroAndShowVictory() {
    // Mark era as completed
    let completedEras = JSON.parse(localStorage.getItem('completedEras')) || [];
    if (!completedEras.includes(currentEra)) {
        completedEras.push(currentEra);
        localStorage.setItem('completedEras', JSON.stringify(completedEras));
    }
    
    // Update victory modal
    const victoryTitle = document.getElementById('victoryTitle');
    if (isBossBattle && victoryTitle) {
        victoryTitle.textContent = '🎖️ BOSS DEFEATED! 🎖️';
        victoryTitle.classList.add('text-red-700');
    }
    
    // Show modal
    document.getElementById('victoryModal').classList.remove('hidden');
}

function proceedToNextEra() {
    const eraOrder = ['early-spanish', 'late-spanish', 'american-colonial', 'ww2'];
    const currentEraIndex = eraOrder.indexOf(currentEra);
    
    if (currentEraIndex < eraOrder.length - 1) {
        const nextEra = eraOrder[currentEraIndex + 1];
        localStorage.setItem('selectedEra', nextEra);
        window.location.href = 'learning-module.html';
    } else {
        window.location.href = 'collection.html';
    }
}

// ========== INITIALIZE ON LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Battle page loaded');
    initBattle();
});

// ========== GLOBAL FUNCTIONS ==========
window.selectAnswer = selectAnswer;
window.proceedToNextEra = proceedToNextEra;
window.restartBattle = function() {
    location.reload();
};
