import { Request, Response, NextFunction } from "express";
import { repaymentService } from "../services/repayment.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const repaymentController = {
  async calculateRepayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { loanAmount, interestRate, tenureYears, moratoriumMonths, marginCapital } = req.body;
      let result;
      if (loanAmount) {
        result = repaymentService.calculateRepayment(loanAmount, interestRate, tenureYears, moratoriumMonths);
      } else if (marginCapital) {
        result = repaymentService.calculateRepaymentFromMargin(marginCapital);
      } else {
        return sendError(res, "Please provide loanAmount or marginCapital", 400);
      }
      return sendSuccess(res, result, "Repayment schedule calculated");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },
};
