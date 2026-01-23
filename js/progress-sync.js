// ============================================
// PROGRESS SYNC MODULE (DB-FIRST)
// Stores progress in Supabase; keeps a small in-memory cache only
// ============================================

const ProgressSync = {
    client: null,
    userId: null,
    isOnline: false,
    progress: {
        eras: {},
        completedLessons: {},
        unlockedHeroes: {},  // Track unlocked heroes per era
        achievements: []
    },

    getClient() {
        if (this.client) return this.client;
        if (window.SupabaseConfig?.initSupabaseClient) {
            this.client = window.SupabaseConfig.initSupabaseClient();
        }
        if (!this.client && window.supabaseClient?.auth) {
            this.client = window.supabaseClient;
        }
        return this.client;
    },

    clearCache() {
        this.progress = {
            eras: {},
            completedLessons: {},
            unlockedHeroes: {},
            achievements: []
        };
    },

    async init() {
        try {
            this.clearCache();
            const client = this.getClient();
            if (!client) {
                console.error('Supabase client unavailable for ProgressSync');
                return;
            }

            const session = await window.SupabaseConfig.getSession();
            if (!session) {
                this.userId = null;
                this.isOnline = false;
                return;
            }

            // Get the profile ID (not auth user ID) since progress table references profiles.id
            const { data: profile, error: profileError } = await client
                .from('profiles')
                .select('id')
                .eq('auth_id', session.user.id)
                .single();

            if (profileError || !profile) {
                console.error('Could not find profile for user:', profileError);
                this.userId = null;
                this.isOnline = false;
                return;
            }

            this.userId = profile.id;
            this.isOnline = true;
            await this.loadFromServer();

            window.addEventListener('online', () => {
                this.isOnline = true;
                this.loadFromServer();
            });
            window.addEventListener('offline', () => {
                this.isOnline = false;
            });
        } catch (error) {
            console.error('ProgressSync init failed:', error);
        }
    },

    async loadFromServer() {
        if (!this.userId) return;
        const client = this.getClient();
        if (!client) return;

        try {
            const { data, error } = await client
                .from('progress')
                .select('*')
                .eq('user_id', this.userId);

            if (error) throw error;

            this.clearCache();
            (data || []).forEach(p => {
                this.progress.eras[p.era_key] = {
                    lessonsComplete: !!p.lessons_complete,
                    bossDefeated: !!p.boss_defeated,
                    currentLessonIndex: p.current_lesson_index || 0,
                    battleScore: p.battle_score || 0,
                    enemiesDefeated: p.enemies_defeated || 0,
                    highestStreak: p.highest_streak || 0,
                    lastPlayedAt: p.last_played_at || null
                };
                this.progress.completedLessons[p.era_key] = Array.isArray(p.lessons_completed)
                    ? p.lessons_completed
                    : [];
                // Load unlocked heroes (default to [0] - first hero always unlocked)
                this.progress.unlockedHeroes[p.era_key] = Array.isArray(p.unlocked_heroes)
                    ? p.unlocked_heroes
                    : [0];
            });

            // Sync unlocked heroes from DB to localStorage (for offline fallback)
            if (Object.keys(this.progress.unlockedHeroes).length > 0) {
                localStorage.setItem('unlockedHeroes', JSON.stringify(this.progress.unlockedHeroes));
            }

            await this.loadAchievements();
        } catch (error) {
            console.error('Error loading progress from server:', error);
        }
    },

    getEraProgress(eraKey) {
        return this.progress.eras[eraKey] || {
            lessonsComplete: false,
            bossDefeated: false,
            currentLessonIndex: 0,
            battleScore: 0,
            enemiesDefeated: 0,
            highestStreak: 0,
            lastPlayedAt: null
        };
    },

    getAllProgress() {
        return this.progress.eras;
    },

    getCompletedLessons(eraKey) {
        return this.progress.completedLessons[eraKey] || [];
    },

    // Get unlocked heroes for an era (first hero always unlocked)
    getUnlockedHeroes(eraKey) {
        return this.progress.unlockedHeroes[eraKey] || [0];
    },

    // Get all unlocked heroes across all eras
    getAllUnlockedHeroes() {
        return this.progress.unlockedHeroes;
    },

    // Unlock a hero for an era
    async unlockHero(eraKey, heroIndex) {
        const unlocked = new Set(this.getUnlockedHeroes(eraKey));
        unlocked.add(heroIndex);
        const heroArray = [...unlocked].sort((a, b) => a - b);
        this.progress.unlockedHeroes[eraKey] = heroArray;
        await this.saveUnlockedHeroes(eraKey, heroArray);
        return heroArray;
    },

    // Save unlocked heroes to database
    async saveUnlockedHeroes(eraKey, heroIndices) {
        if (!this.userId) {
            console.warn('Cannot save unlocked heroes without a signed-in user');
            return;
        }

        const client = this.getClient();
        if (!client) return;

        try {
            const { error } = await client
                .from('progress')
                .upsert({
                    user_id: this.userId,
                    era_key: eraKey,
                    unlocked_heroes: heroIndices
                }, {
                    onConflict: 'user_id,era_key'
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error saving unlocked heroes:', error);
        }
    },

    async updateEraProgress(eraKey, updates) {
        if (!this.userId) {
            console.warn('Cannot update progress without a signed-in user');
            return;
        }

        const existing = this.getEraProgress(eraKey);
        const merged = { ...existing, ...updates };
        this.progress.eras[eraKey] = merged;
        await this.saveToServer(eraKey, merged);
    },

    async markLessonComplete(eraKey, lessonId) {
        const lessons = new Set(this.getCompletedLessons(eraKey));
        lessons.add(lessonId);
        this.progress.completedLessons[eraKey] = [...lessons];
        await this.saveToServer(eraKey, this.getEraProgress(eraKey));
    },

    // Reset a specific era's progress (lessons only, keep heroes)
    async resetEraLessons(eraKey) {
        // Clear completed lessons for this era
        this.progress.completedLessons[eraKey] = [];
        
        // Reset era progress to initial state (keep unlocked heroes)
        this.progress.eras[eraKey] = {
            lessonsComplete: false,
            bossDefeated: false,
            currentLessonIndex: 0,
            battleScore: 0,
            enemiesDefeated: 0,
            highestStreak: 0,
            lastPlayedAt: null
        };
        
        // Save to server if logged in
        if (this.userId && this.isOnline) {
            await this.saveToServer(eraKey, this.progress.eras[eraKey]);
        }
    },

    async markAllLessonsComplete(eraKey) {
        await this.updateEraProgress(eraKey, { lessonsComplete: true });
    },

    async markBossDefeated(eraKey, score = 0) {
        await this.updateEraProgress(eraKey, {
            bossDefeated: true,
            lessonsComplete: true,
            battleScore: score
        });
    },

    async updateBattleStats(eraKey, stats) {
        const current = this.getEraProgress(eraKey);
        const updates = {
            battleScore: Math.max(current.battleScore || 0, stats.score || 0),
            enemiesDefeated: (current.enemiesDefeated || 0) + (stats.enemiesDefeated || 0),
            highestStreak: Math.max(current.highestStreak || 0, stats.streak || 0)
        };
        await this.updateEraProgress(eraKey, updates);
    },

    async saveToServer(eraKey, data) {
        const toast = window.SupabaseConfig?.showToast;

        if (!this.userId) {
            console.warn('ProgressSync: No userId; progress not saved');
            toast?.('Progress not saved: please sign in');
            return;
        }

        const client = this.getClient();
        if (!client) {
            console.warn('ProgressSync: Supabase client unavailable; progress not saved');
            toast?.('Progress not saved: connection unavailable');
            return;
        }

        try {
            const lessonsCompleted = this.getCompletedLessons(eraKey);
            const unlockedHeroes = this.getUnlockedHeroes(eraKey);
            const { error } = await client
                .from('progress')
                .upsert({
                    user_id: this.userId,
                    era_key: eraKey,
                    lessons_completed: lessonsCompleted,
                    lessons_complete: !!data.lessonsComplete,
                    boss_defeated: !!data.bossDefeated,
                    current_lesson_index: data.currentLessonIndex || 0,
                    battle_score: data.battleScore || 0,
                    enemies_defeated: data.enemiesDefeated || 0,
                    highest_streak: data.highestStreak || 0,
                    unlocked_heroes: unlockedHeroes,
                    last_played_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id,era_key'
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error saving progress to server:', error);
            toast?.('Progress not saved: ' + (error?.message || 'server error'));
        }
    },

    async getCustomQuestions(eraKey) {
        if (!this.isOnline) return [];
        const client = this.getClient();
        if (!client) return [];

        try {
            const { data, error } = await client
                .from('custom_questions')
                .select('*')
                .eq('era_key', eraKey)
                .eq('is_active', true)
                .eq('is_approved', true);

            if (error) throw error;

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
                correctIndex: 0,
                difficulty: q.difficulty,
                isCustom: true
            }));
        } catch (error) {
            console.error('Error fetching custom questions:', error);
            return [];
        }
    },

    async logGameSession(eraKey, sessionType, stats = {}) {
        if (!this.isOnline || !this.userId) return;
        const client = this.getClient();
        if (!client) return;

        try {
            await client
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

    async saveAchievement(achievementKey) {
        const keys = new Set(this.progress.achievements || []);
        keys.add(achievementKey);
        this.progress.achievements = [...keys];

        if (!this.isOnline || !this.userId) return;
        const client = this.getClient();
        if (!client) return;

        try {
            await client
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
    },

    async loadAchievements() {
        if (!this.isOnline || !this.userId) return [];
        const client = this.getClient();
        if (!client) return [];

        try {
            const { data, error } = await client
                .from('achievements')
                .select('achievement_key')
                .eq('user_id', this.userId);

            if (error) throw error;
            this.progress.achievements = (data || []).map(a => a.achievement_key);
            return this.progress.achievements;
        } catch (error) {
            console.error('Error loading achievements:', error);
            return this.progress.achievements;
        }
    },

    async getAchievements() {
        if (this.isOnline && this.userId) {
            return this.loadAchievements();
        }
        return this.progress.achievements;
    },

    isEraUnlocked(eraKey) {
        const eraOrder = ['early-spanish', 'late-spanish', 'american-colonial', 'ww2'];
        const eraIndex = eraOrder.indexOf(eraKey);
        if (eraIndex === 0) return true;

        const previousEra = eraOrder[eraIndex - 1];
        const progress = this.getEraProgress(previousEra);
        return progress.bossDefeated === true;
    },

    async resetAllProgress() {
        this.clearCache();
        if (!this.isOnline || !this.userId) return;
        const client = this.getClient();
        if (!client) return;

        try {
            await client.from('progress').delete().eq('user_id', this.userId);
            await client.from('achievements').delete().eq('user_id', this.userId);
        } catch (error) {
            console.error('Error resetting server progress:', error);
        }
    }
};

window.ProgressSync = ProgressSync;
