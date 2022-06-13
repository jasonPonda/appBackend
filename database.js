import { users } from './users.mjs';
const { Client } = require('pg')

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "jaytab_admin",
    password: "123salut!",
    database: "jaytab"
})


const execute = async (query) => {
    try {
        await client.connect();     // gets connection
        await client.query(query);  // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        await addRow();
        await client.end();         // closes connection
    }
};

const text = `
CREATE TABLE IF NOT EXISTS "users" (
    id INTEGER PRIMARY KEY ,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    ip INTEGER
);`;

async function addRow() {
    for (let i=0;i<users.length;i++) {
        try{
            await client.query('INSERT INTO users(id,fristname,lastname,email,ip)VALUE($1,$2,$3,$4,$5)RETURNING*',
            [users[i].id,users[i].firstName,users[i].lastName,users[i].email,users[i].ip]
            )
        }
        catch(err) {
            console.log(err);
        }

    }
}

execute(text).then(result => {
    if (result) {
        console.log('Table created');
    }
});