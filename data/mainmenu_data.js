/* =========================
   CONFIGURATION
========================= */
const MENU_CONFIG = {
    boxSize: 25,
    radius: 200,
    projectileSpeed: 10,
    projectileSize: 10,
    textFont: "20px Roboto Mono",
    scaledTextFont: "40px Roboto Mono",
    hitDistance: 30,
    transitionSpeed: {
        alpha: 0.1,
        radius: 10,
        scale: 0.05,
        scaleDecrease: 0.02
    },
    items: [
        { label: "Contacts", action: () => contactsCanvas() },
        { label: "Experience", action: () => experienceCanvas() },
        { label: "Project", action: () => projectCanvas() },
        { label: "About", action: () => aboutCanvas() },
        { label: "Skills", action: () => skillsCanvas() },
        { label: "Prototypes", action: () => prototypesCanvas() }
    ],
    angles: [
        Math.PI / 2,           // 0: Contacts (top)
        (Math.PI / 6) * 5,     // 1: Experience
        (Math.PI / 6) * 7,     // 2: Project
        (Math.PI / 2) * 3,     // 3: About (bottom)
        (Math.PI / 6) * 11,    // 4: Skills
        (Math.PI / 6) * 13     // 5: Prototypes
    ]
};

const COLORS = {
    white: "white",
    black: "black",
    whiteTransparent: (alpha) => `rgba(255, 255, 255, ${alpha})`
};