function prototypesCanvas() {
    let enteredItemId = false;
    let currentAimedItemIndex = null;

    class AimCursor {
        constructor(context, canvas, config) {
            this.context = context;
            this.canvas = canvas;
            this.x = canvas.width / 4;
            this.y = canvas.height / 4;
            this.size = config.size;
            this.speed = config.speed;
            this.threshold = config.aimThreshold;
            this.image = new Image();
            this.image.src = config.imageSrc;
            this.image.onload = () => this.redraw();
        }

        aimAtItem(items) {
            const threshold = this.size / 2 + this.threshold;

            for (let item of items) {
                const dx = this.x - (item.x + item.hitOffset.x);
                const dy = this.y - (item.y + item.hitOffset.y);
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < threshold) {
                    return item;
                }
            }
            return null;
        }

        move(direction) {
            const movements = {
                'up': () => this.y -= this.speed,
                'down': () => this.y += this.speed,
                'left': () => this.x -= this.speed,
                'right': () => this.x += this.speed
            };

            if (movements[direction]) {
                movements[direction]();
                this.redraw();
            }
        }

        drawCursor() {
            if (this.image.complete) {
                const { x, y, size, image } = this;
                this.context.drawImage(image, x - size / 2, y - size / 2, size, size);
            }
        }

        redraw() {
            this.drawCursor();
        }
    }

    class Constellation {
        constructor(context, canvas, config) {
            this.context = context;
            this.canvas = canvas;
            this.config = config;
            this.items = [];
            this.connections = [];
            this.time = 0;
        }

        initializeItems(itemsData, widthPer, heightPer) {
            itemsData.forEach(data => {
                this.addItem(
                    widthPer * data.position.x,
                    heightPer * data.position.y,
                    data.color,
                    data.link,
                    data.label,
                    data.id
                );
            });
        }

        addItem(x, y, color, link, label, id) {
            const item = {
                id,
                x,
                y,
                color,
                link,
                label,
                hitOffset: { x: 0, y: 0 },
                hitText: null,
                textShakeOffset: { x: 0, y: 0 }
            };
            this.items.push(item);
        }

        connectItems(index1, index2) {
            this.connections.push([index1, index2]);
        }

        swingAll() {
            const animate = () => {
                this.time += this.config.animation.swingSpeed;

                this.items.forEach((item, index) => {
                    const dx = Math.sin(this.time + index) * this.config.animation.maxOffset;
                    const dy = Math.cos(this.time + index) * this.config.animation.maxOffset;
                    item.hitOffset = { x: dx, y: dy };
                });

                this.redraw();
                requestAnimationFrame(animate);
            };

            animate();
        }

        drawItem(item) {
            const { x, y, color, hitOffset, hitText } = item;
            const size = this.config.ui.itemSize;
            const radius = size / 2;

            const displayX = x + hitOffset.x;
            const displayY = y + hitOffset.y;

            // Draw item rectangle
            this.context.fillStyle = color;
            this.context.beginPath();
            const width = radius * 1.6;
            const height = radius * 1.6;
            this.context.rect(displayX - width / 2, displayY - height / 2, width, height);
            this.context.fill();

            // Draw text if item is aimed at
            if (hitText) {
                const textX = displayX;
                const textY = displayY - radius - this.config.ui.textOffset;

                this.context.fillStyle = "white";
                this.context.font = `${this.config.ui.fontSize}px ${this.config.ui.fontFamily}`;
                this.context.textAlign = "center";

                const displayText = (enteredItemId == currentAimedItemIndex) ? "View?" : hitText;
                this.context.fillText(displayText, textX, textY);
            }
        }

        drawLine(x1, y1, x2, y2) {
            this.context.strokeStyle = "rgba(255, 255, 255, 0.3)";
            this.context.lineWidth = 2;
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.stroke();
        }

        redraw() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const aimedItem = aimCursorInstance.aimAtItem(this.items);
            const aimedItemIndex = this.items.indexOf(aimedItem);

            // Reset hit text for all items
            this.items.forEach(item => item.hitText = null);

            // Update current aimed item
            if (currentAimedItemIndex !== aimedItemIndex) {
                currentAimedItemIndex = aimedItemIndex;
            }

            // Set hit text for aimed item
            if (aimedItem && aimedItem.label) {
                aimedItem.hitText = aimedItem.label;
            }

            // Draw connections
            for (const [index1, index2] of this.connections) {
                const item1 = this.items[index1];
                const item2 = this.items[index2];
                this.drawLine(
                    item1.x + item1.hitOffset.x,
                    item1.y + item1.hitOffset.y,
                    item2.x + item2.hitOffset.x,
                    item2.y + item2.hitOffset.y
                );
            }

            // Draw items
            for (const item of this.items) {
                this.drawItem(item);
            }

            if (enteredItemId !== null && (!aimedItem || aimedItem.id !== enteredItemId)) {
                enteredItemId = null; // Reset ke normal
            }
        }
    }

    // Initialize canvas
    const prototypesDiv = document.getElementById("prototypes");
    document.getElementById("main-menu").classList.remove("show");
    prototypesDiv.classList.add("show");

    const prototypesCanvas = document.getElementById("prototypes-canvas");
    const context = prototypesCanvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    prototypesCanvas.width = prototypesCanvas.clientWidth * dpr;
    prototypesCanvas.height = prototypesCanvas.clientHeight * dpr;
    context.scale(dpr, dpr);

    // Initialize instances
    const constellation = new Constellation(context, prototypesCanvas, PROTOTYPE_CONFIG);
    const aimCursorInstance = new AimCursor(context, prototypesCanvas, PROTOTYPE_CONFIG.cursor);

    // Calculate position percentages
    const widthPer = prototypesCanvas.width / 100 / 2;
    const heightPer = prototypesCanvas.height / 100 / 2;

    // Initialize items from config
    constellation.initializeItems(PROTOTYPE_CONFIG.items, widthPer, heightPer);

    // Add connections from config
    PROTOTYPE_CONFIG.connections.forEach(([index1, index2]) => {
        constellation.connectItems(index1, index2);
    });

    // Start animations
    constellation.redraw();
    constellation.swingAll();
    aimCursorInstance.redraw();

    // Input handling
    const keysPressed = {};

    window.addEventListener("keydown", (event) => {
        keysPressed[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
        keysPressed[event.key] = false;
    });

    function handleMovement() {
        if (keysPressed['w']) aimCursorInstance.move('up');
        if (keysPressed['s']) aimCursorInstance.move('down');
        if (keysPressed['a']) aimCursorInstance.move('left');
        if (keysPressed['d']) aimCursorInstance.move('right');
    }

    // Enter key handler
    window.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            if (!enteredItemId && currentAimedItemIndex !== null) {
                enteredItemId = constellation.items[currentAimedItemIndex].id;
            } else {
                const aimedItem = aimCursorInstance.aimAtItem(constellation.items);
                if (aimedItem && aimedItem.link) {
                    window.location.href = aimedItem.link;
                }
            }
        }
    });

    // Navigation buttons
    document.querySelectorAll('.next').forEach(button => {
        button.addEventListener('click', function () {
            prototypesDiv.classList.remove("show");
            contactsCanvas();
        });
    });

    document.querySelectorAll('.prev').forEach(button => {
        button.addEventListener('click', function () {
            prototypesDiv.classList.remove("show");
            skillsCanvas();
        });
    });

    document.querySelectorAll('.menu').forEach(button => {
        button.addEventListener('click', function () {
            prototypesDiv.classList.remove("show");
            mainCanvas();
        });
    });

    // Animation loop
    function animate() {
        handleMovement();
        constellation.redraw();
        aimCursorInstance.redraw();
        requestAnimationFrame(animate);
    }

    animate();
}