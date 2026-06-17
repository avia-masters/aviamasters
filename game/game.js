const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


function resize(){

canvas.width = innerWidth;
canvas.height = innerHeight;

}

resize();

window.addEventListener("resize",resize);



// ДАННЫЕ

let balance = 1000;

let bet = 100;

let running=false;

let waiting=false;

let multiplier=1;

let history=[];

let camera=0;

let crash=false;



let plane={
x:120,
y:500,
angle:-0.45
};


let smoke=[];

let rockets=[];

let islands=[];



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




// ОСТРОВА

for(let i=0;i<12;i++){

islands.push({

x:300+i*260,

y:520-i*45,

size:70

});

}





// СТАРТ

document.getElementById("start").onclick=()=>{


if(running || waiting)
return;



bet =
Number(
document.getElementById("bet").value
);



if(bet>balance)
return;



balance-=bet;


waiting=true;


statusText.innerHTML =
"⏳ Подготовка";


setTimeout(()=>{


startGame();


},2000);



};






function startGame(){


waiting=false;

running=true;

crash=false;

multiplier=1;

camera=0;



plane.x=120;

plane.y=canvas.height-150;


smoke=[];

rockets=[];



statusText.innerHTML =
"✈️ Полёт";



for(let i=0;i<8;i++){


rockets.push({

x:700+i*350,

y:150+Math.random()*300,

speed:3

});


}



}







// ЗАБРАТЬ

document.getElementById("cash").onclick=()=>{


if(!running)
return;



balance +=
bet*multiplier;


addHistory(
multiplier.toFixed(2)
);



running=false;


statusText.innerHTML =
"💰 Забрали";

};









function addHistory(value){


history.unshift(value);



if(history.length>8)

history.pop();



historyBox.innerHTML="";



history.forEach(v=>{


let div =
document.createElement("div");


div.className="history-item";


div.innerHTML =
v+"x";


historyBox.appendChild(div);



});



}







// ФОН

function drawBackground(){


let sky =
ctx.createLinearGradient(
0,
0,
0,
canvas.height
);



sky.addColorStop(
0,
"#020824"
);


sky.addColorStop(
0.55,
"#075b8c"
);


sky.addColorStop(
1,
"#001b36"
);



ctx.fillStyle=sky;


ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);




// звёзды

ctx.fillStyle="rgba(255,255,255,.8)";


for(let i=0;i<70;i++){


ctx.fillRect(
(i*97)%canvas.width,
(i*43)%220,
2,
2
);


}




// вода

ctx.fillStyle="#004d7a";


ctx.fillRect(
0,
canvas.height-180,
canvas.width,
180
);




// волны


ctx.strokeStyle=
"rgba(255,255,255,.2)";


for(let i=0;i<6;i++){


ctx.beginPath();


ctx.moveTo(
0,
canvas.height-150+i*25
);


ctx.lineTo(
canvas.width,
canvas.height-150+i*25
);


ctx.stroke();


}





// луна

let glow =
ctx.createRadialGradient(
canvas.width-120,
100,
10,
canvas.width-120,
100,
100
);


glow.addColorStop(
0,
"#fff"
);


glow.addColorStop(
1,
"transparent"
);



ctx.fillStyle=glow;



ctx.beginPath();

ctx.arc(
canvas.width-120,
100,
100,
0,
Math.PI*2
);


ctx.fill();



}







// ОСТРОВА

function drawIslands(){


islands.forEach((i,index)=>{


let ix =
i.x-camera;



ctx.fillStyle="#10ff78";


ctx.beginPath();


ctx.ellipse(
ix,
i.y,
i.size,
40,
0,
0,
Math.PI*2
);


ctx.fill();



// пальма

ctx.strokeStyle="#542";

ctx.lineWidth=5;


ctx.beginPath();

ctx.moveTo(
ix,
i.y-20
);

ctx.lineTo(
ix,
i.y-80
);


ctx.stroke();



ctx.fillStyle="#00aa55";


ctx.beginPath();


ctx.arc(
ix,
i.y-90,
35,
0,
Math.PI*2
);


ctx.fill();



// x

ctx.fillStyle="white";

ctx.font="18px Arial";


ctx.fillText(
(index+1)+".5x",
ix-25,
i.y-120
);



});


}








// САМОЛЁТ


function drawPlane(){


ctx.save();


ctx.shadowColor="#00ffff";

ctx.shadowBlur=25;



ctx.translate(
plane.x,
plane.y
);


ctx.rotate(
plane.angle
);



ctx.drawImage(
planeImg,
-40,
-40,
80,
80
);



ctx.restore();


}






// ДЫМ


function drawSmoke(){


smoke.forEach(s=>{


ctx.fillStyle=
"rgba(255,255,255,.3)";


ctx.beginPath();


ctx.arc(
s.x,
s.y,
  s.size,
0,
Math.PI*2
);


ctx.fill();



s.x-=3;

s.size*=0.94;



});


}






// РАКЕТЫ


function drawRockets(){


rockets.forEach(r=>{


r.x-=r.speed;



ctx.fillStyle="#ff304f";


ctx.beginPath();


ctx.arc(
r.x,
r.y,
12,
0,
Math.PI*2
);


ctx.fill();



});

}







// ИГРА


function loop(){


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



drawBackground();



if(running){


camera+=2;



plane.x+=2;


plane.y-=0.8;



multiplier+=0.015;




smoke.push({

x:plane.x-40,

y:plane.y+20,

size:8

});



if(smoke.length>50)

smoke.shift();




if(multiplier>10){


running=false;


statusText.innerHTML=
"💥 КРАШ";



addHistory(
multiplier.toFixed(2)
);



}



}




drawIslands();

drawRockets();

drawSmoke();

drawPlane();



balanceText.innerHTML =
balance.toFixed(0);



multText.innerHTML =
multiplier.toFixed(2)+"x";



requestAnimationFrame(loop);


}



loop();
