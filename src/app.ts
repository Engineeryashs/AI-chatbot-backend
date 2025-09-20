import express from "express";
import {config} from "dotenv";
import morgan from "morgan";
import cors from "cors";
import mainRouter from "./routers/mainRouter.js";
import cookieParser from "cookie-parser";
//Instead i can also do import dotenv from "dotenv"; and then dotenv.config()
config();
const app=express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use("/api/v1",mainRouter);
export default app;