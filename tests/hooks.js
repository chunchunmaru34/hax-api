const { initDb, getDb, closeDb } = require('../db');

before(async () => {
    await initDb();
});

after(async () => {
    await closeDb();
})
