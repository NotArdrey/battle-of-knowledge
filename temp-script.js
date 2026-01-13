
        // Era-specific Background Music for Learning Module
        const moduleBackgroundMusic = {
            'early-spanish': new Audio('assets/Game-BGM/modulePartBGM/Early Spanish Whole Menu BGM.mp3'),
            'late-spanish': new Audio('assets/Game-BGM/modulePartBGM/Late Spanish Era Whole Menu BGM.mp3'),
            'american-colonial': new Audio('assets/Game-BGM/modulePartBGM/American Colonial Whole Menu BGM.mp3'),
            'ww2': new Audio('assets/Game-BGM/modulePartBGM/WW2 Whole Menu BGM.mp3')
        };

        // Configure background music settings
        Object.values(moduleBackgroundMusic).forEach(bgm => {
            bgm.preload = 'auto';
            bgm.loop = true;
            bgm.volume = 0.4; // Lower volume for learning module
        });

        // Current playing BGM reference
        let currentModuleBGM = null;

        // Play era-specific background music
        function playModuleBackgroundMusic(eraKey) {
            if (!eraKey || !moduleBackgroundMusic[eraKey]) return;
            
            try {
                // Stop any currently playing music
                stopModuleBackgroundMusic();
                
                // Play the current era's music
                currentModuleBGM = moduleBackgroundMusic[eraKey];
                currentModuleBGM.currentTime = 0;
                currentModuleBGM.volume = 0.4;
                
                // Try to play automatically
                currentModuleBGM.play().catch(e => {
                    console.log('Module BGM autoplay blocked:', e);
                    // Add click handler to start music on user interaction
                    document.addEventListener('click', function startBGM() {
                        if (currentModuleBGM) {
                            currentModuleBGM.play().catch(() => {});
                        }
                        document.removeEventListener('click', startBGM);
                    }, { once: true });
                });
            } catch (error) {
                console.log('Module BGM error:', error);
            }
        }

        // Stop background music
        function stopModuleBackgroundMusic() {
            Object.values(moduleBackgroundMusic).forEach(bgm => {
                bgm.pause();
                bgm.currentTime = 0;
            });
            currentModuleBGM = null;
        }

        // Stop music when leaving the page
        window.addEventListener('beforeunload', stopModuleBackgroundMusic);

        // Video and Caption Management
        let currentCaptions = [];
        let captionLanguage = localStorage.getItem('selectedLanguage') || 'en';
        let currentCaptionIndex = 0;
        let captionInterval = null;

        // Load video and captions for a specific lesson
        function loadLessonVideo(lessonId) {
            const videoContainer = document.getElementById('lessonVideoContainer');
            const captionContainer = document.getElementById('captionContainer');
            const captionText = document.getElementById('captionText');
            
            // Get video data from moduleVideos.js
            if (typeof moduleVideos !== 'undefined' && moduleVideos[currentEraKey]) {
                const lessonData = moduleVideos[currentEraKey].lessons.find(l => l.lessonId === lessonId);
                
                if (lessonData) {
                    // Load captions
                    currentCaptions = lessonData.captions[captionLanguage] || lessonData.captions['en'] || [];
                    
                    // Check if video file exists
                    if (lessonData.videoFile) {
                        // Show actual video
                        videoContainer.innerHTML = `
                            <video id="lessonVideo" controls>
                                <source src="${lessonData.videoFile}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                            <div id="captionContainer" class="caption-container">
                                <p id="captionText" class="caption-text"></p>
                            </div>
                            <button id="captionLangToggle" class="caption-lang-toggle" onclick="toggleCaptionLanguage()">
                                ${captionLanguage === 'en' ? 'EN' : 'TL'}
                            </button>
                        `;
                        
                        // Set up video caption sync
                        const video = document.getElementById('lessonVideo');
                        video.addEventListener('timeupdate', syncCaptions);
                    } else {
                        // Show placeholder with captions slideshow
                        videoContainer.innerHTML = `
                            <div class="video-placeholder">
                                <div class="video-placeholder-icon">ðŸ“œ</div>
                                <div class="video-placeholder-text">Chapter ${lessonId}: ${lessonData.title}</div>
                            </div>
                            <div id="captionContainer" class="caption-container" style="display: block;">
                                <p id="captionText" class="caption-text"></p>
                            </div>
                            <button class="caption-lang-toggle" onclick="toggleCaptionLanguage()">
                                ${captionLanguage === 'en' ? 'EN' : 'TL'}
                            </button>
                        `;
                        
                        // Start caption slideshow
                        startCaptionSlideshow();
                    }
                } else {
                    // No video data for this lesson
                    showVideoPlaceholder();
                }
            } else {
                // moduleVideos not loaded
                showVideoPlaceholder();
            }
        }
        
        // Show video placeholder
        function showVideoPlaceholder() {
            const videoContainer = document.getElementById('lessonVideoContainer');
            videoContainer.innerHTML = `
                <div class="video-placeholder">
                    <div class="video-placeholder-icon">ðŸŽ¬</div>
                    <div class="video-placeholder-text">Video Coming Soon</div>
                </div>
            `;
        }
        
        // Sync captions with video time
        function syncCaptions() {
            const video = document.getElementById('lessonVideo');
            const captionText = document.getElementById('captionText');
            const captionContainer = document.getElementById('captionContainer');
            
            if (!video || !captionText || currentCaptions.length === 0) return;
            
            const currentTime = video.currentTime;
            let activeCaption = null;
            
            // Find the appropriate caption for the current time
            for (let i = currentCaptions.length - 1; i >= 0; i--) {
                if (currentTime >= currentCaptions[i].time) {
                    activeCaption = currentCaptions[i];
                    break;
                }
            }
            
            if (activeCaption) {
                captionText.textContent = activeCaption.text;
                captionContainer.style.display = 'block';
            } else {
                captionContainer.style.display = 'none';
            }
        }
        
        // Start caption slideshow for placeholder
        function startCaptionSlideshow() {
            // Clear any existing interval
            if (captionInterval) {
                clearInterval(captionInterval);
            }
            
            const captionText = document.getElementById('captionText');
            if (!captionText || currentCaptions.length === 0) return;
            
            currentCaptionIndex = 0;
            captionText.textContent = currentCaptions[0].text;
            
            // Auto-advance captions every 5 seconds
            captionInterval = setInterval(() => {
                currentCaptionIndex = (currentCaptionIndex + 1) % currentCaptions.length;
                captionText.textContent = currentCaptions[currentCaptionIndex].text;
                
                // Add fade animation
                captionText.style.opacity = '0';
                setTimeout(() => {
                    captionText.style.opacity = '1';
                }, 100);
            }, 5000);
        }
        
        // Toggle caption language
        function toggleCaptionLanguage() {
            captionLanguage = captionLanguage === 'en' ? 'tl' : 'en';
            
            // Reload the current lesson video with new language
            const lesson = currentEraLessons[currentLessonIndex];
            if (lesson) {
                loadLessonVideo(lesson.id);
            }
        }
        
        // Stop caption slideshow when leaving page
        window.addEventListener('beforeunload', () => {
            if (captionInterval) {
                clearInterval(captionInterval);
            }
        });

        // Learning Module Logic
        let currentEraKey = '';
        let currentLang = localStorage.getItem('selectedLanguage') || 'en';
        let completedLessons = new Set();
        let currentLessonIndex = 0;
        let currentEraLessons = [];

        // Initialize learning module
        function initLearningModule() {
            try {
                console.log('initLearningModule called');
                currentEraKey = localStorage.getItem('selectedEra') || 'early-spanish';
                currentLang = localStorage.getItem('selectedLanguage') || 'en';
                console.log('Era:', currentEraKey, 'Lang:', currentLang);
                
                // Start era-specific background music
                playModuleBackgroundMusic(currentEraKey);
                
                // Load completed lessons for this era from localStorage
                const savedProgress = localStorage.getItem(`learning_${currentEraKey}`);
                if (savedProgress) {
                    completedLessons = new Set(JSON.parse(savedProgress));
                }
                
                loadEraContent();
                setupLessonNavigation();
                updateProgress();
                loadCurrentLesson();
            } catch (error) {
                console.error('Error in initLearningModule:', error);
            }
        }

        // Load era content
        function loadEraContent() {
            try {
                console.log('Loading era content for:', currentEraKey, 'lang:', currentLang);
                console.log('learningData available:', typeof learningData !== 'undefined');
                
                if (typeof learningData === 'undefined') {
                    console.error('learningData is not defined!');
                    return;
                }
                
                if (!learningData[currentEraKey]) {
                    console.error('No data for era:', currentEraKey);
                    return;
                }
                
                const eraContent = learningData[currentEraKey][currentLang];
                
                if (!eraContent) {
                    console.error('No content found for era:', currentEraKey, 'language:', currentLang);
                    return;
                }
                
                console.log('Era content loaded:', eraContent.title, 'with', eraContent.lessons.length, 'lessons');
                
                // Update title
                document.getElementById('eraTitle').textContent = eraContent.title;
                
                // Store lessons
                currentEraLessons = eraContent.lessons;
                
                // Create lesson indicators
                createLessonIndicators();
            } catch (error) {
                console.error('Error in loadEraContent:', error);
            }
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
            try {
                console.log('loadCurrentLesson called, currentEraLessons:', currentEraLessons.length);
                
                if (currentEraLessons.length === 0) {
                    console.error('No lessons found in currentEraLessons array');
                    return;
                }
                
                const lesson = currentEraLessons[currentLessonIndex];
                console.log('Current lesson:', lesson);
                
                if (!lesson) {
                    console.error('Lesson not found at index:', currentLessonIndex);
                    return;
            }
            
            const isCompleted = completedLessons.has(lesson.id);
            
            // Update lesson display
            document.getElementById('currentLessonIcon').textContent = lesson.icon;
            document.getElementById('currentLessonTitle').textContent = lesson.title;
            document.getElementById('currentLessonContent').innerHTML = lesson.content;
            document.getElementById('currentLessonNumber').textContent = `${currentLessonIndex + 1} / ${currentEraLessons.length}`;
            
            // Load video and captions for this lesson
            loadLessonVideo(lesson.id);
            
            // Update navigation buttons
            updateNavigationButtons();
            
            // Update complete button
            const completeBtn = document.getElementById('completeLessonBtn');
            const completeText = translations[currentLanguage]['markComplete'] || 'Mark as Complete';
            const completedText = translations[currentLanguage]['Completed'] || 'Completed';
            
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
            } catch (error) {
                console.error('Error in loadCurrentLesson:', error);
            }
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
            completeBtn.querySelector('span').textContent = 'Done!';
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
                    completeBtn.querySelector('span').textContent = 'Completed';
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
                    <p class="text-2xl md:text-3xl font-bold mb-2">Congratulations!</p>
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
                hint.textContent = translations[currentLanguage]['readyForBattle'] || 'Ready for battle! Click to start!';
                hint.classList.add('text-green-600');
                hint.classList.remove('text-amber-700');
            } else {
                startButton.disabled = true;
                hint.textContent = translations[currentLanguage]['completeAllLessons'] || 'Complete all lessons to unlock the battle!';
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
            
            // Always show character selection for eras with multiple heroes
            if (eraData[selectedEra] && eraData[selectedEra].heroes.length > 1) {
                // Show character selection modal
                showCharacterSelect();
            } else {
                // Clear any previous battle progress to start a fresh session
                localStorage.removeItem('battleProgress');
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
                                <span class="text-4xl"></span>
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
                            <span>Choose Your Hero</span>
                        </h2>
                        <div class="grid grid-cols-2 md:grid-cols-${heroes.length <= 2 ? '2' : '3'} gap-4 mb-6">
                            ${heroesHTML}
                        </div>
                        <div class="text-center">
                            <button onclick="closeCharacterModal()" class="bg-gradient-to-r from-gray-300 to-gray-400 border-3 border-gray-600 rounded-xl px-6 md:px-8 py-3 text-lg md:text-xl font-bold text-gray-800 hover:-translate-y-1 transition-all duration-300">
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }

        // Select character
        function selectCharacter(heroIndex) {
            // Clear any previous battle progress to start a fresh session
            localStorage.removeItem('battleProgress');
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

        // Show reset confirmation modal
        function showResetConfirmation() {
            const modal = document.createElement('div');
            modal.id = 'resetConfirmModal';
            modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
            
            modal.innerHTML = `
                <div class="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl md:rounded-3xl border-4 md:border-8 border-amber-800 max-w-md w-full shadow-2xl">
                    <div class="p-6 md:p-8 text-center">
                        <div class="text-5xl mb-4"></div>
                        <h2 class="text-xl md:text-2xl font-extrabold text-amber-900 mb-4">
                            Reset Learning Progress?
                        </h2>
                        <p class="text-amber-700 mb-6">
                            This will reset all lessons for <strong>${eraData[currentEraKey]?.name || currentEraKey}</strong>. You will need to complete them again to unlock the battle.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-3 justify-center">
                            <button onclick="confirmResetProgress()" class="bg-gradient-to-r from-red-500 to-red-600 border-3 border-red-700 rounded-xl px-6 py-3 text-lg font-bold text-white hover:-translate-y-1 transition-all duration-300">
                                Yes, Reset
                            </button>
                            <button onclick="closeResetModal()" class="bg-gradient-to-r from-gray-300 to-gray-400 border-3 border-gray-600 rounded-xl px-6 py-3 text-lg font-bold text-gray-800 hover:-translate-y-1 transition-all duration-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
        
        // Confirm and execute reset
        function confirmResetProgress() {
            // Clear completed lessons for current era
            completedLessons.clear();
            localStorage.removeItem(`learning_${currentEraKey}`);
            
            // Reset to first lesson
            currentLessonIndex = 0;
            
            // Update UI
            loadCurrentLesson();
            createLessonIndicators();
            updateProgress();
            checkBattleUnlock();
            
            // Close modal
            closeResetModal();
            
            // Show confirmation message
            showResetConfirmationMessage();
        }
        
        // Close reset modal
        function closeResetModal() {
            const modal = document.getElementById('resetConfirmModal');
            if (modal) {
                modal.remove();
            }
        }
        
        // Show reset confirmation message
        function showResetConfirmationMessage() {
            const message = document.createElement('div');
            message.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 font-bold text-lg';
            message.textContent = 'Progress has been reset!';
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.style.transition = 'opacity 0.5s';
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 500);
            }, 2000);
        }

        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', async () => {
            console.log('DOMContentLoaded fired');
            
            try {
                // Initialize ProgressSync if available (with timeout)
                if (window.ProgressSync) {
                    console.log('Initializing ProgressSync...');
                    try {
                        await Promise.race([
                            window.ProgressSync.init(),
                            new Promise((_, reject) => setTimeout(() => reject(new Error('ProgressSync timeout')), 3000))
                        ]);
                        console.log('ProgressSync initialized');
                    } catch (e) {
                        console.warn('ProgressSync init failed or timed out:', e);
                    }
                }
                
                console.log('Calling initLearningModule...');
                initLearningModule();
                console.log('initLearningModule completed');
                
                // Setup language toggle
                const langToggle = document.getElementById('langToggle');
                if (langToggle) {
                    langToggle.addEventListener('click', () => {
                        setTimeout(handleLanguageChange, 50);
                    });
                }
            } catch (error) {
                console.error('Error in DOMContentLoaded:', error);
                // Still try to init learning module even if ProgressSync fails
                initLearningModule();
            }
        });
    
