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

    // Light color options for player selection
    lightColors: [
        {
            name: 'Warm White',
            color: '#fff8e7',
            glow: '#ffd89b'
        },
        {
            name: 'Soft Yellow',
            color: '#ffe680',
            glow: '#ffd700'
        },
        {
            name: 'Sky Blue',
            color: '#87ceeb',
            glow: '#4da6ff'
        },
        {
            name: 'Lavender',
            color: '#e6b3ff',
            glow: '#cc99ff'
        },
        {
            name: 'Peach',
            color: '#ffcc99',
            glow: '#ffb366'
        },
        {
            name: 'Mint Green',
            color: '#98fb98',
            glow: '#7fb69e'
        }
    ],

    // Player settings (now a light character)
    player: {
        size: 30,
        speed: 3, // Increased from 4 for more responsive movement
        trailLength: 12 // Number of trail particles
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
    // Use {name} placeholder for personalized dialogue
    dialogue: {
        namePrompt: "Before we begin, what should I call you?",
        
        tutorial: [
            "Welcome{name}! I'm Lumis, your forest guide.",
            "Use arrow keys or WASD to move around.",
            "Collect the glowing orbs to restore the forest's magic!",
            "Let's begin this cozy adventure together."
        ],
        
        level1Start: "The forest whispers to those who listen{name}. Find the orbs of light!",
        level1Complete: "You did wonderfully{name}! The forest is starting to glow again.",
        
        level2Start: "The magic grows stronger{name}. Can you feel it in the air?",
        level2Complete: "Your kindness brings warmth to these woods{name}. Keep going!",
        
        level3Start: "This is the final gathering{name}. Take your time and enjoy the peace.",
        level3Complete: "The forest is whole again, thanks to you{name}. You have a special heart.",
        
        transition: "One last thing{name}...",
        
        valentine: "Will you be my Valentine{name}?"
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