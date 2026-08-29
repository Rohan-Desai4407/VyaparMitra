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

const whatIfSchema = z.object({
  marginCapital: z.number().positive().optional(),
  volumeChangePct: z.number().optional(),
  priceChangePct: z.number().optional(),
  rawMaterialCostChangePct: z.number().optional(),
  opexChangePct: z.number().optional(),
  interestRateShift: z.number().optional(),
  tenureYearsOverride: z.number().positive().optional(),
  baseMonthlyUnits: z.number().positive().optional(),
  basePricePerUnit: z.number().positive().optional(),
});

router.post("/calculate", validateRequest(calcSchema), financeController.calculate);
router.post("/what-if", validateRequest(whatIfSchema), financeController.simulateWhatIf);
router.post("/scheme", schemeController.determineScheme);
router.post("/repayment", repaymentController.calculateRepayment);

export default router;
