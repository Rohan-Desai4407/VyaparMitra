import React from "react";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import { LanguageSelector } from "../components/common/LanguageSelector";
import UserDropdown from "../components/header/UserDropdown";
import { Shield, Menu } from "lucide-react";

export const AdminHeader: React.FC<{ onMobileMenuToggle: () => void }> = ({ onMobileMenuToggle }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.email === "admin@vyaparmitra.in" ? "SUPER_ADMIN" : (user?.role || "ADMIN");

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/90 px-4 md:px-6 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 border border-emerald-200 dark:border-emerald-800/60">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-300 uppercase">
            {role === "SUPER_ADMIN" ? "Super Admin Access" : "Admin Panel"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <LanguageSelector />
        <ThemeToggleButton />
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />
        <UserDropdown />
      </div>
    </header>
  );
};
