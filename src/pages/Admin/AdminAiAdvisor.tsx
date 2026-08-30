import React from "react";
import { Bot, CheckCircle2, Clock, Activity, Zap } from "lucide-react";

export const AdminAiAdvisor: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">AI Advisor System Health & Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monitor AI response latencies, request throughput, error logs, and topic distribution
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase text-gray-500">Total AI Requests</span>
          <div className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">680</div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase text-gray-500">Success Rate</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600">99.4%</div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase text-gray-500">Avg Latency</span>
          <div className="mt-2 text-2xl font-extrabold text-purple-600">1.2s</div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase text-gray-500">Top Query Category</span>
          <div className="mt-2 text-2xl font-extrabold text-amber-600">Govt Schemes</div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-500" />
          AI Gateway Provider Status
        </h2>
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-4 border border-emerald-200 dark:border-emerald-800/60">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Google Gemini AI Engine</span>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">Operational — Operational Latency: 1140ms</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Healthy</span>
        </div>
      </div>
    </div>
  );
};

export default AdminAiAdvisor;
