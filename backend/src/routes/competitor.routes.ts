import { Router } from "express";
import { competitorController } from "../controllers/competitor.controller.js";

const router = Router();

router.get("/", competitorController.getCompetitors);
router.post("/analyze", competitorController.analyzeCompetitors);

export default router;
