import mongoose from "mongoose";
import dns from "dns";
import { config } from "./env.js";

// Enable Google DNS resolution fallback for Windows SRV record resolution
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore DNS override errors if in restricted environment
}

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB Cloud] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Cloud database connection failed. Running in mock/memory fallback mode. Error: ${(error as Error).message}`);
  }
};
