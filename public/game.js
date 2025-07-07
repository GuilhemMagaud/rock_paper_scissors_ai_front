let scoreP1 = 0;
let scoreP2 = 0;

const playerHistory = [];
const aiHistory = [];

// Add a mapping from French to English for display
const signTranslation = {
    "Pierre": "Rock",
    "Feuille": "Paper",
    "Ciseaux": "Scissors"
};

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

function updateHistoryTables() {
    const playerTable = document.getElementById("player-history").querySelector("tbody");
    const aiTable = document.getElementById("ai-history").querySelector("tbody");
    playerTable.innerHTML = "";
    aiTable.innerHTML = "";
    for (let i = 0; i < playerHistory.length; i++) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${i + 1}</td><td>${signTranslation[playerHistory[i].sign] || playerHistory[i].sign}</td><td>${playerHistory[i].result}</td>`;
        playerTable.appendChild(row);
    }
    for (let i = 0; i < aiHistory.length; i++) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${i + 1}</td><td>${signTranslation[aiHistory[i].sign] || aiHistory[i].sign}</td><td>${aiHistory[i].result}</td>`;
        aiTable.appendChild(row);
    }
}

function handleRoundResult(p1, p2) {
    const beats = {
        "Pierre": "Ciseaux",
        "Ciseaux": "Feuille",
        "Feuille": "Pierre"
    };

    let playerRes = "Draw";
    let aiRes = "Draw";
    if (beats[p1] === p2) {
        scoreP1++;
        playerRes = "Win";
        aiRes = "Lose";
    } else if (beats[p2] === p1) {
        scoreP2++;
        playerRes = "Lose";
        aiRes = "Win";
    }

    playerHistory.push({ sign: p1, result: playerRes });
    aiHistory.push({ sign: p2, result: aiRes });

    updateHistoryTables();
    document.getElementById("score-p1-table").textContent = `Player 1: ${scoreP1}`;
    document.getElementById("score-p2-table").textContent = `Player 2: ${scoreP2}`;
    document.getElementById("ready-button").style.display = "block";
}
