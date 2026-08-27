import { Request, Response, NextFunction } from "express";
import { reportService } from "../services/report.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const reportController = {
  async generateReport(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await reportService.generateReport(req.body);
      return sendSuccess(res, report, "Comprehensive business report generated", 201);
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },

  async getReportById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const report = await reportService.getReportById(id);
      if (!report) {
        return sendError(res, "Report not found", 404);
      }
      return sendSuccess(res, report, "Report details fetched");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },

  async getReportsByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.params.userId);
      const reports = await reportService.getReportsByUserId(userId);
      return sendSuccess(res, reports, "User reports fetched");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },
};
