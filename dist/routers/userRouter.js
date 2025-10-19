import { Router } from "express";
import { getAllUsers, userSignin, userSignup, verifyUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const userRouter = Router();
userRouter.post("/signup", userSignup);
userRouter.post("/signin", userSignin);
userRouter.get("/", getAllUsers);
userRouter.get("/auth-status", authMiddleware, verifyUser);
export default userRouter;
//# sourceMappingURL=userRouter.js.map