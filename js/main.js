/**
 * MAIN ENTRY POINT
 * Initializes and starts the game when the page loads
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Get canvas element
    const canvas = document.getElementById('gameCanvas');
    
    // Create game instance
    const game = new Game(canvas);
    
    // Start the game
    game.start();
    
    // Log to console
    console.log('🌲 Whispers of the Forest - Game Started');
    console.log('💖 A cozy adventure awaits...');
});