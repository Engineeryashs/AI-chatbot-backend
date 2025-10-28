
import OpenAI from "openai";
/*
export const client=new OpenAI({
    apiKey:process.env.OPEN_AI_SECRET,
    organization:process.env.OPENAI_ORGANISATION_ID
})
*/
import { InferenceClient } from "@huggingface/inference";
console.log("Ji")
console.log(process.env.AI_CHATBOT)
export const client = new InferenceClient("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");
