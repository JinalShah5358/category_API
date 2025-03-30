import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI; // Replace with your MongoDB connection string

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("Connected to MongoDB successfully with Mongoose!");
  } catch (error) {
    console.error("Failed to connect to MongoDB with Mongoose:", error);
    throw error;
  }
}
connectToDatabase();
export { connectToDatabase, mongoose };
