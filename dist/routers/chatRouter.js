import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const chatRouter = Router();
chatRouter.post("/new", authMiddleware);
export default chatRouter;
//# sourceMappingURL=chatRouter.js.map