const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to SQLite");
    }
});

// Create tables when app starts
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    )
`);

db.run(
    `INSERT INTO users (username, password)
     VALUES (?, ?)`,
    ["admin", "1234"],
    (err) => {
        if (err) {
            console.log("User already exists");
        } else {
            console.log("Sample user added");
        }
    }
);

module.exports = db;