# 📂 File Structure & Code Architecture

## Complete File Tree

```
my-little-light/
│
├── 📄 index.html                 # Main HTML - UI structure and canvas
├── 🎨 styles.css                 # All CSS styling and animations
├── 📖 README.md                  # User documentation
├── 📂 FILE_STRUCTURE.md          # This file - code architecture
│
└── 📁 js/                        # All JavaScript code
    │
    ├── 🚀 main.js                # Entry point - starts the game
    ├── 🎮 game.js                # Game manager - orchestrates everything
    ├── ⚙️  config.js              # ⭐ SETTINGS - dialogue, levels, colors
    ├── 🛠️  utils.js               # Helper functions
    ├── 👤 entities.js            # Player (light), Guide (egg), Collectibles, Obstacles
    │
    └── 📁 screens/               # Screen modules
        ├── 🏠 titleScreen.js     # Title screen with forest scene
        ├── ✏️  nameInputScreen.js # Optional name input
        ├── 📚 tutorialScreen.js  # Tutorial explaining controls
        ├── 🎨 colorSelectionScreen.js # Choose light color
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
- UI overlays for each screen
  - Title UI (game title, start button)
  - Name Input UI (optional text input)
  - Tutorial UI (dialogue bubble)
  - Color Selection UI (color picker grid)
  - Level UI (HUD, dialogue bubble)
  - Level Complete UI (completion message, next button)
  - Transition UI (transition message)
  - Valentine UI (question, yes buttons)
  - Celebration Overlay (hearts animation)

**When to edit:** When adding new UI elements or buttons

---

#### `styles.css` - The Aesthetics
**Purpose:** All visual styling and animations  
**Contains:**
- CSS variables for color palette
- Screen UI base styles with fade transitions
- Typography (game title, dialogue, etc.)
- Dialogue boxes and chat bubbles (with positioning tails)
- Button styles with hover effects
- HUD (heads-up display) styling
- Color selection grid
- Celebration animation (floating hearts)
- Responsive design breakpoints

**Key Features:**
- Chat bubbles with directional tails (guide-bottom, guide-left, guide-right)
- Smooth fade transitions between screens
- Heartbeat animation for valentine screen
- Floating hearts keyframe animation

**When to edit:** To change colors, fonts, button styles, or animations

---

### JavaScript Modules

#### `js/main.js` - The Starter
**Purpose:** Entry point that kicks everything off  
**Size:** ~15 lines  
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
**Size:** ~150 lines  
**Contains:**
- Screen management (switching between screens)
- Input handling (keyboard controls)
- Game loop (update/draw cycle at 60 FPS)
- Game state tracking (player name, light color, completed levels)

**Key Methods:**
```javascript
setupInput()                    // Keyboard event listeners
handleKeyDown(e)                // Process key presses
handleKeyUp(e)                  // Process key releases
changeScreen(screenName, data)  // Switch between screens
getPersonalizedDialogue(text)   // Replace {name} placeholder
update()                        // Update current screen
draw()                          // Render current screen
gameLoop()                      // Main loop (requestAnimationFrame)
```

**Game State:**
```javascript
this.state = {
    playerName: '',        // Optional player name
    lightColor: null,      // Selected light color object
    completedLevels: []    // Array of completed level indices
}
```

**When to edit:** To add new screens or change input controls

---

#### `js/config.js` - ⭐ The Control Panel
**Purpose:** All customizable content in ONE place  
**Size:** ~200 lines  
**Contains:**
- Canvas dimensions
- Color settings for all game elements
- **Light color options** (6 customizable colors)
- Player settings (size, speed, trail length)
- Guide character settings
- Collectible settings
- **ALL DIALOGUE** (tutorial, levels, valentine message)
- **ALL LEVEL LAYOUTS** (positions, obstacles)

**This is the MAIN file you'll edit!**

**Structure:**
```javascript
const CONFIG = {
    canvas: { width: 800, height: 600 },
    
    colors: {
        background, guide, collectible, obstacle, goal
    },
    
    lightColors: [
        { name: 'Warm White', color: '#fff8e7', glow: '#ffd89b' },
        { name: 'Soft Yellow', color: '#ffe680', glow: '#ffd700' },
        // ... 4 more colors
    ],
    
    player: {
        size: 30,
        speed: 3,
        trailLength: 12
    },
    
    guide: { size, color, glowColor },
    collectible: { size, color, glowColor },
    
    dialogue: {
        namePrompt: "...",
        tutorial: ["...", "...", "..."],
        level1Start: "...",
        level1Complete: "...",
        // ... through level 3
        transition: "...",
        valentine: "..."     // ← The big reveal!
    },
    
    levels: [
        {
            name: "Awakening Grove",
            playerStart: { x, y },
            guidePosition: { x, y },
            collectibles: [{ x, y }, ...],
            obstacles: []
        },
        // ... 2 more levels
    ]
};
```

**When to edit:** To change dialogue, level layouts, colors, or game settings

---

#### `js/utils.js` - The Helpers
**Purpose:** Reusable utility functions  
**Size:** ~90 lines  
**Contains:**
- Collision detection (rectangle and circle)
- UI show/hide helpers
- Math utilities (clamp, lerp)
- Drawing helpers (rounded rectangles, glows)

**Key Functions:**
```javascript
checkCollision(rect1, rect2)         // Rectangle collision
checkCircleCollision(circle1, circle2) // Circle collision
clamp(value, min, max)                // Constrain value
lerp(start, end, amount)              // Linear interpolation
showUI(elementId)                     // Show UI element
hideUI(elementId)                     // Hide UI element
hideAllScreens()                      // Hide all screen UIs
roundRect(ctx, x, y, w, h, radius)   // Draw rounded rect
drawGlow(ctx, x, y, radius, color)   // Draw glow effect
```

**When to edit:** To add new utility functions

---

#### `js/entities.js` - The Characters
**Purpose:** Classes for all game objects  
**Size:** ~600 lines  
**Contains:**
- `Player` class - the light character (controllable)
- `Guide` class - the companion egg character
- `Collectible` class - glowing orbs to collect
- `Obstacle` class - barriers that block movement

**Player Class** (Light Character):
```javascript
constructor(x, y, lightColor)
    // Properties: position, size, speed, lightColor
    // Physics: velocityX/Y, acceleration, deceleration
    // Animation: time, idleTime, trail array
    // Input: keys object (up, down, left, right)

setLightColor(colorData)
    // Update light color

update(obstacles)
    // Physics-based movement with smooth acceleration/deceleration
    // Collision detection with obstacles
    // Trail particle generation
    // Idle floating animation when stationary

getDisplayPosition()
    // Calculate position with idle animation offset

draw(ctx)
    // Multi-layered glow effects
    // Core light with color
    // Bright center highlight
    // Trail particles
    // Floating particles around light
    // Shadow underneath

drawTrail(ctx)
    // Draw fading trail particles

drawGlowLayers(ctx, pulse, x, y)
    // Multiple glow layers for depth

drawParticles(ctx, pulse, x, y)
    // Floating particles orbiting the light
```

**Guide Class** (Lazy Egg Character):
```javascript
constructor(x, y)
    // Position, size, animation time

update()
    // Idle animation (gentle bob and sway)

draw(ctx, holdingHeart = false)
    // Egg white base layer
    // Yolk body (Gudetama yellow)
    // Yolk showing on top
    // Lazy/unimpressed eyes (slanted lines)
    // Small mouth opening upward
    // Tiny droopy arms
    // Tiny legs (sitting pose)
    // Optional heart (for valentine screen)
    // Subtle sparkles

drawHeart(ctx, x, y)
    // Heart shape using bezier curves
```

**Collectible Class** (Glowing Orbs):
```javascript
constructor(x, y)
    // Position, size, color, collected state

update()
    // Pulse animation

draw(ctx)
    // Glow effect
    // Orb with scaling pulse
    // Shine highlight

checkCollection(player)
    // Distance-based collision with player
```

**Obstacle Class** (Static Barriers):
```javascript
constructor(x, y, width, height)
    // Position and dimensions

draw(ctx)
    // Shadow layer
    // Rounded rectangle body
    // Highlight on top third
```

**When to edit:** To change how characters look or behave, or to replace with images

---

### Screen Modules (js/screens/)

Each screen is a self-contained module that handles one part of the game.

#### `titleScreen.js` - Welcome Screen
**Size:** ~270 lines  
**Shows:** Game title, forest background, fireflies, start button  
**Features:**
- Animated fireflies floating around
- Detailed forest background with hills, trees, grass, flowers
- Guide character in bottom-left
- Animated grass blades swaying

**Key Methods:**
```javascript
constructor(game)
    // Initialize guide, fireflies, grass blades

enter()
    // Show title UI, setup start button

update()
    // Update guide and fireflies animation

draw(ctx)
    // Forest background (gradient, hills, trees, ground, flowers)
    // Fireflies with glow
    // Guide character
    // Sparkles

drawForestBackground(ctx)
    // Gradient sky
    // Rolling hills (2 layers)
    // Trees with layered foliage
    // Grass with wavy blades
    // Flowers on ground

drawFireflies(ctx)
    // Glowing particles with fade
```

**Transitions to:** Name Input screen

---

#### `nameInputScreen.js` - Optional Name
**Size:** ~100 lines  
**Shows:** Guide character, name input field, continue button  
**Features:**
- Text input with enter key support
- Can be skipped (empty name is OK)

**Key Methods:**
```javascript
enter()
    // Show name input UI, focus input field

saveName()
    // Store player name in game state
    // Proceed to tutorial

update()
    // Update guide animation

draw(ctx)
    // Gentle gradient background
    // Decorative circles
    // Guide character
    // Sparkles
```

**Transitions to:** Tutorial screen

---

#### `tutorialScreen.js` - Controls Explanation
**Size:** ~120 lines  
**Shows:** Guide character, dialogue bubble, controls visualization  
**Features:**
- Multi-step dialogue (4 messages)
- Click anywhere to progress
- Arrow keys visualization

**Key Methods:**
```javascript
enter()
    // Show tutorial UI, reset dialogue index

setupDialogueClick()
    // Make entire screen clickable

showDialogue()
    // Display current dialogue with personalization

nextDialogue()
    // Progress to next message or color selection

update()
    // Update guide animation

draw(ctx)
    // Background with decorative elements
    // Guide character
    // Control keys visualization (arrow keys + WASD)

drawControlsExample(ctx)
    // Draw keyboard keys at bottom
```

**Transitions to:** Color Selection screen

---

#### `colorSelectionScreen.js` - Choose Light Color
**Size:** ~260 lines  
**Shows:** Color grid, preview light, guide character, confirm button  
**Features:**
- 6 light colors to choose from
- Live preview of selected color
- Grid layout with hover effects

**Key Methods:**
```javascript
enter()
    // Show color selection UI
    // Set default selection
    // Setup color buttons

setupColorButtons()
    // Dynamically create color option buttons
    // Add click handlers

selectColor(index)
    // Update selected color
    // Update preview
    // Highlight button

updatePreview()
    // Create preview light with selected color

confirmColor()
    // Store color in game state
    // Proceed to first level

draw(ctx)
    // Gentle gradient background
    // Preview light with animations
    // Guide character
    // Sparkles

drawPreviewLight(ctx)
    // Multi-layer glow effects
    // Pulsing core light
    // Orbiting particles
```

**Transitions to:** Level 1

---

#### `levelScreen.js` - Main Gameplay
**Size:** ~720 lines  
**Shows:** Player, guide, collectibles, obstacles, HUD, dialogue  
**Features:**
- 3 distinct levels with unique backgrounds
- Collision detection
- Collectible gathering
- Progress tracking
- Dialogue system with smart positioning

**Key Methods:**
```javascript
enter(levelIndex)
    // Load level data
    // Show level UI
    // Setup dialogue

loadLevel(levelIndex)
    // Create player with selected color
    // Create guide
    // Create collectibles and obstacles

update()
    // Update all entities
    // Check collectible collection
    // Handle dialogue timing
    // Check level completion

draw(ctx)
    // Level-specific background
    // Obstacles
    // Collectibles
    // Guide
    // Player
    // Ambient effects

updateUI()
    // Update HUD (level name, collectible count)
    // Position and show dialogue bubble

positionDialogueNearGuide()
    // Smart positioning based on guide location
    // Apply appropriate tail direction class

dismissDialogue()
    // Fade out and hide dialogue

handleLevelComplete()
    // Show completion UI
    // Update dialogue

proceedToNext()
    // Go to next level or transition screen
```

**Background Methods:**
```javascript
drawAwakeningGroveBackground(ctx)
    // Level 1: Sunny forest
    // Sky gradient
    // Distant trees
    // Ground with flowers and grass

drawWhisperingWoodsBackground(ctx)
    // Level 2: Mystical forest
    // Darker gradient
    // Light rays filtering through
    // Mushrooms and ferns

drawHeartwoodHavenBackground(ctx)
    // Level 3: Romantic forest
    // Pink/purple gradient
    // Heart-shaped elements
    // Rose bushes
    // Floating petals

drawAmbiance(ctx)
    // Floating sparkle particles
```

**Transitions to:** 
- Level Complete UI (internal)
- Next Level (1→2, 2→3)
- Transition Screen (after level 3)

---

#### `transitionScreen.js` - The Setup
**Size:** ~70 lines  
**Shows:** Guide with enhanced glow, transition message  
**Features:**
- 3-second duration
- Magical sparkle effects
- Fade-in effect
- "One last thing..." message

**Key Methods:**
```javascript
enter()
    // Show transition UI
    // Reset timer
    // Update personalized message

update()
    // Increment timer
    // Auto-transition after 180 frames (3 seconds)

draw(ctx)
    // Dark faded background
    // Guide with extra glow
    // Orbiting sparkles

drawSparkles(ctx, alpha)
    // Circular sparkle burst around guide
```

**Transitions to:** Valentine screen

---

#### `valentineScreen.js` - The Reveal! 💖
**Size:** ~150 lines  
**Shows:** Valentine question, two Yes buttons, guide holding heart  
**Features:**
- "Will you be my Valentine?" message (personalized)
- Two identically-labeled Yes buttons
- Celebration animation on button click
- Floating hearts
- Pulsing effects

**Key Methods:**
```javascript
constructor(game)
    // Setup both Yes button event listeners

enter()
    // Show valentine UI
    // Update personalized question

celebrate()
    // Trigger celebration animation
    // Show celebration overlay
    // Create floating hearts

createHearts()
    // Spawn 30 animated heart emojis
    // Variety of hearts and sparkles

update()
    // Update guide animation
    // Track celebration timer

draw(ctx)
    // Romantic gradient background
    // Floating hearts in background
    // Guide holding a heart
    // Optional celebration effects

drawBackgroundHearts(ctx)
    // Animated hearts floating around

drawHeart(ctx, x, y, size, color)
    // Heart shape using bezier curves

drawCelebrationEffects(ctx)
    // Pulsing glow
    // Sparkle burst expanding outward
```

**This is the emotional payoff!**

---

## Code Flow Diagram

```
main.js
   ↓
   Creates Game instance (game.js)
   ↓
   game.start()
   ↓
   game.changeScreen('title')
   ↓
   game.gameLoop() [60 FPS]
       │
       ├─→ update()
       │    └─→ currentScreen.update()
       │
       └─→ draw()
            └─→ currentScreen.draw(ctx)
   
   Screen Flow:
   titleScreen → nameInputScreen → tutorialScreen → colorSelectionScreen
        ↓
   levelScreen(0) → levelScreen(1) → levelScreen(2)
        ↓
   transitionScreen → valentineScreen
```

## Data Flow

### Level Loading Process
```
1. game.changeScreen('level', levelIndex)
2. levelScreen.enter(levelIndex)
3. levelScreen.loadLevel(levelIndex)
4. Read CONFIG.levels[levelIndex]
5. Create Player at playerStart with selected lightColor
6. Create Guide at guidePosition
7. Create Collectibles from collectibles array
8. Create Obstacles from obstacles array
9. Show level UI with personalized dialogue
```

### Input Handling
```
1. User presses key
2. game.handleKeyDown(event)
3. Check if current screen is levelScreen
4. Update player.keys object (up/down/left/right = true)
5. player.update() reads keys each frame
6. Calculate target velocity based on keys
7. Apply acceleration/deceleration
8. Check collision with obstacles
9. Update position if no collision
10. Generate trail particles if moving
```

### Collision Detection
```
Player Movement:
1. Calculate new position (newX, newY)
2. For each obstacle:
   - Convert player circle to bounding rectangle
   - Check Utils.checkCollision(playerRect, obstacle)
   - If collision: don't move, bounce back
3. If no collision: update player position

Collectible Collection:
1. For each collectible:
   - Calculate distance to player
   - If distance < (collectible.size + player.size/2):
       - Mark collectible as collected
       - Update UI
       - Check if all collected → level complete
```

### Dialogue System
```
1. Level loads with showingDialogue = true
2. Dialogue bubble positioned near guide:
   - If guide on right → bubble on left (tail right)
   - If guide on left → bubble on right (tail left)
   - If guide in middle → bubble above or side (tail bottom/left)
3. User clicks anywhere on dialogue bubble
4. dismissDialogue() called
5. Fade out over 15 frames
6. Hide bubble, player can move freely
```

## Screen Lifecycle Pattern

Every screen follows this pattern:

```javascript
class ScreenName {
    constructor(game) {
        this.game = game;
        // Initialize entities, state
        // Setup one-time event listeners
    }
    
    enter(data) {
        // Called when entering this screen
        // Hide all other UIs
        // Show this screen's UI
        // Reset screen state
        // Load data if needed
    }
    
    update() {
        // Called every frame (60 times/second)
        // Update entity animations
        // Check conditions (level complete, timer, etc.)
        // Progress logic
    }
    
    draw(ctx) {
        // Called every frame
        // Clear canvas
        // Draw background
        // Draw entities (obstacles, collectibles, guide, player)
        // Draw effects (sparkles, glows, ambiance)
    }
}
```

## Key Design Patterns

### 1. Screen-Based State Management
- Each screen is independent and self-contained
- Screens don't know about each other
- Game manager handles transitions
- Clean separation of concerns

### 2. Configuration Separation
- All content (dialogue, levels, colors) in `config.js`
- Code logic separate from data
- Easy to customize without touching code

### 3. Entity-Component System
- Each game object is a class
- All have `update()` and `draw()` methods
- Consistent interface makes code predictable

### 4. Physics-Based Movement
- Acceleration and deceleration for smooth feel
- Momentum system (not instant stop/start)
- Idle floating when stationary
- Movement-based visual effects

### 5. UI Overlay Approach
- Canvas for game graphics
- HTML/CSS for UI elements (buttons, dialogue, HUD)
- Best of both worlds

### 6. Event-Driven Architecture
- Button clicks trigger screen transitions
- Keeps code modular and decoupled

---

## Adding Features

### Want to add a new level?

1. Open `js/config.js`
2. Add to `CONFIG.levels` array:
```javascript
{
    name: "Your Level Name",
    playerStart: { x: 100, y: 300 },
    guidePosition: { x: 700, y: 100 },
    collectibles: [
        { x: 200, y: 150 },
        // ... more positions
    ],
    obstacles: [
        { x: 250, y: 200, width: 100, height: 20 }
        // ... more obstacles
    ]
}
```
3. Add dialogue in `CONFIG.dialogue`:
```javascript
level4Start: "Your start dialogue{name}",
level4Complete: "Your completion message{name}",
```
4. Add background method in `levelScreen.js`:
```javascript
drawYourLevelBackground(ctx) {
    // Custom background drawing code
}
```
5. Update `draw()` in `levelScreen.js` to call new background method

### Want to add a new screen?

1. Create `js/screens/newScreen.js`
2. Follow the screen pattern:
```javascript
class NewScreen {
    constructor(game) { }
    enter(data) { }
    update() { }
    draw(ctx) { }
}
```
3. Add to `game.js` screens object:
```javascript
this.screens = {
    // ... existing screens
    newScreen: new NewScreen(this)
};
```
4. Add UI elements to `index.html`
5. Add styles to `styles.css`
6. Transition with `game.changeScreen('newScreen')`

### Want to customize the guide character?

1. Open `js/entities.js`
2. Find `Guide` class → `draw()` method
3. Modify drawing code or replace with image loading:
```javascript
draw(ctx) {
    const img = new Image();
    img.src = 'assets/guide.png';
    ctx.drawImage(img, this.x - size, this.y - size, size*2, size*2);
}
```

---

## Performance Considerations

- Game runs at 60 FPS
- Canvas clears and redraws every frame
- Particle systems are limited (trail, sparkles)
- Collision checks only happen during level screen
- No garbage collection issues (reuse objects)

## Best Practices Used

- **Const for CONFIG** - Prevents accidental modification
- **Arrow functions** - Clean, concise syntax
- **Template literals** - Easy string interpolation
- **Destructuring** - Clean object access
- **Default parameters** - Fallback values
- **Class syntax** - Clear OOP structure
- **Comments** - Explain "why" not "what"

---

This structure keeps the code organized, modular, and easy to customize! 🌲

**Quick Reference:**
- **Customize content:** `config.js`
- **Modify characters:** `entities.js`
- **Change screens:** `screens/*.js`
- **Style UI:** `styles.css`
- **Add features:** Follow existing patterns