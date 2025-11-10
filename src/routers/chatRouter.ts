import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { deleteallChats, generateChatCompletion, sendChatsToUser } from "../controllers/chatController.js";
const chatRouter=Router();

chatRouter.post("/new",authMiddleware,generateChatCompletion)
chatRouter.delete("/delete",authMiddleware,deleteallChats)
chatRouter.get("/all-chats",authMiddleware,sendChatsToUser)
export default chatRouter;