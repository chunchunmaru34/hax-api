const MongoClient = require('mongodb').MongoClient;

const DB_NAME = process.env.NODE_ENV === 'production' ? 'hax' : 'hax-test';
const MONGO_URL = 'mongodb://localhost:27017';

let db;
let client;

const initDb = async () => {
    try {
        client = await MongoClient.connect(`${MONGO_URL}/${DB_NAME}`, { useNewUrlParser: true });

        db = client.db(DB_NAME);
    } catch (err) {
        console.log(err.stack);
        process.exit(1);
    }
}

const getDb = () => {
    return db;
}

const closeDb = () => {
    return client.close();
}

module.exports = { initDb, getDb, closeDb };