// Learning Module Logic
let currentEraKey = '';
let currentLang = 'en';
let completedLessons = new Set();
let currentLessonId = null;

// Initialize learning module
function initLearningModule() {
    currentEraKey = localStorage.getItem('selectedEra') || 'early-spanish';
    currentLang = localStorage.getItem('selectedLanguage') || 'en';
    
    // Load completed lessons for this era from localStorage
    const savedProgress = localStorage.getItem(`learning_${currentEraKey}`);
    if (savedProgress) {
        completedLessons = new Set(JSON.parse(savedProgress));
    }
    
    loadEraContent();
    updateProgress();
    checkBattleUnlock();
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
    
    // Load lessons
    const container = document.getElementById('lessonsContainer');
    container.innerHTML = '';
    
    eraContent.lessons.forEach((lesson) => {
        const isCompleted = completedLessons.has(lesson.id);
        
        const lessonCard = document.createElement('div');
        lessonCard.className = `lesson-card bg-gradient-to-br ${
            isCompleted 
                ? 'from-green-100 to-emerald-200 border-green-600' 
                : 'from-amber-100 to-yellow-200 border-amber-600'
        } border-3 md:border-4 rounded-xl md:rounded-2xl p-4 md:p-6 cursor-pointer hover:-translate-y-2 hover:scale-105 transition-all duration-300 shadow-lg relative`;
        
        lessonCard.innerHTML = `
            ${isCompleted ? '<div class="absolute top-2 right-2 text-3xl">✓</div>' : ''}
            <div class="text-4xl md:text-5xl mb-3 md:mb-4 text-center">${lesson.icon}</div>
            <h3 class="text-base md:text-lg font-bold text-amber-900 text-center mb-2">${lesson.title}</h3>
            <p class="text-xs md:text-sm text-amber-700 text-center">
                ${isCompleted ? '<span class="text-green-700 font-semibold">✓ Completed</span>' : 'Click to learn'}
            </p>
        `;
        
        lessonCard.onclick = () => openLesson(lesson.id);
        container.appendChild(lessonCard);
    });
}

// Open lesson modal
function openLesson(lessonId) {
    currentLessonId = lessonId;
    const eraContent = learningData[currentEraKey][currentLang];
    const lesson = eraContent.lessons.find(l => l.id === lessonId);
    
    if (!lesson) return;
    
    document.getElementById('modalLessonTitle').textContent = lesson.title;
    document.getElementById('modalLessonContent').innerHTML = lesson.content;
    document.getElementById('lessonModal').classList.remove('hidden');
    
    // Auto-scroll to top of modal
    document.getElementById('lessonModal').scrollTop = 0;
}

// Close lesson modal
function closeLessonModal() {
    document.getElementById('lessonModal').classList.add('hidden');
    currentLessonId = null;
}

// Mark lesson as complete
function markLessonComplete() {
    if (currentLessonId === null) return;
    
    completedLessons.add(currentLessonId);
    
    // Save progress to localStorage
    localStorage.setItem(
        `learning_${currentEraKey}`, 
        JSON.stringify([...completedLessons])
    );
    
    closeLessonModal();
    loadEraContent();
    updateProgress();
    checkBattleUnlock();
    
    // Show encouragement if all lessons completed
    if (completedLessons.size === learningData[currentEraKey][currentLang].lessons.length) {
        showCompletionMessage();
    }
}

// Update progress bar
function updateProgress() {
    const totalLessons = learningData[currentEraKey][currentLang].lessons.length;
    const completed = completedLessons.size;
    const percentage = (completed / totalLessons) * 100;
    
    document.getElementById('progressBar').style.width = `${percentage}%`;
    document.getElementById('lessonProgress').textContent = `${completed} / ${totalLessons}`;
}

// Check if battle should be unlocked
function checkBattleUnlock() {
    const totalLessons = learningData[currentEraKey][currentLang].lessons.length;
    const completed = completedLessons.size;
    const startButton = document.getElementById('startBattleBtn');
    const hint = document.getElementById('completionHint');
    
    if (completed >= totalLessons) {
        startButton.disabled = false;
        startButton.onclick = startBattle;
        hint.classList.add('hidden');
    } else {
        startButton.disabled = true;
        hint.classList.remove('hidden');
    }
}

// Show completion message
function showCompletionMessage() {
    // Create a temporary toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 animate-bounce';
    toast.innerHTML = `
        <p class="text-lg md:text-xl font-bold text-center">
            🎉 Great Job! You've completed all lessons!
        </p>
        <p class="text-sm md:text-base text-center mt-1">
            You're now ready for battle!
        </p>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
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
    let heroesHTML = '';
    
    heroes.forEach((hero, index) => {
        heroesHTML += `
            <div class="bg-gradient-to-br from-blue-400 to-cyan-400 border-3 md:border-4 border-blue-600 rounded-xl md:rounded-2xl p-3 md:p-4 cursor-pointer hover:-translate-y-2 hover:scale-105 transition-all duration-300 shadow-xl" onclick="selectCharacter(${index})">
                <div class="bg-white rounded-lg md:rounded-xl p-2 mb-3 h-24 md:h-32 flex items-center justify-center shadow-inner" style="box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.1);">
                    <img src="${hero.folder}/${hero.idle}" alt="${hero.name}" class="max-w-full max-h-full object-contain">
                </div>
                <h3 class="text-white font-bold text-center text-sm md:text-base drop-shadow-lg">${hero.name}</h3>
            </div>
        `;
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

// Select character and go to battlefield
function selectCharacter(heroIndex) {
    localStorage.setItem('selectedHero', heroIndex);
    window.location.href = 'battlefield.html';
}

// Close character selection modal
function closeCharacterModal() {
    const modal = document.getElementById('characterSelectModal');
    if (modal) {
        modal.remove();
    }
}

// Skip learning and go to character selection or battle
function skipToCharacterSelection() {
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

// Language change handler
function handleLanguageChange() {
    currentLang = localStorage.getItem('selectedLanguage') || 'en';
    loadEraContent();
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
            setTimeout(handleLanguageChange, 100);
        });
    }
});

// Allow closing modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLessonModal();
    }
});
