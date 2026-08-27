import { Request, Response, NextFunction } from "express";
import { geminiService } from "../services/gemini.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const aiController = {
  async getAdvice(req: Request, res: Response, next: NextFunction) {
    try {
      const advice = await geminiService.getAiAdvice(req.body);
      return sendSuccess(res, advice, "AI Business advice generated");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },
};
