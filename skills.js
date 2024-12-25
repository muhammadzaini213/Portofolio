function skillsCanvas() {
    let isActive = true;

    class WhiteSprite {
        constructor(context, canvas, width, height, color = "white") {
            this.context = context;
            this.canvas = canvas;
            this.width = width;
            this.height = height;
            this.color = color;
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            this.mouseX = this.x; // Default to center
            this.mouseY = this.y; // Default to center
            this.speed = 5; // Movement speed for WASD
            this.projectiles = []; // Array to store active projectiles
        }

        updateMousePosition(mouseX, mouseY) {
            this.mouseX = mouseX;
            this.mouseY = mouseY;
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

            // Ensure the box stays within canvas boundaries
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
            // Calculate the direction vector
            const dx = targetX - this.x;
            const dy = targetY - this.y;
            const magnitude = Math.sqrt(dx * dx + dy * dy);
    
            // Normalize the direction vector
            const direction = { x: dx / magnitude, y: dy / magnitude };
    
            console.log("s")
            this.projectiles.push({
                x: this.x,
                y: this.y,
                width: 10,
                height: 10,
                color: "white",
                speed: 10,
                direction,
            });
        }

        
        updateProjectiles() {
            this.projectiles = this.projectiles.filter((projectile) => {
                // Check for collision with constellation items
                for (let i = 0; i < constellation.items.length; i++) {
                    const item = constellation.items[i];
                    const dx = projectile.x - item.x;
                    const dy = projectile.y - item.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
        
                    const itemRadius = 35 / 2; // Radius of constellation items
                    const projectileRadius = projectile.width / 2; // Assuming square projectile
        
                    if (distance < itemRadius + projectileRadius) {

                        const itemList = ["Express.js", "Node.js", "CSS", "Javascript", "HTML", "Python", "Firebase", "Dart", "Flutter", "Android", "Java", "Kotlin"]
                        item.hitText = itemList[i]; // Add text on the hit item
                        constellation.triggerShakeEffect(item); // Trigger the shake effect
                        setTimeout(() => (item.hitText = null), 2000); // Remove text after 2 seconds
                        return false; // Remove the projectile if it hits an item
                    }
                }
        
                // Keep the projectile within canvas bounds
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
            constellation.redraw()
            this.drawBox();
        }
    }

    class Constellation {
        constructor(context, canvas) {
            this.context = context;
            this.canvas = canvas;
            this.items = []; // Store item positions and images
            this.connections = []; // Store connections as pairs of item indices
        }
    
        // Resize canvas to fit the window
        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.redraw(); // Redraw on resize
        }
    
        // Add a new item with position and optional image
        addItem(x, y, imageSrc = null) {
            const item = { 
                x, 
                y, 
                image: null, 
                hitOffset: { x: 0, y: 0 } // Track displacement from hit 
            };
            if (imageSrc) {
                const img = new Image();
                img.src = imageSrc;
                img.onload = () => {
                    item.image = img; // Assign the image after it loads
                    this.redraw(); // Redraw to include the new image
                };
            }
            this.items.push(item);
        }
    
        // Connect two items by their indices
        connectItems(index1, index2) {
            this.connections.push([index1, index2]);
        }

        swingAll() {
            const maxOffset = 1; // Maximum displacement
            const swingSpeed = 0.05; // Speed of the swing (lower is slower)
            let time = 0;
        
            const animate = () => {
                time += swingSpeed;
        
                // Update offset for each item
                this.items.forEach((item, index) => {
                    const dx = Math.sin(time + index) * maxOffset; // Add index to vary phase
                    const dy = Math.cos(time + index) * maxOffset;
                    item.hitOffset = { x: dx, y: dy };
                });
        
                this.redraw();
        
                // Continue the animation loop
                requestAnimationFrame(animate);
            };
        
            // Start the animation loop
            animate();
        }
        
    
        // Draw a single item with a black background
        // Draw a single item with a black background
        // Draw a single item with a black background
        drawItem(item) {
            const { x, y, image, hitOffset, hitText, textShakeOffset } = item;
            const size = 35; // Size of the background and image
            const radius = size / 2;

            // Calculate displaced position
            const displayX = x + hitOffset.x;
            const displayY = y + hitOffset.y;

            // Draw black background
            this.context.fillStyle = "black";
            this.context.beginPath();
            this.context.arc(displayX, displayY, radius, 0, Math.PI * 2);
            this.context.fill();

            // Draw the image if available
            if (image) {
                this.context.drawImage(image, displayX - size / 2, displayY - size / 2, size, size);
            } else {
                // Otherwise, draw a white circle
                this.context.fillStyle = "white";
                this.context.beginPath();
                this.context.arc(displayX, displayY, radius * 0.8, 0, Math.PI * 2); // Slightly smaller than the background
                this.context.fill();
            }

            // If the item has been hit, display text with a shake effect
            if (hitText) {
                const textX = displayX + (textShakeOffset?.x || 0); // Apply shake offset
                const textY = displayY - radius - 10 + (textShakeOffset?.y || 0);

                this.context.fillStyle = "white"; // Set text color
                this.context.font = "16px Roboto mono"; // Set font size and family
                this.context.textAlign = "center"; // Center the text
                this.context.fillText(hitText, textX, textY); // Position text above the item
            }
        }



// Trigger a shake effect for the item
        triggerShakeEffect(item) {
            const shakeDuration = 200; // Duration of the shake in milliseconds
            const shakeIntensity = 5; // Maximum displacement for shaking
            const shakeInterval = 50; // Interval for updating the shake offset
            let elapsed = 0;

            const shake = () => {
                if (elapsed >= shakeDuration) {
                    item.textShakeOffset = { x: 0, y: 0 }; // Reset the offset
                    return;
                }

                // Generate random shake offsets
                item.textShakeOffset = {
                    x: (Math.random() - 0.5) * shakeIntensity * 2,
                    y: (Math.random() - 0.5) * shakeIntensity * 2,
                };

                elapsed += shakeInterval;
                setTimeout(shake, shakeInterval); // Continue shaking
            };

            shake(); // Start the shake effect
        }

    
        // Draw a line between two points
        drawLine(x1, y1, x2, y2) {
            this.context.strokeStyle = "white";
            this.context.lineWidth = 1;
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.stroke();
        }
    
        // Redraw all items and connections
        redraw() {
            // Clear the canvas
    
            // Draw connections
            for (const [index1, index2] of this.connections) {
                const item1 = this.items[index1];
                const item2 = this.items[index2];
                this.drawLine(item1.x + item1.hitOffset.x, item1.y + item1.hitOffset.y,
                            item2.x + item2.hitOffset.x, item2.y + item2.hitOffset.y);
            }
    
            // Draw items
            for (const item of this.items) {
                this.drawItem(item);
            }
        }
    }
    
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

    const constellation = new Constellation(context, skillsCanvas);

    // Add items (stars)
    widthPer = skillsCanvas.width / 100;
    heightPer = skillsCanvas.height / 100;

    constellation.addItem(widthPer*16, heightPer*23, "assets/expressjs.png");
    constellation.addItem(widthPer*30, heightPer*25, "assets/nodejs.png");
    constellation.addItem(widthPer*50, heightPer*40, "assets/css3.png");
    constellation.addItem(widthPer*45, heightPer*50, "assets/javascript.png");
    constellation.addItem(widthPer*41, heightPer*58, "assets/html5.png");
    constellation.addItem(widthPer*15, heightPer*60, "assets/python.png");
    constellation.addItem(widthPer*54, heightPer*55, "assets/firebase.png");

    constellation.addItem(widthPer*54, heightPer*72, "assets/dart.png");
    constellation.addItem(widthPer*70, heightPer*80, "assets/flutter.png");

    constellation.addItem(widthPer*65, heightPer*36, "assets/android.png");
    constellation.addItem(widthPer*75, heightPer*42, "assets/java.png");
    constellation.addItem(widthPer*82, heightPer*41, "assets/kotlin.png");

    constellation.connectItems(0, 1);
    constellation.connectItems(1, 2);
    constellation.connectItems(2, 3);
    constellation.connectItems(3, 4);
    constellation.connectItems(4, 5);

    constellation.connectItems(3, 6);

    constellation.connectItems(6, 7);
    constellation.connectItems(7, 8);

    constellation.connectItems(6, 9);
    constellation.connectItems(9, 10);
    constellation.connectItems(10, 11);

    constellation.redraw();
    constellation.swingAll();

    let box = new WhiteSprite(context, skillsCanvas, 25, 25);

    skillsCanvas.addEventListener("mousemove", (event) => {
        const rect = skillsCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        box.updateMousePosition(mouseX, mouseY);
    });

    let keysPressed = {};

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

    function animate() {
        handleMovement();
        box.draw();


        requestAnimationFrame(animate);
    }

    animate();

    document.querySelectorAll('.next').forEach(button => {
        button.addEventListener('click', function() {
            skillsDiv.classList.remove("show");
            const originalBodyHTML = document.body.innerHTML;

// Reset to original state
document.body.innerHTML = originalBodyHTML;
            prototypesCanvas()
            // Add your functionality here
        });
    });

    document.querySelectorAll('.prev').forEach(button => {
        button.addEventListener('click', function() {
            skillsDiv.classList.remove("show");
            const originalBodyHTML = document.body.innerHTML;

// Reset to original state
document.body.innerHTML = originalBodyHTML;
            aboutCanvas()        
        });
    });
    
    document.querySelectorAll('.menu').forEach(button => {
        button.addEventListener('click', function() {
            skillsDiv.classList.remove("show");
            mainCanvas();
        });
    });
}