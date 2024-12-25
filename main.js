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












