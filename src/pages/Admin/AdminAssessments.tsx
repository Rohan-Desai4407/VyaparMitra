import React, { useState } from "react";
import { ClipboardList, Search, Filter, Eye, CheckCircle2, TrendingUp } from "lucide-react";

export const AdminAssessments: React.FC = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);

  const assessments = [
    {
      id: "ASM-8821",
      user: "Ramesh Patel",
      email: "ramesh@gmail.com",
      category: "Dairy & Livestock",
      location: "Anand, Gujarat",
      investment: "₹ 5,00,000",
      viabilityScore: 88,
      status: "COMPLETED",
      matchedScheme: "PM-EGGP Dairy Subsidy",
      createdAt: "2026-02-14",
      swot: {
        strengths: ["High local milk demand", "Proximity to processing cooperative"],
        weaknesses: ["Seasonal feed price fluctuation"],
        opportunities: ["Expansion into organic ghee"],
        threats: ["Disease outbreak risks"]
      }
    },
    {
      id: "ASM-8822",
      user: "Sunita Sharma",
      email: "sunita@yahoo.com",
      category: "Food Processing",
      location: "Jaipur, Rajasthan",
      investment: "₹ 12,00,000",
      viabilityScore: 82,
      status: "COMPLETED",
      matchedScheme: "PM Formalisation of Micro Food Enterprises (PMFME)",
      createdAt: "2026-02-18",
      swot: {
        strengths: ["Unique spices blend formula", "Strong local distribution"],
        weaknesses: ["Working capital constraint"],
        opportunities: ["E-commerce export markets"],
        threats: ["Large brand competition"]
      }
    }
  ];

  const filtered = assessments.filter((a) => {
    const matchesSearch = a.user.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || a.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Business Assessment Activity</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monitor user business viability assessments and scheme matching results across the platform
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase text-gray-500">Total Assessments</span>
          <div className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">142</div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase text-gray-500">Completed Rate</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600">83.1%</div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase text-gray-500">Avg Viability Score</span>
          <div className="mt-2 text-2xl font-extrabold text-purple-600">84 / 100</div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase text-gray-500">Top Category</span>
          <div className="mt-2 text-2xl font-extrabold text-blue-600">Dairy & Livestock</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          <option value="Dairy & Livestock">Dairy & Livestock</option>
          <option value="Food Processing">Food Processing</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-800/80 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4">ID & User</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Investment</th>
              <th className="px-6 py-4">Viability Score</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((asm) => (
              <tr key={asm.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 dark:text-white">{asm.id}</div>
                  <div className="text-xs text-gray-500">{asm.user}</div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{asm.category}</td>
                <td className="px-6 py-4 text-xs">{asm.location}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">{asm.investment}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {asm.viabilityScore} / 100
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelectedAssessment(asm)}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-semibold text-xs inline-flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Inspect Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
          <div className="h-full w-full max-w-lg bg-white dark:bg-gray-900 p-6 shadow-xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Assessment Report #{selectedAssessment.id}</h2>
              <button onClick={() => setSelectedAssessment(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4">
                <span className="text-xs text-gray-400 font-bold uppercase">Matched Scheme</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedAssessment.matchedScheme}</p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">SWOT Strengths & Opportunities</h3>
                <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                  {selectedAssessment.swot?.strengths.map((s: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssessments;
