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
        guide: '#c9b896',
        collectible: '#ffb3ba',
        obstacle: '#2d4a3e',
        goal: '#7fb69e',
        platform: '#8b7355',
        key: '#ffd700',
        gate: '#ff6b6b',
        heart: '#ff69b4',
        fog: 'rgba(200, 200, 220, 0.7)'
    },

    // Player settings
    player: {
        size: 30,
        speed: 4,
        color: '#4a7c59'
    },

    // Guide character settings
    guide: {
        size: 50,
        color: '#c9b896',
        glowColor: 'rgba(255, 215, 155, 0.3)'
    },

    // Collectible settings
    collectible: {
        size: 20,
        color: '#ffb3ba',
        glowColor: 'rgba(255, 179, 186, 0.6)'
    },

    // Moving platform settings
    platform: {
        speed: 1.5,
        color: '#8b7355'
    },

    // DIALOGUE - Emotionally progresses through three parts
    dialogue: {
        tutorial: [
            "Welcome, dear friend! I'm Totoro, your forest guide.",
            "Use arrow keys or WASD to move around.",
            "Collect the glowing orbs to restore the forest's magic!",
            "Let's begin this cozy adventure together."
        ],
        
        // PART 1: DISCOVERY - Neutral, encouraging
        part1Intro: "The forest awaits. Let's explore together.",
        
        level1Start: "Let's see what we can find here.",
        level1Complete: "You're getting the hang of it!",
        
        level2Start: "This path looks interesting.",
        level2Complete: "Nice work! You're a natural.",
        
        level3Start: "Take your time. There's no rush.",
        level3Complete: "It's nice not rushing, isn't it?",
        
        level4Start: "Some orbs might not stay forever.",
        level4Complete: "You found them all! Well done.",
        
        part1Complete: "You've brought light back to the first grove. Thank you.",
        
        // PART 2: CONNECTION - Warm, supportive, subtly emotional
        part2Intro: "The deeper woods call to us. I'll guide you.",
        
        level5Start: "Some paths are easier when you don't rush.",
        level5Complete: "We make a good team, don't we?",
        
        level6Start: "Not every path leads where you expect.",
        level6Complete: "I'll stay here if you need me.",
        
        level7Start: "The fog hides secrets. Move slowly to see clearly.",
        level7Complete: "I like figuring things out together.",
        
        level8Start: "Sometimes the right key opens unexpected doors.",
        level8Complete: "You're thoughtful. I appreciate that.",
        
        part2Complete: "These woods feel warmer now. Because of you.",
        
        // PART 3: INTENTION - Clearly emotional and personal
        part3Intro: "There's something special ahead. Something I want to share with you.",
        
        level9Start: "Collect the hearts. Each one matters to me.",
        level9Complete: "I didn't expect to enjoy this so much.",
        
        level10Start: "These lanterns light more than just the path.",
        level10Complete: "Some moments are worth holding onto.",
        
        level11Start: "Find the notes I left. They're for you.",
        level11Complete: "I hope you found them meaningful.",
        
        level12Start: "The stars shine brightest when we're together.",
        level12Complete: "There's something I've been wanting to say.",
        
        part3Complete: "Thank you for walking this path with me.",
        
        // TRANSITION & VALENTINE
        transition: "Playing together made me realize something...",
        transitionContinued: "I don't just like the game. I like you.",
        valentine: "Will you be my Valentine?"
    },

    // THREE PARTS - Each with multiple levels and progressive mechanics
    parts: [
        // ===================================
        // PART 1: DISCOVERY (Levels 1-4)
        // ===================================
        {
            name: "Discovery",
            theme: "exploration",
            levels: [
                // Level 1 - Basic collection
                {
                    name: "Morning Meadow",
                    partNumber: 1,
                    levelNumber: 1,
                    playerStart: { x: 100, y: 500 },
                    guidePosition: { x: 700, y: 100 },
                    collectibleType: 'orb',
                    collectibles: [
                        { x: 200, y: 400 },
                        { x: 400, y: 300 },
                        { x: 600, y: 400 },
                        { x: 300, y: 150 },
                        { x: 500, y: 150 }
                    ],
                    bonusCollectibles: [
                        { x: 100, y: 100 }
                    ],
                    obstacles: [],
                    platforms: [],
                    mechanics: []
                },
                
                // Level 2 - Larger map with obstacles
                {
                    name: "Sunny Clearing",
                    partNumber: 1,
                    levelNumber: 2,
                    playerStart: { x: 50, y: 550 },
                    guidePosition: { x: 750, y: 50 },
                    collectibleType: 'orb',
                    collectibles: [
                        { x: 150, y: 450 },
                        { x: 250, y: 250 },
                        { x: 450, y: 400 },
                        { x: 650, y: 250 },
                        { x: 550, y: 100 },
                        { x: 350, y: 500 }
                    ],
                    bonusCollectibles: [
                        { x: 750, y: 550 }
                    ],
                    obstacles: [
                        { x: 200, y: 350, width: 150, height: 20 },
                        { x: 500, y: 300, width: 20, height: 120 }
                    ],
                    platforms: [],
                    mechanics: []
                },
                
                // Level 3 - Moving platforms introduced
                {
                    name: "Drifting Brook",
                    partNumber: 1,
                    levelNumber: 3,
                    playerStart: { x: 100, y: 300 },
                    guidePosition: { x: 700, y: 300 },
                    collectibleType: 'orb',
                    collectibles: [
                        { x: 250, y: 150 },
                        { x: 400, y: 450 },
                        { x: 650, y: 150 },
                        { x: 550, y: 400 },
                        { x: 200, y: 500 }
                    ],
                    bonusCollectibles: [
                        { x: 400, y: 100 }
                    ],
                    obstacles: [
                        { x: 150, y: 250, width: 100, height: 20 },
                        { x: 550, y: 250, width: 100, height: 20 }
                    ],
                    platforms: [
                        { x: 300, y: 300, width: 80, height: 15, startX: 300, endX: 500, axis: 'x' }
                    ],
                    mechanics: ['movingPlatforms']
                },
                
                // Level 4 - Timed orbs (disappearing)
                {
                    name: "Twilight Path",
                    partNumber: 1,
                    levelNumber: 4,
                    playerStart: { x: 400, y: 550 },
                    guidePosition: { x: 400, y: 50 },
                    collectibleType: 'orb',
                    collectibles: [
                        { x: 200, y: 400 },
                        { x: 600, y: 400 },
                        { x: 300, y: 200 },
                        { x: 500, y: 200 }
                    ],
                    timedCollectibles: [
                        { x: 400, y: 300, timer: 300 }, // 5 seconds
                        { x: 250, y: 450, timer: 360 }  // 6 seconds
                    ],
                    bonusCollectibles: [
                        { x: 100, y: 100 }
                    ],
                    obstacles: [
                        { x: 350, y: 350, width: 100, height: 20 }
                    ],
                    platforms: [],
                    mechanics: ['timedCollectibles']
                }
            ]
        },
        
        // ===================================
        // PART 2: CONNECTION (Levels 5-8)
        // ===================================
        {
            name: "Connection",
            theme: "paths",
            levels: [
                // Level 5 - Path choices
                {
                    name: "Forked Trail",
                    partNumber: 2,
                    levelNumber: 5,
                    playerStart: { x: 400, y: 550 },
                    guidePosition: { x: 400, y: 50 },
                    collectibleType: 'orb',
                    collectibles: [
                        { x: 200, y: 300 },
                        { x: 600, y: 300 },
                        { x: 150, y: 100 },
                        { x: 650, y: 100 },
                        { x: 400, y: 150 }
                    ],
                    bonusCollectibles: [
                        { x: 100, y: 500 },
                        { x: 700, y: 500 }
                    ],
                    obstacles: [
                        { x: 350, y: 400, width: 20, height: 150 },
                        { x: 430, y: 400, width: 20, height: 150 },
                        { x: 200, y: 200, width: 80, height: 20 },
                        { x: 520, y: 200, width: 80, height: 20 }
                    ],
                    platforms: [
                        { x: 150, y: 450, width: 60, height: 15, startY: 350, endY: 500, axis: 'y' },
                        { x: 590, y: 450, width: 60, height: 15, startY: 350, endY: 500, axis: 'y' }
                    ],
                    mechanics: ['movingPlatforms', 'pathChoice']
                },
                
                // Level 6 - Backtracking design
                {
                    name: "Winding Grove",
                    partNumber: 2,
                    levelNumber: 6,
                    playerStart: { x: 50, y: 300 },
                    guidePosition: { x: 750, y: 300 },
                    collectibleType: 'orb',
                    collectibles: [
                        { x: 200, y: 100 },
                        { x: 400, y: 500 },
                        { x: 600, y: 100 },
                        { x: 700, y: 400 },
                        { x: 300, y: 300 }
                    ],
                    bonusCollectibles: [
                        { x: 100, y: 500 }
                    ],
                    obstacles: [
                        { x: 250, y: 200, width: 20, height: 200 },
                        { x: 530, y: 200, width: 20, height: 200 }
                    ],
                    platforms: [],
                    mechanics: []
                },
                
                // Level 7 - Fog mechanic
                {
                    name: "Misty Hollow",
                    partNumber: 2,
                    levelNumber: 7,
                    playerStart: { x: 100, y: 500 },
                    guidePosition: { x: 700, y: 100 },
                    collectibleType: 'orb',
                    collectibles: [
                        { x: 300, y: 400 },
                        { x: 500, y: 300 },
                        { x: 600, y: 450 },
                        { x: 250, y: 200 },
                        { x: 650, y: 200 }
                    ],
                    bonusCollectibles: [
                        { x: 400, y: 100 }
                    ],
                    obstacles: [
                        { x: 200, y: 350, width: 120, height: 20 },
                        { x: 480, y: 250, width: 120, height: 20 }
                    ],
                    platforms: [],
                    fog: true,
                    fogRadius: 100,
                    mechanics: ['fog']
                },
                
                // Level 8 - Keys and gates
                {
                    name: "Locked Garden",
                    partNumber: 2,
                    levelNumber: 8,
                    playerStart: { x: 100, y: 500 },
                    guidePosition: { x: 700, y: 100 },
                    collectibleType: 'orb',
                    collectibles: [
                        { x: 650, y: 150 },
                        { x: 550, y: 400 },
                        { x: 300, y: 200 }
                    ],
                    bonusCollectibles: [
                        { x: 750, y: 500 }
                    ],
                    keys: [
                        { x: 200, y: 400, id: 1 },
                        { x: 400, y: 300, id: 2 }
                    ],
                    gates: [
                        { x: 300, y: 250, width: 20, height: 100, keyId: 1 },
                        { x: 500, y: 350, width: 100, height: 20, keyId: 2 }
                    ],
                    obstacles: [],
                    platforms: [],
                    mechanics: ['keysAndGates']
                }
            ]
        },
        
        // ===================================
        // PART 3: INTENTION (Levels 9-12)
        // ===================================
        {
            name: "Intention",
            theme: "hearts",
            levels: [
                // Level 9 - Hearts instead of orbs
                {
                    name: "Heart's Clearing",
                    partNumber: 3,
                    levelNumber: 9,
                    playerStart: { x: 400, y: 500 },
                    guidePosition: { x: 400, y: 100 },
                    collectibleType: 'heart',
                    collectibles: [
                        { x: 250, y: 300 },
                        { x: 550, y: 300 },
                        { x: 400, y: 200 },
                        { x: 300, y: 450 },
                        { x: 500, y: 450 }
                    ],
                    requiredCount: 3, // Not all required
                    bonusCollectibles: [],
                    obstacles: [
                        { x: 200, y: 350, width: 80, height: 15 },
                        { x: 520, y: 350, width: 80, height: 15 }
                    ],
                    platforms: [],
                    mechanics: ['optionalCollectibles']
                },
                
                // Level 10 - Lanterns (light mechanic)
                {
                    name: "Lantern Path",
                    partNumber: 3,
                    levelNumber: 10,
                    playerStart: { x: 100, y: 300 },
                    guidePosition: { x: 700, y: 300 },
                    collectibleType: 'lantern',
                    collectibles: [
                        { x: 250, y: 150 },
                        { x: 550, y: 150 },
                        { x: 400, y: 400 },
                        { x: 200, y: 500 },
                        { x: 600, y: 500 }
                    ],
                    requiredCount: 4,
                    bonusCollectibles: [],
                    obstacles: [
                        { x: 350, y: 250, width: 100, height: 20 }
                    ],
                    platforms: [
                        { x: 300, y: 350, width: 80, height: 15, startX: 300, endX: 420, axis: 'x' }
                    ],
                    mechanics: ['optionalCollectibles', 'movingPlatforms']
                },
                
                // Level 11 - Notes/letters
                {
                    name: "Whispered Words",
                    partNumber: 3,
                    levelNumber: 11,
                    playerStart: { x: 50, y: 550 },
                    guidePosition: { x: 750, y: 50 },
                    collectibleType: 'note',
                    collectibles: [
                        { x: 200, y: 450 },
                        { x: 400, y: 300 },
                        { x: 600, y: 450 },
                        { x: 300, y: 150 },
                        { x: 500, y: 150 }
                    ],
                    requiredCount: 4,
                    bonusCollectibles: [],
                    obstacles: [
                        { x: 250, y: 350, width: 20, height: 120 },
                        { x: 530, y: 350, width: 20, height: 120 }
                    ],
                    platforms: [],
                    fog: true,
                    fogRadius: 120,
                    mechanics: ['optionalCollectibles', 'fog']
                },
                
                // Level 12 - Stars (final level before valentine)
                {
                    name: "Starlit Haven",
                    partNumber: 3,
                    levelNumber: 12,
                    playerStart: { x: 400, y: 500 },
                    guidePosition: { x: 400, y: 100 },
                    collectibleType: 'star',
                    collectibles: [
                        { x: 250, y: 250 },
                        { x: 550, y: 250 },
                        { x: 250, y: 350 },
                        { x: 550, y: 350 },
                        { x: 400, y: 300 },
                        { x: 400, y: 200 }
                    ],
                    requiredCount: 5,
                    bonusCollectibles: [],
                    obstacles: [],
                    platforms: [],
                    mechanics: ['optionalCollectibles']
                }
            ]
        }
    ]
};