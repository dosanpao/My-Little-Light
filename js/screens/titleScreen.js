/**
 * TITLE SCREEN
 * The initial screen when the game loads
 */

class TitleScreen {
    constructor(game) {
        this.game = game;
        this.guide = new Guide(150, CONFIG.canvas.height - 120); // Moved to bottom left
        this.buttonSetup = false;
        this.fireflies = this.initFireflies();
        
        // Initialize grass blades once (persistent data for wavy animation)
        this.grassBlades = Array.from({ length: 60 }, (_, i) => ({
            x: Math.random() * CONFIG.canvas.width,
            y: CONFIG.canvas.height - Math.random() * 60,
            height: 10 + Math.random() * 15,
            phase: Math.random() * Math.PI * 2
        }));
    }
    
    /**
     * Initialize fireflies
     */
    initFireflies() {
        const fireflies = [];
        for (let i = 0; i < 15; i++) {
            fireflies.push({
                x: Math.random() * CONFIG.canvas.width,
                y: Math.random() * CONFIG.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                brightness: Math.random(),
                phase: Math.random() * Math.PI * 2
            });
        }
        return fireflies;
    }

    /**
     * Called when entering this screen
     */
    enter() {
        Utils.hideAllScreens();
        Utils.showUI('titleUI');
        
        // Setup start button (only once)
        if (!this.buttonSetup) {
            const startBtn = document.getElementById('startBtn');
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    // Go to name input screen first
                    this.game.changeScreen('nameInput');
                });
                this.buttonSetup = true;
            }
        }
    }

    /**
     * Update title screen
     */
    update() {
        this.guide.update();
        
        // Update fireflies
        this.fireflies.forEach(firefly => {
            firefly.x += firefly.vx;
            firefly.y += firefly.vy;
            firefly.phase += 0.05;
            
            // Wrap around screen
            if (firefly.x < 0) firefly.x = CONFIG.canvas.width;
            if (firefly.x > CONFIG.canvas.width) firefly.x = 0;
            if (firefly.y < 0) firefly.y = CONFIG.canvas.height;
            if (firefly.y > CONFIG.canvas.height) firefly.y = 0;
            
            // Random direction changes
            if (Math.random() < 0.02) {
                firefly.vx = (Math.random() - 0.5) * 0.5;
                firefly.vy = (Math.random() - 0.5) * 0.5;
            }
        });
    }

    /**
     * Draw title screen
     */
    draw(ctx) {
        // Clear canvas
        ctx.fillStyle = CONFIG.colors.background;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Draw decorative forest elements
        this.drawForestBackground(ctx);

        // Draw fireflies
        this.drawFireflies(ctx);

        // Draw guide character
        this.guide.draw(ctx);

        // Draw sparkles around the scene
        this.drawSparkles(ctx);
    }

    /**
     * Draw background forest elements
     */
    drawForestBackground(ctx) {
        // Cozy gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvas.height);
        gradient.addColorStop(0, '#e8f4f8');  // Soft sky blue
        gradient.addColorStop(0.6, '#f5f0e8'); // Warm cream
        gradient.addColorStop(1, '#e8dcc8');   // Sandy beige
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Distant hills (back layer)
        ctx.fillStyle = 'rgba(168, 198, 159, 0.2)';
        ctx.beginPath();
        ctx.moveTo(0, CONFIG.canvas.height * 0.55);
        ctx.quadraticCurveTo(300, CONFIG.canvas.height * 0.45, 600, CONFIG.canvas.height * 0.55);
        ctx.quadraticCurveTo(700, CONFIG.canvas.height * 0.6, CONFIG.canvas.width, CONFIG.canvas.height * 0.5);
        ctx.lineTo(CONFIG.canvas.width, CONFIG.canvas.height);
        ctx.lineTo(0, CONFIG.canvas.height);
        ctx.closePath();
        ctx.fill();
        
        // Mid-distance hills (front layer)
        ctx.fillStyle = 'rgba(168, 198, 159, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, CONFIG.canvas.height * 0.5);
        ctx.quadraticCurveTo(200, CONFIG.canvas.height * 0.4, 400, CONFIG.canvas.height * 0.5);
        ctx.quadraticCurveTo(600, CONFIG.canvas.height * 0.6, CONFIG.canvas.width, CONFIG.canvas.height * 0.5);
        ctx.lineTo(CONFIG.canvas.width, CONFIG.canvas.height);
        ctx.lineTo(0, CONFIG.canvas.height);
        ctx.closePath();
        ctx.fill();

        // Trees with proper tree shapes
        const trees = [
            { x: 100, y: 200, size: 60, layers: 3 },
            { x: 670, y: 250, size: 80, layers: 4 },
            { x: 200, y: 450, size: 50, layers: 3 },
            { x: 700, y: 500, size: 70, layers: 3 }
        ];

        trees.forEach(tree => {
            // Tree trunk
            ctx.fillStyle = '#8b7355';
            const trunkWidth = tree.size / 5;
            const trunkHeight = tree.size * 1.5;
            ctx.fillRect(tree.x - trunkWidth / 2, tree.y, trunkWidth, trunkHeight);

            // Trunk shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(tree.x + trunkWidth / 4, tree.y, 2, trunkHeight);

            // Tree foliage - layered triangular shape
            const foliageColors = ['#4a7c59', '#5a8c69', '#7fb69e'];
            
            for (let i = 0; i < tree.layers; i++) {
                const layerY = tree.y - (i * tree.size / 4);
                const layerWidth = tree.size * (1 - i * 0.15);
                
                ctx.fillStyle = foliageColors[i % foliageColors.length];
                ctx.beginPath();
                ctx.moveTo(tree.x, layerY - tree.size / 3);
                ctx.lineTo(tree.x - layerWidth / 2, layerY + tree.size / 6);
                ctx.lineTo(tree.x + layerWidth / 2, layerY + tree.size / 6);
                ctx.closePath();
                ctx.fill();

                // Add highlight on left side
                ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.beginPath();
                ctx.moveTo(tree.x, layerY - tree.size / 3);
                ctx.lineTo(tree.x - layerWidth / 4, layerY);
                ctx.lineTo(tree.x, layerY + tree.size / 6);
                ctx.closePath();
                ctx.fill();
            }
        });

        // Ground grass
        ctx.fillStyle = '#a8c69f';
        ctx.fillRect(0, CONFIG.canvas.height - 80, CONFIG.canvas.width, 80);

        // Wavy grass blades (animated)
        ctx.strokeStyle = 'rgba(127, 182, 158, 0.4)';
        ctx.lineWidth = 2;
        
        const time = performance.now() * 0.002; // Slow animation speed
        
        for (let i = 0; i < this.grassBlades.length; i++) {
            const blade = this.grassBlades[i];
            const sway = Math.sin(time + blade.phase) * 2; // Gentle sway
            
            ctx.beginPath();
            ctx.moveTo(blade.x, blade.y);
            ctx.quadraticCurveTo(
                blade.x + sway,
                blade.y - blade.height / 2,
                blade.x + sway,
                blade.y - blade.height
            );
            ctx.strokeStyle = 'rgba(74, 124, 89, 0.4)';
            ctx.stroke();
        }

        // Flowers
        const flowerPositions = [
            { x: 150, y: CONFIG.canvas.height - 40 },
            { x: 350, y: CONFIG.canvas.height - 50 },
            { x: 550, y: CONFIG.canvas.height - 45 },
            { x: 680, y: CONFIG.canvas.height - 35 }
        ];

        flowerPositions.forEach(flower => {
            // Flower petals
            ctx.fillStyle = '#ffb3ba';
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2;
                const petalX = flower.x + Math.cos(angle) * 6;
                const petalY = flower.y + Math.sin(angle) * 6;
                ctx.beginPath();
                ctx.arc(petalX, petalY, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Flower center
            ctx.fillStyle = '#ffd89b';
            ctx.beginPath();
            ctx.arc(flower.x, flower.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /**
     * Draw fireflies flying around
     */
    drawFireflies(ctx) {
        this.fireflies.forEach(firefly => {
            const glow = Math.sin(firefly.phase) * 0.5 + 0.5;
            const alpha = firefly.brightness * glow;
            
            // Outer glow
            const gradient = ctx.createRadialGradient(
                firefly.x, firefly.y, 0,
                firefly.x, firefly.y, 15
            );
            gradient.addColorStop(0, `rgba(255, 255, 150, ${alpha * 0.8})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 100, ${alpha * 0.4})`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(firefly.x, firefly.y, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Core light
            ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
            ctx.beginPath();
            ctx.arc(firefly.x, firefly.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
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
            
            ctx.fillStyle = `rgba(255, 215, 155, ${alpha * 0.6})`;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}