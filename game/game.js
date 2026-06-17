const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");


function resize(){
canvas.width=innerWidth;
canvas.height=innerHeight;
}

resize();
window.addEventListener("resize",resize);



let balance=1000;
let bet=100;

let running=false;
let waiting=false;

let multiplier=1;

let timer=0;

let history=[];


let plane={
x:100,
y:500,
angle:-0.4
};


let camera=0;


let smoke=[];
let rockets=[];

let islands=[];

let crash=false;


let planeImg=new Image();
planeImg.src="plane.svg";



const balanceText=
document.getElementById("balance");

const multText=
document.getElementById("mult");

const statusText=
document.getElementById("status");

const historyBox=
document.getElementById("history");




// острова

for(let i=0;i<12;i++){

islands.push({

x:300+i*260,

y:520-i*45,

size:70

});

}






document.getElementById("start").onclick=()=>{


if(running || waiting)
return;


bet=
Number(
document.getElementById("bet").value
);


if(bet>balance)
return;


balance-=bet;


waiting=true;

timer=3;


statusText.innerHTML=
"⏳ Приготовиться";



setTimeout(()=>{


waiting=false;

startRound();


},3000);


};







function startRound(){


running=true;

crash=false;


multiplier=1;

camera=0;


plane.x=100;

plane.y=canvas.height-150;


smoke=[];

rockets=[];



statusText.innerHTML=
"✈️ Полёт";



for(let i=0;i<8;i++){


rockets.push({

x:600+i*350,

y:150+Math.random()*300,

speed:3

});


}



}








document.getElementById("cash").onclick=()=>{


if(!running)
return;



win();



running=false;


};






function win(){


let result=
multiplier.toFixed(2);



balance +=
bet*multiplier;



addHistory(result);



statusText.innerHTML=
"💰 "+result+"x";



}








function addHistory(v){


history.unshift(v);



if(history.length>8)

history.pop();



historyBox.innerHTML="";



history.forEach(x=>{


let d=
document.createElement("div");


d.className=
"history-item";


d.innerHTML=
x+"x";


historyBox.appendChild(d);



});



}








function background(){


let g=
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
"#064b75"
);



ctx.fillStyle=g;


ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);




ctx.fillStyle="#00365c";


ctx.fillRect(
0,
canvas.height-180,
canvas.width,
180
);




ctx.fillStyle="white";


for(let i=0;i<60;i++){


ctx.fillRect(
(i*111)%canvas.width,
(i*47)%250,
2,
2
);


}


}






function drawIslands(){


islands.forEach((i,index)=>{


let ix=i.x-camera;


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



ctx.fillStyle="white";

ctx.font="18px Arial";


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



});

}



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



balanceText.innerHTML=
balance.toFixed(0);



multText.innerHTML=
multiplier.toFixed(2)+"x";



requestAnimationFrame(loop);


}


loop();
