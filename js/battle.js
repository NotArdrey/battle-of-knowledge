// battle.js - COMPLETE VERSION WITH BOSS BATTLE MECHANICS AND AUTOMATIC BACKGROUND MUSIC

// Battle game logic
let playerHp = 100;
let enemyHp = 100;
let currentQuestion = null;
let questionIndex = 0;
let currentEra = '';
let currentHero = null;
let currentVillain = null;
let currentLanguageLoaded = '';
let currentShuffledAnswers = [];

// Boss mechanics tracking
let isBossBattle = false;
let bossName = null;
let enemiesDefeated = 0;
let totalEnemiesBeforeBoss = 3; // Default: defeat 3 normal enemies before boss

// Character type definitions
const swordUsers = ['Lapu-Lapu', 'Raja Humabon', 'Ferdinand Magellan', 'Early Spanish Soldier', 
                    'Andres Bonifacio', 'Emilio Aguinaldo', 
                    'Commodore George Dewey', 'General Juan Luna'];

const gunUsers = ['American Soldier', 'Douglas MacArthur', 'Japanese Soldier', 
                  'Spanish Commander', 'Late Spanish Commander Era', 'Late Spanish Soldier Era'];

const magicUsers = ['Jose Rizal', 'Apolinario Mabini'];

// Add this new function to detect if it's an early Spanish soldier
function isEarlySpanishSoldier(characterName, currentEra) {
    return characterName === 'Spanish Soldier' && currentEra === 'early-spanish';
}

// Add this new function to detect if it's a late Spanish soldier
function isLateSpanishSoldier(characterName, currentEra) {
    return (characterName === 'Spanish Soldier' || characterName === 'Late Spanish Soldier Era') && 
           currentEra === 'late-spanish';
}

// Boss definitions for each era
const bossDefinitions = {
    'early-spanish': {
        bossName: 'Ferdinand Magellan',
        isBoss: true,
        isFinalBoss: true,
        preBossEnemies: ['Early Spanish Soldier'],
        enemiesBeforeBoss: 2 // Defeat 2 Spanish Soldiers before Magellan
    },
    'late-spanish': {
        bossName: 'Spanish Commander',
        isBoss: true,
        isFinalBoss: true,
        preBossEnemies: ['Spanish Soldier'],
        enemiesBeforeBoss: 3 // Defeat 3 Spanish Soldiers before Commander
    },
    'american-colonial': {
        bossName: 'Commodore George Dewey',
        isBoss: true,
        isFinalBoss: true,
        preBossEnemies: ['American Soldier'],
        enemiesBeforeBoss: 2 // Defeat 2 American Soldiers before Dewey
    },
    'ww2': {
        bossName: null, // No boss for WW2 era
        isBoss: false,
        isFinalBoss: false,
        preBossEnemies: [],
        enemiesBeforeBoss: 0
    }
};

// Persisted progression helpers
function getEraProgressMap() {
    try {
        return JSON.parse(localStorage.getItem('eraProgress')) || {};
    } catch (error) {
        console.warn('Unable to parse eraProgress, resetting', error);
        return {};
    }
}

function updateEraProgress(eraKey, updates) {
    const progress = getEraProgressMap();
    const existing = progress[eraKey] || { lessonsComplete: false, bossDefeated: false };
    progress[eraKey] = { ...existing, ...updates };
    localStorage.setItem('eraProgress', JSON.stringify(progress));
}

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Save battle progress to localStorage
function saveBattleProgress() {
    const battleState = {
        playerHp: playerHp,
        enemyHp: enemyHp,
        questionIndex: questionIndex,
        currentEra: currentEra,
        enemiesDefeated: enemiesDefeated,
        isBossBattle: isBossBattle,
        currentHeroName: currentHero ? currentHero.name : null,
        currentVillainName: currentVillain ? currentVillain.name : null,
        timestamp: Date.now()
    };
    localStorage.setItem('battleProgress', JSON.stringify(battleState));
    console.log('Battle progress saved:', battleState);
}

// Load battle progress from localStorage
function loadBattleProgress() {
    const saved = localStorage.getItem('battleProgress');
    if (!saved) return null;
    
    try {
        const battleState = JSON.parse(saved);
        
        // Check if save is older than 1 hour (3600000 ms) - expire old saves
        const oneHour = 3600000;
        if (Date.now() - battleState.timestamp > oneHour) {
            clearBattleProgress();
            return null;
        }
        
        // Check if it's for the same era
        const selectedEra = localStorage.getItem('selectedEra') || 'early-spanish';
        if (battleState.currentEra !== selectedEra && selectedEra !== 'all') {
            clearBattleProgress();
            return null;
        }
        
        return battleState;
    } catch (e) {
        console.error('Error loading battle progress:', e);
        clearBattleProgress();
        return null;
    }
}

// Clear battle progress
function clearBattleProgress() {
    localStorage.removeItem('battleProgress');
    console.log('Battle progress cleared');
}

// Sound effects - preload them
const soundEffects = {
    sword: new Audio('assets/SFX/Attacks/Sword.mp3'),
    gun: new Audio('assets/SFX/Attacks/Gun.mp3'),
    magic: new Audio('assets/SFX/Attacks/Magic.mp3'),
    hit: new Audio('assets/SFX/Attacks/Hit.mp3'),
    damage: new Audio('assets/SFX/Attacks/Damage.mp3'),
    bossIntro: new Audio('assets/SFX/Boss/boss-intro.mp3'), // Optional: add boss intro sound
    victoryFanfare: new Audio('assets/SFX/Boss/victory-fanfare.mp3') // Optional: victory sound
};

// Background music objects
const backgroundMusic = {
    'early-spanish': new Audio('assets/Game-BGM/Battlefield BGMs/Early Spanish Era Theme.mp3'),
    'late-spanish': new Audio('assets/Game-BGM/Battlefield BGMs/Late Spanish Era Theme.mp3'),
    'american-colonial': new Audio('assets/Game-BGM/Battlefield BGMs/American Colonial Theme.mp3'),
    'ww2': new Audio('assets/Game-BGM/Battlefield BGMs/WW2 Theme.mp3')
};

// Configure sound settings
Object.values(soundEffects).forEach(sound => {
    sound.preload = 'auto';
    sound.volume = isMobile ? 0.5 : 0.7;
});

// Configure background music settings
Object.values(backgroundMusic).forEach(bgm => {
    bgm.preload = 'auto';
    bgm.loop = true;
    bgm.volume = isMobile ? 0.4 : 0.6;
});

// Play sound effect with error handling
function playSound(soundName) {
    try {
        const sound = soundEffects[soundName];
        if (sound) {
            const soundClone = new Audio(sound.src);
            soundClone.volume = sound.volume;
            soundClone.play().catch(e => console.log('Sound play failed:', e));
        }
    } catch (error) {
        console.log('Sound error:', error);
    }
}

// Play background music for current era - AUTOMATICALLY
function playBackgroundMusic() {
    if (!currentEra || !backgroundMusic[currentEra]) return;
    
    try {
        // Stop any currently playing music
        stopAllBackgroundMusic();
        
        // Play the current era's music
        const bgm = backgroundMusic[currentEra];
        bgm.currentTime = 0;
        bgm.volume = isMobile ? 0.4 : 0.6;
        
        // Try to play automatically
        bgm.play().catch(e => {
            console.log('Background music autoplay blocked:', e);
            // Music will play after user interaction
        });
    } catch (error) {
        console.log('Background music error:', error);
    }
}

// Stop all background music
function stopAllBackgroundMusic() {
    Object.values(backgroundMusic).forEach(bgm => {
        bgm.pause();
        bgm.currentTime = 0;
    });
}

// Stop current background music
function stopBackgroundMusic() {
    if (currentEra && backgroundMusic[currentEra]) {
        backgroundMusic[currentEra].pause();
        backgroundMusic[currentEra].currentTime = 0;
    }
}

// Set era background
function setEraBackground(eraKey) {
    console.log(`setEraBackground called with era: ${eraKey}`);
    
    const era = eraData[eraKey];
    
    if (era && era.background) {
        const battleAreaBg = document.getElementById('battleAreaBackground');
        if (battleAreaBg) {
            battleAreaBg.style.backgroundImage = `url('${era.background}')`;
            battleAreaBg.style.opacity = '1';
            battleAreaBg.style.backgroundSize = 'cover';
            battleAreaBg.style.backgroundPosition = 'center';
            battleAreaBg.style.backgroundRepeat = 'no-repeat';
            battleAreaBg.style.transition = 'background-image 0.5s ease-in-out';
        }
    } else {
        setDefaultBackground();
    }
}

// Set default background for battle area
function setDefaultBackground() {
    const defaultBg = 'assets/Background/1. Early Spanish Era/Early Spanish Era.png';
    
    const battleAreaBg = document.getElementById('battleAreaBackground');
    if (battleAreaBg) {
        battleAreaBg.style.backgroundImage = `url('${defaultBg}')`;
        battleAreaBg.style.opacity = '1';
    }
}

// Get unlocked heroes for an era
function getUnlockedHeroesForEra(eraKey) {
    const unlockedHeroes = JSON.parse(localStorage.getItem('unlockedHeroes')) || {};
    return unlockedHeroes[eraKey] || [0];
}

// Get random villain for current era
function getRandomVillain(eraKey, isPreBoss = false) {
    const bossDef = bossDefinitions[eraKey];
    
    if (isBossBattle && bossDef && bossDef.bossName) {
        // Return the boss
        const villains = eraData[eraKey].villains;
        const boss = villains.find(v => v.name === bossDef.bossName);
        if (boss) return boss;
    }
    
    if (isPreBoss && bossDef && bossDef.preBossEnemies.length > 0) {
        // Return a pre-boss enemy
        const villains = eraData[eraKey].villains;
        const preBossEnemies = villains.filter(v => bossDef.preBossEnemies.includes(v.name));
        if (preBossEnemies.length > 0) {
            const randomIndex = Math.floor(Math.random() * preBossEnemies.length);
            return preBossEnemies[randomIndex];
        }
    }
    
    // Return any random villain
    const villains = eraData[eraKey].villains;
    const randomIndex = Math.floor(Math.random() * villains.length);
    return villains[randomIndex];
}

// Get character sprite
function getCharacterSprite(characterData, state) {
    if (!characterData || !characterData.folder) {
        if (characterData && characterData.type === 'hero') {
            return state === 'attack' ? 'assets/lapulapu-attack.png' :
                   state === 'hurt' ? 'assets/lapulapu-hurt.png' :
                   state === 'victory' ? 'assets/lapulapu-victory.png' :
                   'assets/lapulapu-idle.png';
        } else {
            return state === 'attack' ? 'assets/magellan-attack.png' :
                   state === 'hurt' ? 'assets/magellan-hurt.png' :
                   state === 'victory' ? 'assets/magellan-victory.png' :
                   'assets/magellan-idle.png';
        }
    }
    
    const spriteFile = characterData[state] || characterData.idle;
    return `${characterData.folder}/${spriteFile}`;
}

// Initialize battle with boss mechanics
function initBattle() {
    const selectedEra = localStorage.getItem('selectedEra') || 'early-spanish';
    
    // Check for saved battle progress
    const savedProgress = loadBattleProgress();
    
    if (savedProgress) {
        // Restore saved battle state
        console.log('Restoring saved battle progress...');
        currentEra = savedProgress.currentEra;
        playerHp = savedProgress.playerHp;
        enemyHp = savedProgress.enemyHp;
        questionIndex = savedProgress.questionIndex;
        enemiesDefeated = savedProgress.enemiesDefeated;
        isBossBattle = savedProgress.isBossBattle;
        
        // Set up boss mechanics
        const bossDef = bossDefinitions[currentEra];
        if (bossDef && bossDef.bossName) {
            totalEnemiesBeforeBoss = bossDef.enemiesBeforeBoss;
            bossName = bossDef.bossName;
        } else {
            bossName = null;
            totalEnemiesBeforeBoss = 0;
        }
        
        // Set era-specific backgrounds
        setEraBackground(currentEra);
        
        // Load questions
        const currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        if (questionsData[currentEra] && questionsData[currentEra][currentLanguage]) {
            questions = [...questionsData[currentEra][currentLanguage]];
            shuffleArray(questions);
        } else {
            questions = [...questionsData['early-spanish'][currentLanguage]];
            shuffleArray(questions);
        }
        currentLanguageLoaded = currentLanguage;
        
        // Restore hero
        const unlockedHeroes = getUnlockedHeroesForEra(currentEra);
        if (savedProgress.currentHeroName) {
            currentHero = eraData[currentEra].heroes.find(h => h.name === savedProgress.currentHeroName);
        }
        if (!currentHero) {
            currentHero = eraData[currentEra].heroes[unlockedHeroes[0]];
        }
        
        // Restore villain
        if (savedProgress.currentVillainName) {
            currentVillain = eraData[currentEra].villains.find(v => v.name === savedProgress.currentVillainName);
        }
        if (!currentVillain) {
            currentVillain = getRandomVillain(currentEra, !isBossBattle);
        }
        
        // Clear the selected hero from storage
        localStorage.removeItem('selectedHero');
        
    } else {
        // Start fresh battle
        if (selectedEra === 'all') {
            currentEra = getRandomEra();
        } else {
            currentEra = selectedEra;
        }
        
        // Save the current era for use in this battle
        localStorage.setItem('currentBattleEra', currentEra);
        
        // Reset battle state
        playerHp = 100;
        enemyHp = 100;
        questionIndex = 0;
        isBossBattle = false;
        enemiesDefeated = 0;
        
        // Check if this era has a boss
        const bossDef = bossDefinitions[currentEra];
        if (bossDef && bossDef.bossName) {
            totalEnemiesBeforeBoss = bossDef.enemiesBeforeBoss;
            bossName = bossDef.bossName;
            console.log(`Boss detected for ${currentEra}: ${bossName}`);
            console.log(`Need to defeat ${totalEnemiesBeforeBoss} enemies before boss`);
        } else {
            bossName = null;
            totalEnemiesBeforeBoss = 0;
            console.log(`No boss for ${currentEra}`);
        }
        
        // Set era-specific backgrounds
        setEraBackground(currentEra);
        
        // Load questions
        const currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        if (questionsData[currentEra] && questionsData[currentEra][currentLanguage]) {
            questions = [...questionsData[currentEra][currentLanguage]];
            shuffleArray(questions);
        } else {
            questions = [...questionsData['early-spanish'][currentLanguage]];
            shuffleArray(questions);
        }
        currentLanguageLoaded = currentLanguage;
        
        // Select hero
        const selectedHeroIndex = localStorage.getItem('selectedHero');
        const unlockedHeroes = getUnlockedHeroesForEra(currentEra);
        
        if (selectedHeroIndex !== null && eraData[currentEra].heroes[selectedHeroIndex]) {
            if (unlockedHeroes.includes(parseInt(selectedHeroIndex))) {
                currentHero = eraData[currentEra].heroes[parseInt(selectedHeroIndex)];
            } else {
                currentHero = eraData[currentEra].heroes[unlockedHeroes[0]];
            }
            localStorage.removeItem('selectedHero');
        } else {
            currentHero = eraData[currentEra].heroes[unlockedHeroes[0]];
        }
        
        // Select villain (regular enemy for now)
        currentVillain = getRandomVillain(currentEra, true); // Start with pre-boss enemies
    }

    // Ensure progress record exists for the current era
    updateEraProgress(currentEra, {});
    
    // Update enemy name display
    updateEnemyDisplay();
    
    // Set character sprites
    updateCharacterSprites();
    
    // Update character names
    document.getElementById('playerName').textContent = currentHero.name;
    document.getElementById('enemyName').textContent = currentVillain.name;
    
    // Load question
    loadQuestion();
    
    // Play background music AUTOMATICALLY (after a short delay to ensure everything is loaded)
    setTimeout(() => {
        playBackgroundMusic();
    }, 300);
    
    // Save initial progress
    saveBattleProgress();
}

// Update enemy display with boss indicator
function updateEnemyDisplay() {
    const enemyNameElement = document.getElementById('enemyName');
    const bossDef = bossDefinitions[currentEra];
    
    if (isBossBattle && bossDef && bossDef.bossName) {
        enemyNameElement.textContent = `BOSS: ${currentVillain.name} 👑`;
        enemyNameElement.classList.add('text-red-700', 'font-extrabold');
        
        // Update HP bar color for boss
        const enemyHpBar = document.getElementById('enemyHpBar');
        enemyHpBar.style.background = 'linear-gradient(to right, #ef4444, #dc2626, #7f1d1d)';
        
        // Show boss warning if this is the first boss appearance
        if (enemiesDefeated === totalEnemiesBeforeBoss) {
            showBossWarning();
        }
    } else {
        enemyNameElement.textContent = currentVillain.name;
        enemyNameElement.classList.remove('text-red-700', 'font-extrabold');
        
        // Show enemy count if not boss
        const bossDef = bossDefinitions[currentEra];
        if (bossDef && bossDef.bossName) {
            const remaining = totalEnemiesBeforeBoss - enemiesDefeated;
            if (remaining > 0) {
                enemyNameElement.textContent = `${currentVillain.name} (${remaining} to boss)`;
            }
        }
    }
}

// Show boss warning
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
    
    // Play boss intro sound if available
    if (soundEffects.bossIntro) {
        playSound('bossIntro');
    }
    
    // Remove warning after animation
    setTimeout(() => {
        warningDiv.remove();
    }, 2000);
}

// Update character sprites to idle state
function updateCharacterSprites() {
    const playerSprite = document.getElementById('playerSprite');
    const enemySprite = document.getElementById('enemySprite');
    
    playerSprite.src = getCharacterSprite(currentHero, 'idle');
    playerSprite.alt = currentHero.name;
    
    enemySprite.src = getCharacterSprite(currentVillain, 'idle');
    enemySprite.alt = currentVillain.name;
}

// Set character state
function setCharacterState(character, state) {
    const sprite = character === 'player' ? document.getElementById('playerSprite') : document.getElementById('enemySprite');
    const characterData = character === 'player' ? currentHero : currentVillain;
    const enemyContainer = character === 'enemy' ? document.getElementById('enemyCharacter') : null;
    const isEarlySpanishSoldier = enemyContainer && characterData && characterData.name === 'Early Spanish Soldier';

    // Early Spanish Soldier attack sprite already faces left, so temporarily remove the default flip
    if (isEarlySpanishSoldier) {
        if (state === 'attack') {
            enemyContainer.classList.add('no-flip');
        } else {
            enemyContainer.classList.remove('no-flip');
        }
    }
    
    sprite.src = getCharacterSprite(characterData, state);
    
    if (state !== 'idle') {
        setTimeout(() => {
            sprite.src = getCharacterSprite(characterData, 'idle');
            
            if (isEarlySpanishSoldier && enemyContainer) {
                enemyContainer.classList.remove('no-flip');
            }
        }, 1200);
    }
}

// Shuffle array helper
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Load question
function loadQuestion() {
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const languageChanged = currentLanguageLoaded !== currentLanguage;
    
    if (languageChanged) {
        if (questionsData[currentEra] && questionsData[currentEra][currentLanguage]) {
            questions = [...questionsData[currentEra][currentLanguage]];
        } else {
            questions = [...questionsData['early-spanish'][currentLanguage]];
        }
        currentLanguageLoaded = currentLanguage;
        
        if (currentShuffledAnswers.length > 0 && currentQuestion) {
            const newQuestion = questions[questionIndex];
            const oldQuestion = currentQuestion;
            const newShuffledAnswers = [];
            
            currentShuffledAnswers.forEach(oldAnswer => {
                const indexInOldAnswers = oldQuestion.answers.indexOf(oldAnswer);
                if (indexInOldAnswers !== -1) {
                    newShuffledAnswers.push(newQuestion.answers[indexInOldAnswers]);
                }
            });
            
            currentShuffledAnswers = newShuffledAnswers;
        }
    }
    
    if (questionIndex >= questions.length) {
        questionIndex = 0;
        shuffleArray(questions);
    }
    
    currentQuestion = questions[questionIndex];
    document.getElementById('questionText').textContent = currentQuestion.question;
    
    if (!languageChanged || currentShuffledAnswers.length === 0) {
        currentShuffledAnswers = [...currentQuestion.answers];
        shuffleArray(currentShuffledAnswers);
    }
    
    const answerElements = ['answerA', 'answerB', 'answerC', 'answerD'];
    answerElements.forEach((elementId, index) => {
        const button = document.getElementById(elementId);
        const textSpan = document.getElementById(elementId + 'Text');
        if (button && textSpan) {
            textSpan.textContent = currentShuffledAnswers[index] || '...';
        }
    });
    
    currentQuestion.shuffledAnswers = currentShuffledAnswers;
    
    enableAnswers();
    
    // Save progress after loading new question
    saveBattleProgress();
}

// Select answer
function selectAnswer(index) {
    disableAnswers();
    
    const selectedAnswer = currentQuestion.shuffledAnswers[index];
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    const buttons = ['answerA', 'answerB', 'answerC', 'answerD'];
    const selectedButton = document.getElementById(buttons[index]);
    
    if (isCorrect) {
        selectedButton.classList.add('correct');
        attackEnemy();
    } else {
        selectedButton.classList.add('incorrect');
        buttons.forEach((btnId, i) => {
            if (currentQuestion.shuffledAnswers[i] === currentQuestion.correct) {
                document.getElementById(btnId).classList.add('correct');
            }
        });
        attackPlayer();
    }
    
    setTimeout(() => {
        buttons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            btn.classList.remove('correct', 'incorrect');
        });
        
        if (enemyHp > 0 && playerHp > 0) {
            questionIndex++;
            currentShuffledAnswers = [];
            loadQuestion();
        }
    }, 2500);
}

// Mobile-optimized screen shake
function mobileShake() {
    if (isMobile) {
        document.body.style.transform = 'translateX(-5px)';
        
        setTimeout(() => {
            document.body.style.transform = 'translateX(5px)';
            
            setTimeout(() => {
                document.body.style.transform = 'translateX(-3px)';
                
                setTimeout(() => {
                    document.body.style.transform = 'translateX(3px)';
                    
                    setTimeout(() => {
                        document.body.style.transform = 'translateX(0)';
                    }, 40);
                }, 40);
            }, 40);
        }, 40);
    } else {
        document.body.style.animation = 'mobile-shake 0.4s ease-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 400);
    }
}

// Enhanced attack functions with boss adjustments
function createGiantSwordEffect(isAttacker) {
    playSound('sword');
    
    const characterElement = isAttacker ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const targetElement = isAttacker ? 
        document.getElementById('enemyCharacter') : 
        document.getElementById('playerCharacter');
    
    const battleArea = document.querySelector('.battle-area');
    const rect = characterElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const battleRect = battleArea.getBoundingClientRect();
    
    // Different clip-path for attacker vs defender - flipped for enemy attacks
    const clipPath = isAttacker 
        ? 'polygon(0% 40%, 20% 30%, 40% 20%, 60% 30%, 80% 40%, 100% 60%, 80% 70%, 60% 80%, 40% 70%, 20% 60%)'
        : 'polygon(100% 40%, 80% 30%, 60% 20%, 40% 30%, 20% 40%, 0% 60%, 20% 70%, 40% 80%, 60% 70%, 80% 60%)';
    
    const swordSlash = document.createElement('div');
    swordSlash.style.cssText = `
        position: fixed;
        width: ${isMobile ? '200px' : '350px'};
        height: ${isMobile ? '100px' : '180px'};
        background: linear-gradient(${isAttacker ? '45deg' : '135deg'}, 
            transparent 0%,
            rgba(251, 191, 36, 0.95) 25%,
            rgba(245, 158, 11, 1) 50%,
            rgba(220, 38, 38, 1) 75%,
            rgba(251, 191, 36, 0.95) 100%);
        z-index: 9999;
        pointer-events: none;
        filter: drop-shadow(0 0 ${isMobile ? '20px' : '40px'} #fbbf24) 
                drop-shadow(0 0 ${isMobile ? '40px' : '80px'} #dc2626);
        clip-path: ${clipPath};
        mix-blend-mode: screen;
    `;
    
    // For player (left side) attacking: start from player's right, move toward enemy
    // For enemy (right side) attacking: start from enemy's left, move toward player
    const startX = isAttacker ? rect.right - (isMobile ? 80 : 150) : rect.left - (isMobile ? 100 : 200);
    const startY = rect.top + rect.height * 0.3;
    const endX = isAttacker ? targetRect.left : targetRect.right;
    
    swordSlash.style.left = `${startX}px`;
    swordSlash.style.top = `${startY}px`;
    swordSlash.style.transform = `rotate(${isAttacker ? '15' : '-15'}deg) scale(0)`;
    
    document.body.appendChild(swordSlash);
    
    // Enhanced effect for boss battles
    const effectCount = isBossBattle ? (isMobile ? 6 : 12) : (isMobile ? 3 : 6);
    
    for (let i = 0; i < effectCount; i++) {
        setTimeout(() => {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: ${isMobile ? '100px' : '200px'};
                height: ${isMobile ? '30px' : '60px'};
                background: linear-gradient(${isAttacker ? '45deg' : '135deg'}, 
                    rgba(251, 191, 36, 0.8) 0%,
                    rgba(220, 38, 38, 0.6) 100%);
                z-index: 9998;
                pointer-events: none;
                filter: blur(${isMobile ? '3px' : '5px'});
                opacity: 0.8;
                left: ${startX + (isAttacker ? i * 20 : -i * 20)}px;
                top: ${startY + (i * 10)}px;
                transform: rotate(${isAttacker ? '15' : '-15'}deg) scale(0);
                border-radius: ${isMobile ? '5px' : '10px'};
            `;
            
            document.body.appendChild(trail);
            
            trail.animate([
                { transform: `rotate(${isAttacker ? '15' : '-15'}deg) scale(0)`, opacity: 0 },
                { transform: `rotate(${isAttacker ? '15' : '-15'}deg) scale(${1.5 + i * 0.2})`, opacity: 0.7 },
                { transform: `rotate(${isAttacker ? '15' : '-15'}deg) scale(0)`, opacity: 0 }
            ], {
                duration: isMobile ? 400 : 600,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => trail.remove(), isMobile ? 400 : 600);
        }, i * 50);
    }
    
    swordSlash.animate([
        { 
            transform: `rotate(${isAttacker ? '15' : '-15'}deg) scale(0)`, 
            opacity: 0
        },
        { 
            transform: `rotate(${isAttacker ? '15' : '-15'}deg) scale(${isMobile ? '1.8' : '2.5'})`, 
            opacity: 1
        },
        { 
            transform: `rotate(${isAttacker ? '15' : '-15'}deg) scale(${isMobile ? '2.2' : '3'})`, 
            opacity: 0.8,
            left: `${endX}px`
        },
        { 
            transform: `rotate(${isAttacker ? '15' : '-15'}deg) scale(${isMobile ? '2.5' : '3.5'})`, 
            opacity: 0,
            left: `${endX}px`,
            top: `${startY + (isMobile ? 80 : 150)}px`
        }
    ], {
        duration: isMobile ? 500 : 700,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    setTimeout(() => {
        for (let i = 0; i < (isMobile ? 2 : 4); i++) {
            const wave = document.createElement('div');
            wave.style.cssText = `
                position: fixed;
                width: ${isMobile ? '100px' : '200px'};
                height: ${isMobile ? '100px' : '200px'};
                border: ${isMobile ? '4px' : '8px'} solid rgba(251, 191, 36, 0.6);
                border-radius: 50%;
                z-index: 9997;
                pointer-events: none;
                left: ${endX}px;
                top: ${startY + (isMobile ? 40 : 80)}px;
                transform: scale(0);
            `;
            
            document.body.appendChild(wave);
            
            wave.animate([
                { transform: 'scale(0)', opacity: 0 },
                { transform: 'scale(1)', opacity: 0.7 },
                { transform: 'scale(2.5)', opacity: 0 }
            ], {
                duration: isMobile ? 600 : 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => wave.remove(), isMobile ? 600 : 800);
        }
    }, isMobile ? 200 : 300);
    
    setTimeout(() => swordSlash.remove(), isMobile ? 500 : 700);
    
    return swordSlash;
}

function createGiantGunEffect(isAttacker) {
    setTimeout(() => playSound('gun'), 0);
    if (!isMobile) {
        setTimeout(() => playSound('gun'), 50);
        setTimeout(() => playSound('gun'), 100);
    }
    
    const characterElement = isAttacker ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const battleArea = document.querySelector('.battle-area');
    const rect = characterElement.getBoundingClientRect();
    const battleRect = battleArea.getBoundingClientRect();
    
    const muzzleFlash = document.createElement('div');
    const flashSize = isMobile ? 100 : 180;
    muzzleFlash.style.cssText = `
        position: fixed;
        width: ${flashSize}px;
        height: ${flashSize}px;
        background: radial-gradient(circle, 
            rgba(255, 255, 255, 1) 0%,
            rgba(251, 191, 36, 1) 25%,
            rgba(245, 158, 11, 0.9) 50%,
            rgba(220, 38, 38, 0.8) 75%,
            rgba(153, 27, 27, 0.6) 100%);
        border-radius: 50%;
        z-index: 9999;
        pointer-events: none;
        filter: drop-shadow(0 0 ${isMobile ? '30px' : '60px'} #dc2626);
        mix-blend-mode: screen;
        left: ${isAttacker ? rect.right - (isMobile ? 60 : 100) : rect.left + (isMobile ? 60 : 100)}px;
        top: ${rect.top + rect.height * 0.4}px;
        transform: translate(-50%, -50%) scale(0);
    `;
    
    document.body.appendChild(muzzleFlash);
    
    muzzleFlash.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(2.5)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(3.5)', opacity: 0.8 },
        { transform: 'translate(-50%, -50%) scale(5)', opacity: 0 }
    ], {
        duration: isMobile ? 400 : 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    setTimeout(() => {
        const bulletTrail = document.createElement('div');
        const trailLength = Math.abs(battleRect.right - rect.right);
        bulletTrail.style.cssText = `
            position: fixed;
            width: ${trailLength}px;
            height: ${isMobile ? '15px' : '30px'};
            background: linear-gradient(90deg, 
                rgba(255, 255, 255, 1) 0%,
                rgba(251, 191, 36, 1) 20%,
                rgba(245, 158, 11, 1) 40%,
                rgba(220, 38, 38, 1) 60%,
                rgba(251, 191, 36, 0.8) 80%,
                rgba(255, 255, 255, 0) 100%);
            z-index: 9998;
            pointer-events: none;
            filter: drop-shadow(0 0 ${isMobile ? '15px' : '30px'} #dc2626);
            border-radius: ${isMobile ? '8px' : '15px'};
            mix-blend-mode: screen;
            left: ${isAttacker ? rect.right : rect.left}px;
            top: ${rect.top + rect.height * 0.45}px;
            transform-origin: ${isAttacker ? 'left center' : 'right center'};
            transform: ${isAttacker ? 'scaleX(0.1)' : 'scaleX(-0.1)'};
        `;
        
        document.body.appendChild(bulletTrail);
        
        bulletTrail.animate([
            { transform: `${isAttacker ? 'scaleX(0.1)' : 'scaleX(-0.1)'}`, opacity: 0 },
            { transform: `${isAttacker ? 'scaleX(2)' : 'scaleX(-2)'}`, opacity: 1 },
            { transform: `${isAttacker ? 'scaleX(2.5)' : 'scaleX(-2.5)'}`, opacity: 0.7 },
            { transform: `${isAttacker ? 'scaleX(0.1)' : 'scaleX(-0.1)'}`, opacity: 0 }
        ], {
            duration: isMobile ? 300 : 500,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        });
        
        for (let i = 0; i < (isMobile ? 5 : 10); i++) {
            setTimeout(() => {
                const casing = document.createElement('div');
                casing.style.cssText = `
                    position: fixed;
                    width: ${isMobile ? '20px' : '40px'};
                    height: ${isMobile ? '10px' : '20px'};
                    background: linear-gradient(45deg, 
                        rgba(251, 191, 36, 1) 0%,
                        rgba(153, 27, 27, 1) 100%);
                    border-radius: ${isMobile ? '2px' : '4px'};
                    z-index: 9997;
                    pointer-events: none;
                    filter: drop-shadow(0 0 ${isMobile ? '8px' : '15px'} #fbbf24);
                    left: ${(isAttacker ? rect.right : rect.left) - (isMobile ? 10 : 20)}px;
                    top: ${rect.top + rect.height * 0.4}px;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                
                document.body.appendChild(casing);
                
                const angle = (Math.random() * 80 + 50) * (isAttacker ? -1 : 1);
                const distance = (isMobile ? 60 : 120) + Math.random() * (isMobile ? 80 : 160);
                
                casing.animate([
                    { 
                        transform: `rotate(0deg) translate(0, 0)`,
                        opacity: 1 
                    },
                    { 
                        transform: `rotate(${angle}deg) translate(${distance}px, ${-distance}px)`,
                        opacity: 0.6 
                    },
                    { 
                        transform: `rotate(${angle * 2}deg) translate(${distance * 1.5}px, ${-distance * 0.5}px)`,
                        opacity: 0 
                    }
                ], {
                    duration: isMobile ? 500 : 800,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    fill: 'forwards'
                });
                
                setTimeout(() => casing.remove(), isMobile ? 500 : 800);
            }, i * (isMobile ? 40 : 60));
        }
        
        setTimeout(() => {
            muzzleFlash.remove();
            bulletTrail.remove();
        }, isMobile ? 400 : 600);
    }, 50);
    
    return muzzleFlash;
}

function createGiantMagicEffect(isAttacker) {
    playSound('magic');
    
    const characterElement = isAttacker ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const battleArea = document.querySelector('.battle-area');
    const rect = characterElement.getBoundingClientRect();
    const battleRect = battleArea.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const magicSphere = document.createElement('div');
    const sphereSize = isMobile ? 120 : 240;
    magicSphere.style.cssText = `
        position: fixed;
        width: ${sphereSize}px;
        height: ${sphereSize}px;
        background: radial-gradient(circle, 
            rgba(255, 255, 255, 1) 0%,
            rgba(199, 210, 254, 0.9) 20%,
            rgba(139, 92, 246, 0.8) 40%,
            rgba(79, 70, 229, 0.7) 60%,
            rgba(67, 56, 202, 0.6) 80%,
            rgba(49, 46, 129, 0.4) 100%);
        border-radius: 50%;
        z-index: 9999;
        pointer-events: none;
        filter: drop-shadow(0 0 ${isMobile ? '40px' : '80px'} #8b5cf6) 
                drop-shadow(0 0 ${isMobile ? '80px' : '160px'} #4f46e5);
        mix-blend-mode: screen;
        left: ${centerX}px;
        top: ${centerY}px;
        transform: translate(-50%, -50%) scale(0);
    `;
    
    document.body.appendChild(magicSphere);
    
    magicSphere.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1.8)', opacity: 0.9 },
        { transform: 'translate(-50%, -50%) scale(2.2)', opacity: 0.8 },
        { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 }
    ], {
        duration: isMobile ? 600 : 900,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    for (let i = 0; i < (isMobile ? 3 : 6); i++) {
        setTimeout(() => {
            const wave = document.createElement('div');
            const waveSize = (isMobile ? 100 : 200) + i * (isMobile ? 40 : 80);
            wave.style.cssText = `
                position: fixed;
                width: ${waveSize}px;
                height: ${waveSize}px;
                border: ${isMobile ? '5px' : '10px'} solid rgba(139, 92, 246, 0.5);
                border-radius: 50%;
                z-index: 9998;
                pointer-events: none;
                filter: drop-shadow(0 0 ${isMobile ? '15px' : '30px'} #8b5cf6);
                left: ${centerX}px;
                top: ${centerY}px;
                transform: translate(-50%, -50%) scale(0);
            `;
            
            document.body.appendChild(wave);
            
            wave.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.7 },
                { transform: 'translate(-50%, -50%) scale(2.5)', opacity: 0 }
            ], {
                duration: isMobile ? 800 : 1200,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => wave.remove(), isMobile ? 800 : 1200);
        }, i * (isMobile ? 150 : 200));
    }
    
    for (let i = 0; i < (isMobile ? 15 : 30); i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            const size = (isMobile ? 8 : 15) + Math.random() * (isMobile ? 12 : 25);
            const angle = Math.random() * Math.PI * 2;
            const distance = (isMobile ? 80 : 160) + Math.random() * (isMobile ? 120 : 240);
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, 
                    rgba(255, 255, 255, 1) 0%,
                    rgba(199, 210, 254, 0.8) 50%,
                    rgba(139, 92, 246, 0.6) 100%);
                border-radius: 50%;
                z-index: 9997;
                pointer-events: none;
                filter: drop-shadow(0 0 ${isMobile ? '5px' : '10px'} #a78bfa);
                left: ${centerX}px;
                top: ${centerY}px;
                transform: translate(-50%, -50%);
            `;
            
            document.body.appendChild(particle);
            
            const targetX = centerX + Math.cos(angle) * distance;
            const targetY = centerY + Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 0 
                },
                { 
                    transform: 'translate(-50%, -50%) scale(1.2)',
                    opacity: 1 
                },
                { 
                    transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(0)`,
                    opacity: 0 
                }
            ], {
                duration: isMobile ? 500 : 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => particle.remove(), isMobile ? 500 : 800);
        }, i * (isMobile ? 30 : 50));
    }
    
    for (let i = 0; i < (isMobile ? 6 : 12); i++) {
        setTimeout(() => {
            const rune = document.createElement('div');
            rune.style.cssText = `
                position: fixed;
                width: ${isMobile ? '40px' : '80px'};
                height: ${isMobile ? '40px' : '80px'};
                background: radial-gradient(circle, 
                    rgba(139, 92, 246, 0.7) 0%,
                    rgba(79, 70, 229, 0.5) 100%);
                clip-path: polygon(${Array.from({length: 6}, (_, j) => 
                    `${50 + 30 * Math.cos((j * 60 + Math.random() * 30) * Math.PI/180)}% ` +
                    `${50 + 30 * Math.sin((j * 60 + Math.random() * 30) * Math.PI/180)}%`
                ).join(', ')});
                z-index: 9996;
                pointer-events: none;
                filter: drop-shadow(0 0 ${isMobile ? '10px' : '20px'} #8b5cf6);
                left: ${centerX + Math.random() * (isMobile ? 100 : 200) - (isMobile ? 50 : 100)}px;
                top: ${centerY + Math.random() * (isMobile ? 100 : 200) - (isMobile ? 50 : 100)}px;
                transform: scale(0) rotate(0deg);
            `;
            
            document.body.appendChild(rune);
            
            rune.animate([
                { transform: 'scale(0) rotate(0deg)', opacity: 0 },
                { transform: 'scale(1.5) rotate(180deg)', opacity: 0.6 },
                { transform: 'scale(2) rotate(360deg)', opacity: 0 }
            ], {
                duration: isMobile ? 400 : 700,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => rune.remove(), isMobile ? 400 : 700);
        }, i * (isMobile ? 80 : 100));
    }
    
    setTimeout(() => magicSphere.remove(), isMobile ? 600 : 900);
    
    return magicSphere;
}

function createGiantImpactEffect(isAttacker, damage) {
    if (soundEffects.hit) {
        playSound('hit');
    }
    if (damage > 25 && soundEffects.damage) {
        setTimeout(() => playSound('damage'), 100);
    }
    
    const targetElement = isAttacker ? 
        document.getElementById('enemyCharacter') : 
        document.getElementById('playerCharacter');
    
    const rect = targetElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const impactExplosion = document.createElement('div');
    const explosionSize = (isMobile ? 80 : 160) + damage * (isMobile ? 3 : 6);
    impactExplosion.style.cssText = `
        position: fixed;
        width: ${explosionSize}px;
        height: ${explosionSize}px;
        background: radial-gradient(circle, 
            rgba(255, 255, 255, 1) 0%,
            rgba(251, 191, 36, 0.95) 25%,
            rgba(245, 158, 11, 0.9) 50%,
            rgba(220, 38, 38, 0.85) 75%,
            rgba(153, 27, 27, 0.7) 100%);
        border-radius: 50%;
        z-index: 9999;
        pointer-events: none;
        filter: drop-shadow(0 0 ${isMobile ? '30px' : '60px'} #dc2626) 
                drop-shadow(0 0 ${isMobile ? '60px' : '120px'} #fbbf24);
        mix-blend-mode: screen;
        left: ${centerX}px;
        top: ${centerY}px;
        transform: translate(-50%, -50%) scale(0);
    `;
    
    document.body.appendChild(impactExplosion);
    
    impactExplosion.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0.9 },
        { transform: 'translate(-50%, -50%) scale(2)', opacity: 0.8 },
        { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 }
    ], {
        duration: isMobile ? 500 : 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    for (let i = 0; i < (isMobile ? 3 : 6); i++) {
        setTimeout(() => {
            const shockwave = document.createElement('div');
            shockwave.style.cssText = `
                position: fixed;
                width: ${isMobile ? '80px' : '160px'};
                height: ${isMobile ? '80px' : '160px'};
                border: ${isMobile ? '6px' : '12px'} solid rgba(251, 191, 36, 0.6);
                border-radius: 50%;
                z-index: 9998;
                pointer-events: none;
                filter: drop-shadow(0 0 ${isMobile ? '10px' : '20px'} #fbbf24);
                left: ${centerX}px;
                top: ${centerY}px;
                transform: translate(-50%, -50%) scale(0);
            `;
            
            document.body.appendChild(shockwave);
            
            shockwave.animate([
                { transform: 'translate(-50%, -50%) scale(0.1)', opacity: 0 },
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.7 },
                { transform: 'translate(-50%, -50%) scale(2.5)', opacity: 0 }
            ], {
                duration: isMobile ? 600 : 900,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => shockwave.remove(), isMobile ? 600 : 900);
        }, i * (isMobile ? 80 : 120));
    }
    
    if (damage > 25) {
        const crack = document.createElement('div');
        crack.style.cssText = `
            position: fixed;
            width: ${isMobile ? '150px' : '300px'};
            height: ${isMobile ? '150px' : '300px'};
            background: 
                linear-gradient(45deg, transparent 45%, rgba(220, 38, 38, 0.7) 50%, transparent 55%),
                linear-gradient(-45deg, transparent 45%, rgba(220, 38, 38, 0.7) 50%, transparent 55%),
                linear-gradient(135deg, transparent 45%, rgba(220, 38, 38, 0.7) 50%, transparent 55%),
                linear-gradient(-135deg, transparent 45%, rgba(220, 38, 38, 0.7) 50%, transparent 55%);
            z-index: 9997;
            pointer-events: none;
            filter: drop-shadow(0 0 ${isMobile ? '15px' : '30px'} #dc2626);
            left: ${centerX}px;
            top: ${centerY}px;
            transform: translate(-50%, -50%) scale(0);
        `;
        
        document.body.appendChild(crack);
        
        crack.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
            { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0.8 },
            { transform: 'translate(-50%, -50%) scale(2)', opacity: 0 }
        ], {
            duration: isMobile ? 400 : 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        });
        
        setTimeout(() => crack.remove(), isMobile ? 400 : 600);
    }
    
    for (let i = 0; i < (isMobile ? 20 : 40); i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            const size = (isMobile ? 6 : 12) + Math.random() * (isMobile ? 9 : 18);
            const angle = Math.random() * Math.PI * 2;
            const distance = (isMobile ? 60 : 120) + Math.random() * (isMobile ? 90 : 180);
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, 
                    rgba(255, 255, 255, 1) 0%,
                    rgba(251, 191, 36, 1) 50%,
                    rgba(220, 38, 38, 1) 100%);
                border-radius: 50%;
                z-index: 9996;
                pointer-events: none;
                filter: drop-shadow(0 0 ${isMobile ? '4px' : '8px'} #fbbf24);
                left: ${centerX}px;
                top: ${centerY}px;
                transform: translate(-50%, -50%);
            `;
            
            document.body.appendChild(particle);
            
            const targetX = centerX + Math.cos(angle) * distance;
            const targetY = centerY + Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 0 
                },
                { 
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1 
                },
                { 
                    transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(0)`,
                    opacity: 0 
                }
            ], {
                duration: isMobile ? 400 : 700,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => particle.remove(), isMobile ? 400 : 700);
        }, i * (isMobile ? 15 : 25));
    }
    
    setTimeout(() => impactExplosion.remove(), isMobile ? 500 : 800);
    
    return impactExplosion;
}

// Effect creators
function createAttackEffectForAttacker(characterName, isAttacker) {
    if (swordUsers.some(name => characterName.includes(name))) {
        return createGiantSwordEffect(isAttacker);
    } else if (gunUsers.some(name => characterName.includes(name))) {
        return createGiantGunEffect(isAttacker);
    } else if (magicUsers.some(name => characterName.includes(name))) {
        return createGiantMagicEffect(isAttacker);
    }
    return null;
}

function createAttackEffectForHurtCharacter(characterName, isHurtOnPlayer, damage) {
    return createGiantImpactEffect(!isHurtOnPlayer, damage);
}

// Show damage number
function showDamage(damage, target) {
    const character = target === 'player' ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('playerCharacter');
    
    const damageEl = document.createElement('div');
    damageEl.className = 'damage-number';
    damageEl.textContent = `-${damage}`;
    
    if (isMobile) {
        damageEl.style.cssText = `
            position: fixed;
            font-size: ${damage > 25 ? '52px' : '42px'};
            font-weight: 900;
            color: ${damage > 25 ? '#fbbf24' : '#ef4444'};
            text-shadow: 
                3px 3px 6px rgba(0, 0, 0, 0.9), 
                0 0 25px ${damage > 25 ? '#fbbf24' : '#ef4444'}, 
                0 0 50px ${damage > 25 ? '#fb923c' : '#dc2626'},
                0 0 75px ${damage > 25 ? '#f59e0b' : '#b91c1c'};
            z-index: 9999;
            pointer-events: none;
            animation: damage-popup 1.2s ease-out forwards;
            font-family: 'Baloo 2', cursive;
            letter-spacing: 1px;
        `;
    } else {
        damageEl.style.cssText = `
            position: fixed;
            font-size: ${damage > 25 ? '72px' : '58px'};
            font-weight: 900;
            color: ${damage > 25 ? '#fbbf24' : '#ef4444'};
            text-shadow: 
                5px 5px 10px rgba(0, 0, 0, 0.9), 
                0 0 35px ${damage > 25 ? '#fbbf24' : '#ef4444'}, 
                0 0 70px ${damage > 25 ? '#fb923c' : '#dc2626'},
                0 0 105px ${damage > 25 ? '#f59e0b' : '#b91c1c'};
            z-index: 9999;
            pointer-events: none;
            animation: damage-popup 1.5s ease-out forwards;
            font-family: 'Baloo 2', cursive;
            letter-spacing: 2px;
        `;
    }
    
    const rect = character.getBoundingClientRect();
    damageEl.style.left = `${rect.left + rect.width / 2}px`;
    damageEl.style.top = `${rect.top + rect.height * 0.15}px`;
    damageEl.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(damageEl);
    
    if (damage > 25) {
        setTimeout(() => {
            const critEl = document.createElement('div');
            critEl.textContent = 'CRITICAL!';
            critEl.style.cssText = `
                position: fixed;
                font-size: ${isMobile ? '28px' : '36px'};
                font-weight: 900;
                color: #fbbf24;
                text-shadow: 
                    2px 2px 4px rgba(0, 0, 0, 0.9), 
                    0 0 20px #fbbf24, 
                    0 0 40px #fb923c;
                z-index: 9998;
                pointer-events: none;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height * 0.05}px;
                transform: translateX(-50%);
                animation: damage-popup 1s ease-out forwards;
                font-family: 'Baloo 2', cursive;
                opacity: 0;
            `;
            
            document.body.appendChild(critEl);
            
            critEl.animate([
                { opacity: 0, transform: 'translateX(-50%) translateY(0)' },
                { opacity: 1, transform: 'translateX(-50%) translateY(10px)' },
                { opacity: 0, transform: 'translateX(-50%) translateY(30px)' }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });
            
            setTimeout(() => critEl.remove(), 1000);
        }, 200);
    }
    
    setTimeout(() => {
        damageEl.remove();
    }, isMobile ? 1200 : 1500);
    
    return damageEl;
}

// ============================================
// ATTACK FUNCTIONS WITH BOSS MECHANICS
// ============================================

// Attack enemy
function attackEnemy() {
    // Calculate damage - bosses take less damage
    let damage = Math.floor(Math.random() * 15) + 15; // 15-30 damage
    if (isBossBattle) {
        damage = Math.floor(damage * 0.7); // Bosses take 30% less damage
    }
    
    enemyHp = Math.max(0, enemyHp - damage);
    
    // Player attacks
    setCharacterState('player', 'attack');
    document.getElementById('playerCharacter').classList.add('attacking');
    
    // Create attack effect
    createAttackEffectForAttacker(currentHero.name, true);
    
    // Screen shake (stronger for boss battles)
    mobileShake();
    if (isBossBattle) {
        setTimeout(() => mobileShake(), 200);
    }
    
    setTimeout(() => {
        document.getElementById('playerCharacter').classList.remove('attacking');
        
        // Enemy gets hurt
        setCharacterState('enemy', 'hurt');
        document.getElementById('enemyCharacter').classList.add('hurt');
        showDamage(damage, 'enemy');
        updateHP();
        
        // Create impact effect
        createAttackEffectForHurtCharacter(currentHero.name, false, damage);
        
        setTimeout(() => {
            document.getElementById('enemyCharacter').classList.remove('hurt');
            
            if (enemyHp <= 0) {
                // Enemy defeated
                enemiesDefeated++;
                
                // Check if it's time for boss battle
                const bossDef = bossDefinitions[currentEra];
                if (bossDef && bossDef.bossName && !isBossBattle && enemiesDefeated >= totalEnemiesBeforeBoss) {
                    // Start boss battle
                    isBossBattle = true;
                    currentVillain = getRandomVillain(currentEra, false); // Get the boss
                    enemyHp = 150; // Boss has more HP
                    updateEnemyDisplay();
                    updateHP();
                    setCharacterState('enemy', 'idle');
                    
                    // Show boss warning
                    showBossWarning();
                    
                    // Load next question
                    questionIndex++;
                    currentShuffledAnswers = [];
                    loadQuestion();
                } else if (isBossBattle) {
                    // Boss defeated
                    victory();
                } else {
                    // Regular enemy defeated - continue with next enemy
                    setTimeout(() => {
                        // Reset enemy HP and get new enemy
                        enemyHp = 100;
                        currentVillain = getRandomVillain(currentEra, true);
                        updateEnemyDisplay();
                        updateHP();
                        setCharacterState('enemy', 'idle');
                        
                        // Load next question
                        questionIndex++;
                        currentShuffledAnswers = [];
                        loadQuestion();
                    }, 1000);
                }
            }
        }, isMobile ? 1000 : 1200);
    }, isMobile ? 400 : 600);
}

// Attack player
function attackPlayer() {
    // Calculate damage - bosses deal more damage
    let damage = Math.floor(Math.random() * 15) + 15; // 15-30 damage
    if (isBossBattle) {
        damage = Math.floor(damage * 1.5); // Bosses deal 50% more damage
    }
    
    playerHp = Math.max(0, playerHp - damage);
    
    // Enemy attacks
    setCharacterState('enemy', 'attack');
    document.getElementById('enemyCharacter').classList.add('attacking');
    
    // Create attack effect
    createAttackEffectForAttacker(currentVillain.name, false);
    
    // Screen shake
    mobileShake();
    
    setTimeout(() => {
        document.getElementById('enemyCharacter').classList.remove('attacking');
        
        // Player gets hurt
        setCharacterState('player', 'hurt');
        document.getElementById('playerCharacter').classList.add('hurt');
        showDamage(damage, 'player');
        updateHP();
        
        // Create impact effect
        createAttackEffectForHurtCharacter(currentVillain.name, true, damage);
        
        setTimeout(() => {
            document.getElementById('playerCharacter').classList.remove('hurt');
            
            if (playerHp <= 0) {
                defeat();
            }
        }, isMobile ? 1000 : 1200);
    }, isMobile ? 400 : 600);
}

// Update HP bars
function updateHP() {
    const playerHpBar = document.getElementById('playerHpBar');
    const enemyHpBar = document.getElementById('enemyHpBar');
    
    // Calculate percentages (boss has 150 HP max)
    const playerHpPercent = playerHp;
    const enemyHpPercent = isBossBattle ? (enemyHp / 150) * 100 : enemyHp;
    
    playerHpBar.style.width = `${playerHpPercent}%`;
    enemyHpBar.style.width = `${enemyHpPercent}%`;
    
    // Save battle progress after HP changes
    saveBattleProgress();
    
    // Update HP text
    const enemyMaxHp = isBossBattle ? 150 : 100;
    document.getElementById('playerHpText').textContent = `${playerHp}/100`;
    document.getElementById('enemyHpText').textContent = `${enemyHp}/${enemyMaxHp}`;
    
    // Change HP bar color based on health
    if (playerHp < 30) {
        playerHpBar.style.background = 'linear-gradient(to right, #ef4444, #dc2626, #b91c1c)';
    } else if (playerHp < 60) {
        playerHpBar.style.background = 'linear-gradient(to right, #f59e0b, #f97316, #ea580c)';
    } else {
        playerHpBar.style.background = 'linear-gradient(to right, #22c55e, #16a34a, #15803d)';
    }
    
    if (enemyHp < (isBossBattle ? 45 : 30)) {
        enemyHpBar.style.background = 'linear-gradient(to right, #ef4444, #dc2626, #b91c1c)';
    } else if (enemyHp < (isBossBattle ? 90 : 60)) {
        enemyHpBar.style.background = 'linear-gradient(to right, #f59e0b, #f97316, #ea580c)';
    } else {
        enemyHpBar.style.background = 'linear-gradient(to right, #22c55e, #16a34a, #15803d)';
    }
}

// Victory
function victory() {
    // Clear saved battle progress on victory
    clearBattleProgress();
    
    // Stop background music on victory
    stopBackgroundMusic();
    
    setCharacterState('player', 'victory');
    setCharacterState('enemy', 'hurt');
    document.getElementById('playerCharacter').classList.add('victory');
    
    // Play victory fanfare for boss battles
    if (isBossBattle && soundEffects.victoryFanfare) {
        playSound('victoryFanfare');
    }
    
    setTimeout(() => {
        checkBattleEnd();
    }, 1000);
}

// Defeat
function defeat() {
    // Clear saved battle progress on defeat
    clearBattleProgress();
    
    // Stop background music on defeat
    stopBackgroundMusic();
    
    setCharacterState('player', 'hurt');
    setCharacterState('enemy', 'victory');
    document.getElementById('enemyCharacter').classList.add('victory');
    
    setTimeout(() => {
        document.getElementById('defeatModal').classList.remove('hidden');
    }, 1000);
}

// Check battle end conditions
function checkBattleEnd() {
    if (enemyHp <= 0) {
        // Player wins
        setTimeout(() => {
            unlockHeroAndShowVictory();
        }, 1000);
    } else if (playerHp <= 0) {
        // Player loses
        setTimeout(() => {
            document.getElementById('defeatModal').classList.remove('hidden');
        }, 1000);
    }
}

// Era order for progression
const eraOrder = ['early-spanish', 'late-spanish', 'american-colonial', 'ww2'];

// Save unlocked heroes for an era
function saveUnlockedHeroesForEra(eraKey, heroIndices) {
    const unlockedHeroes = JSON.parse(localStorage.getItem('unlockedHeroes')) || {};
    unlockedHeroes[eraKey] = heroIndices;
    localStorage.setItem('unlockedHeroes', JSON.stringify(unlockedHeroes));
}

// Unlock next hero for the current era
function unlockNextHero(eraKey) {
    const heroes = eraData[eraKey].heroes;
    const unlockedIndices = getUnlockedHeroesForEra(eraKey);
    
    const nextHeroIndex = unlockedIndices.length;
    
    if (nextHeroIndex < heroes.length) {
        unlockedIndices.push(nextHeroIndex);
        saveUnlockedHeroesForEra(eraKey, unlockedIndices);
        return heroes[nextHeroIndex];
    }
    
    return null;
}

// Unlock hero and show victory
function unlockHeroAndShowVictory() {
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
    // Mark era as completed
    let completedEras = JSON.parse(localStorage.getItem('completedEras')) || [];
    if (!completedEras.includes(currentEra)) {
        completedEras.push(currentEra);
        localStorage.setItem('completedEras', JSON.stringify(completedEras));
    }

    // Persist local unlock state so later eras can be gated
    updateEraProgress(currentEra, { bossDefeated: true, lessonsComplete: true });
    
    // Show special victory message for boss battles
    const victoryModal = document.getElementById('victoryModal');
    const victoryTitle = victoryModal.querySelector('h1');
    
    if (isBossBattle) {
        victoryTitle.textContent = '🎖️ BOSS DEFEATED! 🎖️';
        victoryTitle.classList.add('text-red-700');
        victoryTitle.classList.remove('text-amber-800');
    }
    
    // Try to unlock the next hero
    const unlockedHero = unlockNextHero(currentEra);
    const heroAchievementDiv = document.querySelector('#victoryModal .bg-gradient-to-br.from-amber-50');
    const heroUnlockedTitle = document.querySelector('#victoryModal [data-lang-key="heroUnlocked"]');
    
    if (unlockedHero) {
        if (heroAchievementDiv) {
            heroAchievementDiv.style.display = 'block';
        }
        
        if (heroUnlockedTitle) {
            const newHeroText = translations && translations[currentLanguage] 
                ? translations[currentLanguage]['newHeroUnlocked'] || '🏆 New Hero Unlocked! 🏆'
                : '🏆 New Hero Unlocked! 🏆';
            heroUnlockedTitle.textContent = newHeroText;
        }
        
        const heroImageEl = document.getElementById('unlockedHeroImage');
        heroImageEl.style.display = 'block';
        heroImageEl.src = `${unlockedHero.folder}/${unlockedHero.idle}`;
        document.getElementById('unlockedHeroName').textContent = unlockedHero.name;
        document.getElementById('unlockedHeroDescription').textContent = unlockedHero.description || `${unlockedHero.name} - Hero of ${eraData[currentEra].name}`;
    } else {
        if (heroAchievementDiv) {
            const allHeroesUnlockedText = translations && translations[currentLanguage]
                ? translations[currentLanguage]['allHeroesUnlocked'] || '🎉 All Heroes Unlocked! 🎉'
                : '🎉 All Heroes Unlocked! 🎉';
            const congratsText = translations && translations[currentLanguage]
                ? translations[currentLanguage]['congratulations'] || 'Congratulations! You have unlocked all heroes in this era!'
                : 'Congratulations! You have unlocked all heroes in this era!';
            
            if (heroUnlockedTitle) {
                heroUnlockedTitle.textContent = allHeroesUnlockedText;
            }
            
            document.getElementById('unlockedHeroImage').style.display = 'none';
            document.getElementById('unlockedHeroName').textContent = '';
            document.getElementById('unlockedHeroDescription').textContent = congratsText;
        }
    }
    
    // Check if there's a next era
    const nextEraBtn = document.getElementById('nextEraBtn');
    const currentEraIndex = eraOrder.indexOf(currentEra);
    
    if (currentEraIndex < eraOrder.length - 1) {
        nextEraBtn.style.display = 'inline-block';
    } else {
        nextEraBtn.style.display = 'none';
    }
    
    document.getElementById('victoryModal').classList.remove('hidden');
}

function proceedToNextEra() {
    const currentEraIndex = eraOrder.indexOf(currentEra);
    
    if (currentEraIndex < eraOrder.length - 1) {
        const nextEra = eraOrder[currentEraIndex + 1];
        localStorage.setItem('selectedEra', nextEra);
        localStorage.removeItem('selectedHero');
        window.location.href = 'learning-module.html';
    } else {
        window.location.href = 'collection.html';
    }
}

// Enable/disable answer buttons
function enableAnswers() {
    const buttons = ['answerA', 'answerB', 'answerC', 'answerD'];
    buttons.forEach(btnId => {
        const button = document.getElementById(btnId);
        if (button) {
            button.disabled = false;
        }
    });
}

function disableAnswers() {
    const buttons = ['answerA', 'answerB', 'answerC', 'answerD'];
    buttons.forEach(btnId => {
        const button = document.getElementById(btnId);
        if (button) {
            button.disabled = true;
        }
    });
}

// Initialize battle when page loads
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - Initializing battle with boss mechanics and automatic background music...');
    
    // Initialize the battle
    initBattle();
    
    // Update HP bars initially
    updateHP();
    
    // Hide loading overlay
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }, 500);
    
    // Add click event listeners to buttons to start music (for autoplay restrictions)
    const buttons = document.querySelectorAll('.answer-btn, .control-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Try to play music on first user interaction if autoplay was blocked
            if (currentEra && backgroundMusic[currentEra] && backgroundMusic[currentEra].paused) {
                backgroundMusic[currentEra].play().catch(e => console.log('Music play on interaction failed:', e));
            }
        });
    });
});

// Helper function to get random era (for "all" battles)
function getRandomEra() {
    const eras = Object.keys(eraData);
    const randomIndex = Math.floor(Math.random() * eras.length);
    return eras[randomIndex];
}

// Export functions for global use
window.selectAnswer = selectAnswer;
window.proceedToNextEra = proceedToNextEra;
window.restartBattle = function() {
    location.reload();
};
