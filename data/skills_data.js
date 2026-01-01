// Data Configuration (JSON format)
const SKILLS_CONFIG = {
    player: {
        width: 25,
        height: 25,
        color: "white",
        speed: 5
    },
    projectile: {
        width: 10,
        height: 10,
        color: "white",
        speed: 10
    },
    animation: {
        maxOffset: 1,
        swingSpeed: 0.05
    },
    items: [
        {
            id: 0,
            position: { x: 16, y: 23 }, // in percentage
            imageSrc: "assets/skills/expressjs.png",
            label: "Express.js"
        },
        {
            id: 1,
            position: { x: 30, y: 25 },
            imageSrc: "assets/skills/nodejs.png",
            label: "Node.js"
        },
        {
            id: 2,
            position: { x: 50, y: 40 },
            imageSrc: "assets/skills/css3.png",
            label: "CSS"
        },
        {
            id: 3,
            position: { x: 45, y: 50 },
            imageSrc: "assets/skills/javascript.png",
            label: "Javascript"
        },
        {
            id: 4,
            position: { x: 41, y: 58 },
            imageSrc: "assets/skills/html5.png",
            label: "HTML"
        },
        {
            id: 5,
            position: { x: 15, y: 60 },
            imageSrc: "assets/skills/python.png",
            label: "Python"
        },
        {
            id: 6,
            position: { x: 54, y: 55 },
            imageSrc: "assets/skills/firebase.png",
            label: "Firebase"
        },
        {
            id: 7,
            position: { x: 54, y: 72 },
            imageSrc: "assets/skills/unity.png",
            label: "Unity"
        },
        {
            id: 8,
            position: { x: 70, y: 80 },
            imageSrc: "assets/skills/godot.png",
            label: "Godot"
        },
        {
            id: 9,
            position: { x: 65, y: 36 },
            imageSrc: "assets/skills/android.png",
            label: "Android"
        },
        {
            id: 10,
            position: { x: 75, y: 42 },
            imageSrc: "assets/skills/java.png",
            label: "Java"
        },
        {
            id: 11,
            position: { x: 82, y: 41 },
            imageSrc: "assets/skills/kotlin.png",
            label: "Kotlin"
        }
    ],
    connections: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [3, 6],
        [6, 7],
        [7, 8],
        [6, 9],
        [9, 10],
        [10, 11]
    ],
    ui: {
        itemSize: 35,
        fontSize: 16,
        fontFamily: "Roboto mono",
        textOffset: 10,
        hitTextDuration: 2000,
        shakeDuration: 200,
        shakeIntensity: 5,
        shakeInterval: 50
    }
};