/**
 * COLOR SELECTION SCREEN
 * Allows player to choose their light character's color
 */

class ColorSelectionScreen {
    constructor(game) {
        this.game = game;
        this.guide = new Guide(CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 + 80);
        this.selectedColor = null;
        this.previewLight = null;
        this.buttonSetup = false;
        this.enterKeyBound = false;
    }

    /**
     * Called when entering this screen
     */
    enter() {
        Utils.hideAllScreens();
        Utils.showUI('colorSelectionUI');
        
        // Clean up any existing Enter key handler first
        this.cleanup();
        
        // Set default selection
        this.selectedColor = CONFIG.lightColors[0];
        this.updatePreview();
        
        // Setup color buttons (only once)
        if (!this.buttonSetup) {
            this.setupColorButtons();
            
            const confirmBtn = document.getElementById('colorConfirmBtn');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    this.confirmColor();
                });
            }
            
            this.buttonSetup = true;
        }
        
        // Highlight first color by default
        this.highlightColorButton(0);
        
        // Setup Enter key (after cleanup to ensure fresh handler)
        this.setupEnterKey();
    }
    
    /**
     * Setup Enter key handler
     */
    setupEnterKey() {
        this.enterKeyHandler = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.confirmColor();
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
     * Setup color selection buttons
     */
    setupColorButtons() {
        const container = document.getElementById('colorOptions');
        if (!container) return;
        
        container.innerHTML = '';
        
        CONFIG.lightColors.forEach((colorData, index) => {
            const button = document.createElement('button');
            button.className = 'color-option';
            button.style.background = `radial-gradient(circle, ${colorData.color}, ${colorData.glow})`;
            button.setAttribute('data-color-index', index);
            
            // Preview circle
            const preview = document.createElement('div');
            preview.className = 'color-preview';
            preview.style.backgroundColor = colorData.color;
            preview.style.boxShadow = `0 0 20px ${colorData.glow}`;
            button.appendChild(preview);
            
            // Label
            const label = document.createElement('div');
            label.className = 'color-label';
            label.textContent = colorData.name;
            button.appendChild(label);
            
            // Click handler
            button.addEventListener('click', () => {
                this.selectColor(index);
            });
            
            container.appendChild(button);
        });
    }

    /**
     * Select a color
     */
    selectColor(index) {
        this.selectedColor = CONFIG.lightColors[index];
        this.updatePreview();
        this.highlightColorButton(index);
    }

    /**
     * Update preview light
     */
    updatePreview() {
        // Create preview player at top of screen
        this.previewLight = {
            x: CONFIG.canvas.width / 2,
            y: 120,
            size: 35,
            color: this.selectedColor.color,
            glow: this.selectedColor.glow,
            time: 0
        };
    }

    /**
     * Highlight selected color button
     */
    highlightColorButton(index) {
        const buttons = document.querySelectorAll('.color-option');
        buttons.forEach((btn, i) => {
            if (i === index) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }

    /**
     * Confirm color selection and proceed
     */
    confirmColor() {
        // Cleanup before leaving
        this.cleanup();
        
        // Store in game state
        this.game.state.lightColor = this.selectedColor;
        
        // Proceed to first level
        this.game.changeScreen('level', 0);
    }

    /**
     * Update color selection screen
     */
    update() {
        this.guide.update();
        
        if (this.previewLight) {
            this.previewLight.time += 0.08;
        }
    }

    /**
     * Draw color selection screen
     */
    draw(ctx) {
        // Clear canvas
        ctx.fillStyle = CONFIG.colors.background;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Draw peaceful background
        this.drawBackground(ctx);

        // Draw preview light
        if (this.previewLight) {
            this.drawPreviewLight(ctx);
        }

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
                400 + Math.sin(i) * 60, 
                35, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
        }
    }

    /**
     * Draw the preview light
     */
    drawPreviewLight(ctx) {
        const light = this.previewLight;
        const pulse = 1 + Math.sin(light.time) * 0.15;
        
        // Draw glow layers
        for (let i = 3; i >= 0; i--) {
            const glowRadius = (light.size + i * 15) * pulse;
            const alpha = (0.3 - i * 0.07) * pulse;
            
            const gradient = ctx.createRadialGradient(
                light.x, light.y, 0,
                light.x, light.y, glowRadius
            );
            
            gradient.addColorStop(0, this.hexToRgba(light.color, alpha * 0.8));
            gradient.addColorStop(0.5, this.hexToRgba(light.glow, alpha * 0.5));
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(light.x, light.y, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Core light
        ctx.fillStyle = light.color;
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.size / 2 * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Bright center
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(light.x, light.y, (light.size / 4) * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Particles around light
        for (let i = 0; i < 6; i++) {
            const angle = (light.time + i * Math.PI / 3);
            const distance = 30 + Math.sin(light.time * 2 + i) * 10;
            const px = light.x + Math.cos(angle) * distance;
            const py = light.y + Math.sin(angle) * distance;
            const particleAlpha = Math.sin(light.time * 3 + i) * 0.5 + 0.5;
            
            ctx.fillStyle = this.hexToRgba(light.glow, particleAlpha * 0.6);
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
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

    /**
     * Draw ambient sparkles
     */
    drawSparkles(ctx) {
        const time = Date.now() / 1000;
        for (let i = 0; i < 10; i++) {
            const x = (Math.sin(time * 0.5 + i) * 0.5 + 0.5) * CONFIG.canvas.width;
            const y = (Math.cos(time * 0.3 + i) * 0.5 + 0.5) * CONFIG.canvas.height;
            const alpha = Math.sin(time * 2 + i) * 0.5 + 0.5;
            
            ctx.fillStyle = `rgba(255, 215, 155, ${alpha * 0.4})`;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}