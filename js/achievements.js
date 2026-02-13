/**
 * AchievementManager
 * Handles achievement tracking, unlocking, and notifications.
 * Integrates with ProgressSync for persistence.
 */

const AchievementManager = {
    achievements: [
        {
            id: 'first_win',
            title: 'First Victory',
            description: 'Win your first battle.',
            icon: 'assets/Achievements/first_win.svg', // Placeholder
            category: 'battle'
        },
        {
            id: 'promising_student',
            title: 'Promising Student',
            description: 'Complete your first lesson.',
            icon: 'assets/Achievements/student.svg',
            category: 'learning'
        },
        {
            id: 'knowledge_seeker',
            title: 'Knowledge Seeker',
            description: 'Complete all lessons in a single era.',
            icon: 'assets/Achievements/seeker.svg',
            category: 'learning'
        },
        {
            id: 'boss_slayer',
            title: 'Boss Slayer',
            description: 'Defeat a Boss for the first time.',
            icon: 'assets/Achievements/boss.svg',
            category: 'battle'
        },
        {
            id: 'unstoppable',
            title: 'Unstoppable',
            description: 'Win 5 battles in a row.',
            icon: 'assets/Achievements/streak.svg',
            category: 'battle'
        },
        {
            id: 'collector',
            title: 'Collector',
            description: 'Unlock a new hero.',
            icon: 'assets/Achievements/collector.svg',
            category: 'collection'
        },
        {
            id: 'historian',
            title: 'Master Historian',
            description: 'Complete all eras.',
            icon: 'assets/Achievements/historian.svg',
            category: 'progression'
        },
        {
            id: 'survivor',
            title: 'Close Call',
            description: 'Win a battle with less than 10 HP.',
            icon: 'assets/Achievements/survivor.svg',
            category: 'battle'
        }
    ],

    unlockedAchievements: new Set(),
    isInitialized: false,

    async init() {
        if (this.isInitialized) return;

        // Wait for ProgressSync
        if (window.ProgressSync) {
            // Ensure ProgressSync is initialized
            if (!window.ProgressSync.userId && window.ProgressSync.init) {
                await window.ProgressSync.init();
            }

            // Load achievements from ProgressSync
            const syncedAchievements = await window.ProgressSync.getAchievements();
            if (syncedAchievements && Array.isArray(syncedAchievements)) {
                syncedAchievements.forEach(id => this.unlockedAchievements.add(id));
            }
        }

        // Inject styles if not present
        if (!document.getElementById('achievements-css')) {
            const link = document.createElement('link');
            link.id = 'achievements-css';
            link.rel = 'stylesheet';
            link.href = 'styles/achievements.css';
            document.head.appendChild(link);
        }

        this.isInitialized = true;
        console.log('AchievementManager initialized. Unlocked:', this.unlockedAchievements.size);
    },

    isUnlocked(id) {
        return this.unlockedAchievements.has(id);
    },

    getAchievement(id) {
        return this.achievements.find(a => a.id === id);
    },

    getAllAchievements() {
        return this.achievements.map(a => ({
            ...a,
            unlocked: this.isUnlocked(a.id)
        }));
    },

    async unlock(id) {
        if (!this.isInitialized) await this.init();

        if (this.isUnlocked(id)) return; // Already unlocked

        const achievement = this.getAchievement(id);
        if (!achievement) {
            console.warn(`Achievement ID '${id}' not found.`);
            return;
        }

        // Add to local set
        this.unlockedAchievements.add(id);

        // Save to server/storage
        if (window.ProgressSync) {
            await window.ProgressSync.saveAchievement(id);
        }

        // Show notification
        this.showNotification(achievement);

        // Play sound
        this.playUnlockSound();

        console.log(`Achievement Unlocked: ${achievement.title}`);
    },

    showNotification(achievement) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';

        // Use a generic icon if specific one fails or is missing (handle via onerror in img tag)
        // For now, using a placeholder logic for icons
        let iconSrc = achievement.icon;

        notification.innerHTML = `
            <div class="achievement-icon-container">
                <img src="${iconSrc}" alt="Icon" class="achievement-icon" onerror="this.src='assets/Buttons/medal_icon.svg'">
            </div>
            <div class="achievement-text">
                <div class="achievement-title">Achievement Unlocked</div>
                <div class="achievement-name">${achievement.title}</div>
            </div>
        `;

        document.body.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 600); // Wait for transition to finish
        }, 4000);
    },

    playUnlockSound() {
        try {
            // Create audio object just for this instance to avoid overlaps cutting off
            const audio = new Audio('assets/SFX/Achievement/achievement_unlock.mp3'); // Need to ensure this path exists or use a fallback
            audio.volume = 0.4;
            audio.play().catch(e => console.log('Audio play failed', e));
        } catch (e) {
            console.warn('Could not play achievement sound', e);
        }
    }
};

// Expose to window
window.AchievementManager = AchievementManager;

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => {
    AchievementManager.init();
});
