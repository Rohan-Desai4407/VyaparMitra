import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, preferredLanguage } = req.body;
      const result = await authService.register(name, email, password, preferredLanguage);
      return sendSuccess(res, result, "User registered successfully", 201);
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return sendSuccess(res, result, "Logged in successfully");
    } catch (error) {
      return sendError(res, (error as Error).message, 401);
    }
  },

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || "guest_id";
      const profile = await authService.getProfile(userId);
      return sendSuccess(res, profile, "Profile fetched");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || "guest_id";
      const updated = await authService.updateProfile(userId, req.body);
      return sendSuccess(res, updated, "Profile updated");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },
};
