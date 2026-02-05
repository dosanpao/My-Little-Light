# 🌲 My Little Light - Cozy Valentine Game

A delightful 2D web-based game where you play as a glowing light character with a customizable color, exploring peaceful forest levels to ultimately receive a sweet Valentine's Day message.

## 📋 Overview

Choose your light color, then guide your glowing character through three peaceful levels while collecting orbs with the help of your companion character (a cute lazy egg). After completing all levels, the game transitions into a heartfelt Valentine's Day reveal.

## 🎮 Game Flow

```
Title Screen → Name Input → Tutorial → Color Selection → Level 1 → Level 2 → Level 3 → Transition → Valentine Reveal
```

## ✨ Key Features

- **🎨 Customizable Light Character**: Choose from 6 different light colors (Warm White, Soft Yellow, Sky Blue, Lavender, Peach, Mint Green)
- **✏️ Personalized Experience**: Optional name input for personalized dialogue throughout the game
- **💫 Smooth Movement**: Physics-based movement with acceleration, deceleration, and idle floating animation
- **🌟 Visual Effects**: Trail particles, glow effects, and ambient sparkles
- **🎭 Unique Companion**: Guide character styled as a lazy egg (Gudetama-inspired)
- **🌲 Three Distinct Levels**: 
  - Awakening Grove (Easy introduction)
  - Whispering Woods (Medium with obstacles)
  - Heartwood Haven (Easy, romantically themed)
- **💖 Valentine Surprise**: Hidden Valentine's reveal with celebration animation

## 📁 File Structure

```
my-little-light/
│
├── index.html              # Main HTML file with UI overlays
├── styles.css              # All styling and animations
├── README.md               # This file
├── FILE_STRUCTURE.md       # Detailed code architecture
│
└── js/
    ├── main.js            # Entry point - initializes game
    ├── game.js            # Game manager - controls screens and state
    ├── config.js          # ⭐ EDIT THIS: All settings, dialogue, levels
    ├── utils.js           # Helper functions
    ├── entities.js        # Player (light), Guide (egg), Collectibles, Obstacles
    │
    └── screens/
        ├── titleScreen.js          # Title screen with forest scene
        ├── nameInputScreen.js      # Optional name input
        ├── tutorialScreen.js       # Tutorial with controls
        ├── colorSelectionScreen.js # Choose light color
        ├── levelScreen.js          # Main gameplay
        ├── transitionScreen.js     # Brief transition screen
        └── valentineScreen.js      # Valentine reveal
```

## 🚀 How to Run

### Method 1: Direct File Open
1. Download all files maintaining the folder structure
2. Double-click `index.html` to open in your browser

### Method 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then open your browser to `http://localhost:8000`

## 🎮 Controls

- **Arrow Keys** or **WASD**: Move your light character
- **Mouse Click**: Navigate menus, dismiss dialogue bubbles, and interact with buttons

## 🎨 How to Customize

### 🗣️ Changing Dialogue

**File:** `js/config.js`

All dialogue is stored in the `CONFIG.dialogue` object with `{name}` placeholders:

```javascript
dialogue: {
    namePrompt: "Before we begin, what should I call you?",
    tutorial: [
        "Welcome{name}! I'm Lumis, your forest guide.",
        "Use arrow keys or WASD to move around.",
        // ... more tutorial lines
    ],
    level1Start: "The forest whispers to those who listen{name}...",
    level1Complete: "You did wonderfully{name}!",
    // ... more dialogue
    valentine: "Will you be my Valentine{name}?"  // ← The big reveal!
}
```

The `{name}` placeholder is automatically replaced with the player's name (or removed if no name was entered).

### 🎨 Adding/Modifying Light Colors

**File:** `js/config.js` → `CONFIG.lightColors` array

```javascript
lightColors: [
    {
        name: 'Your Color Name',
        color: '#hexcode',  // Main color
        glow: '#hexcode'    // Glow/aura color
    },
    // ... add more colors
]
```

### 🎯 Modifying Levels

**File:** `js/config.js` → `CONFIG.levels` array

Each level has:
- `name`: Level display name
- `playerStart`: Starting position {x, y}
- `guidePosition`: Where the guide character appears {x, y}
- `collectibles`: Array of orb positions [{x, y}, ...]
- `obstacles`: Array of blocking rectangles [{x, y, width, height}, ...]

Example - Adding collectibles to Level 1:

```javascript
levels: [
    {
        name: "Awakening Grove",
        playerStart: { x: 100, y: 300 },
        guidePosition: { x: 700, y: 100 },
        collectibles: [
            { x: 200, y: 150 },
            { x: 400, y: 200 },
            { x: 600, y: 150 },
            // Add more positions here
        ],
        obstacles: [] // No obstacles in level 1
    },
    // ... more levels
]
```

### ⚙️ Game Settings

**File:** `js/config.js`

```javascript
// Canvas size
canvas: {
    width: 800,
    height: 600
}

// Player settings (light character)
player: {
    size: 30,           // Size of light orb
    speed: 3,           // Movement speed
    trailLength: 12     // Number of trail particles
}

// Collectible settings
collectible: {
    size: 20,
    color: '#ffb3ba',
    glowColor: 'rgba(255, 179, 186, 0.6)'
}
```

### 🎨 Changing Colors

**File:** `js/config.js` → `CONFIG.colors`

```javascript
colors: {
    background: '#faf8f3',    // Canvas background
    guide: '#ffd89b',         // Guide character base color
    collectible: '#ffb3ba',   // Orb color
    obstacle: '#2d4a3e',      // Obstacle color
}
```

Also edit CSS variables in `styles.css`:

```css
:root {
    --forest-deep: #2d4a3e;    /* Deep forest green */
    --rose: #ffb3ba;           /* Soft pink/rose */
    --gold: #ffd89b;           /* Warm gold */
    /* ... more colors */
}
```

## 🎨 Character Customization

### Player Character (Light)
The player is rendered as a glowing orb with:
- Customizable color (chosen in color selection screen)
- Glow effects with multiple layers
- Floating trail particles
- Movement-based stretch effects
- Idle floating animation when stationary

**To modify:** Edit `Player` class in `js/entities.js`

### Guide Character (Lazy Egg)
The guide is styled as a cute, lazy egg character with:
- Egg body with yolk showing on top
- Lazy/unimpressed facial expression
- Tiny droopy arms and legs
- Gentle idle animation
- Can hold a heart in the valentine screen

**To modify:** Edit `Guide` class in `js/entities.js` → `draw()` method

## 🏞️ Level Backgrounds

Each level has a unique background:

1. **Awakening Grove** - Sunny forest with trees, grass, flowers
2. **Whispering Woods** - Mystical forest with light rays and mushrooms
3. **Heartwood Haven** - Romantic pink sky with heart-shaped elements

Backgrounds are drawn in `levelScreen.js` with methods:
- `drawAwakeningGroveBackground()`
- `drawWhisperingWoodsBackground()`
- `drawHeartwoodHavenBackground()`

## 🔧 Technical Details

- **Framework**: Vanilla JavaScript (no external dependencies)
- **Graphics**: HTML5 Canvas API
- **Animation**: RequestAnimationFrame loop at ~60 FPS
- **Architecture**: Screen-based state management
- **Physics**: Custom momentum-based movement system
- **Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 📝 Code Architecture

### Main Game Loop
```
main.js → game.js → Screen system
                     ↓
                   update()
                     ↓
                   draw()
                     ↓
                requestAnimationFrame (60 FPS)
```

### Screen Lifecycle
```javascript
enter(data) {
    // Setup UI, reset state, load data
}

update() {
    // Update game logic, animations, check conditions
}

draw(ctx) {
    // Render to canvas
}
```

### Entity System
- **Player**: Light character with physics-based movement
- **Guide**: Companion character with idle animation
- **Collectible**: Glowing orbs with pulse animation
- **Obstacle**: Static barriers with shadows

## 🐛 Troubleshooting

**Game doesn't start:**
- Check browser console (F12) for errors
- Ensure all files are in correct folders
- Try using a local server instead of file://

**Blank canvas:**
- Verify canvas size in config.js
- Check if JavaScript is enabled
- Clear browser cache and refresh

**Movement feels wrong:**
- Adjust `speed`, `acceleration`, and `deceleration` in `config.js`
- Player class in `entities.js` has physics settings

**Colors look wrong:**
- Check both `config.js` colors and CSS variables in `styles.css`
- Some colors are hardcoded in drawing methods

## 💡 Tips for Developers

1. **Start with config.js** - Most customization happens here
2. **Test in browser** - Use developer tools to debug
3. **Read FILE_STRUCTURE.md** - For detailed code architecture
4. **One screen at a time** - Focus on modifying one screen/feature
5. **Use console.log()** - For debugging game state and flow

## 🎮 Gameplay Tips

- Move smoothly - the physics system rewards gentle movements
- Dismiss dialogue by clicking on it to start playing
- Each light color has a unique personality - choose your favorite!
- Take your time in Level 3 - it's meant to be peaceful and romantic

## 📄 License

Feel free to customize and use this game for personal projects!

---

Made with 💚 for a special someone

**Game Flow Summary:**
Title → Name (optional) → Tutorial → Pick Color → 3 Levels → Valentine! 💖