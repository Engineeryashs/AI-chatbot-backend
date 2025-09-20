import User from "../models/User.js";
import { userSigninSchema, userSignupSchema } from "../types/index.js";
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import { COOKIE_NAME } from "../utils/constant.js";
export const userSignup = async (req, res) => {
    const { name, lastName, email, password } = req.body;
    const verifyResponse = userSignupSchema.safeParse(req.body);
    if (!verifyResponse.success) {
        return res.status(400).json({
            msg: "Invalid types"
        });
    }
    try {
        const isExistingUser = await User.findOne({
            email: email
        });
        console.log("Hello I am " + isExistingUser);
        if (!isExistingUser) {
            const salt = await genSalt(10);
            const hashedPassword = await hash(password, salt);
            console.log(hashedPassword);
            const newUser = await User.create({
                name: name,
                lastName: lastName,
                email: email,
                password: hashedPassword
            });
            console.log(newUser);
            const token = sign({ userId: newUser._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
            console.log("Hee" + token);
            res.clearCookie(COOKIE_NAME, {
                httpOnly: true,
                signed: true,
                path: "/"
            });
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);
            res.cookie(COOKIE_NAME, token, {
                httpOnly: true,
                signed: true,
                expires,
                path: "/"
            });
            return res.json({
                msg: "User signed up successfully",
                user: newUser
            });
        }
        res.status(409).json({
            msg: "User is already registered"
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
};
export const userSignin = async (req, res) => {
    const { email, password } = req.body;
    const verifyResponse = userSigninSchema.safeParse(req.body);
    //Zod type-schema verification
    if (!verifyResponse.success) {
        return res.status(400).json({
            msg: "Invalid types"
        });
    }
    //Signin Logic
    try {
        const isUser = await User.findOne({ email: email });
        if (!isUser) {
            return res.status(401).json({
                msg: "Invalid username or user doesnt exists"
            });
        }
        const isPassword = await compare(password, isUser.password);
        if (!isPassword) {
            return res.status(401).json({
                msg: "Invalid password"
            });
        }
        const token = sign({ userId: isUser._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            signed: true,
            path: "/"
        });
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            signed: true,
            expires,
            path: "/"
        });
        res.json({
            user: isUser,
            msg: "User signed in successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Internal server error"
        });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.status(200).json({
            msg: "Users fetched successfully",
            users: allUsers
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal server error"
        });
    }
};
//# sourceMappingURL=userController.js.map