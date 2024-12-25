function aboutCanvas() {
    let isActive = true;

    class WhiteSprite {
        constructor(context, canvas, sizePercentage, color = "white") {
            this.context = context;
            this.canvas = canvas;
            this.sizePercentage = sizePercentage;
            this.color = color;
            this.mouseX = 0;
            this.mouseY = 0;
            this.x = canvas.width / 2;  // Set initial x position to center
            this.y = canvas.height / 2; // Set initial y position to center

            // Add global mousemove event listener to track mouse position globally
            document.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
            });
        }

        drawBox() {
            this.context.fillStyle = this.color;
            // Calculate dynamic size based on the smaller dimension of the canvas
            const size = Math.min(this.canvas.width, this.canvas.height) * this.sizePercentage;

            // Centering the square box and rotating it
            this.context.save(); // Save the current state before applying transformations
            this.context.translate(this.x, this.y);  // Move the origin to the center of the box

            // Calculate the angle to rotate the box towards the mouse
            const angle = Math.atan2(this.mouseY - this.y, this.mouseX - this.x);

            // Apply the rotation
            this.context.rotate(angle + Math.PI /4);

            // Draw the box (centered at the new origin)
            this.context.fillRect(-size / 2, -size / 2, size, size);

            this.context.restore(); // Restore the previous state to prevent affecting other drawings
        }

        draw() {
            if (isActive) {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.drawBox();
            }
        }
    }

    const aboutDiv = document.getElementById("about");
    document.getElementById("main-menu").classList.remove("show");
    aboutDiv.classList.add("show");

    const about_canvas = document.getElementById("about-canvas");

    about_canvas.width = about_canvas.offsetWidth;
    about_canvas.height = about_canvas.offsetHeight;

    const context = about_canvas.getContext("2d");

    let box = new WhiteSprite(context, about_canvas, 0.4);  // 40% of the smaller dimension
    
    function animate() {
        box.draw();
        requestAnimationFrame(animate);
    }

    animate();


    // Recalculate canvas size on window resize
    window.addEventListener("resize", () => {
        about_canvas.width = about_canvas.offsetWidth;
        about_canvas.height = about_canvas.offsetHeight;
        
    });

    document.querySelectorAll('.next').forEach(button => {
        button.addEventListener('click', function() {
            aboutDiv.classList.remove("show");
            const originalBodyHTML = document.body.innerHTML;

// Reset to original state
document.body.innerHTML = originalBodyHTML;
            skillsCanvas()
        });
    });

    document.querySelectorAll('.prev').forEach(button => {
        button.addEventListener('click', function() {
            aboutDiv.classList.remove("show");
            const originalBodyHTML = document.body.innerHTML;

// Reset to original state
document.body.innerHTML = originalBodyHTML;
            projectCanvas()
        });
    });
    
    document.querySelectorAll('.menu').forEach(button => {
        button.addEventListener('click', function() {
            aboutDiv.classList.remove("show");
            mainCanvas();
        });
    });
    
}