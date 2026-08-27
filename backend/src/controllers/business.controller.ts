import { Request, Response, NextFunction } from "express";
import { businessService } from "../services/business.service.js";
import { assessmentService } from "../services/assessment.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const businessController = {
  async createBusinessInput(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await businessService.createInput(req.body);
      return sendSuccess(res, result, "Business input validated & assessment ID generated", 201);
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },

  async analyzeBusinessFeasibility(req: Request, res: Response, next: NextFunction) {
    try {
      const feasibility = await assessmentService.analyzeFeasibility(req.body);
      return sendSuccess(res, feasibility, "Business feasibility analysis generated successfully");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },
};
