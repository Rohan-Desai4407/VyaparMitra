import { Router } from "express";
import { z } from "zod";
import { authController } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { authenticateJwt } from "../middleware/auth.middleware.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  preferredLanguage: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const googleSchema = z.object({
  credential: z.string().min(1, "Google credential token is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/google", validateRequest(googleSchema), authController.googleLogin);
router.get("/verify-email", authController.verifyEmail);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", validateRequest(resendVerificationSchema), authController.resendVerification);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), authController.resetPassword);

router.get("/me", authenticateJwt as any, authController.me as any);
router.put("/profile", authenticateJwt as any, authController.updateProfile as any);

export default router;
