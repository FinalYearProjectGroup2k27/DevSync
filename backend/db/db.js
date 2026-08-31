import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

function connect() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Connected to MongoDB successfully at:", process.env.MONGODB_URI);
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB:", err.message);
        });
}

export default connect;