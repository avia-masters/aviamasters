const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");


function resize(){
canvas.width=innerWidth;
canvas.height=innerHeight;
}

resize();

window.addEventListener("resize",resize);



// ДАННЫЕ

let balance=1000;

let bet=100;

let running=false;

let multiplier=1;


let plane={
x:120,
y:500,
angle:-0.5
};


let camera=0;

let smoke=[];

let rockets=[];

let islands=[];

let collected=[];

let crash=false;



let planeImg=new Image();
planeImg.src="plane.svg";



const balanceText=
document.getElementById("balance");

const multText=
document.getElementById("mult");

const statusText=
document.getElementById("status");




// СОЗДАЁМ ОСТРОВА

for(let i=0;i<10;i++){

islands.push({

x:300+i*260,

y:500-i*45,

size:70

});

}



// КНОПКИ


document.getElementById("start").onclick=()=>{


if(running)return;


bet=
Number(
document.getElementById("bet").value
);


if(bet>balance)return;


balance-=bet;


running=true;

crash=false;

multiplier=1;


camera=0;


plane.x=100;

plane.y=canvas.height-150;


smoke=[];

rockets=[];

collected=[];



statusText.innerHTML=
"✈️ Полёт";



for(let i=0;i<7;i++){

rockets.push({

x:500+i*350,

y:150+Math.random()*300,

speed:3

});

}


};





document.getElementById("cash").onclick=()=>{


if(!running)return;


balance+=
bet*multiplier;


running=false;


statusText.innerHTML=
"💰 Забрали";


};








function drawBackground(){


let g=
ctx.createLinearGradient(
0,0,0,canvas.height
);


g.addColorStop(
0,
"#020824"
);


g.addColorStop(
1,
"#064b75"
);


ctx.fillStyle=g;


ctx.fillRect(
0,0,
canvas.width,
canvas.height
);



// море

ctx.fillStyle="#00365c";


ctx.fillRect(
0,
canvas.height-180,
canvas.width,
180
);



// звёзды

ctx.fillStyle="white";


for(let i=0;i<50;i++){

ctx.fillRect(
(i*113)%canvas.width,
(i*53)%250,
2,
2
);

}


}







function drawIslands(){


islands.forEach((i,index)=>{


let ix=i.x-camera;



ctx.fillStyle="#13ff7a";


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



// номер x


ctx.fillStyle="#ffffff";


ctx.font="20px Arial";


ctx.fillText(
(index+1)+".5x",
ix-25,
i.y-55
);



});


}






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
-40,
-40,
80,
80
);


ctx.restore();


}







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

s.size*=.95;


});


}








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



ctx.fillStyle="#ffcc00";


ctx.fillRect(
r.x-25,
r.y-5,
20,
10
);



});


}







function checkIsland(){


islands.forEach((i,index)=>{


let d=
Math.abs(
plane.x-(i.x-camera)
);



if(d<40 &&
!collected[index]){


collected[index]=true;


multiplier +=0.5;


}


});


}








function loop(){


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



drawBackground();



if(running){



camera+=1.8;



plane.x+=1.5;


plane.y-=0.7;



multiplier+=0.01;



smoke.push({

x:plane.x-40,

y:plane.y+20,

size:8

});


if(smoke.length>50)
smoke.shift();



checkIsland();



if(multiplier>10){

running=false;

statusText.innerHTML=
"💥 КРАШ";

}


}



drawIslands();

drawRockets();

drawSmoke();

drawPlane();



balanceText.innerHTML=
balance.toFixed(0);


multText.innerHTML=
multiplier.toFixed(2)+"x";



requestAnimationFrame(loop);


}


loop();
