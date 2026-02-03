# 📂 File Structure & Code Architecture

## Complete File Tree

```
whispers-of-the-forest/
│
├── 📄 index.html                 # Main HTML - UI structure and canvas
├── 🎨 styles.css                 # All CSS styling and animations
├── 📖 README.md                  # Complete documentation
├── 🎯 CUSTOMIZATION.md           # Quick customization guide
│
└── 📁 js/                        # All JavaScript code
    │
    ├── 🚀 main.js                # Entry point - starts the game
    ├── 🎮 game.js                # Game manager - orchestrates everything
    ├── ⚙️  config.js              # ⭐ SETTINGS - dialogue, levels, colors
    ├── 🛠️  utils.js               # Helper functions
    ├── 👤 entities.js            # Player, Guide, Collectibles, Obstacles
    │
    └── 📁 screens/               # Screen modules
        ├── 🏠 titleScreen.js     # Title screen with start button
        ├── 📚 tutorialScreen.js  # Tutorial explaining controls
        ├── 🎯 levelScreen.js     # Main gameplay (3 levels)
        ├── ✨ transitionScreen.js # Transition before Valentine
        └── 💖 valentineScreen.js # Valentine reveal screen

```

## What Each File Does

### Core Files

#### `index.html` - The Foundation
**Purpose:** HTML structure, UI overlay elements  
**Contains:**
- Canvas element for game rendering
- UI overlays for each screen (title, tutorial, levels, valentine)
- Button elements
- Celebration effects container

**When to edit:** When adding new UI elements or buttons

---

#### `styles.css` - The Aesthetics
**Purpose:** All visual styling and animations  
**Contains:**
- Color palette (CSS variables)
- Button styles with hover effects
- Dialogue box styling
- Animations (fade-ins, pulses, floating hearts)
- Responsive layout

**When to edit:** To change colors, fonts, button styles, or animations

---

### JavaScript Modules

#### `js/main.js` - The Starter
**Purpose:** Entry point that kicks everything off  
**Contains:**
- DOM ready listener
- Game initialization
- Start command

**Code Flow:**
```
Page loads → main.js runs → Creates Game instance → Starts game loop
```

**When to edit:** Rarely. Only if changing initialization behavior.

---

#### `js/game.js` - The Director
**Purpose:** Central game manager and state controller  
**Contains:**
- Screen management (switching between title, tutorial, levels, etc.)
- Input handling (keyboard controls)
- Game loop (update/draw cycle)
- Game state tracking

**Key Methods:**
```javascript
changeScreen(screenName, data) // Switch between screens
update()                        // Update current screen
draw()                          // Render current screen
gameLoop()                      // Main loop (60 FPS)
```

**When to edit:** To add new screens or change input controls

---

#### `js/config.js` - ⭐ The Control Panel
**Purpose:** All customizable content in ONE place  
**Contains:**
- Canvas dimensions
- Colors for all game elements
- Player/Guide/Collectible settings
- **ALL DIALOGUE** (tutorial, levels, valentine message)
- **ALL LEVEL LAYOUTS** (positions, obstacles)

**This is the MAIN file you'll edit!**

**Structure:**
```javascript
const CONFIG = {
    canvas: { width, height },
    colors: { ... },
    player: { size, speed, color },
    guide: { ... },
    collectible: { ... },
    dialogue: {              // ← All text here!
        tutorial: [...],
        level1Start: "...",
        valentine: "..."     // ← The big reveal!
    },
    levels: [                // ← All level layouts here!
        { /* Level 1 */ },
        { /* Level 2 */ },
        { /* Level 3 */ }
    ]
};
```

**When to edit:** To change dialogue, level layouts, colors, or game settings

---

#### `js/utils.js` - The Helpers
**Purpose:** Reusable utility functions  
**Contains:**
- Collision detection (rectangle and circle)
- UI show/hide helpers
- Math utilities (clamp, lerp)
- Drawing helpers (rounded rectangles, glows)

**When to edit:** To add new utility functions

---

#### `js/entities.js` - The Characters
**Purpose:** Classes for all game objects  
**Contains:**
- `Player` class - the character you control
- `Guide` class - Lumis, the forest spirit
- `Collectible` class - glowing orbs to collect
- `Obstacle` class - objects that block movement

**Each class has:**
```javascript
constructor(x, y)  // Create the entity
update()           // Update logic and animation
draw(ctx)          // Render to canvas
```

**When to edit:** To change how characters look or behave, or to replace with images

---

### Screen Modules (js/screens/)

Each screen is a self-contained module that handles one part of the game.

#### `titleScreen.js` - Welcome Screen
**Shows:** Game title, guide character, start button  
**Draws:** Forest background with trees and sparkles  
**Transitions to:** Tutorial screen when "Start" clicked

---

#### `tutorialScreen.js` - Controls Explanation
**Shows:** Guide character, dialogue box, controls visualization  
**Progression:** Cycles through tutorial dialogue  
**Transitions to:** Level 1 when tutorial complete

---

#### `levelScreen.js` - Main Gameplay
**Shows:** Player, guide, collectibles, obstacles, HUD  
**Handles:**
- Player movement
- Collectible collection
- Level completion detection
- Progress tracking

**Contains 3 levels:**
1. **Awakening Grove** - Easy, no obstacles
2. **Whispering Woods** - Medium, with obstacles
3. **Heartwood Haven** - Easy, emotional warmth

**Transitions to:** 
- Next level on completion
- Transition screen after level 3

---

#### `transitionScreen.js` - The Setup
**Shows:** Guide character with extra glow, "One last thing..." text  
**Duration:** 3 seconds  
**Purpose:** Build anticipation before valentine reveal  
**Transitions to:** Valentine screen

---

#### `valentineScreen.js` - The Reveal! 💖
**Shows:** 
- Guide holding a heart
- "Will you be my Valentine?" message
- Two "Yes" buttons

**On button click:**
- Triggers celebration animation
- Spawns floating hearts
- Creates magical effects

**This is the emotional payoff of the entire game!**

---

## Code Flow Diagram

```
main.js
   ↓
   Creates Game instance
   ↓
game.js
   ↓
   Initializes all screens
   ↓
   Starts with titleScreen
   ↓
   ┌─────────────────────────────────────┐
   │                                     │
   │  Game Loop (60 FPS):               │
   │  ┌──────────────────────────────┐  │
   │  │ 1. currentScreen.update()    │  │
   │  │ 2. currentScreen.draw()      │  │
   │  │ 3. requestAnimationFrame     │  │
   │  └──────────────────────────────┘  │
   │                                     │
   └─────────────────────────────────────┘
   ↓
   Screen transitions:
   titleScreen → tutorialScreen → levelScreen (×3) → transitionScreen → valentineScreen
```

## Data Flow

### Level Loading Process
```
1. game.changeScreen('level', levelIndex)
2. levelScreen.enter(levelIndex)
3. levelScreen.loadLevel(levelIndex)
4. Reads CONFIG.levels[levelIndex]
5. Creates Player at playerStart position
6. Creates Guide at guidePosition
7. Creates Collectibles from collectibles array
8. Creates Obstacles from obstacles array
9. Shows level UI with dialogue
```

### Input Handling
```
1. User presses key
2. game.handleKeyDown(event)
3. Checks if current screen is levelScreen
4. Updates player.keys object
5. player.update() reads keys
6. Moves player if no collision
```

### Collision Detection
```
1. player.update() calculates new position
2. Checks obstacles with Utils.checkCollision()
3. If collision: don't move
4. If no collision: update position
5. For collectibles: Utils.checkCircleCollision()
6. If collected: mark as collected, update UI
```

## Screen Lifecycle

Every screen follows this pattern:

```javascript
class ScreenName {
    constructor(game) {
        // Initialize screen
        // Setup event listeners
    }
    
    enter(data) {
        // Called when entering this screen
        // Show UI elements
        // Reset state
    }
    
    update() {
        // Called every frame (60 times/second)
        // Update animations
        // Check conditions
        // Progress logic
    }
    
    draw(ctx) {
        // Called every frame
        // Clear canvas
        // Draw background
        // Draw entities
        // Draw effects
    }
}
```

## Key Design Patterns

### 1. Screen-Based State Management
Instead of one giant update function, each screen manages its own state.

### 2. Configuration Separation
All content (dialogue, levels) in `config.js` separate from code logic.

### 3. Entity System
Each game object (Player, Guide, Collectible) is a class with update/draw methods.

### 4. UI Overlay
Canvas for game graphics + HTML/CSS for UI elements (buttons, dialogue).

### 5. Event-Driven Buttons
Button clicks trigger screen transitions, keeping code modular.

---

## How Screens Connect

```
┌─────────────┐
│ Title       │ → [Start Button Click]
│ Screen      │
└─────────────┘
       ↓
┌─────────────┐
│ Tutorial    │ → [Continue Button Click × 4]
│ Screen      │
└─────────────┘
       ↓
┌─────────────┐
│ Level 1     │ → [All Collectibles Gathered]
│ Screen      │
└─────────────┘
       ↓
┌─────────────┐
│ Level       │ → [Next Level Button Click]
│ Complete    │
└─────────────┘
       ↓
┌─────────────┐
│ Level 2     │ → [All Collectibles Gathered]
│ Screen      │
└─────────────┘
       ↓
┌─────────────┐
│ Level       │ → [Next Level Button Click]
│ Complete    │
└─────────────┘
       ↓
┌─────────────┐
│ Level 3     │ → [All Collectibles Gathered]
│ Screen      │
└─────────────┘
       ↓
┌─────────────┐
│ Level       │ → [Next Level Button Click]
│ Complete    │
└─────────────┘
       ↓
┌─────────────┐
│ Transition  │ → [3 Second Timer]
│ Screen      │
└─────────────┘
       ↓
┌─────────────┐
│ Valentine   │ → [Yes Button Click]
│ Screen      │
└─────────────┘
       ↓
┌─────────────┐
│ Celebration │
│ Animation   │
└─────────────┘
```

---

## Adding Features

### Want to add a new level?

1. Open `js/config.js`
2. Add a new object to the `levels` array:
```javascript
{
    name: "Your Level Name",
    playerStart: { x: 100, y: 300 },
    guidePosition: { x: 700, y: 100 },
    collectibles: [
        { x: 200, y: 150 },
        // ... more positions
    ],
    obstacles: []
}
```
3. Add dialogue in `CONFIG.dialogue`:
```javascript
level4Start: "Your dialogue here",
level4Complete: "Completion message",
```

### Want to add a new screen?

1. Create `js/screens/newScreen.js`
2. Follow the screen pattern (constructor, enter, update, draw)
3. Add to `game.js` screens object
4. Add UI elements to `index.html`
5. Add styles to `styles.css`
6. Transition to it with `game.changeScreen('newScreen')`

---

This structure keeps the code organized, modular, and easy to customize! 🌲
