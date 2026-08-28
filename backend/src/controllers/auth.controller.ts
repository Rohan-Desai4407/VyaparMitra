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

  async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { credential } = req.body;
      if (!credential) {
        return sendError(res, "Google credential token is required", 400);
      }
      const result = await authService.googleLogin(credential);
      return sendSuccess(res, result, "Google authentication successful");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const token = (req.query.token || req.body.token) as string;
      if (!token) {
        return sendError(res, "Verification token is required", 400);
      }
      const result = await authService.verifyEmail(token);
      return sendSuccess(res, result, "Email verified successfully");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },

  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.resendVerification(email);
      return sendSuccess(res, result, "Verification email sent");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return sendSuccess(res, result, "Password reset instructions sent");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);
      return sendSuccess(res, result, "Password reset successfully");
    } catch (error) {
      return sendError(res, (error as Error).message, 400);
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
