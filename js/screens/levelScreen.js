/**
 * LEVEL SCREEN - EXPANDED
 * Main gameplay screen with multiple parts and progressive mechanics
 */

class LevelScreen {
    constructor(game) {
        this.game = game;
        this.currentPartIndex = 0;
        this.currentLevelIndex = 0;
        this.player = null;
        this.guide = null;
        this.collectibles = [];
        this.bonusCollectibles = [];
        this.timedCollectibles = [];
        this.obstacles = [];
        this.platforms = [];
        this.keys = [];
        this.gates = [];
        this.levelComplete = false;
        this.showingDialogue = true;
        this.dialogueTimer = 0;
        this.buttonSetup = false;
        this.collectedKeys = [];
        this.fog = false;
        this.fogRadius = 100;
    }

    /**
     * Called when entering this screen
     * @param {Object} data - { partIndex, levelIndex }
     */
    enter(data = {}) {
        this.currentPartIndex = data.partIndex || 0;
        this.currentLevelIndex = data.levelIndex || 0;
        this.levelComplete = false;
        this.showingDialogue = true;
        this.dialogueTimer = 180;
        this.collectedKeys = [];
        
        Utils.hideAllScreens();
        Utils.showUI('levelUI');
        
        this.loadLevel(this.currentPartIndex, this.currentLevelIndex);
        this.updateUI();
        
        // Setup next level button (only once)
        if (!this.buttonSetup) {
            const nextBtn = document.getElementById('nextLevelBtn');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.proceedToNext();
                });
                this.buttonSetup = true;
            }
        }
    }

    /**
     * Load level data and create entities
     */
    loadLevel(partIndex, levelIndex) {
        const levelData = CONFIG.parts[partIndex].levels[levelIndex];
        
        // Create player
        this.player = new Player(levelData.playerStart.x, levelData.playerStart.y);
        
        // Create guide
        this.guide = new Guide(levelData.guidePosition.x, levelData.guidePosition.y);
        
        // Create collectibles based on type
        const CollectibleClass = (levelData.collectibleType && levelData.collectibleType !== 'orb') 
            ? SpecialCollectible 
            : Collectible;
        
        this.collectibles = levelData.collectibles.map(pos => {
            if (levelData.collectibleType && levelData.collectibleType !== 'orb') {
                return new SpecialCollectible(pos.x, pos.y, levelData.collectibleType);
            }
            return new Collectible(pos.x, pos.y);
        });
        
        // Bonus collectibles
        this.bonusCollectibles = (levelData.bonusCollectibles || []).map(pos => 
            new Collectible(pos.x, pos.y)
        );
        
        // Timed collectibles
        this.timedCollectibles = (levelData.timedCollectibles || []).map(item =>
            new TimedCollectible(item.x, item.y, item.timer)
        );
        
        // Create obstacles
        this.obstacles = (levelData.obstacles || []).map(obs => 
            new Obstacle(obs.x, obs.y, obs.width, obs.height)
        );
        
        // Create moving platforms
        this.platforms = (levelData.platforms || []).map(plat => {
            const startPos = plat.axis === 'x' ? plat.startX : plat.startY;
            const endPos = plat.axis === 'x' ? plat.endX : plat.endY;
            return new MovingPlatform(plat.x, plat.y, plat.width, plat.height, startPos, endPos, plat.axis);
        });
        
        // Create keys and gates
        this.keys = (levelData.keys || []).map(key =>
            new Key(key.x, key.y, key.id)
        );
        
        this.gates = (levelData.gates || []).map(gate =>
            new Gate(gate.x, gate.y, gate.width, gate.height, gate.keyId)
        );
        
        // Fog setting
        this.fog = levelData.fog || false;
        this.fogRadius = levelData.fogRadius || 100;
    }

    /**
     * Update UI elements (HUD and dialogue)
     */
    updateUI() {
        const part = CONFIG.parts[this.currentPartIndex];
        const levelData = part.levels[this.currentLevelIndex];
        const levelNumber = levelData.levelNumber;
        
        // Calculate collected count
        const allCollectibles = [
            ...this.collectibles,
            ...this.bonusCollectibles,
            ...this.timedCollectibles.filter(c => !c.disappearing)
        ];
        const collected = allCollectibles.filter(c => c.collected).length;
        const requiredCount = levelData.requiredCount || allCollectibles.length;
        
        document.getElementById('levelName').textContent = levelData.name;
        document.getElementById('objectiveText').textContent = `Collect: ${collected}/${requiredCount}`;
        
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
     * Get dialogue for current level
     */
    getLevelDialogue(type) {
        const levelData = CONFIG.parts[this.currentPartIndex].levels[this.currentLevelIndex];
        const levelNum = levelData.levelNumber;
        const key = `level${levelNum}${type.charAt(0).toUpperCase() + type.slice(1)}`;
        return CONFIG.dialogue[key] || '';
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
        
        // Get all active obstacles (including gates)
        const activeObstacles = [
            ...this.obstacles,
            ...this.gates.filter(g => g.blocksPlayer())
        ];
        
        // Update entities
        this.player.update(activeObstacles, this.platforms);
        this.guide.update();
        this.collectibles.forEach(c => c.update());
        this.bonusCollectibles.forEach(c => c.update());
        this.timedCollectibles.forEach(c => c.update());
        this.platforms.forEach(p => p.update());
        this.keys.forEach(k => k.update());
        this.gates.forEach(g => g.update());
        
        // Check collectible collection
        [...this.collectibles, ...this.bonusCollectibles, ...this.timedCollectibles].forEach(collectible => {
            if (collectible.checkCollection(this.player)) {
                this.updateUI();
                this.checkLevelComplete();
            }
        });
        
        // Check key collection
        this.keys.forEach(key => {
            if (key.checkCollection(this.player)) {
                this.collectedKeys.push(key.id);
                // Unlock corresponding gate
                this.gates.forEach(gate => {
                    if (gate.keyId === key.id) {
                        gate.unlock();
                    }
                });
            }
        });
    }

    /**
     * Check if level is complete
     */
    checkLevelComplete() {
        const levelData = CONFIG.parts[this.currentPartIndex].levels[this.currentLevelIndex];
        const allCollectibles = [
            ...this.collectibles,
            ...this.bonusCollectibles,
            ...this.timedCollectibles.filter(c => !c.disappearing)
        ];
        const collected = allCollectibles.filter(c => c.collected).length;
        const requiredCount = levelData.requiredCount || allCollectibles.length;
        
        console.log(`Level ${levelData.levelNumber}: Collected ${collected}/${requiredCount}`);
        
        if (collected >= requiredCount && !this.levelComplete) {
            console.log('Level Complete!');
            this.levelComplete = true;
            this.showLevelComplete();
        }
    }

    /**
     * Show level complete UI
     */
    showLevelComplete() {
        console.log('=== showLevelComplete called ===');
        console.log('Current UI states before change:');
        console.log('levelUI:', document.getElementById('levelUI')?.classList.contains('hidden'));
        console.log('levelCompleteUI:', document.getElementById('levelCompleteUI')?.classList.contains('hidden'));
        
        Utils.hideUI('levelUI');
        Utils.showUI('levelCompleteUI');
        
        console.log('UI states after change:');
        console.log('levelUI:', document.getElementById('levelUI')?.classList.contains('hidden'));
        console.log('levelCompleteUI:', document.getElementById('levelCompleteUI')?.classList.contains('hidden'));
        
        const message = this.getLevelDialogue('complete');
        console.log('Completion message:', message);
        const msgElement = document.getElementById('completionMessage');
        console.log('Message element exists?', !!msgElement);
        if (msgElement) {
            msgElement.textContent = message;
        }
    }

    /**
     * Proceed to next level, part, or transition
     */
    proceedToNext() {
        const currentPart = CONFIG.parts[this.currentPartIndex];
        const isLastLevelInPart = this.currentLevelIndex === currentPart.levels.length - 1;
        const isLastPart = this.currentPartIndex === CONFIG.parts.length - 1;
        
        if (!isLastLevelInPart) {
            // Go to next level in same part
            this.game.changeScreen('level', {
                partIndex: this.currentPartIndex,
                levelIndex: this.currentLevelIndex + 1
            });
        } else if (!isLastPart) {
            // Show part complete, then go to next part
            this.showPartComplete();
        } else {
            // All parts complete - go to transition
            this.game.changeScreen('transition');
        }
    }

    /**
     * Show part complete message
     */
    showPartComplete() {
        const partNum = this.currentPartIndex + 1;
        const message = CONFIG.dialogue[`part${partNum}Complete`] || 'Part complete!';
        
        // Show message briefly
        document.getElementById('completionMessage').textContent = message;
        
        setTimeout(() => {
            // Move to next part
            this.game.changeScreen('level', {
                partIndex: this.currentPartIndex + 1,
                levelIndex: 0
            });
        }, 2000);
    }

    /**
     * Draw level
     */
    draw(ctx) {
        // Clear canvas
        ctx.fillStyle = CONFIG.colors.background;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
        
        // Draw background based on part
        this.drawLevelBackground(ctx);
        
        // Draw platforms
        this.platforms.forEach(platform => platform.draw(ctx));
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => obstacle.draw(ctx));
        
        // Draw gates
        this.gates.forEach(gate => gate.draw(ctx));
        
        // Draw keys
        this.keys.forEach(key => key.draw(ctx));
        
        // Draw collectibles
        this.collectibles.forEach(collectible => collectible.draw(ctx));
        this.bonusCollectibles.forEach(collectible => collectible.draw(ctx));
        this.timedCollectibles.forEach(collectible => collectible.draw(ctx));
        
        // Draw guide
        this.guide.draw(ctx);
        
        // Draw player
        this.player.draw(ctx);
        
        // Draw fog overlay if enabled
        if (this.fog) {
            this.drawFog(ctx);
        }
        
        // Draw particles/ambiance
        this.drawAmbiance(ctx);
    }

    /**
     * Draw level-specific background based on part
     */
    drawLevelBackground(ctx) {
        // Different atmosphere for each part
        const partColors = [
            // Part 1 - Discovery - Warm and bright
            ['#fef9f0', '#f5f0e8'],
            // Part 2 - Connection - Cool and thoughtful
            ['#f0f5f0', '#e8f0e8'],
            // Part 3 - Intention - Romantic and warm
            ['#fff0f5', '#ffe8f0']
        ];
        
        const [color1, color2] = partColors[this.currentPartIndex] || partColors[0];
        
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvas.height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
        
        // Draw ground
        const groundAlpha = [0.3, 0.25, 0.35][this.currentPartIndex] || 0.3;
        ctx.fillStyle = `rgba(168, 198, 159, ${groundAlpha})`;
        ctx.fillRect(0, CONFIG.canvas.height - 80, CONFIG.canvas.width, 80);
    }

    /**
     * Draw fog overlay effect
     */
    drawFog(ctx) {
        // Create fog overlay
        ctx.fillStyle = CONFIG.colors.fog;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
        
        // Clear circle around player
        ctx.globalCompositeOperation = 'destination-out';
        const gradient = ctx.createRadialGradient(
            this.player.x, this.player.y, 0,
            this.player.x, this.player.y, this.fogRadius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
        ctx.globalCompositeOperation = 'source-over';
    }

    /**
     * Draw ambient effects
     */
    drawAmbiance(ctx) {
        const time = Date.now() / 1000;
        
        // Floating particles - more in Part 3
        const particleCount = [8, 10, 15][this.currentPartIndex] || 8;
        
        for (let i = 0; i < particleCount; i++) {
            const x = (Math.sin(time * 0.5 + i * 0.8) * 0.5 + 0.5) * CONFIG.canvas.width;
            const y = (Math.cos(time * 0.3 + i * 0.5) * 0.5 + 0.5) * CONFIG.canvas.height;
            const alpha = Math.sin(time * 2 + i) * 0.3 + 0.4;
            
            // Part 3 uses pink particles
            const color = this.currentPartIndex === 2 
                ? `rgba(255, 179, 186, ${alpha})`
                : `rgba(255, 215, 155, ${alpha})`;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}