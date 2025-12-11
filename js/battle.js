// battle.js - COMPLETE VERSION WITH SOUND EFFECTS

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

const gunUsers = ['American Soldier', 'Douglas MacArthur', 'Japanese Soldier', 
                  'Spanish Commander', 'Late Spanish Commander Era'];

const magicUsers = ['Jose Rizal', 'Apolinario Mabini'];

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Sound effects - preload them
const soundEffects = {
    sword: new Audio('assets/SFX/Attacks/Sword.mp3'),
    gun: new Audio('assets/SFX/Attacks/Gun.mp3'),
    magic: new Audio('assets/SFX/Attacks/Magic.mp3'),
    hit: new Audio('assets/SFX/Attacks/Hit.mp3'), // Optional: add a hit sound
    damage: new Audio('assets/SFX/Attacks/Damage.mp3') // Optional: add damage sound
};

// Configure sound settings
Object.values(soundEffects).forEach(sound => {
    sound.preload = 'auto';
    sound.volume = isMobile ? 0.5 : 0.7; // Lower volume on mobile
});

// Play sound effect with error handling
function playSound(soundName) {
    try {
        const sound = soundEffects[soundName];
        if (sound) {
            // Create a new instance to allow overlapping sounds
            const soundClone = new Audio(sound.src);
            soundClone.volume = sound.volume;
            soundClone.play().catch(e => console.log('Sound play failed:', e));
        }
    } catch (error) {
        console.log('Sound error:', error);
    }
}

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
// IMPACTFUL ATTACK EFFECT FUNCTIONS WITH SOUND
// ============================================

// Mobile-optimized screen shake
function mobileShake() {
    if (isMobile) {
        // For mobile: Simple translate animation
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
        // For desktop: CSS animation
        document.body.style.animation = 'mobile-shake 0.4s ease-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 400);
    }
}

// Create GIANT sword effect WITH SOUND
function createGiantSwordEffect(isAttacker) {
    // Play sword sound
    playSound('sword');
    
    const characterElement = isAttacker ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const battleArea = document.querySelector('.battle-area');
    const rect = characterElement.getBoundingClientRect();
    const battleRect = battleArea.getBoundingClientRect();
    
    // GIANT sword slash that covers most of the screen
    const swordSlash = document.createElement('div');
    swordSlash.style.cssText = `
        position: fixed;
        width: ${isMobile ? '200px' : '350px'};
        height: ${isMobile ? '100px' : '180px'};
        background: linear-gradient(45deg, 
            transparent 0%,
            rgba(251, 191, 36, 0.95) 25%,
            rgba(245, 158, 11, 1) 50%,
            rgba(220, 38, 38, 1) 75%,
            rgba(251, 191, 36, 0.95) 100%);
        z-index: 9999;
        pointer-events: none;
        filter: drop-shadow(0 0 ${isMobile ? '20px' : '40px'} #fbbf24) 
                drop-shadow(0 0 ${isMobile ? '40px' : '80px'} #dc2626);
        clip-path: polygon(0% 40%, 20% 30%, 40% 20%, 60% 30%, 80% 40%, 100% 60%, 80% 70%, 60% 80%, 40% 70%, 20% 60%);
        mix-blend-mode: screen;
    `;
    
    const startX = isAttacker ? rect.right - (isMobile ? 80 : 150) : rect.left + (isMobile ? 80 : 150);
    const startY = rect.top + rect.height * 0.3;
    const endX = isAttacker ? battleRect.right - (isMobile ? 80 : 150) : battleRect.left + (isMobile ? 80 : 150);
    
    swordSlash.style.left = `${startX}px`;
    swordSlash.style.top = `${startY}px`;
    swordSlash.style.transform = `rotate(${isAttacker ? '15' : '165'}deg) scale(0)`;
    
    document.body.appendChild(swordSlash);
    
    // Create multiple sword trails for impact
    for (let i = 0; i < (isMobile ? 3 : 6); i++) {
        setTimeout(() => {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: ${isMobile ? '100px' : '200px'};
                height: ${isMobile ? '30px' : '60px'};
                background: linear-gradient(45deg, 
                    rgba(251, 191, 36, 0.8) 0%,
                    rgba(220, 38, 38, 0.6) 100%);
                z-index: 9998;
                pointer-events: none;
                filter: blur(${isMobile ? '3px' : '5px'});
                opacity: 0.8;
                left: ${startX + (isAttacker ? i * 20 : -i * 20)}px;
                top: ${startY + (i * 10)}px;
                transform: rotate(${isAttacker ? '15' : '165'}deg) scale(0);
                border-radius: ${isMobile ? '5px' : '10px'};
            `;
            
            document.body.appendChild(trail);
            
            trail.animate([
                { transform: `rotate(${isAttacker ? '15' : '165'}deg) scale(0)`, opacity: 0 },
                { transform: `rotate(${isAttacker ? '15' : '165'}deg) scale(${1.5 + i * 0.2})`, opacity: 0.7 },
                { transform: `rotate(${isAttacker ? '15' : '165'}deg) scale(0)`, opacity: 0 }
            ], {
                duration: isMobile ? 400 : 600,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => trail.remove(), isMobile ? 400 : 600);
        }, i * 50);
    }
    
    // Main sword animation
    swordSlash.animate([
        { 
            transform: `rotate(${isAttacker ? '15' : '165'}deg) scale(0)`, 
            opacity: 0
        },
        { 
            transform: `rotate(${isAttacker ? '15' : '165'}deg) scale(${isMobile ? '1.8' : '2.5'})`, 
            opacity: 1
        },
        { 
            transform: `rotate(${isAttacker ? '15' : '165'}deg) scale(${isMobile ? '2.2' : '3'})`, 
            opacity: 0.8,
            left: `${endX}px`
        },
        { 
            transform: `rotate(${isAttacker ? '15' : '165'}deg) scale(${isMobile ? '2.5' : '3.5'})`, 
            opacity: 0,
            left: `${endX}px`,
            top: `${startY + (isMobile ? 80 : 150)}px`
        }
    ], {
        duration: isMobile ? 500 : 700,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });
    
    // ENERGY WAVES from sword impact
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
                transform: translate(-50%, -50%) scale(0);
            `;
            
            document.body.appendChild(wave);
            
            wave.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.7 },
                { transform: 'translate(-50%, -50%) scale(2.5)', opacity: 0 }
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

// Create GIANT gun effect WITH SOUND
function createGiantGunEffect(isAttacker) {
    // Play gun sound with slight variation for multiple shots
    setTimeout(() => playSound('gun'), 0);
    if (!isMobile) {
        setTimeout(() => playSound('gun'), 50); // Second shot for desktop
        setTimeout(() => playSound('gun'), 100); // Third shot for desktop
    }
    
    const characterElement = isAttacker ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const battleArea = document.querySelector('.battle-area');
    const rect = characterElement.getBoundingClientRect();
    const battleRect = battleArea.getBoundingClientRect();
    
    // HUGE muzzle flash
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
    
    // EXPLOSIVE flash animation
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
    
    // GIANT bullet trail - LASER BEAM
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
        
        // LASER beam animation
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
        
        // SHELL CASINGS flying everywhere
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

// Create GIANT magic effect WITH SOUND
function createGiantMagicEffect(isAttacker) {
    // Play magic sound
    playSound('magic');
    
    const characterElement = isAttacker ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const battleArea = document.querySelector('.battle-area');
    const rect = characterElement.getBoundingClientRect();
    const battleRect = battleArea.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // HUGE magic sphere
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
    
    // ENERGY SPHERE animation
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
    
    // ENERGY WAVES expanding outward
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
    
    // MAGIC PARTICLES STORM
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
    
    // ARCANE RUNES floating around
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

// Create GIANT impact effect WITH SOUND
function createGiantImpactEffect(isAttacker, damage) {
    // Play hit sound (if available)
    if (soundEffects.hit) {
        playSound('hit');
    }
    // Play damage sound for critical hits
    if (damage > 25 && soundEffects.damage) {
        setTimeout(() => playSound('damage'), 100);
    }
    
    const targetElement = isAttacker ? 
        document.getElementById('enemyCharacter') : 
        document.getElementById('playerCharacter');
    
    const rect = targetElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // MASSIVE impact explosion
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
    
    // EXPLOSION animation
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
    
    // SHOCKWAVE RINGS
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
    
    // CRACK EFFECT for critical hits
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
    
    // IMPACT PARTICLES flying out
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

// Show damage number - MASSIVE and impactful
function showDamage(damage, target) {
    const character = target === 'player' ? 
        document.getElementById('playerCharacter') : 
        document.getElementById('enemyCharacter');
    
    const damageEl = document.createElement('div');
    damageEl.className = 'damage-number';
    damageEl.textContent = `-${damage}`;
    
    // GIANT damage numbers
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
    damageEl.style.top = `${rect.top + rect.height * 0.15}px`; // Higher for more visibility
    damageEl.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(damageEl);
    
    // For critical hits, add a second damage number for emphasis
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
// ATTACK FUNCTIONS WITH GIANT EFFECTS & SOUND
// ============================================

// Attack enemy
function attackEnemy() {
    const damage = Math.floor(Math.random() * 15) + 15; // 15-30 damage
    enemyHp = Math.max(0, enemyHp - damage);
    
    // Player attacks
    setCharacterState('player', 'attack');
    document.getElementById('playerCharacter').classList.add('attacking');
    
    // Create GIANT attack effect (includes sound)
    createAttackEffectForAttacker(currentHero.name, true);
    
    // Screen shake
    mobileShake();
    
    setTimeout(() => {
        document.getElementById('playerCharacter').classList.remove('attacking');
        
        // Enemy gets hurt
        setCharacterState('enemy', 'hurt');
        document.getElementById('enemyCharacter').classList.add('hurt');
        showDamage(damage, 'enemy');
        updateHP();
        
        // Create GIANT impact effect (includes hit sound)
        createAttackEffectForHurtCharacter(currentHero.name, false, damage);
        
        setTimeout(() => {
            document.getElementById('enemyCharacter').classList.remove('hurt');
            
            if (enemyHp <= 0) {
                victory();
            }
        }, isMobile ? 1000 : 1200);
    }, isMobile ? 400 : 600);
}

// Attack player
function attackPlayer() {
    const damage = Math.floor(Math.random() * 15) + 15; // 15-30 damage
    playerHp = Math.max(0, playerHp - damage);
    
    // Enemy attacks
    setCharacterState('enemy', 'attack');
    document.getElementById('enemyCharacter').classList.add('attacking');
    
    // Create GIANT attack effect (includes sound)
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
        
        // Create GIANT impact effect (includes hit sound)
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
