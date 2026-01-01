function aboutCanvas() {
    /* =========================
       CONFIG & STATE
    ========================= */

    const STATE = {
        isActive: true
    };

    const CONFIG = {
        boxSizePercent: 0.4,
        boxColor: "white"
    };

    /* =========================
       CANVAS SETUP
    ========================= */

    const aboutDiv = document.getElementById("about");
    const canvas = document.getElementById("about-canvas");
    const context = canvas.getContext("2d");

    document.getElementById("main-menu").classList.remove("show");
    aboutDiv.classList.add("show");

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    /* =========================
       SPRITE
    ========================= */

    class WhiteSprite {
        constructor(ctx, canvas, sizePercent, color) {
            this.ctx = ctx;
            this.canvas = canvas;
            this.sizePercent = sizePercent;
            this.color = color;

            this.x = canvas.width / 2;
            this.y = canvas.height / 2;

            this.mouseX = 0;
            this.mouseY = 0;

            this.bindMouse();
        }

        bindMouse() {
            document.addEventListener("mousemove", e => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
            });
        }

        drawBox() {
            const size =
                Math.min(this.canvas.width, this.canvas.height) *
                this.sizePercent;

            const angle = Math.atan2(
                this.mouseY - this.y,
                this.mouseX - this.x
            );

            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(angle + Math.PI / 4);
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(-size / 2, -size / 2, size, size);
            this.ctx.restore();
        }

        draw() {
            if (!STATE.isActive) return;

            this.ctx.clearRect(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );

            this.drawBox();
        }
    }

    const box = new WhiteSprite(
        context,
        canvas,
        CONFIG.boxSizePercent,
        CONFIG.boxColor
    );

    /* =========================
       LOOP
    ========================= */

    function animate() {
        box.draw();
        requestAnimationFrame(animate);
    }

    animate();

    /* =========================
       NAVIGATION
    ========================= */

    function resetAndGo(next) {
        STATE.isActive = false;
        aboutDiv.classList.remove("show");
        document.body.innerHTML = document.body.innerHTML;
        next();
    }

    document.querySelectorAll(".next").forEach(btn => {
        btn.addEventListener("click", () => resetAndGo(skillsCanvas));
    });

    document.querySelectorAll(".prev").forEach(btn => {
        btn.addEventListener("click", () => resetAndGo(projectCanvas));
    });

    document.querySelectorAll(".menu").forEach(btn => {
        btn.addEventListener("click", () => resetAndGo(mainCanvas));
    });
}
