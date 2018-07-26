const express = require('express');
const { initPuppeteer } = require('./puppeteer');
const { initDb } = require('./db');


const PORT = 5555;

const app = express();

(async () => {
    await initPuppeteer();
    await initDb();
    require('./modules')(app);

    app.use((err, req, res, next) => {
        return res.status(500).json({ err: err.message || 'Internal server error' });
    })

    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})()



