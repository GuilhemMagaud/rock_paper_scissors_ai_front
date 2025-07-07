async function startAI() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    const spinner = document.getElementById("loading-spinner");
    const video = document.getElementById("video");
    spinner.style.display = "block";
    video.style.display = "none";

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        await new Promise(resolve => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });

        video.style.display = "block";
        spinner.style.display = "none";
        document.getElementById("score-bar").style.display = "flex";
        document.getElementById("ready-button").style.display = "block";
        document.getElementById("ready-button").addEventListener("click", () => {
            document.getElementById("ready-button").style.display = "none";
            showCountdown(captureFiveFrames);
        });
    } catch (err) {
        spinner.style.display = "none";
        alert("Webcam access denied or unavailable.");
        console.error(err);
    }
}
