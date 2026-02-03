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
    update(obstacles = []) {
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
     * Draw the guide character
     */
    draw(ctx, holdingHeart = false) {
        const drawY = this.y + this.bobOffset;

        // Glow effect
        Utils.drawGlow(ctx, this.x, drawY, this.size * 1.5, CONFIG.guide.glowColor);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.size, this.size / 2, this.size / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Guide body (lantern-like)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner glow
        ctx.fillStyle = '#fff8dc';
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.size / 3, 0, Math.PI * 2);
        ctx.fill();

        // Sparkles
        for (let i = 0; i < 3; i++) {
            const angle = (this.time * 2 + i * (Math.PI * 2 / 3));
            const sparkleX = this.x + Math.cos(angle) * (this.size * 0.7);
            const sparkleY = drawY + Math.sin(angle) * (this.size * 0.7);
            
            ctx.fillStyle = 'rgba(255, 255, 220, 0.8)';
            ctx.beginPath();
            ctx.arc(sparkleX, sparkleY, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // If holding heart (valentine screen)
        if (holdingHeart) {
            this.drawHeart(ctx, this.x, drawY - this.size);
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
