import React from "react";
import { FileCode, Plus, Edit2, CheckCircle2 } from "lucide-react";

export const AdminContent: React.FC = () => {
  const contentItems = [
    { id: "1", title: "How to apply for PMEGP Subsidy?", type: "FAQ", lang: "English / Hindi / Gujarati", status: "Published" },
    { id: "2", title: "Top 5 Dairy Farming Best Practices in Gujarat", type: "Business Tip", lang: "Gujarati", status: "Published" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Content Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage FAQs, Business Tips, Educational Content, and Landing Page Announcements
          </p>
        </div>

        <button
          onClick={() => alert("Create Content Item Modal")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Content Entry
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-800/80 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Languages Supported</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {contentItems.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{c.title}</td>
                <td className="px-6 py-4 font-medium text-xs text-purple-600">{c.type}</td>
                <td className="px-6 py-4 text-xs">{c.lang}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    {c.status}
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

export default AdminContent;
