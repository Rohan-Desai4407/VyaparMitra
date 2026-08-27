import { Request, Response, NextFunction } from "express";
import { locationService } from "../services/location.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const locationController = {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const q = (req.query.q as string) || "";
      const results = await locationService.search(q);
      return sendSuccess(res, results, "Locations searched");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },

  async getLocationById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const location = await locationService.getLocationById(id);
      return sendSuccess(res, location, "Location details fetched");
    } catch (error) {
      return sendError(res, (error as Error).message, 404);
    }
  },

  async getMarketByLocationId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const market = await locationService.getMarketByLocationId(id);
      return sendSuccess(res, market, "Location market data fetched");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },
};
