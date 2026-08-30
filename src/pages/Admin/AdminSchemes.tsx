import React, { useState } from "react";
import { Landmark, Plus, Search, Edit2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

export const AdminSchemes: React.FC = () => {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const schemes = [
    {
      id: "1",
      code: "PMEGP",
      name: "Prime Minister Employment Generation Programme (PMEGP)",
      department: "Ministry of MSME",
      subsidy: "15% - 35%",
      maxLoan: "₹ 50,00,000",
      status: "ACTIVE",
      updatedAt: "2026-02-10"
    },
    {
      id: "2",
      code: "PMFME",
      name: "PM Formalisation of Micro Food Processing Enterprises",
      department: "Ministry of Food Processing",
      subsidy: "35%",
      maxLoan: "₹ 10,00,000",
      status: "ACTIVE",
      updatedAt: "2026-01-25"
    },
    {
      id: "3",
      code: "MUDRA_KISHORE",
      name: "Pradhan Mantri MUDRA Yojana (Kishore)",
      department: "Ministry of Finance",
      subsidy: "Nil (Interest Subvention)",
      maxLoan: "₹ 5,00,000",
      status: "ACTIVE",
      updatedAt: "2026-02-01"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Government Scheme Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Maintain dynamic government business scheme repository, subsidy rules, and eligibility standards
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Government Scheme
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-800/80 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4">Code & Name</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Subsidy</th>
              <th className="px-6 py-4">Max Loan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {schemes.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 dark:text-white">{s.name}</div>
                  <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{s.code}</div>
                </td>
                <td className="px-6 py-4 text-xs font-medium">{s.department}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">{s.subsidy}</td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{s.maxLoan}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    {s.status}
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Government Scheme</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Scheme Name" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 text-xs dark:bg-gray-800 dark:text-white" />
              <input type="text" placeholder="Scheme Code (e.g. PMEGP)" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 text-xs dark:bg-gray-800 dark:text-white" />
              <input type="text" placeholder="Ministry / Department" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 text-xs dark:bg-gray-800 dark:text-white" />
              <input type="text" placeholder="Max Loan Amount" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 text-xs dark:bg-gray-800 dark:text-white" />
              <input type="text" placeholder="Subsidy Percentage" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 text-xs dark:bg-gray-800 dark:text-white" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700">Cancel</button>
              <button onClick={() => { setShowAddModal(false); alert("Scheme added successfully!"); }} className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white">Save Scheme</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchemes;
