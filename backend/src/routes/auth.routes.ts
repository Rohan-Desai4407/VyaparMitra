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

router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get("/me", authenticateJwt, authController.me);
router.put("/profile", authenticateJwt, authController.updateProfile);

export default router;
