import app from "./app.js";
import { connectDB } from "./db/connection.js";
const PORT=process.env.PORT||5000;
connectDB().then(()=>{
app.listen(PORT,()=>{
    console.log(`Listening on the port ${PORT}`)
});
}).catch((err)=>{
console.log(err);
process.exit(1);
})
