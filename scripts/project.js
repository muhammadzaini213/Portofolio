/* =========================
   MAIN FUNCTION
========================= */
function projectCanvas() {
    const STATE = {
        isActive: true,
        keysPressed: {}
    };

    // Reset body HTML
    const originalBodyHTML = document.body.innerHTML;
    document.body.innerHTML = originalBodyHTML;

    /* =========================
       DOM ELEMENTS
    ========================= */
    const projectDiv = document.getElementById("project");
    const canvas = document.getElementById("project-canvas");
    const context = canvas.getContext("2d");

    // Show project section
    document.getElementById("main-menu").classList.remove("show");
    projectDiv.classList.add("show");

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
        constructor(ctx, canvasElement) {
            this.ctx = ctx;
            this.canvas = canvasElement;
            this.width = PROJECT_CONFIG.boxSize;
            this.height = PROJECT_CONFIG.boxSize;
            this.color = PROJECT_CONFIG.boxColor;
            this.speed = PROJECT_CONFIG.moveSpeed;

            this.x = canvasElement.width / 2;
            this.y = canvasElement.height / 2;
            this.mouseX = this.x;
            this.mouseY = this.y;

            this.projectiles = [];
        }

        updateMousePosition(mouseX, mouseY) {
            this.mouseX = mouseX;
            this.mouseY = mouseY;
        }

        move(direction) {
            switch (direction) {
                case 'up':
                    this.y -= this.speed;
                    break;
                case 'down':
                    this.y += this.speed;
                    break;
                case 'left':
                    this.x -= this.speed;
                    break;
                case 'right':
                    this.x += this.speed;
                    break;
            }

            // Keep box within canvas boundaries
            this.x = Math.max(
                this.width / 2,
                Math.min(this.canvas.width - this.width / 2, this.x)
            );
            this.y = Math.max(
                this.height / 2,
                Math.min(this.canvas.height - this.height / 2, this.y)
            );
        }

        shoot(targetX, targetY) {
            const dx = targetX - this.x;
            const dy = targetY - this.y;
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
                projectile.x += projectile.direction.x * PROJECT_CONFIG.projectileSpeed;
                projectile.y += projectile.direction.y * PROJECT_CONFIG.projectileSpeed;

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
                    projectile.x - PROJECT_CONFIG.projectileSize / 2,
                    projectile.y - PROJECT_CONFIG.projectileSize / 2,
                    PROJECT_CONFIG.projectileSize,
                    PROJECT_CONFIG.projectileSize
                );
            });
        }

        drawBox() {
            const angle = Math.atan2(
                this.mouseY - this.y,
                this.mouseX - this.x
            );

            this.ctx.save();
            this.ctx.translate(this.x, this.y);
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
            constellation.redraw();
            this.updateProjectiles();
            this.drawProjectiles();
            this.drawBox();
        }
    }

    /* =========================
       CONSTELLATION CLASS
    ========================= */
    class Constellation {
        constructor(ctx, canvasElement) {
            this.ctx = ctx;
            this.canvas = canvasElement;
            this.items = [];
            this.connections = [];
            this.hoveredItem = null;

            this.initEventListeners();
        }

        initEventListeners() {
            this.canvas.addEventListener("click", (event) => this.handleCanvasClick(event));
            this.canvas.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        }

        addItem(x, y, imageSrc = null, text = "", link = "#") {
            const item = {
                x,
                y,
                image: null,
                text,
                link,
                hitOffset: { x: 0, y: 0 },
                clickableArea: null
            };

            if (imageSrc) {
                const img = new Image();
                img.src = imageSrc;
                img.onload = () => {
                    item.image = img;
                    this.redraw();
                };
            }

            this.items.push(item);
        }

        connectItems(index1, index2) {
            this.connections.push([index1, index2]);
        }

        drawItem(item) {
            const { x, image, text, hitOffset } = item;
            const size = PROJECT_CONFIG.itemSize;
            const radius = size / 2;

            // Calculate display position (vertically centered)
            const displayX = x + hitOffset.x;
            const canvasMidY = this.canvas.height / 2;
            const displayY = canvasMidY + hitOffset.y;

            // Calculate text positions
            const textY = displayY - radius - PROJECT_CONFIG.textOffset.above;
            const linkY = displayY + radius + PROJECT_CONFIG.textOffset.below;

            // Draw project name
            this.ctx.fillStyle = COLORS.white;
            this.ctx.font = PROJECT_CONFIG.textFont;
            this.ctx.textAlign = "center";
            this.ctx.fillText(text, displayX, textY);

            // Draw image or placeholder
            if (image) {
                this.ctx.drawImage(
                    image,
                    displayX - size / 2,
                    displayY - size / 2,
                    size,
                    size
                );
            } else {
                this.ctx.fillStyle = COLORS.white;
                this.ctx.beginPath();
                this.ctx.arc(displayX, displayY, radius * 0.8, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Draw "View" link with hover effect
            const isHovered = this.hoveredItem === item;
            const fontSize = isHovered ? 20 : 16;
            const linkText = "View";

            this.ctx.font = isHovered ? PROJECT_CONFIG.linkFontHover : PROJECT_CONFIG.linkFont;
            this.ctx.fillStyle = COLORS.white;
            this.ctx.textAlign = "center";
            this.ctx.fillText(linkText, displayX, linkY);

            // Define clickable area
            const textMetrics = this.ctx.measureText(linkText);
            item.clickableArea = {
                x: displayX - textMetrics.width / 2,
                y: linkY - fontSize / 1.5,
                width: textMetrics.width,
                height: fontSize
            };
        }

        handleMouseMove(event) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            let hovered = null;
            for (const item of this.items) {
                const area = item.clickableArea;
                if (
                    area &&
                    mouseX >= area.x &&
                    mouseX <= area.x + area.width &&
                    mouseY >= area.y &&
                    mouseY <= area.y + area.height
                ) {
                    hovered = item;
                    this.canvas.style.cursor = 'pointer';
                    break;
                }
            }

            if (!hovered) {
                this.canvas.style.cursor = 'default';
            }

            // Update hovered item and redraw if changed
            if (this.hoveredItem !== hovered) {
                this.hoveredItem = hovered;
                this.redraw();
            }
        }

        handleCanvasClick(event) {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            for (const item of this.items) {
                const area = item.clickableArea;
                if (
                    area &&
                    clickX >= area.x &&
                    clickX <= area.x + area.width &&
                    clickY >= area.y &&
                    clickY <= area.y + area.height
                ) {
                    window.open(item.link, "_blank");
                    break;
                }
            }
        }

        drawLine(x1, y1, x2, y2) {
            this.ctx.strokeStyle = COLORS.white;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }

        redraw() {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw connections
            for (const [index1, index2] of this.connections) {
                const item1 = this.items[index1];
                const item2 = this.items[index2];
                this.drawLine(
                    item1.x + item1.hitOffset.x,
                    this.canvas.height / 2 + item1.hitOffset.y,
                    item2.x + item2.hitOffset.x,
                    this.canvas.height / 2 + item2.hitOffset.y
                );
            }

            // Draw items
            for (const item of this.items) {
                this.drawItem(item);
            }
        }

        populateProjects() {
            PROJECT_CONFIG.projects.forEach((project) => {
                this.addItem(
                    project.x,
                    project.y,
                    project.image,
                    project.name,
                    project.link
                );
            });
        }
    }

    /* =========================
       INPUT HANDLERS
    ========================= */
    function initInputHandlers() {
        // Mouse movement for box rotation
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
        window.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const targetX = event.clientX - rect.left;
            const targetY = event.clientY - rect.top;
            box.shoot(targetX, targetY);
        });
    }

    function handleMovement() {
        if (STATE.keysPressed['w']) box.move('up');
        if (STATE.keysPressed['s']) box.move('down');
        if (STATE.keysPressed['a']) box.move('left');
        if (STATE.keysPressed['d']) box.move('right');
    }

    /* =========================
       NAVIGATION HANDLERS
    ========================= */
    function resetAndNavigate(targetCanvas) {
        projectDiv.classList.remove("show");
        STATE.isActive = false;

        const originalBodyHTML = document.body.innerHTML;
        document.body.innerHTML = originalBodyHTML;

        targetCanvas();
    }

    function initNavigationButtons() {
        document.querySelectorAll('.next').forEach(button => {
            button.addEventListener('click', () => {
                resetAndNavigate(aboutCanvas);
            });
        });

        document.querySelectorAll('.prev').forEach(button => {
            button.addEventListener('click', () => {
                resetAndNavigate(experienceCanvas);
            });
        });

        document.querySelectorAll('.menu').forEach(button => {
            button.addEventListener('click', () => {
                projectDiv.classList.remove("show");
                STATE.isActive = false;
                mainCanvas();
            });
        });
    }

    /* =========================
       INITIALIZATION
    ========================= */
    // Initialize sprite and constellation
    const box = new WhiteSprite(context, canvas);
    const constellation = new Constellation(context, canvas);

    // Populate constellation with projects
    constellation.populateProjects();
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