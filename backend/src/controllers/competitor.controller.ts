import { Request, Response, NextFunction } from "express";
import { competitorService } from "../services/competitor.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const competitorController = {
  async getCompetitors(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string;
      const radius = req.query.radius ? Number(req.query.radius) : 10;
      const list = await competitorService.getCompetitors(category, radius);
      return sendSuccess(res, list, "Competitor list fetched");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },

  async analyzeCompetitors(req: Request, res: Response, next: NextFunction) {
    try {
      const { businessCategory, latitude, longitude, radius } = req.body;
      const result = await competitorService.analyzeCompetitors(
        businessCategory || "Dairy",
        latitude || 22.3,
        longitude || 73.2,
        radius || 10
      );
      return sendSuccess(res, result, "Competitor analysis completed");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },
};
