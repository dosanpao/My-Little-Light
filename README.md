# 🌲 Whispers of the Forest - Cozy Valentine Game

A delightful 2D web-based game that appears to be a normal casual forest adventure but reveals a sweet Valentine's Day message at the end.

## 📋 Overview

Guide your character through three peaceful levels, collecting glowing orbs with the help of Lumis, your friendly forest spirit guide. After completing all levels, the game transitions into a heartfelt Valentine's Day proposal.

## 🎮 Game Flow

```
Title Screen → Tutorial → Level 1 → Level 2 → Level 3 → Transition → Valentine Reveal
```

## 📁 File Structure

```
whispers-of-the-forest/
│
├── index.html              # Main HTML file
├── styles.css              # All styling and animations
│
├── js/
│   ├── main.js            # Entry point - initializes game
│   ├── game.js            # Game manager - controls screens and state
│   ├── config.js          # ⭐ EDIT THIS: All settings, dialogue, levels
│   ├── utils.js           # Helper functions
│   ├── entities.js        # Player, Guide, Collectibles, Obstacles
│   │
│   └── screens/
│       ├── titleScreen.js      # Title screen with start button
│       ├── tutorialScreen.js   # Tutorial with controls
│       ├── levelScreen.js      # Main gameplay
│       ├── transitionScreen.js # Brief transition screen
│       └── valentineScreen.js  # Valentine reveal
│
└── README.md              # This file
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

## 🎨 How to Customize

### 🗣️ Changing Dialogue

**File:** `js/config.js`

All dialogue is stored in the `CONFIG.dialogue` object:

```javascript
dialogue: {
    tutorial: [
        "Your custom welcome message here",
        "More tutorial text...",
    ],
    level1Start: "Your level 1 message",
    level1Complete: "Your completion message",
    // ... etc
    valentine: "Will you be my Valentine?" // ← Change this!
}
```

### 🎨 Replacing Placeholder Art

The game currently uses simple shapes drawn with JavaScript. To use custom images:

#### Option 1: Replace Guide Character
**File:** `js/entities.js` → `Guide` class → `draw()` method

Replace the drawing code with an image:

```javascript
draw(ctx, holdingHeart = false) {
    const img = new Image();
    img.src = 'assets/guide-character.png';
    ctx.drawImage(img, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
}
```

#### Option 2: Replace Background
**File:** `js/screens/levelScreen.js` → `drawLevelBackground()` method

```javascript
drawLevelBackground(ctx) {
    const bg = new Image();
    bg.src = 'assets/forest-background.png';
    ctx.drawImage(bg, 0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
}
```

#### Option 3: Replace Player Character
**File:** `js/entities.js` → `Player` class → `draw()` method

Replace the circle/face drawing with your character sprite.

### 🎯 Modifying Levels

**File:** `js/config.js` → `CONFIG.levels` array

Each level has:
- `name`: Level display name
- `playerStart`: Starting position {x, y}
- `guidePosition`: Where the guide appears {x, y}
- `collectibles`: Array of orb positions [{x, y}, {x, y}, ...]
- `obstacles`: Array of blocking rectangles [{x, y, width, height}, ...]

Example - Adding more collectibles to Level 1:

```javascript
levels: [
    {
        name: "Awakening Grove",
        playerStart: { x: 100, y: 300 },
        guidePosition: { x: 700, y: 100 },
        collectibles: [
            { x: 200, y: 150 },
            { x: 400, y: 200 },
            // Add more here:
            { x: 300, y: 300 },
            { x: 500, y: 350 }
        ],
        obstacles: []
    },
    // ... more levels
]
```

### 🎨 Changing Colors

**File:** `js/config.js` → `CONFIG.colors` object

```javascript
colors: {
    background: '#faf8f3',    // Canvas background
    player: '#4a7c59',        // Player character color
    guide: '#ffd89b',         // Guide character color
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

### ⚙️ Adjusting Game Settings

**File:** `js/config.js`

```javascript
// Canvas size
canvas: {
    width: 800,    // Change width
    height: 600    // Change height
}

// Player movement speed
player: {
    speed: 4  // Increase for faster movement
}

// Collectible size
collectible: {
    size: 20  // Make orbs bigger/smaller
}
```

## 🎮 Controls

- **Arrow Keys** or **WASD**: Move character
- **Mouse Click**: Navigate menus and buttons

## 🌟 Features

✨ **Cozy Aesthetic**: Warm, organic design with soft colors  
🎨 **Smooth Animations**: Gentle floating, pulsing, and glow effects  
🎯 **Progressive Difficulty**: Easy → Medium → Easy (emotional warmth)  
💖 **Hidden Valentine**: Surprise reveal after completing all levels  
🎵 **Modular Code**: Easy to extend and customize  
📱 **Responsive**: Works on desktop browsers  

## 🔧 Technical Details

- **Framework**: Vanilla JavaScript (no external dependencies)
- **Graphics**: HTML5 Canvas API
- **Animation**: RequestAnimationFrame loop at ~60 FPS
- **Architecture**: Screen-based state management
- **Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 📝 Code Structure

### Main Game Loop
1. `main.js` initializes the game
2. `game.js` manages screen transitions and input
3. Each screen has its own `update()` and `draw()` methods
4. Game runs at 60 FPS using `requestAnimationFrame`

### Screen Lifecycle
```javascript
// When entering a screen
enter(data) {
    // Setup UI, reset state
}

// Every frame
update() {
    // Update game logic
}

// Every frame
draw(ctx) {
    // Render to canvas
}
```

### Adding a New Screen

1. Create file in `js/screens/yourScreen.js`
2. Implement the screen class with `enter()`, `update()`, `draw()`
3. Add to game.js screens object
4. Call with `game.changeScreen('yourScreen')`

## 🎨 Asset Replacement Guide

### Current Placeholder Assets
- **Player**: Green circle with simple face
- **Guide (Lumis)**: Golden orb with sparkles
- **Collectibles**: Pink glowing orbs
- **Obstacles**: Dark green rounded rectangles
- **Background**: Gradient fills with simple shapes

### To Use Real Art
1. Create an `assets/` folder
2. Add your images (PNG with transparency recommended)
3. Replace drawing code in respective entity classes
4. Use `const img = new Image(); img.src = 'assets/your-image.png'`

### Recommended Image Sizes
- **Guide Character**: 80×80px
- **Player Character**: 60×60px
- **Collectible Orb**: 40×40px
- **Background**: 800×600px (or scale proportionally)

## 🐛 Troubleshooting

**Game doesn't start:**
- Check browser console (F12) for errors
- Ensure all files are in correct folders
- Try using a local server instead of file://

**Blank canvas:**
- Verify canvas size in config.js
- Check if JavaScript is enabled
- Clear browser cache and refresh

**Images don't load:**
- Check file paths are correct
- Use relative paths: `assets/image.png` not `/assets/image.png`
- Ensure images are in the correct format (PNG, JPG)

## 📄 License

Feel free to customize and use this game for personal projects!

---

Made with 💚 for a special someone
