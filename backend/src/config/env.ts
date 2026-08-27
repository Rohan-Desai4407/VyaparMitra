import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/vyaparmitra",
  jwtSecret: process.env.JWT_SECRET || "vyaparmitra_jwt_secret_default_key",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
};
