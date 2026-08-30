import { Request, Response, NextFunction } from "express";
import { schemeService } from "../services/scheme.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const schemeController = {
  // New fully dynamic engine endpoint
  async evaluate(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicant, business, projectCost, marginCapital } = req.body;
      
      if (!projectCost || !marginCapital) {
        return sendError(res, "projectCost and marginCapital are required.", 400);
      }

      const result = await schemeService.evaluateSchemes({
        applicant,
        business,
        projectCost: Number(projectCost),
        marginCapital: Number(marginCapital)
      });

      return sendSuccess(res, result, "Schemes evaluated successfully");
    } catch (error) {
      return sendError(res, (error as Error).message, 500);
    }
  },

  // Legacy endpoint
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
