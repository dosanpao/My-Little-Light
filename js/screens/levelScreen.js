/**
 * LEVEL SCREEN
 * Main gameplay screen where player collects items
 */

// Grass blades data (generated once)
const grassBlades = Array.from({ length: 40 }, (_, i) => ({
    x: Math.random() * CONFIG.canvas.width,
    y: CONFIG.canvas.height - Math.random() * 70,
    height: 8 + Math.random() * 12,
    phase: Math.random() * Math.PI * 2
}));
// Awakening Grove flowers data (generated once)
const awakeningFlowers = Array.from({ length: 8 }, (_, i) => ({
    x: 80 + i * 90,
    y: CONFIG.canvas.height - 60 - Math.random() * 20,
    colorIndex: i % 3
}));


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
        this.playerHasMoved = false;
        this.fadeStartTime = 0;
        this.dialogueFadeOpacity = 1;
        this.dialogueClickBound = false;
        
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
        this.dialogueTimer = 120; // 2 seconds after movement (60fps * 2)
        this.playerHasMoved = false;
        this.fadeStartTime = 0;
        this.dialogueFadeOpacity = 1;
        this.dialogueClickBound = false;
        
        Utils.hideAllScreens();
        Utils.showUI('levelUI');
        
        this.loadLevel(levelIndex);
        this.updateUI();
        
        // Setup click handler for dialogue - bind after a short delay
        this.setupDialogueClick();
    }
    
    /**
     * Setup click handler for dialogue dismissal
     */
    setupDialogueClick() {
        // Remove any existing handler first
        const dialogueBox = document.getElementById('levelDialogue');
        if (dialogueBox) {
            // Clone and replace to remove old listeners
            const newDialogueBox = dialogueBox.cloneNode(true);
            dialogueBox.parentNode.replaceChild(newDialogueBox, dialogueBox);
            
            // Add new click handler
            newDialogueBox.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.dismissDialogue();
            }, false);
            
            // Also update the text element reference
            const textElement = newDialogueBox.querySelector('#levelDialogueText');
            if (textElement) {
                textElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.dismissDialogue();
                }, false);
            }
            
            this.dialogueClickBound = true;
        }
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
        const dialogueBox = document.getElementById('levelDialogue');
        if (this.showingDialogue) {
            const dialogue = this.getLevelDialogue('start');
            document.getElementById('levelDialogueText').textContent = dialogue;
            dialogueBox.classList.remove('hidden');
            dialogueBox.style.opacity = this.dialogueFadeOpacity;
            dialogueBox.style.display = 'block';
            dialogueBox.style.pointerEvents = 'auto';
            
            // Position dialogue bubble near the guide
            this.positionDialogueNearGuide();
        } else {
            dialogueBox.classList.add('hidden');
            dialogueBox.style.opacity = 1; // Reset for next time
            dialogueBox.style.display = 'none';
        }
    }

    /**
     * Position the dialogue bubble near the guide character
     */
    positionDialogueNearGuide() {
        const dialogueBox = document.getElementById('levelDialogue');
        if (!dialogueBox || !this.guide) return;
        
        const guideX = this.guide.x;
        const guideY = this.guide.y;
        
        // Determine which side of the guide to place the bubble
        // If guide is on the right side, put bubble on left
        // If guide is on the left side, put bubble on right
        // If guide is in the middle, put it above or to the side
        
        let bubbleClass = '';
        let left, top;
        
        if (guideX > CONFIG.canvas.width * 0.6) {
            // Guide on right - bubble on left
            bubbleClass = 'guide-right';
            left = guideX - 380; // Bubble width + spacing
            top = guideY - 30;
        } else if (guideX < CONFIG.canvas.width * 0.4) {
            // Guide on left - bubble on right
            bubbleClass = 'guide-left';
            left = guideX + 80; // Guide size + spacing
            top = guideY - 30;
        } else {
            // Guide in middle - bubble above or to the right
            if (guideY < CONFIG.canvas.height * 0.5) {
                // Guide in upper half - put bubble to right
                bubbleClass = 'guide-left';
                left = guideX + 80;
                top = guideY - 30;
            } else {
                // Guide in lower half - put bubble above
                bubbleClass = 'guide-bottom';
                left = guideX - 175; // Half bubble width
                top = guideY - 150;
            }
        }
        
        // Remove old bubble class and add new one
        dialogueBox.className = 'chat-bubble';
        dialogueBox.classList.add(bubbleClass);
        
        // Set position
        dialogueBox.style.left = left + 'px';
        dialogueBox.style.top = top + 'px';
        dialogueBox.style.transform = 'none';
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
     * Dismiss dialogue immediately (on click)
     */
    dismissDialogue() {
        if (!this.showingDialogue) {
            return; // Already dismissed
        }
        
        this.showingDialogue = false;
        this.dialogueFadeOpacity = 0;
        
        // Immediately hide the dialogue box
        const dialogueBox = document.getElementById('levelDialogue');
        if (dialogueBox) {
            dialogueBox.classList.add('hidden');
            dialogueBox.style.opacity = 1; // Reset for next time
            dialogueBox.style.display = 'none'; // Force hide
        }
    }

    /**
     * Update level gameplay
     */
    update() {
        if (this.levelComplete) return;
        
        // Check if player has moved
        if (!this.playerHasMoved && this.player) {
            const isMoving = this.player.keys.up || this.player.keys.down || 
                           this.player.keys.left || this.player.keys.right;
            
            if (isMoving) {
                this.playerHasMoved = true;
                this.fadeStartTime = 0; // Start counting from when movement begins
            }
        }
        
        // Handle dialogue fade after player moves
        if (this.showingDialogue && this.playerHasMoved) {
            this.fadeStartTime++;
            
            // After 2 seconds of movement, start fading
            if (this.fadeStartTime >= this.dialogueTimer) {
                // Fade over 1 second (60 frames)
                const fadeFrames = 60;
                const fadeProgress = (this.fadeStartTime - this.dialogueTimer) / fadeFrames;
                this.dialogueFadeOpacity = Math.max(0, 1 - fadeProgress);
                
                // Apply fog-like fade to dialogue box
                const dialogueBox = document.getElementById('levelDialogue');
                if (dialogueBox) {
                    dialogueBox.style.opacity = this.dialogueFadeOpacity;
                }
                
                // Completely hide after fade completes
                if (this.dialogueFadeOpacity <= 0) {
                    this.showingDialogue = false;
                    this.updateUI();
                }
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
        Utils.hideUI('levelDialogue');  // Explicitly hide dialogue
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
        switch(this.currentLevelIndex) {
            case 0:
                this.drawAwakeningGroveBackground(ctx);
                break;
            case 1:
                this.drawWhisperingWoodsBackground(ctx);
                break;
            case 2:
                this.drawHeartwoodHavenBackground(ctx);
                break;
            default:
                this.drawAwakeningGroveBackground(ctx);
        }
    }

    /**
     * Level 1: Awakening Grove - Dawn breaking, warm and inviting
     */
    drawAwakeningGroveBackground(ctx) {
        // Sky gradient - warm sunrise colors
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvas.height);
        gradient.addColorStop(0, '#ffeaa7');  // Soft yellow
        gradient.addColorStop(0.3, '#ffd89b'); // Warm gold
        gradient.addColorStop(0.6, '#fef9f0'); // Cream
        gradient.addColorStop(1, '#f5f0e8');   // Warm base
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Sun/light source
        const sunGlow = ctx.createRadialGradient(650, 80, 0, 650, 80, 120);
        sunGlow.addColorStop(0, 'rgba(255, 235, 167, 0.6)');
        sunGlow.addColorStop(0.5, 'rgba(255, 216, 155, 0.3)');
        sunGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(650, 80, 120, 0, Math.PI * 2);
        ctx.fill();

        // Distant hills
        ctx.fillStyle = 'rgba(168, 198, 159, 0.2)';
        ctx.beginPath();
        ctx.moveTo(0, 280);
        ctx.quadraticCurveTo(200, 240, 400, 260);
        ctx.quadraticCurveTo(600, 280, CONFIG.canvas.width, 250);
        ctx.lineTo(CONFIG.canvas.width, CONFIG.canvas.height);
        ctx.lineTo(0, CONFIG.canvas.height);
        ctx.fill();

        // Ground with grass texture
        ctx.fillStyle = '#b8d4a8';
        ctx.fillRect(0, CONFIG.canvas.height - 80, CONFIG.canvas.width, 80);

        // Grass blades
        ctx.strokeStyle = 'rgba(127, 182, 158, 0.4)';
        ctx.lineWidth = 2;

        const time = performance.now() * 0.002;

        for (let i = 0; i < grassBlades.length; i++) {
            const blade = grassBlades[i];
            const sway = Math.sin(time + blade.phase) * 2;

            ctx.beginPath();
            ctx.moveTo(blade.x, blade.y);
            ctx.quadraticCurveTo(
                blade.x + sway,
                blade.y - blade.height / 2,
                blade.x + sway,
                blade.y - blade.height
            );
            ctx.stroke();
        }

        // Small awakening flowers (using pre-generated data) - drawn AFTER grass
        const flowerColors = ['#ffb3ba', '#ffd89b', '#ffe680'];
        for (let i = 0; i < awakeningFlowers.length; i++) {
            const flower = awakeningFlowers[i];
            const color = flowerColors[flower.colorIndex];
            
            // Petals
            ctx.fillStyle = color;
            for (let p = 0; p < 5; p++) {
                const angle = (p / 5) * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(
                    flower.x + Math.cos(angle) * 5,
                    flower.y + Math.sin(angle) * 5,
                    3,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
            
            // Center
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(flower.x, flower.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }

    }

    /**
     * Level 2: Whispering Woods - Mysterious forest with dappled light
     */
    drawWhisperingWoodsBackground(ctx) {
        // Sky gradient - cool forest tones
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvas.height);
        gradient.addColorStop(0, '#d4e8e0');  // Pale mint
        gradient.addColorStop(0.4, '#e8f5f0'); // Very light green
        gradient.addColorStop(1, '#e8f0e8');   // Soft green-white
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Distant trees (silhouettes)
        ctx.fillStyle = 'rgba(74, 124, 89, 0.15)';
        const treeSilhouettes = [
            { x: 100, y: 200, width: 40, height: 200 },
            { x: 250, y: 180, width: 50, height: 220 },
            { x: 450, y: 190, width: 45, height: 210 },
            { x: 650, y: 170, width: 55, height: 230 }
        ];
        
        treeSilhouettes.forEach(tree => {
            // Trunk
            ctx.fillRect(tree.x - tree.width / 6, tree.y, tree.width / 3, tree.height);
            
            // Foliage
            ctx.beginPath();
            ctx.ellipse(tree.x, tree.y + 30, tree.width / 2, tree.width / 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        // Light rays filtering through trees
        ctx.save();
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < 5; i++) {
            const x = 150 + i * 140;
            const rayGradient = ctx.createLinearGradient(x, 0, x, CONFIG.canvas.height - 100);
            rayGradient.addColorStop(0, 'rgba(255, 255, 200, 0.3)');
            rayGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = rayGradient;
            ctx.beginPath();
            ctx.moveTo(x - 20, 0);
            ctx.lineTo(x + 20, 0);
            ctx.lineTo(x + 30, CONFIG.canvas.height - 100);
            ctx.lineTo(x - 30, CONFIG.canvas.height - 100);
            ctx.fill();
        }
        ctx.restore();

        // Mushrooms and forest undergrowth
        const mushrooms = [
            { x: 120, y: CONFIG.canvas.height - 50 },
            { x: 200, y: CONFIG.canvas.height - 45 },
            { x: 380, y: CONFIG.canvas.height - 55 },
            { x: 550, y: CONFIG.canvas.height - 48 },
            { x: 680, y: CONFIG.canvas.height - 52 }
        ];
        
        mushrooms.forEach(mush => {
            // Mushroom stem
            ctx.fillStyle = '#e8dcc8';
            ctx.fillRect(mush.x - 3, mush.y, 6, 15);
            
            // Mushroom cap
            ctx.fillStyle = '#d4696e';
            ctx.beginPath();
            ctx.ellipse(mush.x, mush.y, 12, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Cap spots
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(mush.x - 4, mush.y - 2, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(mush.x + 3, mush.y + 1, 1.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Ferns
        ctx.strokeStyle = 'rgba(90, 140, 105, 0.4)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
            const x = 150 + i * 110;
            const y = CONFIG.canvas.height - 40;
            
            // Fern stem
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x - 5, y - 15, x - 8, y - 25);
            ctx.stroke();
            
            // Fern leaves
            for (let j = 0; j < 5; j++) {
                ctx.beginPath();
                ctx.moveTo(x - j * 1.5, y - j * 5);
                ctx.lineTo(x - j * 1.5 - 6, y - j * 5 - 3);
                ctx.stroke();
            }
        }

        // Ground
        ctx.fillStyle = '#9db88f';
        ctx.fillRect(0, CONFIG.canvas.height - 80, CONFIG.canvas.width, 80);
    }

    /**
     * Level 3: Heartwood Haven - Romantic, warm, heart-centered
     */
    drawHeartwoodHavenBackground(ctx) {
        // Sky gradient - romantic pink/purple
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvas.height);
        gradient.addColorStop(0, '#ffeef8');  // Very pale pink
        gradient.addColorStop(0.5, '#fff0f5'); // Lavender blush
        gradient.addColorStop(1, '#ffe8f0');   // Soft pink
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Magical glow in the center/top
        const magicGlow = ctx.createRadialGradient(400, 200, 0, 400, 200, 200);
        magicGlow.addColorStop(0, 'rgba(255, 179, 186, 0.3)');
        magicGlow.addColorStop(0.5, 'rgba(255, 215, 220, 0.15)');
        magicGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = magicGlow;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Heart-shaped tree/archway in background
        ctx.save();
        ctx.fillStyle = 'rgba(168, 198, 159, 0.25)';
        ctx.translate(400, 150);
        
        // Draw heart shape
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.bezierCurveTo(0, 0, -30, -20, -50, -10);
        ctx.bezierCurveTo(-70, 0, -70, 30, -70, 30);
        ctx.bezierCurveTo(-70, 50, -40, 80, 0, 110);
        ctx.bezierCurveTo(40, 80, 70, 50, 70, 30);
        ctx.bezierCurveTo(70, 30, 70, 0, 50, -10);
        ctx.bezierCurveTo(30, -20, 0, 0, 0, 20);
        ctx.fill();
        ctx.restore();

        // Floating petals
        const time = Date.now() / 1000;
        for (let i = 0; i < 15; i++) {
            const x = (Math.sin(time * 0.3 + i) * 0.4 + 0.5) * CONFIG.canvas.width;
            const y = (Math.cos(time * 0.2 + i * 0.5) * 0.3 + 0.3) * CONFIG.canvas.height;
            const rotation = time + i;
            const size = 3 + Math.sin(time + i) * 1;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillStyle = 'rgba(255, 179, 186, 0.4)';
            ctx.beginPath();
            ctx.ellipse(0, 0, size, size * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Rose bushes
        const roseBushes = [
            { x: 100, y: CONFIG.canvas.height - 90 },
            { x: 300, y: CONFIG.canvas.height - 85 },
            { x: 500, y: CONFIG.canvas.height - 95 },
            { x: 700, y: CONFIG.canvas.height - 88 }
        ];
        
        roseBushes.forEach(bush => {
            // Bush foliage
            ctx.fillStyle = 'rgba(127, 182, 158, 0.5)';
            ctx.beginPath();
            ctx.arc(bush.x, bush.y, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(bush.x + 15, bush.y - 5, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(bush.x - 12, bush.y - 8, 18, 0, Math.PI * 2);
            ctx.fill();
            
            // Roses
            const roses = [
                { dx: -8, dy: -15 },
                { dx: 5, dy: -12 },
                { dx: -15, dy: -5 },
                { dx: 10, dy: -8 }
            ];
            
            roses.forEach(rose => {
                ctx.fillStyle = '#ffb3ba';
                ctx.beginPath();
                ctx.arc(bush.x + rose.dx, bush.y + rose.dy, 4, 0, Math.PI * 2);
                ctx.fill();
                
                // Rose highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(bush.x + rose.dx - 1, bush.y + rose.dy - 1, 1.5, 0, Math.PI * 2);
                ctx.fill();
            });
        });

        // Heart-shaped stepping stones
        ctx.fillStyle = 'rgba(200, 180, 170, 0.4)';
        const stones = [
            { x: 200, y: CONFIG.canvas.height - 50 },
            { x: 350, y: CONFIG.canvas.height - 55 },
            { x: 450, y: CONFIG.canvas.height - 52 },
            { x: 600, y: CONFIG.canvas.height - 58 }
        ];
        
        stones.forEach(stone => {
            ctx.save();
            ctx.translate(stone.x, stone.y);
            ctx.scale(0.4, 0.4);
            
            ctx.beginPath();
            ctx.moveTo(0, 10);
            ctx.bezierCurveTo(0, 5, -10, -5, -15, 0);
            ctx.bezierCurveTo(-20, 5, -20, 15, 0, 25);
            ctx.bezierCurveTo(20, 15, 20, 5, 15, 0);
            ctx.bezierCurveTo(10, -5, 0, 5, 0, 10);
            ctx.fill();
            ctx.restore();
        });

        // Ground
        ctx.fillStyle = '#d4c4b4';
        ctx.fillRect(0, CONFIG.canvas.height - 80, CONFIG.canvas.width, 80);
        
        // Soft grass overlay
        ctx.fillStyle = 'rgba(168, 198, 159, 0.3)';
        ctx.fillRect(0, CONFIG.canvas.height - 80, CONFIG.canvas.width, 40);
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