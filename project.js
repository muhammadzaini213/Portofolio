function projectCanvas() {

    const originalBodyHTML = document.body.innerHTML;
    document.body.innerHTML = originalBodyHTML;
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
            constellation.redraw();
            this.updateProjectiles();
            this.drawBox();
        }
    }

    class Constellation {
        constructor(context, canvas) {
            this.context = context;
            this.canvas = canvas;
            this.items = []; // Store item positions and images
            this.connections = []; // Store connections as pairs of item indices

            this.canvas.addEventListener("click", (event) => this.handleCanvasClick(event));
            this.canvas.addEventListener("mousemove", (event) => this.handleMouseMove(event)); // Listen for mouse move


        }
    
        // Resize canvas to fit the window
        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.redraw(); // Redraw on resize
        }
    
        // Add a new item with position, optional image, and text
        addItem(x, y, imageSrc = null, text = "", link = "#") {
            const item = {
                x,
                y,
                image: null,
                text,
                link,
                hitOffset: { x: 0, y: 0 }, // Track displacement from hit
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
    
        drawItem(item) {
            const { x, image, text, link, hitOffset } = item;
            const size = 100; // Overall size for the item
            const radius = size / 2;
    
            // Calculate displaced position
            const displayX = x + hitOffset.x;
            const canvasMidY = this.canvas.height / 2; // Vertically center all items
            const displayY = canvasMidY + hitOffset.y;
    
        
            // Calculate vertical middle alignment
            const textY = displayY - radius - 20; // Text above the image
            const linkY = displayY + radius + 30; // Link below the image
    
            // Draw text on top
            this.context.fillStyle = "white";
            this.context.font = "18px Roboto Mono";
            this.context.textAlign = "center";
            this.context.fillText(text, displayX, textY);
    
            // Draw the image if available
            if (image) {
                this.context.drawImage(image, displayX - size / 2, displayY - size / 2, size, size);
            } else {
                // Otherwise, draw a placeholder white circle
                this.context.fillStyle = "white";
                this.context.beginPath();
                this.context.arc(displayX, displayY, radius * 0.8, 0, Math.PI * 2);
                this.context.fill();
            }
    
            // Draw "View" link below
            // Draw "View" link below and scale on hover
            const textMetrics = this.context.measureText("View");
            const fontSize = this.hoveredItem === item ? 20 : 16; // Increase size on hover

            this.context.fillStyle = "white"; // Text color
            this.context.font = `${fontSize}px Roboto Mono`; // Set font size dynamically based on hover
            this.context.textAlign = "center";
            this.context.fillText("View", displayX, linkY);

            item.clickableArea = {
                x: displayX - textMetrics.width / 2,
                y: linkY - fontSize / 1.5, // Adjust for increased font size
                width: textMetrics.width,
                height: fontSize, // Adjust for increased font size
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
                    break;
                }
            }
    
            // Update hovered item
            if (this.hoveredItem !== hovered) {
                this.hoveredItem = hovered;
                this.redraw(); // Redraw to apply the hover effect
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
                    window.open(item.link, "_blank"); // Open the link in a new tab
                    break;
                }
            }
        }
    
    
        // Redraw all items and connections
        redraw() {
            // Clear the canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
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
    }
    
    
    

    const projectDiv = document.getElementById("project");
    document.getElementById("main-menu").classList.remove("show");
    projectDiv.classList.add("show");

    const project_canvas = document.getElementById("project-canvas");

    function resizeCanvas() {
        project_canvas.width = window.innerWidth;
        project_canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    

    const context = project_canvas.getContext("2d");


    const constellation = new Constellation(context, project_canvas);
    constellation.addItem(200, 100, "assets/ujian-kita.png", "Ujian Kita", "https://github.com/muhammadzaini213/Ujian_Kita");
    constellation.addItem(400, 200, "assets/manajemen-jadwal.png", "Manajemen Jadwal", "https://github.com/muhammadzaini213/Aplikasi-Manajemen-Jadwal-Mahasiswa");

    let box = new WhiteSprite(context, project_canvas, 25, 25);

    constellation.redraw();
    project_canvas.addEventListener("mousemove", (event) => {
        const rect = project_canvas.getBoundingClientRect();
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
        const rect = project_canvas.getBoundingClientRect();
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
        // box.draw();


        requestAnimationFrame(animate);
    }

    animate();

    document.querySelectorAll('.next').forEach(button => {
        button.addEventListener('click', function() {
            projectDiv.classList.remove("show");
            const originalBodyHTML = document.body.innerHTML;

// Reset to original state
document.body.innerHTML = originalBodyHTML;
            aboutCanvas()
        });
    });

    document.querySelectorAll('.prev').forEach(button => {
        button.addEventListener('click', function() {
            projectDiv.classList.remove("show");
            const originalBodyHTML = document.body.innerHTML;

// Reset to original state
document.body.innerHTML = originalBodyHTML;
            experienceCanvas()
        });
    });
    
    document.querySelectorAll('.menu').forEach(button => {
        button.addEventListener('click', function() {
            projectDiv.classList.remove("show");
            mainCanvas();
        });
    });
}