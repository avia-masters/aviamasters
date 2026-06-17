const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

resize();
window.addEventListener("resize",resize);


// ----------------
// ДАННЫЕ
// ----------------

let balance = 1000;

let bet = 100;

let running = false;

let multiplier = 1;

let x = 100;
let y = 500;

let angle = -0.45;

let path=[];

let smoke=[];

let rockets=[];

let islands=[];

let points=[];

let camera=0;

let crashed=false;



// ----------------
// САМОЛЁТ
// ----------------

let planeImg = new Image();

planeImg.src="plane.svg";




// ----------------
// UI
// ----------------

const balanceText =
document.getElementById("balance");

const multText =
document.getElementById("mult");

const statusText =
document.getElementById("status");




// ----------------
// ОСТРОВА
// ----------------

for(let i=0;i<8;i++){

islands.push({

x:300+i*300,

y:500-Math.random()*250,

size:70+Math.random()*40

});


points.push({

x:300+i*300,

y:450-i*50,

value:
(1.2+i*0.8).toFixed(2)

});


}





// ----------------
// СТАРТ
// ----------------


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


x=100;

y=canvas.height-150;


camera=0;


path=[];

smoke=[];


rockets=[];



statusText.innerHTML =
"✈️ Полёт";



for(let i=0;i<5;i++){


rockets.push({

x:600+i*400,

y:200+Math.random()*300,

speed:3


});


}


};





// ЗАБРАТЬ

document.getElementById("cash").onclick=()=>{


if(!running)return;


balance +=
bet*multiplier;


running=false;


statusText.innerHTML =
"💰 Забрали";

};







// ----------------
// ФОН
// ----------------


function background(){


// небо

let g =
ctx.createLinearGradient(
0,
0,
0,
canvas.height
);


g.addColorStop(
0,
"#020824"
);


g.addColorStop(
1,
"#0a5d8c"
);



ctx.fillStyle=g;


ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);



// море

ctx.fillStyle="#003b63";

ctx.fillRect(
0,
canvas.height-180,
canvas.width,
180
);



// звёзды

ctx.fillStyle="white";


for(let i=0;i<60;i++){

ctx.fillRect(
(i*97)%canvas.width,
(i*43)%250,
2,
2
);

}


}







// ----------------
// ОСТРОВА
// ----------------


function drawIslands(){


islands.forEach(i=>{


let ix =
i.x-camera;



ctx.fillStyle="#0cff78";


ctx.beginPath();


ctx.ellipse(
ix,
i.y,
i.size,
i.size/2,
0,
0,
Math.PI*2
);


ctx.fill();



// свет

ctx.fillStyle=
"rgba(255,255,150,.8)";


ctx.beginPath();


ctx.arc(
ix,
i.y-20,
5,
0,
Math.PI*2
);


ctx.fill();



});


}







// ----------------
// МНОЖИТЕЛИ
// ----------------


function drawPoints(){


ctx.font="20px Arial";


points.forEach(p=>{


let px =
p.x-camera;


ctx.fillStyle="#00ff88";


ctx.beginPath();


ctx.arc(
px,
p.y,
22,
0,
Math.PI*2
);


ctx.fill();



ctx.fillStyle="#001";


ctx.fillText(
p.value+"x",
px-18,
p.y+7
);



});


}







// ----------------
// РАКЕТЫ
// ----------------


function drawRockets(){


rockets.forEach(r=>{


r.x-=r.speed;


ctx.save();


ctx.translate(
r.x,
r.y
);


ctx.rotate(-.5);



ctx.fillStyle="#ff3344";


ctx.beginPath();


ctx.moveTo(25,0);

ctx.lineTo(-15,-12);

ctx.lineTo(-15,12);


ctx.closePath();

ctx.fill();



ctx.fillStyle="#ffcc00";


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



});


}







// ----------------
// САМОЛЁТ
// ----------------


function drawPlane(){


ctx.save();


ctx.translate(
x,
y
);


ctx.rotate(angle);



ctx.drawImage(
planeImg,
-40,
-40,
80,
80
);


ctx.restore();


}







// ----------------
// ДЫМ
// ----------------


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

s.size*=.96;


});


}







// ----------------
// LOOP
// ----------------


function loop(){


ctx.clearRect(
  0,
0,
canvas.width,
canvas.height
);



background();


if(running){


camera+=2;


x=180;

y=
canvas.height-180
-
Math.pow(multiplier,1.4)*18;



multiplier+=0.02;



path.push({
x:x,
y:y
});



smoke.push({

x:x-40,

y:y+10,

size:8

});



if(smoke.length>40)
smoke.shift();



}



drawIslands();

drawPoints();

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
