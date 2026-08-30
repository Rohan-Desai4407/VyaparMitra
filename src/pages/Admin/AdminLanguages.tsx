import React from "react";
import { Globe, CheckCircle2, AlertCircle } from "lucide-react";

export const AdminLanguages: React.FC = () => {
  const languages = [
    { code: "en", name: "English", native: "English", pct: 100, status: "Complete" },
    { code: "hi", name: "Hindi", native: "हिन्दी", pct: 100, status: "Complete" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી", pct: 100, status: "Complete" },
    { code: "mr", name: "Marathi", native: "मराठी", pct: 95, status: "In Progress" },
    { code: "bn", name: "Bengali", native: "বাংলা", pct: 92, status: "In Progress" },
    { code: "ta", name: "Tamil", native: "தமிழ்", pct: 90, status: "In Progress" },
    { code: "te", name: "Telugu", native: "తెలుగు", pct: 88, status: "In Progress" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", pct: 85, status: "Needs Attention" },
    { code: "ml", name: "Malayalam", native: "മലയാളം", pct: 85, status: "Needs Attention" },
    { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", pct: 80, status: "Needs Attention" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Multilingual Translation Completeness</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monitor translation key completion rates across supported Indian regional languages
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {languages.map((l) => (
          <div key={l.code} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{l.name} ({l.native})</h3>
                <span className="text-xs font-mono text-gray-400 uppercase">{l.code}</span>
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                l.pct === 100 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                {l.pct}%
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${l.pct}%` }} />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Status: {l.status}</span>
              <span>i18n Verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLanguages;
