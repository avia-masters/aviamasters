const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let balance = 1000;
let bet = 0;

let running = false;
let t = 0;
let multiplier = 1;

// 💥 теперь crash НЕ случайный каждый тик
let crashPoint = 0;

// 🎯 фиксируем seed раунда
let seed = Math.random();

// 🚀 ракеты (опасности)
let rockets = [];

let path = [];

document.getElementById("balance").innerText = balance;

// ---------------- START ----------------
document.getElementById("start").onclick = () => {
    if (running) return;

    bet = Number(document.getElementById("bet").value);
    if (bet <= 0 || bet > balance) return;

    balance -= bet;
    updateBalance();

    running = true;
    t = 0;
    multiplier = 1;
    path = [];

    seed = Math.random();

    // 💥 crash заранее (ВАЖНО как в настоящих crash играх)
    crashPoint = 1 + pseudoRandom(seed) * 5;

    spawnRockets();
};

// ---------------- CASH ----------------
document.getElementById("cash").onclick = () => {
    if (!running) return;

    balance += bet * multiplier;
    running = false;

    updateBalance();
};

// ---------------- RNG (стабильный) ----------------
function pseudoRandom(s) {
    return (Math.sin(s * 9999) * 10000) % 1;
}

// ---------------- UI ----------------
function updateBalance() {
    document.getElementById("balance").innerText = balance.toFixed(0);
    document.getElementById("mult").innerText = multiplier.toFixed(2) + "x";
}

// ---------------- BACKGROUND ----------------
function drawBackground() {
    let g = ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0, "#4bb3ff");
    g.addColorStop(0.5, "#1b3f8b");
    g.addColorStop(1, "#050b1e");

    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

// ---------------- CLOUDS ----------------
let cloudOffset = 0;

function drawClouds() {
    cloudOffset += 0.15;

    ctx.font = "28px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.15)";

    for (let i = 0; i < 10; i++) {
        ctx.fillText("☁", (i * 180 + cloudOffset) % canvas.width, 80);
        ctx.fillText("☁", (i * 220 - cloudOffset) % canvas.width, 140);
    }
}

// ---------------- ISLANDS ----------------
function drawIslands() {
    for (let i = 0; i < 5; i++) {
        let x = 200 + i * 250;
        let y = canvas.height - 70;

        ctx.fillStyle = "#1aff88";
        ctx.beginPath();
        ctx.arc(x, y, 60, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ---------------- ROCKETS ----------------
function spawnRockets() {
    rockets = [];

    for (let i = 0; i < 3; i++) {
        rockets.push({
            x: 300 + i * 250,
            y: canvas.height - 200,
            hit: false
        });
    }
}

function drawRockets() {
    ctx.fillStyle = "#ff3355";

    rockets.forEach(r => {
        ctx.beginPath();
        ctx.arc(r.x, r.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ---------------- PATH ----------------
function drawPath() {
    if (path.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = "#00ffe1";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00ffe1";
    ctx.shadowBlur = 10;

    ctx.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }

    ctx.stroke();
    ctx.shadowBlur = 0;
}

// ---------------- PLANE ----------------
function drawPlane(x, y) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
}

// ---------------- LOOP ----------------
function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawBackground();
    drawClouds();
    drawIslands();
    drawRockets();

    if (running) {

        t += 0.012;

        // 📈 экспоненциальный рост (как в crash играх)
        multiplier += 0.015 + t * 0.012;

        let x = 120 + t * 650;
        let y = canvas.height - 120 - Math.pow(t, 1.7) * 420;

        path.push({ x, y });
        drawPath();
        drawPlane(x, y);

        updateBalance();

        // 💥 crash
        if (multiplier >= crashPoint) {
            running = false;
        }
    } else {
        drawPath();
    }

    requestAnimationFrame(loop);
}

loop();
