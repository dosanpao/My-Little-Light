/**
 * TRANSITION SCREEN
 * Brief screen between level 3 and valentine reveal
 */

class TransitionScreen {
    constructor(game) {
        this.game = game;
        this.guide = new Guide(CONFIG.canvas.width / 2, CONFIG.canvas.height / 2);
        this.timer = 0;
        this.duration = 180; // 3 seconds at 60fps
    }

    /**
     * Called when entering this screen
     */
    enter() {
        Utils.hideAllScreens();
        Utils.showUI('transitionUI');
        this.timer = 0;
        
        // Update transition text with personalized dialogue
        const transitionText = this.game.getPersonalizedDialogue(CONFIG.dialogue.transition);
        document.getElementById('transitionText').textContent = transitionText;
    }

    /**
     * Update transition screen
     */
    update() {
        this.guide.update();
        this.timer++;
        
        // After duration, go to valentine screen
        if (this.timer >= this.duration) {
            this.game.changeScreen('valentine');
        }
    }

    /**
     * Draw transition screen
     */
    draw(ctx) {
        // Fade effect
        const fadeProgress = Math.min(this.timer / 60, 1); // Fade in over 1 second
        
        // Dark background with fade
        ctx.fillStyle = `rgba(45, 74, 62, ${fadeProgress * 0.9})`;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
        
        // Draw guide character with glow
        ctx.globalAlpha = fadeProgress;
        
        // Extra glow for transition
        Utils.drawGlow(ctx, this.guide.x, this.guide.y, 100, 'rgba(255, 215, 155, 0.6)');
        
        this.guide.draw(ctx);
        
        // Draw sparkles
        this.drawSparkles(ctx, fadeProgress);
        
        ctx.globalAlpha = 1;
    }

    /**
     * Draw magical sparkles
     */
    drawSparkles(ctx, alpha) {
        const time = this.timer / 60;
        
        for (let i = 0; i < 20; i++) {
            const angle = (time + i) * 0.5;
            const radius = 80 + Math.sin(time * 2 + i) * 20;
            const x = this.guide.x + Math.cos(angle) * radius;
            const y = this.guide.y + Math.sin(angle) * radius;
            const size = 2 + Math.sin(time * 3 + i) * 1;
            const sparkleAlpha = (Math.sin(time * 4 + i) * 0.5 + 0.5) * alpha;
            
            ctx.fillStyle = `rgba(255, 215, 155, ${sparkleAlpha})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}