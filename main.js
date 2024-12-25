function firstTime(){
    let i = 0;
    const text1 = 'Looks like we had a new guest...';
    const text2 = 'Let me introduce myself first...';
    const text3 = 'My name is Muhammad Zaini. Nice to meet you...';
    const speed = 50;
    const delay = 2000;

    firstText()
    function firstText() {
        if (i < text1.length) {
            document.getElementById("welcome-text").innerHTML += text1.charAt(i);
            i++;
            setTimeout(firstText, speed);
        } else {
            i = 0;
            setTimeout(secondText, delay)
        }
    }
    
    function secondText() {
        if (i < text2.length) {
            if (i === 0) document.getElementById("welcome-text").innerHTML = ""; 
            document.getElementById("welcome-text").innerHTML += text2.charAt(i);
            i++;
            setTimeout(secondText, speed);
        } else {
            i = 0; 
            setTimeout(thirdText, delay)

        }
    }
    
    function thirdText() {
        if (i < text3.length) {
            if (i === 0) document.getElementById("welcome-text").innerHTML = ""; 
            document.getElementById("welcome-text").innerHTML += text3.charAt(i);
            i++;
            setTimeout(thirdText, speed);
        } else {
            setTimeout(() => {
                document.getElementById("welcome").remove(); 
                localStorage.setItem("isFirstTime", true);
                const mainMenu = document.getElementById('main-menu');
                mainMenu.classList.add('show');
                mainCanvas()
            }, delay); 
        }
    }
}

function notFirstTime() {
    let i = 0;
    const text1 = "Welcome, I've been waiting for you...";
    const speed = 50;
    const delay = 2000;

    firstText()
    function firstText() {
        if (i < text1.length) {
            document.getElementById("welcome-text").innerHTML += text1.charAt(i);
            i++;
            setTimeout(firstText, speed);
        } else {
            setTimeout(() => {
                document.getElementById("welcome").remove(); 
                localStorage.setItem("isFirstTime", true);
                const mainMenu = document.getElementById('main-menu');
                mainMenu.classList.add('show');
                mainCanvas()
            }, delay); 
        }
    }
}

function checkFirstTime(){
    let isTrue = localStorage.getItem("isFirstTime");
    if(isTrue){
        notFirstTime()
    } else {
        firstTime()
    }
}

checkFirstTime()















// Function to check if the device is in landscape mode
function checkOrientation() {
    const messageElement = document.getElementById("orientation-message");

    if (window.innerWidth > window.innerHeight) {
        // Landscape mode - Hide the message and go fullscreen
        messageElement.style.display = "none";
        enterFullscreen();
    } else {
        // Portrait mode - Show the message
        messageElement.style.display = "block";
    }
}

// Function to request fullscreen
function enterFullscreen() {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
    } else if (docEl.mozRequestFullScreen) { // Firefox
        docEl.mozRequestFullScreen();
    } else if (docEl.webkitRequestFullscreen) { // Chrome, Safari, Opera
        docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) { // IE/Edge
        docEl.msRequestFullscreen();
    }
}

// Call this function to initially check orientation and update
checkOrientation();