/**
 * GAME CONFIGURATION
 * All game settings, dialogue, and adjustable content in one place
 * EDIT THIS FILE to customize dialogue, level settings, and game parameters
 */

const CONFIG = {
    // Canvas settings
    canvas: {
        width: 800,
        height: 600
    },

    // Game colors (can be customized)
    colors: {
        background: '#faf8f3',
        player: '#4a7c59',
        guide: '#ffd89b',
        collectible: '#ffb3ba',
        obstacle: '#2d4a3e',
        goal: '#7fb69e'
    },

    // Player settings
    player: {
        size: 30,
        speed: 4,
        color: '#4a7c59'
    },

    // Guide character settings
    guide: {
        size: 50,  // Slightly larger for Totoro's round body
        color: '#c9b896',  // Warm grey-beige (Totoro color)
        glowColor: 'rgba(255, 215, 155, 0.3)'
    },

    // Collectible settings
    collectible: {
        size: 20,
        color: '#ffb3ba',
        glowColor: 'rgba(255, 179, 186, 0.6)'
    },

    // DIALOGUE - Easy to replace!
    // Each line appears in sequence during the game
    dialogue: {
        tutorial: [
            "Welcome, dear friend! I'm Lumis, your forest guide.",
            "Use arrow keys or WASD to move around.",
            "Collect the glowing orbs to restore the forest's magic!",
            "Let's begin this cozy adventure together."
        ],
        
        level1Start: "The forest whispers to those who listen. Find the orbs of light!",
        level1Complete: "You did wonderfully! The forest is starting to glow again.",
        
        level2Start: "The magic grows stronger. Can you feel it in the air?",
        level2Complete: "Your kindness brings warmth to these woods. Keep going!",
        
        level3Start: "This is the final gathering. Take your time and enjoy the peace.",
        level3Complete: "The forest is whole again, thanks to you. You have a special heart.",
        
        transition: "One last thing...",
        
        valentine: "Will you be my Valentine?"
    },

    // LEVEL DEFINITIONS
    // Easy to modify: add/remove collectibles, change positions, adjust difficulty
    levels: [
        // LEVEL 1 - Easy introduction
        {
            name: "Awakening Grove",
            playerStart: { x: 100, y: 300 },
            guidePosition: { x: 700, y: 100 },
            collectibles: [
                { x: 200, y: 150 },
                { x: 400, y: 200 },
                { x: 600, y: 150 },
                { x: 300, y: 400 },
                { x: 500, y: 450 }
            ],
            obstacles: [] // No obstacles in level 1
        },
        
        // LEVEL 2 - Medium difficulty with obstacles
        {
            name: "Whispering Woods",
            playerStart: { x: 100, y: 500 },
            guidePosition: { x: 700, y: 300 },
            collectibles: [
                { x: 300, y: 100 },
                { x: 500, y: 150 },
                { x: 200, y: 300 },
                { x: 600, y: 400 },
                { x: 400, y: 500 },
                { x: 650, y: 150 }
            ],
            obstacles: [
                { x: 250, y: 200, width: 100, height: 20 },
                { x: 450, y: 300, width: 20, height: 150 },
                { x: 350, y: 400, width: 120, height: 20 }
            ]
        },
        
        // LEVEL 3 - Easy and calm, emotionally warm
        {
            name: "Heartwood Haven",
            playerStart: { x: 400, y: 500 },
            guidePosition: { x: 400, y: 100 },
            collectibles: [
                { x: 250, y: 250 },
                { x: 550, y: 250 },
                { x: 250, y: 350 },
                { x: 550, y: 350 },
                { x: 400, y: 300 } // Heart center
            ],
            obstacles: [] // No obstacles - peaceful ending
        }
    ]
};