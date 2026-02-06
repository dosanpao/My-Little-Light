/**
 * UTILITY FUNCTIONS
 * Helper functions used throughout the game
 */

const Utils = {
    /**
     * Check collision between two rectangles
     */
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },

    /**
     * Check collision between two circles
     */
    checkCircleCollision(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle1.radius + circle2.radius;
    },

    /**
     * Clamp a value between min and max
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    /**
     * Linear interpolation
     */
    lerp(start, end, amount) {
        return start + (end - start) * amount;
    },

    /**
     * Show a UI element with fade-in
     */
    showUI(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('hidden');
        }
    },

    /**
     * Hide a UI element with fade-out
     */
    hideUI(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('hidden');
        }
    },

    /**
     * Hide all screen UIs
     */
    hideAllScreens() {
        const screens = [
            'titleUI', 
            'nameInputUI', 
            'tutorialUI', 
            'colorSelectionUI', 
            'levelUI', 
            'levelCompleteUI', 
            'transitionUI', 
            'valentineUI',
            'celebrationOverlay'
        ];
        screens.forEach(screen => this.hideUI(screen));
        
        // Also hide floating dialogue boxes
        this.hideUI('levelDialogue');
    },

    /**
     * Draw a rounded rectangle
     */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    },

    /**
     * Draw a glowing effect
     */
    drawGlow(ctx, x, y, radius, color) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    },

    /**
     * Trigger full-screen pulse effect when collecting orb
     * @param {object} lightColor - The player's light color object
     */
    triggerCollectionPulse(lightColor) {
        const overlay = document.getElementById('pulseOverlay');
        if (!overlay) return;

        // Map light colors to pulse styles
        const colorToPulseMap = {
            'Warm White': 'pulse-warm',
            'Soft Yellow': 'pulse-golden',
            'Sky Blue': 'pulse-cool',
            'Lavender': 'pulse-mystical',
            'Peach': 'pulse-peachy',
            'Mint Green': 'pulse-mint'
        };

        // Remove any existing pulse classes
        overlay.className = 'pulse-overlay';
        
        // Add the appropriate pulse color class
        const pulseClass = colorToPulseMap[lightColor.name] || 'pulse-warm';
        overlay.classList.add(pulseClass);
        
        // Trigger the animation
        //overlay.classList.add('active');
        
        // Remove the active class after animation completes (1.4s)
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 1400);
    }
};