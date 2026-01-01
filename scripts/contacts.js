/* =========================
   MAIN FUNCTION
========================= */
function contactsCanvas() {
    const STATE = {
        isActive: true,
        typingIndex: 0
    };

    // Reset contacts element
    document.getElementById("contacts").outerHTML = document.getElementById("contacts").outerHTML;

    /* =========================
       DOM ELEMENTS
    ========================= */
    const contactsDiv = document.getElementById("contacts");
    const canvas = document.getElementById("contacts-canvas");
    const context = canvas.getContext("2d");

    // Show contacts section first
    document.getElementById("main-menu").classList.remove("show");
    contactsDiv.classList.add("show");

    /* =========================
       CANVAS SETUP
    ========================= */
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    // Initial resize after element is visible
    setTimeout(() => {
        resizeCanvas();
    }, 0);

    window.addEventListener("resize", resizeCanvas);

    /* =========================
       WHITE SPRITE CLASS
    ========================= */
    class WhiteSprite {
        constructor(ctx, canvasElement, sizePercentage) {
            this.ctx = ctx;
            this.canvas = canvasElement;
            this.sizePercentage = sizePercentage;
            this.color = CONTACTS_CONFIG.boxColor;
            
            this.mouseX = 0;
            this.mouseY = 0;

            this.initMouseTracking();
        }

        get x() {
            return this.canvas.width / 2;
        }

        get y() {
            return this.canvas.height / 2;
        }

        initMouseTracking() {
            document.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
            });
        }

        drawBox() {
            const size = Math.min(this.canvas.width, this.canvas.height) * this.sizePercentage;
            const angle = Math.atan2(this.mouseY - this.y, this.mouseX - this.x);

            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(angle + Math.PI / 4);
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(-size / 2, -size / 2, size, size);
            this.ctx.restore();
        }

        draw() {
            if (STATE.isActive) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.drawBox();
            }
        }
    }

    /* =========================
       TERMINAL FUNCTIONALITY
    ========================= */
    class Terminal {
        constructor() {
            this.inputDiv = document.getElementById("terminal-input");
            this.textDisplay = document.getElementById("terminal-text");
            this.editableInput = document.getElementById("input");
            
            this.textDisplay.innerHTML = "";
            this.initInputHandler();
        }

        initInputHandler() {
            this.editableInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.handleCommand(this.editableInput.innerHTML.trim());
                }
            });
        }

        handleCommand(command) {
            this.textDisplay.innerHTML += `<br>termina >>> ${command}`;

            if (command === CONTACTS_CONFIG.messages.command) {
                this.showContactInfo();
                this.inputDiv.classList.remove("show");
            } else {
                this.textDisplay.innerHTML += CONTACTS_CONFIG.messages.notFound;
            }

            this.editableInput.innerHTML = "";
        }

        typeText(text, callback) {
            if (!STATE.isActive) return;

            if (STATE.typingIndex < text.length) {
                // Handle HTML tags
                if (text.startsWith('<br>', STATE.typingIndex)) {
                    this.textDisplay.innerHTML += '<br>';
                    STATE.typingIndex += 4;
                } else {
                    this.textDisplay.innerHTML += text.charAt(STATE.typingIndex);
                    STATE.typingIndex++;
                }

                setTimeout(() => this.typeText(text, callback), CONTACTS_CONFIG.typingSpeed);
            } else {
                STATE.typingIndex = 0;
                if (callback) callback();
            }
        }

        showIntro() {
            this.typeText(CONTACTS_CONFIG.terminalIntro, () => {
                this.inputDiv.classList.add("show");
            });
        }

        showContactInfo() {
            const contactText = this.buildContactInfoHTML();
            this.typeContactInfo(contactText);
        }

        buildContactInfoHTML() {
            const { phone, email, github, linkedin } = CONTACTS_CONFIG.contactInfo;
            const { exitCode, endMessage } = CONTACTS_CONFIG.messages;

            return `<br><br>If you want to ask me something, just ask on these contacts!<br><br>phone/whatsapp: ${phone}<br>email: ${email}<br>github: <a href="${github.url}" target="_blank">${github.text}</a><br>linkedin: <a href="${linkedin.url}" target="_blank">${linkedin.text}</a><br><br>That's all I had for now${exitCode}${endMessage}`;
        }

        typeContactInfo(text) {
            if (!STATE.isActive || STATE.typingIndex >= text.length) {
                STATE.typingIndex = 0;
                return;
            }

            // Handle different HTML patterns
            const patterns = [
                { tag: '<br>', length: 4 },
                { tag: `<a href="${CONTACTS_CONFIG.contactInfo.github.url}" target="_blank">${CONTACTS_CONFIG.contactInfo.github.text}</a>`, length: 70 },
                { tag: `<a href="${CONTACTS_CONFIG.contactInfo.linkedin.url}" target="_blank">${CONTACTS_CONFIG.contactInfo.linkedin.text}</a>`, length: 80 }
            ];

            let handled = false;
            for (const pattern of patterns) {
                if (text.slice(STATE.typingIndex, STATE.typingIndex + pattern.length) === pattern.tag) {
                    this.textDisplay.innerHTML += pattern.tag;
                    STATE.typingIndex += pattern.length;
                    handled = true;
                    break;
                }
            }

            if (!handled) {
                this.textDisplay.innerHTML += text.charAt(STATE.typingIndex);
                STATE.typingIndex++;
            }

            setTimeout(() => this.typeContactInfo(text), CONTACTS_CONFIG.typingSpeed);
        }
    }

    /* =========================
       NAVIGATION HANDLERS
    ========================= */
    function resetAndNavigate(targetCanvas) {
        contactsDiv.classList.remove("show");
        STATE.isActive = false;
        
        const originalBodyHTML = document.body.innerHTML;
        document.body.innerHTML = originalBodyHTML;
        
        document.getElementById("contacts").outerHTML = document.getElementById("contacts").outerHTML;
        
        targetCanvas();
    }

    function initNavigationButtons() {
        document.querySelectorAll('.next').forEach(button => {
            button.addEventListener('click', () => {
                resetAndNavigate(experienceCanvas);
            });
        });

        document.querySelectorAll('.prev').forEach(button => {
            button.addEventListener('click', () => {
                resetAndNavigate(prototypesCanvas);
            });
        });

        document.querySelectorAll('.menu').forEach(button => {
            button.addEventListener('click', () => {
                contactsDiv.classList.remove("show");
                STATE.isActive = false;
                
                document.getElementById("contacts").outerHTML = document.getElementById("contacts").outerHTML;
                
                mainCanvas();
            });
        });
    }

    /* =========================
       INITIALIZATION
    ========================= */
    // Initialize sprite
    const sprite = new WhiteSprite(context, canvas, CONTACTS_CONFIG.boxSizePercentage);

    // Animation loop
    function animate() {
        sprite.draw();
        requestAnimationFrame(animate);
    }

    animate();

    // Initialize terminal
    const terminal = new Terminal();
    terminal.showIntro();

    // Initialize navigation
    initNavigationButtons();
}