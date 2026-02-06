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
    ├── 👤 entities.js            # Player, Guide, Collectibles, Obstacles, BlackLight
    │
    └── 📁 screens/               # Screen modules
        ├── 🏠 titleScreen.js     # Title screen with forest scene
        ├── ✏️  nameInputScreen.js # Optional name input
        ├── 📚 tutorialScreen.js  # Tutorial explaining controls
        ├── 🎨 colorSelectionScreen.js # Choose light color
        ├── 🎯 levelScreen.js     # Main gameplay (6 levels)
        ├── ✨ transitionScreen.js # Transition before Valentine
        └── 💖 valentineScreen.js # Valentine reveal screen
```

## What Each File Does

### Core Files

#### `index.html` - The Foundation
**Purpose:** HTML structure, UI overlay elements  
**Contains:**
- Canvas element for game rendering
- Full-screen pulse overlay (for collectible feedback)
- UI overlays for each screen:
  - Title UI (game title, start button)
  - Name Input UI (optional text input)
  - Tutorial UI (dialogue bubble)
  - Color Selection UI (color picker grid with 6 options)
  - Level UI (HUD, dialogue bubble)
  - Level Complete UI (completion message)
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
- Color selection grid with preview animations
- Celebration animation (floating hearts)
- **Pulse overlay animations** (different colors for each light type)
- Responsive design breakpoints

**Key Features:**
- Chat bubbles with directional tails (guide-bottom, guide-left, guide-right)
- Smooth fade transitions between screens
- Heartbeat animation for valentine screen
- Floating hearts keyframe animation
- Full-screen pulse effects when collecting orbs

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
- Console logging for debugging

**Code Flow:**
```
Page loads → main.js runs → Creates Game instance → Starts game loop
```

**When to edit:** Rarely. Only if changing initialization behavior.

---

#### `js/game.js` - The Director
**Purpose:** Central game manager and state controller  
**Size:** ~180 lines  
**Contains:**
- Screen management (switching between screens)
- Input handling (keyboard controls: Arrow keys & WASD)
- Game loop (update/draw cycle at 60 FPS)
- Game state tracking (player name, light color, completed levels)
- Dialogue personalization system

**Key Methods:**
```javascript
setupInput()                    // Keyboard event listeners
handleKeyDown(e)                // Process key presses (Arrow/WASD)
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

**Input System:**
- Supports both Arrow keys AND WASD
- Keys tracked in player.keys object
- Physics-based movement with momentum

**When to edit:** To add new screens or change input controls

---

#### `js/config.js` - ⭐ The Control Panel
**Purpose:** All customizable content in ONE place  
**Size:** ~300 lines  
**Contains:**
- Canvas dimensions (800x600)
- Color settings for all game elements
- **Light color options** (6 customizable colors with glow effects)
- Player settings (size, speed, trail length)
- Guide character settings (Totoro-inspired)
- Collectible settings
- **ALL DIALOGUE** (tutorial, 6 levels, transition, valentine)
- **ALL 6 LEVEL LAYOUTS** (positions, obstacles, Black Light settings)

**This is the MAIN file you'll edit!**

**Structure:**
```javascript
const CONFIG = {
    canvas: { width: 800, height: 600 },
    
    colors: {
        background, player, guide, collectible, obstacle, goal
    },
    
    lightColors: [
        { name: 'Warm White', color: '#fff8e7', glow: '#ffd89b' },
        { name: 'Soft Yellow', color: '#ffe680', glow: '#ffd700' },
        { name: 'Sky Blue', color: '#87ceeb', glow: '#4da6ff' },
        { name: 'Lavender', color: '#e6b3ff', glow: '#cc99ff' },
        { name: 'Peach', color: '#ffcc99', glow: '#ffb366' },
        { name: 'Mint Green', color: '#98fb98', glow: '#7fb69e' }
    ],
    
    player: {
        size: 30,
        speed: 3,          // Movement speed (increased for responsiveness)
        trailLength: 12    // Number of trail particles
    },
    
    guide: {
        size: 50,          // Larger for Totoro-inspired character
        color: '#c9b896', // Warm grey-beige
        glowColor: 'rgba(255, 215, 155, 0.3)'
    },
    
    collectible: {
        size: 20,
        color: '#ffb3ba',
        glowColor: 'rgba(255, 179, 186, 0.6)'
    },
    
    dialogue: {
        namePrompt: "Before we begin, what should I call you?",
        
        tutorial: [
            "Welcome{name}! I'm Lumis, your forest guide.",
            "Use arrow keys or WASD to move around.",
            "Collect the glowing orbs to restore the forest's magic!",
            "Let's begin this cozy adventure together."
        ],
        
        // Levels 1-3: Peaceful collection
        level1Start: "The forest whispers to those who listen{name}...",
        level1Complete: "You did wonderfully{name}! The forest is starting to glow again.",
        
        level2Start: "The magic grows stronger{name}. Can you feel it in the air?",
        level2Complete: "Your kindness brings warmth to these woods{name}. Keep going!",
        
        level3Start: "This is the final gathering{name}. Take your time and enjoy the peace.",
        level3Complete: "The forest is whole again, thanks to you{name}. You have a special heart.",
        
        // Levels 4-6: Black Light chase mechanic
        level4Start: "Wait{name}... something feels wrong. That darkness... it isn't like you.",
        level4Complete: "You made it through{name}. But I fear this is only the beginning.",
        
        level5Start: "The shadow grows bolder{name}. If it touches you, everything will fade.",
        level5Complete: "Your light persists{name}. Stay strong, we're almost there.",
        
        level6Start: "This is the final test{name}. Don't let the darkness claim you.",
        level6Complete: "You've proven your light cannot be extinguished{name}. The forest is safe.",
        
        transition: "One last thing{name}...",
        valentine: "Will you be my Valentine{name}?"
    },
    
    levels: [
        // LEVEL 1 - Easy introduction (no obstacles, no threats)
        {
            name: "Awakening Grove",
            playerStart: { x: 100, y: 300 },
            guidePosition: { x: 700, y: 100 },
            collectibles: [ /* 5 orbs */ ],
            obstacles: []
        },
        
        // LEVEL 2 - Medium difficulty (obstacles introduced)
        {
            name: "Whispering Woods",
            playerStart: { x: 100, y: 500 },
            guidePosition: { x: 700, y: 300 },
            collectibles: [ /* 6 orbs */ ],
            obstacles: [ /* 3 barriers */ ]
        },
        
        // LEVEL 3 - Easy and calm (heart-shaped collectibles)
        {
            name: "Heartwood Haven",
            playerStart: { x: 400, y: 500 },
            guidePosition: { x: 400, y: 100 },
            collectibles: [ /* 5 orbs in heart pattern */ ],
            obstacles: []
        },
        
        // LEVEL 4 - Black Light introduction (slow chase)
        {
            name: "Fading Grove",
            playerStart: { x: 100, y: 300 },
            guidePosition: { x: 700, y: 100 },
            blackLightStart: { x: 700, y: 500 },
            blackLightSpeed: 1.8,
            collectibles: [ /* 4 orbs */ ],
            obstacles: [ /* 1 simple obstacle */ ]
        },
        
        // LEVEL 5 - Increased difficulty (faster Black Light)
        {
            name: "Eclipse Path",
            playerStart: { x: 100, y: 100 },
            guidePosition: { x: 700, y: 100 },
            blackLightStart: { x: 600, y: 400 },
            blackLightSpeed: 2.3,
            collectibles: [ /* 5 orbs */ ],
            obstacles: [ /* 4 obstacles creating maze */ ]
        },
        
        // LEVEL 6 - Final challenge (dramatic center spawn)
        {
            name: "Last Light Clearing",
            playerStart: { x: 400, y: 500 },
            guidePosition: { x: 400, y: 100 },
            blackLightStart: { x: 400, y: 300 },
            blackLightSpeed: 2.5,
            collectibles: [ /* 6 orbs around perimeter */ ],
            obstacles: [ /* 4 obstacles providing safe zones */ ]
        }
    ]
};
```

**When to edit:** To change dialogue, level layouts, colors, or game settings

---

#### `js/utils.js` - The Helpers
**Purpose:** Reusable utility functions  
**Size:** ~120 lines  
**Contains:**
- Collision detection (rectangle and circle)
- UI show/hide helpers
- Math utilities (clamp, lerp)
- Drawing helpers (rounded rectangles, glows)
- **Pulse effect trigger** (full-screen feedback on collection)

**Key Functions:**
```javascript
checkCollision(rect1, rect2)              // Rectangle collision
checkCircleCollision(circle1, circle2)    // Circle collision
clamp(value, min, max)                    // Constrain value
lerp(start, end, amount)                  // Linear interpolation
showUI(elementId)                         // Show UI element
hideUI(elementId)                         // Hide UI element
hideAllScreens()                          // Hide all screen UIs
roundRect(ctx, x, y, w, h, radius)       // Draw rounded rect
drawGlow(ctx, x, y, radius, color)       // Draw glow effect
triggerCollectionPulse(lightColor)       // Trigger full-screen pulse
```

**Pulse Effect:**
- Matches player's selected light color
- Full-screen overlay animation
- Color-specific CSS classes (pulse-warm, pulse-golden, etc.)

**When to edit:** To add new utility functions

---

#### `js/entities.js` - The Characters
**Purpose:** Classes for all game objects  
**Size:** ~800+ lines  
**Contains:**
- `Player` class - the light character (controllable)
- `Guide` class - the companion Totoro-inspired character
- `Collectible` class - glowing orbs to collect
- `Obstacle` class - barriers that block movement
- **`BlackLight` class** - antagonist that chases the player (Levels 4-6)

---

### Entity Classes in Detail

#### **Player Class** (Light Character)
The player is a glowing orb of light with physics-based movement.

```javascript
constructor(x, y, lightColor)
    // Properties
    this.x, this.y                  // Position
    this.size = CONFIG.player.size   // Size (30px)
    this.lightColor = lightColor     // Selected color object
    
    // Physics
    this.velocityX = 0
    this.velocityY = 0
    this.acceleration = 0.4
    this.deceleration = 0.92
    this.maxSpeed = CONFIG.player.speed
    
    // Animation
    this.time = 0
    this.idleTime = 0
    this.trail = []                  // Trail particles
    
    // Input
    this.keys = { up, down, left, right }

update(obstacles, blackLight = null)
    // Handle keyboard input (WASD/Arrow keys)
    // Calculate target velocity
    // Apply acceleration/deceleration
    // Check collision with obstacles
    // Check collision with Black Light (game over)
    // Update trail particles
    // Idle floating animation when stationary

draw(ctx)
    // Multi-layered glow effects (4 layers)
    // Core light with selected color
    // Bright center highlight
    // Trail particles with fade
    // Floating particles orbiting the light
    // Shadow underneath for depth
```

**Key Features:**
- Smooth momentum-based movement
- Customizable color from 6 options
- Particle trail follows movement
- Idle floating animation when still
- Collision detection with obstacles
- Game over on Black Light contact

---

#### **Guide Class** (Totoro-Inspired Companion)
A cozy, lazy egg character that provides encouragement.

```javascript
constructor(x, y)
    this.x, this.y
    this.size = CONFIG.guide.size
    this.time = 0

update()
    // Gentle bob and sway animation
    this.time += 0.05

draw(ctx, holdingHeart = false)
    // Egg white base layer (rounded bottom)
    // Yolk body (Gudetama-inspired yellow)
    // Yolk showing on top
    // Lazy/unimpressed eyes (slanted lines)
    // Small upward-curved mouth
    // Tiny droopy arms (stubs)
    // Tiny legs in sitting pose
    // Optional heart (valentine screen)
    // Subtle ambient sparkles
```

**Visual Style:**
- Round, egg-shaped body
- Lazy/content expression
- Warm beige/yellow colors
- Gentle idle animation
- Can hold a heart on final screen

---

#### **Collectible Class** (Glowing Orbs)
Magical orbs that restore the forest's light.

```javascript
constructor(x, y)
    this.x, this.y
    this.size = CONFIG.collectible.size
    this.color = CONFIG.collectible.color
    this.glowColor = CONFIG.collectible.glowColor
    this.collected = false
    this.time = 0

update()
    // Pulse animation
    this.time += 0.08

draw(ctx)
    // Outer glow (pulsing)
    // Main orb body
    // Bright center
    // Rotating particles around orb
    // Sparkle effects
```

**Features:**
- Pulsing animation
- Multi-layer glow
- Particle orbit
- Triggers full-screen pulse on collection

---

#### **Obstacle Class** (Barriers)
Static objects that block player movement.

```javascript
constructor(x, y, width, height)
    // Rectangle properties
    this.x, this.y, this.width, this.height

draw(ctx)
    // Dark barrier with texture
    // Shadow for depth
    // Highlight edge
```

---

#### **BlackLight Class** ⚫ (NEW - The Antagonist)
A dark entity that chases the player in levels 4-6.

```javascript
constructor(x, y, speed)
    this.x, this.y
    this.speed = speed          // Chase speed (varies by level)
    this.size = 40
    this.time = 0

update(playerX, playerY, obstacles)
    // Calculate angle to player
    // Move toward player at set speed
    // Navigate around obstacles (simple AI)
    // Avoid getting stuck
    this.time += 0.05

draw(ctx)
    // Dark void core (deepest black)
    // Purple/red menacing glow layers
    // Distortion effect (warping space)
    // Dark particles swirling inward
    // Pulsing animation
    // Trailing darkness effect
```

**AI Behavior:**
- Always moves toward player
- Simple obstacle avoidance
- Speed increases in later levels:
  - Level 4: 1.8 (slow, introduction)
  - Level 5: 2.3 (medium threat)
  - Level 6: 2.5 (high tension)

**Visual Design:**
- Dark void appearance (contrast to player's light)
- Menacing purple/red glow
- Distortion effect around it
- Particles pulled inward (opposite of player)
- Creates sense of danger

**Collision:**
- If Black Light touches player → Game Over
- Player must collect all orbs while avoiding
- Creates urgency and challenge

---

### Screen Classes

#### `js/screens/titleScreen.js` - Title Screen
**Purpose:** Initial welcome screen  
**Size:** ~280 lines  
**Features:**
- Animated forest background
  - Layered hills with gradient
  - Trees with proper foliage
  - Wavy grass blades (animated)
  - Flowers on ground
- Fireflies floating around (15 fireflies)
- Guide character in bottom-left
- Ambient sparkles
- "Start Game" button

**When to edit:** To change title screen visuals or add features

---

#### `js/screens/nameInputScreen.js` - Name Input
**Purpose:** Optional player name collection  
**Size:** ~120 lines  
**Features:**
- Text input field
- "Continue" button
- Enter key support
- Skip option (name is optional)
- Personalizes all dialogue with {name} placeholder

**Flow:**
```
User enters name (or skips) → Stored in game.state.playerName → Tutorial
```

---

#### `js/screens/tutorialScreen.js` - Tutorial
**Purpose:** Explain controls and objectives  
**Size:** ~180 lines  
**Features:**
- Sequential dialogue (4 messages)
- Click to advance
- Enter key support
- Visual keyboard display (Arrow keys/WASD)
- Guide character with idle animation

**Dialogue Sequence:**
1. Welcome message
2. Control explanation
3. Objective (collect orbs)
4. Encouragement to begin

**Controls Display:**
- Arrow key graphics
- "or WASD" text
- Visual demonstration

---

#### `js/screens/colorSelectionScreen.js` - Color Selection
**Purpose:** Choose light character color  
**Size:** ~250 lines  
**Features:**
- Grid of 6 color options
- Live preview of selected light
- Animated preview at top of screen
- Click to select color
- Confirm button
- Enter key support
- Cleanup handlers to prevent issues

**Color Options:**
1. Warm White (classic, gentle)
2. Soft Yellow (cheerful, golden)
3. Sky Blue (cool, calming)
4. Lavender (mystical, dreamy)
5. Peach (warm, cozy)
6. Mint Green (fresh, natural)

**Visual Feedback:**
- Preview light animates at top
- Selected button highlighted
- Glow effects match chosen color

---

#### `js/screens/levelScreen.js` - Main Gameplay
**Purpose:** Core game loop for all 6 levels  
**Size:** ~900+ lines  
**Features:**
- Player movement (keyboard input)
- Collectible gathering
- Obstacle collision
- **Black Light chase (Levels 4-6)**
- Level-specific backgrounds
- Dialogue system
- HUD (level name, objective count)
- Level complete detection
- Game over handling (Black Light contact)

**Level Backgrounds:**
1. **Awakening Grove** - Sunny forest, warm tones
2. **Whispering Woods** - Mystical forest, light rays, mushrooms
3. **Heartwood Haven** - Romantic pink sky, heart motifs
4. **Fading Grove** - Darker tones, ominous atmosphere
5. **Eclipse Path** - Shadowy, tense environment
6. **Last Light Clearing** - Dramatic final battleground

**Game Loop:**
```javascript
update()
    // Update player
    // Update collectibles
    // Update Black Light (if present)
    // Check collisions
    // Check if all collected → level complete
    // Check if Black Light caught player → game over

draw(ctx)
    // Draw level-specific background
    // Draw obstacles
    // Draw collectibles (uncollected only)
    // Draw Black Light (if present)
    // Draw player
    // Draw guide
    // Draw effects (sparkles, etc.)
```

**Dialogue System:**
- Shows start dialogue when level loads
- Click bubble to dismiss
- Fade-out animation
- Positioned relative to guide

**Level Complete:**
- Fade-to-white transition
- Completion message
- Click or Enter to continue
- Proceeds to next level or transition screen

**Game Over (Black Light):**
- Screen shake effect
- Fade-to-black
- "Game Over" message with restart option
- Only in Levels 4-6

---

#### `js/screens/transitionScreen.js` - Transition
**Purpose:** Brief pause before Valentine reveal  
**Size:** ~90 lines  
**Features:**
- 3-second auto-advance
- Dark background with fade
- Guide with extra glow
- Magical sparkle effects
- Personalized transition message

**Timing:**
- Fades in over 1 second
- Holds for 2 seconds
- Auto-transitions to Valentine screen

---

#### `js/screens/valentineScreen.js` - Valentine Reveal
**Purpose:** The emotional payoff - Valentine's message  
**Size:** ~200 lines  
**Features:**
- Romantic gradient background
- Floating animated hearts
- Guide holding a heart
- Two "Yes" buttons (both lead to celebration)
- Celebration animation:
  - Full celebration overlay
  - 30 floating heart emojis
  - Pulsing glow effects
  - Sparkle burst

**The Big Reveal:**
```
"Will you be my Valentine{name}?"
```

**Buttons:**
- "Yes! 💖"
- "Of course! 💕"

(Both lead to celebration - no "No" option!)

**Celebration:**
- Overlay with "🎉 Yay! 🎉"
- "Thank you for being my Valentine! 💖"
- Hearts float up continuously
- Variety: 💖 💕 💗 💓 💝 🧸 ✨ 🌸

---

## Complete Game Flow

```
1. Title Screen
   ↓ [Click "Start Game"]
   
2. Name Input Screen
   ↓ [Enter name or skip]
   
3. Tutorial Screen
   ↓ [Click through 4 dialogue messages]
   
4. Color Selection Screen
   ↓ [Choose light color from 6 options]
   
5. Level 1: Awakening Grove (Easy, peaceful)
   ↓ [Collect 5 orbs, no threats]
   
6. Level 2: Whispering Woods (Medium, obstacles)
   ↓ [Collect 6 orbs, navigate barriers]
   
7. Level 3: Heartwood Haven (Easy, romantic)
   ↓ [Collect 5 orbs in heart pattern]
   
8. Level 4: Fading Grove (BLACK LIGHT INTRODUCED)
   ↓ [Collect 4 orbs, avoid slow Black Light]
   
9. Level 5: Eclipse Path (INCREASED DIFFICULTY)
   ↓ [Collect 5 orbs, avoid faster Black Light]
   
10. Level 6: Last Light Clearing (FINAL CHALLENGE)
    ↓ [Collect 6 orbs, avoid fast Black Light]
    
11. Transition Screen
    ↓ [Auto-advance after 3 seconds]
    
12. Valentine Screen
    ↓ [Click "Yes!" button]
    
13. Celebration!
    💖 The End 💖
```

---

## Key Game Mechanics

### Movement System
- **Input:** Arrow keys OR WASD
- **Physics:** Momentum-based (not instant)
- **Acceleration:** 0.4 per frame
- **Deceleration:** 0.92 multiplier (smooth stop)
- **Max Speed:** 3 pixels/frame
- **Idle Animation:** Gentle floating when stationary

### Collision System
```
Player Movement:
1. Calculate new position
2. Check collision with each obstacle
3. If collision detected:
   - Prevent movement in that direction
   - Allow sliding along edges
4. Update position if safe
```

### Collection System
```
Each Frame:
1. For each uncollected collectible:
   - Calculate distance to player
   - If distance < threshold:
       - Mark as collected
       - Trigger pulse effect
       - Update UI count
       - Check if all collected
2. If all collected:
   - Show completion screen
   - Wait for user input
   - Progress to next level
```

### Black Light Chase System (Levels 4-6)
```
Each Frame:
1. Calculate angle from Black Light to player
2. Move Black Light toward player at set speed
3. Simple obstacle avoidance:
   - Check if next position hits obstacle
   - If blocked, try alternate angle
4. Check collision with player:
   - If touching → Game Over
   - Trigger game over sequence
   - Option to restart level
```

**Difficulty Progression:**
- Level 4: Speed 1.8 (gentle introduction)
- Level 5: Speed 2.3 (serious threat)
- Level 6: Speed 2.5 (intense finale)

---

## Technical Details

### Performance
- **Frame Rate:** 60 FPS (requestAnimationFrame)
- **Canvas Size:** 800x600 pixels
- **Particle Limits:**
  - Player trail: 12 particles
  - Fireflies: 15 entities
  - Sparkles: 10-20 depending on screen
- **Collision Checks:** Only during level gameplay
- **No Garbage:** Objects reused, not recreated

### Browser Compatibility
- **Chrome:** ✅ Full support
- **Firefox:** ✅ Full support
- **Safari:** ✅ Full support
- **Edge:** ✅ Full support
- **Mobile:** ⚠️ Requires keyboard (not optimized for touch)

### Dependencies
- **None!** Pure vanilla JavaScript
- **No frameworks** (React, Vue, etc.)
- **No libraries** (jQuery, Three.js, etc.)
- **Just:** HTML5 Canvas API + CSS3

---

## Customization Guide

### Easy Customizations (config.js)

**Change Dialogue:**
```javascript
dialogue: {
    valentine: "Will you be my Valentine{name}?"  // ← Edit this!
}
```

**Add/Remove Collectibles:**
```javascript
levels: [
    {
        collectibles: [
            { x: 200, y: 150 },  // Add more coordinates
            { x: 400, y: 200 }
        ]
    }
]
```

**Adjust Black Light Speed:**
```javascript
{
    name: "Fading Grove",
    blackLightSpeed: 2.0  // Make it faster/slower
}
```

**Change Colors:**
```javascript
lightColors: [
    { 
        name: 'Your Color', 
        color: '#hexcode',  // Main color
        glow: '#hexcode'    // Glow color
    }
]
```

### Medium Customizations (entity classes)

**Modify Player Appearance:**
- Edit `Player.draw()` in `entities.js`
- Change glow layers, colors, effects

**Redesign Guide Character:**
- Edit `Guide.draw()` in `entities.js`
- Currently: Lazy egg (Gudetama-inspired)
- Could replace with image or different design

**Adjust Physics:**
```javascript
// In Player constructor
this.acceleration = 0.4      // Speed of acceleration
this.deceleration = 0.92     // How quickly you stop
this.maxSpeed = 3            // Top speed
```

### Advanced Customizations

**Add New Level:**
1. Add level data to `CONFIG.levels`
2. Add dialogue to `CONFIG.dialogue`
3. Create background method in `levelScreen.js`
4. Update level index handling

**Add New Screen:**
1. Create new file in `screens/`
2. Follow screen class pattern (enter, update, draw)
3. Add to `game.js` screens object
4. Add UI elements to `index.html`
5. Add styles to `styles.css`

**Add New Entity Type:**
1. Create class in `entities.js`
2. Implement update() and draw()
3. Instantiate in level screen
4. Handle in update/draw loops

---

## Code Quality & Best Practices

✅ **Clear Separation of Concerns**
- Data (config.js) separate from logic
- Each screen is self-contained
- Entities are independent

✅ **Consistent Patterns**
- All screens follow same lifecycle
- All entities have update/draw methods
- Naming conventions clear and consistent

✅ **Performance Optimized**
- No unnecessary redraws
- Particle systems limited
- Collision checks only when needed

✅ **User Experience**
- Smooth animations throughout
- Clear feedback on all actions
- Forgiving collision detection
- Progressive difficulty curve

✅ **Maintainable**
- Well-commented code
- Logical file structure
- Easy to find and modify features

---

## Troubleshooting

**Black Light passes through obstacles:**
- Obstacle avoidance is simple
- May need more sophisticated pathfinding
- Solution: Add more obstacles to create clear paths

**Game feels too hard/easy:**
- Adjust `blackLightSpeed` in config
- Add/remove obstacles
- Increase player speed

**Colors look wrong:**
- Check both config.js AND styles.css
- Some colors are in drawing code
- Pulse colors defined in CSS

**Movement feels sluggish:**
- Increase `acceleration` value
- Decrease `deceleration` value (closer to 1.0)
- Increase `maxSpeed`

**Dialogue doesn't show:**
- Check console for errors
- Verify UI element IDs match
- Ensure Utils.showUI is called

---

## Development Roadmap Ideas

**Potential Future Features:**
- Mobile touch controls
- Sound effects and music
- More levels with varied mechanics
- Power-ups (speed boost, shield from Black Light)
- Multiple Black Lights
- Time-based challenges
- Leaderboard for speed runs
- More elaborate backgrounds
- Animated cutscenes
- Multiple endings based on performance

---

**Quick Reference:**
- 🎨 **Customize content:** `config.js`
- 👤 **Modify characters:** `entities.js`
- 🖥️ **Change screens:** `screens/*.js`
- 💅 **Style UI:** `styles.css`
- 🔧 **Add features:** Follow existing patterns

**Current Game Stats:**
- **6 Levels** (3 peaceful, 3 with Black Light)
- **6 Light Colors** to choose from
- **1 Companion** (Totoro-inspired guide)
- **1 Antagonist** (Black Light entity)
- **7 Screens** total
- **~2000 lines** of JavaScript
- **100% Vanilla** (no dependencies!)

Made with 💚 for a special someone 💖