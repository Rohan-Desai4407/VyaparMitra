import { Router } from "express";
import { z } from "zod";
import { financeController } from "../controllers/finance.controller.js";
import { schemeController } from "../controllers/scheme.controller.js";
import { repaymentController } from "../controllers/repayment.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = Router();

const calcSchema = z.object({
  marginCapital: z.number().positive("Margin capital must be positive"),
});

router.post("/calculate", validateRequest(calcSchema), financeController.calculate);
router.post("/scheme", schemeController.determineScheme);
router.post("/repayment", repaymentController.calculateRepayment);

export default router;
