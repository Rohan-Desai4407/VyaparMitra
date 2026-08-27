import { Router } from "express";
import { reportController } from "../controllers/report.controller.js";

const router = Router();

router.post("/generate", reportController.generateReport);
router.get("/:id", reportController.getReportById);
router.get("/user/:userId", reportController.getReportsByUser);

export default router;
