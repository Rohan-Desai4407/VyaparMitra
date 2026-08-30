import React, { useState } from "react";
import { TrendingUp, Plus, Search, Edit2, CheckCircle, RefreshCw } from "lucide-react";

export const AdminMarket: React.FC = () => {
  const [search, setSearch] = useState("");

  const marketData = [
    { id: "1", location: "Ahmedabad, Gujarat", category: "Dairy & Livestock", demand: "High", competition: "Medium", score: 86, updated: "2026-02-20" },
    { id: "2", location: "Jaipur, Rajasthan", category: "Food Processing", demand: "Very High", competition: "Low", score: 92, updated: "2026-02-22" },
    { id: "3", location: "Pune, Maharashtra", category: "Poultry Farming", demand: "Medium", competition: "High", score: 74, updated: "2026-02-18" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Hyper-Local Market Intelligence</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage local market demand scores, competition intensity, and investment feasibility parameters
          </p>
        </div>
        <button
          onClick={() => alert("Add Market Data Record Modal")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Market Record
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-800/80 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Demand</th>
              <th className="px-6 py-4">Competition</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {marketData.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{m.location}</td>
                <td className="px-6 py-4 font-medium">{m.category}</td>
                <td className="px-6 py-4 text-xs font-bold text-emerald-600">{m.demand}</td>
                <td className="px-6 py-4 text-xs font-medium text-gray-500">{m.competition}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {m.score} / 100
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMarket;
