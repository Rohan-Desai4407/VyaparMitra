import { Router } from "express";
import { marketController } from "../controllers/market.controller.js";
import { MarketIntelligenceEngine } from "../services/MarketIntelligenceEngine.js";

const router = Router();

router.get("/pricing", (req, res) => {
  const category = req.query.category ? String(req.query.category) : "other";
  const detail = MarketIntelligenceEngine.getDetailedPricing(category);
  res.json({ products: detail });
});

router.get("/:locationId", marketController.getMarketByLocation);
router.post("/analyze", marketController.analyzeMarket);

export default router;
