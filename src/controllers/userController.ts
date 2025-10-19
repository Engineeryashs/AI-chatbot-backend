import User from "../models/User.js";
import { Request, Response } from "express";
import { userSigninSchema, userSignupSchema } from "../types/index.js"
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign,verify } = jwt;
import { COOKIE_NAME } from "../utils/constant.js";
export const userSignup=async (req: Request, res: Response) => {
    const { name, lastName, email, password } = req.body;
    const verifyResponse = userSignupSchema.safeParse(req.body);
    if (!verifyResponse.success) {
        return res.status(400).json({
            msg: "Invalid types"
        })
    }
    try {
        const isExistingUser = await User.findOne({
            email: email
        });
        console.log("Hello I am "+isExistingUser);
        if (!isExistingUser) {
            const salt = await genSalt(10);
            const hashedPassword = await hash(password, salt);
              console.log(hashedPassword);
            const newUser = await User.create({
                name: name,
                lastName: lastName,
                email: email,
                password: hashedPassword
            })
            console.log(newUser);
            const token = sign({userId:newUser._id.toString()},process.env.JWT_SECRET, { expiresIn: "7d" });
            console.log("Hee"+token)
            res.clearCookie(COOKIE_NAME, {
                httpOnly: true,
                signed: true,
                path: "/",
                secure:false
            })
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);
            res.cookie(COOKIE_NAME, token, {
                httpOnly: true,
                signed: true,
                expires,
                path: "/",
                secure:false
            });
            return res.json({
                msg: "User signed up successfully",
                user: newUser
            })
        }
        res.status(409).json({
            msg: "User is already registered"
        })
    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}
export const userSignin=async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const verifyResponse = userSigninSchema.safeParse(req.body);
    //Zod type-schema verification
    if (!verifyResponse.success) {
        return res.status(400).json({
            msg: "Invalid types"
        })
    }
    //Signin Logic
    try {
        const isUser = await User.findOne({ email: email })
        if (!isUser) {
            return res.status(401).json({
                msg: "Invalid username or user doesnt exists"
            })
        }
        const isPassword = await compare(password, isUser.password);
        if (!isPassword) {
            return res.status(401).json({
                msg: "Invalid password"
            })
        }
        const token = sign({userId:isUser._id.toString()},process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            signed: true,
            path: "/"
        })
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
        })
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error"
        })
    }
}

export const getAllUsers=async(req:Request,res:Response)=>{
try {
    const allUsers=await User.find({});
    res.status(200).json({
        msg:"Users fetched successfully",
        users:allUsers
    })
} catch (error) {
    console.log(error);
    res.status(500).json({
        msg:"Internal server error"
    })
}
}

export const verifyUser=async(req:Request,res:Response)=>{
//res.locals.data is not persistent like req.userId and it will end if response is sent once
//so here we are using it simply as because on context-value update it will trigger re-renders of children
//so thats why we will have one route to check auth-status simply and update states
//in front-end
try {
    const getUser=await User.findById(res.locals.jwtData.userId); 
    if(!getUser)
    {
        res.status(401).json({
            msg:"Invalid user"
        })
    }
    if(getUser._id.toString()!==res.locals.jwtData.userId)
    {
        res.status(401).json({
            msg:"Permissions didnt matched"
        })
    }
    res.json({
        msg:"User is authenticated",
        user:getUser
    })
} catch (error) {
    res.status(401).json({
        msg:"Invalid user"+error.message
    })
}

}