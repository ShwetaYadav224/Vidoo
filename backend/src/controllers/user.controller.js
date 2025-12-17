import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import crypto from "crypto";

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Username and password are required" });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }
        if (await bcrypt.compare(password, user.password)) {
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Password" });
        }
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}

const register = async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, username, password: hashedPassword });
        await newUser.save();
        return res.status(httpStatus.CREATED).json({ message: "User registered successfully" });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}
export { login, register }  