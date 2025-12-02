// Collection page logic
let allCharacters = [];

// Load all characters from all eras
function loadAllCharacters() {
    allCharacters = [];
    
    Object.keys(eraData).forEach(eraKey => {
        const era = eraData[eraKey];
        
        // Add heroes
        era.heroes.forEach(hero => {
            allCharacters.push({
                ...hero,
                era: era.name,
                eraKey: eraKey,
                characterType: 'hero'
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
    
    allCharacters.forEach((character, index) => {
        const card = document.createElement('div');
        const typeColor = character.characterType === 'hero' ? 'from-blue-400 to-cyan-400' : 'from-red-400 to-orange-400';
        const borderColor = character.characterType === 'hero' ? 'border-blue-600' : 'border-red-600';
        
        card.className = `bg-gradient-to-br ${typeColor} border-4 ${borderColor} rounded-2xl p-4 cursor-pointer hover:-translate-y-2 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`;
        card.onclick = () => showCharacterDetails(character);
        
        const heroLabel = translations[lang]['HERO'] || 'HERO';
        const villainLabel = translations[lang]['VILLAIN'] || 'VILLAIN';
        const eraName = translations[lang][character.era] || character.era;
        
        card.innerHTML = `
            <div class="rounded-xl mb-3 bg-cover bg-center h-32 flex items-center justify-center" style="background-image: url('${eraData[character.eraKey].background}');">
                <img src="${getCharacterSprite(character, 'idle')}" alt="${character.name}" class="max-w-full max-h-full object-contain">
            </div>
            <h3 class="text-white font-bold text-center text-sm mb-1 drop-shadow-lg">${character.name}</h3>
            <p class="text-white text-xs text-center font-semibold">${eraName}</p>
            <div class="text-center mt-2">
                <span class="inline-block px-3 py-1 rounded-full text-xs font-bold ${character.characterType === 'hero' ? 'bg-yellow-400 text-blue-900' : 'bg-gray-800 text-red-400'}">
                    ${character.characterType === 'hero' ? '⭐ ' + heroLabel : '⚔️ ' + villainLabel}
                </span>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Show character details modal
function showCharacterDetails(character) {
    const modal = document.getElementById('characterModal');
    const contributions = characterContributions[character.name];
    const lang = localStorage.getItem('selectedLanguage') || 'en';
    
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
    if (contributions && contributions.contributions) {
        contributionsDiv.innerHTML = contributions.contributions.map(contribution => 
            `<div class="flex gap-3">
                <span class="text-amber-600 font-bold flex-shrink-0">•</span>
                <p>${contribution}</p>
            </div>`
        ).join('');
    } else {
        contributionsDiv.innerHTML = '<p class="text-amber-700 italic">Historical information coming soon...</p>';
    }
    
    // Show modal
    modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('characterModal').classList.add('hidden');
}

// Close modal when clicking outside
document.getElementById('characterModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'characterModal') {
        closeModal();
    }
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', loadAllCharacters);
