import User from "../models/User.js";
import Chats from "../models/Chats.js";
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const isuser = await User.findById(res.locals.jwtData.userId).populate("chats");
        if (!isuser) {
            return res.status(404).json({ msg: "User does not exist" });
        }
        const allChats = isuser.chats.map(({ role, content }) => ({
            role,
            content,
        }));
        //Here we will send allChats matlab whole chat array to deepseek/openAI any llm model
        allChats.push({ role: "user", content: message });
        // Define query function for Hugging Face instead of downloading llm locally i am sending api requests to them directly
        const query = async (data) => {
            const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
                headers: {
                    Authorization: `Bearer ${process.env.AI_CHATBOT}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            });
            return await response.json();
        };
        // Send request to Hugging Face
        const response = await query({
            model: "deepseek-ai/DeepSeek-V3.2-Exp:novita",
            messages: allChats,
        });
        console.log("Hugging Face response:", JSON.stringify(response, null, 2));
        const assistantMessage = response?.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";
        // Save chat messages
        const userChat = new Chats({ role: "user", content: message });
        const assistantChat = new Chats({ role: "assistant", content: assistantMessage });
        await userChat.save();
        await assistantChat.save();
        isuser.chats.push(userChat._id, assistantChat._id);
        await isuser.save();
        return res.status(200).json({
            chats: [...isuser.chats, userChat, assistantChat],
            assistantMessage,
        });
    }
    catch (error) {
        console.error("Error in chat completion:", error);
        res.status(500).json({ message: error.message });
    }
};
export const deleteallChats = async (req, res) => {
    try {
        const isUser = await User.findById(res.locals.jwtData.userId);
        if (!isUser) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (isUser._id.toString() !== res.locals.jwtData.userId) {
            return res.status(401).send("Permissions didn't match");
        }
        await Chats.deleteMany({
            _id: { $in: isUser.chats } // $in means in an array
        });
        isUser.chats = [];
        await isUser.save();
        res.json({
            msg: "All chats of the user deleted"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error in deleting"
        });
    }
};
export const sendChatsToUser = async (req, res) => {
    try {
        console.log(res.locals.jwtData);
        const user = await User.findById(res.locals.jwtData.userId).populate("chats");
        if (!user) {
            return res.status(401).send("User not registered or Token malfunctioned");
        }
        if (user._id != res.locals.jwtData.userId) {
            return res.status(401).send("Permissions didn't match");
        }
        res.json({
            msg: "Sending chats to the user",
            chats: user.chats
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Internal server error"
        });
    }
};
//# sourceMappingURL=chatController.js.map