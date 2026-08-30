import React from "react";
import { Settings, Shield, Bell, Moon } from "lucide-react";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";

export const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Settings & Preferences</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage administrative console preferences, theme controls, and security configurations
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-6 max-w-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Theme Control</h3>
            <p className="text-xs text-gray-500">Toggle dark / light mode for the administrative console</p>
          </div>
          <ThemeToggleButton />
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Admin Audit Email Notifications</h3>
            <p className="text-xs text-gray-500">Receive instant email alerts on critical admin actions</p>
          </div>
          <input type="checkbox" defaultChecked className="rounded-md text-emerald-600 focus:ring-emerald-500" />
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
