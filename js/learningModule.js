// Learning Module Logic
let currentEraKey = '';
let currentLang = localStorage.getItem('selectedLanguage') || 'en';
let completedLessons = new Set();
let currentLessonIndex = 0;
let currentEraLessons = [];
const eraOrder = ['early-spanish', 'late-spanish', 'american-colonial', 'ww2'];

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

// Initialize learning module
function initLearningModule() {
    currentEraKey = localStorage.getItem('selectedEra') || 'early-spanish';
    currentLang = localStorage.getItem('selectedLanguage') || 'en';

    // Ensure progress record exists for the current era
    updateEraProgress(currentEraKey, {});
    
    // Load completed lessons for this era from localStorage
    const savedProgress = localStorage.getItem(`learning_${currentEraKey}`);
    if (savedProgress) {
        completedLessons = new Set(JSON.parse(savedProgress));
    }
    
    loadEraContent();
    setupLessonNavigation();
    updateProgress();
    loadCurrentLesson();
}

// Load era content
function loadEraContent() {
    const eraContent = learningData[currentEraKey][currentLang];
    
    if (!eraContent) {
        console.error('No content found for era:', currentEraKey, 'language:', currentLang);
        return;
    }
    
    // Update title
    document.getElementById('eraTitle').textContent = eraContent.title;
    
    // Store lessons
    currentEraLessons = eraContent.lessons;
    
    // Create lesson indicators
    createLessonIndicators();
}

// Create lesson indicators
function createLessonIndicators() {
    const container = document.getElementById('lessonIndicators');
    container.innerHTML = '';
    
    currentEraLessons.forEach((lesson, index) => {
        const isCompleted = completedLessons.has(lesson.id);
        const isCurrent = index === currentLessonIndex;
        
        const indicator = document.createElement('div');
        indicator.className = `lesson-indicator ${isCurrent ? 'current' : isCompleted ? 'completed' : 'upcoming'}`;
        indicator.textContent = index + 1;
        indicator.title = lesson.title;
        
        if (!isCurrent) {
            indicator.onclick = () => {
                // Only allow clicking on completed lessons or the next uncompleted lesson
                if (isCompleted || index === getNextUncompletedIndex()) {
                    currentLessonIndex = index;
                    loadCurrentLesson();
                    createLessonIndicators();
                }
            };
            
            // Add pointer cursor only if clickable
            if (isCompleted || index === getNextUncompletedIndex()) {
                indicator.style.cursor = 'pointer';
            } else {
                indicator.style.cursor = 'not-allowed';
                indicator.title += ' (Complete previous lessons first)';
            }
        } else {
            indicator.style.cursor = 'default';
        }
        
        container.appendChild(indicator);
    });
}

// Get the index of the next uncompleted lesson
function getNextUncompletedIndex() {
    for (let i = 0; i < currentEraLessons.length; i++) {
        if (!completedLessons.has(currentEraLessons[i].id)) {
            return i;
        }
    }
    return currentEraLessons.length; // All completed
}

// Load current lesson
function loadCurrentLesson() {
    if (currentEraLessons.length === 0) return;
    
    const lesson = currentEraLessons[currentLessonIndex];
    const isCompleted = completedLessons.has(lesson.id);
    
    // Update lesson display
    document.getElementById('currentLessonIcon').textContent = lesson.icon;
    document.getElementById('currentLessonTitle').textContent = lesson.title;
    document.getElementById('currentLessonContent').innerHTML = lesson.content;
    document.getElementById('currentLessonNumber').textContent = `${currentLessonIndex + 1} / ${currentEraLessons.length}`;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update complete button
    const completeBtn = document.getElementById('completeLessonBtn');
    const completeText = translations && translations[currentLang] ? translations[currentLang]['markComplete'] : '✓ Mark as Complete';
    const completedText = translations && translations[currentLang] ? translations[currentLang]['Completed'] : '✓ Completed';
    
    if (isCompleted) {
        completeBtn.disabled = true;
        completeBtn.classList.remove('complete-button');
        completeBtn.classList.add('next-button');
        completeBtn.querySelector('span').textContent = completedText;
    } else {
        completeBtn.disabled = false;
        completeBtn.classList.remove('next-button');
        completeBtn.classList.add('complete-button');
        completeBtn.querySelector('span').textContent = completeText;
    }
    
    // Auto-scroll to top of lesson content
    document.getElementById('currentLessonContent').scrollTop = 0;
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevLessonBtn');
    const nextBtn = document.getElementById('nextLessonBtn');
    
    // Previous button
    prevBtn.disabled = currentLessonIndex === 0;
    
    // Next button - only enabled if current lesson is completed
    const isCurrentCompleted = completedLessons.has(currentEraLessons[currentLessonIndex].id);
    nextBtn.disabled = !isCurrentCompleted || currentLessonIndex === currentEraLessons.length - 1;
    
    // Update battle button
    checkBattleUnlock();
}

// Complete current lesson
function completeCurrentLesson() {
    if (currentEraLessons.length === 0) return;
    
    const lesson = currentEraLessons[currentLessonIndex];
    
    // Mark as complete
    completedLessons.add(lesson.id);
    
    // Save progress to localStorage
    localStorage.setItem(
        `learning_${currentEraKey}`, 
        JSON.stringify([...completedLessons])
    );
    
    // Show completion animation
    showLessonCompletion();
    
    // Update UI
    updateProgress();
    updateNavigationButtons();
    createLessonIndicators();
    
    // If all lessons completed, show celebration
    if (completedLessons.size === currentEraLessons.length) {
        updateEraProgress(currentEraKey, { lessonsComplete: true });
        setTimeout(showAllLessonsCompleted, 500);
    }
    
    // If this wasn't the last lesson, automatically move to next after a delay
    if (currentLessonIndex < currentEraLessons.length - 1) {
        setTimeout(() => {
            currentLessonIndex++;
            loadCurrentLesson();
            createLessonIndicators();
        }, 800);
    }
}

// Show lesson completion animation
function showLessonCompletion() {
    const completeBtn = document.getElementById('completeLessonBtn');
    const originalText = completeBtn.querySelector('span').textContent;
    
    // Change button text briefly
    completeBtn.querySelector('span').textContent = '✓ Done!';
    completeBtn.style.background = 'linear-gradient(to right, rgba(34, 197, 94, 0.9), rgba(21, 128, 61, 0.9))';
    completeBtn.style.borderColor = 'rgba(21, 128, 61, 0.6)';
    completeBtn.style.color = 'white';
    
    // Create confetti effect
    createConfetti();
    
    // Revert button after delay
    setTimeout(() => {
        const lesson = currentEraLessons[currentLessonIndex];
        const isCompleted = completedLessons.has(lesson.id);
        
        if (isCompleted) {
            completeBtn.disabled = true;
            completeBtn.classList.remove('complete-button');
            completeBtn.classList.add('next-button');
            completeBtn.querySelector('span').textContent = translations && translations[currentLang] ? translations[currentLang]['Completed'] : '✓ Completed';
        }
    }, 1000);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#fbbf24', '#f59e0b', '#10b981', '#34d399', '#3b82f6', '#6366f1'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        // Animation
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Show all lessons completed message
function showAllLessonsCompleted() {
    // Create celebration message
    const celebration = document.createElement('div');
    celebration.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none';
    celebration.innerHTML = `
        <div class="bg-gradient-to-br from-green-500 to-emerald-600 text-white px-8 py-6 rounded-2xl shadow-2xl transform -translate-y-10 animate-bounce text-center max-w-md">
            <p class="text-2xl md:text-3xl font-bold mb-2">🎉 Congratulations!</p>
            <p class="text-lg md:text-xl">You've completed all lessons!</p>
            <p class="text-base md:text-lg mt-2">You can now start the battle!</p>
        </div>
    `;
    
    document.body.appendChild(celebration);
    
    // Remove after 3 seconds
    setTimeout(() => {
        celebration.remove();
    }, 3000);
}

// Previous lesson
function previousLesson() {
    if (currentLessonIndex > 0) {
        currentLessonIndex--;
        loadCurrentLesson();
        createLessonIndicators();
    }
}

// Next lesson
function nextLesson() {
    const lesson = currentEraLessons[currentLessonIndex];
    const isCompleted = completedLessons.has(lesson.id);
    
    if (isCompleted && currentLessonIndex < currentEraLessons.length - 1) {
        currentLessonIndex++;
        loadCurrentLesson();
        createLessonIndicators();
    }
}

// Update progress bar
function updateProgress() {
    const totalLessons = currentEraLessons.length;
    const completed = completedLessons.size;
    const percentage = (completed / totalLessons) * 100;
    
    document.getElementById('progressBar').style.width = `${percentage}%`;
    document.getElementById('lessonProgress').textContent = `${completed} / ${totalLessons}`;
}

// Check if battle should be unlocked
function checkBattleUnlock() {
    const totalLessons = currentEraLessons.length;
    const completed = completedLessons.size;
    const startButton = document.getElementById('startBattleBtn');
    const hint = document.getElementById('completionHint');
    
    if (completed >= totalLessons) {
        startButton.disabled = false;
        startButton.onclick = startBattle;
        hint.textContent = translations && translations[currentLang] ? translations[currentLang]['readyForBattle'] : 'Ready for battle! Click to start!';
        hint.classList.add('text-green-600');
        hint.classList.remove('text-amber-700');
    } else {
        startButton.disabled = true;
        hint.textContent = translations && translations[currentLang] ? translations[currentLang]['completeAllLessons'] : 'Complete all lessons to unlock the battle!';
        hint.classList.remove('text-green-600');
        hint.classList.add('text-amber-700');
    }
}

// Setup lesson navigation
function setupLessonNavigation() {
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            previousLesson();
        } else if (e.key === 'ArrowRight') {
            nextLesson();
        } else if (e.key === 'Enter' || e.key === ' ') {
            const completeBtn = document.getElementById('completeLessonBtn');
            if (!completeBtn.disabled) {
                completeCurrentLesson();
            }
        }
    });
}

// Start battle
function startBattle() {
    const selectedEra = localStorage.getItem('selectedEra');
    const selectedHero = localStorage.getItem('selectedHero');
    
    // Check if era has multiple heroes and no hero was selected yet
    if (eraData[selectedEra] && eraData[selectedEra].heroes.length > 1 && selectedHero === null) {
        // Show character selection modal
        showCharacterSelect();
    } else {
        // Go directly to battlefield
        window.location.href = 'battlefield.html';
    }
}

// Show character selection
function showCharacterSelect() {
    const era = currentEraKey;
    const modal = document.createElement('div');
    modal.id = 'characterSelectModal';
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
    
    const heroes = eraData[era].heroes;
    const unlockedIndices = getUnlockedHeroesForEra(era);
    let heroesHTML = '';
    
    heroes.forEach((hero, index) => {
        const isUnlocked = unlockedIndices.includes(index);
        
        if (isUnlocked) {
            heroesHTML += `
                <div class="bg-gradient-to-br from-blue-400 to-cyan-400 border-3 md:border-4 border-blue-600 rounded-xl md:rounded-2xl p-3 md:p-4 cursor-pointer hover:-translate-y-2 hover:scale-105 transition-all duration-300 shadow-xl" onclick="selectCharacter(${index})">
                    <div class="bg-white rounded-lg md:rounded-xl p-2 mb-3 h-24 md:h-32 flex items-center justify-center shadow-inner" style="box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.1);">
                        <img src="${hero.folder}/${hero.idle}" alt="${hero.name}" class="max-w-full max-h-full object-contain">
                    </div>
                    <h3 class="text-white font-bold text-center text-sm md:text-base drop-shadow-lg">${hero.name}</h3>
                </div>
            `;
        } else {
            heroesHTML += `
                <div class="bg-gradient-to-br from-gray-400 to-gray-500 border-3 md:border-4 border-gray-600 rounded-xl md:rounded-2xl p-3 md:p-4 cursor-not-allowed opacity-70 shadow-xl relative">
                    <div class="absolute inset-0 flex items-center justify-center z-10">
                        <span class="text-4xl">🔒</span>
                    </div>
                    <div class="bg-gray-300 rounded-lg md:rounded-xl p-2 mb-3 h-24 md:h-32 flex items-center justify-center shadow-inner filter grayscale" style="box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.1);">
                        <img src="${hero.folder}/${hero.idle}" alt="${hero.name}" class="max-w-full max-h-full object-contain opacity-50">
                    </div>
                    <h3 class="text-gray-600 font-bold text-center text-sm md:text-base drop-shadow-lg">${hero.name}</h3>
                    <p class="text-gray-500 text-xs text-center mt-1">Win battles to unlock</p>
                </div>
            `;
        }
    });
    
    modal.innerHTML = `
        <div class="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl md:rounded-3xl border-4 md:border-8 border-amber-800 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div class="p-6 md:p-8">
                <h2 class="text-2xl md:text-4xl font-extrabold text-amber-900 text-center mb-6">
                    <span data-translate="Choose Your Hero">Choose Your Hero</span>
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-${heroes.length <= 2 ? '2' : '3'} gap-4 mb-6">
                    ${heroesHTML}
                </div>
                <div class="text-center">
                    <button onclick="closeCharacterModal()" class="bg-gradient-to-r from-gray-300 to-gray-400 border-3 border-gray-600 rounded-xl px-6 md:px-8 py-3 text-lg md:text-xl font-bold text-gray-800 hover:-translate-y-1 transition-all duration-300">
                        <span data-translate="Cancel">Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Select character
function selectCharacter(heroIndex) {
    localStorage.setItem('selectedHero', heroIndex);
    window.location.href = 'battlefield.html';
}

// Get unlocked heroes
function getUnlockedHeroesForEra(eraKey) {
    const unlockedHeroes = JSON.parse(localStorage.getItem('unlockedHeroes')) || {};
    return unlockedHeroes[eraKey] || [0];
}

// Close character modal
function closeCharacterModal() {
    const modal = document.getElementById('characterSelectModal');
    if (modal) {
        modal.remove();
    }
}

// Language change handler
function handleLanguageChange() {
    currentLang = localStorage.getItem('selectedLanguage') || 'en';
    loadEraContent();
    updateProgress();
    loadCurrentLesson();
}

// Listen for language changes
window.addEventListener('storage', (e) => {
    if (e.key === 'selectedLanguage') {
        handleLanguageChange();
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLearningModule();
    
    // Setup language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            setTimeout(handleLanguageChange, 50);
        });
    }
});
