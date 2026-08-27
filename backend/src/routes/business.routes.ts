import { Router } from "express";
import { z } from "zod";
import { businessController } from "../controllers/business.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = Router();

const businessInputSchema = z.object({
  businessCategory: z.string().min(2, "Business category is required"),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  block: z.string().min(2, "Block is required"),
  village: z.string().min(2, "Village is required"),
  marginCapital: z.number().positive("Margin capital must be a positive number"),
  language: z.string().optional(),
});

const businessAnalyzeSchema = z.object({
  assessmentId: z.string().optional(),
  businessCategory: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  block: z.string().optional(),
  village: z.string().optional(),
  marginCapital: z.number().positive().optional(),
  language: z.string().optional(),
});

router.post("/", validateRequest(businessInputSchema), businessController.createBusinessInput);
router.post("/analyze", validateRequest(businessAnalyzeSchema), businessController.analyzeBusinessFeasibility);

export default router;
