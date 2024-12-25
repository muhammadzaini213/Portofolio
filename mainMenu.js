function mainCanvas(){
    const originalBodyHTML = document.body.innerHTML;
    document.body.innerHTML = originalBodyHTML;
    const mainMenu = document.getElementById('main-menu');
    mainMenu.classList.add('show');
    let isTransition = true;
    let isHit = false
    let hitIndex = 0
    let isTextTransition = true;

    let isActive = true;

    class WhiteSprite {
        constructor(context, canvas, width, height, color = "white") {
            this.context = context;
            this.canvas = canvas;
            this.width = width;
            this.height = height;
            this.color = color;
            this.x = canvas.width / 2 - width;
            this.y = canvas.height / 2;
            this.textItems = ["Contacts", "Experience", "Project", "About", "Skills", "Prototypes"];
            this.radius = 200;
            this.hoverTolerance = 0.2; // Allowable angle difference for hover detection
            this.hoverStates = Array(this.textItems.length).fill(false); // Hover states for each text
            this.textTransitions = Array(this.textItems.length).fill(null); // Transitions for each text
            this.mouseX = 0;
            this.mouseY = 0;
            this.projectiles = []; // Array to store active projectiles
        
            this.initMouseEvents();
        }
    
        initMouseEvents() {
            this.canvas.addEventListener("mousemove", (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
        
                this.draw(); // Redraw to reflect changes
            });
    
            this.canvas.addEventListener("click", (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                this.shoot(mouseX, mouseY);
            });
        }
    
    
        drawBox() {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
        
            // Calculate the angle between the box center and the cursor
            const angle = Math.atan2(this.mouseY - centerY, this.mouseX - centerX);
        
            this.context.save();
        
            this.context.translate(centerX, centerY);
            this.context.rotate(angle + Math.PI / 4);
            this.context.fillStyle = this.color;
            this.context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            this.context.restore();
        }
    

        detectTextHit(projectile) {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
        
            // Define fixed positions
            const positions = [
                { angle: Math.PI / 2, index: 0 },
                { angle: Math.PI / 6 * 5, index: 1 },
                { angle: Math.PI / 6 * 7, index: 2 },
                { angle: Math.PI / 2 * 3, index: 3 },
                { angle: Math.PI / 6 * 11, index: 4 },
                { angle: Math.PI / 6 * 13, index: 5 },
            ];
        
            for (const { angle, index } of positions) {
                const textX = centerX + this.radius * Math.cos(angle);
                const textY = centerY + this.radius * Math.sin(angle);
        
                const distance = Math.sqrt(
                    (projectile.x - textX) ** 2 + (projectile.y - textY) ** 2
                );
        
                // Check if the projectile hit the text and if the text has not been hit before
                if (distance < 30 && !(this.textTransitions[index] && this.textTransitions[index].hit)) {
                    // Start the scaling transition after the hit
                    this.textTransitions[index] = {
                        alpha: 1,  // Make text fully visible
                        radius: this.radius, // Keep the radius constant
                        scale: 1.2, // Start with a scale of 1.2 for the increase effect
                        hit: true,  // Mark as hit
                    };

                    if(!isHit){
                        hitIndex = index
                        isHit = true
                    }
                    return index; // Return index of the hit text
                }
            }
        
            return -1; // No hit
        }
        
        
        textHitAnimation(index) {
            const text = this.textItems[index];
            let transition = this.textTransitions[index];
        
            if(isTextTransition){
            // Default transition values for scaling the text
            let scale = 0;  // Start with no scaling (scale = 0)
        
            if (transition) {
                // If transition is still ongoing, scale the text
                if (transition.scale < 2) {  // Scale up to 2x the original size
                    // Gradually increase scale and fade in
                    transition.alpha += 0.05;  // Fade in gradually
                    transition.scale += 0.05;  // Increase scale towards the target scale of 2
                }
        
                // If transition has reached the target scale
                if (transition.scale >= 2) {
                    transition.scale = 2;  // Set scale to 2 (double the original size)
                    transition.alpha = 1;  // Set alpha to fully visible
                    // Log when the transition reaches the final scale
                    isTextTransition = false

                    console.log(`Transition for text ${text} has reached final scale: ${transition.scale}`);
                    
                    // Stop the transition by clearing the state
                    this.textTransitions[index] = null; // Stop the transition
                }
        
                // Apply updated transition values for ongoing transition
                scale = transition.scale;
            } else {
                // If no transition is set, initialize it once
                this.textTransitions[index] = {
                    alpha: 0,  // Start with full transparency
                    scale: 0,  // Start with scale = 0 (invisible)
                };
            }
        
            // Only draw the text if the transition is still active
            if (transition) {
                // Draw the scaled text at the original position
                const originalX = 100;  // Example position (you can change it)
                const originalY = 100;  // Example position (you can change it)
        
                // Apply the scale to the font size (twice the original size at the end)
                const scaledFontSize = 40 * scale;  // Scale the font size to be 2x the original size at the end
        
                // Apply alpha for fading effect
                this.context.fillStyle = `rgba(255, 255, 255, ${transition.alpha})`;
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
        
                // Apply the scaled font size to the context
                this.context.font = `${scaledFontSize}px Roboto Mono`;
                // Draw the text at the original position
            }
        
        }
        }
    
        drawTextItems() {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const positions = [
                { angle: Math.PI / 2, index: 0 },
                { angle: Math.PI / 6 * 5, index: 1 },
                { angle: Math.PI / 6 * 7, index: 2 },
                { angle: Math.PI / 2 * 3, index: 3 },
                { angle: Math.PI / 6 * 11, index: 4 },
                { angle: Math.PI / 6 * 13, index: 5 },
            ];
        
            positions.forEach(({ angle, index }) => {
                const text = this.textItems[index];
                let transition = this.textTransitions[index];
        
                // Default transition values
                let alpha = 0;  // Start fully transparent
                let radius = this.radius * 8;  // Start at 2x radius
        
                if (transition) {
                    // If transition is still ongoing
                    if (transition.radius > this.radius) {
                        // Gradually reduce the radius and fade in
                        transition.alpha += 0.1;  // Fade in gradually
                        transition.radius -= 10;  // Move towards the target radius
                    }
        
                    // If transition has reached the target radius
                    if (transition.radius <= this.radius) {
                        transition.radius = this.radius;  // Set the radius to the desired value
                        transition.alpha = 1;  // Set alpha to fully visible
                        this.textTransitions[index] = null; // Stop the transition by clearing the state
        
                        // After transition ends, draw the text at the final position
                        const finalX = centerX + this.radius * Math.cos(angle);
                        const finalY = centerY + this.radius * Math.sin(angle);
        
                        this.context.fillStyle = `rgba(255, 255, 255, ${transition.alpha})`;
                        this.context.textAlign = "center";
                        this.context.textBaseline = "middle";
                        this.context.font = `20px Roboto Mono`;
                        this.context.fillText(text, finalX, finalY);
                        isTransition = false
                        return; // Exit early to prevent further drawing in transition state
                    }
        
                    // Apply updated transition values for ongoing transition
                    alpha = transition.alpha;
                    radius = transition.radius;
                } else {
                    // If no transition is set, initialize it once
                    this.textTransitions[index] = {
                        alpha: 0,  // Start with full transparency
                        radius: this.radius * 2,  // Start at double the radius
                    };
                }
        
                // If the transition is still ongoing, keep rendering the transition effect
                const transitionX = centerX + radius * Math.cos(angle);
                const transitionY = centerY + radius * Math.sin(angle);
        
                // Apply alpha for fading effect
                this.context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
                this.context.font = `20px Roboto Mono`;
                this.context.fillText(text, transitionX, transitionY);
            });
        }
        
        drawTextItemsNoTransition() {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const positions = [
                { angle: Math.PI / 2, index: 0 },
                { angle: Math.PI / 6 * 5, index: 1 },
                { angle: Math.PI / 6 * 7, index: 2 },
                { angle: Math.PI / 2 * 3, index: 3 },
                { angle: Math.PI / 6 * 11, index: 4 },
                { angle: Math.PI / 6 * 13, index: 5 },
            ];
        
            positions.forEach(({ angle, index }) => {
                const text = this.textItems[index];
                let transition = this.textTransitions[index];
        
                // Default values
                let scale = 1;  // Default scale is 1
                let alpha = 1;  // Always fully visible
                let radius = this.radius; // Normal radius
        
                if (transition && transition.scale) {
                    // Apply scale if transition is active
                    scale = transition.scale;
                    transition.scale -= 0.02;  // Reduce scale over time to normalize
        
                    // If scaling has completed, reset scale and keep it normal
                    if (transition.scale <= 1) {
                        transition.scale = 1;
                        transition.scaled = true;
                    }
                }
        
                // Apply scaling effect when drawing the text
                this.context.save();
                const textX = centerX + radius * Math.cos(angle);
                const textY = centerY + radius * Math.sin(angle);
        
                this.context.translate(textX, textY); // Translate to text position
                this.context.scale(scale, scale); // Apply scaling
        
                // Draw the text
                this.context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
                this.context.font = `20px Roboto Mono`;
                this.context.fillText(text, 0, 0); // Draw at translated position
        
                this.context.restore(); // Restore original state
            });
        }
        
        
        updateProjectiles() {
            this.projectiles = this.projectiles.filter((projectile) => {
                const hitTextIndex = this.detectTextHit(projectile);
                if (hitTextIndex !== -1) {
                    this.textTransitions[hitTextIndex] = { scale: 1, alpha: 1 }; // Start transition
                }
                
    
                return (
                    projectile.x > 0 &&
                    projectile.x < this.canvas.width &&
                    projectile.y > 0 &&
                    projectile.y < this.canvas.height
                );
            });
    
            this.projectiles.forEach((projectile) => {
                projectile.x += projectile.direction.x * projectile.speed;
                projectile.y += projectile.direction.y * projectile.speed;
            });
        }
        
        shoot(targetX, targetY) {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
    
            // Calculate the direction vector
            const dx = targetX - centerX;
            const dy = targetY - centerY;
            const magnitude = Math.sqrt(dx * dx + dy * dy);
    
            // Normalize the direction vector
            const direction = { x: dx / magnitude, y: dy / magnitude };
    
            // Create a new projectile
            this.projectiles.push({
                x: centerX,
                y: centerY,
                width: 10,
                height: 10,
                color: "white",
                speed: 10,
                direction,
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
    
        draw() {
            if(isActive){
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
                this.drawBox();
                if(isTransition){
                    this.drawTextItems();
                } else {
                    if(isTextTransition){
                    this.drawTextItemsNoTransition();
                    } else {
                        ["Contacts", "Experience", "Project", "About", "Skills", "Prototypes"];
                        switch(hitIndex){
                            case 0:
                                contactsCanvas()
                            break;
                            case 1:
                                experienceCanvas()
                            break;
                            case 2:
                                projectCanvas()
                            break;
                            case 3:
                                aboutCanvas()
                            break;
                            case 4:
                                skillsCanvas()
                            break;
                            case 5:
                                prototypesCanvas()
                            break;
                        }
                        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        isActive = false
                    }
                }
    
                if(!isHit){
                    this.updateProjectiles();
                    this.drawProjectiles();
                } else {
                    if(isTextTransition){
                    this.textHitAnimation(hitIndex)
                    }
                }
            }
           
        }
    
    }
    
    // Initialization
    const mainCanvas = document.getElementById("main-menu-canvas");
    
    function resizeCanvas() {
        mainCanvas.width = window.innerWidth;
        mainCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    const context = mainCanvas.getContext("2d");
    let box = new WhiteSprite(context, mainCanvas, 25, 25);
    
    function animate() {
        box.draw();
        requestAnimationFrame(animate);
    }
    
    animate();

}