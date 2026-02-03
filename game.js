/**
 * GAME MANAGER
 * Central game controller that manages screens and game state
 */

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = CONFIG.canvas.width;
        this.canvas.height = CONFIG.canvas.height;
        
        // Initialize screens
        this.screens = {
            title: new TitleScreen(this),
            tutorial: new TutorialScreen(this),
            level: new LevelScreen(this),
            transition: new TransitionScreen(this),
            valentine: new ValentineScreen(this)
        };
        
        // Current screen
        this.currentScreen = null;
        
        // Game state
        this.state = {
            completedLevels: []
        };
        
        // Input handling
        this.setupInput();
    }

    /**
     * Setup keyboard input
     */
    setupInput() {
        // Track key presses
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
    }

    /**
     * Handle key down
     */
    handleKeyDown(e) {
        // Only handle input during level screen
        if (this.currentScreen !== this.screens.level) return;
        
        const player = this.screens.level.player;
        if (!player) return;
        
        switch(e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                player.keys.up = true;
                e.preventDefault();
                break;
            case 'arrowdown':
            case 's':
                player.keys.down = true;
                e.preventDefault();
                break;
            case 'arrowleft':
            case 'a':
                player.keys.left = true;
                e.preventDefault();
                break;
            case 'arrowright':
            case 'd':
                player.keys.right = true;
                e.preventDefault();
                break;
        }
    }

    /**
     * Handle key up
     */
    handleKeyUp(e) {
        // Only handle input during level screen
        if (this.currentScreen !== this.screens.level) return;
        
        const player = this.screens.level.player;
        if (!player) return;
        
        switch(e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                player.keys.up = false;
                break;
            case 'arrowdown':
            case 's':
                player.keys.down = false;
                break;
            case 'arrowleft':
            case 'a':
                player.keys.left = false;
                break;
            case 'arrowright':
            case 'd':
                player.keys.right = false;
                break;
        }
    }

    /**
     * Change to a different screen
     * @param {string} screenName - Name of screen to change to
     * @param {*} data - Optional data to pass to screen
     */
    changeScreen(screenName, data) {
        const screen = this.screens[screenName];
        
        if (!screen) {
            console.error(`Screen "${screenName}" not found`);
            return;
        }
        
        this.currentScreen = screen;
        screen.enter(data);
    }

    /**
     * Update game
     */
    update() {
        if (this.currentScreen) {
            this.currentScreen.update();
        }
    }

    /**
     * Draw game
     */
    draw() {
        if (this.currentScreen) {
            this.currentScreen.draw(this.ctx);
        }
    }

    /**
     * Start the game
     */
    start() {
        this.changeScreen('title');
        this.gameLoop();
    }

    /**
     * Main game loop
     */
    gameLoop() {
        this.update();
        this.draw();
        
        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }
}
