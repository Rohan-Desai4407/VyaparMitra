import React, { useState } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";

export const AdminAnalytics: React.FC = () => {
  const [range, setRange] = useState("30D");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Platform Analytics & Intelligence</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Macro-level performance metrics, investment distribution, and user engagement trends
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 w-fit">
          {["7D", "30D", "90D", "1Y"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                range === r ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs" : "text-gray-500"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Investment Distribution</h2>
          <div className="space-y-3">
            {[
              { label: "Under ₹ 2 Lakhs", pct: 40 },
              { label: "₹ 2 Lakhs – ₹ 5 Lakhs", pct: 35 },
              { label: "₹ 5 Lakhs – ₹ 10 Lakhs", pct: 18 },
              { label: "Above ₹ 10 Lakhs", pct: 7 }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="text-emerald-600">{item.pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Regional Engagement Top States</h2>
          <div className="space-y-3">
            {[
              { state: "Gujarat", count: "112 Assessments" },
              { state: "Rajasthan", count: "84 Assessments" },
              { state: "Maharashtra", count: "62 Assessments" },
              { state: "Madhya Pradesh", count: "48 Assessments" }
            ].map((st, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-xs">
                <span className="font-bold text-gray-900 dark:text-white">{st.state}</span>
                <span className="font-semibold text-emerald-600">{st.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
