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
        
        // Smooth movement properties
        this.velocityX = 0;
        this.velocityY = 0;
        this.acceleration = 0.25; // How fast to speed up
        this.deceleration = 0.85; // How fast to slow down (0.85 = 15% slowdown per frame)
        
        // Idle floating animation - gentle hovering
        this.idleTime = 0;
        this.idleAmplitudeX = 0.15; // Very gentle horizontal drift (reduced from 0.3)
        this.idleAmplitudeY = 0.25; // Gentle vertical bob (reduced from 0.5)
        this.idleSpeedX = 0.015;  // Slower drift (reduced from 0.02)
        this.idleSpeedY = 0.018;  // Slower bob (reduced from 0.025)
        
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
        this.idleTime += 0.016;
        
        // Calculate target velocity based on input
        let targetVelocityX = 0;
        let targetVelocityY = 0;
        let isMoving = false;

        if (this.keys.up) {
            targetVelocityY -= this.speed;
            isMoving = true;
        }
        if (this.keys.down) {
            targetVelocityY += this.speed;
            isMoving = true;
        }
        if (this.keys.left) {
            targetVelocityX -= this.speed;
            isMoving = true;
        }
        if (this.keys.right) {
            targetVelocityX += this.speed;
            isMoving = true;
        }

        // Smooth acceleration towards target velocity
        if (isMoving) {
            this.velocityX += (targetVelocityX - this.velocityX) * this.acceleration;
            this.velocityY += (targetVelocityY - this.velocityY) * this.acceleration;
        } else {
            // Smooth deceleration when no keys pressed
            this.velocityX *= this.deceleration;
            this.velocityY *= this.deceleration;
            
            // Stop completely if velocity is very small
            if (Math.abs(this.velocityX) < 0.01) this.velocityX = 0;
            if (Math.abs(this.velocityY) < 0.01) this.velocityY = 0;
        }
        
        // Calculate new position with smooth velocity
        let newX = this.x + this.velocityX;
        let newY = this.y + this.velocityY;

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
                // Bounce back slightly on collision
                this.velocityX *= -0.3;
                this.velocityY *= -0.3;
                break;
            }
        }

        // Update position if no collision
        if (canMove) {
            // Add to trail if moving significantly
            const movementSpeed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
            if (movementSpeed > 0.5) {
                this.trail.push({
                    x: this.x,
                    y: this.y,
                    alpha: 1,
                    time: this.time,
                    velocityX: this.velocityX,
                    velocityY: this.velocityY
                });
                
                // Limit trail length
                if (this.trail.length > this.maxTrailLength) {
                    this.trail.shift();
                }
            }
            
            this.x = newX;
            this.y = newY;
        } else {
            // If hit obstacle, stop at current position
            newX = this.x;
            newY = this.y;
        }
        
        // Fade trail smoothly
        this.trail.forEach((point, i) => {
            point.alpha = (i + 1) / this.trail.length;
        });
    }
    
    /**
     * Get the display position with idle animation (for drawing only)
     */
    getDisplayPosition() {
        // Only apply idle animation when truly idle (no velocity)
        if (Math.abs(this.velocityX) < 0.1 && Math.abs(this.velocityY) < 0.1) {
            const idleOffsetX = Math.sin(this.idleTime * this.idleSpeedX) * this.idleAmplitudeX;
            const idleOffsetY = Math.sin(this.idleTime * this.idleSpeedY) * this.idleAmplitudeY;
            
            return {
                x: this.x + idleOffsetX,
                y: this.y + idleOffsetY
            };
        }
        
        return { x: this.x, y: this.y };
    }

    /**
     * Draw the player as a glowing light
     */
    draw(ctx) {
        // Get display position (includes idle animation offset)
        const displayPos = this.getDisplayPosition();
        const drawX = displayPos.x;
        const drawY = displayPos.y;
        
        // Calculate movement-based pulse - more energetic when moving
        const movementSpeed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        const movementPulse = 1 + (movementSpeed / this.speed) * 0.15; // Scale based on speed
        const timePulse = 1 + Math.sin(this.time) * 0.08;
        const pulse = movementPulse * timePulse;
        
        // Draw trail
        this.drawTrail(ctx);
        
        // Draw shadow (subtle)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.ellipse(drawX, drawY + this.size / 2, this.size / 2, this.size / 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw multiple glow layers for depth
        this.drawGlowLayers(ctx, pulse, drawX, drawY);
        
        // Core light with slight squash/stretch based on movement direction
        const stretchX = 1 + Math.abs(this.velocityX) / this.speed * 0.15;
        const stretchY = 1 + Math.abs(this.velocityY) / this.speed * 0.15;
        
        ctx.save();
        ctx.translate(drawX, drawY);
        ctx.scale(stretchX, stretchY);
        
        ctx.fillStyle = this.lightColor.color;
        ctx.beginPath();
        ctx.arc(0, 0, (this.size / 2) * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Bright center
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(0, 0, (this.size / 4) * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Sparkle highlight - moves slightly with idle animation
        const sparkleOffset = Math.sin(this.time * 1.5) * 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(-4 + sparkleOffset, -4, 3 * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Draw floating particles around the light
        this.drawParticles(ctx, pulse, drawX, drawY);
    }

    /**
     * Draw layered glow effect
     */
    drawGlowLayers(ctx, pulse, x, y) {
        // Multiple layers for soft glow
        for (let i = 3; i >= 0; i--) {
            const glowRadius = (this.size + i * 12) * pulse;
            const alpha = (0.25 - i * 0.05) * pulse;
            
            const gradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, glowRadius
            );
            
            gradient.addColorStop(0, this.hexToRgba(this.lightColor.color, alpha * 0.8));
            gradient.addColorStop(0.5, this.hexToRgba(this.lightColor.glow, alpha * 0.5));
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
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
    drawParticles(ctx, pulse, x, y) {
        const particleCount = 8;
        const movementSpeed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        
        for (let i = 0; i < particleCount; i++) {
            // Base rotation
            const angle = (this.time + i * (Math.PI * 2 / particleCount));
            
            // Adjust particle position based on movement direction
            let angleOffset = 0;
            if (movementSpeed > 0.5) {
                // Particles trail behind when moving
                const movementAngle = Math.atan2(this.velocityY, this.velocityX);
                angleOffset = Math.sin(angle + movementAngle) * 0.3;
            }
            
            const distance = 25 + Math.sin(this.time * 2 + i) * 8;
            const px = x + Math.cos(angle + angleOffset) * distance;
            const py = y + Math.sin(angle + angleOffset) * distance;
            
            // Particle size varies more organically
            const particleSize = 1.5 + Math.sin(this.time * 3 + i) * 0.5 + movementSpeed * 0.1;
            const particleAlpha = (Math.sin(this.time * 3 + i) * 0.4 + 0.5) * pulse;
            
            // Particles leave a subtle trail
            if (movementSpeed > 0.5) {
                ctx.fillStyle = this.hexToRgba(this.lightColor.glow, particleAlpha * 0.3);
                ctx.beginPath();
                ctx.arc(px - this.velocityX * 2, py - this.velocityY * 2, particleSize * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Main particle
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
     * Draw the guide character (Gudetama - lazy egg sitting down)
     */
    draw(ctx, holdingHeart = false) {
        const drawY = this.y + this.bobOffset;

        // Glow effect
        Utils.drawGlow(ctx, this.x, drawY, this.size * 1.5, CONFIG.guide.glowColor);

        // Shadow (wider for sitting pose)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.size * 0.7, this.size * 0.9, this.size / 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Egg white puddle (clear-ish white where Gudetama is sitting)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent white
        ctx.beginPath();
        // Irregular puddle shape
        ctx.ellipse(this.x, drawY + this.size * 0.5, this.size * 0.8, this.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Egg white shine/highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.ellipse(this.x - this.size * 0.2, drawY + this.size * 0.45, this.size * 0.25, this.size * 0.15, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Egg white subtle edge (slightly darker outline)
        ctx.strokeStyle = 'rgba(230, 230, 230, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(this.x, drawY + this.size * 0.5, this.size * 0.8, this.size * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Main egg body (oval, sitting down - wider at bottom)
        ctx.fillStyle = '#fabf1b'; // Gudetama yellow
        ctx.beginPath();
        ctx.ellipse(this.x, drawY, this.size * 0.55, this.size * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();

        // Egg yolk showing on top (the iconic Gudetama look)
        ctx.fillStyle = '#f5a800'; // Darker yolk yellow
        ctx.beginPath();
        ctx.ellipse(this.x, drawY - this.size * 0.2, this.size * 0.4, this.size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Yolk highlight
        ctx.fillStyle = '#fcd44d';
        ctx.beginPath();
        ctx.ellipse(this.x - this.size * 0.1, drawY - this.size * 0.25, this.size * 0.15, this.size * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Butt/bottom part (sitting, so a bit flattened)
        ctx.fillStyle = '#fcd364';
        ctx.beginPath();
        ctx.ellipse(this.x, drawY + this.size * 0.45, this.size * 0.5, this.size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (classic lazy Gudetama eyes - downward slanted lines)
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        
        // Left eye (outer edge lower, inner edge higher) - less steep slope
        ctx.beginPath();
        ctx.moveTo(this.x - this.size * 0.19, drawY - this.size * 0.07);  // outer (lower)
        ctx.lineTo(this.x - this.size * 0.12, drawY - this.size * 0.09);   // inner (higher)
        ctx.stroke();

        // Right eye (inner edge higher, outer edge lower) - less steep slope
        ctx.beginPath();
        ctx.moveTo(this.x + this.size * 0.12, drawY - this.size * 0.09);   // inner (higher)
        ctx.lineTo(this.x + this.size * 0.19, drawY - this.size * 0.07);  // outer (lower)
        ctx.stroke();

        // Mouth (lazy/unimpressed - narrow semi-circle with white inside, opening upward)
        // First draw the white inside of the mouth (semi-circle fill opening upward)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(this.x, drawY + this.size * 0.11, this.size * 0.13, this.size * 0.05, 0, Math.PI, Math.PI * 2, false); // Narrow ellipse semi-circle opening upward
        ctx.closePath();
        ctx.fill();
        
        // Draw mouth outline (semi-circle opening upward)
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1.5;  // Thin border
        ctx.lineCap = 'round';
        
        // Semi-circle outline (opening upward)
        ctx.beginPath();
        ctx.ellipse(this.x, drawY + this.size * 0.11, this.size * 0.13, this.size * 0.05, 0, Math.PI, Math.PI * 2, false);
        ctx.stroke();
        
        // Bottom line (closes the semi-circle)
        ctx.beginPath();
        ctx.moveTo(this.x - this.size * 0.13, drawY + this.size * 0.11);
        ctx.lineTo(this.x + this.size * 0.13, drawY + this.size * 0.11);
        ctx.stroke();

        // Tiny arms (just little nubs on the side, relaxed/lazy pose)
        ctx.fillStyle = '#fabf1b';
        
        // Left arm (tiny, droopy)
        ctx.beginPath();
        ctx.ellipse(this.x - this.size * 0.48, drawY + this.size * 0.15, this.size * 0.12, this.size * 0.18, -0.5, 0, Math.PI * 2);
        ctx.fill();

        // Right arm (tiny, droopy)
        ctx.beginPath();
        ctx.ellipse(this.x + this.size * 0.48, drawY + this.size * 0.15, this.size * 0.12, this.size * 0.18, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Tiny legs (just visible at bottom, sitting)
        ctx.fillStyle = '#fabf1b';
        
        // Left leg
        ctx.beginPath();
        ctx.ellipse(this.x - this.size * 0.25, drawY + this.size * 0.55, this.size * 0.1, this.size * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Right leg
        ctx.beginPath();
        ctx.ellipse(this.x + this.size * 0.25, drawY + this.size * 0.55, this.size * 0.1, this.size * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // If holding heart (valentine screen)
        if (holdingHeart) {
            this.drawHeart(ctx, this.x, drawY - this.size * 0.9);
        }

        // Soft sparkles around (very subtle for lazy Gudetama)
        const sparkleTime = this.time * 1.5;
        for (let i = 0; i < 5; i++) {
            const angle = (sparkleTime + i * (Math.PI * 2 / 5));
            const sparkleX = this.x + Math.cos(angle) * (this.size * 0.9);
            const sparkleY = drawY + Math.sin(angle) * (this.size * 0.9);
            const sparkleAlpha = (Math.sin(sparkleTime * 2 + i) * 0.3 + 0.5);
            
            ctx.fillStyle = `rgba(255, 215, 155, ${sparkleAlpha * 0.6})`;
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