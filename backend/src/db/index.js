import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constants.js";

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(`connected to MongoDB at: ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

export { connectDB };
