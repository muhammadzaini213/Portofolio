/* =========================
   TYPING ENGINE
========================= */

function typeSequence(element, texts, speed, delay, onFinish) {
    let textIndex = 0;
    let charIndex = 0;

    function typeChar() {
        if (charIndex < texts[textIndex].length) {
            element.innerHTML += texts[textIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, speed);
        } else {
            textIndex++;
            if (textIndex < texts.length) {
                setTimeout(() => {
                    element.innerHTML = "";
                    charIndex = 0;
                    typeChar();
                }, delay);
            } else {
                setTimeout(onFinish, delay);
            }
        }
    }

    element.innerHTML = "";
    typeChar();
}

/* =========================
   WELCOME FLOW
========================= */

function finishWelcome() {
    document.getElementById("welcome").remove();
    localStorage.setItem("isFirstTime", true);

    const mainMenu = document.getElementById("main-menu");
    mainMenu.classList.add("show");
    mainCanvas();
}

function firstTime() {
    const welcomeText = document.getElementById("welcome-text");

    typeSequence(
        welcomeText,
        WELCOME_CONFIG.firstTimeTexts,
        WELCOME_CONFIG.typingSpeed,
        WELCOME_CONFIG.delay,
        finishWelcome
    );
}

function notFirstTime() {
    const welcomeText = document.getElementById("welcome-text");

    typeSequence(
        welcomeText,
        [WELCOME_CONFIG.returningText],
        WELCOME_CONFIG.typingSpeed,
        WELCOME_CONFIG.delay,
        finishWelcome
    );
}

function checkFirstTime() {
    const isFirstTime = localStorage.getItem("isFirstTime");

    if (isFirstTime) {
        notFirstTime();
    } else {
        firstTime();
    }
}

checkFirstTime();

/* =========================
   ORIENTATION & FULLSCREEN
========================= */

function enterFullscreen() {
    const docEl = document.documentElement;

    if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
    } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
    }
}

function checkOrientation() {
    const messageElement = document.getElementById("orientation-message");
    const isLandscape = window.innerWidth > window.innerHeight;

    if (isLandscape) {
        messageElement.style.display = "none";
        // enterFullscreen();
    } else {
        messageElement.style.display = "block";
    }
}

checkOrientation();
window.addEventListener("resize", checkOrientation);
