/* =========================
   MAIN FUNCTION
========================= */
function mainCanvas() {
    // Reset body HTML
    const originalBodyHTML = document.body.innerHTML;
    document.body.innerHTML = originalBodyHTML;
    
    // Show main menu
    const mainMenu = document.getElementById('main-menu');
    mainMenu.classList.add('show');

    // Global state
    const STATE = {
        isTransition: true,
        isHit: false,
        hitIndex: 0,
        isTextTransition: true,
        isActive: true
    };

    /* =========================
       CANVAS SETUP
    ========================= */
    const canvas = document.getElementById("main-menu-canvas");
    const context = canvas.getContext("2d");

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
            this.width = MENU_CONFIG.boxSize;
            this.height = MENU_CONFIG.boxSize;
            this.radius = MENU_CONFIG.radius;

            // Position at center
            this.x = canvasElement.width / 2 - this.width / 2;
            this.y = canvasElement.height / 2 - this.height / 2;

            // Mouse tracking
            this.mouseX = 0;
            this.mouseY = 0;

            // Projectiles and transitions
            this.projectiles = [];
            this.textTransitions = Array(MENU_CONFIG.items.length).fill(null);

            this.initMouseEvents();
        }

        /* Mouse Events */
        initMouseEvents() {
            this.canvas.addEventListener("mousemove", (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
            });

            this.canvas.addEventListener("click", (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                this.shoot(mouseX, mouseY);
            });
        }

        /* Get center coordinates */
        getCenterCoordinates() {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        }

        /* Draw rotating box */
        drawBox() {
            const center = this.getCenterCoordinates();
            const angle = Math.atan2(this.mouseY - center.y, this.mouseX - center.x);

            this.ctx.save();
            this.ctx.translate(center.x, center.y);
            this.ctx.rotate(angle + Math.PI / 4);
            this.ctx.fillStyle = COLORS.white;
            this.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            this.ctx.restore();
        }

        /* Shoot projectile */
        shoot(targetX, targetY) {
            const center = this.getCenterCoordinates();
            const dx = targetX - center.x;
            const dy = targetY - center.y;
            const magnitude = Math.sqrt(dx * dx + dy * dy);

            this.projectiles.push({
                x: center.x,
                y: center.y,
                direction: { 
                    x: dx / magnitude, 
                    y: dy / magnitude 
                }
            });
        }

        /* Update projectiles */
        updateProjectiles() {
            this.projectiles = this.projectiles.filter((projectile) => {
                // Move projectile
                projectile.x += projectile.direction.x * MENU_CONFIG.projectileSpeed;
                projectile.y += projectile.direction.y * MENU_CONFIG.projectileSpeed;

                // Check for hit
                const hitIndex = this.detectTextHit(projectile);
                if (hitIndex !== -1) {
                    if (!STATE.isHit) {
                        STATE.hitIndex = hitIndex;
                        STATE.isHit = true;
                    }
                    this.textTransitions[hitIndex] = {
                        alpha: 1,
                        radius: this.radius,
                        scale: 1.2,
                        hit: true
                    };
                }

                // Keep projectile if still in bounds
                return (
                    projectile.x > 0 &&
                    projectile.x < this.canvas.width &&
                    projectile.y > 0 &&
                    projectile.y < this.canvas.height
                );
            });
        }

        /* Detect text hit */
        detectTextHit(projectile) {
            const center = this.getCenterCoordinates();

            for (let i = 0; i < MENU_CONFIG.items.length; i++) {
                const angle = MENU_CONFIG.angles[i];
                const textX = center.x + this.radius * Math.cos(angle);
                const textY = center.y + this.radius * Math.sin(angle);

                const distance = Math.sqrt(
                    (projectile.x - textX) ** 2 + 
                    (projectile.y - textY) ** 2
                );

                // Check if hit and not already hit
                if (distance < MENU_CONFIG.hitDistance && 
                    !(this.textTransitions[i] && this.textTransitions[i].hit)) {
                    return i;
                }
            }

            return -1;
        }

        /* Draw projectiles */
        drawProjectiles() {
            this.ctx.fillStyle = COLORS.white;
            this.projectiles.forEach((projectile) => {
                this.ctx.fillRect(
                    projectile.x - MENU_CONFIG.projectileSize / 2,
                    projectile.y - MENU_CONFIG.projectileSize / 2,
                    MENU_CONFIG.projectileSize,
                    MENU_CONFIG.projectileSize
                );
            });
        }

        /* Draw text items with entrance transition */
        drawTextItems() {
            const center = this.getCenterCoordinates();

            MENU_CONFIG.items.forEach((item, index) => {
                const angle = MENU_CONFIG.angles[index];
                let transition = this.textTransitions[index];

                // Initialize transition if not set
                if (!transition) {
                    this.textTransitions[index] = {
                        alpha: 0,
                        radius: this.radius * 2
                    };
                    transition = this.textTransitions[index];
                }

                // Animate transition
                if (transition.radius > this.radius) {
                    transition.alpha += MENU_CONFIG.transitionSpeed.alpha;
                    transition.radius -= MENU_CONFIG.transitionSpeed.radius;
                } else {
                    transition.radius = this.radius;
                    transition.alpha = 1;
                    this.textTransitions[index] = null;
                    STATE.isTransition = false;
                }

                // Calculate position
                const textX = center.x + transition.radius * Math.cos(angle);
                const textY = center.y + transition.radius * Math.sin(angle);

                // Draw text
                this.ctx.fillStyle = COLORS.whiteTransparent(transition.alpha);
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.font = MENU_CONFIG.textFont;
                this.ctx.fillText(item.label, textX, textY);
            });
        }

        /* Draw text items without entrance transition */
        drawTextItemsNoTransition() {
            const center = this.getCenterCoordinates();

            MENU_CONFIG.items.forEach((item, index) => {
                const angle = MENU_CONFIG.angles[index];
                const textX = center.x + this.radius * Math.cos(angle);
                const textY = center.y + this.radius * Math.sin(angle);

                let transition = this.textTransitions[index];
                let scale = 1;

                // Apply scale if transition is active
                if (transition && transition.scale) {
                    scale = transition.scale;
                    transition.scale -= MENU_CONFIG.transitionSpeed.scaleDecrease;

                    if (transition.scale <= 1) {
                        transition.scale = 1;
                        transition.scaled = true;
                    }
                }

                // Draw scaled text
                this.ctx.save();
                this.ctx.translate(textX, textY);
                this.ctx.scale(scale, scale);
                this.ctx.fillStyle = COLORS.white;
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.font = MENU_CONFIG.textFont;
                this.ctx.fillText(item.label, 0, 0);
                this.ctx.restore();
            });
        }

        /* Text hit animation (scale up effect) */
        textHitAnimation(index) {
            if (!STATE.isTextTransition) return;

            const transition = this.textTransitions[index];
            if (!transition) return;

            // Scale up animation
            if (transition.scale < 2) {
                transition.alpha += MENU_CONFIG.transitionSpeed.alpha;
                transition.scale += MENU_CONFIG.transitionSpeed.scale;
            }

            // End animation
            if (transition.scale >= 2) {
                transition.scale = 2;
                transition.alpha = 1;
                STATE.isTextTransition = false;
                this.textTransitions[index] = null;
            }
        }

        /* Main draw method */
        draw() {
            if (!STATE.isActive) return;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawBox();

            // Handle different states
            if (STATE.isTransition) {
                // Entrance animation
                this.drawTextItems();
            } else if (STATE.isTextTransition) {
                // Hit animation
                this.drawTextItemsNoTransition();
            } else {
                // Navigate to selected section
                MENU_CONFIG.items[STATE.hitIndex].action();
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                STATE.isActive = false;
                return;
            }

            // Update projectiles and animate hit
            if (!STATE.isHit) {
                this.updateProjectiles();
                this.drawProjectiles();
            } else if (STATE.isTextTransition) {
                this.textHitAnimation(STATE.hitIndex);
            }
        }
    }

    /* =========================
       ANIMATION LOOP
    ========================= */
    const sprite = new WhiteSprite(context, canvas);

    function animate() {
        sprite.draw();
        requestAnimationFrame(animate);
    }

    animate();
}