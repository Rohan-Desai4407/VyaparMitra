import { Request, Response } from "express";
import { simulationService } from "../services/simulation.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const simulationController = {
  async calculate(req: Request, res: Response) {
    try {
      const payload = req.body;
      // Provide fallback defaults for safety
      const calcResult = await simulationService.calculate(payload);
      return sendSuccess(res, calcResult, "Simulation calculated successfully");
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  },

  async analyzeWithAI(req: Request, res: Response) {
    try {
      const { calcResult, businessCategory } = req.body;
      if (!calcResult || !businessCategory) {
         return sendError(res, "Missing calcResult or businessCategory", 400);
      }
      const aiInsights = await simulationService.analyzeWithAI(calcResult, businessCategory);
      return sendSuccess(res, aiInsights, "AI analysis generated successfully");
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }
};
