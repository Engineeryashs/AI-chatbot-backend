import { Router } from "express";
import userRouter from "./userRouter.js";
import chatRouter from "./chatRouter.js";
const mainRouter=Router();
mainRouter.use("/user",userRouter);
mainRouter.use("/chats",chatRouter);
export default mainRouter;