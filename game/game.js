const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


function resize(){

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

}

resize();

window.addEventListener("resize",resize);



// ДАННЫЕ

let balance = 1000;

let running=false;

let bet=100;

let multiplier=1;

let x=120;

let y=400;

let planeAngle=0;

let cameraX=0;


let smoke=[];

let explosion=[];

let rockets=[];

let crashed=false;

let path=[];


let history=[];



// САМОЛЁТ

let planeImg=new Image();

planeImg.src="plane.svg";



// UI

const balanceText =
document.getElementById("balance");

const multText =
document.getElementById("mult");

const statusText =
document.getElementById("status");

const historyBox =
document.getElementById("history");





// СТАРТ

document.getElementById("start").onclick=()=>{


if(running)return;



bet =
Number(
document.getElementById("bet").value
);



if(bet>balance)return;



balance-=bet;


running=true;

crashed=false;

multiplier=1;

statusText.innerHTML =
"✈️ Полёт";



x=120;

y=canvas.height-150;

cameraX=0;


smoke=[];

explosion=[];

rockets=[];

path=[];



for(let i=0;i<6;i++){


rockets.push({

x:300+i*220,

y:canvas.height-100-i*80,

speed:2+Math.random()*2

});


}


};





// ЗАБРАТЬ

document.getElementById("cash").onclick=()=>{


if(!running)return;



balance +=
bet*multiplier;



addHistory(
multiplier.toFixed(2)
);



statusText.innerHTML =
"💰 Забрали";


running=false;



};






// МИР

function drawWorld(){



let sky =
ctx.createLinearGradient(
0,
0,
0,
canvas.height
);



sky.addColorStop(
0,
"#38bfff"
);


sky.addColorStop(
1,
"#061126"
);



ctx.fillStyle=sky;


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



// облака

ctx.fillStyle=
"rgba(255,255,255,.35)";


ctx.font="60px Arial";



for(let i=0;i<7;i++){


ctx.fillText(
"☁",
(i*220-cameraX*0.3)%canvas.width,
80+i*25
);


}



// острова


for(let i=0;i<6;i++){


let ix =
150+i*260-cameraX;


let iy =
canvas.height-100;



ctx.fillStyle="#1aff75";



ctx.beginPath();


ctx.ellipse(
ix,
iy,
100,
45,
0,
0,
Math.PI*2
);


ctx.fill();



}


}






// ДЫМ

function drawSmoke(){


smoke.forEach(s=>{


ctx.fillStyle=
"rgba(255,255,255,.35)";


ctx.beginPath();


ctx.arc(
s.x,
s.y,
s.size,
0,
Math.PI*2
);


ctx.fill();


s.x-=2;

s.size*=0.97;


});


}






// РАКЕТЫ

function drawRockets(){


rockets.forEach(r=>{


ctx.save();


ctx.translate(
r.x,
r.y
);


ctx.rotate(-0.8);



ctx.fillStyle="#ff3344";


ctx.beginPath();


ctx.moveTo(20,0);

ctx.lineTo(-15,-10);

ctx.lineTo(-15,10);


ctx.closePath();


ctx.fill();



ctx.fillStyle="#ffaa00";


ctx.beginPath();


ctx.arc(
-20,
0,
8,
0,
Math.PI*2
);


ctx.fill();



ctx.restore();



r.y-=r.speed;



if(r.y<-50)
r.y=canvas.height+50;



});


}







// ВЗРЫВ


function drawExplosion(){


explosion.forEach(p=>{


ctx.fillStyle=
"rgba(255,120,0,.8)";


ctx.beginPath();


ctx.arc(
p.x,
p.y,
p.size,
0,
Math.PI*2
);


ctx.fill();



p.x+=p.dx;

p.y+=p.dy;


p.size*=0.96;



});


}






function drawPath(){


if(path.length<2)return;


ctx.beginPath();


ctx.strokeStyle="#00ffe1";

ctx.lineWidth=4;



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



}






// САМОЛЁТ


function drawPlane(){


if(!planeImg.complete)return;


ctx.save();


ctx.translate(
x,
y
);



if(crashed){

ctx.rotate(1.5);


}else{

ctx.rotate(
planeAngle
);

}



ctx.drawImage(
planeImg,
-35,
-35,
70,
70
);



ctx.restore();


}







function addHistory(value){


history.unshift(value);



if(history.length>8)

history.pop();



historyBox.innerHTML="";



history.forEach(v=>{


let div =
document.createElement("div");


div.className="history-item";


div.innerHTML=v+"x";


historyBox.appendChild(div);



});


}







// ЦИКЛ


function loop(){



ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);
if(running){


cameraX+=0.5;



x+=3.5;

y-=1.8;


multiplier+=0.02;



planeAngle=-0.35;



path.push({

x:x,

y:y

});




smoke.push({

x:x-30,

y:y+10,

size:8

});



if(smoke.length>50)

smoke.shift();





if(multiplier>5 && !crashed){


crashed=true;


running=false;



statusText.innerHTML =
"💥 КРАШ";



for(let i=0;i<35;i++){


explosion.push({

x:x,

y:y,

dx:(Math.random()-0.5)*10,

dy:(Math.random()-0.5)*10,

size:5+Math.random()*10

});


}



}


}





drawWorld();


drawPath();


drawSmoke();


drawRockets();


drawExplosion();


drawPlane();



balanceText.innerHTML =
balance.toFixed(0);



multText.innerHTML =
multiplier.toFixed(2)+"x";



requestAnimationFrame(loop);



}



loop();
