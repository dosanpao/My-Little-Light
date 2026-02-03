# 🎨 Quick Customization Guide

## Most Common Changes

### 1. Change the Valentine Message
**File:** `js/config.js` (Line ~45)
```javascript
valentine: "Will you be my Valentine?"
```
Change to your message!

### 2. Change All Dialogue
**File:** `js/config.js` (Lines ~27-50)
The entire `dialogue` object contains all text in the game.

### 3. Change Level Names
**File:** `js/config.js` (Lines ~55, 72, 89)
```javascript
name: "Awakening Grove",  // ← Change this
```

### 4. Add More Collectibles
**File:** `js/config.js` (Lines ~60-66, 77-84, 94-100)
```javascript
collectibles: [
    { x: 200, y: 150 },
    { x: 400, y: 200 },
    // Add more {x, y} positions here
]
```
Remember: Canvas is 800×600, so keep x between 0-800 and y between 0-600

### 5. Make Levels Easier/Harder
**Add obstacles** for difficulty:
```javascript
obstacles: [
    { x: 250, y: 200, width: 100, height: 20 }  // x, y, width, height
]
```

**Remove obstacles** for easier gameplay:
```javascript
obstacles: []  // Empty array = no obstacles
```

### 6. Change Player Speed
**File:** `js/config.js` (Line ~20)
```javascript
speed: 4  // Higher = faster, Lower = slower
```

### 7. Change Colors
**File:** `js/config.js` (Lines ~11-17)
```javascript
colors: {
    background: '#faf8f3',   // Light cream
    player: '#4a7c59',       // Green
    guide: '#ffd89b',        // Golden
    collectible: '#ffb3ba',  // Pink
}
```

Use any hex color code. Try: https://colorhunt.co/

### 8. Change Canvas Size
**File:** `js/config.js` (Lines ~6-9)
```javascript
canvas: {
    width: 800,   // Change to desired width
    height: 600   // Change to desired height
}
```

Note: You'll need to adjust level positions accordingly!

## Where Everything Is

| What to Change | File | Line(s) |
|---|---|---|
| All dialogue/text | js/config.js | 27-50 |
| Level layouts | js/config.js | 54-106 |
| Colors | js/config.js | 11-17 |
| Player speed | js/config.js | 20 |
| Guide appearance | js/entities.js | 99-157 |
| Player appearance | js/entities.js | 16-92 |
| Background visuals | js/screens/levelScreen.js | 156-174 |
| Valentine screen | js/screens/valentineScreen.js | ALL |

## Adding Custom Images

### Replace Guide Character
**File:** `js/entities.js` → `Guide` class

Find the `draw()` method around line 125, replace with:

```javascript
draw(ctx, holdingHeart = false) {
    const drawY = this.y + this.bobOffset;
    
    // Load your image
    const img = new Image();
    img.src = 'assets/my-guide-character.png';
    
    // Draw image centered
    ctx.drawImage(
        img, 
        this.x - this.size, 
        drawY - this.size, 
        this.size * 2, 
        this.size * 2
    );
}
```

### Replace Player Character
**File:** `js/entities.js` → `Player` class

Find the `draw()` method around line 62, replace with:

```javascript
draw(ctx) {
    const img = new Image();
    img.src = 'assets/my-player-character.png';
    ctx.drawImage(
        img, 
        this.x - this.size/2, 
        this.y - this.size/2, 
        this.size, 
        this.size
    );
}
```

### Add Background Image
**File:** `js/screens/levelScreen.js`

Find `drawLevelBackground()` around line 156, replace with:

```javascript
drawLevelBackground(ctx) {
    const bg = new Image();
    bg.src = 'assets/forest-bg.png';
    ctx.drawImage(bg, 0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
}
```

## Testing Your Changes

1. Save the file you edited
2. Refresh the browser (F5)
3. If something breaks, check the browser console (F12)

## Common Mistakes

❌ Forgot to add comma in arrays
```javascript
collectibles: [
    { x: 200, y: 150 }   // ← Missing comma!
    { x: 400, y: 200 }
]
```

✅ Correct:
```javascript
collectibles: [
    { x: 200, y: 150 },  // ← Has comma
    { x: 400, y: 200 }
]
```

❌ Position outside canvas
```javascript
playerStart: { x: 1000, y: 300 }  // Canvas is only 800 wide!
```

✅ Correct:
```javascript
playerStart: { x: 100, y: 300 }  // Within 0-800 range
```

## Color Palette Ideas

**Sunset Forest:**
```javascript
colors: {
    background: '#fff5ee',
    player: '#ff8c69',
    guide: '#ffd700',
    collectible: '#ff69b4',
}
```

**Midnight Woods:**
```javascript
colors: {
    background: '#1a1a2e',
    player: '#4a4e69',
    guide: '#9a8c98',
    collectible: '#c9ada7',
}
```

**Spring Meadow:**
```javascript
colors: {
    background: '#f0f8ff',
    player: '#90ee90',
    guide: '#ffffe0',
    collectible: '#ffb6c1',
}
```

---

Happy customizing! 💚
