const fs = require('fs');
const path = require('path');

const icons = [
    { name: 'first_win.svg', color: '#FFD700', text: '🏆' },
    { name: 'student.svg', color: '#4CAF50', text: '📚' },
    { name: 'seeker.svg', color: '#2196F3', text: '🔍' },
    { name: 'boss.svg', color: '#f44336', text: '👹' },
    { name: 'streak.svg', color: '#FF9800', text: '🔥' },
    { name: 'collector.svg', color: '#9C27B0', text: '💎' },
    { name: 'historian.svg', color: '#795548', text: '📜' },
    { name: 'survivor.svg', color: '#607D8B', text: '🛡️' }
];

const achievementDir = path.join('assets', 'Achievements');
if (!fs.existsSync(achievementDir)) {
    fs.mkdirSync(achievementDir, { recursive: true });
}

const template = (color, text) => `
<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" fill="${color}" rx="10" ry="10"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI Emoji, Arial" font-size="32" fill="white">${text}</text>
</svg>
`.trim();

icons.forEach(icon => {
    fs.writeFileSync(path.join(achievementDir, icon.name), template(icon.color, icon.text));
    console.log(`Created ${icon.name}`);
});

// Fallback icon
const buttonsDir = path.join('assets', 'Buttons');
if (!fs.existsSync(buttonsDir)) {
    fs.mkdirSync(buttonsDir, { recursive: true });
}
fs.writeFileSync(path.join(buttonsDir, 'medal_icon.svg'), template('#FFD700', '🏅'));
console.log('Created medal_icon.svg');
