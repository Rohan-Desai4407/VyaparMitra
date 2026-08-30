import React from "react";
import { FileText, Download, FileSpreadsheet, RefreshCw } from "lucide-react";

export const AdminReports: React.FC = () => {
  const reports = [
    { id: "REP-2026-02", title: "Monthly Platform Performance Summary", date: "2026-02-01", type: "Platform Executive", format: "PDF / CSV" },
    { id: "REP-2026-01", title: "Scheme Matching & Loan Subsidy Audit", date: "2026-01-01", type: "Government Compliance", format: "PDF / CSV" }
  ];

  const handleExport = (type: string) => {
    alert(`Exporting ${type} report... Download will begin automatically.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Administrative Report Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generate and export monthly platform usage summaries, feasibility stats, and compliance logs
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleExport("CSV")}
            className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3.5 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport("PDF")}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Generate Monthly Report
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-800/80 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4">Report ID & Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Generated Date</th>
              <th className="px-6 py-4">Available Formats</th>
              <th className="px-6 py-4 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {reports.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 dark:text-white">{r.title}</div>
                  <div className="text-xs font-mono text-emerald-600">{r.id}</div>
                </td>
                <td className="px-6 py-4 text-xs font-medium">{r.type}</td>
                <td className="px-6 py-4 text-xs">{r.date}</td>
                <td className="px-6 py-4 font-semibold text-xs text-purple-600">{r.format}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleExport(r.title)} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-bold text-xs inline-flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Download
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

export default AdminReports;
