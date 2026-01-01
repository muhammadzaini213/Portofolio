// Data Configuration (JSON format)
const PROTOTYPE_CONFIG = {
    cursor: {
        imageSrc: 'assets/prototypes/aimCursor.png',
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
            position: { x: 40, y: 80 }, // in percentage
            color: "purple",
            link: "https://github.com/sleepymor/StardustStudio-YAPPIECleaningService",
            label: "YAPPIE Cleaning Service!"
        },
        {
            id: 2,
            position: { x: 70, y: 70 }, // in percentage
            color: "purple",
            link: "https://github.com/sleepymor/GlobalIllumination-GimersiaJam",
            label: "Deck Of Ascent"
        }
    ],
    connections: [
    ],
    ui: {
        itemSize: 15,
        fontSize: 16,
        fontFamily: "Roboto mono",
        textOffset: 10
    }
};
