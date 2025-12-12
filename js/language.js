// Language translation system
const translations = {
    en: {
        // Index page
        'Battle of Knowledge': 'Battle of Knowledge',
        'Philippine History': 'Philippine History',
        'START': 'START',
        '📚 COLLECTION': '📚 COLLECTION',
        
        // Era selection
        'Choose Your Historical Era': 'Choose Your Historical Era',
        'Early Spanish Era': 'Early Spanish Era',
        'Battle of Mactan (1521)': 'Battle of Mactan (1521)',
        'Late Spanish Era': 'Late Spanish Era',
        'Revolution (1896-1898)': 'Revolution (1896-1898)',
        'American Colonial': 'American Colonial',
        'Philippine-American War': 'Philippine-American War',
        'WW2 Bonus Stage': 'WW2 Bonus Stage',
        'Pacific Theater (1941-1945)': 'Pacific Theater (1941-1945)',
        'WW2 Era': 'WW2 Era',
        'All Eras': 'All Eras',
        'Complete History Challenge': 'Complete History Challenge',
        'Back': '← Back',
        
        // Character selection
        'Choose Your Hero': 'Choose Your Hero',
        'Cancel': 'Cancel',
        
        // Collection page
        '📚 Character Collection 📚': '📚 Character Collection 📚',
        'Learn about the Heroes and Villains of Philippine History': 'Learn about the Heroes and Villains of Philippine History',
        'Historical Contributions': 'Historical Contributions',
        'HERO': 'HERO',
        'VILLAIN': 'VILLAIN',
        
        // Battle page
        'VICTORY!': '🎉 VICTORY! 🎉',
        'You have mastered Philippine History!': 'You have mastered Philippine History!',
        'DEFEATED': '💔 DEFEATED 💔',
        'Study harder and try again!': 'Study harder and try again!',
        'Play Again': 'Play Again',
        'Try Again': 'Try Again',
        
        // Battlefield translations
        'heroUnlocked': '🏆 Hero Unlocked! 🏆',
        'nextEra': 'Next Era →',
        'chooseEra': 'Choose Era',
        'viewCollection': 'View Collection',
        'defeated': '💔 DEFEATED 💔',
        'tryHarder': 'Study harder and try again!',
        'tryAgain': 'Try Again',
        'retry': 'Retry Battle',
        'mainMenu': 'Main Menu',
        'victory': '🎉 VICTORY! 🎉',
        'conqueredEra': 'You have conquered this era!',
        
        // Learning Module
        'Learn About': 'Learn About',
        'studyBeforeBattle': 'Study these lessons before your battle!',
        'lessonsCompleted': 'lessons completed',
        'startBattle': '⚔️ Start Battle!',
        'readAllLessons': '💡 Read all lessons to unlock the battle!',
        'skipLearning': '⏭️ Skip Learning (Not Recommended)',
        'skipWarning': 'Learning helps you answer questions in battle!',
        'markComplete': '✓ Mark as Complete',
        'Close': 'Close',
        'clickToLearn': 'Click to learn',
        'Completed': '✓ Completed',
        'skipConfirmTitle': 'Skip Learning?',
        'skipConfirmMessage': 'Skipping lessons will make the battle harder. Are you sure you want to continue?',
        'yesSkip': 'Yes, Skip',
        'noStay': 'No, Stay',
        'newHeroUnlocked': '🏆 New Hero Unlocked! 🏆',
        'allHeroesUnlocked': '🎉 All Heroes Unlocked! 🎉',
        'congratulations': 'Congratulations! You have unlocked all heroes in this era!'
    },
    tl: {
        // Index page
        'Battle of Knowledge': 'Labanan ng Kaalaman',
        'Philippine History': 'Kasaysayan ng Pilipinas',
        'START': 'MAGSIMULA',
        '📚 COLLECTION': '📚 KOLEKSYON' ,
        
        // Era selection
        'Choose Your Historical Era': 'Pumili ng Panahon sa Kasaysayan',
        'Early Spanish Era': 'Unang Panahon ng Kastila',
        'Battle of Mactan (1521)': 'Labanan sa Mactan (1521)',
        'Late Spanish Era': 'Huling Panahon ng Kastila',
        'Revolution (1896-1898)': 'Rebolusyon (1896-1898)',
        'American Colonial': 'Panahon ng Amerikano',
        'American Colonial Era': 'Panahon ng Amerikano',
        'Philippine-American War': 'Digmaang Pilipino-Amerikano',
        'WW2 Bonus Stage': 'Bonus Stage - Ikalawang Digmaang Pandaigdig',
        'Pacific Theater (1941-1945)': 'Labanan sa Pasipiko (1941-1945)',
        'WW2 Era': 'Panahon ng WW2',
        'All Eras': 'Lahat ng Panahon',
        'Complete History Challenge': 'Kumpletong Hamon sa Kasaysayan',
        'Back': '← Bumalik',
        
        // Character selection
        'Choose Your Hero': 'Pumili ng Bayani',
        'Cancel': 'Kanselahin',
        
        // Collection page
        '📚 Character Collection 📚': '📚 Koleksyon ng mga Tauhan 📚',
        'Learn about the Heroes and Villains of Philippine History': 'Alamin ang mga Bayani at Kontrabida sa Kasaysayan ng Pilipinas',
        'Historical Contributions': 'Mga Kontribusyon sa Kasaysayan',
        'HERO': 'BAYANI',
        'VILLAIN': 'KONTRABIDA',
        
        // Battle page
        'VICTORY!': '🎉 TAGUMPAY! 🎉',
        'You have mastered Philippine History!': 'Napagtagumpayan mo ang Kasaysayan ng Pilipinas!',
        'DEFEATED': '💔 NATALO 💔',
        'Study harder and try again!': 'Mag-aral pa at subukan muli!',
        'Play Again': 'Maglaro Muli',
        'Try Again': 'Subukan Muli',
        
        // Battlefield translations
        'heroUnlocked': '🏆 Na-unlock ang Bayani! 🏆',
        'nextEra': 'Susunod na Panahon →',
        'chooseEra': 'Pumili ng Panahon',
        'viewCollection': 'Tingnan ang Koleksyon',
        'defeated': '💔 NATALO 💔',
        'tryHarder': 'Mag-aral pa at subukan muli!',
        'tryAgain': 'Subukan Muli',
        'retry': 'Subukan Muli ang Labanan',
        'mainMenu': 'Pangunahing Menu',
        'victory': '🎉 TAGUMPAY! 🎉',
        'conqueredEra': 'Nasakop mo ang panahong ito!',
        
        // Learning Module
        'Learn About': 'Alamin Tungkol sa',
        'studyBeforeBattle': 'Pag-aralan ang mga aral na ito bago ang labanan!',
        'lessonsCompleted': 'na aral ang nakumpleto',
        'startBattle': '⚔️ Simulan ang Labanan!',
        'readAllLessons': '💡 Basahin lahat ng aral upang ma-unlock ang labanan!',
        'skipLearning': '⏭️ Laktawan ang Pag-aaral (Hindi Inirerekomenda)',
        'skipWarning': 'Ang pag-aaral ay tumutulong sa pagsagot ng mga tanong sa labanan!',
        'markComplete': '✓ Markahan bilang Kumpleto',
        'Close': 'Isara',
        'clickToLearn': 'I-click upang matuto',
        'Completed': '✓ Nakumpleto',
        'skipConfirmTitle': 'Laktawan ang Pag-aaral?',
        'skipConfirmMessage': 'Ang paglaktaw sa mga aral ay magpapahirap sa labanan. Sigurado ka bang gusto mong magpatuloy?',
        'yesSkip': 'Oo, Laktawan',
        'noStay': 'Hindi, Manatili',
        'newHeroUnlocked': '🏆 Bagong Bayani Na-unlock! 🏆',
        'allHeroesUnlocked': '🎉 Lahat ng Bayani Na-unlock! 🎉',
        'congratulations': 'Binabati kita! Na-unlock mo na ang lahat ng bayani sa panahong ito!'
    }
};

// Initialize language from localStorage immediately
let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

function initializeLanguage() {
    // Apply saved language on page load
    currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    // Ensure we save it back to localStorage (persistence fix)
    localStorage.setItem('selectedLanguage', currentLanguage);
    updateLanguage();
    updateToggleButton();
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'tl' : 'en';
    localStorage.setItem('selectedLanguage', currentLanguage);
    updateLanguage();
    updateToggleButton();
    
    // Update questions if on battlefield
    if (typeof loadQuestion === 'function') {
        loadQuestion();
    }
    
    // Update collection grid if on collection page
    if (typeof renderCharacterGrid === 'function') {
        renderCharacterGrid();
    }
    
    // Update modal if it's open on collection page
    if (typeof updateModalTranslations === 'function') {
        updateModalTranslations();
    }
}

function updateLanguage() {
    // Handle data-lang-key attributes (battlefield page)
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Handle data-translate attributes (other pages)
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });

    // Swap language-specific images when data attributes are provided
    document.querySelectorAll('[data-lang-img-en][data-lang-img-tl]').forEach(img => {
        const enSrc = img.getAttribute('data-lang-img-en');
        const tlSrc = img.getAttribute('data-lang-img-tl');
        img.src = currentLanguage === 'tl' ? tlSrc : enSrc;
    });
    
    // Update Victory modal text if it exists
    const victoryTitle = document.querySelector('#victoryModal h1');
    const victoryText = document.querySelector('#victoryModal p:first-of-type');
    if (victoryTitle && translations[currentLanguage].victory) {
        victoryTitle.textContent = translations[currentLanguage].victory;
    }
    if (victoryText && translations[currentLanguage].conqueredEra) {
        victoryText.textContent = translations[currentLanguage].conqueredEra;
    }
}

function updateToggleButton() {
    // Update text label if exists (legacy support)
    const langLabel = document.getElementById('langLabel');
    if (langLabel) {
        langLabel.textContent = currentLanguage === 'en' ? 'TAGALOG' : 'ENGLISH';
    }
    
    // Update image button if exists
    const langToggleImg = document.getElementById('langToggleImg');
    if (langToggleImg) {
        if (currentLanguage === 'en') {
            langToggleImg.src = 'assets/Buttons/TAGALOG BUTTON.png';
            langToggleImg.alt = 'Switch to Tagalog';
        } else {
            langToggleImg.src = 'assets/Buttons/ENGLISH BUTTON.png';
            langToggleImg.alt = 'Switch to English';
        }
    }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
});
