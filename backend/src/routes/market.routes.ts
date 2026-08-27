import { Router } from "express";
import { marketController } from "../controllers/market.controller.js";

const router = Router();

router.get("/:locationId", marketController.getMarketByLocation);
router.post("/analyze", marketController.analyzeMarket);

export default router;
