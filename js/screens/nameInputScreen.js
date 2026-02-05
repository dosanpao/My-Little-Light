/**
 * NAME INPUT SCREEN
 * Allows player to enter their name for personalized dialogue
 */

class NameInputScreen {
    constructor(game) {
        this.game = game;
        this.guide = new Guide(CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 - 80);
        this.buttonSetup = false;
    }

    /**
     * Called when entering this screen
     */
    enter() {
        Utils.hideAllScreens();
        Utils.showUI('nameInputUI');
        
        // Clear any previous input
        const nameInput = document.getElementById('playerNameInput');
        if (nameInput) {
            nameInput.value = '';
            nameInput.focus();
        }
        
        // Setup continue button (only once)
        if (!this.buttonSetup) {
            const continueBtn = document.getElementById('nameInputContinueBtn');
            if (continueBtn) {
                continueBtn.addEventListener('click', () => {
                    this.saveName();
                });
                this.buttonSetup = true;
            }
            
            // Allow Enter key to continue
            if (nameInput) {
                nameInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.saveName();
                    }
                });
            }
        }
    }

    /**
     * Save the player's name and proceed
     */
    saveName() {
        const nameInput = document.getElementById('playerNameInput');
        const playerName = nameInput ? nameInput.value.trim() : '';
        
        // Store in game state (even if empty)
        this.game.state.playerName = playerName;
        
        // Proceed to tutorial
        this.game.changeScreen('tutorial');
    }

    /**
     * Update name input screen
     */
    update() {
        this.guide.update();
    }

    /**
     * Draw name input screen
     */
    draw(ctx) {
        // Clear canvas
        ctx.fillStyle = CONFIG.colors.background;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Draw peaceful background
        this.drawBackground(ctx);

        // Draw guide character
        this.guide.draw(ctx);

        // Draw ambient sparkles
        this.drawSparkles(ctx);
    }

    /**
     * Draw background
     */
    drawBackground(ctx) {
        // Gentle gradient
        const gradient = ctx.createRadialGradient(
            CONFIG.canvas.width / 2, 
            CONFIG.canvas.height / 2, 
            0,
            CONFIG.canvas.width / 2, 
            CONFIG.canvas.height / 2, 
            CONFIG.canvas.width / 2
        );
        gradient.addColorStop(0, '#fef9f0');
        gradient.addColorStop(1, '#f0ebe0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Soft decorative circles
        ctx.fillStyle = 'rgba(168, 198, 159, 0.15)';
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.arc(
                150 + i * 120, 
                150 + Math.sin(i) * 80, 
                40, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
        }
    }

    /**
     * Draw ambient sparkles
     */
    drawSparkles(ctx) {
        const time = Date.now() / 1000;
        for (let i = 0; i < 8; i++) {
            const x = (Math.sin(time * 0.5 + i) * 0.5 + 0.5) * CONFIG.canvas.width;
            const y = (Math.cos(time * 0.3 + i) * 0.5 + 0.5) * CONFIG.canvas.height;
            const alpha = Math.sin(time * 2 + i) * 0.5 + 0.5;
            
            ctx.fillStyle = `rgba(255, 215, 155, ${alpha * 0.4})`;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
