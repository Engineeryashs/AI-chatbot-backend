import { Router } from "express";
import { getAllUsers, userSignin, userSignup } from "../controllers/userController.js";
const userRouter = Router();
userRouter.post("/signup", userSignup);
userRouter.post("/signin", userSignin);
userRouter.get("/", getAllUsers);
export default userRouter;
//# sourceMappingURL=userRouter.js.map