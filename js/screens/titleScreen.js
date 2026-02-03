/**
 * TITLE SCREEN
 * The initial screen when the game loads
 */

class TitleScreen {
    constructor(game) {
        this.game = game;
        this.guide = new Guide(CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 - 50);
        
        // Setup start button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.game.changeScreen('tutorial');
        });
    }

    /**
     * Called when entering this screen
     */
    enter() {
        Utils.hideAllScreens();
        Utils.showUI('titleUI');
    }

    /**
     * Update title screen
     */
    update() {
        this.guide.update();
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

        // Draw guide character
        this.guide.draw(ctx);

        // Draw sparkles around the scene
        this.drawSparkles(ctx);
    }

    /**
     * Draw background forest elements
     */
    drawForestBackground(ctx) {
        // Trees
        const trees = [
            { x: 100, y: 200, size: 60 },
            { x: 650, y: 150, size: 80 },
            { x: 200, y: 450, size: 50 },
            { x: 700, y: 500, size: 70 }
        ];

        trees.forEach(tree => {
            // Tree trunk
            ctx.fillStyle = '#8b7355';
            ctx.fillRect(tree.x - 10, tree.y + tree.size / 2, 20, tree.size);

            // Tree foliage
            ctx.fillStyle = '#7fb69e';
            ctx.beginPath();
            ctx.arc(tree.x, tree.y, tree.size / 2, 0, Math.PI * 2);
            ctx.fill();

            // Tree highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(tree.x - tree.size / 6, tree.y - tree.size / 6, tree.size / 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Grass tufts
        ctx.fillStyle = '#a8c69f';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * CONFIG.canvas.width;
            const y = CONFIG.canvas.height - Math.random() * 100;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
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
