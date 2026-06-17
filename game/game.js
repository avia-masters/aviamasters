const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let balance = 1000;
let bet = 0;

let running = false;

let t = 0;
let multiplier = 1;
let crashPoint = 0;

let path = [];
let rockets = [];

let planeImg = new Image();
planeImg.src = "plane.svg";

let plane = {
    x: 120,
    y: 0,
    angle: 0
};


document.getElementById("balance").innerText = balance;


// START
document.getElementById("start").onclick = () => {

    if(running) return;


    bet = Number(
        document.getElementById("bet").value
    );


    if(bet <= 0 || bet > balance)
        return;


    balance -= bet;

    running = true;

    t = 0;
    multiplier = 1;

    path = [];

    rockets = createRockets();


    crashPoint = 
    2 + Math.random()*12;


    updateUI();
};


// CASH
document.getElementById("cash").onclick = () => {


    if(!running)
        return;


    balance += bet * multiplier;


    running = false;


    updateUI();

};



// UI
function updateUI(){

document.getElementById("balance")
.innerText =
balance.toFixed(0);


document.getElementById("mult")
.innerText =
multiplier.toFixed(2)+"x";

}



// BACKGROUND

function background(){

let g =
ctx.createLinearGradient(
0,0,0,canvas.height
);


g.addColorStop(
0,
"#45b8ff"
);


g.addColorStop(
1,
"#061126"
);


ctx.fillStyle=g;

ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);

}



// CLOUDS

let clouds = 0;


function drawClouds(){

clouds +=0.15;


ctx.font="45px Arial";

ctx.fillStyle=
"rgba(255,255,255,.25)";


for(let i=0;i<8;i++){

ctx.fillText(
"☁",
(i*250+clouds)%canvas.width,
80
);

}


}



// ISLANDS

function islands(){

for(
let i=0;i<6;i++
){

let x =
100+i*260;


ctx.fillStyle=
"#12e878";


ctx.beginPath();

ctx.ellipse(
x,
canvas.height-60,
90,
40,
0,
0,
Math.PI*2
);

ctx.fill();

}

}



// ROCKETS

function createRockets(){

let arr=[];

for(let i=0;i<5;i++){

arr.push({

x:300+i*170,

y:canvas.height-250-i*60,

radius:18,

speed:1+Math.random()*1.5

});

}

return arr;

}
function drawRockets(){

rockets.forEach(r=>{

ctx.save();

ctx.translate(
r.x,
r.y
);

ctx.rotate(-0.7);


// корпус ракеты

ctx.fillStyle="#ff3344";

ctx.beginPath();

ctx.moveTo(20,0);
ctx.lineTo(-15,-10);
ctx.lineTo(-15,10);

ctx.closePath();

ctx.fill();


// огонь

ctx.fillStyle="#ffaa00";

ctx.beginPath();

ctx.arc(
-18,
0,
7,
0,
Math.PI*2
);

ctx.fill();


ctx.restore();

});

}

ctx.fill();


});

}



// PATH

function drawPath(){

if(path.length<2)
return;


ctx.beginPath();

ctx.strokeStyle="#00ffe1";

ctx.lineWidth=4;

ctx.shadowColor="#00ffe1";

ctx.shadowBlur=15;


ctx.moveTo(
path[0].x,
path[0].y
);


path.forEach(p=>{

ctx.lineTo(
p.x,
p.y
);

});


ctx.stroke();

ctx.shadowBlur=0;

}



// PLANE

function drawPlane(){


ctx.save();


ctx.translate(
plane.x,
plane.y
);


ctx.rotate(
plane.angle
);



ctx.drawImage(
planeImg,
-35,
-35,
70,
70
);


ctx.restore();


}



// COLLISION

function checkRocket(){


rockets.forEach(r=>{


let dx =
plane.x-r.x;


let dy =
plane.y-r.y;


let dist =
Math.sqrt(
dx*dx+dy*dy
);



if(dist < 35){

running=false;


}

});


}



// LOOP

function loop(){


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



background();

drawClouds();

islands();

drawRockets();
    rockets.forEach(r=>{
    r.y -= 0.4;
});



if(running){


t +=0.012;


multiplier +=
0.01 + t * 0.02;



plane.x =
120+t*650;



plane.y =
canvas.height
-120
-Math.pow(t,1.7)*420;



// наклон самолёта

plane.angle =
-0.25;



path.push({

x:plane.x,
y:plane.y

});



drawPath();

drawPlane();


checkRocket();



if(multiplier>=crashPoint){

running=false;

}



updateUI();


}
else{

drawPath();

}



requestAnimationFrame(loop);


}


loop();
