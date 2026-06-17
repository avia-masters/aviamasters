let smoke=[];
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let planeImg = new Image();

planeImg.src="plane.svg";

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);


let balance = 1000;
let running = false;
let multiplier = 1;
let bet = 100;
let x = 100;
let y = 400;


const balanceText =
document.getElementById("balance");

const multText =
document.getElementById("mult");


document.getElementById("start").onclick = ()=>{

    if(running) return;

    bet =
    Number(document.getElementById("bet").value);

    if(bet > balance) return;

    balance -= bet;

    running = true;

    multiplier = 1;

    x = 100;

    y = canvas.height-150;

};



document.getElementById("cash").onclick = ()=>{

    if(!running) return;

    balance += bet * multiplier;

    running=false;

};



function loop(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);


// фон

let g =
ctx.createLinearGradient(
0,
0,
0,
canvas.height
);

g.addColorStop(0,"#38bfff");
g.addColorStop(1,"#061126");

ctx.fillStyle=g;

ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);
// вода

ctx.fillStyle="#0865a8";

ctx.fillRect(
0,
canvas.height-120,
canvas.width,
120
);


// остров


// самолёт

if(running){

x += 3;
y -= 2;

smoke.push({
x:x-30,
y:y+10,
size:5+Math.random()*5
});

if(smoke.length>40)
smoke.shift();

multiplier += 0.02;

}


// ДЫМ САМОЛЁТА

smoke.forEach(s=>{

ctx.fillStyle =
"rgba(255,255,255,0.4)";


ctx.beginPath();


ctx.arc(
s.x,
s.y,
s.size,
0,
Math.PI*2
);


ctx.fill();


s.x -= 1;

s.size *= 0.98;

});


// САМОЛЁТ

if(planeImg.complete){

ctx.drawImage(
planeImg,
x-35,
y-35,
70,
70
);

}


balanceText.innerText =
balance.toFixed(0);


multText.innerText =
multiplier.toFixed(2)+"x";



requestAnimationFrame(loop);

}


loop();
