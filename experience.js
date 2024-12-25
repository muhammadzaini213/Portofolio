function experienceCanvas() {
    const originalBodyHTML = document.body.innerHTML;
    document.body.innerHTML = originalBodyHTML;
    const experienceDiv = document.getElementById("experience");
    document.getElementById("main-menu").classList.remove("show");
    experienceDiv.classList.add("show");


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
            this.cameraY = this.y - this.canvas.height / 2; // Camera follows the WhiteSprite vertically
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
            this.y = Math.max(this.height / 2, this.y);

            // Camera will always center the WhiteSprite vertically
            this.cameraY = this.y - this.canvas.height / 2;
        }

        drawBox() {
            const angle = Math.atan2(this.mouseY - this.y, this.mouseX - this.x);

            this.context.save();
            this.context.translate(this.x, this.y - this.cameraY);
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
        
                    // if (distance < itemRadius + projectileRadius) {

                    //     const itemList = ["Express.js", "Node.js", "CSS", "Javascript", "HTML", "Python", "Firebase", "Dart", "Flutter", "Android", "Java", "Kotlin"]
                    //     item.hitText = itemList[i]; // Add text on the hit item
                    //     constellation.triggerShakeEffect(item); // Trigger the shake effect
                    //     setTimeout(() => (item.hitText = null), 2000); // Remove text after 2 seconds
                    //     return false; // Remove the projectile if it hits an item
                    // }
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
            this.items = []; // Store item positions and text
            this.connections = []; // Store connections as pairs of item indices
        }
    
        // Resize canvas to fit the window
        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.redraw(); // Redraw on resize
        }
    
        // Add a new item with position and multiline text
        addItem(x, y, text = "", type = "top") {
            const item = { 
                x, 
                y, 
                text: text.split('\n'), // Split text into lines for multiline support
                type, // "top" or "bottom"
                hitOffset: { x: 0, y: 0 }, // Track displacement from hit
                textShakeOffset: { x: 0, y: 0 } // Offset for shake effect
            };
            this.items.push(item);
        }
    
        // Connect two items by their indices
        connectItems(index1, index2) {
            this.connections.push([index1, index2]);
        }
    
        // Add connected items (top and bottom) with a connecting line
        addConnectedItems(topX, topY, topText, bottomX, bottomY, bottomText) {
            // Add the top item
            this.addItem(topX, topY, topText, "");

            const topIndex = this.items.length;

            this.addItem(topX, topY+10, "", "circle");
            // Add the bottom item
            const bottomIndex = this.items.length;
            this.addItem(bottomX, bottomY, bottomText, "");
    
            // Connect the top and bottom items
            this.connectItems(topIndex, bottomIndex);
    
            // Redraw the canvas to reflect the changes
            this.redraw();
        }
    
        // Draw a single item with multiline text
        // Draw a single item with multiline text
        drawItem(item) {
            const { x, y, text, hitOffset, textShakeOffset, type } = item;
            const radius = 5; // Radius for the circle background

            // Calculate displaced position
            const displayX = x + hitOffset.x;

            // Draw circle only for top text
            const displayY = y + hitOffset.y - box.cameraY; 

            // Set the text color
            if(type === "title"){
                this.context.fillStyle = "white"; 
                this.context.font = "3rem Roboto mono"; // Set font size and family
                this.context.textAlign = "center"; // Center the text
            } else {
                this.context.fillStyle = "white"; 
                this.context.font = "16px Roboto mono"; // Set font size and family
                this.context.textAlign = "center"; // Center the text
            }

            const lineHeight = 18; // Line height for multiline text

            // Calculate maximum width of the text lines to add a black background rectangle
            let maxWidth = 0;
            text.forEach(line => {
                const lineWidth = this.context.measureText(line).width;
                if (lineWidth > maxWidth) {
                    maxWidth = lineWidth;
                }
            });

            // Draw the black background rectangle behind the text
            if (!(type === "circle")) {
                const backgroundPadding = 9; // Padding around the text
                this.context.fillStyle = "black"; // Set the background color to red
                
                // Adjust the position to place the background rectangle just below the text
                const textHeight = lineHeight * text.length; // Total height of the text block
                const rectTop = displayY - (textHeight / 2) - backgroundPadding;
                const rectBottom = rectTop + textHeight + backgroundPadding * 2;
                
                // Draw the background rectangle
                this.context.fillRect(
                    displayX - maxWidth / 2 - backgroundPadding, // Left
                    rectTop, // Top
                    maxWidth + backgroundPadding * 2, // Width
                    rectBottom - rectTop // Height
                );
            }
            

            // Draw the text
            text.forEach((line, index) => {
                const textX = displayX + textShakeOffset.x;
                const textY = displayY + textShakeOffset.y - ((text.length - 1) / 2) * lineHeight + index * lineHeight;
                this.context.fillStyle = "white"; // Set text color again for each line
                this.context.fillText(line, textX, textY); // Render each line
            });

            if (type === "circle") {
                this.context.beginPath();
                this.context.arc(displayX, displayY, radius, 0, Math.PI * 2);
                this.context.fillStyle = "white"; // Background color of the circle
                this.context.fill();
            }
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
            // Clear the canvas completely
            // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
            // Draw connections first
            for (const [index1, index2] of this.connections) {
                const item1 = this.items[index1];
                const item2 = this.items[index2];
                this.drawLine(
                    item1.x + item1.hitOffset.x,
                    item1.y + item1.hitOffset.y - box.cameraY + (item1.type === "top" ? 5 : 0), // Adjust for top circle radius
                    item2.x + item2.hitOffset.x,
                    item2.y + item2.hitOffset.y - box.cameraY
                );
            }
    
            // Draw items on top of connections
            for (const item of this.items) {
                this.drawItem(item);
            }
        }
    }
    
    

    const experienceCanvas = document.getElementById("experience-canvas");

    function resizeCanvas() {
        experienceCanvas.width = window.innerWidth;
        experienceCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);


    const context = experienceCanvas.getContext("2d");

    let box = new WhiteSprite(context, experienceCanvas, 25, 25);


    const constellation = new Constellation(context, experienceCanvas);

    // Add items (stars)
    widthPer = experienceCanvas.width / 100;
    heightPer = experienceCanvas.height / 100;

    constellation.addItem(widthPer*50, heightPer*10, "Experience", "title")
    constellation.addConnectedItems(widthPer*50, heightPer*30, "2021-2024",widthPer*50, heightPer*60, "Gradute from Senior Highschool 1 Penajam");

    constellation.addConnectedItems(widthPer*50, heightPer*70, "2024",widthPer*50, heightPer*100, "Undergraduate Computer Science Student on ITK");

    constellation.addConnectedItems(widthPer*50, heightPer*110, "2024",widthPer*50, heightPer*140, "Participate on EXPO for Informatics");
    
    constellation.addConnectedItems(widthPer*50, heightPer*150, "2024",widthPer*50, heightPer*180, "Infinite Public Relation Departement Apprentice Staff");

    constellation.addConnectedItems(widthPer*50, heightPer*190, "2024",widthPer*50, heightPer*220, "Joined IEEE ITK Student Branch AnP Staff");


    constellation.redraw();


    experienceCanvas.addEventListener("mousemove", (event) => {
        const rect = experienceCanvas.getBoundingClientRect();
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

    function handleMovement() {
        if (keysPressed['w']) box.move('up');
        if (keysPressed['s']) box.move('down');
    }

    function animate() {
        handleMovement();
        constellation.redraw()
        box.draw();


        requestAnimationFrame(animate);
    }

    animate();


    document.querySelectorAll('.next').forEach(button => {
        button.addEventListener('click', function() {
            experienceDiv.classList.remove("show");
            const originalBodyHTML = document.body.innerHTML;

// Reset to original state
document.body.innerHTML = originalBodyHTML;
            projectCanvas()
        });
    });

    document.querySelectorAll('.prev').forEach(button => {
        button.addEventListener('click', function() {
            experienceDiv.classList.remove("show");
            const originalBodyHTML = document.body.innerHTML;

// Reset to original state
document.body.innerHTML = originalBodyHTML;
            contactsCanvas()
        });
    });
    
    document.querySelectorAll('.menu').forEach(button => {
        button.addEventListener('click', function() {
            experienceDiv.classList.remove("show");
            mainCanvas();
        });
    });
}