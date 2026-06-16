let multiplier = 1;
let running = false;
let timer;
let crashPoint;


const plane = document.getElementById("plane");
const multiplierText = document.getElementById("multiplier");
const message = document.getElementById("message");

const start = document.getElementById("start");
const take = document.getElementById("take");


start.onclick = function(){


    if(running) return;


    running = true;

    multiplier = 1;


    crashPoint =
    (Math.random() * 7 + 1).toFixed(2);


    message.innerHTML = "";


    timer = setInterval(function(){


        multiplier += 0.05;


        multiplierText.innerHTML =
        multiplier.toFixed(2)+"x";


        plane.style.bottom =
        (40 + multiplier * 25)+"px";



        if(multiplier >= crashPoint){


            clearInterval(timer);

            running = false;


            message.innerHTML =
            "💥 Самолёт потерян";


        }


    },200);


};




take.onclick = function(){


    if(!running) return;


    clearInterval(timer);

    running=false;


    message.innerHTML =
    "✅ Забрали "+
    multiplier.toFixed(2)+"x";


};
