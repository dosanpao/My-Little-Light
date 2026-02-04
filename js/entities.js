/**
 * GAME ENTITIES
 * Classes for player, guide character, collectibles, and obstacles
 */

/**
 * Player class
 * The character controlled by the user
 */
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = CONFIG.player.size;
        this.speed = CONFIG.player.speed;
        this.color = CONFIG.player.color;
        
        // Movement keys
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    }

    /**
     * Update player position based on key input
     */
    update(obstacles = [], platforms = []) {
        let newX = this.x;
        let newY = this.y;

        // Calculate new position
        if (this.keys.up) newY -= this.speed;
        if (this.keys.down) newY += this.speed;
        if (this.keys.left) newX -= this.speed;
        if (this.keys.right) newX += this.speed;

        // Clamp to canvas bounds
        newX = Utils.clamp(newX, this.size / 2, CONFIG.canvas.width - this.size / 2);
        newY = Utils.clamp(newY, this.size / 2, CONFIG.canvas.height - this.size / 2);

        // Check collision with obstacles
        let canMove = true;
        for (let obstacle of obstacles) {
            const playerRect = {
                x: newX - this.size / 2,
                y: newY - this.size / 2,
                width: this.size,
                height: this.size
            };
            
            if (Utils.checkCollision(playerRect, obstacle)) {
                canMove = false;
                break;
            }
        }

        // Update position if no collision
        if (canMove) {
            this.x = newX;
            this.y = newY;
        }

        // Check if standing on a moving platform
        for (let platform of platforms) {
            if (platform.isPlayerOn(this)) {
                // Move with platform
                if (platform.axis === 'x') {
                    this.x += platform.speed * platform.direction;
                } else {
                    this.y += platform.speed * platform.direction;
                }
                
                // Keep within bounds
                this.x = Utils.clamp(this.x, this.size / 2, CONFIG.canvas.width - this.size / 2);
                this.y = Utils.clamp(this.y, this.size / 2, CONFIG.canvas.height - this.size / 2);
                break;
            }
        }
    }

    /**
     * Draw the player
     */
    draw(ctx) {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.size / 2, this.size / 2, this.size / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Player body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        Utils.drawGlow(ctx, this.x, this.y, this.size, 'rgba(74, 124, 89, 0.3)');

        // Simple face
        ctx.fillStyle = '#2d4a3e';
        // Eyes
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 6, this.y - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        // Smile
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 6, 0.2, Math.PI - 0.2);
        ctx.strokeStyle = '#2d4a3e';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

/**
 * Guide character class
 * The forest spirit that helps the player
 */
class Guide {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = CONFIG.guide.size;
        this.color = CONFIG.guide.color;
        this.bobOffset = 0; // For floating animation
        this.time = 0;
    }

    /**
     * Update guide animation
     */
    update() {
        this.time += 0.05;
        this.bobOffset = Math.sin(this.time) * 5; // Gentle floating motion
    }

    /**
     * Draw the guide character (Totoro-inspired)
     */
    draw(ctx, holdingHeart = false) {
        const drawY = this.y + this.bobOffset;

        // Glow effect
        Utils.drawGlow(ctx, this.x, drawY, this.size * 1.5, CONFIG.guide.glowColor);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.size, this.size * 0.7, this.size / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body (round, Totoro-style)
        ctx.fillStyle = '#c9b896'; // Warm grey-beige
        ctx.beginPath();
        ctx.ellipse(this.x, drawY, this.size * 0.6, this.size * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();

        // Belly
        ctx.fillStyle = '#e8dcc8'; // Lighter belly
        ctx.beginPath();
        ctx.ellipse(this.x, drawY + this.size * 0.2, this.size * 0.4, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Belly pattern (V-shaped markings)
        ctx.strokeStyle = '#a89878';
        ctx.lineWidth = 2;
        
        // Left V
        ctx.beginPath();
        ctx.moveTo(this.x - this.size * 0.2, drawY);
        ctx.lineTo(this.x - this.size * 0.15, drawY + this.size * 0.3);
        ctx.lineTo(this.x - this.size * 0.05, drawY + this.size * 0.15);
        ctx.stroke();

        // Right V
        ctx.beginPath();
        ctx.moveTo(this.x + this.size * 0.2, drawY);
        ctx.lineTo(this.x + this.size * 0.15, drawY + this.size * 0.3);
        ctx.lineTo(this.x + this.size * 0.05, drawY + this.size * 0.15);
        ctx.stroke();

        // Ears (pointy, triangular)
        ctx.fillStyle = '#c9b896';
        
        // Left ear
        ctx.beginPath();
        ctx.moveTo(this.x - this.size * 0.5, drawY - this.size * 0.4);
        ctx.lineTo(this.x - this.size * 0.3, drawY - this.size * 0.75);
        ctx.lineTo(this.x - this.size * 0.2, drawY - this.size * 0.5);
        ctx.closePath();
        ctx.fill();

        // Right ear
        ctx.beginPath();
        ctx.moveTo(this.x + this.size * 0.5, drawY - this.size * 0.4);
        ctx.lineTo(this.x + this.size * 0.3, drawY - this.size * 0.75);
        ctx.lineTo(this.x + this.size * 0.2, drawY - this.size * 0.5);
        ctx.closePath();
        ctx.fill();

        // Ear inner (darker)
        ctx.fillStyle = '#a89878';
        
        // Left ear inner
        ctx.beginPath();
        ctx.moveTo(this.x - this.size * 0.4, drawY - this.size * 0.45);
        ctx.lineTo(this.x - this.size * 0.3, drawY - this.size * 0.65);
        ctx.lineTo(this.x - this.size * 0.25, drawY - this.size * 0.5);
        ctx.closePath();
        ctx.fill();

        // Right ear inner
        ctx.beginPath();
        ctx.moveTo(this.x + this.size * 0.4, drawY - this.size * 0.45);
        ctx.lineTo(this.x + this.size * 0.3, drawY - this.size * 0.65);
        ctx.lineTo(this.x + this.size * 0.25, drawY - this.size * 0.5);
        ctx.closePath();
        ctx.fill();

        // Eyes (large, round)
        ctx.fillStyle = '#ffffff';
        
        // Left eye white
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.2, drawY - this.size * 0.2, this.size * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Right eye white
        ctx.beginPath();
        ctx.arc(this.x + this.size * 0.2, drawY - this.size * 0.2, this.size * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Pupils (large, dark)
        ctx.fillStyle = '#2d4a3e';
        
        // Left pupil
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.2, drawY - this.size * 0.2, this.size * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Right pupil
        ctx.beginPath();
        ctx.arc(this.x + this.size * 0.2, drawY - this.size * 0.2, this.size * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Eye shine
        ctx.fillStyle = '#ffffff';
        
        // Left eye shine
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.17, drawY - this.size * 0.25, this.size * 0.04, 0, Math.PI * 2);
        ctx.fill();

        // Right eye shine
        ctx.beginPath();
        ctx.arc(this.x + this.size * 0.23, drawY - this.size * 0.25, this.size * 0.04, 0, Math.PI * 2);
        ctx.fill();

        // Nose (small triangle)
        ctx.fillStyle = '#2d4a3e';
        ctx.beginPath();
        ctx.moveTo(this.x, drawY - this.size * 0.05);
        ctx.lineTo(this.x - this.size * 0.05, drawY + this.size * 0.05);
        ctx.lineTo(this.x + this.size * 0.05, drawY + this.size * 0.05);
        ctx.closePath();
        ctx.fill();

        // Whiskers
        ctx.strokeStyle = '#2d4a3e';
        ctx.lineWidth = 1.5;
        
        // Left whiskers
        for (let i = 0; i < 3; i++) {
            const yOffset = (i - 1) * this.size * 0.08;
            ctx.beginPath();
            ctx.moveTo(this.x - this.size * 0.35, drawY + yOffset);
            ctx.lineTo(this.x - this.size * 0.65, drawY + yOffset - this.size * 0.05);
            ctx.stroke();
        }

        // Right whiskers
        for (let i = 0; i < 3; i++) {
            const yOffset = (i - 1) * this.size * 0.08;
            ctx.beginPath();
            ctx.moveTo(this.x + this.size * 0.35, drawY + yOffset);
            ctx.lineTo(this.x + this.size * 0.65, drawY + yOffset - this.size * 0.05);
            ctx.stroke();
        }

        // Arms (small, rounded)
        ctx.fillStyle = '#c9b896';
        
        // Left arm
        ctx.beginPath();
        ctx.ellipse(this.x - this.size * 0.55, drawY + this.size * 0.1, this.size * 0.15, this.size * 0.25, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Right arm
        ctx.beginPath();
        ctx.ellipse(this.x + this.size * 0.55, drawY + this.size * 0.1, this.size * 0.15, this.size * 0.25, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // If holding heart (valentine screen)
        if (holdingHeart) {
            this.drawHeart(ctx, this.x, drawY - this.size * 0.8);
        }

        // Magical sparkles around (softer than before)
        const sparkleTime = this.time * 1.5;
        for (let i = 0; i < 5; i++) {
            const angle = (sparkleTime + i * (Math.PI * 2 / 5));
            const sparkleX = this.x + Math.cos(angle) * (this.size * 0.9);
            const sparkleY = drawY + Math.sin(angle) * (this.size * 0.9);
            const sparkleAlpha = (Math.sin(sparkleTime * 2 + i) * 0.3 + 0.5);
            
            ctx.fillStyle = `rgba(255, 215, 155, ${sparkleAlpha})`;
            ctx.beginPath();
            ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * Draw a heart
     */
    drawHeart(ctx, x, y) {
        ctx.fillStyle = '#ffb3ba';
        ctx.beginPath();
        ctx.moveTo(x, y + 5);
        ctx.bezierCurveTo(x, y, x - 10, y - 10, x - 15, y - 5);
        ctx.bezierCurveTo(x - 20, y, x - 20, y + 10, x - 20, y + 10);
        ctx.bezierCurveTo(x - 20, y + 20, x - 10, y + 25, x, y + 30);
        ctx.bezierCurveTo(x + 10, y + 25, x + 20, y + 20, x + 20, y + 10);
        ctx.bezierCurveTo(x + 20, y + 10, x + 20, y, x + 15, y - 5);
        ctx.bezierCurveTo(x + 10, y - 10, x, y, x, y + 5);
        ctx.fill();
    }
}

/**
 * Collectible class
 * Items the player collects to complete levels
 */
class Collectible {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = CONFIG.collectible.size;
        this.color = CONFIG.collectible.color;
        this.collected = false;
        this.time = Math.random() * Math.PI * 2; // Random start for animation variety
    }

    /**
     * Update collectible animation
     */
    update() {
        this.time += 0.08;
    }

    /**
     * Draw the collectible
     */
    draw(ctx) {
        if (this.collected) return;

        const scale = 1 + Math.sin(this.time) * 0.1; // Pulse animation

        // Glow
        Utils.drawGlow(ctx, this.x, this.y, this.size * 2, CONFIG.collectible.glowColor);

        // Orb
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, (this.size / 2) * scale, 0, Math.PI * 2);
        ctx.fill();

        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x - 3, this.y - 3, (this.size / 4) * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Check if player collected this item
     */
    checkCollection(player) {
        if (this.collected) return false;

        const distance = Math.sqrt(
            Math.pow(this.x - player.x, 2) + 
            Math.pow(this.y - player.y, 2)
        );

        if (distance < this.size + player.size / 2) {
            this.collected = true;
            return true;
        }
        return false;
    }
}

/**
 * Obstacle class
 * Static obstacles that block player movement
 */
class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = CONFIG.colors.obstacle;
    }

    /**
     * Draw the obstacle
     */
    draw(ctx) {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        Utils.roundRect(ctx, this.x + 3, this.y + 3, this.width, this.height, 8);
        ctx.fill();

        // Obstacle
        ctx.fillStyle = this.color;
        Utils.roundRect(ctx, this.x, this.y, this.width, this.height, 8);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        Utils.roundRect(ctx, this.x, this.y, this.width, this.height / 3, 8);
        ctx.fill();
    }
}

/**
 * MovingPlatform class
 * Platforms that move back and forth - player can stand on them
 */
class MovingPlatform {
    constructor(x, y, width, height, startPos, endPos, axis = 'x') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.startPos = startPos;
        this.endPos = endPos;
        this.axis = axis; // 'x' or 'y'
        this.direction = 1;
        this.speed = CONFIG.platform.speed;
        this.color = CONFIG.colors.platform;
    }

    /**
     * Update platform position
     */
    update() {
        if (this.axis === 'x') {
            this.x += this.speed * this.direction;
            if (this.x >= this.endPos || this.x <= this.startPos) {
                this.direction *= -1;
            }
        } else {
            this.y += this.speed * this.direction;
            if (this.y >= this.endPos || this.y <= this.startPos) {
                this.direction *= -1;
            }
        }
    }

    /**
     * Draw the platform
     */
    draw(ctx) {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        Utils.roundRect(ctx, this.x + 2, this.y + 2, this.width, this.height, 6);
        ctx.fill();

        // Platform
        ctx.fillStyle = this.color;
        Utils.roundRect(ctx, this.x, this.y, this.width, this.height, 6);
        ctx.fill();

        // Wood grain texture
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const offset = (this.width / 4) * i;
            ctx.beginPath();
            ctx.moveTo(this.x + offset, this.y);
            ctx.lineTo(this.x + offset, this.y + this.height);
            ctx.stroke();
        }
    }

    /**
     * Check if player is standing on platform
     */
    isPlayerOn(player) {
        return player.x > this.x && 
               player.x < this.x + this.width &&
               player.y >= this.y - player.size / 2 &&
               player.y <= this.y + 5;
    }
}

/**
 * Key class
 * Collectible keys that unlock gates
 */
class Key {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.size = 25;
        this.collected = false;
        this.time = Math.random() * Math.PI * 2;
        this.color = CONFIG.colors.key;
    }

    /**
     * Update animation
     */
    update() {
        this.time += 0.06;
    }

    /**
     * Draw the key
     */
    draw(ctx) {
        if (this.collected) return;

        const bobOffset = Math.sin(this.time) * 3;
        const drawY = this.y + bobOffset;

        // Glow
        Utils.drawGlow(ctx, this.x, drawY, this.size * 2, 'rgba(255, 215, 0, 0.4)');

        // Key head (circle)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.size / 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Key hole in head
        ctx.fillStyle = '#2d4a3e';
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.size / 6, 0, Math.PI * 2);
        ctx.fill();

        // Key shaft
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - 3, drawY, 6, this.size);

        // Key teeth
        ctx.fillRect(this.x - 6, drawY + this.size - 8, 6, 4);
        ctx.fillRect(this.x - 6, drawY + this.size - 4, 6, 4);

        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x - 3, drawY - 3, this.size / 5, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Check if player collected this key
     */
    checkCollection(player) {
        if (this.collected) return false;

        const distance = Math.sqrt(
            Math.pow(this.x - player.x, 2) + 
            Math.pow(this.y - player.y, 2)
        );

        if (distance < this.size + player.size / 2) {
            this.collected = true;
            return true;
        }
        return false;
    }
}

/**
 * Gate class
 * Blocks passage until corresponding key is collected
 */
class Gate {
    constructor(x, y, width, height, keyId) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.keyId = keyId;
        this.unlocked = false;
        this.opacity = 1;
    }

    /**
     * Unlock the gate
     */
    unlock() {
        this.unlocked = true;
    }

    /**
     * Update gate (fade out when unlocked)
     */
    update() {
        if (this.unlocked && this.opacity > 0) {
            this.opacity -= 0.02;
        }
    }

    /**
     * Draw the gate
     */
    draw(ctx) {
        if (this.opacity <= 0) return;

        ctx.globalAlpha = this.opacity;

        // Gate body
        ctx.fillStyle = CONFIG.colors.gate;
        Utils.roundRect(ctx, this.x, this.y, this.width, this.height, 8);
        ctx.fill();

        // Bars pattern
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        const barCount = Math.max(this.width, this.height) / 20;
        for (let i = 0; i < barCount; i++) {
            if (this.width > this.height) {
                // Horizontal gate - vertical bars
                const barX = this.x + (i * (this.width / barCount));
                ctx.fillRect(barX, this.y, 3, this.height);
            } else {
                // Vertical gate - horizontal bars
                const barY = this.y + (i * (this.height / barCount));
                ctx.fillRect(this.x, barY, this.width, 3);
            }
        }

        // Lock icon
        if (!this.unlocked) {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(centerX, centerY - 5, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillRect(centerX - 4, centerY - 5, 8, 10);
        }

        ctx.globalAlpha = 1;
    }

    /**
     * Check if gate blocks player (only if not unlocked)
     */
    blocksPlayer() {
        return !this.unlocked && this.opacity > 0.1;
    }
}

/**
 * TimedCollectible class
 * Collectible that disappears after a timer
 */
class TimedCollectible extends Collectible {
    constructor(x, y, timer = 300) {
        super(x, y);
        this.maxTimer = timer;
        this.timer = timer;
        this.disappearing = false;
    }

    /**
     * Update with timer countdown
     */
    update() {
        super.update();
        
        if (!this.collected && !this.disappearing) {
            this.timer--;
            if (this.timer <= 0) {
                this.disappearing = true;
            }
        }
    }

    /**
     * Draw with timer indicator
     */
    draw(ctx) {
        if (this.collected || this.disappearing) return;

        super.draw(ctx);

        // Timer ring
        const timePercent = this.timer / this.maxTimer;
        const angle = timePercent * Math.PI * 2 - Math.PI / 2;

        ctx.strokeStyle = timePercent > 0.3 ? 'rgba(255, 215, 155, 0.8)' : 'rgba(255, 100, 100, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + 5, -Math.PI / 2, angle);
        ctx.stroke();
    }
}

/**
 * SpecialCollectible class
 * For hearts, lanterns, notes, stars - Part 3 collectibles
 */
class SpecialCollectible {
    constructor(x, y, type = 'heart') {
        this.x = x;
        this.y = y;
        this.type = type; // 'heart', 'lantern', 'note', 'star'
        this.size = 25;
        this.collected = false;
        this.time = Math.random() * Math.PI * 2;
        this.colors = {
            heart: '#ff69b4',
            lantern: '#ffd89b',
            note: '#e8dcc8',
            star: '#fffacd'
        };
        this.color = this.colors[type] || this.colors.heart;
    }

    /**
     * Update animation
     */
    update() {
        this.time += 0.05;
    }

    /**
     * Draw based on type
     */
    draw(ctx) {
        if (this.collected) return;

        const bobOffset = Math.sin(this.time) * 4;
        const drawY = this.y + bobOffset;
        const scale = 1 + Math.sin(this.time * 2) * 0.1;

        // Glow
        Utils.drawGlow(ctx, this.x, drawY, this.size * 2.5, `${this.color}66`);

        ctx.save();
        ctx.translate(this.x, drawY);
        ctx.scale(scale, scale);

        switch(this.type) {
            case 'heart':
                this.drawHeart(ctx);
                break;
            case 'lantern':
                this.drawLantern(ctx);
                break;
            case 'note':
                this.drawNote(ctx);
                break;
            case 'star':
                this.drawStar(ctx);
                break;
        }

        ctx.restore();
    }

    /**
     * Draw a heart shape
     */
    drawHeart(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.bezierCurveTo(0, 0, -10, -5, -12, -2);
        ctx.bezierCurveTo(-15, 0, -15, 8, -15, 8);
        ctx.bezierCurveTo(-15, 13, -8, 18, 0, 23);
        ctx.bezierCurveTo(8, 18, 15, 13, 15, 8);
        ctx.bezierCurveTo(15, 8, 15, 0, 12, -2);
        ctx.bezierCurveTo(10, -5, 0, 0, 0, 5);
        ctx.fill();

        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(-4, -1, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draw a lantern
     */
    drawLantern(ctx) {
        // Lantern body
        ctx.fillStyle = this.color;
        Utils.roundRect(ctx, -10, -5, 20, 18, 4);
        ctx.fill();

        // Inner glow
        ctx.fillStyle = '#fff8dc';
        Utils.roundRect(ctx, -7, -2, 14, 12, 3);
        ctx.fill();

        // Handle
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -10, 8, 0, Math.PI, true);
        ctx.stroke();

        // Light rays
        ctx.strokeStyle = 'rgba(255, 255, 220, 0.6)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.lineTo(Math.cos(angle) * 15, 5 + Math.sin(angle) * 15);
            ctx.stroke();
        }
    }

    /**
     * Draw a note/letter
     */
    drawNote(ctx) {
        // Paper
        ctx.fillStyle = this.color;
        Utils.roundRect(ctx, -12, -10, 24, 20, 2);
        ctx.fill();

        // Fold corner
        ctx.fillStyle = '#d4c8b0';
        ctx.beginPath();
        ctx.moveTo(12, -10);
        ctx.lineTo(12, -2);
        ctx.lineTo(4, -10);
        ctx.closePath();
        ctx.fill();

        // Text lines
        ctx.strokeStyle = '#a89878';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const y = -6 + i * 4;
            ctx.beginPath();
            ctx.moveTo(-8, y);
            ctx.lineTo(6, y);
            ctx.stroke();
        }
    }

    /**
     * Draw a star
     */
    drawStar(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * 12;
            const y = Math.sin(angle) * 12;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Inner point
            const innerAngle = angle + Math.PI / 5;
            const innerX = Math.cos(innerAngle) * 5;
            const innerY = Math.sin(innerAngle) * 5;
            ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();

        // Center sparkle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Check if player collected
     */
    checkCollection(player) {
        if (this.collected) return false;

        const distance = Math.sqrt(
            Math.pow(this.x - player.x, 2) + 
            Math.pow(this.y - player.y, 2)
        );

        if (distance < this.size + player.size / 2) {
            this.collected = true;
            return true;
        }
        return false;
    }
}