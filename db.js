const { MongoClient } = require(mongodb);

const env = require("dotenv");

env.config();

const dbName = "tasklist";
const client = new MongoClient(process.env.MONGO_URI);

const connect = async () => {
    try {
        await client.connect();
    } catch (error) {
        console.log(error);
    }
    return client.db(dbName);
}

const db = connect();

module.exports = db;