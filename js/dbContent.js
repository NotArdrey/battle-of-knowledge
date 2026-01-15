// dbContent.js - Loads questions and lessons from Supabase database
// Falls back to local JS files if database is unavailable

const dbContent = {
    questionsData: null,
    learningData: null,
    loaded: false,
    
    // Initialize and load content from database
    async init() {
        if (this.loaded) return true;
        
        try {
            // Check if Supabase is available
            if (!window.supabase) {
                console.warn('Supabase not available, falling back to local files');
                this.useLocalFallback();
                return true;
            }
            
            // Load questions and lessons in parallel
            const [questionsLoaded, lessonsLoaded] = await Promise.all([
                this.loadQuestionsFromDB(),
                this.loadLessonsFromDB()
            ]);
            
            // If database load failed, use local fallback
            if (!questionsLoaded && window.questionsData) {
                console.warn('Using local questionsData fallback');
                this.questionsData = window.questionsData;
            }
            
            if (!lessonsLoaded && window.learningData) {
                console.warn('Using local learningData fallback');
                this.learningData = window.learningData;
            }
            
            this.loaded = true;
            
            // Expose globally for backward compatibility
            if (this.questionsData) {
                window.questionsData = this.questionsData;
            }
            if (this.learningData) {
                window.learningData = this.learningData;
            }
            
            console.log('Content loaded successfully');
            return true;
        } catch (error) {
            console.error('Error loading content:', error);
            this.useLocalFallback();
            return true;
        }
    },
    
    // Use local JS file content as fallback
    useLocalFallback() {
        if (window.questionsData) {
            this.questionsData = window.questionsData;
        }
        if (window.learningData) {
            this.learningData = window.learningData;
        }
        this.loaded = true;
    },
    
    // Load questions from database
    async loadQuestionsFromDB() {
        try {
            // Query active and approved questions (both system and custom)
            const { data: questions, error } = await window.supabase
                .from('custom_questions')
                .select('*')
                .eq('is_active', true)
                .eq('is_approved', true)
                .order('era_key')
                .order('created_at');
            
            if (error) {
                console.error('Error loading questions from DB:', error);
                return false;
            }
            
            if (!questions || questions.length === 0) {
                console.warn('No questions found in database');
                return false;
            }
            
            // Transform database format to game format
            this.questionsData = this.transformQuestionsToGameFormat(questions);
            console.log(`Loaded ${questions.length} questions from database`);
            return true;
        } catch (error) {
            console.error('Exception loading questions:', error);
            return false;
        }
    },
    
    // Transform database questions to game format
    transformQuestionsToGameFormat(dbQuestions) {
        const gameFormat = {};
        
        // Group questions by era
        dbQuestions.forEach(q => {
            const era = q.era_key;
            
            if (!gameFormat[era]) {
                gameFormat[era] = {
                    en: [],
                    tl: []
                };
            }
            
            // Parse wrong answers JSON if stored as string
            let wrongAnswersEn = q.wrong_answers_en;
            let wrongAnswersTl = q.wrong_answers_tl;
            
            if (typeof wrongAnswersEn === 'string') {
                try {
                    wrongAnswersEn = JSON.parse(wrongAnswersEn);
                } catch (e) {
                    wrongAnswersEn = [wrongAnswersEn];
                }
            }
            
            if (typeof wrongAnswersTl === 'string') {
                try {
                    wrongAnswersTl = JSON.parse(wrongAnswersTl);
                } catch (e) {
                    wrongAnswersTl = [wrongAnswersTl];
                }
            }
            
            // English version
            const enQuestion = {
                question: q.question_text_en,
                answers: [q.correct_answer_en, ...(wrongAnswersEn || [])],
                correct: q.correct_answer_en,
                id: q.id,
                isSystem: q.is_system
            };
            gameFormat[era].en.push(enQuestion);
            
            // Tagalog version
            const tlQuestion = {
                question: q.question_text_tl || q.question_text_en,
                answers: [q.correct_answer_tl || q.correct_answer_en, ...(wrongAnswersTl || wrongAnswersEn || [])],
                correct: q.correct_answer_tl || q.correct_answer_en,
                id: q.id,
                isSystem: q.is_system
            };
            gameFormat[era].tl.push(tlQuestion);
        });
        
        return gameFormat;
    },
    
    // Load lessons from database
    async loadLessonsFromDB() {
        try {
            // Query active and approved lessons (both system and custom)
            const { data: lessons, error } = await window.supabase
                .from('custom_lessons')
                .select('*')
                .eq('is_active', true)
                .eq('is_approved', true)
                .order('era_key')
                .order('lesson_order');
            
            if (error) {
                console.error('Error loading lessons from DB:', error);
                return false;
            }
            
            if (!lessons || lessons.length === 0) {
                console.warn('No lessons found in database');
                return false;
            }
            
            // Transform database format to game format
            this.learningData = this.transformLessonsToGameFormat(lessons);
            console.log(`Loaded ${lessons.length} lessons from database`);
            return true;
        } catch (error) {
            console.error('Exception loading lessons:', error);
            return false;
        }
    },
    
    // Transform database lessons to game format
    transformLessonsToGameFormat(dbLessons) {
        const gameFormat = {};
        
        // Group lessons by era
        dbLessons.forEach(l => {
            const era = l.era_key;
            
            if (!gameFormat[era]) {
                gameFormat[era] = {
                    title: this.getEraTitle(era),
                    lessons: []
                };
            }
            
            gameFormat[era].lessons.push({
                id: l.lesson_order,
                dbId: l.id,
                title: {
                    en: l.title_en,
                    tl: l.title_tl || l.title_en
                },
                content: {
                    en: l.content_en,
                    tl: l.content_tl || l.content_en
                },
                icon: l.icon || (l.lesson_order).toString(),
                isSystem: l.is_system
            });
        });
        
        // Sort lessons by order within each era
        Object.keys(gameFormat).forEach(era => {
            gameFormat[era].lessons.sort((a, b) => a.id - b.id);
        });
        
        return gameFormat;
    },
    
    // Get era title based on era key
    getEraTitle(eraKey) {
        const titles = {
            'early-spanish': {
                en: 'Early Spanish Era',
                tl: 'Maagang Panahon ng Espanyol'
            },
            'late-spanish': {
                en: 'Late Spanish Era',
                tl: 'Huling Panahon ng Espanyol'
            },
            'american-colonial': {
                en: 'American Colonial Era',
                tl: 'Panahon ng Kolonyal na Amerika'
            },
            'ww2': {
                en: 'World War 2 Era',
                tl: 'Panahon ng Ikalawang Digmaang Pandaigdig'
            }
        };
        return titles[eraKey] || { en: eraKey, tl: eraKey };
    },
    
    // Get questions for a specific era and language
    getQuestions(era, language = 'en') {
        if (!this.questionsData || !this.questionsData[era]) {
            return [];
        }
        return this.questionsData[era][language] || this.questionsData[era]['en'] || [];
    },
    
    // Get lessons for a specific era
    getLessons(era) {
        if (!this.learningData || !this.learningData[era]) {
            return null;
        }
        return this.learningData[era];
    },
    
    // Refresh content from database (useful after admin edits)
    async refresh() {
        this.loaded = false;
        this.questionsData = null;
        this.learningData = null;
        return await this.init();
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dbContent;
}

// Expose globally
window.dbContent = dbContent;
