// Data Configuration (JSON format)
const PROTOTYPE_CONFIG = {
    cursor: {
        imageSrc: 'assets/aimCursor.png',
        size: 50,
        speed: 5,
        aimThreshold: 10
    },
    animation: {
        maxOffset: 1,
        swingSpeed: 0.05
    },
    items: [
        {
            id: 0,
            position: { x: 16, y: 23 }, // in percentage
            color: "red",
            link: "https://google.com",
            label: "Portofolio"
        },
        {
            id: 1,
            position: { x: 56, y: 73 }, // in percentage
            color: "purple",
            link: "https://youtu.be/dQw4w9WgXcQ?si=lqJuyITXD8Vb1X3f",
            label: "SuperAI 122"
        },
        {
            id: 2,
            position: { x: 40, y: 50 }, // in percentage
            color: "blue",
            link: "https://example.com",
            label: "Third item!"
        }
    ],
    connections: [
        [0, 1] // Connect item 0 to item 1
    ],
    ui: {
        itemSize: 15,
        fontSize: 16,
        fontFamily: "Roboto mono",
        textOffset: 10
    }
};
