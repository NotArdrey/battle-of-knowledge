// Collection page logic
let allCharacters = [];

// Load all characters from all eras
function loadAllCharacters() {
    allCharacters = [];
    
    Object.keys(eraData).forEach(eraKey => {
        const era = eraData[eraKey];
        
        // Add heroes
        era.heroes.forEach((hero, heroIndex) => {
            allCharacters.push({
                ...hero,
                era: era.name,
                eraKey: eraKey,
                characterType: 'hero',
                heroIndex
            });
        });
        
        // Add villains
        era.villains.forEach(villain => {
            allCharacters.push({
                ...villain,
                era: era.name,
                eraKey: eraKey,
                characterType: 'villain'
            });
        });
    });
    
    renderCharacterGrid();
}

// Render character grid
function renderCharacterGrid() {
    const grid = document.getElementById('characterGrid');
    grid.innerHTML = '';
    
    const lang = localStorage.getItem('selectedLanguage') || 'en';
    const unlockedHeroes = getUnlockedHeroes();
    const eraProgress = getEraProgressMap();
    
    allCharacters.forEach((character, index) => {
        const isHero = character.characterType === 'hero';
        const eraUnlocks = unlockedHeroes[character.eraKey] || [0]; // First hero always unlocked
        const eraStatus = eraProgress[character.eraKey] || {};
        
        // First check if the era itself is unlocked
        const isEraUnlocked = checkEraUnlocked(character.eraKey, eraProgress);
        
        // Heroes: era must be unlocked AND hero must be in unlockedHeroes
        // Villains: unlocked when era is unlocked
        let isUnlocked = false;
        if (isEraUnlocked) {
            isUnlocked = isHero 
                ? eraUnlocks.includes(character.heroIndex ?? 0)
                : true; // Villains unlock when era is unlocked
        }
        
        const card = document.createElement('div');
        const typeColor = character.characterType === 'hero' ? 'from-blue-400 to-cyan-400' : 'from-red-400 to-orange-400';
        const borderColor = character.characterType === 'hero' ? 'border-blue-600' : 'border-red-600';
        const lockedClass = isUnlocked ? '' : 'locked';
        const hoverClass = isUnlocked ? 'hover:-translate-y-2 hover:scale-105 hover:shadow-2xl cursor-pointer' : 'cursor-not-allowed';
        
        card.className = `bg-gradient-to-br ${typeColor} border-4 ${borderColor} rounded-2xl p-4 transition-all duration-300 shadow-xl ${hoverClass} ${lockedClass} character-card`;
        if (isUnlocked) {
            card.onclick = () => showCharacterDetails(character);
        }
        
        const heroLabel = translations[lang]['HERO'] || 'HERO';
        const villainLabel = translations[lang]['VILLAIN'] || 'VILLAIN';
        const eraName = translations[lang][character.era] || character.era;
        
        // Different unlock hints based on what's needed
        let unlockHint;
        if (!isEraUnlocked) {
            unlockHint = `Complete ${getPreviousEraName(character.eraKey, lang)} first`;
        } else if (isHero) {
            unlockHint = `Win battles in ${eraName} to unlock`;
        } else {
            unlockHint = `Defeat the boss in ${eraName} to unlock`;
        }
        
        card.innerHTML = `
            <div class="rounded-xl mb-3 bg-cover bg-center h-32 flex items-center justify-center" style="background-image: url('${eraData[character.eraKey].background}');">
                <img src="${getCharacterSprite(character, 'idle')}" alt="${character.name}" class="max-w-full max-h-full object-contain character-image ${isUnlocked ? '' : 'opacity-50'}">
            </div>
            <h3 class="text-white font-bold text-center text-sm mb-1 drop-shadow-lg">${isUnlocked ? character.name : '???'}</h3>
            <p class="text-white text-xs text-center font-semibold">${eraName}</p>
            <div class="text-center mt-2">
                <span class="inline-block px-3 py-1 rounded-full text-xs font-bold ${character.characterType === 'hero' ? 'bg-yellow-400 text-blue-900' : 'bg-gray-800 text-red-400'}">
                    ${character.characterType === 'hero' ? '⭐ ' + heroLabel : '⚔️ ' + villainLabel}
                </span>
            </div>
            ${isUnlocked ? '' : `
                <div class="lock-overlay">
                    <div class="lock-icon">🔒</div>
                    <div class="lock-text">${unlockHint}</div>
                </div>
            `}
        `;
        
        grid.appendChild(card);
    });
}

// Era order for progression checks
const eraOrder = ['early-spanish', 'late-spanish', 'american-colonial', 'ww2'];

// Check if an era is unlocked based on previous era completion
function checkEraUnlocked(eraKey, eraProgress) {
    const eraIndex = eraOrder.indexOf(eraKey);
    if (eraIndex <= 0) return true; // First era always unlocked
    
    const prevEra = eraOrder[eraIndex - 1];
    const prevStatus = eraProgress[prevEra] || {};
    return !!(prevStatus.lessonsComplete && prevStatus.bossDefeated);
}

// Get the name of the previous era for unlock hint
function getPreviousEraName(eraKey, lang) {
    const eraIndex = eraOrder.indexOf(eraKey);
    if (eraIndex <= 0) return '';
    
    const prevEraKey = eraOrder[eraIndex - 1];
    const prevEra = eraData[prevEraKey];
    return translations[lang][prevEra.name] || prevEra.name;
}

// Retrieve unlocked heroes map from localStorage
function getUnlockedHeroes() {
    try {
        return JSON.parse(localStorage.getItem('unlockedHeroes')) || {};
    } catch (error) {
        console.warn('Unable to parse unlockedHeroes, resetting', error);
        return {};
    }
}

// Retrieve era progress map from localStorage
function getEraProgressMap() {
    try {
        return JSON.parse(localStorage.getItem('eraProgress')) || {};
    } catch (error) {
        console.warn('Unable to parse eraProgress, resetting', error);
        return {};
    }
}

// Store current character for re-rendering modal on language change
let currentModalCharacter = null;

// Show character details modal
function showCharacterDetails(character) {
    currentModalCharacter = character;
    const modal = document.getElementById('characterModal');
    const contributions = characterContributions[character.name];
    const lang = localStorage.getItem('selectedLanguage') || 'en';
    
    // Check for era-specific data
    const eraKey = character.eraKey;
    const hasEraSpecific = contributions && contributions.eraSpecific && contributions.eraSpecific[eraKey];
    
    // Set era background
    const eraBg = document.getElementById('modalEraBg');
    if (eraBg && eraData[character.eraKey]) {
        eraBg.style.backgroundImage = `url('${eraData[character.eraKey].background}')`;
    }
    
    // Set character image
    document.getElementById('modalCharacterImg').src = getCharacterSprite(character, 'idle');
    document.getElementById('modalCharacterImg').alt = character.name;
    
    // Set character name and era
    document.getElementById('modalCharacterName').textContent = character.name;
    const eraName = translations[lang][character.era] || character.era;
    document.getElementById('modalCharacterEra').textContent = eraName;
    
    // Set character type badge
    const typeBadge = document.getElementById('modalCharacterType');
    const heroLabel = translations[lang]['HERO'] || 'HERO';
    const villainLabel = translations[lang]['VILLAIN'] || 'VILLAIN';
    
    if (character.characterType === 'hero') {
        typeBadge.textContent = '⭐ ' + heroLabel;
        typeBadge.className = 'inline-block px-6 py-2 rounded-full text-white font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600';
    } else {
        typeBadge.textContent = '⚔️ ' + villainLabel;
        typeBadge.className = 'inline-block px-6 py-2 rounded-full text-white font-bold text-lg bg-gradient-to-r from-red-600 to-orange-600';
    }
    
    // Set contributions
    const contributionsDiv = document.getElementById('modalCharacterContributions');
    const storyDiv = document.getElementById('modalCharacterStory');
    
    // Set story - check era-specific first
    let storyData = null;
    if (hasEraSpecific && contributions.eraSpecific[eraKey].story) {
        storyData = contributions.eraSpecific[eraKey].story;
    } else if (contributions && contributions.story) {
        storyData = contributions.story;
    }
    
    if (storyData) {
        const storyText = storyData[lang] || storyData['en'] || '';
        storyDiv.innerHTML = `<p class="text-amber-800 leading-relaxed">${storyText}</p>`;
    } else {
        const noStoryText = lang === 'tl' ? 'Ang kwento ay paparating...' : 'Story coming soon...';
        storyDiv.innerHTML = `<p class="text-amber-700 italic">${noStoryText}</p>`;
    }
    
    // Set contributions - check era-specific first
    let contributionsData = null;
    if (hasEraSpecific && contributions.eraSpecific[eraKey].contributions) {
        contributionsData = contributions.eraSpecific[eraKey].contributions;
    } else if (contributions && contributions.contributions) {
        contributionsData = contributions.contributions;
    }
    
    if (contributionsData) {
        const contributionsList = contributionsData[lang] || contributionsData['en'] || [];
        contributionsDiv.innerHTML = contributionsList.map(contribution => 
            `<div class="contribution-item flex gap-3">
                <span class="text-amber-600 font-bold flex-shrink-0 text-lg">•</span>
                <p class="text-amber-900">${contribution}</p>
            </div>`
        ).join('');
    } else {
        const noInfoText = lang === 'tl' ? 'Impormasyon sa kasaysayan ay paparating...' : 'Historical information coming soon...';
        contributionsDiv.innerHTML = `<p class="text-amber-700 italic">${noInfoText}</p>`;
    }
    
    // Update "Story" heading translation
    const storyHeading = document.querySelector('[data-translate="Story"]');
    if (storyHeading && translations[lang]['Story']) {
        storyHeading.textContent = translations[lang]['Story'];
    }
    
    // Update "Historical Contributions" heading translation
    const contributionsHeading = document.querySelector('[data-translate="Historical Contributions"]');
    if (contributionsHeading && translations[lang]['Historical Contributions']) {
        contributionsHeading.textContent = translations[lang]['Historical Contributions'];
    }
    
    // Show modal
    modal.classList.remove('hidden');
}

// Update modal translations when language changes
function updateModalTranslations() {
    if (currentModalCharacter && !document.getElementById('characterModal').classList.contains('hidden')) {
        showCharacterDetails(currentModalCharacter);
    }
}

// Close modal
function closeModal() {
    document.getElementById('characterModal').classList.add('hidden');
    currentModalCharacter = null;
}

// Close modal when clicking outside
document.getElementById('characterModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'characterModal') {
        closeModal();
    }
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Wait for language system to initialize first
    setTimeout(() => {
        loadAllCharacters();
    }, 100);
});
