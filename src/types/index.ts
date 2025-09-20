import {z} from "zod";
export const userSignupSchema=z.object({
    name:z.string(),
    lastName:z.string(),
    email:z.string().email(),
    password:z.string().min(6).max(12)
})
export const userSigninSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6).max(12)
})
