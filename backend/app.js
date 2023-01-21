const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");
// const { https } = require("http");
const express = require("express");
const {max} = require("pg/lib/defaults");
const app = express();
require("dotenv").config();

const db = require("./database/database.js");


app.use(express.json()); // need this for express to parse incoming data as json
app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname + '/assets'));


// initialize vars
// TODO: access these only when needed
const PORT = process.env.SERVER_PORT;
const HOST = process.env.SERVER_HOST;
const DB_URL = process.env.DATABASE_URL;

async function writeSql() {
    let client = await db.getClient(DB_URL);

    // Callback function; taken from:
    // https://github.com/cockroachlabs/example-app-node-postgres
    function cb(err, res) {
        if (err) throw err;

        if (res.rows.length > 0) {
            console.log("New account balances:");
            res.rows.forEach((row) => {
                console.log(row);
            });
        }
    }

    console.log("testing sql...");
    await db.retryTxn(0, 15, client, db.addAccount, cb);
    console.log("done");
}

async function getSql() {
    let client = await db.getClient(DB_URL);

    // Callback function; taken from:
    // https://github.com/cockroachlabs/example-app-node-postgres
    function cb(err, res) {
        if (err) throw err;

        if (res.rows.length > 0) {
            console.log("New account balances:");
            res.rows.forEach((row) => {
                console.log(row);
            });
        }
    }

    console.log("getting sql...");
    await db.doTransaction(client, cb, db.getAccounts, 5);
    console.log("done");

}

app.get('/', async (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    await getSql();

    res.send(`
        <!DOCTYPE html>
        <html>
            <body>
            yeye
            </body>
        </html>
    `);
});

app.listen(PORT, () =>
    console.log(`HTTP Server is up. Now go to ${HOST}:${PORT}`)
);

(async () => {

})();