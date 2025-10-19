import { JwtPayload } from "jsonwebtoken";
import { COOKIE_NAME } from "../utils/constant.js";
import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
const { sign,verify } = jwt;
//Here a function verifyToken returns a Promise that will be resolved or rejected
function verifyToken(token:string):Promise<JwtPayload>
{
  return new Promise((resolve,reject)=>{
   verify(token,process.env.JWT_SECRET as string,(err,decoded)=>{
            if(err)
            {
                reject(err);    
            }
            else{
                resolve(decoded as JwtPayload);
            }           
  })
})
}

export const authMiddleware=async(req:Request,res:Response,next:NextFunction)=>{
    const token=req.signedCookies[`${COOKIE_NAME}`];
    console.log("Ram ram bhai sariya ne")
    if(!token||token.trim()==="")
    {
        return res.status(401).json({
            msg:"Authentication failed:Token not recieved"
        })
    }
    try {
        //Here we are waiting for the promises till it gets resolved
        const decoded=await verifyToken(token);
        res.locals.jwtData=decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:"Authentication failed:Invalid Token"
        })
    }
}
