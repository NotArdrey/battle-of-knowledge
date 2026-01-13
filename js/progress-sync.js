// ============================================
// PROGRESS SYNC MODULE
// Replaces localStorage with Supabase for progress tracking
// ============================================

/**
 * Progress Sync Manager
 * Handles syncing game progress between localStorage (offline) and Supabase (online)
 */
const ProgressSync = {
    isOnline: true,
    userId: null,
    syncQueue: [],
    
    /**
     * Initialize the progress sync module
     */
    async init() {
        // Check if user is authenticated
        const session = await SupabaseConfig.getSession();
        if (session) {
            this.userId = session.user.id;
            this.isOnline = true;
            
            // Sync any pending offline changes
            await this.syncOfflineChanges();
            
            // Load progress from server
            await this.loadFromServer();
        } else {
            this.isOnline = false;
            console.log('No session - using localStorage only');
        }
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    },
    
    /**
     * Handle coming back online
     */
    async handleOnline() {
        console.log('Back online - syncing changes...');
        this.isOnline = true;
        await this.syncOfflineChanges();
    },
    
    /**
     * Handle going offline
     */
    handleOffline() {
        console.log('Offline - changes will be saved locally');
        this.isOnline = false;
    },
    
    /**
     * Load progress from server and merge with local
     */
    async loadFromServer() {
        if (!this.userId) return;
        
        try {
            const { data, error } = await supabase
                .from('progress')
                .select('*')
                .eq('user_id', this.userId);
            
            if (error) throw error;
            
            // Convert to localStorage format and save
            const eraProgress = {};
            (data || []).forEach(p => {
                eraProgress[p.era_key] = {
                    lessonsComplete: p.lessons_complete,
                    bossDefeated: p.boss_defeated,
                    currentLessonIndex: p.current_lesson_index,
                    battleScore: p.battle_score,
                    enemiesDefeated: p.enemies_defeated,
                    highestStreak: p.highest_streak,
                    lastPlayedAt: p.last_played_at
                };
                
                // Also save individual lesson progress
                if (p.lessons_completed && Array.isArray(p.lessons_completed)) {
                    localStorage.setItem(`learning_${p.era_key}`, JSON.stringify(p.lessons_completed));
                }
            });
            
            localStorage.setItem('eraProgress', JSON.stringify(eraProgress));
            console.log('Progress loaded from server');
            
        } catch (error) {
            console.error('Error loading progress from server:', error);
        }
    },
    
    /**
     * Sync offline changes to server
     */
    async syncOfflineChanges() {
        if (!this.userId || !this.isOnline) return;
        
        const pendingSync = JSON.parse(localStorage.getItem('pendingSyncProgress') || '[]');
        
        for (const change of pendingSync) {
            try {
                await this.saveToServer(change.eraKey, change.data);
            } catch (error) {
                console.error('Error syncing offline change:', error);
            }
        }
        
        // Clear pending sync
        localStorage.removeItem('pendingSyncProgress');
    },
    
    /**
     * Get era progress (from localStorage for speed, server is source of truth)
     * @param {string} eraKey - Era key
     * @returns {Object} Progress data
     */
    getEraProgress(eraKey) {
        try {
            const allProgress = JSON.parse(localStorage.getItem('eraProgress') || '{}');
            return allProgress[eraKey] || {
                lessonsComplete: false,
                bossDefeated: false,
                currentLessonIndex: 0,
                battleScore: 0,
                enemiesDefeated: 0,
                highestStreak: 0
            };
        } catch (error) {
            console.error('Error getting era progress:', error);
            return { lessonsComplete: false, bossDefeated: false };
        }
    },
    
    /**
     * Get all era progress
     * @returns {Object} All progress data
     */
    getAllProgress() {
        try {
            return JSON.parse(localStorage.getItem('eraProgress') || '{}');
        } catch (error) {
            return {};
        }
    },
    
    /**
     * Update era progress
     * @param {string} eraKey - Era key
     * @param {Object} updates - Progress updates
     */
    async updateEraProgress(eraKey, updates) {
        // Update localStorage immediately (for responsiveness)
        const allProgress = this.getAllProgress();
        const existing = allProgress[eraKey] || {};
        allProgress[eraKey] = { ...existing, ...updates };
        localStorage.setItem('eraProgress', JSON.stringify(allProgress));
        
        // Sync to server if online and authenticated
        if (this.isOnline && this.userId) {
            await this.saveToServer(eraKey, allProgress[eraKey]);
        } else {
            // Queue for later sync
            this.queueOfflineChange(eraKey, allProgress[eraKey]);
        }
    },
    
    /**
     * Save progress to Supabase
     * @param {string} eraKey - Era key
     * @param {Object} data - Progress data
     */
    async saveToServer(eraKey, data) {
        if (!this.userId) return;
        
        try {
            const lessonsCompleted = JSON.parse(localStorage.getItem(`learning_${eraKey}`) || '[]');
            
            const { error } = await supabase
                .from('progress')
                .upsert({
                    user_id: this.userId,
                    era_key: eraKey,
                    lessons_completed: lessonsCompleted,
                    lessons_complete: data.lessonsComplete || false,
                    boss_defeated: data.bossDefeated || false,
                    current_lesson_index: data.currentLessonIndex || 0,
                    battle_score: data.battleScore || 0,
                    enemies_defeated: data.enemiesDefeated || 0,
                    highest_streak: data.highestStreak || 0,
                    last_played_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id,era_key'
                });
            
            if (error) throw error;
            console.log(`Progress saved to server for ${eraKey}`);
            
        } catch (error) {
            console.error('Error saving to server:', error);
            this.queueOfflineChange(eraKey, data);
        }
    },
    
    /**
     * Queue change for offline sync
     * @param {string} eraKey - Era key
     * @param {Object} data - Progress data
     */
    queueOfflineChange(eraKey, data) {
        const pending = JSON.parse(localStorage.getItem('pendingSyncProgress') || '[]');
        
        // Remove existing entry for this era
        const filtered = pending.filter(p => p.eraKey !== eraKey);
        filtered.push({ eraKey, data, timestamp: Date.now() });
        
        localStorage.setItem('pendingSyncProgress', JSON.stringify(filtered));
    },
    
    /**
     * Get completed lessons for an era
     * @param {string} eraKey - Era key
     * @returns {Array} Array of completed lesson indices
     */
    getCompletedLessons(eraKey) {
        try {
            return JSON.parse(localStorage.getItem(`learning_${eraKey}`) || '[]');
        } catch (error) {
            return [];
        }
    },
    
    /**
     * Mark lesson as complete
     * @param {string} eraKey - Era key
     * @param {number} lessonIndex - Lesson index
     */
    async markLessonComplete(eraKey, lessonIndex) {
        const completed = this.getCompletedLessons(eraKey);
        
        if (!completed.includes(lessonIndex)) {
            completed.push(lessonIndex);
            localStorage.setItem(`learning_${eraKey}`, JSON.stringify(completed));
            
            // Sync to server
            if (this.isOnline && this.userId) {
                await this.saveToServer(eraKey, this.getEraProgress(eraKey));
            }
        }
    },
    
    /**
     * Mark all lessons as complete
     * @param {string} eraKey - Era key
     */
    async markAllLessonsComplete(eraKey) {
        await this.updateEraProgress(eraKey, { lessonsComplete: true });
    },
    
    /**
     * Mark boss as defeated
     * @param {string} eraKey - Era key
     * @param {number} score - Battle score
     */
    async markBossDefeated(eraKey, score = 0) {
        await this.updateEraProgress(eraKey, { 
            bossDefeated: true,
            battleScore: score
        });
    },
    
    /**
     * Update battle stats
     * @param {string} eraKey - Era key
     * @param {Object} stats - Battle statistics
     */
    async updateBattleStats(eraKey, stats) {
        const current = this.getEraProgress(eraKey);
        
        const updates = {
            battleScore: Math.max(current.battleScore || 0, stats.score || 0),
            enemiesDefeated: (current.enemiesDefeated || 0) + (stats.enemiesDefeated || 0),
            highestStreak: Math.max(current.highestStreak || 0, stats.streak || 0)
        };
        
        await this.updateEraProgress(eraKey, updates);
    },
    
    /**
     * Get custom questions for an era (teacher-created)
     * @param {string} eraKey - Era key
     * @returns {Promise<Array>} Array of questions
     */
    async getCustomQuestions(eraKey) {
        if (!this.isOnline) return [];
        
        try {
            const { data, error } = await supabase
                .from('custom_questions')
                .select('*')
                .eq('era_key', eraKey)
                .eq('is_active', true)
                .eq('is_approved', true);
            
            if (error) throw error;
            
            // Transform to game format
            return (data || []).map(q => ({
                question: {
                    en: q.question_text_en,
                    tl: q.question_text_tl || q.question_text_en
                },
                answers: {
                    en: [q.correct_answer_en, ...q.wrong_answers_en],
                    tl: q.correct_answer_tl 
                        ? [q.correct_answer_tl, ...(q.wrong_answers_tl || q.wrong_answers_en)]
                        : [q.correct_answer_en, ...q.wrong_answers_en]
                },
                correctIndex: 0, // Will be shuffled in game
                difficulty: q.difficulty,
                isCustom: true
            }));
            
        } catch (error) {
            console.error('Error fetching custom questions:', error);
            return [];
        }
    },
    
    /**
     * Log game session for analytics
     * @param {string} eraKey - Era key
     * @param {string} sessionType - 'learning' or 'battle'
     * @param {Object} stats - Session statistics
     */
    async logGameSession(eraKey, sessionType, stats = {}) {
        if (!this.isOnline || !this.userId) return;
        
        try {
            await supabase
                .from('game_sessions')
                .insert({
                    user_id: this.userId,
                    era_key: eraKey,
                    session_type: sessionType,
                    questions_answered: stats.questionsAnswered || 0,
                    correct_answers: stats.correctAnswers || 0,
                    score: stats.score || 0,
                    ended_at: new Date().toISOString()
                });
        } catch (error) {
            console.error('Error logging game session:', error);
        }
    },
    
    /**
     * Save achievement
     * @param {string} achievementKey - Achievement key
     */
    async saveAchievement(achievementKey) {
        // Save to localStorage
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        if (!achievements.includes(achievementKey)) {
            achievements.push(achievementKey);
            localStorage.setItem('achievements', JSON.stringify(achievements));
        }
        
        // Save to server
        if (this.isOnline && this.userId) {
            try {
                await supabase
                    .from('achievements')
                    .upsert({
                        user_id: this.userId,
                        achievement_key: achievementKey
                    }, {
                        onConflict: 'user_id,achievement_key'
                    });
            } catch (error) {
                console.error('Error saving achievement:', error);
            }
        }
    },
    
    /**
     * Get all achievements
     * @returns {Promise<Array>} Array of achievement keys
     */
    async getAchievements() {
        // Try to load from server first
        if (this.isOnline && this.userId) {
            try {
                const { data, error } = await supabase
                    .from('achievements')
                    .select('achievement_key')
                    .eq('user_id', this.userId);
                
                if (!error && data) {
                    const keys = data.map(a => a.achievement_key);
                    localStorage.setItem('achievements', JSON.stringify(keys));
                    return keys;
                }
            } catch (error) {
                console.error('Error loading achievements:', error);
            }
        }
        
        // Fallback to localStorage
        return JSON.parse(localStorage.getItem('achievements') || '[]');
    },
    
    /**
     * Check if era is unlocked
     * @param {string} eraKey - Era key to check
     * @returns {boolean} True if unlocked
     */
    isEraUnlocked(eraKey) {
        const eraOrder = ['early-spanish', 'late-spanish', 'american-colonial', 'ww2'];
        const eraIndex = eraOrder.indexOf(eraKey);
        
        if (eraIndex === 0) return true; // First era always unlocked
        
        // Check if previous era boss is defeated
        const previousEra = eraOrder[eraIndex - 1];
        const progress = this.getEraProgress(previousEra);
        
        return progress.bossDefeated === true;
    },
    
    /**
     * Reset all progress (for testing)
     */
    async resetAllProgress() {
        localStorage.removeItem('eraProgress');
        localStorage.removeItem('pendingSyncProgress');
        localStorage.removeItem('achievements');
        
        const eraKeys = ['early-spanish', 'late-spanish', 'american-colonial', 'ww2'];
        eraKeys.forEach(era => {
            localStorage.removeItem(`learning_${era}`);
        });
        
        if (this.isOnline && this.userId) {
            try {
                await supabase
                    .from('progress')
                    .delete()
                    .eq('user_id', this.userId);
                
                await supabase
                    .from('achievements')
                    .delete()
                    .eq('user_id', this.userId);
                    
            } catch (error) {
                console.error('Error resetting server progress:', error);
            }
        }
        
        console.log('All progress reset');
    }
};

// Export for global use
window.ProgressSync = ProgressSync;
