// Battle game logic
let playerHp = 100;
let enemyHp = 100;
let currentQuestion = null;
let questionIndex = 0;
let currentEra = '';
let currentHero = null;
let currentVillain = null;
let currentLanguageLoaded = ''; // Track which language questions are loaded
let currentShuffledAnswers = []; // Store shuffled answers

// Get unlocked heroes for an era (needed before initBattle)
function getUnlockedHeroesForEra(eraKey) {
    const unlockedHeroes = JSON.parse(localStorage.getItem('unlockedHeroes')) || {};
    return unlockedHeroes[eraKey] || [0]; // First hero (index 0) is always unlocked by default
}

// Initialize battle
function initBattle() {
    const selectedEra = localStorage.getItem('selectedEra') || 'early-spanish';
    
    // Determine which era to use for this battle
    if (selectedEra === 'all') {
        currentEra = getRandomEra();
    } else {
        currentEra = selectedEra;
    }
    
    // Load questions based on current language and era
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    if (questionsData[currentEra] && questionsData[currentEra][currentLanguage]) {
        questions = [...questionsData[currentEra][currentLanguage]];
        shuffleArray(questions);
    } else {
        console.error('No questions found for era:', currentEra, 'language:', currentLanguage);
        // Fallback to early-spanish era
        questions = [...questionsData['early-spanish'][currentLanguage]];
        shuffleArray(questions);
    }
    currentLanguageLoaded = currentLanguage; // Track loaded language
    
    // Set background
    const battleBackground = document.getElementById('battleBackground');
    battleBackground.style.backgroundImage = `url('${eraData[currentEra].background}')`;
    
    // Select hero (either player selected or first unlocked)
    const selectedHeroIndex = localStorage.getItem('selectedHero');
    const unlockedHeroes = getUnlockedHeroesForEra(currentEra);
    
    if (selectedHeroIndex !== null && eraData[currentEra].heroes[selectedHeroIndex]) {
        // Check if the selected hero is unlocked
        if (unlockedHeroes.includes(parseInt(selectedHeroIndex))) {
            currentHero = eraData[currentEra].heroes[parseInt(selectedHeroIndex)];
        } else {
            // Fall back to first unlocked hero
            currentHero = eraData[currentEra].heroes[unlockedHeroes[0]];
        }
        localStorage.removeItem('selectedHero'); // Clear selection for next battle
    } else {
        // Use first unlocked hero by default
        currentHero = eraData[currentEra].heroes[unlockedHeroes[0]];
    }
    
    // Select random villain
    currentVillain = getRandomVillain(currentEra);
    
    // Set character sprites
    updateCharacterSprites();
    
    // Update character names
    document.getElementById('playerName').textContent = currentHero.name;
    document.getElementById('enemyName').textContent = currentVillain.name;
    
    // Load first question
    loadQuestion();
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

// Change character animation state
function setCharacterState(character, state) {
    const sprite = character === 'player' ? document.getElementById('playerSprite') : document.getElementById('enemySprite');
    const characterData = character === 'player' ? currentHero : currentVillain;
    
    sprite.src = getCharacterSprite(characterData, state);
    
    // Return to idle after animation duration
    if (state !== 'idle') {
        setTimeout(() => {
            sprite.src = getCharacterSprite(characterData, 'idle');
        }, 1200);
    }
}

// Load question
function loadQuestion() {
    // Check if language changed - if so, just translate the current question
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const languageChanged = currentLanguageLoaded !== currentLanguage;
    
    if (languageChanged) {
        // Language changed - get the same question index from new language for current era
        if (questionsData[currentEra] && questionsData[currentEra][currentLanguage]) {
            questions = [...questionsData[currentEra][currentLanguage]];
        } else {
            console.error('No questions found for era:', currentEra, 'language:', currentLanguage);
            questions = [...questionsData['early-spanish'][currentLanguage]];
        }
        currentLanguageLoaded = currentLanguage;
        
        // When language changes, map the old shuffled answers to new language answers
        // Find the positions of the current answers and get the translated versions
        if (currentShuffledAnswers.length > 0 && currentQuestion) {
            const newQuestion = questions[questionIndex];
            const oldQuestion = currentQuestion;
            const newShuffledAnswers = [];
            
            // For each position in the shuffled array, find which answer it was and get the translation
            currentShuffledAnswers.forEach(oldAnswer => {
                // Find the index of this answer in the old question's answers
                const indexInOldAnswers = oldQuestion.answers.indexOf(oldAnswer);
                if (indexInOldAnswers !== -1) {
                    // Get the corresponding answer from the new language
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
    
    // Only shuffle answers if this is a new question (not a language change)
    if (!languageChanged || currentShuffledAnswers.length === 0) {
        currentShuffledAnswers = [...currentQuestion.answers];
        shuffleArray(currentShuffledAnswers);
    }
    
    document.getElementById('answerA').innerHTML = `A. ${currentShuffledAnswers[0]}`;
    document.getElementById('answerB').innerHTML = `B. ${currentShuffledAnswers[1]}`;
    document.getElementById('answerC').innerHTML = `C. ${currentShuffledAnswers[2]}`;
    document.getElementById('answerD').innerHTML = `D. ${currentShuffledAnswers[3]}`;
    
    currentQuestion.shuffledAnswers = currentShuffledAnswers;
    
    enableAnswers();
}

// Shuffle array helper
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
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
        // Show correct answer
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
            currentShuffledAnswers = []; // Clear shuffled answers for next question
            loadQuestion();
        }
    }, 2500);
}

// Attack enemy
function attackEnemy() {
    const damage = Math.floor(Math.random() * 15) + 15; // 15-30 damage
    enemyHp = Math.max(0, enemyHp - damage);
    
    // Player attacks
    setCharacterState('player', 'attack');
    document.getElementById('playerCharacter').classList.add('attacking');
    
    setTimeout(() => {
        document.getElementById('playerCharacter').classList.remove('attacking');
        
        // Enemy gets hurt
        setCharacterState('enemy', 'hurt');
        document.getElementById('enemyCharacter').classList.add('hurt');
        showDamage(damage, 'enemy');
        updateHP();
        
        setTimeout(() => {
            document.getElementById('enemyCharacter').classList.remove('hurt');
            
            if (enemyHp <= 0) {
                victory();
            }
        }, 1200);
    }, 600);
}

// Attack player
function attackPlayer() {
    const damage = Math.floor(Math.random() * 15) + 15; // 15-30 damage
    playerHp = Math.max(0, playerHp - damage);
    
    // Enemy attacks
    setCharacterState('enemy', 'attack');
    document.getElementById('enemyCharacter').classList.add('attacking');
    
    setTimeout(() => {
        document.getElementById('enemyCharacter').classList.remove('attacking');
        
        // Player gets hurt
        setCharacterState('player', 'hurt');
        document.getElementById('playerCharacter').classList.add('hurt');
        showDamage(damage, 'player');
        updateHP();
        
        setTimeout(() => {
            document.getElementById('playerCharacter').classList.remove('hurt');
            
            if (playerHp <= 0) {
                defeat();
            }
        }, 1200);
    }, 600);
}

function animatePlayerAttack() {
    const player = document.getElementById('playerCharacter');
    const playerSprite = document.getElementById('playerSprite');
    
    player.classList.add('attacking');
    playerSprite.src = 'assets/lapulapu-attack.png';
    
    // Move forward (to the right)
    setTimeout(() => {
        player.style.transform = 'translateX(80px)';
    }, 100);
    
    setTimeout(() => {
        player.style.transform = '';
        player.classList.remove('attacking');
        playerSprite.src = 'assets/lapulapu-idle.png';
    }, 800);
}

function animateEnemyAttack() {
    const enemy = document.getElementById('enemyCharacter');
    const enemySprite = document.getElementById('enemySprite');
    
    enemy.classList.add('attacking');
    enemySprite.src = 'assets/magellan-attack.png';
    
    // Move forward (to the left) while maintaining flip
    setTimeout(() => {
        enemy.style.transform = 'scaleX(-1) translateX(80px)';
    }, 100);
    
    setTimeout(() => {
        enemy.style.transform = 'scaleX(-1)';
        enemy.classList.remove('attacking');
        enemySprite.src = 'assets/magellan-idle.png';
    }, 800);
}

// Show damage number
function showDamage(damage, target) {
    const character = target === 'player' ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const damageEl = document.createElement('div');
    damageEl.className = 'damage-number';
    damageEl.textContent = `-${damage}`;
    
    // Append to body with fixed position for enemy to avoid flip
    if (target === 'enemy') {
        damageEl.style.position = 'fixed';
        const rect = character.getBoundingClientRect();
        damageEl.style.left = `${rect.left + rect.width / 2}px`;
        damageEl.style.top = `${rect.top + rect.height * 0.2}px`;
        damageEl.style.transform = 'translateX(-50%)';
        document.body.appendChild(damageEl);
    } else {
        damageEl.style.left = '50%';
        damageEl.style.top = '20%';
        character.appendChild(damageEl);
    }
    
    setTimeout(() => {
        damageEl.remove();
    }, 1500);
}

// Update HP bars
function updateHP() {
    const playerHpBar = document.getElementById('playerHpBar');
    const enemyHpBar = document.getElementById('enemyHpBar');
    
    playerHpBar.style.width = `${playerHp}%`;
    enemyHpBar.style.width = `${enemyHp}%`;
    

    
    // Change HP bar color based on health
    if (playerHp < 30) {
        playerHpBar.style.background = 'linear-gradient(to right, #ef4444, #dc2626)';
    } else if (playerHp < 60) {
        playerHpBar.style.background = 'linear-gradient(to right, #f59e0b, #f97316)';
    }
    
    if (enemyHp < 30) {
        enemyHpBar.style.background = 'linear-gradient(to right, #ef4444, #dc2626)';
    } else if (enemyHp < 60) {
        enemyHpBar.style.background = 'linear-gradient(to right, #f59e0b, #f97316)';
    }
}

// Victory
function victory() {
    setCharacterState('player', 'victory');
    setCharacterState('enemy', 'hurt');
    document.getElementById('playerCharacter').classList.add('victory');
    
    setTimeout(() => {
        document.getElementById('victoryModal').classList.remove('hidden');
    }, 1000);
    
    checkBattleEnd();
}

// Defeat
function defeat() {
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

// Get era order for progression
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
    
    // Find the next hero to unlock
    const nextHeroIndex = unlockedIndices.length;
    
    if (nextHeroIndex < heroes.length) {
        // There's a hero to unlock
        unlockedIndices.push(nextHeroIndex);
        saveUnlockedHeroesForEra(eraKey, unlockedIndices);
        return heroes[nextHeroIndex]; // Return the newly unlocked hero
    }
    
    return null; // All heroes already unlocked
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
    
    // Try to unlock the next hero
    const unlockedHero = unlockNextHero(currentEra);
    const heroAchievementDiv = document.querySelector('#victoryModal .bg-gradient-to-br.from-amber-50');
    const heroUnlockedTitle = document.querySelector('#victoryModal [data-lang-key="heroUnlocked"]');
    
    if (unlockedHero) {
        // Show hero achievement
        if (heroAchievementDiv) {
            heroAchievementDiv.style.display = 'block';
        }
        
        // Update hero unlocked title
        if (heroUnlockedTitle) {
            const newHeroText = translations && translations[currentLanguage] 
                ? translations[currentLanguage]['newHeroUnlocked'] || '🏆 New Hero Unlocked! 🏆'
                : '🏆 New Hero Unlocked! 🏆';
            heroUnlockedTitle.textContent = newHeroText;
        }
        
        // Display hero achievement with correct image path
        const heroImageEl = document.getElementById('unlockedHeroImage');
        heroImageEl.style.display = 'block'; // Make sure image is visible
        heroImageEl.src = `${unlockedHero.folder}/${unlockedHero.idle}`;
        document.getElementById('unlockedHeroName').textContent = unlockedHero.name;
        document.getElementById('unlockedHeroDescription').textContent = unlockedHero.description || `${unlockedHero.name} - Hero of ${eraData[currentEra].name}`;
    } else {
        // All heroes already unlocked - show different message or hide the section
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
            
            // Hide the hero image and show congrats message
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
        localStorage.removeItem('selectedHero'); // Clear hero selection
        // Go to learning module for the next era
        window.location.href = 'learning-module.html';
    } else {
        // All eras completed
        window.location.href = 'collection.html';
    }
}

// Enable/disable answer buttons
function enableAnswers() {
    const buttons = ['answerA', 'answerB', 'answerC', 'answerD'];
    buttons.forEach(btnId => {
        document.getElementById(btnId).disabled = false;
    });
}

function disableAnswers() {
    const buttons = ['answerA', 'answerB', 'answerC', 'answerD'];
    buttons.forEach(btnId => {
        document.getElementById(btnId).disabled = true;
    });
}

// Initialize battle when page loads
window.addEventListener('DOMContentLoaded', initBattle);
