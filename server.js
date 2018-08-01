const express = require('express');
const compression = require('compression');
const expressWs = require('express-ws');

const { initBrowser } = require('./puppeteer');
const { initDb } = require('./db');


const PORT = 5555;

const app = express();
expressWs(app);

(async () => {
    app.use(compression());

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })

    await initBrowser();
    await initDb();
    require('./modules')(app);

    app.use((err, req, res, next) => {
        return res.status(500).json({ err: err.message || 'Internal server error' });
    })

    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})()



