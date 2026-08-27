import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { sendError } from "../utils/response.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Unauthorized: Token missing", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, "Unauthorized: Invalid or expired token", 401);
  }
};
