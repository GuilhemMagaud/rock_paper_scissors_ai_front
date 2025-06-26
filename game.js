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

async function getSignResults() {
    const counts = {
        player1: {},
        player2: {}
    };

    for (let i = 0; i < 5; i++) {
        try {
            const res = await fetch(`${baseUrl}/sign`);
            const data = await res.json();
            const p1 = data.hand_sign_player1;
            const p2 = data.hand_sign_player2;

            counts.player1[p1] = (counts.player1[p1] || 0) + 1;
            counts.player2[p2] = (counts.player2[p2] || 0) + 1;
        } catch (err) {
            console.error("Error fetching /sign:", err);
        }

        await new Promise(res => setTimeout(res, 300));
    }

    const final1 = mostCommon(counts.player1);
    const final2 = mostCommon(counts.player2);
    showResult(final1, final2);
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
    if (beats[p1] === p2) {
        winner = "Player 1 wins!";
    } else if (beats[p2] === p1) {
        winner = "Player 2 wins!";
    }

    resultEl.textContent = `Player 1: ${p1}, Player 2: ${p2} — ${winner}`;
    document.getElementById("ready-button").style.display = "block";
}
