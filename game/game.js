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

document.getElementById("balance").innerText = balance;

document.getElementById("start").onclick = () => {
    if (running) return;

    bet = Number(document.getElementById("bet").value);
    if (bet <= 0 || bet > balance) return;

    balance -= bet;
    updateBalance();

    running = true;
    t = 0;
    multiplier = 1;

    crashPoint = 1 + Math.random() * 5; // пока простой RNG
};

document.getElementById("cash").onclick = () => {
    if (!running) return;

    balance += bet * multiplier;
    running = false;

    updateBalance();
};

function updateBalance() {
    document.getElementById("balance").innerText = balance.toFixed(0);
}

function drawBackground() {
    let g = ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0, "#4bb3ff");
    g.addColorStop(1, "#050b1e");

    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawIslands() {
    ctx.fillStyle = "#1aff88";

    for (let i = 0; i < 5; i++) {
        let x = 200 + i * 250;
        let y = canvas.height - 80;

        ctx.beginPath();
        ctx.arc(x, y, 60, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawPlane(x, y) {
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
}

function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawBackground();
    drawIslands();

    if (running) {

        t += 0.01;

        multiplier += 0.02 + t * 0.01;

        // ✈️ КРИВАЯ ПОЛЁТА (ВАЖНО — как в Aviamasters)
        let x = 100 + t * 600;
        let y = canvas.height - 100 - Math.pow(t, 1.7) * 400;

        drawPlane(x, y);

        document.getElementById("mult").innerText =
            multiplier.toFixed(2) + "x";

        if (multiplier >= crashPoint) {
            running = false;
        }
    }

    requestAnimationFrame(loop);
}

loop();
