import { Router, Response } from "express";
import { authenticateJwt, AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { attachFullUser, requireAdmin, requireSuperAdmin, requirePermission } from "../middleware/admin.middleware.js";
import { User } from "../models/User.js";
import { AuditLog } from "../models/AuditLog.js";
import { sendSuccess, sendError } from "../utils/response.js";

const router = Router();

router.use(authenticateJwt as any);
router.use(attachFullUser as any);
router.use(requireAdmin as any);

async function logAudit(actor: any, action: string, target?: string, details?: string) {
  try {
    await AuditLog.create({
      actorId: actor.id || actor._id?.toString() || "unknown",
      actorName: actor.name || "Admin",
      actorEmail: actor.email || "admin@vyaparmitra.in",
      action,
      target: target || "",
      details: details || "",
      timestamp: new Date()
    });
  } catch (e) {
    console.error("Audit log failed:", e);
  }
}

// 1. Dashboard Stats
router.get("/stats", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "ACTIVE" });
    const totalAdmins = await User.countDocuments({ role: { $in: ["ADMIN", "SUPER_ADMIN"] } });
    const recentAuditLogs = await AuditLog.find().sort({ timestamp: -1 }).limit(8);

    return sendSuccess(res, {
      totalUsers,
      activeUsers,
      totalAdmins,
      totalAssessments: 89,
      aiRequests: 412,
      activeSchemes: 14,
      reportsGenerated: 76,
      recentAuditLogs
    }, "Stats fetched");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// 2. Users Management
router.get("/users", requirePermission("VIEW_USERS") as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    return sendSuccess(res, users, "Users fetched");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

router.patch("/users/:id/status", requirePermission("MANAGE_USERS") as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await User.findById(id);
    if (!user) return sendError(res, "User not found", 404);

    user.status = status;
    await user.save();
    await logAudit(req.user, "USER_STATUS_CHANGED", user.email, `Status updated to ${status}`);
    return sendSuccess(res, user, "User status updated");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// 3. Admin Management (Super Admin Only)
router.get("/admins", requireSuperAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const admins = await User.find({ role: { $in: ["ADMIN", "SUPER_ADMIN"] } }).select("-passwordHash").sort({ createdAt: -1 });
    return sendSuccess(res, admins, "Admins fetched");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

router.post("/admins/assign", requireSuperAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, role, permissions } = req.body;
    if (!userId) return sendError(res, "userId is required", 400);

    const targetUser = await User.findById(userId);
    if (!targetUser) return sendError(res, "User not found", 404);

    const assignedRole = role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN";
    targetUser.role = assignedRole;
    targetUser.permissions = Array.isArray(permissions) ? permissions : [];
    await targetUser.save();

    await logAudit(req.user, "ADMIN_ASSIGNED", targetUser.email, `Assigned role ${assignedRole}`);
    return sendSuccess(res, targetUser, "Admin access granted");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

router.patch("/admins/:id/permissions", requireSuperAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;
    const targetUser = await User.findById(id);
    if (!targetUser) return sendError(res, "Admin user not found", 404);

    targetUser.permissions = Array.isArray(permissions) ? permissions : [];
    await targetUser.save();

    await logAudit(req.user, "PERMISSIONS_UPDATED", targetUser.email, `Permissions updated to: ${permissions.join(", ")}`);
    return sendSuccess(res, targetUser, "Permissions updated");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

router.patch("/admins/:id/status", requireSuperAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const targetUser = await User.findById(id);
    if (!targetUser) return sendError(res, "User not found", 404);

    if (targetUser.role === "SUPER_ADMIN" && status === "DISABLED") {
      const superAdminCount = await User.countDocuments({ role: "SUPER_ADMIN", status: "ACTIVE" });
      if (superAdminCount <= 1) {
        return sendError(res, "Action blocked: System must retain at least one active Super Admin", 400);
      }
    }

    targetUser.status = status;
    await targetUser.save();

    await logAudit(req.user, status === "DISABLED" ? "ADMIN_DISABLED" : "ADMIN_ENABLED", targetUser.email, `Status set to ${status}`);
    return sendSuccess(res, targetUser, "Admin status updated");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

router.post("/admins/:id/revoke", requireSuperAdmin as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const targetUser = await User.findById(id);
    if (!targetUser) return sendError(res, "User not found", 404);

    if (targetUser.role === "SUPER_ADMIN") {
      const superAdminCount = await User.countDocuments({ role: "SUPER_ADMIN", status: "ACTIVE" });
      if (superAdminCount <= 1) {
        return sendError(res, "Action blocked: System must retain at least one active Super Admin", 400);
      }
    }

    targetUser.role = "USER";
    targetUser.permissions = [];
    await targetUser.save();

    await logAudit(req.user, "ADMIN_REVOKED", targetUser.email, "Admin privileges revoked");
    return sendSuccess(res, targetUser, "Admin privileges revoked");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// 4. Audit Logs
router.get("/audit-logs", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    return sendSuccess(res, logs, "Audit logs fetched");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export default router;
