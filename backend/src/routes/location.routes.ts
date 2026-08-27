import { Router } from "express";
import { locationController } from "../controllers/location.controller.js";

const router = Router();

router.get("/search", locationController.search);
router.get("/:id", locationController.getLocationById);
router.get("/:id/market", locationController.getMarketByLocationId);

export default router;
