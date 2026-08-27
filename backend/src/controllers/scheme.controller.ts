import { Request, Response, NextFunction } from "express";
import { schemeService } from "../services/scheme.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const schemeController = {
  async determineScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectCost, marginCapital } = req.body;
      let result;
      if (projectCost) {
        result = schemeService.getEligibleScheme(projectCost);
      } else if (marginCapital) {
        result = schemeService.getSchemeFromMargin(marginCapital);
      } else {
        return sendError(res, "Please provide projectCost or marginCapital", 400);
      }
      return sendSuccess(res, result, "Eligible loan scheme matched");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },
};
