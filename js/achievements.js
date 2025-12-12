// Achievements system placeholder
document.addEventListener('DOMContentLoaded', () => {
    const achievementCards = document.getElementById('achievementCards');
    
    if (achievementCards) {
        // You can add achievement tracking here
        const achievements = [
            { name: 'Lapu-Lapu', unlocked: true },
            { name: 'Jose Rizal', unlocked: false },
            { name: 'Andres Bonifacio', unlocked: false }
        ];
        
        achievements.forEach(achievement => {
            const card = document.createElement('div');
            card.className = `p-4 rounded-xl border-2 ${achievement.unlocked ? 'bg-yellow-100 border-yellow-500' : 'bg-gray-300 border-gray-500 opacity-50'}`;
            card.innerHTML = `
                <p class="font-bold text-sm">${achievement.name}</p>
                <p class="text-xs">${achievement.unlocked ? 'Unlocked' : 'Locked'}</p>
            `;
            achievementCards.appendChild(card);
        });
    }
});
