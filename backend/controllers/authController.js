import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser,findUserByUsername} from "../models/userModel.js";

export const register = async (req, res) => {
    const { username, password} = req.body;

    const hasedPassword = await bcrypt.hash(password, 10);

    const existing = await findUserByUsername(username);

    if(existing) {
        return res.status(400).json({
            message: "User already exists!"
        });
    }


    await createUser (
        username,
        hasedPassword,
    );

    res.status(200).json({
        message: "Register Succesfull"
    })
}

export const login = async(req, res) => {
    const {username, password} = req.body;


const user = await findUserByUsername(username);

if(!user) {
    return res.status(401).json({
        message: "User not found"
    });
}

const match = await bcrypt.compare(
    password,
    user.password
);

if(!match) {
    return res.status(401).json({
        message: "Invalid password"
    });
}

const token = jwt.sign({
    id: user.id,
    username: user.username,
    role: user.role
},
    "pos_secret_key_123",
    { expiresIn: "2h" }
)

//Success
return res.status(200).json({
    message: "Login successful",
    user: {
        id: user.id,
        username: user.username,
        role: user.role
    }
});


};