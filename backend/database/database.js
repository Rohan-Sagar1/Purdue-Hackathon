const {Pool} = require("pg");


exports.getClient = async function(db_url) {
    const pool = new Pool({
        db_url,
        application_name: "$ docs_simplecrud_node-postgres",
    });
    return await pool.connect();
}

// transaction execution
const {v4: uuidv4} = require("uuid");
exports.doTransaction = async function(client, callback, operation, maxTries) {
    for(let i = 0;; i++) {
        await client.query("BEGIN;");
        try {
            const res = await operation(client, callback);
            await client.query("COMMIT;");
            return res;
        } catch (err) {
            await client.query("ROLLBACK;");
            if(err.code === "40001" || i === maxTries) {
                // retry transaction
            } else {
                // transaction failed
                throw err;
            }
        }
    }
}



// Taken from https://github.com/cockroachlabs/example-app-node-postgres
exports.retryTxn = async function(n, max, client, operation, callback) {
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

//
// sql operation functions
//

exports.addAccount = async function(client, callback, ) {
    let t = Array(2);
    for(let i = 0; i < t.length; i++) {
        t[i] = await uuidv4();
    }
    const insertStatement =
        "INSERT INTO accounts (id, balance) VALUES ($1, 69), ($2, 420)";
    await client.query(insertStatement, t, callback);
}

exports.getAccounts = async function(client, callback) {
    const selectStatement =
        "SELECT * FROM accounts WHERE balance >= 10";
    await client.query(selectStatement, callback);
}
