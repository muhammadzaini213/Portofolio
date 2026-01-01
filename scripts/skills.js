function skillsCanvas() {
    class WhiteSprite {
        constructor(context, canvas, config) {
            this.context = context;
            this.canvas = canvas;
            this.width = config.width;
            this.height = config.height;
            this.color = config.color;
            this.speed = config.speed;
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            this.mouseX = this.x;
            this.mouseY = this.y;
            this.projectiles = [];
            this.projectileConfig = SKILLS_CONFIG.projectile;
        }

        updateMousePosition(mouseX, mouseY) {
            this.mouseX = mouseX;
            this.mouseY = mouseY;
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

            // Keep within canvas boundaries
            this.x = Math.max(this.width / 2, Math.min(this.canvas.width - this.width / 2, this.x));
            this.y = Math.max(this.height / 2, Math.min(this.canvas.height - this.height / 2, this.y));
        }

        drawBox() {
            const angle = Math.atan2(this.mouseY - this.y, this.mouseX - this.x);

            this.context.save();
            this.context.translate(this.x, this.y);
            this.context.rotate(angle + Math.PI / 4);
            this.context.fillStyle = this.color;
            this.context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            this.context.restore();
        }

        shoot(targetX, targetY) {
            const dx = targetX - this.x;
            const dy = targetY - this.y;
            const magnitude = Math.sqrt(dx * dx + dy * dy);

            const direction = { 
                x: dx / magnitude, 
                y: dy / magnitude 
            };

            this.projectiles.push({
                x: this.x,
                y: this.y,
                width: this.projectileConfig.width,
                height: this.projectileConfig.height,
                color: this.projectileConfig.color,
                speed: this.projectileConfig.speed,
                direction
            });
        }

        drawProjectiles() {
            this.projectiles.forEach((projectile) => {
                this.context.fillStyle = projectile.color;
                this.context.fillRect(
                    projectile.x - projectile.width / 2,
                    projectile.y - projectile.height / 2,
                    projectile.width,
                    projectile.height
                );
            });
        }

        updateProjectiles() {
            this.projectiles = this.projectiles.filter((projectile) => {
                // Check collision with constellation items
                for (let item of constellation.items) {
                    const dx = projectile.x - item.x;
                    const dy = projectile.y - item.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    const itemRadius = SKILLS_CONFIG.ui.itemSize / 2;
                    const projectileRadius = projectile.width / 2;

                    if (distance < itemRadius + projectileRadius) {
                        item.hitText = item.label;
                        constellation.triggerShakeEffect(item);
                        setTimeout(() => (item.hitText = null), SKILLS_CONFIG.ui.hitTextDuration);
                        return false; // Remove projectile
                    }
                }

                // Keep projectile within canvas bounds
                return (
                    projectile.x > 0 &&
                    projectile.x < this.canvas.width &&
                    projectile.y > 0 &&
                    projectile.y < this.canvas.height
                );
            });

            // Update projectile positions
            this.projectiles.forEach((projectile) => {
                projectile.x += projectile.direction.x * projectile.speed;
                projectile.y += projectile.direction.y * projectile.speed;
            });
        }

        draw() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawProjectiles();
            this.updateProjectiles();
            constellation.redraw();
            this.drawBox();
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
                    data.imageSrc,
                    data.label,
                    data.id
                );
            });
        }

        addItem(x, y, imageSrc, label, id) {
            const item = {
                id,
                x,
                y,
                label,
                image: null,
                hitOffset: { x: 0, y: 0 },
                hitText: null,
                textShakeOffset: { x: 0, y: 0 }
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
            const { x, y, image, hitOffset, hitText, textShakeOffset } = item;
            const size = this.config.ui.itemSize;
            const radius = size / 2;

            const displayX = x + hitOffset.x;
            const displayY = y + hitOffset.y;

            // Draw black background
            this.context.fillStyle = "black";
            this.context.beginPath();
            this.context.arc(displayX, displayY, radius, 0, Math.PI * 2);
            this.context.fill();

            // Draw image or white circle
            if (image) {
                this.context.drawImage(image, displayX - size / 2, displayY - size / 2, size, size);
            } else {
                this.context.fillStyle = "white";
                this.context.beginPath();
                this.context.arc(displayX, displayY, radius * 0.8, 0, Math.PI * 2);
                this.context.fill();
            }

            // Draw hit text with shake effect
            if (hitText) {
                const textX = displayX + (textShakeOffset?.x || 0);
                const textY = displayY - radius - this.config.ui.textOffset + (textShakeOffset?.y || 0);

                this.context.fillStyle = "white";
                this.context.font = `${this.config.ui.fontSize}px ${this.config.ui.fontFamily}`;
                this.context.textAlign = "center";
                this.context.fillText(hitText, textX, textY);
            }
        }

        triggerShakeEffect(item) {
            const { shakeDuration, shakeIntensity, shakeInterval } = this.config.ui;
            let elapsed = 0;

            const shake = () => {
                if (elapsed >= shakeDuration) {
                    item.textShakeOffset = { x: 0, y: 0 };
                    return;
                }

                item.textShakeOffset = {
                    x: (Math.random() - 0.5) * shakeIntensity * 2,
                    y: (Math.random() - 0.5) * shakeIntensity * 2
                };

                elapsed += shakeInterval;
                setTimeout(shake, shakeInterval);
            };

            shake();
        }

        drawLine(x1, y1, x2, y2) {
            this.context.strokeStyle = "white";
            this.context.lineWidth = 1;
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.stroke();
        }

        redraw() {
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
        }
    }

    // Initialize canvas
    const skillsDiv = document.getElementById("skills");
    document.getElementById("main-menu").classList.remove("show");
    skillsDiv.classList.add("show");

    const skillsCanvas = document.getElementById("skills-canvas");

    function resizeCanvas() {
        skillsCanvas.width = window.innerWidth;
        skillsCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const context = skillsCanvas.getContext("2d");

    // Initialize instances
    const constellation = new Constellation(context, skillsCanvas, SKILLS_CONFIG);
    const box = new WhiteSprite(context, skillsCanvas, SKILLS_CONFIG.player);

    // Calculate position percentages
    const widthPer = skillsCanvas.width / 100;
    const heightPer = skillsCanvas.height / 100;

    // Initialize items from config
    constellation.initializeItems(SKILLS_CONFIG.items, widthPer, heightPer);

    // Add connections from config
    SKILLS_CONFIG.connections.forEach(([index1, index2]) => {
        constellation.connectItems(index1, index2);
    });

    // Start animations
    constellation.redraw();
    constellation.swingAll();

    // Mouse tracking
    skillsCanvas.addEventListener("mousemove", (event) => {
        const rect = skillsCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        box.updateMousePosition(mouseX, mouseY);
    });

    // Input handling
    const keysPressed = {};

    window.addEventListener("keydown", (event) => {
        keysPressed[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
        keysPressed[event.key] = false;
    });

    window.addEventListener('click', (event) => {
        const rect = skillsCanvas.getBoundingClientRect();
        const targetX = event.clientX - rect.left;
        const targetY = event.clientY - rect.top;
        box.shoot(targetX, targetY);
    });

    function handleMovement() {
        if (keysPressed['w']) box.move('up');
        if (keysPressed['s']) box.move('down');
        if (keysPressed['a']) box.move('left');
        if (keysPressed['d']) box.move('right');
    }

    // Animation loop
    function animate() {
        handleMovement();
        box.draw();
        requestAnimationFrame(animate);
    }

    animate();

    // Navigation buttons
    document.querySelectorAll('.next').forEach(button => {
        button.addEventListener('click', function() {
            skillsDiv.classList.remove("show");
            prototypesCanvas();
        });
    });

    document.querySelectorAll('.prev').forEach(button => {
        button.addEventListener('click', function() {
            skillsDiv.classList.remove("show");
            aboutCanvas();
        });
    });

    document.querySelectorAll('.menu').forEach(button => {
        button.addEventListener('click', function() {
            skillsDiv.classList.remove("show");
            mainCanvas();
        });
    });
}