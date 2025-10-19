import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { client } from "../config/openai-config.js";
import { getAllUsers } from "./userController.js";





export const generateChatCompletion=async (req:Request,res:Response,next:NextFunction)=>{
const {message}=req.body;
//User find karo
try {
    const isuser=await User.findById(res.locals.jwtData.userId);
if(!isuser)
{
    return res.status(404).json({
        msg:"User does not exists"
    })
}

//If user does exists you have to grab all the chats of the users
//Here we can also get all the chats by finding in chats model using userId if that was referenced in chats model too same like todo app
const userwithChats=await isuser.populate("chats") as any;
//By default, Mongoose doesn’t know that populate() replaces ObjectIds with
// documents. So TypeScript still thinks it as an objectId.
const allChats=userwithChats.chats.map(({role,content})=>{
    return {role,content};
}) 

//Yah ek naya chats naam ka array banaega map method s jo bhi return hota hai wahi
//naya array allchats chats ka elemnt banega mere bhaiya


//Ki humne yaha current chat ko allChats (chat history) array m jod diya
allChats.push({role:"user",content:message})

/*send all the chats with new one to openai then it will give u responses
const response = await client.responses.create({
    model: "gpt-5",
    input: allChats
});
*/
 const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: allChats
    });

    const assistantMessage = response.choices[0].message.content;

    // Save assistant's response
    userwithChats.chats.push({ role: "assistant", content: assistantMessage });
    await userwithChats.save();
    res.json({
        chats:userwithChats.chats
    })
    
} catch (error) {
    console.log(error);
    res.status(500).json({
        message:(error as Error).message
    })
}
}