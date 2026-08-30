import React, { useState } from "react";
import { DollarSign, AlertOctagon, CheckCircle2, ShieldAlert } from "lucide-react";

export const AdminFinance: React.FC = () => {
  const [marginPct, setMarginPct] = useState("15");
  const [interestRate, setInterestRate] = useState("8.5");
  const [maxTenure, setMaxTenure] = useState("84");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any>(null);

  const handleSaveAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingChanges({
      marginPct: { old: "15%", new: `${marginPct}%` },
      interestRate: { old: "8.5%", new: `${interestRate}%` },
      maxTenure: { old: "84 Months", new: `${maxTenure} Months` }
    });
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    alert("Financial parameters updated successfully and recorded in audit log.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Financial Configuration</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configure default loan parameters, interest rate assumptions, and margin thresholds
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 leading-relaxed">
          HIGH RISK AREA: Modifying global financial parameters directly alters all user EMI calculations, loan eligibility matching, and feasibility report algorithms across the entire platform.
        </p>
      </div>

      <form onSubmit={handleSaveAttempt} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Default Margin Capital Requirement (%)</label>
            <input
              type="number"
              value={marginPct}
              onChange={(e) => setMarginPct(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Standard Loan Interest Rate (% P.A.)</label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Maximum Repayment Tenure (Months)</label>
            <input
              type="number"
              value={maxTenure}
              onChange={(e) => setMaxTenure(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-sm text-white shadow-md transition-colors"
        >
          Review & Apply Changes
        </button>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && pendingChanges && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertOctagon className="w-6 h-6" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Financial Change</h2>
            </div>

            <div className="space-y-3 rounded-xl bg-gray-50 dark:bg-gray-800 p-4 text-xs">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="font-semibold text-gray-500">Margin Capital:</span>
                <span className="font-bold text-gray-900 dark:text-white">{pendingChanges.marginPct.old} → <span className="text-emerald-600">{pendingChanges.marginPct.new}</span></span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="font-semibold text-gray-500">Interest Rate:</span>
                <span className="font-bold text-gray-900 dark:text-white">{pendingChanges.interestRate.old} → <span className="text-emerald-600">{pendingChanges.interestRate.new}</span></span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Max Tenure:</span>
                <span className="font-bold text-gray-900 dark:text-white">{pendingChanges.maxTenure.old} → <span className="text-emerald-600">{pendingChanges.maxTenure.new}</span></span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 font-semibold text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white shadow-md"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFinance;
