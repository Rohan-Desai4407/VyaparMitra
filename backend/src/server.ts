import app from "./app.js";
import { config } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

const startServer = async () => {
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(`🚀 [VyaparMitra Backend] Server running on http://localhost:${config.port}`);
    console.log(`📡 [CORS] Configured for frontend origin: ${config.frontendUrl}`);
  });
};

startServer();
