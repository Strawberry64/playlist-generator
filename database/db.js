import * as SQLite from 'expo-sqlite';
let db;
console.log('Starting database initialization');
const blah = async () => {
    db = await SQLite.openDatabaseAsync('test');
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS a1 (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL);`    
    );
    await db.runAsync(`INSERT INTO a1 (id, value) VALUES (?,?)`,
       12345 , 'hello world' 
    );
    console.log('Database initialized');
};
blah();
async function addingData(id, value){
    // gets the first row from the database
    const firstRow  = await db.getFirstAsync(`SELECT * FROM a1;`);
    console.log(firstRow, 'first row', firstRow.id, firstRow.value);
    db.runAsync(`INSERT INTO a1 (id, value) VALUES (?,?)`,
        id, value
    );
    return null;
}

async function retrieve(){
    const allRows = await db.getAllAsync(`SELECT * FROM a1;`);
    console.log(allRows, 'all rows');
    return null;
}
export {addingData, retrieve };