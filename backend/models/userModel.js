import db from "../config/db.js";

export const createUser = (username, password) => {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            [username, password],
            function (err) {
                if(err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
};

export const findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM users WHERE username = ?",
            [username],
            (err, row) => {
                if(err) reject(err);
                else resolve(row);
            }
        )
    })
}