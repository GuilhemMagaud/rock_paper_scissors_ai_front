const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public'), {index: false}));

app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');

    fs.readFile(indexPath, 'utf8', (err, html) => {
        if (err) {
            console.error('Failed to read index.html:', err);
            return res.status(500).send('Error loading page');
        }

        const modifiedHtml = html.replace('{{API_URL}}', process.env.API_URL || '');
        res.send(modifiedHtml);
    });
});

app.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}`);
});
