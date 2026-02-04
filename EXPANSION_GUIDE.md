# 🎮 GAME EXPANSION CHANGELOG

## Overview
The game has been transformed from 3 simple levels into **THREE PARTS** with **12 LEVELS TOTAL** and **PROGRESSIVE MECHANICS**.

---

## 📊 New Structure

### Before:
- Title → Tutorial → Level 1 → Level 2 → Level 3 → Transition → Valentine

### After:
```
Title → Tutorial →
    PART 1: DISCOVERY (Levels 1-4) →
    PART 2: CONNECTION (Levels 5-8) →
    PART 3: INTENTION (Levels 9-12) →
    Transition → Valentine
```

---

## 🆕 NEW MECHANICS ADDED

### 1. **Moving Platforms**
- Introduced in Level 3
- Platforms move horizontally or vertically
- Player moves with platform when standing on it
- Used throughout Parts 1 & 2

**Files Modified:**
- `js/entities.js` - Added `MovingPlatform` class
- `js/entities.js` - Updated `Player.update()` to handle platform movement

### 2. **Timed Collectibles**
- Introduced in Level 4
- Orbs disappear after a timer (shown as ring around orb)
- Creates urgency without punishment
- Ring turns red when time is low

**Files Modified:**
- `js/entities.js` - Added `TimedCollectible` class

### 3. **Fog/Darkness**
- Introduced in Level 7
- Map is hidden in fog
- Clear area around player reveals the map
- Adjustable fog radius

**Files Modified:**
- `js/screens/levelScreen.js` - Added `drawFog()` method

### 4. **Keys and Gates**
- Introduced in Level 8
- Collect keys to unlock gates
- Gates fade out when unlocked
- Multiple keys can exist per level

**Files Modified:**
- `js/entities.js` - Added `Key` and `Gate` classes
- `js/screens/levelScreen.js` - Added key collection logic

### 5. **Special Collectibles (Part 3)**
- Hearts, Lanterns, Notes, Stars
- Each has unique appearance
- Not all required to complete level
- Visually distinct from regular orbs

**Files Modified:**
- `js/entities.js` - Added `SpecialCollectible` class

### 6. **Bonus Collectibles**
- Optional collectibles in hard-to-reach places
- Encourage exploration
- Not required for completion

---

## 📝 DIALOGUE PROGRESSION

### Part 1: Discovery (Levels 1-4)
**Tone:** Neutral, encouraging, friendly
**Examples:**
- "Let's see what we can find here."
- "Take your time. There's no rush."
- "You're getting the hang of it!"

### Part 2: Connection (Levels 5-8)
**Tone:** Warm, supportive, subtly emotional
**Examples:**
- "We make a good team, don't we?"
- "I'll stay here if you need me."
- "I like figuring things out together."

### Part 3: Intention (Levels 9-12)
**Tone:** Clearly emotional and personal
**Examples:**
- "I didn't expect to enjoy this so much."
- "Some moments are worth holding onto."
- "There's something I've been wanting to say."

### Transition
**Multi-phase dialogue:**
- Phase 1: "Playing together made me realize something..."
- Phase 2: "I don't just like the game. I like you."
- Then proceeds to Valentine screen

---

## 🎨 VISUAL CHANGES

### Background Gradients by Part
- **Part 1:** Warm cream tones (discovery/comfort)
- **Part 2:** Cool green tones (thoughtful/connection)
- **Part 3:** Soft pink tones (romantic/emotional)

### Particle Effects
- Part 1: 8 golden particles
- Part 2: 10 golden particles  
- Part 3: 15 pink particles (more romantic)

---

## 📁 FILES MODIFIED

### Core Configuration
**`js/config.js`** - COMPLETELY REWRITTEN
- Added `parts` array with 3 parts
- Each part contains 4 levels
- 12 total level definitions
- Extensive dialogue for all levels
- Support for all new mechanics

### Entities
**`js/entities.js`** - EXPANDED
- Added `MovingPlatform` class (60 lines)
- Added `Key` class (70 lines)
- Added `Gate` class (80 lines)
- Added `TimedCollectible` class (30 lines)
- Added `SpecialCollectible` class (150 lines)
- Modified `Player.update()` for platform movement

### Level Screen
**`js/screens/levelScreen.js`** - COMPLETELY REWRITTEN
- Now handles part/level indexing
- Supports all new mechanics
- Fog rendering
- Key/gate logic
- Special collectibles
- Bonus collectibles
- Part completion messages

### Tutorial Screen
**`js/screens/tutorialScreen.js`** - MINOR UPDATE
- Changed level transition to use part/level indexing

### Transition Screen
**`js/screens/transitionScreen.js`** - EXPANDED
- Added multi-phase dialogue
- Two-part emotional build-up before Valentine

---

## 🎯 LEVEL DESIGN BREAKDOWN

### Part 1: Discovery (Learning Basics)

**Level 1 - Morning Meadow**
- Basic collection
- 5 orbs + 1 bonus
- No obstacles
- Gentle introduction

**Level 2 - Sunny Clearing**
- Larger map
- 6 orbs + 1 bonus
- 2 obstacles
- More exploration

**Level 3 - Drifting Brook**
- **NEW:** Moving platform introduced
- 5 orbs + 1 bonus
- Teaches platform mechanics

**Level 4 - Twilight Path**
- **NEW:** Timed collectibles
- 4 regular orbs
- 2 timed orbs
- Light time pressure

### Part 2: Connection (Thoughtful Navigation)

**Level 5 - Forked Trail**
- Path choices
- Two separate routes
- Moving vertical platforms
- Encourages decision-making

**Level 6 - Winding Grove**
- Backtracking design
- Maze-like layout
- No wrong choice, just exploration

**Level 7 - Misty Hollow**
- **NEW:** Fog mechanic introduced
- Limited visibility
- Reveals map as you explore

**Level 8 - Locked Garden**
- **NEW:** Keys and gates
- 2 keys unlock 2 gates
- Order matters
- Puzzle elements

### Part 3: Intention (Emotional Depth)

**Level 9 - Heart's Clearing**
- **NEW:** Hearts instead of orbs
- Only 3 of 5 required
- Optional completion
- More personal tone

**Level 10 - Lantern Path**
- **NEW:** Lanterns
- 4 of 5 required
- Moving platforms return
- Light/warmth theme

**Level 11 - Whispered Words**
- **NEW:** Notes/letters
- 4 of 5 required
- Fog returns
- Personal messages theme

**Level 12 - Starlit Haven**
- **NEW:** Stars
- 5 of 6 required
- No obstacles
- Peaceful final level
- Sets up Valentine reveal

---

## 🎮 GAMEPLAY CHANGES

### Completion Requirements
- **Parts 1 & 2:** All collectibles required (except bonus)
- **Part 3:** Not all required (`requiredCount` property)
- Encourages exploration vs forced collection

### Difficulty Curve
- **Levels 1-2:** Easy, wide open
- **Levels 3-4:** Medium, mechanics introduced
- **Levels 5-6:** Medium, choices matter
- **Levels 7-8:** Higher complexity, puzzles
- **Levels 9-10:** Moderate, emotional focus
- **Levels 11-12:** Easy-moderate, preparation for ending

### New Level Properties
```javascript
{
    name: "Level Name",
    partNumber: 1-3,
    levelNumber: 1-12,
    playerStart: {x, y},
    guidePosition: {x, y},
    collectibleType: 'orb' | 'heart' | 'lantern' | 'note' | 'star',
    collectibles: [],
    bonusCollectibles: [],  // NEW
    timedCollectibles: [],  // NEW
    obstacles: [],
    platforms: [],          // NEW
    keys: [],              // NEW
    gates: [],             // NEW
    fog: true/false,       // NEW
    fogRadius: 100,        // NEW
    requiredCount: 3,      // NEW - for Part 3
    mechanics: []          // NEW - documentation
}
```

---

## 🔧 HOW TO CUSTOMIZE

### Add a New Level
1. Open `js/config.js`
2. Find the appropriate part in `parts` array
3. Add a new level object to that part's `levels` array
4. Add corresponding dialogue in `dialogue` object

### Modify Existing Levels
- **Change positions:** Edit `collectibles`, `obstacles`, etc. arrays
- **Add platforms:** Add to `platforms` array with start/end positions
- **Add fog:** Set `fog: true` and `fogRadius: 120`
- **Add keys/gates:** Add to `keys` and `gates` arrays

### Adjust Dialogue
All dialogue is in `CONFIG.dialogue`:
```javascript
level1Start: "Your custom text here",
level1Complete: "Your completion message",
```

### Change Mechanics
Edit the level's `mechanics` array:
```javascript
mechanics: ['movingPlatforms', 'fog', 'keysAndGates']
```

---

## ✨ WHAT STAYED THE SAME

- Original Totoro-inspired forest guide
- Player movement and controls
- Basic collectible system (expanded)
- Cozy visual aesthetic
- Valentine reveal ending
- File structure and organization
- All original files are still compatible

---

## 🎯 RECOMMENDED PLAYTEST

1. **Part 1 should feel:** Comfortable, exploratory, gradually introducing concepts
2. **Part 2 should feel:** Thoughtful, requires planning, supports player
3. **Part 3 should feel:** Emotional, meaningful, personal
4. **Valentine reveal should feel:** Earned, not sudden, heartfelt

---

## 📊 Quick Stats

- **Original:** 3 levels
- **Expanded:** 12 levels across 3 parts
- **New mechanics:** 6 major systems
- **Lines of code added:** ~1,500+
- **Dialogue entries:** 35+
- **Total playtime:** 15-25 minutes

---

Made with 💚 for someone special!
