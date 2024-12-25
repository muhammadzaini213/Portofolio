function contactsCanvas() {
    let isActive = true;
    document.getElementById("contacts").outerHTML = document.getElementById("contacts").outerHTML;



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

    const contactsDiv = document.getElementById("contacts");
    document.getElementById("main-menu").classList.remove("show");
    contactsDiv.classList.add("show");

    const contacts_canvas = document.getElementById("contacts-canvas");

    contacts_canvas.width = contacts_canvas.offsetWidth;
    contacts_canvas.height = contacts_canvas.offsetHeight;

    const context = contacts_canvas.getContext("2d");


    let box = new WhiteSprite(context, contacts_canvas, 0.4);  // 40% of the smaller dimension


    
    function animate() {
        box.draw();
        requestAnimationFrame(animate);
    }

    animate();


    // Recalculate canvas size on window resize
    window.addEventListener("resize", () => {
        contacts_canvas.width = contacts_canvas.offsetWidth;
        contacts_canvas.height = contacts_canvas.offsetHeight;
    });

    document.querySelectorAll('.next').forEach(button => {
        button.addEventListener('click', function() {
            contactsDiv.classList.remove("show");
            isActive = false;
            const originalBodyHTML = document.body.innerHTML;

// Reset to original state
document.body.innerHTML = originalBodyHTML;
            document.getElementById("contacts").outerHTML = document.getElementById("contacts").outerHTML;            // Add your functionality here
            experienceCanvas()
        });
    });

    document.querySelectorAll('.prev').forEach(button => {
        button.addEventListener('click', function() {
            contactsDiv.classList.remove("show");
            isActive = false;
            const originalBodyHTML = document.body.innerHTML;

// Reset to original state
document.body.innerHTML = originalBodyHTML;
            document.getElementById("contacts").outerHTML = document.getElementById("contacts").outerHTML;            // Add your functionality here
            prototypesCanvas()
        });
    });
    
    document.querySelectorAll('.menu').forEach(button => {
        button.addEventListener('click', function() {
            contactsDiv.classList.remove("show");
            
            isActive = false;
            document.getElementById("contacts").outerHTML = document.getElementById("contacts").outerHTML;
            mainCanvas();
        });
    });

    const inputDiv = document.getElementById("terminal-input");
    const terminal_text = document.getElementById("terminal-text");
    terminal_text.innerHTML = "";
    
    let z = 0;
    const text1 = 'ATF-05 Terminal Emulator [Version 1.0.0]<br>(c) 2024 ATF Corporation. All rights reserved.<br><br>Please type contacts info for more information<br>';
    
    const speed = 10;
    
    function intro() {
        if (isActive) {
            if (z < text1.length) {
                // Handle line breaks explicitly
                if (text1.startsWith('<br>', z)) {
                    terminal_text.innerHTML += '<br>';
                    z += 4; // Skip the length of '<br>'
                } else {
                    terminal_text.innerHTML += text1.charAt(z);
                    z++;
                }
    
                // Schedule next character
                setTimeout(intro, speed);
            } else {
                z = 0; // Reset for future usage if necessary
                inputDiv.classList.add("show"); // Show input
            }
        }
    }
    
    
    const contactInf = `
    <br><br>If you want to ask me something, just ask on these contacts!
    <br><br>phone/whatsapp: +62895342551335
    <br>email: gamerlemah15@gmail.com
    <br>github: <a href="https://github.com/muhammadzaini213" target="_blank">Link</a>
    <br>linkedin: <a href="https://www.linkedin.com/in/m-zaini-a8582b306" target="_blank">Link</a>
    <br><br>That's all I had for now
    <br><br>progress stopped, exit code 0
    <br><br>end msg: Thank you for coming!!!
    `;

function showContacts() {

    if (z < contactInf.length) {
        if (contactInf.slice(z, z + 4) === '<br>') {
            terminal_text.innerHTML += '<br>';
            z += 4; // Skip the characters for <br>
        } else if (contactInf.slice(z, z + 70) === '<a href="https://github.com/muhammadzaini213" target="_blank">Link</a>') {
            terminal_text.innerHTML += '<a href="https://github.com/muhammadzaini213" target="_blank">Link</a>';
            z += 70; // Skip the characters for <br>
        }  else if (contactInf.slice(z, z + 80) === '<a href="https://www.linkedin.com/in/m-zaini-a8582b306" target="_blank">Link</a>') {
            terminal_text.innerHTML += '<a href="https://www.linkedin.com/in/m-zaini-a8582b306" target="_blank">Link</a>';
            z += 80; // Skip the characters for <br>
        } else {
            terminal_text.innerHTML += contactInf.charAt(z);
            z++;
        }
        setTimeout(showContacts, speed);
    } else {
        z = 0;
    }
}

    intro()
    const editableParagraph = document.getElementById('input');
        editableParagraph.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevents adding a new line
                if(editableParagraph.innerHTML == "contacts info"){
                    terminal_text.innerHTML = terminal_text.innerHTML + "<br>termina >>> " + editableParagraph.innerHTML
                    showContacts()
                    editableParagraph.innerHTML = ""
                    inputDiv.classList.remove("show")
                } else {
                    terminal_text.innerHTML = terminal_text.innerHTML + "<br>termina >>> " + editableParagraph.innerHTML+ "<br>Command not found, please type contacts info"
                    editableParagraph.innerHTML = ""
                }
                console.log(editableParagraph.innerHTML)

            }
    });
}