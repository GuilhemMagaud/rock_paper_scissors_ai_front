let scoreP1 = 0;
let scoreP2 = 0;

const playerHistory = [];
const aiHistory = [];

function showCountdown(callback) {
    const countdownEl = document.getElementById("countdown");
    const steps = ["Rock", "Paper", "Scissors"];
    let index = 0;

    function nextStep() {
        countdownEl.textContent = steps[index];
        countdownEl.style.animation = 'none';
        void countdownEl.offsetWidth;
        countdownEl.style.animation = 'pop 0.4s ease-in-out';

        index++;
        if (index < steps.length) {
            setTimeout(nextStep, 1000);
        } else {
            setTimeout(() => {
                countdownEl.textContent = "";
                callback();
            }, 1000);
        }
    }

    nextStep();
}

function captureFiveFrames() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("capture-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const frames = [];

    let i = 0;

    function capture() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
            frames.push(blob);

            if (++i < 5) {
                setTimeout(capture, 200); 
            } else {
                console.log("✅ Captured 5 frames", frames);
                sendFramesToAPI(frames);
            }
        }, 'image/jpeg');
    }

    capture();
}

function mostCommon(obj) {
    return Object.entries(obj).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

function showResult(p1, p2) {
    const resultEl = document.getElementById("result");

    const beats = {
        "Pierre": "Ciseaux",
        "Ciseaux": "Feuille",
        "Feuille": "Pierre"
    };

    let winner = "It's a tie!";
    let playerRes = "Égalité";
    let aiRes = "Égalité";
    if (beats[p1] === p2) {
        winner = "Player 1 wins!";
        scoreP1++;
        playerRes = "Gagné";
        aiRes = "Perdu";
    } else if (beats[p2] === p1) {
        winner = "Player 2 wins!";
        scoreP2++;
        playerRes = "Perdu";
        aiRes = "Gagné";
    }

    playerHistory.push({ sign: p1, result: playerRes });
    aiHistory.push({ sign: p2, result: aiRes });

    updateHistoryTables();

    document.getElementById("score-p1-table").textContent = `Player 1: ${scoreP1}`;
    document.getElementById("score-p2-table").textContent = `Player 2: ${scoreP2}`;

    resultEl.textContent = `Player 1: ${p1}, Player 2: ${p2} — ${winner}`;
    document.getElementById("ready-button").style.display = "block";
}

function updateHistoryTables() {
    const playerTbody = document.querySelector('#player-history tbody');
    const aiTbody = document.querySelector('#ai-history tbody');
    playerTbody.innerHTML = '';
    aiTbody.innerHTML = '';
    for (let i = 0; i < playerHistory.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${i + 1}</td><td>${playerHistory[i].sign}</td><td>${playerHistory[i].result}</td>`;
        playerTbody.appendChild(row);
    }
    for (let i = 0; i < aiHistory.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${i + 1}</td><td>${aiHistory[i].sign}</td><td>${aiHistory[i].result}</td>`;
        aiTbody.appendChild(row);
    }
}
