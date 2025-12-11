// battle.js - COMPLETE VERSION WITH MASSIVE IMPACTFUL ATTACK EFFECTS

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

// Character type definitions - UPDATED WITH SPANISH COMMANDER
const swordUsers = ['Lapu-Lapu', 'Raja Humabon', 'Ferdinand Magellan', 
                    'Spanish Soldier', 'Early Spanish Soldier Era', 
                    'Andres Bonifacio', 'Emilio Aguinaldo', 
                    'Commodore George Dewey', 'General Juan Luna'];

const gunUsers = ['American Soldier', 'Douglas MacArthur', 'Japanese Soldier', 
                  'Spanish Commander', 'Late Spanish Commander Era']; // ADDED SPANISH COMMANDER

const magicUsers = ['Jose Rizal', 'Apolinario Mabini'];

// Enhanced setEraBackground function with error handling
function setEraBackground(eraKey) {
    console.log(`setEraBackground called with era: ${eraKey}`);
    
    const era = eraData[eraKey];
    
    if (era && era.background) {
        console.log(`Setting battle area background for era: ${eraKey}, path: ${era.background}`);
        
        // Set ONLY the battle area background - not the page background
        const battleAreaBg = document.getElementById('battleAreaBackground');
        if (battleAreaBg) {
            battleAreaBg.style.backgroundImage = `url('${era.background}')`;
            battleAreaBg.style.opacity = '1'; // Full opacity
            battleAreaBg.style.backgroundSize = 'cover';
            battleAreaBg.style.backgroundPosition = 'center';
            battleAreaBg.style.backgroundRepeat = 'no-repeat';
            battleAreaBg.style.transition = 'background-image 0.5s ease-in-out';
            
            // Test if background loads
            const testImg = new Image();
            testImg.onload = function() {
                console.log(`Battle area background loaded successfully: ${era.background}`);
            };
            testImg.onerror = function() {
                console.error(`Failed to load battle area background: ${era.background}`);
                // Fallback to default
                setDefaultBackground();
            };
            testImg.src = era.background;
        }
        
    } else {
        console.warn(`No background found for era: ${eraKey}`);
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
    return unlockedHeroes[eraKey] || [0]; // First hero (index 0) is always unlocked by default
}

// Get a random era (for "all" battles)
function getRandomEra() {
    const eras = Object.keys(eraData);
    const randomIndex = Math.floor(Math.random() * eras.length);
    return eras[randomIndex];
}

// Get random villain for current era
function getRandomVillain(eraKey) {
    const villains = eraData[eraKey].villains;
    const randomIndex = Math.floor(Math.random() * villains.length);
    return villains[randomIndex];
}

// Get character sprite based on state
function getCharacterSprite(characterData, state) {
    if (!characterData || !characterData.folder) {
        // Fallback to default sprites
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

// Initialize battle - UPDATED to handle era properly
function initBattle() {
    const selectedEra = localStorage.getItem('selectedEra') || 'early-spanish';
    
    // Determine which era to use for this battle
    if (selectedEra === 'all') {
        currentEra = getRandomEra();
        console.log(`Random era selected: ${currentEra}`);
    } else {
        currentEra = selectedEra;
        console.log(`Selected era: ${currentEra}`);
    }
    
    // Save the current era for use in this battle
    localStorage.setItem('currentBattleEra', currentEra);
    
    // Set era-specific backgrounds - THIS IS THE CRITICAL PART
    setEraBackground(currentEra);
    
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
    
    // Update answer buttons
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

// ============================================
// MASSIVE IMPACTFUL ATTACK EFFECT FUNCTIONS
// ============================================

function createMassiveSwordAttackEffect(isAttacker) {
    const characterElement = isAttacker ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const battleArea = document.querySelector('.battle-area');
    const rect = characterElement.getBoundingClientRect();
    const battleRect = battleArea.getBoundingClientRect();
    
    // GIANT SWORD SLASH EFFECT
    const swordSlash = document.createElement('div');
    swordSlash.style.cssText = `
        position: fixed;
        width: 300px;
        height: 150px;
        background: linear-gradient(45deg, 
            transparent 0%,
            rgba(251, 191, 36, 0.8) 20%,
            rgba(245, 158, 11, 1) 40%,
            rgba(220, 38, 38, 1) 60%,
            rgba(251, 191, 36, 0.8) 80%,
            transparent 100%);
        z-index: 50;
        pointer-events: none;
        filter: blur(5px) drop-shadow(0 0 30px #fbbf24) drop-shadow(0 0 60px #dc2626);
        clip-path: polygon(0% 50%, 20% 40%, 40% 30%, 60% 40%, 80% 50%, 100% 60%, 80% 70%, 60% 80%, 40% 70%, 20% 60%);
        mix-blend-mode: screen;
    `;
    
    const startX = isAttacker ? rect.right - 100 : rect.left + 100;
    const startY = rect.top + rect.height * 0.3;
    const endX = isAttacker ? battleRect.right - 100 : battleRect.left + 100;
    
    swordSlash.style.left = `${startX}px`;
    swordSlash.style.top = `${startY}px`;
    swordSlash.style.transform = `rotate(${isAttacker ? '15' : '165'}deg)`;
    
    document.body.appendChild(swordSlash);
    
    // SWORD TRAIL PARTICLE STORM
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            const size = 15 + Math.random() * 20;
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, 
                    rgba(255, 255, 255, 1) 0%,
                    rgba(251, 191, 36, 1) 50%,
                    rgba(220, 38, 38, 1) 100%);
                border-radius: 50%;
                z-index: 49;
                pointer-events: none;
                filter: blur(2px) drop-shadow(0 0 10px #fbbf24);
                left: ${startX + (isAttacker ? i * 10 : -i * 10)}px;
                top: ${startY + Math.random() * 100 - 50}px;
                transform: scale(0);
            `;
            
            document.body.appendChild(particle);
            
            particle.animate([
                { transform: 'scale(0) rotate(0deg)', opacity: 0 },
                { transform: `scale(1.5) rotate(${Math.random() * 360}deg)`, opacity: 1 },
                { transform: `scale(2.5) rotate(${Math.random() * 720}deg)`, opacity: 0.5 },
                { transform: 'scale(0) rotate(0deg)', opacity: 0 }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => particle.remove(), 1200);
        }, i * 20);
    }
    
    // ANIMATION
    swordSlash.animate([
        { 
            transform: `rotate(${isAttacker ? '15' : '165'}deg) scale(0.2)`, 
            opacity: 0,
            left: `${startX}px`,
            top: `${startY}px`
        },
        { 
            transform: `rotate(${isAttacker ? '15' : '165'}deg) scale(1.5)`, 
            opacity: 1,
            left: `${startX}px`,
            top: `${startY}px`
        },
        { 
            transform: `rotate(${isAttacker ? '15' : '165'}deg) scale(2)`, 
            opacity: 0.8,
            left: `${endX}px`,
            top: `${startY}px`
        },
        { 
            transform: `rotate(${isAttacker ? '15' : '165'}deg) scale(3)`, 
            opacity: 0,
            left: `${endX}px`,
            top: `${startY + 100}px`
        }
    ], {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    setTimeout(() => swordSlash.remove(), 600);
    
    // SCREEN FLASH
    const screenFlash = document.createElement('div');
    screenFlash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(circle at ${isAttacker ? '30%' : '70%'} 50%, 
            rgba(251, 191, 36, 0.6) 0%,
            rgba(245, 158, 11, 0.3) 30%,
            transparent 70%);
        z-index: 40;
        pointer-events: none;
        mix-blend-mode: overlay;
    `;
    
    document.body.appendChild(screenFlash);
    
    screenFlash.animate([
        { opacity: 0 },
        { opacity: 0.8 },
        { opacity: 0 }
    ], {
        duration: 400,
        easing: 'ease-out',
        fill: 'forwards'
    });
    
    setTimeout(() => screenFlash.remove(), 400);
    
    return swordSlash;
}

function createMassiveGunAttackEffect(isAttacker) {
    const characterElement = isAttacker ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const battleArea = document.querySelector('.battle-area');
    const rect = characterElement.getBoundingClientRect();
    const battleRect = battleArea.getBoundingClientRect();
    
    // GIANT MUZZLE FLASH
    const muzzleFlash = document.createElement('div');
    const flashSize = 120;
    muzzleFlash.style.cssText = `
        position: fixed;
        width: ${flashSize}px;
        height: ${flashSize}px;
        background: radial-gradient(circle, 
            rgba(255, 255, 255, 1) 0%,
            rgba(251, 191, 36, 0.9) 20%,
            rgba(220, 38, 38, 0.8) 40%,
            rgba(153, 27, 27, 0.6) 60%,
            transparent 80%);
        border-radius: 50%;
        z-index: 50;
        pointer-events: none;
        filter: blur(10px) drop-shadow(0 0 40px #dc2626);
        mix-blend-mode: screen;
        left: ${isAttacker ? rect.right - 50 : rect.left + 50}px;
        top: ${rect.top + rect.height * 0.4}px;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(muzzleFlash);
    
    // FLASH ANIMATION
    muzzleFlash.animate([
        { transform: 'translate(-50%, -50%) scale(0.3)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(3)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(5)', opacity: 0.6 },
        { transform: 'translate(-50%, -50%) scale(8)', opacity: 0 }
    ], {
        duration: 500,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    // BULLET TRAIL - GIANT LASER BEAM
    const bulletTrail = document.createElement('div');
    const trailLength = Math.abs(battleRect.right - rect.right);
    bulletTrail.style.cssText = `
        position: fixed;
        width: ${trailLength}px;
        height: 40px;
        background: linear-gradient(90deg, 
            rgba(255, 255, 255, 1) 0%,
            rgba(251, 191, 36, 1) 20%,
            rgba(220, 38, 38, 1) 50%,
            rgba(251, 191, 36, 0.8) 80%,
            rgba(255, 255, 255, 0) 100%);
        z-index: 49;
        pointer-events: none;
        filter: blur(5px) drop-shadow(0 0 20px #dc2626);
        border-radius: 20px;
        mix-blend-mode: screen;
        left: ${isAttacker ? rect.right : rect.left}px;
        top: ${rect.top + rect.height * 0.45}px;
        transform-origin: ${isAttacker ? 'left center' : 'right center'};
        transform: ${isAttacker ? 'none' : 'scaleX(-1)'};
    `;
    
    document.body.appendChild(bulletTrail);
    
    // TRAIL ANIMATION
    bulletTrail.animate([
        { transform: `${isAttacker ? 'scaleX(0.1)' : 'scaleX(-0.1)'}`, opacity: 0 },
        { transform: `${isAttacker ? 'scaleX(1.5)' : 'scaleX(-1.5)'}`, opacity: 1 },
        { transform: `${isAttacker ? 'scaleX(2)' : 'scaleX(-2)'}`, opacity: 0.6 },
        { transform: `${isAttacker ? 'scaleX(0.1)' : 'scaleX(-0.1)'}`, opacity: 0 }
    ], {
        duration: 400,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    // SHELL CASINGS
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const casing = document.createElement('div');
            casing.style.cssText = `
                position: fixed;
                width: 30px;
                height: 15px;
                background: linear-gradient(45deg, 
                    rgba(251, 191, 36, 1) 0%,
                    rgba(153, 27, 27, 1) 100%);
                border-radius: 3px;
                z-index: 48;
                pointer-events: none;
                filter: drop-shadow(0 0 10px #fbbf24);
                left: ${(isAttacker ? rect.right : rect.left) - 15}px;
                top: ${rect.top + rect.height * 0.4}px;
                transform: rotate(${Math.random() * 360}deg);
            `;
            
            document.body.appendChild(casing);
            
            const angle = (Math.random() * 60 + 60) * (isAttacker ? -1 : 1);
            const distance = 50 + Math.random() * 100;
            
            casing.animate([
                { 
                    transform: `rotate(0deg) translate(0, 0)`,
                    opacity: 1 
                },
                { 
                    transform: `rotate(${angle}deg) translate(${distance}px, ${-distance}px)`,
                    opacity: 0.5 
                },
                { 
                    transform: `rotate(${angle * 2}deg) translate(${distance * 2}px, ${-distance * 0.5}px)`,
                    opacity: 0 
                }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => casing.remove(), 1200);
        }, i * 60);
    }
    
    setTimeout(() => {
        muzzleFlash.remove();
        bulletTrail.remove();
    }, 500);
    
    return { muzzleFlash, bulletTrail };
}

function createMassiveMagicAttackEffect(isAttacker) {
    const characterElement = isAttacker ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const battleArea = document.querySelector('.battle-area');
    const rect = characterElement.getBoundingClientRect();
    const battleRect = battleArea.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // GIANT MAGIC SPHERE
    const magicSphere = document.createElement('div');
    const sphereSize = 200;
    magicSphere.style.cssText = `
        position: fixed;
        width: ${sphereSize}px;
        height: ${sphereSize}px;
        background: radial-gradient(circle, 
            rgba(255, 255, 255, 1) 0%,
            rgba(139, 92, 246, 0.9) 20%,
            rgba(79, 70, 229, 0.8) 40%,
            rgba(67, 56, 202, 0.6) 60%,
            rgba(49, 46, 129, 0.4) 80%,
            transparent 100%);
        border-radius: 50%;
        z-index: 50;
        pointer-events: none;
        filter: blur(15px) drop-shadow(0 0 50px #8b5cf6) drop-shadow(0 0 100px #4f46e5);
        mix-blend-mode: screen;
        left: ${centerX}px;
        top: ${centerY}px;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(magicSphere);
    
    // SPHERE ANIMATION
    magicSphere.animate([
        { transform: 'translate(-50%, -50%) scale(0.1)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0.9 },
        { transform: 'translate(-50%, -50%) scale(2)', opacity: 0.7 },
        { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 }
    ], {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    // MAGIC ENERGY WAVES
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const wave = document.createElement('div');
            const waveSize = 150 + i * 50;
            wave.style.cssText = `
                position: fixed;
                width: ${waveSize}px;
                height: ${waveSize}px;
                border: 8px solid rgba(139, 92, 246, 0.6);
                border-radius: 50%;
                z-index: 49;
                pointer-events: none;
                filter: blur(5px) drop-shadow(0 0 20px #8b5cf6);
                left: ${centerX}px;
                top: ${centerY}px;
                transform: translate(-50%, -50%);
            `;
            
            document.body.appendChild(wave);
            
            wave.animate([
                { transform: 'translate(-50%, -50%) scale(0.1)', opacity: 0 },
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
                { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => wave.remove(), 1000);
        }, i * 150);
    }
    
    // MAGIC PARTICLES STORM
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            const size = 10 + Math.random() * 20;
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, 
                    rgba(255, 255, 255, 1) 0%,
                    rgba(199, 210, 254, 0.8) 50%,
                    rgba(139, 92, 246, 0.6) 100%);
                border-radius: 50%;
                z-index: 48;
                pointer-events: none;
                filter: blur(2px) drop-shadow(0 0 10px #a78bfa);
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
                    transform: 'translate(-50%, -50%) scale(1.5)',
                    opacity: 1 
                },
                { 
                    transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(0)`,
                    opacity: 0 
                }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => particle.remove(), 1200);
        }, i * 20);
    }
    
    // ARCANE RUNES
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const rune = document.createElement('div');
            rune.style.cssText = `
                position: fixed;
                width: 60px;
                height: 60px;
                background: radial-gradient(circle, 
                    rgba(139, 92, 246, 0.8) 0%,
                    rgba(79, 70, 229, 0.6) 100%);
                clip-path: polygon(${Array.from({length: 6}, (_, j) => 
                    `${50 + 40 * Math.cos((j * 60 + Math.random() * 30) * Math.PI/180)}% ` +
                    `${50 + 40 * Math.sin((j * 60 + Math.random() * 30) * Math.PI/180)}%`
                ).join(', ')});
                z-index: 47;
                pointer-events: none;
                filter: drop-shadow(0 0 15px #8b5cf6);
                left: ${centerX + Math.random() * 200 - 100}px;
                top: ${centerY + Math.random() * 200 - 100}px;
                transform: scale(0) rotate(0deg);
            `;
            
            document.body.appendChild(rune);
            
            rune.animate([
                { transform: 'scale(0) rotate(0deg)', opacity: 0 },
                { transform: 'scale(1.5) rotate(180deg)', opacity: 0.7 },
                { transform: 'scale(2) rotate(360deg)', opacity: 0 }
            ], {
                duration: 600 + Math.random() * 300,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => rune.remove(), 900);
        }, i * 50);
    }
    
    setTimeout(() => magicSphere.remove(), 800);
    
    return magicSphere;
}

function createMassiveAttackImpactEffect(isAttacker, damage) {
    const targetElement = isAttacker ? 
        document.getElementById('enemyCharacter') : 
        document.getElementById('playerCharacter');
    
    const rect = targetElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // GIANT IMPACT EXPLOSION
    const impactExplosion = document.createElement('div');
    const explosionSize = 150 + damage * 2;
    impactExplosion.style.cssText = `
        position: fixed;
        width: ${explosionSize}px;
        height: ${explosionSize}px;
        background: radial-gradient(circle, 
            rgba(255, 255, 255, 1) 0%,
            rgba(251, 191, 36, 0.9) 20%,
            rgba(220, 38, 38, 0.8) 40%,
            rgba(153, 27, 27, 0.6) 60%,
            transparent 80%);
        border-radius: 50%;
        z-index: 60;
        pointer-events: none;
        filter: blur(20px) drop-shadow(0 0 60px #dc2626);
        mix-blend-mode: screen;
        left: ${centerX}px;
        top: ${centerY}px;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(impactExplosion);
    
    // EXPLOSION ANIMATION
    impactExplosion.animate([
        { transform: 'translate(-50%, -50%) scale(0.1)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0.9 },
        { transform: 'translate(-50%, -50%) scale(1.8)', opacity: 0.7 },
        { transform: 'translate(-50%, -50%) scale(2.5)', opacity: 0 }
    ], {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    // SHOCKWAVE RINGS
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            const shockwave = document.createElement('div');
            shockwave.style.cssText = `
                position: fixed;
                width: 100px;
                height: 100px;
                border: ${8 - i * 2}px solid rgba(251, 191, 36, 0.7);
                border-radius: 50%;
                z-index: 59;
                pointer-events: none;
                filter: blur(3px) drop-shadow(0 0 15px #fbbf24);
                left: ${centerX}px;
                top: ${centerY}px;
                transform: translate(-50%, -50%);
            `;
            
            document.body.appendChild(shockwave);
            
            shockwave.animate([
                { transform: 'translate(-50%, -50%) scale(0.1)', opacity: 0 },
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
                { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => shockwave.remove(), 800);
        }, i * 100);
    }
    
    // CRACK EFFECT (for high damage)
    if (damage > 25) {
        const crack = document.createElement('div');
        crack.style.cssText = `
            position: fixed;
            width: 200px;
            height: 200px;
            background: 
                linear-gradient(45deg, transparent 45%, rgba(220, 38, 38, 0.6) 50%, transparent 55%),
                linear-gradient(-45deg, transparent 45%, rgba(220, 38, 38, 0.6) 50%, transparent 55%),
                linear-gradient(135deg, transparent 45%, rgba(220, 38, 38, 0.6) 50%, transparent 55%),
                linear-gradient(-135deg, transparent 45%, rgba(220, 38, 38, 0.6) 50%, transparent 55%);
            z-index: 58;
            pointer-events: none;
            filter: blur(2px) drop-shadow(0 0 10px #dc2626);
            left: ${centerX}px;
            top: ${centerY}px;
            transform: translate(-50%, -50%) scale(0);
        `;
        
        document.body.appendChild(crack);
        
        crack.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
            { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0.8 },
            { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 }
        ], {
            duration: 400,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        });
        
        setTimeout(() => crack.remove(), 400);
    }
    
    // DAMAGE PARTICLES
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            const size = 5 + Math.random() * 15;
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 150;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, 
                    rgba(255, 255, 255, 1) 0%,
                    rgba(251, 191, 36, 1) 50%,
                    rgba(220, 38, 38, 1) 100%);
                border-radius: 50%;
                z-index: 57;
                pointer-events: none;
                filter: blur(1px) drop-shadow(0 0 5px #fbbf24);
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
                duration: 600 + Math.random() * 300,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => particle.remove(), 900);
        }, i * 15);
    }
    
    setTimeout(() => impactExplosion.remove(), 600);
    
    return impactExplosion;
}

function createAttackEffectForHurtCharacter(characterName, isHurtOnPlayer, damage) {
    if (swordUsers.some(name => characterName.includes(name))) {
        return createMassiveAttackImpactEffect(!isHurtOnPlayer, damage);
    } else if (gunUsers.some(name => characterName.includes(name))) {
        return createMassiveAttackImpactEffect(!isHurtOnPlayer, damage);
    } else if (magicUsers.some(name => characterName.includes(name))) {
        return createMassiveAttackImpactEffect(!isHurtOnPlayer, damage);
    }
    return null;
}

function createAttackEffectForAttacker(characterName, isAttacker) {
    if (swordUsers.some(name => characterName.includes(name))) {
        return createMassiveSwordAttackEffect(isAttacker);
    } else if (gunUsers.some(name => characterName.includes(name))) {
        return createMassiveGunAttackEffect(isAttacker);
    } else if (magicUsers.some(name => characterName.includes(name))) {
        return createMassiveMagicAttackEffect(isAttacker);
    }
    return null;
}

// ============================================
// ATTACK FUNCTIONS WITH MASSIVE IMPACT EFFECTS
// ============================================

// Attack enemy
function attackEnemy() {
    const damage = Math.floor(Math.random() * 15) + 15; // 15-30 damage
    enemyHp = Math.max(0, enemyHp - damage);
    
    // Player attacks - MASSIVE ATTACK EFFECT
    setCharacterState('player', 'attack');
    document.getElementById('playerCharacter').classList.add('attacking');
    
    // Create massive attack effect from attacker
    createAttackEffectForAttacker(currentHero.name, true);
    
    // Extreme screen shake
    document.body.style.animation = 'extreme-shake 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
        document.getElementById('playerCharacter').classList.remove('attacking');
        document.body.style.animation = '';
        
        // Enemy gets hurt - MASSIVE IMPACT EFFECT ON HURT CHARACTER
        setCharacterState('enemy', 'hurt');
        document.getElementById('enemyCharacter').classList.add('hurt');
        showDamage(damage, 'enemy');
        updateHP();
        
        // Create massive impact effect on hurt enemy
        createAttackEffectForHurtCharacter(currentHero.name, false, damage);
        
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
    
    // Enemy attacks - MASSIVE ATTACK EFFECT
    setCharacterState('enemy', 'attack');
    document.getElementById('enemyCharacter').classList.add('attacking');
    
    // Create massive attack effect from attacker
    createAttackEffectForAttacker(currentVillain.name, false);
    
    // Extreme screen shake
    document.body.style.animation = 'extreme-shake 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
        document.getElementById('enemyCharacter').classList.remove('attacking');
        document.body.style.animation = '';
        
        // Player gets hurt - MASSIVE IMPACT EFFECT ON HURT CHARACTER
        setCharacterState('player', 'hurt');
        document.getElementById('playerCharacter').classList.add('hurt');
        showDamage(damage, 'player');
        updateHP();
        
        // Create massive impact effect on hurt player
        createAttackEffectForHurtCharacter(currentVillain.name, true, damage);
        
        setTimeout(() => {
            document.getElementById('playerCharacter').classList.remove('hurt');
            
            if (playerHp <= 0) {
                defeat();
            }
        }, 1200);
    }, 600);
}

// ============================================
// REST OF THE BATTLE FUNCTIONS
// ============================================

// Show damage number
function showDamage(damage, target) {
    const character = target === 'player' ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const damageEl = document.createElement('div');
    damageEl.className = 'damage-number';
    damageEl.textContent = `-${damage}`;
    
    // Critical hit styling (MASSIVE for high damage)
    if (damage > 25) {
        damageEl.style.color = '#fbbf24';
        damageEl.style.fontSize = '60px';
        damageEl.style.fontWeight = '900';
        damageEl.style.textShadow = `
            5px 5px 10px rgba(0, 0, 0, 0.9), 
            0 0 30px #ef4444, 
            0 0 60px #fb923c,
            0 0 90px #fbbf24`;
        damageEl.style.zIndex = '70';
    } else {
        damageEl.style.fontSize = '48px';
        damageEl.style.fontWeight = '800';
        damageEl.style.textShadow = `
            4px 4px 8px rgba(0, 0, 0, 0.9), 
            0 0 20px #ef4444, 
            0 0 40px #fb923c`;
    }
    
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
    
    // Update HP text
    document.getElementById('playerHpText').textContent = `${playerHp}/100`;
    document.getElementById('enemyHpText').textContent = `${enemyHp}/100`;
    
    // Change HP bar color based on health
    if (playerHp < 30) {
        playerHpBar.style.background = 'linear-gradient(to right, #ef4444, #dc2626, #b91c1c)';
    } else if (playerHp < 60) {
        playerHpBar.style.background = 'linear-gradient(to right, #f59e0b, #f97316, #ea580c)';
    } else {
        playerHpBar.style.background = 'linear-gradient(to right, #22c55e, #16a34a, #15803d)';
    }
    
    if (enemyHp < 30) {
        enemyHpBar.style.background = 'linear-gradient(to right, #ef4444, #dc2626, #b91c1c)';
    } else if (enemyHp < 60) {
        enemyHpBar.style.background = 'linear-gradient(to right, #f59e0b, #f97316, #ea580c)';
    } else {
        enemyHpBar.style.background = 'linear-gradient(to right, #22c55e, #16a34a, #15803d)';
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
    console.log('DOMContentLoaded - Initializing battle...');
    
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
});
