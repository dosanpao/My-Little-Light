/**
 * VALENTINE SCREEN
 * The final reveal - asking "Will you be my Valentine?"
 */

class ValentineScreen {
    constructor(game) {
        this.game = game;
        this.guide = new Guide(CONFIG.canvas.width / 2, CONFIG.canvas.height / 2);
        this.celebrating = false;
        this.celebrationTimer = 0;
        
        // Setup both "Yes" buttons
        document.getElementById('yesBtn1').addEventListener('click', () => {
            this.celebrate();
        });
        
        document.getElementById('yesBtn2').addEventListener('click', () => {
            this.celebrate();
        });
    }

    /**
     * Called when entering this screen
     */
    enter() {
        Utils.hideAllScreens();
        Utils.showUI('valentineUI');
        this.celebrating = false;
        this.celebrationTimer = 0;
    }

    /**
     * Trigger celebration animation
     */
    celebrate() {
        if (this.celebrating) return;
        
        this.celebrating = true;
        
        // Hide buttons
        Utils.hideUI('valentineUI');
        
        // Show celebration overlay
        Utils.showUI('celebrationOverlay');
        
        // Create floating hearts
        this.createHearts();
    }

    /**
     * Create floating hearts animation
     */
    createHearts() {
        const container = document.getElementById('heartsContainer');
        container.innerHTML = ''; // Clear existing
        
        const hearts = ['💖', '💕', '💗', '💓', '💝', '🧸', '✨', '🌸'];
        
        // Create 30 hearts
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.animationDelay = Math.random() * 0.5 + 's';
                heart.style.animationDuration = (3 + Math.random() * 2) + 's';
                container.appendChild(heart);
            }, i * 100);
        }
    }

    /**
     * Update valentine screen
     */
    update() {
        this.guide.update();
        
        if (this.celebrating) {
            this.celebrationTimer++;
        }
    }

    /**
     * Draw valentine screen
     */
    draw(ctx) {
        // Romantic gradient background
        const gradient = ctx.createRadialGradient(
            CONFIG.canvas.width / 2,
            CONFIG.canvas.height / 2,
            0,
            CONFIG.canvas.width / 2,
            CONFIG.canvas.height / 2,
            CONFIG.canvas.width / 2
        );
        gradient.addColorStop(0, '#fff0f5');
        gradient.addColorStop(1, '#ffe8f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
        
        // Draw floating hearts in background
        this.drawBackgroundHearts(ctx);
        
        // Draw guide holding a heart
        this.guide.draw(ctx, true);
        
        // If celebrating, draw extra effects
        if (this.celebrating) {
            this.drawCelebrationEffects(ctx);
        }
    }

    /**
     * Draw hearts floating in background
     */
    drawBackgroundHearts(ctx) {
        const time = Date.now() / 1000;
        
        for (let i = 0; i < 12; i++) {
            const x = (Math.sin(time * 0.3 + i) * 0.4 + 0.5) * CONFIG.canvas.width;
            const y = (Math.cos(time * 0.2 + i * 0.7) * 0.4 + 0.5) * CONFIG.canvas.height;
            const scale = 0.5 + Math.sin(time * 2 + i) * 0.2;
            const alpha = 0.2 + Math.sin(time * 1.5 + i) * 0.1;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, scale);
            ctx.globalAlpha = alpha;
            
            this.drawHeart(ctx, 0, 0, 15, '#ffb3ba');
            
            ctx.restore();
        }
    }

    /**
     * Draw a heart shape
     */
    drawHeart(ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y + size * 0.3);
        ctx.bezierCurveTo(x, y, x - size * 0.5, y - size * 0.5, x - size * 0.75, y - size * 0.25);
        ctx.bezierCurveTo(x - size, y, x - size, y + size * 0.5, x - size, y + size * 0.5);
        ctx.bezierCurveTo(x - size, y + size, x - size * 0.5, y + size * 1.25, x, y + size * 1.5);
        ctx.bezierCurveTo(x + size * 0.5, y + size * 1.25, x + size, y + size, x + size, y + size * 0.5);
        ctx.bezierCurveTo(x + size, y + size * 0.5, x + size, y, x + size * 0.75, y - size * 0.25);
        ctx.bezierCurveTo(x + size * 0.5, y - size * 0.5, x, y, x, y + size * 0.3);
        ctx.fill();
    }

    /**
     * Draw celebration effects
     */
    drawCelebrationEffects(ctx) {
        const time = this.celebrationTimer / 60;
        
        // Pulsing glow
        const glowSize = 150 + Math.sin(time * 4) * 30;
        Utils.drawGlow(ctx, CONFIG.canvas.width / 2, CONFIG.canvas.height / 2, glowSize, 'rgba(255, 179, 186, 0.4)');
        
        // Sparkle burst
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            const distance = time * 100;
            const x = CONFIG.canvas.width / 2 + Math.cos(angle) * distance;
            const y = CONFIG.canvas.height / 2 + Math.sin(angle) * distance;
            const alpha = Math.max(0, 1 - time);
            
            ctx.fillStyle = `rgba(255, 215, 155, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
