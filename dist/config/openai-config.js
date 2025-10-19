import OpenAI from "openai";
export const client = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET,
    organization: process.env.OPENAI_ORGANISATION_ID
});
//# sourceMappingURL=openai-config.js.map