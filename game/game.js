let balance = 1000;

let multiplier = 1;
let running = false;
let timer;
let crashPoint;
let currentBet = 0;

const balanceText = document.getElementById("balance");
const betInput = document.getElementById("bet");

const plane = document.getElementById("plane");
const multiplierText = document.getElementById("multiplier");

const message = document.getElementById("message");

const start = document.getElementById("start");
const take = document.getElementById("take");

const historyBox = document.getElementById("history");
let history = [];

start.onclick = function () {
    if (running) return;

    currentBet = Number(betInput.value);

    if (currentBet <= 0) {
        message.innerHTML = "❌ Неверная ставка";
        return;
    }

    if (currentBet > balance) {
        message.innerHTML = "❌ Недостаточно средств";
        return;
    }

    running = true;
    multiplier = 1;
    message.innerHTML = "";

    balance -= currentBet;
    balanceText.innerHTML = balance;

    crashPoint = (Math.random() * 6 + 1.2).toFixed(2);

    plane.style.bottom = "40px";
    plane.style.left = "60px";
    plane.classList.remove("crash");

    timer = setInterval(() => {
        multiplier += 0.05;

        multiplierText.innerHTML = multiplier.toFixed(2) + "x";

        let bottom = 40 + multiplier * 25;
        let left = 60 + multiplier * 18;

        plane.style.bottom = bottom + "px";
        plane.style.left = left + "px";

        if (multiplier >= crashPoint) {
            crash();
        }

    }, 100);
};

take.onclick = function () {
    if (!running) return;

    clearInterval(timer);
    running = false;

    let win = currentBet * multiplier;
    balance += win;

    balanceText.innerHTML = balance.toFixed(0);

    message.innerHTML = "✅ Забрали " + multiplier.toFixed(2) + "x";

    addHistory(multiplier.toFixed(2), true);
};

function crash() {
    clearInterval(timer);
    running = false;

    plane.classList.add("crash");

    message.innerHTML = "💥 Краш " + multiplier.toFixed(2) + "x";

    addHistory(multiplier.toFixed(2), false);
}

function addHistory(value, win) {
    history.unshift({ value, win });

    if (history.length > 6) history.pop();

    historyBox.innerHTML = "";

    history.forEach(item => {
        let div = document.createElement("div");
        div.className = "result " + (item.win ? "good" : "bad");
        div.innerHTML = item.value + "x";
        historyBox.appendChild(div);
    });
}
