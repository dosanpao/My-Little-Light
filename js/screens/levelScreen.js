/**
 * LEVEL SCREEN
 * Main gameplay screen where player collects items
 */

class LevelScreen {
    constructor(game) {
        this.game = game;
        this.currentLevelIndex = 0;
        this.player = null;
        this.guide = null;
        this.collectibles = [];
        this.obstacles = [];
        this.levelComplete = false;
        this.showingDialogue = true;
        this.dialogueTimer = 0;
        
        // Setup next level button
        document.getElementById('nextLevelBtn').addEventListener('click', () => {
            this.proceedToNext();
        });
    }

    /**
     * Called when entering this screen
     * @param {number} levelIndex - Which level to load (0, 1, or 2)
     */
    enter(levelIndex = 0) {
        this.currentLevelIndex = levelIndex;
        this.levelComplete = false;
        this.showingDialogue = true;
        this.dialogueTimer = 180; // Show dialogue for 3 seconds (60fps * 3)
        
        Utils.hideAllScreens();
        Utils.showUI('levelUI');
        
        this.loadLevel(levelIndex);
        this.updateUI();
    }

    /**
     * Load level data and create entities
     */
    loadLevel(levelIndex) {
        const levelData = CONFIG.levels[levelIndex];
        
        // Create player with selected light color
        const lightColor = this.game.state.lightColor || CONFIG.lightColors[0];
        this.player = new Player(levelData.playerStart.x, levelData.playerStart.y, lightColor);
        
        // Create guide
        this.guide = new Guide(levelData.guidePosition.x, levelData.guidePosition.y);
        
        // Create collectibles
        this.collectibles = levelData.collectibles.map(pos => 
            new Collectible(pos.x, pos.y)
        );
        
        // Create obstacles
        this.obstacles = levelData.obstacles.map(obs => 
            new Obstacle(obs.x, obs.y, obs.width, obs.height)
        );
    }

    /**
     * Update UI elements (HUD and dialogue)
     */
    updateUI() {
        const levelData = CONFIG.levels[this.currentLevelIndex];
        const collected = this.collectibles.filter(c => c.collected).length;
        const total = this.collectibles.length;
        
        document.getElementById('levelName').textContent = levelData.name;
        document.getElementById('objectiveText').textContent = `Collect: ${collected}/${total}`;
        
        // Show level start dialogue
        if (this.showingDialogue) {
            const dialogue = this.getLevelDialogue('start');
            document.getElementById('levelDialogueText').textContent = dialogue;
            document.getElementById('levelDialogue').classList.remove('hidden');
        } else {
            document.getElementById('levelDialogue').classList.add('hidden');
        }
    }

    /**
     * Get dialogue for current level (personalized)
     */
    getLevelDialogue(type) {
        const levelNum = this.currentLevelIndex + 1;
        const key = `level${levelNum}${type.charAt(0).toUpperCase() + type.slice(1)}`;
        const dialogue = CONFIG.dialogue[key] || '';
        return this.game.getPersonalizedDialogue(dialogue);
    }

    /**
     * Update level gameplay
     */
    update() {
        if (this.levelComplete) return;
        
        // Hide dialogue after timer
        if (this.showingDialogue) {
            this.dialogueTimer--;
            if (this.dialogueTimer <= 0) {
                this.showingDialogue = false;
                this.updateUI();
            }
        }
        
        // Update entities
        this.player.update(this.obstacles);
        this.guide.update();
        this.collectibles.forEach(c => c.update());
        
        // Check collectible collection
        this.collectibles.forEach(collectible => {
            if (collectible.checkCollection(this.player)) {
                this.updateUI();
                this.checkLevelComplete();
            }
        });
    }

    /**
     * Check if level is complete
     */
    checkLevelComplete() {
        const allCollected = this.collectibles.every(c => c.collected);
        
        if (allCollected && !this.levelComplete) {
            this.levelComplete = true;
            this.showLevelComplete();
        }
    }

    /**
     * Show level complete UI
     */
    showLevelComplete() {
        Utils.hideUI('levelUI');
        Utils.showUI('levelCompleteUI');
        
        const message = this.getLevelDialogue('complete');
        document.getElementById('completionMessage').textContent = message;
    }

    /**
     * Proceed to next level or transition
     */
    proceedToNext() {
        if (this.currentLevelIndex < CONFIG.levels.length - 1) {
            // Go to next level
            this.game.changeScreen('level', this.currentLevelIndex + 1);
        } else {
            // All levels complete - go to transition
            this.game.changeScreen('transition');
        }
    }

    /**
     * Draw level
     */
    draw(ctx) {
        // Clear canvas
        ctx.fillStyle = CONFIG.colors.background;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
        
        // Draw background based on level
        this.drawLevelBackground(ctx);
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => obstacle.draw(ctx));
        
        // Draw collectibles
        this.collectibles.forEach(collectible => collectible.draw(ctx));
        
        // Draw guide
        this.guide.draw(ctx);
        
        // Draw player
        this.player.draw(ctx);
        
        // Draw particles/ambiance
        this.drawAmbiance(ctx);
    }

    /**
     * Draw level-specific background
     */
    drawLevelBackground(ctx) {
        // Each level has a slightly different atmosphere
        const colors = [
            ['#fef9f0', '#f5f0e8'], // Level 1 - warm cream
            ['#f0f5f0', '#e8f0e8'], // Level 2 - cool green
            ['#fff0f5', '#ffe8f0']  // Level 3 - soft pink
        ];
        
        const [color1, color2] = colors[this.currentLevelIndex] || colors[0];
        
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvas.height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
        
        // Draw ground
        ctx.fillStyle = 'rgba(168, 198, 159, 0.3)';
        ctx.fillRect(0, CONFIG.canvas.height - 80, CONFIG.canvas.width, 80);
    }

    /**
     * Draw ambient effects
     */
    drawAmbiance(ctx) {
        const time = Date.now() / 1000;
        
        // Floating particles
        for (let i = 0; i < 8; i++) {
            const x = (Math.sin(time * 0.5 + i * 0.8) * 0.5 + 0.5) * CONFIG.canvas.width;
            const y = (Math.cos(time * 0.3 + i * 0.5) * 0.5 + 0.5) * CONFIG.canvas.height;
            const alpha = Math.sin(time * 2 + i) * 0.3 + 0.4;
            
            ctx.fillStyle = `rgba(255, 215, 155, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}