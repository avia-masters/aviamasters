let balance = 1000;

const balanceText =
document.getElementById("balance");

const betInput =
document.getElementById("bet");
let multiplier = 1;
let running = false;
let timer;
let crashPoint;
let history = [];

const historyBox =
document.getElementById("history");


const plane = document.getElementById("plane");
const multiplierText = document.getElementById("multiplier");
const message = document.getElementById("message");

const start = document.getElementById("start");
const take = document.getElementById("take");


start.onclick = function(){


    if(running) return;


    running = true;

    multiplier = 1;
    let bet =
Number(betInput.value);


if(bet > balance){

message.innerHTML =
"❌ Недостаточно средств";

running=false;

return;

}


balance -= bet;

balanceText.innerHTML =
balance;


    crashPoint =
    (Math.random() * 7 + 1).toFixed(2);


    message.innerHTML = "";


    timer = setInterval(function(){


        multiplier += 0.05;


        multiplierText.innerHTML =
        multiplier.toFixed(2)+"x";


       let height =
40 + multiplier * 28;


let position =
60 + multiplier * 12;


plane.style.bottom =
height+"px";


plane.style.left =
position+"px";


plane.style.transform =
"rotate(-15deg)";



       if(multiplier >= crashPoint){


clearInterval(timer);

running = false;


plane.classList.add("crash");


message.innerHTML =
"💥 Самолёт потерян";


addHistory(
multiplier.toFixed(2),
false
);


setTimeout(()=>{

plane.classList.remove("crash");

},1000);


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
    let win =
bet * multiplier;


balance += win;


balanceText.innerHTML =
balance.toFixed(0);


addHistory(
multiplier.toFixed(2),
true
);


};

function addHistory(value, good){


history.unshift(value);


if(history.length > 6){

history.pop();

}


historyBox.innerHTML="";


history.forEach(item=>{


let div =
document.createElement("div");


div.className =
"result " +
(good ? "good":"bad");


div.innerHTML =
item+"x";


historyBox.appendChild(div);


});


}
