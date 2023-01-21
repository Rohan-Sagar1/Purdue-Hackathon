const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Taken from https://github.com/cockroachlabs/example-app-node-postgres:w

async function retryTxn(n, max, client, operation, callback) {
    const backoffInterval = 100; // millis
    const maxTries = 5;
    let tries = 0;

    while (true) {
        await client.query('BEGIN;');

        tries++;

        try {
            const result = await operation(client, callback);
            await client.query('COMMIT;');
            return result;
        } catch (err) {
            await client.query('ROLLBACK;');

            if (err.code !== '40001' || tries === maxTries) {
                throw err;
            } else {
                console.log('Transaction failed. Retrying.');
                console.log(err.message);
                await new Promise(r => setTimeout(r, tries * backoffInterval));
            }
        }
    }
}



let getClient = async function() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
        connectionString,
        application_name: "$ docs_simplecrud_node-postgres",
    });

    return await pool.connect();
};

(async () => {
    let client = getClient();



})();