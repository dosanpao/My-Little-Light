/**
 * TUTORIAL SCREEN
 * Explains game controls and objectives
 */

class TutorialScreen {
    constructor(game) {
        this.game = game;
        this.guide = new Guide(CONFIG.canvas.width / 2, CONFIG.canvas.height - 200); // Bottom center
        this.currentDialogueIndex = 0;
        this.dialogueClickBound = false;
        this.enterKeyBound = false;
    }

    /**
     * Called when entering this screen
     */
    enter() {
        Utils.hideAllScreens();
        Utils.showUI('tutorialUI');
        this.currentDialogueIndex = 0;
        this.showDialogue();
        
        // Clean up any existing handler first
        this.cleanup();
        
        this.setupDialogueClick();
        this.setupEnterKey();
    }
    
    /**
     * Setup Enter key handler
     */
    setupEnterKey() {
        this.enterKeyHandler = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.nextDialogue();
            }
        };
        
        document.addEventListener('keydown', this.enterKeyHandler);
        this.enterKeyBound = true;
    }
    
    /**
     * Cleanup Enter key handler when leaving
     */
    cleanup() {
        if (this.enterKeyHandler) {
            document.removeEventListener('keydown', this.enterKeyHandler);
            this.enterKeyBound = false;
            this.enterKeyHandler = null;
        }
    }
    
    /**
     * Setup click handler for dialogue to continue
     */
    setupDialogueClick() {
        // Make the entire tutorial UI clickable
        const tutorialUI = document.getElementById('tutorialUI');
        if (tutorialUI) {
            // Clone and replace to remove old listeners
            const newTutorialUI = tutorialUI.cloneNode(true);
            tutorialUI.parentNode.replaceChild(newTutorialUI, tutorialUI);
            
            // Add click handler to the entire screen
            newTutorialUI.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextDialogue();
            }, false);
            
            this.dialogueClickBound = true;
        }
    }

    /**
     * Show current dialogue with personalization
     */
    showDialogue() {
        const dialogue = CONFIG.dialogue.tutorial[this.currentDialogueIndex];
        const personalizedDialogue = this.game.getPersonalizedDialogue(dialogue);
        document.getElementById('tutorialText').textContent = personalizedDialogue;
    }

    /**
     * Progress to next dialogue or start color selection
     */
    nextDialogue() {
        this.currentDialogueIndex++;
        
        if (this.currentDialogueIndex < CONFIG.dialogue.tutorial.length) {
            this.showDialogue();
        } else {
            // Cleanup before leaving
            this.cleanup();
            // Go to color selection before first level
            this.game.changeScreen('colorSelection');
        }
    }

    /**
     * Update tutorial screen
     */
    update() {
        this.guide.update();
    }

    /**
     * Draw tutorial screen
     */
    draw(ctx) {
        // Clear canvas
        ctx.fillStyle = CONFIG.colors.background;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Draw simple forest background
        this.drawBackground(ctx);

        // Draw guide character
        this.guide.draw(ctx);

        // Draw example controls visualization
        this.drawControlsExample(ctx);
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

        // Decorative elements
        ctx.fillStyle = 'rgba(168, 198, 159, 0.2)';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(
                100 + i * 150, 
                100 + Math.sin(i) * 50, 
                30, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
        }
    }

    /**
     * Draw visual example of controls
     */
    drawControlsExample(ctx) {
        // Draw arrow keys representation at bottom
        const centerX = CONFIG.canvas.width / 2;
        const baseY = CONFIG.canvas.height - 100;
        const keySize = 30;
        const spacing = 40;

        // Keys positions
        const keys = [
            { x: centerX, y: baseY - spacing, label: '↑' },
            { x: centerX - spacing, y: baseY, label: '←' },
            { x: centerX, y: baseY, label: '↓' },
            { x: centerX + spacing, y: baseY, label: '→' }
        ];

        keys.forEach(key => {
            // Key background
            ctx.fillStyle = 'rgba(74, 124, 89, 0.8)';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 5;
            Utils.roundRect(ctx, key.x - keySize / 2, key.y - keySize / 2, keySize, keySize, 5);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Key label
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Quicksand';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(key.label, key.x, key.y);
        });

        // Or text
        ctx.fillStyle = '#7fb69e';
        ctx.font = '14px Quicksand';
        ctx.fillText('or WASD', centerX, baseY + spacing);
    }
}