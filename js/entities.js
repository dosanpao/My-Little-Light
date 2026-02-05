/**
 * GAME ENTITIES
 * Classes for player (light), guide character, collectibles, and obstacles
 */

/**
 * Player class - Now a glowing light with customizable color
 */
class Player {
    constructor(x, y, lightColor = null) {
        this.x = x;
        this.y = y;
        this.size = CONFIG.player.size;
        this.speed = CONFIG.player.speed;
        
        // Light color (customizable)
        this.lightColor = lightColor || CONFIG.lightColors[0];
        
        // Animation properties
        this.time = 0;
        
        // Trail effect
        this.trail = [];
        this.maxTrailLength = CONFIG.player.trailLength;
        
        // Movement keys
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    }

    /**
     * Set the light color
     */
    setLightColor(colorData) {
        this.lightColor = colorData;
    }

    /**
     * Update player position based on key input
     */
    update(obstacles = []) {
        this.time += 0.08;
        
        let newX = this.x;
        let newY = this.y;
        let isMoving = false;

        // Calculate new position
        if (this.keys.up) {
            newY -= this.speed;
            isMoving = true;
        }
        if (this.keys.down) {
            newY += this.speed;
            isMoving = true;
        }
        if (this.keys.left) {
            newX -= this.speed;
            isMoving = true;
        }
        if (this.keys.right) {
            newX += this.speed;
            isMoving = true;
        }

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
            // Add to trail only if moving
            if (isMoving && (Math.abs(newX - this.x) > 0.1 || Math.abs(newY - this.y) > 0.1)) {
                this.trail.push({
                    x: this.x,
                    y: this.y,
                    alpha: 1,
                    time: this.time
                });
                
                // Limit trail length
                if (this.trail.length > this.maxTrailLength) {
                    this.trail.shift();
                }
            }
            
            this.x = newX;
            this.y = newY;
        }
        
        // Fade trail
        this.trail.forEach((point, i) => {
            point.alpha = i / this.trail.length;
        });
    }

    /**
     * Draw the player as a glowing light
     */
    draw(ctx) {
        const pulse = 1 + Math.sin(this.time) * 0.1;
        
        // Draw trail
        this.drawTrail(ctx);
        
        // Draw shadow (subtle)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.size / 2, this.size / 2, this.size / 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw multiple glow layers for depth
        this.drawGlowLayers(ctx, pulse);
        
        // Core light
        ctx.fillStyle = this.lightColor.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, (this.size / 2) * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Bright center
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, (this.size / 4) * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Sparkle highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(this.x - 4, this.y - 4, 3 * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw floating particles around the light
        this.drawParticles(ctx, pulse);
    }

    /**
     * Draw layered glow effect
     */
    drawGlowLayers(ctx, pulse) {
        // Multiple layers for soft glow
        for (let i = 3; i >= 0; i--) {
            const glowRadius = (this.size + i * 12) * pulse;
            const alpha = (0.25 - i * 0.05) * pulse;
            
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, glowRadius
            );
            
            gradient.addColorStop(0, this.hexToRgba(this.lightColor.color, alpha * 0.8));
            gradient.addColorStop(0.5, this.hexToRgba(this.lightColor.glow, alpha * 0.5));
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * Draw trail effect
     */
    drawTrail(ctx) {
        this.trail.forEach((point, i) => {
            const size = (this.size / 3) * point.alpha;
            const alpha = point.alpha * 0.4;
            
            ctx.fillStyle = this.hexToRgba(this.lightColor.glow, alpha);
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /**
     * Draw floating particles
     */
    drawParticles(ctx, pulse) {
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (this.time + i * (Math.PI * 2 / particleCount));
            const distance = 25 + Math.sin(this.time * 2 + i) * 8;
            const px = this.x + Math.cos(angle) * distance;
            const py = this.y + Math.sin(angle) * distance;
            const particleSize = 1.5 + Math.sin(this.time * 3 + i) * 0.5;
            const particleAlpha = (Math.sin(this.time * 3 + i) * 0.4 + 0.5) * pulse;
            
            ctx.fillStyle = this.hexToRgba(this.lightColor.glow, particleAlpha * 0.6);
            ctx.beginPath();
            ctx.arc(px, py, particleSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * Convert hex color to rgba
     */
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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