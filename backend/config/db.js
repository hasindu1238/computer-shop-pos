import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "database", "database.db");




const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log("DB Error :", err.message);
    } else {
        console.log("SQLite Connected");
    }
})


export default db;

// Create tables when app starts
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

