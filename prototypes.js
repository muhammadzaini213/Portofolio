function prototypesCanvas() {
    let isEntered = false;  // Flag to toggle the "View?" text
    let currentAimedItemIndex = null;
    class AimCursor {
        constructor(context, canvas, imageSrc) {
            this.context = context;
            this.canvas = canvas;
            this.x = prototypesCanvas.width / 4; // Start at the center of the canvas
            this.y = prototypesCanvas.height / 4;
            console.log(this.x, this.y)
            this.size = 50; // Size of the image
            this.speed = 5; // How much the cursor moves with each key press
            this.image = new Image(); // Create an image element
            this.image.src = imageSrc; // Set the source to the provided image URL
            this.image.onload = () => {
                // Ensure the image is drawn after it has loaded
                this.redraw();
            };


            
    
        }

        aimAtItem(items) {
            const threshold = this.size / 2 + 10; // Define how close the cursor has to be
            let aimedItem = null;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const dx = this.x - (item.x + item.hitOffset.x); // Calculate horizontal distance
                const dy = this.y - (item.y + item.hitOffset.y); // Calculate vertical distance
                const distance = Math.sqrt(dx * dx + dy * dy); // Calculate Euclidean distance
    
                if (distance < threshold) {
                    aimedItem = item; // Set the item if the cursor is close enough
                    break;
                }
            }
            return aimedItem; // Return the aimed item or null
        }
        
        move (direction) {
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
            this.redraw();
        }
        
    
        // Draw the image as the cursor
        drawCursor() {
            const { x, y, size, image } = this;
    
            // Draw the image at the cursor's position
            this.context.drawImage(image, x - size / 2, y - size / 2, size, size);
        }
    

        redraw() {
            if (this.image.complete) { 
                this.drawCursor()
            }
        }
    }
    

    

    class Constellation {
        constructor(context, canvas) {
            this.context = context;
            this.canvas = canvas;
            this.items = []; // Store item positions and images
            this.connections = []; 
            this.isEntered = false;
        }

    
        // Resize canvas to fit the window
        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.redraw(); // Redraw on resize
        }
    
        // Add a new item with position and optional image
        addItem(x, y, color, link) {
            const item = { 
                x, 
                y, 
                color: color, 
                hitOffset: { x: 0, y: 0 }, // Track displacement from hit 
                link: link, // Add link for each item
                hitText: null // Text displayed when aimed at
            };
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
                handleMovement();
        
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
            const { x, y, color, hitOffset, hitText, textShakeOffset } = item;
            const size = 15; // Size of the background and image
            const radius = size / 2;
        
            // Calculate displaced position
            const displayX = x + hitOffset.x;
            const displayY = y + hitOffset.y;
        
            // Draw the item as a rectangle (or circle if needed)
            this.context.fillStyle = color;
            this.context.beginPath();
            const width = radius * 1.6; // Width of the box (adjust as needed)
            const height = radius * 1.6; // Height of the box (adjust as needed)
            this.context.rect(displayX - width / 2, displayY - height / 2, width, height);
            this.context.fill();
        
            // If the item has been hit (cursor is aimed at it), display text with a shake effect
            // In the drawItem method
            if (hitText) {
                const textX = displayX + (textShakeOffset?.x || 0); // Apply shake offset
                const textY = displayY - radius - 10 + (textShakeOffset?.y || 0);

                this.context.fillStyle = "white"; // Set text color
                this.context.font = "16px Roboto mono"; // Set font size and family
                this.context.textAlign = "center"; // Center the text
                if(!isEntered){
                    this.context.fillText(hitText, textX, textY); // Position text above the item
                } else {
                    
                    this.context.fillText("View?", textX, textY); // Position text above the item
                }
                console.log(isEntered)
            }

        }
        

        redraw() {
            // Clear the canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
            // Check if cursor is aimed at any item
            const aimedItem = aimCursorInstance.aimAtItem(this.items);
    
            const aimedItemIndex = this.items.indexOf(aimedItem);
            // Reset hitText for all items
            this.items.forEach(item => item.hitText = null); // Clear the text for all items
    
           
            if (currentAimedItemIndex !== aimedItemIndex) {
                currentAimedItemIndex = aimedItemIndex; 
                console.log(currentAimedItemIndex) // Update the current aimed item
            }
    
                // Set different text based on the index
                if (aimedItemIndex === 0) {
                    aimedItem.hitText = "Portofolio";
                } else if (aimedItemIndex === 1) {
                    aimedItem.hitText = "SuperAI 122";
                } else if (aimedItemIndex === 2) {
                    aimedItem.hitText = "Third item!";
                } else {
                    isEntered = false
                }
            

                if (aimedItem) {
                    const aimedItemIndex = this.items.indexOf(aimedItem);
            
                    // Push the old text above and add "View?" below it
                    if (aimedItem.hitText) {
                        const oldText = aimedItem.hitText;
                        const fontSize = 20;
                        const lineHeight = 30;
            
                        // Set the font for text rendering
                        this.context.font = `${fontSize}px Arial`;
                        this.context.fillStyle = 'black';  // Set the text color
            
                        // Draw the old text at the top
                        this.context.fillText(oldText, aimedItem.x - aimedItem.size / 2, aimedItem.y - aimedItem.size / 2 - lineHeight);
            
                        // Draw "View?" text below the old text
                        this.context.fillText("View?", aimedItem.x - aimedItem.size / 2, aimedItem.y - aimedItem.size / 2 + lineHeight);
                    }
                }

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

    let keysPressed = {};

    // Initialize the canvas and context
    const prototypesDiv = document.getElementById("prototypes");
    document.getElementById("main-menu").classList.remove("show");
    prototypesDiv.classList.add("show");

    const prototypesCanvas = document.getElementById("prototypes-canvas");
    const context = prototypesCanvas.getContext("2d");


   
    const dpr = window.devicePixelRatio || 1;
    prototypesCanvas.width = prototypesCanvas.clientWidth * dpr;
    prototypesCanvas.height = prototypesCanvas.clientHeight * dpr;
    context.scale(dpr, dpr);

    // Instantiate Constellation class
    const cursorImage = 'assets/aimCursor.png'; // Replace with your image path

    const constellation = new Constellation(context, prototypesCanvas);
    const aimCursorInstance = new AimCursor(context, prototypesCanvas, cursorImage);



    const widthPer = prototypesCanvas.width / 100/2;
    const heightPer = prototypesCanvas.height / 100/2;

    constellation.addItem(widthPer * 16, heightPer * 23, "red", "https://google.com");
    constellation.addItem(widthPer * 56, heightPer * 73, "purple", "https://youtu.be/dQw4w9WgXcQ?si=lqJuyITXD8Vb1X3f");


    // Start the animation
    // constellation.swingAll();
    constellation.redraw()
    constellation.swingAll()

    
    // Instantiate AimCursor with the image source
    
    // Initial redraw to draw the cursor (before any key press)
    aimCursorInstance.redraw();
    

    window.addEventListener("keydown", (event) => {
        keysPressed[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
        keysPressed[event.key] = false;
    });

    window.addEventListener('click', (event) => {
        const rect = prototypesCanvas.getBoundingClientRect();
        const targetX = event.clientX - rect.left;
        const targetY = event.clientY - rect.top;
        // box.shoot(targetX, targetY);
    });
    function handleMovement() {
        if (keysPressed['w']) aimCursorInstance.move('up');
        if (keysPressed['s']) aimCursorInstance.move('down');
        if (keysPressed['a']) aimCursorInstance.move('left');
        if (keysPressed['d']) aimCursorInstance.move('right');
    }

    // Event listeners for navigation buttons
    document.querySelectorAll('.next').forEach(button => {
        button.addEventListener('click', function() {
            prototypesDiv.classList.remove("show");
            const originalBodyHTML = document.body.innerHTML;

// Reset to original state
document.body.innerHTML = originalBodyHTML;
            contactsCanvas()
            // Add your functionality here
        });
    });

    document.querySelectorAll('.prev').forEach(button => {
        button.addEventListener('click', function() {
            prototypesDiv.classList.remove("show");
            const originalBodyHTML = document.body.innerHTML;

// Reset to original state
document.body.innerHTML = originalBodyHTML;
            skillsCanvas()        
        });
    });

    document.querySelectorAll('.menu').forEach(button => {
        button.addEventListener('click', function() {
            prototypesDiv.classList.remove("show");
            mainCanvas();
        });
    });

    function animate() {
        handleMovement();
        constellation.redraw();
        aimCursorInstance.redraw();
        requestAnimationFrame(animate);
    }

    animate();


    window.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            if(!isEntered){
                isEntered = true;
            } else {
                const aimedItem = aimCursorInstance.aimAtItem(constellation.items);  // Get the aimed item
                window.location.href = aimedItem.link;  // Redirect to the unique link for the aimed item
            }

        }
    });
    

    
    window.addEventListener("keyup", (event) => {
        keysPressed[event.key] = false;
    });
}
