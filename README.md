# Battle of Knowledge: Philippine History

## Features Implemented

### 🎨 Dynamic Character Animations
- **4 animation states per character**: Idle, Attack, Hurt, Victory
- Smooth sprite transitions with CSS animations
- Character-specific sprite loading from assets folder

### 🏞️ Era-Based Backgrounds
- **4 historical eras** with unique backgrounds:
  - Early Spanish Era (Battle of Mactan, 1521)
  - Late Spanish Era (Philippine Revolution, 1896-1898)
  - American Colonial Era (Philippine-American War)
  - WW2 Bonus Stage (Pacific Theater, 1941-1945)

### 🎮 Game Features
- Era selection screen with 5 options (4 specific eras + All Eras random)
- Dynamic character loading based on selected era
- Animated combat system with damage numbers
- HP bars that change color based on health
- Victory and defeat screens

## Character Roster

### Early Spanish Era
**Heroes:**
- Lapu-Lapu
- Raja Humabon

**Villains:**
- Ferdinand Magellan
- Spanish Soldier

### Late Spanish Era
**Heroes:**
- Jose Rizal
- Andres Bonifacio
- Emilio Aguinaldo
- Apolinario Mabini

**Villains:**
- Spanish Commander
- Spanish Soldier

### American Colonial Era
**Heroes:**
- Emilio Aguinaldo
- General Juan Luna

**Villains:**
- Commodore George Dewey
- American Soldier

### WW2 Era
**Heroes:**
- Douglas MacArthur

**Villains:**
- Japanese Commander
- Japanese Soldier

## File Structure

```
js/
├── eraData.js       - Era configurations, character data, and asset paths
├── battle.js        - Main battle logic, animation triggers, HP management
├── questions.js     - Question database
├── language.js      - Language toggle functionality
└── achievements.js  - Achievement tracking system

styles/
└── animations.css   - All animation keyframes and transitions

assets/
├── Background/      - Era-specific background images
└── Characters/      - Character sprites organized by era
```

## How It Works

1. **Era Selection**: Player chooses an era or "All Eras" for random selection
2. **Character Loading**: System randomly selects a hero and villain from the chosen era
3. **Background**: Era-specific background is loaded dynamically
4. **Combat**: 
   - Correct answer → Hero attacks (Attack animation)
   - Wrong answer → Villain attacks (Enemy Attack animation)
   - Defender shows Hurt animation
   - Damage numbers display with popup animation
5. **Victory**: Winner shows Victory animation, loser stays in Hurt state

## Animation System

Each character has 4 sprite states:
- **Idle**: Default standing pose
- **Attack**: Offensive action with forward movement
- **Hurt**: Defensive recoil with damage flash
- **Victory**: Celebratory animation (loops infinitely)

Animations are triggered via CSS classes and sprite swapping in JavaScript.

## Running the Game

Simply open `index.html` in a web browser to start the game!
