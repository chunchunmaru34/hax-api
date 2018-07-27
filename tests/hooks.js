const { initDb, closeDb } = require('../db');
const { initBrowser, closeBrowser } = require('../puppeteer');


before(async () => {
    // await Promise.all[
    //     initDb(),
    //     initBrowser()
    // ]
    await initDb(),
    await initBrowser()
    
});

after(async () => {
    await Promise.all[
        closeDb(),
        closeBrowser()
    ]
})
