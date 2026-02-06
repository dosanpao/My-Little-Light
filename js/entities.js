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

        // Sliding collision detection - check X and Y separately
        let canMoveX = true;
        let canMoveY = true;
        
        for (let obstacle of obstacles) {
            // Check X-axis movement only
            const testXRect = {
                x: newX - this.size / 2,
                y: this.y - this.size / 2,
                width: this.size,
                height: this.size
            };
            
            if (Utils.checkCollision(testXRect, obstacle)) {
                canMoveX = false;
                this.velocityX *= -0.3; // Bounce back slightly
            }
            
            // Check Y-axis movement only
            const testYRect = {
                x: this.x - this.size / 2,
                y: newY - this.size / 2,
                width: this.size,
                height: this.size
            };
            
            if (Utils.checkCollision(testYRect, obstacle)) {
                canMoveY = false;
                this.velocityY *= -0.3; // Bounce back slightly
            }
        }

        // Apply movement independently for each axis
        if (canMoveX) {
            this.x = newX;
        }
        if (canMoveY) {
            this.y = newY;
        }
        
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
        
        // Absorption animation properties
        this.isBeingAbsorbed = false;
        this.absorptionProgress = 0;
        this.absorptionDuration = 30; // frames (0.5 seconds at 60fps)
        this.targetX = 0;
        this.targetY = 0;
        this.startX = x;
        this.startY = y;
        this.justCollected = false; // Flag for when collection completes
    }
    
    /**
     * Start absorption animation toward player
     */
    startAbsorption(playerX, playerY, lightColor) {
        this.isBeingAbsorbed = true;
        this.absorptionProgress = 0;
        this.targetX = playerX;
        this.targetY = playerY;
        this.startX = this.x;
        this.startY = this.y;
        
        // Trigger the full-screen pulse effect
        if (lightColor) {
            Utils.triggerCollectionPulse(lightColor);
        }
    }

    /**
     * Update collectible animation
     */
    update(player = null) {
        this.time += 0.08;
        
        // Update absorption animation
        if (this.isBeingAbsorbed) {
            this.absorptionProgress++;
            
            // Update target to player's current position if player is provided
            if (player) {
                this.targetX = player.x;
                this.targetY = player.y;
            }
            
            // Ease-in curve for smooth acceleration
            const t = this.absorptionProgress / this.absorptionDuration;
            const easeT = t * t * (3 - 2 * t); // Smoothstep easing
            
            // Move toward target (player's current position)
            this.x = this.startX + (this.targetX - this.startX) * easeT;
            this.y = this.startY + (this.targetY - this.startY) * easeT;
            
            // Mark as collected when animation is complete
            if (this.absorptionProgress >= this.absorptionDuration) {
                this.collected = true;
                this.justCollected = true; // Signal that collection just completed
            }
        }
    }

    /**
     * Draw the collectible
     */
    draw(ctx) {
        // Don't draw if fully collected and not animating
        if (this.collected && !this.isBeingAbsorbed) return;

        const basePulse = 1 + Math.sin(this.time) * 0.1; // Gentle pulse animation
        
        // Calculate absorption progress (0 to 1)
        let t = 0;
        if (this.isBeingAbsorbed) {
            t = Math.min(this.absorptionProgress / this.absorptionDuration, 1);
        }
        
        // Calculate scaling factors
        const absorptionScale = 1 - (t * 0.8); // Shrink to 20% of original size
        const finalScale = basePulse * absorptionScale;
        const alpha = 1 - (t * 0.9); // Fade out
        
        // Don't draw if completely faded
        if (alpha <= 0.01) return;
        
        ctx.save();
        ctx.globalAlpha = alpha;

        // Draw glow (scales down with orb)
        const glowRadius = this.size * 2 * absorptionScale;
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, glowRadius
        );
        gradient.addColorStop(0, CONFIG.collectible.glowColor);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw main orb
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, (this.size / 2) * finalScale, 0, Math.PI * 2);
        ctx.fill();

        // Draw shine highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x - 3 * finalScale, this.y - 3 * finalScale, (this.size / 4) * finalScale, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw absorption particles (only while being absorbed)
        if (this.isBeingAbsorbed && t < 0.9) {
            const particleCount = 6;
            for (let i = 0; i < particleCount; i++) {
                const angle = (this.time * 3 + i * (Math.PI * 2 / particleCount));
                const distance = this.size * (1 - t) * 1.2;
                const px = this.x + Math.cos(angle) * distance;
                const py = this.y + Math.sin(angle) * distance;
                const particleAlpha = (1 - t) * 0.5;
                
                ctx.fillStyle = `rgba(255, 179, 186, ${particleAlpha})`;
                ctx.beginPath();
                ctx.arc(px, py, 2 * (1 - t * 0.5), 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }

    /**
     * Check if player collected this item
     */
    checkCollection(player) {
        if (this.collected || this.isBeingAbsorbed) return;

        const distance = Math.sqrt(
            Math.pow(this.x - player.x, 2) + 
            Math.pow(this.y - player.y, 2)
        );

        if (distance < this.size + player.size / 2) {
            // Start absorption animation with player's light color for pulse effect
            this.startAbsorption(player.x, player.y, player.lightColor);
        }
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
 * Black Light Enemy class
 * Hostile entity that chases the player and causes respawn on contact
 */
class BlackLight {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.startX = x; // Remember spawn position for reset
        this.startY = y;
        this.size = 35;
        this.speed = 1.5; // Base chase speed (will vary by level)
        
        // AI state
        this.isActive = false; // Becomes true when player moves
        this.targetX = x;
        this.targetY = y;
        
        // Physics for smooth movement
        this.velocityX = 0;
        this.velocityY = 0;
        this.acceleration = 0.15; // Slower acceleration than player
        this.maxSpeed = 2.5; // Will be set by level
        
        // Animation
        this.time = 0;
        this.pulsePhase = Math.random() * Math.PI * 2;
        
        // Visual effect
        this.distortionPhase = 0;
    }

    /**
     * Set chase speed (called by level config)
     */
    setSpeed(speed) {
        this.maxSpeed = speed;
    }

    /**
     * Activate the Black Light (when player first moves)
     */
    activate() {
        this.isActive = true;
    }

    /**
     * Reset to starting position
     */
    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isActive = false;
    }

    /**
     * Update Black Light AI and movement
     * AI Logic: Smooth pursuit with obstacle avoidance
     */
    update(player, obstacles = []) {
        this.time += 0.08;
        this.distortionPhase += 0.1;
        
        // Don't move until activated
        if (!this.isActive) {
            return;
        }

        // Calculate direction to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) { // Don't move if very close
            // Normalize direction
            const dirX = dx / distance;
            const dirY = dy / distance;

            // Calculate target velocity
            const targetVelX = dirX * this.maxSpeed;
            const targetVelY = dirY * this.maxSpeed;

            // Smooth acceleration toward target velocity
            this.velocityX += (targetVelX - this.velocityX) * this.acceleration;
            this.velocityY += (targetVelY - this.velocityY) * this.acceleration;

            // Calculate new position
            let newX = this.x + this.velocityX;
            let newY = this.y + this.velocityY;

            // Clamp to canvas bounds
            newX = Utils.clamp(newX, this.size / 2, CONFIG.canvas.width - this.size / 2);
            newY = Utils.clamp(newY, this.size / 2, CONFIG.canvas.height - this.size / 2);

            // Sliding collision detection - check X and Y separately
            let canMoveX = true;
            let canMoveY = true;
            
            for (let obstacle of obstacles) {
                // Check X-axis movement only
                const testXRect = {
                    x: newX - this.size / 2,
                    y: this.y - this.size / 2,
                    width: this.size,
                    height: this.size
                };
                
                if (Utils.checkCollision(testXRect, obstacle)) {
                    canMoveX = false;
                    this.velocityX *= -0.5; // Bounce back
                    
                    // Add perpendicular movement to slide around
                    this.velocityY += (Math.random() - 0.5) * 2;
                }
                
                // Check Y-axis movement only
                const testYRect = {
                    x: this.x - this.size / 2,
                    y: newY - this.size / 2,
                    width: this.size,
                    height: this.size
                };
                
                if (Utils.checkCollision(testYRect, obstacle)) {
                    canMoveY = false;
                    this.velocityY *= -0.5; // Bounce back
                    
                    // Add perpendicular movement to slide around
                    this.velocityX += (Math.random() - 0.5) * 2;
                }
            }

            // Apply movement independently for each axis
            if (canMoveX) {
                this.x = newX;
            }
            if (canMoveY) {
                this.y = newY;
            }
        } else {
            // Very close - slow down
            this.velocityX *= 0.9;
            this.velocityY *= 0.9;
        }
    }

    /**
     * Check collision with player
     */
    checkPlayerCollision(player) {
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Collision if distance less than combined radii
        return distance < (this.size / 2 + player.size / 2);
    }

    /**
     * Draw the Black Light with ominous effects
     */
    draw(ctx) {
        const pulse = 1 + Math.sin(this.time + this.pulsePhase) * 0.1;
        
        // Distortion effect (subtle ripple)
        ctx.save();
        
        // Draw outer dark aura (multiple layers for depth)
        for (let i = 4; i >= 0; i--) {
            const glowRadius = (this.size + i * 12) * pulse;
            const alpha = (0.25 - i * 0.04) * (this.isActive ? 1 : 0.5);
            
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, glowRadius
            );
            
            // Dark purple to black gradient
            gradient.addColorStop(0, `rgba(60, 20, 80, ${alpha * 0.8})`);
            gradient.addColorStop(0.4, `rgba(40, 10, 60, ${alpha * 0.6})`);
            gradient.addColorStop(0.7, `rgba(20, 5, 30, ${alpha * 0.3})`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Core dark orb
        ctx.fillStyle = '#1a0a2e';
        ctx.beginPath();
        ctx.arc(this.x, this.y, (this.size / 2) * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner purple glow
        const innerGlow = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, (this.size / 3) * pulse
        );
        innerGlow.addColorStop(0, 'rgba(80, 40, 100, 0.8)');
        innerGlow.addColorStop(1, 'rgba(40, 20, 60, 0.3)');
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, (this.size / 3) * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Dark center void
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, (this.size / 6) * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Distortion particles (if active)
        if (this.isActive) {
            for (let i = 0; i < 6; i++) {
                const angle = (this.distortionPhase + i * Math.PI / 3);
                const distance = 25 + Math.sin(this.time * 1.5 + i) * 8;
                const px = this.x + Math.cos(angle) * distance;
                const py = this.y + Math.sin(angle) * distance;
                const particleAlpha = Math.sin(this.time * 2 + i) * 0.3 + 0.4;
                
                ctx.fillStyle = `rgba(60, 20, 80, ${particleAlpha})`;
                ctx.beginPath();
                ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }
}

/**
 * Second Light class (for Level 7 - Crossing Lights)
 * AI-controlled light that mirrors player movement toward center
 */
class SecondLight {
    constructor(x, y, lightColor = null) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.size = 30;
        this.lightColor = lightColor || CONFIG.lightColors[2]; // Default to Sky Blue
        
        // Animation
        this.time = 0;
        
        // Movement
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = CONFIG.player.speed;
        this.isMoving = false;
        
        // Target (the meeting point)
        this.targetX = null;
        this.targetY = null;
        
        // Idle animation
        this.idleTime = Math.PI; // Offset from player for variation
        this.idleAmplitudeX = 0.15;
        this.idleAmplitudeY = 0.25;
        this.idleSpeedX = 0.015;
        this.idleSpeedY = 0.018;
    }
    
    /**
     * Set target meeting point
     */
    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
    
    /**
     * Update - mirrors player movement toward target
     */
    update(playerIsMoving) {
        this.time += 0.08;
        this.idleTime += 0.016;
        
        // Only move if player is moving
        if (playerIsMoving && this.targetX !== null) {
            // Calculate direction to target
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) { // Stop when very close
                // Move toward target
                const dirX = dx / distance;
                const dirY = dy / distance;
                
                this.velocityX = dirX * this.speed;
                this.velocityY = dirY * this.speed;
                
                this.x += this.velocityX;
                this.y += this.velocityY;
                this.isMoving = true;
            } else {
                // Reached target
                this.velocityX = 0;
                this.velocityY = 0;
                this.isMoving = false;
            }
        } else {
            // Decelerate when not moving
            this.velocityX *= 0.85;
            this.velocityY *= 0.85;
            
            if (Math.abs(this.velocityX) < 0.01) this.velocityX = 0;
            if (Math.abs(this.velocityY) < 0.01) this.velocityY = 0;
            
            this.isMoving = Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1;
        }
    }
    
    /**
     * Get display position with idle animation
     */
    getDisplayPosition() {
        if (!this.isMoving) {
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
     * Draw the second light (similar to player)
     */
    draw(ctx) {
        const displayPos = this.getDisplayPosition();
        const drawX = displayPos.x;
        const drawY = displayPos.y;
        
        const pulse = 1 + Math.sin(this.time) * 0.08;
        
        // Draw glow layers
        for (let i = 3; i >= 0; i--) {
            const glowRadius = (this.size + i * 15) * pulse;
            const alpha = (0.3 - i * 0.07) * pulse;
            
            const gradient = ctx.createRadialGradient(
                drawX, drawY, 0,
                drawX, drawY, glowRadius
            );
            
            const r = parseInt(this.lightColor.color.slice(1, 3), 16);
            const g = parseInt(this.lightColor.color.slice(3, 5), 16);
            const b = parseInt(this.lightColor.color.slice(5, 7), 16);
            
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`);
            gradient.addColorStop(0.5, this.hexToRgba(this.lightColor.glow, alpha * 0.5));
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(drawX, drawY, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Core light
        ctx.fillStyle = this.lightColor.color;
        ctx.beginPath();
        ctx.arc(drawX, drawY, (this.size / 2) * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Bright center
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(drawX, drawY, (this.size / 4) * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Particles
        for (let i = 0; i < 6; i++) {
            const angle = (this.time + i * Math.PI / 3);
            const distance = 25 + Math.sin(this.time * 2 + i) * 8;
            const px = drawX + Math.cos(angle) * distance;
            const py = drawY + Math.sin(angle) * distance;
            const particleAlpha = Math.sin(this.time * 3 + i) * 0.5 + 0.5;
            
            ctx.fillStyle = this.hexToRgba(this.lightColor.glow, particleAlpha * 0.6);
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    /**
     * Convert hex to rgba
     */
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

/**
 * Shadow Entity class (for Level 8 - Held Against the Dark)
 * Dark entities that dissolve when touching the shield
 */
class ShadowEntity {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.size = 20;
        this.speed = 1.2;
        
        // Visual
        this.time = 0;
        this.alpha = 0; // Fades in
        this.dissolving = false;
        this.dissolveProgress = 0;
        
        // Movement
        this.velocityX = 0;
        this.velocityY = 0;
    }
    
    /**
     * Update shadow movement
     */
    update() {
        this.time += 0.08;
        
        // Fade in
        if (this.alpha < 1 && !this.dissolving) {
            this.alpha += 0.02;
        }
        
        // Dissolve
        if (this.dissolving) {
            this.dissolveProgress += 0.05;
            this.alpha = Math.max(0, 1 - this.dissolveProgress);
            return this.dissolveProgress >= 1; // Return true when fully dissolved
        }
        
        // Move toward target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            const dirX = dx / distance;
            const dirY = dy / distance;
            
            this.velocityX = dirX * this.speed;
            this.velocityY = dirY * this.speed;
            
            this.x += this.velocityX;
            this.y += this.velocityY;
        }
        
        return false; // Not dissolved yet
    }
    
    /**
     * Start dissolving animation
     */
    dissolve() {
        this.dissolving = true;
    }
    
    /**
     * Draw shadow entity
     */
    draw(ctx) {
        if (this.alpha <= 0) return;
        
        const pulse = 1 + Math.sin(this.time) * 0.1;
        const size = this.dissolving ? this.size * (1 + this.dissolveProgress) : this.size;
        
        // Dark aura
        for (let i = 2; i >= 0; i--) {
            const glowRadius = (size + i * 8) * pulse;
            const alpha = (0.3 - i * 0.08) * this.alpha;
            
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, glowRadius
            );
            
            gradient.addColorStop(0, `rgba(40, 20, 60, ${alpha})`);
            gradient.addColorStop(0.6, `rgba(20, 10, 30, ${alpha * 0.5})`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Core
        ctx.fillStyle = `rgba(30, 15, 45, ${this.alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, (size / 2) * pulse, 0, Math.PI * 2);
        ctx.fill();
    }
}