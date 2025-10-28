import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import Chats from "../models/Chats.js";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  type Message = {
    role: "user" | "assistant";
    content: string;
  };

  try {
    const isuser = await User.findById(res.locals.jwtData.userId).populate("chats");
    if (!isuser) {
      return res.status(404).json({ msg: "User does not exist" });
    }

    const allChats: Message[] = isuser.chats.map(({ role, content }: any) => ({
      role,
      content,
    }));

    allChats.push({ role: "user", content: message });

    // Define query function for Hugging Face instead of downloading llm locally i am sending api requests to them directly
    const query = async (data: any) => {
      const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        headers: {
          Authorization: `Bearer ${process.env.AI_CHATBOT}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
      return await response.json();
    };

    // Send request to Hugging Face
    const response = await query({
      model: "deepseek-ai/DeepSeek-V3.2-Exp:novita",
      messages: allChats,
    });

    console.log("Hugging Face response:", JSON.stringify(response, null, 2));

    const assistantMessage =
      response?.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";

    // Save chat messages
    const userChat = new Chats({ role: "user", content: message });
    const assistantChat = new Chats({ role: "assistant", content: assistantMessage });

    await userChat.save();
    await assistantChat.save();

    isuser.chats.push(userChat._id, assistantChat._id);
    await isuser.save();

    return res.status(200).json({
      chats: [...isuser.chats, userChat, assistantChat],
      assistantMessage,
    });
  } catch (error) {
    console.error("Error in chat completion:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};
