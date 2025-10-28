import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { generateChatCompletion } from "../controllers/chatController.js";
const chatRouter = Router();
chatRouter.post("/new", authMiddleware, generateChatCompletion);
export default chatRouter;
//# sourceMappingURL=chatRouter.js.map