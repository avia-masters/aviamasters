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

let multiplier=1;

let camera=0;


let plane={
x:120,
y:500
};


let islands=[];
let points=[];

let smoke=[];

let history=[];

let crash=false;



let planeImg=new Image();
planeImg.src="plane.svg";



const balanceText =
document.getElementById("balance");

const multText =
document.getElementById("mult");

const statusText =
document.getElementById("status");

const historyBox =
document.getElementById("history");




// острова + множители

for(let i=0;i<10;i++){

let ix=300+i*260;

let iy=500-i*45;


islands.push({

x:ix,
y:iy

});


points.push({

x:ix,
y:iy-80,

value:
(1.2+i*0.8).toFixed(2),

taken:false

});


}






document.getElementById("start").onclick=()=>{


if(running)
return;


bet =
Number(
document.getElementById("bet").value
);


if(bet>balance)
return;



balance-=bet;


running=true;

crash=false;

multiplier=1;


camera=0;


plane.x=120;

plane.y=canvas.height-150;


statusText.innerHTML=
"✈️ Полёт";


};







document.getElementById("cash").onclick=()=>{


if(!running)
return;



balance+=
bet*multiplier;


addHistory(
multiplier.toFixed(2)
);



running=false;


statusText.innerHTML=
"💰 Забрали";


};







function addHistory(v){


history.unshift(v);


if(history.length>8)
history.pop();



historyBox.innerHTML="";


history.forEach(x=>{


let d=
document.createElement("div");


d.className="history-item";


d.innerHTML=x+"x";


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
"#003b62"
);


ctx.fillStyle=g;


ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);



// море

ctx.fillStyle="#004b75";

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
(i*91)%canvas.width,
(i*41)%250,
2,
2
);

}


}







function drawIslands(){


islands.forEach((i,index)=>{


let ix=i.x-camera;


ctx.fillStyle="#11ff77";


ctx.beginPath();


ctx.ellipse(
ix,
i.y,
90,
40,
0,
0,
Math.PI*2
);


ctx.fill();




});

}




function drawPoints(){


points.forEach(p=>{


let px=p.x-camera;


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

ctx.font="16px Arial";


ctx.fillText(
p.value+"x",
px-18,
p.y+5
);



});

}





function drawPlane(){


ctx.save();



ctx.shadowColor="#00ffff";

ctx.shadowBlur=25;


ctx.translate(
plane.x,
plane.y
);


ctx.rotate(-0.4);



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

s.size*=.94;



});

}








function collectPoints(){


points.forEach(p=>{


let px=p.x-camera;



let dx =
plane.x-px;


let dy =
plane.y-p.y;



let dist =
Math.sqrt(
dx*dx+dy*dy
);



if(dist<45 && !p.taken){


p.taken=true;


multiplier+=0.5;


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



background();



if(running){



camera+=2;


plane.x+=2;


plane.y-=0.8;



multiplier+=0.01;



smoke.push({

x:plane.x-40,

y:plane.y+20,

size:8

});



if(smoke.length>40)
smoke.shift();



collectPoints();





if(multiplier>12){


running=false;


statusText.innerHTML=
"💥 КРАШ";


addHistory(
multiplier.toFixed(2)
);


}


}




drawIslands();

drawPoints();

drawSmoke();

drawPlane();



balanceText.innerHTML =
balance.toFixed(0);



multText.innerHTML =
multiplier.toFixed(2)+"x";



requestAnimationFrame(loop);


}



loop();
