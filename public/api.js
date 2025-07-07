const baseUrl = window.env.API_URL;

async function sendFramesToAPI(frames) {
    const formData = new FormData();
    
    frames.forEach((blob, index) => {
        const filename = `frame${index}.jpg`;
        formData.append("frames", blob, filename);
    });

    try {
        const res = await fetch(`${baseUrl}/predict`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            throw new Error("Failed to fetch prediction");
        }

        const data = await res.json();
        console.log("🎯 Résultat brut de /predict :", data);

        const predictions = data.predictions;

        const count = { player1: {}, player2: {} };

        predictions.forEach(p => {
            const p1 = p.hand_sign_player1;
            const p2 = p.hand_sign_player2;
            count.player1[p1] = (count.player1[p1] || 0) + 1;
            count.player2[p2] = (count.player2[p2] || 0) + 1;
        });

        const final1 = mostCommon(count.player1);
        const final2 = mostCommon(count.player2);
        showResult(final1, final2);

    } catch (err) {
        console.error("Erreur d’envoi à /predict :", err);
    }
}
