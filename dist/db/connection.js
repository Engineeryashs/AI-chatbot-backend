/*Though I can use commonJs style import and export to import mongoose
and then connnect and disconnect function instead its better to use ES6+
styled import export for better speed and optimization*/
import { connect, disconnect } from "mongoose";
const mongodbURI = process.env.MONGODB_URI;
const connectDB = async () => {
    try {
        await connect(mongodbURI);
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error(error);
        console.log("Error in connecting the database");
        throw new Error("Cannot connect to mongoDB");
    }
};
const disconnectDB = async () => {
    try {
        await disconnect();
        console.log("MongoDB is disconnecting ...");
    }
    catch (error) {
        console.error(error);
        console.log("Error in disconnecting database");
        throw new Error("Error in disconnecting mongoDB");
    }
};
export { connectDB, disconnectDB };
//# sourceMappingURL=connection.js.map