import { Router } from "express";
import { aiController } from "../controllers/ai.controller.js";

const router = Router();

router.post("/advice", aiController.getAdvice);

export default router;
