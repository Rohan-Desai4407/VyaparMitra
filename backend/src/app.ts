import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";

// Import Route Handlers
import authRoutes from "./routes/auth.routes.js";
import businessRoutes from "./routes/business.routes.js";
import locationRoutes from "./routes/location.routes.js";
import marketRoutes from "./routes/market.routes.js";
import competitorRoutes from "./routes/competitor.routes.js";
import financeRoutes from "./routes/finance.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();

// 1. JSON Middleware
app.use(express.json());

// 2. CORS Middleware allowing http://localhost:5173
app.use(
  cors({
    origin: [config.frontendUrl, "http://localhost:5173"],
    credentials: true,
  })
);

// 3. API Health Check Endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected (Running Mock Fallback)";
  res.status(200).json({
    success: true,
    status: "OK",
    timestamp: new Date(),
    service: "VyaparMitra Backend API",
    database: dbStatus,
  });
});

// 4. Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/competitors", competitorRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/report", reportRoutes);

// 5. Central Error Handling Middleware
app.use(errorHandler);

export default app;
