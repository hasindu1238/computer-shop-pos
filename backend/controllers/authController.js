import bcrypt from "bcrypt";
import { createUser,findUserByUsername} from "../models/userModel.js";

export const register = async (req, res) => {
    const { username, password} = req.body;

    const hasedPassword = await bcrypt.hash(password, 10);

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
}