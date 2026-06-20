const { use } = require("react");
const User = require("../models/userModel");

exports.login = (req, res) => {
    const { username, password} = req.body;

    User.findUser(username, (err, user) => {
        if (user && user.password === password){
            res.send("Login Success");
        } else {
            res.send("Invalid Credentials");
        }
    })
}
