import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware.js";
import { User } from "../models/User.js";
import { sendError } from "../utils/response.js";

export const attachFullUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || (!req.user.userId && !req.user.email && !req.user.id)) {
      return sendError(res, "Unauthorized: User payload missing", 401);
    }

    const query = req.user.userId 
      ? { _id: req.user.userId }
      : req.user.id 
      ? { _id: req.user.id } 
      : { email: req.user.email };

    const fullUser = await User.findOne(query);
    
    if (fullUser) {
      // Auto-promote initial super admin email
      if (fullUser.email === "admin@vyaparmitra.in" && fullUser.role !== "SUPER_ADMIN") {
        fullUser.role = "SUPER_ADMIN";
        fullUser.permissions = [
          "VIEW_USERS", "MANAGE_USERS",
          "VIEW_ASSESSMENTS", "MANAGE_ASSESSMENTS",
          "VIEW_MARKET_DATA", "MANAGE_MARKET_DATA",
          "VIEW_SCHEMES", "MANAGE_SCHEMES",
          "VIEW_NOTIFICATIONS", "MANAGE_NOTIFICATIONS",
          "VIEW_ANALYTICS", "VIEW_REPORTS", "MANAGE_CONTENT",
          "VIEW_AI_ANALYTICS", "MANAGE_ADMINS"
        ];
        await fullUser.save();
      }

      if (fullUser.status === "DISABLED") {
        return sendError(res, "Forbidden: Account is disabled", 403);
      }

      fullUser.lastActive = new Date();
      await fullUser.save().catch(() => {});

      req.user = fullUser;
      return next();
    }

    return sendError(res, "Unauthorized: User not found", 401);
  } catch (error: any) {
    return sendError(res, "Authorization error: " + error.message, 500);
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) return sendError(res, "Unauthorized", 401);
  const role = req.user.role;
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return next();
  }
  return sendError(res, "Forbidden: Admin access required", 403);
};

export const requireSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) return sendError(res, "Unauthorized", 401);
  if (req.user.role === "SUPER_ADMIN") {
    return next();
  }
  return sendError(res, "Forbidden: Super Admin access required", 403);
};

export const requirePermission = (permissionKey: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    
    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    if (req.user.role === "ADMIN") {
      const perms: string[] = req.user.permissions || [];
      if (perms.includes(permissionKey)) {
        return next();
      }
    }

    return sendError(res, `Forbidden: Missing required permission [${permissionKey}]`, 403);
  };
};
