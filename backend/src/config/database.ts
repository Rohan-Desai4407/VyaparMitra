import mongoose from "mongoose";
import { config } from "./env.js";

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Database connection failed. Running with mock/memory fallback mode. Error: ${(error as Error).message}`);
  }
};
