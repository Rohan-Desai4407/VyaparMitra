import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  TrendingUp,
  Landmark,
  Bot,
  Bell,
  Globe,
  BarChart3,
  FileText,
  FileCode,
  ShieldCheck,
  History,
  Settings,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ChevronDown
} from "lucide-react";

export const AdminSidebar: React.FC<{ mobileOpen: boolean; setMobileOpen: (open: boolean) => void }> = ({
  mobileOpen,
  setMobileOpen,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState("USER");
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [businessSubmenuOpen, setBusinessSubmenuOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.email === "admin@vyaparmitra.in" || u.email?.includes("admin")) {
          setUserRole("SUPER_ADMIN");
        } else {
          setUserRole(u.role || "USER");
        }
        setUserPermissions(u.permissions || []);
      }
    } catch (e) {}
  }, []);

  const hasPerm = (perm: string) => {
    if (userRole === "SUPER_ADMIN") return true;
    return userPermissions.includes(perm);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Backdrop Drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col border-r border-slate-800 ${
          collapsed ? "lg:w-20" : "lg:w-72"
        } ${mobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center shrink-0">
                  <img
                    src="/images/logo/vyapar-mitra-icon.png"
                    alt="VyaparMitra Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-white leading-none">
                  Vyapar<span className="text-emerald-400">Mitra</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase mt-0.5">
                  ADMIN PANEL
                </span>
              </div>
            </div>
          )}
          {collapsed && !mobileOpen && (
            <div className="mx-auto flex items-center justify-center shrink-0 w-full">
                <img
                  src="/images/logo/vyapar-mitra-icon.png"
                  alt="VyaparMitra Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 no-scrollbar">
          {/* Dashboard */}
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
              isActive("/admin")
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0 text-emerald-400" />
            {(!collapsed || mobileOpen) && <span>{t("admin.nav.dashboard", "Dashboard")}</span>}
          </Link>

          {/* Users */}
          {hasPerm("VIEW_USERS") && (
            <Link
              to="/admin/users"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive("/admin/users")
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <Users className="w-5 h-5 shrink-0 text-slate-400" />
              {(!collapsed || mobileOpen) && <span>{t("admin.nav.users", "Users")}</span>}
            </Link>
          )}

          {/* Businesses Submenu */}
          {hasPerm("VIEW_ASSESSMENTS") && (
            <div>
              <button
                onClick={() => setBusinessSubmenuOpen(!businessSubmenuOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 shrink-0 text-slate-400" />
                  {(!collapsed || mobileOpen) && <span>{t("admin.nav.businesses", "Businesses")}</span>}
                </div>
                {(!collapsed || mobileOpen) && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${businessSubmenuOpen ? "rotate-180" : ""}`} />
                )}
              </button>

              {businessSubmenuOpen && (!collapsed || mobileOpen) && (
                <div className="ml-8 mt-1 space-y-1 border-l-2 border-slate-800 pl-3">
                  <Link
                    to="/admin/assessments"
                    onClick={() => setMobileOpen(false)}
                    className={`block py-1.5 text-xs font-medium ${
                      isActive("/admin/assessments") ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Assessments
                  </Link>
                  <Link
                    to="/admin/opportunities"
                    onClick={() => setMobileOpen(false)}
                    className={`block py-1.5 text-xs font-medium ${
                      isActive("/admin/opportunities") ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Opportunities
                  </Link>
                  <Link
                    to="/admin/categories"
                    onClick={() => setMobileOpen(false)}
                    className={`block py-1.5 text-xs font-medium ${
                      isActive("/admin/categories") ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Categories
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Market Intelligence */}
          {hasPerm("VIEW_MARKET_DATA") && (
            <Link
              to="/admin/market"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive("/admin/market")
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <TrendingUp className="w-5 h-5 shrink-0 text-slate-400" />
              {(!collapsed || mobileOpen) && <span>{t("admin.nav.market", "Market Intelligence")}</span>}
            </Link>
          )}

          {/* Financial Configuration */}
          {hasPerm("MANAGE_CONTENT") && (
            <Link
              to="/admin/finance"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive("/admin/finance")
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <DollarSign className="w-5 h-5 shrink-0 text-slate-400" />
              {(!collapsed || mobileOpen) && <span>{t("admin.nav.finance", "Financial Configuration")}</span>}
            </Link>
          )}

          {/* Government Schemes */}
          {hasPerm("VIEW_SCHEMES") && (
            <Link
              to="/admin/schemes"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive("/admin/schemes")
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <Landmark className="w-5 h-5 shrink-0 text-slate-400" />
              {(!collapsed || mobileOpen) && <span>{t("admin.nav.schemes", "Government Schemes")}</span>}
            </Link>
          )}

          {/* AI Advisor */}
          {hasPerm("VIEW_AI_ANALYTICS") && (
            <Link
              to="/admin/ai"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive("/admin/ai")
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <Bot className="w-5 h-5 shrink-0 text-slate-400" />
              {(!collapsed || mobileOpen) && <span>{t("admin.nav.ai", "AI Advisor")}</span>}
            </Link>
          )}

          {/* Notifications */}
          {hasPerm("VIEW_NOTIFICATIONS") && (
            <Link
              to="/admin/notifications"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive("/admin/notifications")
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <Bell className="w-5 h-5 shrink-0 text-slate-400" />
              {(!collapsed || mobileOpen) && <span>{t("admin.nav.notifications", "Notifications")}</span>}
            </Link>
          )}

          {/* Languages */}
          <Link
            to="/admin/languages"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
              isActive("/admin/languages")
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            <Globe className="w-5 h-5 shrink-0 text-slate-400" />
            {(!collapsed || mobileOpen) && <span>{t("admin.nav.languages", "Languages")}</span>}
          </Link>

          {/* Analytics */}
          {hasPerm("VIEW_ANALYTICS") && (
            <Link
              to="/admin/analytics"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive("/admin/analytics")
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <BarChart3 className="w-5 h-5 shrink-0 text-slate-400" />
              {(!collapsed || mobileOpen) && <span>{t("admin.nav.analytics", "Analytics")}</span>}
            </Link>
          )}

          {/* Reports */}
          {hasPerm("VIEW_REPORTS") && (
            <Link
              to="/admin/reports"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive("/admin/reports")
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <FileText className="w-5 h-5 shrink-0 text-slate-400" />
              {(!collapsed || mobileOpen) && <span>{t("admin.nav.reports", "Reports")}</span>}
            </Link>
          )}

          {/* Content */}
          {hasPerm("MANAGE_CONTENT") && (
            <Link
              to="/admin/content"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive("/admin/content")
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <FileCode className="w-5 h-5 shrink-0 text-slate-400" />
              {(!collapsed || mobileOpen) && <span>{t("admin.nav.content", "Content")}</span>}
            </Link>
          )}

          {/* Admin Management (SUPER_ADMIN only) */}
          {userRole === "SUPER_ADMIN" && (
            <Link
              to="/admin/admins"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive("/admin/admins")
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                  : "text-purple-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-5 h-5 shrink-0 text-purple-400" />
              {(!collapsed || mobileOpen) && <span>{t("admin.nav.adminManagement", "Admin Management")}</span>}
            </Link>
          )}

          {/* Audit Logs */}
          <Link
            to="/admin/audit-logs"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
              isActive("/admin/audit-logs")
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            <History className="w-5 h-5 shrink-0 text-slate-400" />
            {(!collapsed || mobileOpen) && <span>{t("admin.nav.auditLogs", "Audit Logs")}</span>}
          </Link>

          {/* Settings */}
          <Link
            to="/admin/settings"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
              isActive("/admin/settings")
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            <Settings className="w-5 h-5 shrink-0 text-slate-400" />
            {(!collapsed || mobileOpen) && <span>{t("admin.nav.settings", "Settings")}</span>}
          </Link>
        </div>

        {/* Footer / Back to User Dashboard */}
        <div className="p-3 border-t border-slate-800">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-400 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Back to User Dashboard</span>}
          </Link>
        </div>
      </aside>
    </>
  );
};
