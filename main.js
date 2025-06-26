const baseUrl = 'http://localhost:5000';

const loadingMessages = [
    "Loading AI brain...",
    "Remember, no wells allowed! Only rock, paper, or scissors.",
    "AI is deciding if it likes rock more than paper today...",
    "Please wait, AI is pondering the meaning of life...",
    "Rock, paper, scissors... the ultimate showdown!",
    "Debugging the paper cuts...",
    "Almost there..."
];

let messageInterval = null;

async function startAI() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    const spinner = document.getElementById("loading-spinner");
    const video = document.getElementById("video");
    const loadingText = document.getElementById("loading-text");

    spinner.style.display = "block";
    loadingText.style.display = "block";
    video.style.display = "none";

    let index = 0;
    loadingText.textContent = loadingMessages[index];
    messageInterval = setInterval(() => {
        loadingText.style.opacity = 0;
        setTimeout(() => {
            index = (index + 1) % loadingMessages.length;
            loadingText.textContent = loadingMessages[index];
            loadingText.style.opacity = 1;
        }, 500);
    }, 5000);

    try {
        const res = await fetch(`${baseUrl}/start`);
        if (!res.ok) {
            alert("AI already running or failed to start.");
            return;
        }

        let ready = false;
        while (!ready) {
            const status = await fetch(`${baseUrl}/status`).then(r => r.json());
            if (status.ready) {
                ready = true;
                break;
            }
            await new Promise(res => setTimeout(res, 5000));
        }

        clearInterval(messageInterval);
        spinner.style.display = "none";
        loadingText.style.display = "none";
        video.style.display = "block";
        video.src = `${baseUrl}/video_feed`;
        const readyBtn = document.getElementById("ready-button");
        readyBtn.style.display = "block";
        readyBtn.onclick = () => {
            readyBtn.style.display = "none";
            showCountdown(getSignResults);
        };
    } catch (err) {
        clearInterval(messageInterval);
        alert("Error communicating with backend.");
        console.error(err);
    }
}
