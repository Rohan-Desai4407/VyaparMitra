import { Request, Response, NextFunction } from "express";
import { financeService } from "../services/finance.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const financeController = {
  async calculate(req: Request, res: Response, next: NextFunction) {
    try {
      const { marginCapital } = req.body;
      const result = financeService.calculateFinancials(marginCapital);
      return sendSuccess(res, result, "Financial calculation completed");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },
};
