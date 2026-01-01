
/* =========================
   MAIN FUNCTION
========================= */
function experienceCanvas() {
    const STATE = {
        isActive: true,
        keysPressed: {}
    };

    /* =========================
       DOM ELEMENTS
    ========================= */
    const experienceDiv = document.getElementById("experience");
    const canvas = document.getElementById("experience-canvas");
    const context = canvas.getContext("2d");

    // Show experience section
    document.getElementById("main-menu").classList.remove("show");
    experienceDiv.classList.add("show");

    /* =========================
       CANVAS SETUP
    ========================= */
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    /* =========================
       WHITE SPRITE CLASS
    ========================= */
    class WhiteSprite {
        constructor(ctx, canvasElement, config) {
            this.ctx = ctx;
            this.canvas = canvasElement;
            this.width = config.boxSize;
            this.height = config.boxSize;
            this.color = config.boxColor;
            this.speed = config.moveSpeed;

            this.x = canvasElement.width / 2;
            this.y = canvasElement.height / 2;
            this.mouseX = this.x;
            this.mouseY = this.y;

            this.projectiles = [];
            this.projectileSpeed = config.projectileSpeed;
            this.projectileSize = config.projectileSize;
            this.cameraY = this.y - this.canvas.height / 2;
        }

        updateMousePosition(mouseX, mouseY) {
            this.mouseX = mouseX;
            this.mouseY = mouseY + this.cameraY;
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
            }

            // Keep box within canvas boundaries
            this.x = Math.max(
                this.width / 2,
                Math.min(this.canvas.width - this.width / 2, this.x)
            );
            this.y = Math.max(this.height / 2, this.y);

            // Update camera to follow sprite
            this.cameraY = this.y - this.canvas.height / 2;
        }

        shoot(targetX, targetY) {
            const dx = targetX - this.x;
            const dy = targetY - (this.y - this.cameraY);
            const magnitude = Math.sqrt(dx * dx + dy * dy);

            this.projectiles.push({
                x: this.x,
                y: this.y,
                direction: {
                    x: dx / magnitude,
                    y: dy / magnitude
                }
            });
        }

        updateProjectiles() {
            this.projectiles = this.projectiles.filter((projectile) => {
                projectile.x += projectile.direction.x * this.projectileSpeed;
                projectile.y += projectile.direction.y * this.projectileSpeed;

                // Keep projectile within bounds
                return (
                    projectile.x > 0 &&
                    projectile.x < this.canvas.width &&
                    projectile.y > 0 &&
                    projectile.y < this.canvas.height
                );
            });
        }

        drawProjectiles() {
            this.ctx.fillStyle = COLORS.white;
            this.projectiles.forEach((projectile) => {
                this.ctx.fillRect(
                    projectile.x - this.projectileSize / 2,
                    projectile.y - this.cameraY - this.projectileSize / 2,
                    this.projectileSize,
                    this.projectileSize
                );
            });
        }

        drawBox() {
            const angle = Math.atan2(
                this.mouseY - this.y,
                this.mouseX - this.x
            );

            this.ctx.save();
            this.ctx.translate(this.x, this.y - this.cameraY);
            this.ctx.rotate(angle + Math.PI / 4);
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
            this.ctx.restore();
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.updateProjectiles();
            constellation.redraw();
            this.drawProjectiles();
            this.drawBox();
        }
    }

    /* =========================
       CONSTELLATION CLASS
    ========================= */
    class Constellation {
        constructor(ctx, canvasElement, config) {
            this.ctx = ctx;
            this.canvas = canvasElement;
            this.config = config;
            this.items = [];
            this.connections = [];
        }

        addItem(x, y, text = "", type = "top") {
            const item = {
                x,
                y,
                text: text.split('\n'),
                type,
                hitOffset: { x: 0, y: 0 },
                textShakeOffset: { x: 0, y: 0 }
            };
            this.items.push(item);
        }

        connectItems(index1, index2) {
            this.connections.push([index1, index2]);
        }

        addConnectedItems(topX, topY, topText, bottomX, bottomY, bottomText) {
            // Add top item
            this.addItem(topX, topY, topText, "");
            const topIndex = this.items.length;

            // Add circle connector
            this.addItem(topX, topY + 10, "", "circle");

            // Add bottom item
            const bottomIndex = this.items.length;
            this.addItem(bottomX, bottomY, bottomText, "");

            // Connect items
            this.connectItems(topIndex, bottomIndex);
        }

        drawItem(item) {
            const { x, y, text, hitOffset, textShakeOffset, type } = item;
            const displayX = x + hitOffset.x;
            const displayY = y + hitOffset.y - box.cameraY;

            // Set font style based on type
            if (type === "title") {
                this.ctx.fillStyle = COLORS.white;
                this.ctx.font = this.config.titleFont;
                this.ctx.textAlign = "center";
            } else {
                this.ctx.fillStyle = COLORS.white;
                this.ctx.font = this.config.textFont;
                this.ctx.textAlign = "center";
            }

            // Calculate max text width
            let maxWidth = 0;
            text.forEach(line => {
                const lineWidth = this.ctx.measureText(line).width;
                if (lineWidth > maxWidth) maxWidth = lineWidth;
            });

            // Draw background rectangle for text
            if (type !== "circle") {
                const textHeight = this.config.lineHeight * text.length;
                const rectTop = displayY - (textHeight / 2) - this.config.textPadding;
                const rectHeight = textHeight + this.config.textPadding * 2;

                this.ctx.fillStyle = COLORS.black;
                this.ctx.fillRect(
                    displayX - maxWidth / 2 - this.config.textPadding,
                    rectTop,
                    maxWidth + this.config.textPadding * 2,
                    rectHeight
                );
            }

            // Draw text lines
            this.ctx.fillStyle = COLORS.white;
            text.forEach((line, index) => {
                const textX = displayX + textShakeOffset.x;
                const textY = displayY + textShakeOffset.y - 
                    ((text.length - 1) / 2) * this.config.lineHeight + 
                    index * this.config.lineHeight;
                this.ctx.fillText(line, textX, textY);
            });

            // Draw circle for connector
            if (type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(
                    displayX,
                    displayY,
                    this.config.circleRadius,
                    0,
                    Math.PI * 2
                );
                this.ctx.fillStyle = COLORS.white;
                this.ctx.fill();
            }
        }

        drawLine(x1, y1, x2, y2) {
            this.ctx.strokeStyle = COLORS.white;
            this.ctx.lineWidth = this.config.lineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }

        redraw() {
            // Draw connections
            for (const [index1, index2] of this.connections) {
                const item1 = this.items[index1];
                const item2 = this.items[index2];
                this.drawLine(
                    item1.x + item1.hitOffset.x,
                    item1.y + item1.hitOffset.y - box.cameraY + 
                        (item1.type === "top" ? 5 : 0),
                    item2.x + item2.hitOffset.x,
                    item2.y + item2.hitOffset.y - box.cameraY
                );
            }

            // Draw items
            for (const item of this.items) {
                this.drawItem(item);
            }
        }

        populateExperiences() {
            const widthPer = this.canvas.width / 100;
            const heightPer = this.canvas.height / 100;

            // Add title
            this.addItem(widthPer * 50, heightPer * 10, "Experience", "title");

            // Add experience items from config
            let currentHeight = 30;
            this.config.experiences.forEach((exp) => {
                this.addConnectedItems(
                    widthPer * 50,
                    heightPer * currentHeight,
                    exp.year,
                    widthPer * 50,
                    heightPer * (currentHeight + 30),
                    exp.description
                );
                currentHeight += 40;
            });
        }
    }

    /* =========================
       INPUT HANDLERS
    ========================= */
    function initInputHandlers() {
        // Mouse movement
        canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            box.updateMousePosition(mouseX, mouseY);
        });

        // Keyboard input
        window.addEventListener("keydown", (event) => {
            STATE.keysPressed[event.key] = true;
        });

        window.addEventListener("keyup", (event) => {
            STATE.keysPressed[event.key] = false;
        });

        // Mouse click for shooting
        canvas.addEventListener("click", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            box.shoot(mouseX, mouseY);
        });
    }

    function handleMovement() {
        if (STATE.keysPressed['w']) box.move('up');
        if (STATE.keysPressed['s']) box.move('down');
        // if (STATE.keysPressed['a']) box.move('left');
        // if (STATE.keysPressed['d']) box.move('right');
    }

    /* =========================
       NAVIGATION HANDLERS
    ========================= */
    function resetAndNavigate(targetCanvas) {
        experienceDiv.classList.remove("show");
        STATE.isActive = false;
        targetCanvas();
    }

    function initNavigationButtons() {
        document.querySelectorAll('.next').forEach(button => {
            button.addEventListener('click', () => {
                resetAndNavigate(projectCanvas);
            });
        });

        document.querySelectorAll('.prev').forEach(button => {
            button.addEventListener('click', () => {
                resetAndNavigate(contactsCanvas);
            });
        });

        document.querySelectorAll('.menu').forEach(button => {
            button.addEventListener('click', () => {
                experienceDiv.classList.remove("show");
                STATE.isActive = false;
                mainCanvas();
            });
        });
    }

    /* =========================
       INITIALIZATION
    ========================= */
    // Initialize sprite and constellation with config
    const box = new WhiteSprite(context, canvas, EXPERIENCE_CONFIG);
    const constellation = new Constellation(context, canvas, EXPERIENCE_CONFIG);

    // Populate constellation with experiences from config
    constellation.populateExperiences();
    constellation.redraw();

    // Initialize input handlers
    initInputHandlers();

    // Initialize navigation
    initNavigationButtons();

    // Animation loop
    function animate() {
        if (STATE.isActive) {
            handleMovement();
            box.draw();
            requestAnimationFrame(animate);
        }
    }

    animate();
}