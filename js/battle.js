// battle.js - COMPLETE VERSION WITH ALL ATTACK EFFECTS

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

// Character type definitions
const swordUsers = ['Lapu-Lapu', 'Raja Humabon', 'Ferdinand Magellan', 
                    'Spanish Soldier', 'Early Spanish Soldier Era', 
                    'Andres Bonifacio', 'Emilio Aguinaldo', 
                    'Commodore George Dewey', 'General Juan Luna'];

const gunUsers = ['American Soldier', 'Douglas MacArthur', 'Japanese Soldier'];

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
// ATTACK EFFECT FUNCTIONS
// ============================================

function createSwordEffect(characterName, isPlayer) {
    const characterElement = isPlayer ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: absolute;
        width: 80px;
        height: 25px;
        background: linear-gradient(90deg, 
            rgba(203, 213, 225, 0) 0%, 
            rgba(248, 250, 252, 0.8) 20%, 
            rgba(251, 191, 36, 1) 50%, 
            rgba(248, 250, 252, 0.8) 80%, 
            rgba(203, 213, 225, 0) 100%);
        border-radius: 4px;
        z-index: 30;
        pointer-events: none;
        filter: drop-shadow(0 0 15px #fbbf24) drop-shadow(0 0 25px #f59e0b);
        transform-origin: ${isPlayer ? 'left center' : 'right center'};
    `;
    
    const rect = characterElement.getBoundingClientRect();
    const offsetX = isPlayer ? rect.width * 0.7 : -rect.width * 0.2;
    const offsetY = rect.height * 0.3;
    
    effect.style.left = `${offsetX}px`;
    effect.style.top = `${offsetY}px`;
    
    // Sword swing animation
    const keyframes = [
        { transform: `rotate(0deg) scale(0.8)`, opacity: 0 },
        { transform: `rotate(${isPlayer ? '45' : '-45'}deg) scale(1.5)`, opacity: 1 },
        { transform: `rotate(${isPlayer ? '90' : '-90'}deg) scale(1.8)`, opacity: 0.8 },
        { transform: `rotate(${isPlayer ? '135' : '-135'}deg) scale(1.5)`, opacity: 0.6 },
        { transform: `rotate(${isPlayer ? '180' : '-180'}deg) scale(1.2)`, opacity: 0.4 },
        { transform: `rotate(${isPlayer ? '225' : '-225'}deg) scale(0.8)`, opacity: 0 }
    ];
    
    effect.animate(keyframes, {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    characterElement.appendChild(effect);
    
    // Create sword trail
    setTimeout(() => {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: absolute;
            width: 50px;
            height: 20px;
            background: linear-gradient(90deg, 
                rgba(251, 191, 36, 0.6) 0%, 
                rgba(245, 158, 11, 0.8) 50%, 
                rgba(251, 191, 36, 0.6) 100%);
            border-radius: 3px;
            z-index: 28;
            pointer-events: none;
            filter: blur(2px);
            opacity: 0.7;
        `;
        
        trail.style.left = `${offsetX}px`;
        trail.style.top = `${offsetY}px`;
        
        const trailKeyframes = [
            { transform: `rotate(${isPlayer ? '0' : '0'}deg) scale(0.8)`, opacity: 0 },
            { transform: `rotate(${isPlayer ? '60' : '-60'}deg) scale(1.3)`, opacity: 0.8 },
            { transform: `rotate(${isPlayer ? '120' : '-120'}deg) scale(1.6)`, opacity: 0.6 },
            { transform: `rotate(${isPlayer ? '180' : '-180'}deg) scale(1.2)`, opacity: 0.4 },
            { transform: `rotate(${isPlayer ? '240' : '-240'}deg) scale(0.8)`, opacity: 0 }
        ];
        
        trail.animate(trailKeyframes, {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        });
        
        characterElement.appendChild(trail);
        
        // Remove effects after animation
        setTimeout(() => {
            effect.remove();
            trail.remove();
        }, 800);
    }, 100);
    
    return effect;
}

function createGunEffect(characterName, isPlayer) {
    const characterElement = isPlayer ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    // Create muzzle flash
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: absolute;
        width: 50px;
        height: 50px;
        background: radial-gradient(circle, 
            rgba(255, 255, 255, 1) 0%, 
            rgba(251, 191, 36, 0.9) 30%, 
            rgba(220, 38, 38, 0.8) 70%, 
            rgba(0, 0, 0, 0) 100%);
        border-radius: 50%;
        z-index: 30;
        pointer-events: none;
        filter: blur(3px);
    `;
    
    const rect = characterElement.getBoundingClientRect();
    const offsetX = isPlayer ? rect.width * 0.85 : -rect.width * 0.15;
    const offsetY = rect.height * 0.4;
    
    flash.style.left = `${offsetX}px`;
    flash.style.top = `${offsetY}px`;
    
    // Flash animation
    const flashKeyframes = [
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'scale(2)', opacity: 1 },
        { transform: 'scale(1.8)', opacity: 0.8 },
        { transform: 'scale(1.4)', opacity: 0.6 },
        { transform: 'scale(1)', opacity: 0.4 },
        { transform: 'scale(0.5)', opacity: 0 }
    ];
    
    flash.animate(flashKeyframes, {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    characterElement.appendChild(flash);
    
    // Create bullet trail
    setTimeout(() => {
        const bullet = document.createElement('div');
        bullet.style.cssText = `
            position: absolute;
            width: 12px;
            height: 12px;
            background: radial-gradient(circle, 
                rgba(255, 255, 255, 1) 0%, 
                rgba(251, 191, 36, 1) 50%, 
                rgba(220, 38, 38, 1) 100%);
            border-radius: 50%;
            z-index: 29;
            pointer-events: none;
            box-shadow: 0 0 15px #dc2626, 0 0 30px #fbbf24;
        `;
        
        bullet.style.left = `${offsetX}px`;
        bullet.style.top = `${offsetY + 5}px`;
        
        // Bullet trail animation
        const distance = isPlayer ? 200 : -200;
        const bulletKeyframes = [
            { transform: 'translateX(0) scale(0.2)', opacity: 0 },
            { transform: `translateX(${distance * 0.2}px) scale(0.5)`, opacity: 1 },
            { transform: `translateX(${distance * 0.4}px) scale(0.8)`, opacity: 0.8 },
            { transform: `translateX(${distance * 0.6}px) scale(1)`, opacity: 0.6 },
            { transform: `translateX(${distance * 0.8}px) scale(1.2)`, opacity: 0.4 },
            { transform: `translateX(${distance}px) scale(1.5)`, opacity: 0 }
        ];
        
        bullet.animate(bulletKeyframes, {
            duration: 500,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        });
        
        characterElement.appendChild(bullet);
        
        // Remove effects after animation
        setTimeout(() => {
            flash.remove();
            bullet.remove();
        }, 600);
    }, 50);
    
    return flash;
}

function createMagicEffect(characterName, isPlayer) {
    const characterElement = isPlayer ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const rect = characterElement.getBoundingClientRect();
    const centerX = rect.width * 0.5;
    const centerY = rect.height * 0.5;
    
    // Create magic burst
    const burst = document.createElement('div');
    burst.style.cssText = `
        position: absolute;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, 
            rgba(79, 70, 229, 0.8) 0%, 
            rgba(129, 140, 248, 0.6) 50%, 
            rgba(199, 210, 254, 0.4) 100%);
        border-radius: 50%;
        z-index: 30;
        pointer-events: none;
        filter: blur(8px);
        mix-blend-mode: screen;
        left: ${centerX}px;
        top: ${centerY}px;
        transform: translate(-50%, -50%);
    `;
    
    // Burst animation
    const burstKeyframes = [
        { transform: 'translate(-50%, -50%) scale(0.3)', filter: 'blur(0px)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1.8)', filter: 'blur(8px)', opacity: 0.8 },
        { transform: 'translate(-50%, -50%) scale(2.5)', filter: 'blur(12px)', opacity: 0.6 },
        { transform: 'translate(-50%, -50%) scale(1.8)', filter: 'blur(8px)', opacity: 0.4 },
        { transform: 'translate(-50%, -50%) scale(0.3)', filter: 'blur(0px)', opacity: 0 }
    ];
    
    burst.animate(burstKeyframes, {
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    characterElement.appendChild(burst);
    
    // Create magic orb
    const orb = document.createElement('div');
    orb.style.cssText = `
        position: absolute;
        width: 60px;
        height: 60px;
        background: radial-gradient(circle, 
            rgba(139, 92, 246, 1) 0%, 
            rgba(167, 139, 250, 0.8) 50%, 
            rgba(221, 214, 254, 0.6) 100%);
        border-radius: 50%;
        z-index: 30;
        pointer-events: none;
        filter: drop-shadow(0 0 20px #8b5cf6);
        left: ${centerX}px;
        top: ${centerY}px;
        transform: translate(-50%, -50%);
    `;
    
    // Orb animation
    const orbKeyframes = [
        { transform: 'translate(-50%, -50%) scale(0.5) rotate(0deg)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1.4) rotate(45deg)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(1.8) rotate(90deg)', opacity: 0.8 },
        { transform: 'translate(-50%, -50%) scale(1.4) rotate(135deg)', opacity: 0.6 },
        { transform: 'translate(-50%, -50%) scale(0.8) rotate(180deg)', opacity: 0.4 },
        { transform: 'translate(-50%, -50%) scale(0.5) rotate(225deg)', opacity: 0 }
    ];
    
    orb.animate(orbKeyframes, {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    characterElement.appendChild(orb);
    
    // Create magic ring
    const ring = document.createElement('div');
    ring.style.cssText = `
        position: absolute;
        width: 80px;
        height: 80px;
        border: 4px solid rgba(167, 139, 250, 0.8);
        border-radius: 50%;
        z-index: 29;
        pointer-events: none;
        filter: drop-shadow(0 0 15px #a78bfa);
        left: ${centerX}px;
        top: ${centerY}px;
        transform: translate(-50%, -50%);
    `;
    
    // Ring animation
    const ringKeyframes = [
        { transform: 'translate(-50%, -50%) scale(0.5) rotate(0deg)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(2.5) rotate(180deg)', opacity: 0.8 },
        { transform: 'translate(-50%, -50%) scale(3.5) rotate(360deg)', opacity: 0.6 },
        { transform: 'translate(-50%, -50%) scale(4.5) rotate(540deg)', opacity: 0.4 },
        { transform: 'translate(-50%, -50%) scale(5.5) rotate(720deg)', opacity: 0 }
    ];
    
    ring.animate(ringKeyframes, {
        duration: 1200,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    characterElement.appendChild(ring);
    
    // Create multiple sparkles
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: absolute;
                width: 25px;
                height: 25px;
                background: radial-gradient(circle, 
                    rgba(255, 255, 255, 1) 0%, 
                    rgba(240, 171, 252, 0.8) 50%, 
                    rgba(217, 70, 239, 0.6) 100%);
                border-radius: 50%;
                z-index: 31;
                pointer-events: none;
                filter: drop-shadow(0 0 10px #ffffff);
                left: ${centerX}px;
                top: ${centerY}px;
                transform: translate(-50%, -50%);
            `;
            
            // Random direction for sparkle
            const angle = Math.random() * Math.PI * 2;
            const distance = 60;
            
            const sparkleKeyframes = [
                { 
                    transform: 'translate(-50%, -50%) scale(1)', 
                    opacity: 0 
                },
                { 
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance * 0.3}px, ${Math.sin(angle) * distance * 0.3}px) scale(1.3) rotate(180deg)`, 
                    opacity: 1 
                },
                { 
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1.6) rotate(360deg)`, 
                    opacity: 0.5 
                },
                { 
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance * 1.3}px, ${Math.sin(angle) * distance * 1.3}px) scale(1.3) rotate(540deg)`, 
                    opacity: 0.3 
                },
                { 
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance * 1.6}px, ${Math.sin(angle) * distance * 1.6}px) scale(1) rotate(720deg)`, 
                    opacity: 0 
                }
            ];
            
            sparkle.animate(sparkleKeyframes, {
                duration: 600 + Math.random() * 400,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            characterElement.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1000);
        }, i * 120);
    }
    
    // Remove effects after animation
    setTimeout(() => {
        burst.remove();
        orb.remove();
        ring.remove();
    }, 1200);
    
    return { burst, orb, ring };
}

function createAttackEffect(characterName, isPlayer) {
    // Check character type and create appropriate effect
    if (swordUsers.some(name => characterName.includes(name))) {
        return createSwordEffect(characterName, isPlayer);
    } else if (gunUsers.some(name => characterName.includes(name))) {
        return createGunEffect(characterName, isPlayer);
    } else if (magicUsers.some(name => characterName.includes(name))) {
        return createMagicEffect(characterName, isPlayer);
    }
    return null;
}

function createHitEffect(target, damage) {
    const targetElement = target === 'player' ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    // Create hit flash
    const hitFlash = document.createElement('div');
    hitFlash.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, 
            rgba(255, 50, 50, 0.4) 0%, 
            rgba(255, 100, 100, 0.2) 50%, 
            rgba(255, 150, 150, 0) 100%);
        border-radius: 50%;
        z-index: 25;
        pointer-events: none;
    `;
    
    // Hit flash animation
    const flashKeyframes = [
        { opacity: 0.8, transform: 'scale(1)' },
        { opacity: 0.4, transform: 'scale(1.1)' },
        { opacity: 0, transform: 'scale(1)' }
    ];
    
    hitFlash.animate(flashKeyframes, {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards'
    });
    
    targetElement.appendChild(hitFlash);
    
    // Remove after animation
    setTimeout(() => {
        hitFlash.remove();
    }, 300);
    
    // Create hit particles for critical hits
    if (damage > 25) {
        createHitParticles(targetElement);
    }
}

function createHitParticles(targetElement) {
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: linear-gradient(135deg, 
                    #ff6b6b 0%, 
                    #ff8e8e 50%, 
                    #ffb3b3 100%);
                border-radius: 50%;
                z-index: 26;
                pointer-events: none;
                filter: drop-shadow(0 0 5px #ff6b6b);
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            `;
            
            // Random direction and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 60;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            const particleKeyframes = [
                { 
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1 
                },
                { 
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(0.2)`,
                    opacity: 0 
                }
            ];
            
            particle.animate(particleKeyframes, {
                duration: 500 + Math.random() * 300,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            targetElement.appendChild(particle);
            
            setTimeout(() => particle.remove(), 800);
        }, i * 30);
    }
}

// ============================================
// ATTACK FUNCTIONS WITH EFFECTS
// ============================================

// Attack enemy
function attackEnemy() {
    const damage = Math.floor(Math.random() * 15) + 15; // 15-30 damage
    enemyHp = Math.max(0, enemyHp - damage);
    
    // Player attacks
    setCharacterState('player', 'attack');
    document.getElementById('playerCharacter').classList.add('attacking');
    
    // Create attack effect
    createAttackEffect(currentHero.name, true);
    
    // Screen shake effect
    document.body.style.animation = 'shake 0.5s ease-out';
    
    setTimeout(() => {
        document.getElementById('playerCharacter').classList.remove('attacking');
        document.body.style.animation = '';
        
        // Enemy gets hurt
        setCharacterState('enemy', 'hurt');
        document.getElementById('enemyCharacter').classList.add('hurt');
        showDamage(damage, 'enemy');
        updateHP();
        
        // Create hit effect on enemy
        createHitEffect('enemy', damage);
        
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
    
    // Create attack effect
    createAttackEffect(currentVillain.name, false);
    
    // Screen shake effect
    document.body.style.animation = 'shake 0.5s ease-out';
    
    setTimeout(() => {
        document.getElementById('enemyCharacter').classList.remove('attacking');
        document.body.style.animation = '';
        
        // Player gets hurt
        setCharacterState('player', 'hurt');
        document.getElementById('playerCharacter').classList.add('hurt');
        showDamage(damage, 'player');
        updateHP();
        
        // Create hit effect on player
        createHitEffect('player', damage);
        
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
    
    // Critical hit styling
    if (damage > 25) {
        damageEl.style.color = '#fbbf24';
        damageEl.style.fontSize = '48px';
        damageEl.style.textShadow = '4px 4px 8px rgba(0, 0, 0, 0.9), 0 0 20px #ef4444, 0 0 40px #fb923c';
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
