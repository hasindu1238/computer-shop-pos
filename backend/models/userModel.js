const db = require("../config/db");

exports.findUser = (username, callback) => {
    db.get(
        "SELECT * FROM users WHERE username = ? ",
        [username],
        callback
    );
};