import { Request, Response, NextFunction } from "express";
import { marketService } from "../services/market.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const marketController = {
  async getMarketByLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const locationId = String(req.params.locationId);
      const data = await marketService.getMarketIntelligence(locationId);
      return sendSuccess(res, data, "Market intelligence fetched");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },

  async analyzeMarket(req: Request, res: Response, next: NextFunction) {
    try {
      const { locationId, businessCategory } = req.body;
      const data = await marketService.analyzeMarket(locationId || "loc_sanand_01", businessCategory || "Dairy");
      return sendSuccess(res, data, "Market analysis completed");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },
};
