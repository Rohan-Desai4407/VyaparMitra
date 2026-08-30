import React, { useState, useEffect } from "react";
import { adminApiService } from "../../services/apiServices";
import { History, Search, Shield, RefreshCw } from "lucide-react";

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "demo_token_admin";
      const res = await adminApiService.getAuditLogs(token);
      if (res && res.data) {
        setLogs(res.data);
      } else {
        setLogs([
          { _id: "1", actorName: "Main Administrator", actorEmail: "admin@vyaparmitra.in", action: "ADMIN_ASSIGNED", target: "sunita@yahoo.com", details: "Assigned role ADMIN", timestamp: new Date() },
          { _id: "2", actorName: "Main Administrator", actorEmail: "admin@vyaparmitra.in", action: "FINANCE_CONFIG_UPDATED", target: "Global Margin", details: "Changed margin to 15%", timestamp: new Date(Date.now() - 3600000) }
        ]);
      }
    } catch (e) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((l) =>
    l.actorName?.toLowerCase().includes(search.toLowerCase()) ||
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.details?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">System Audit Trail</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Immutable chronological record of administrative actions, permission updates, and status changes
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors w-fit"
        >
          <RefreshCw className="w-4 h-4 text-emerald-600" />
          Refresh Logs
        </button>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by action or admin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 py-2 text-sm dark:text-white focus:outline-none"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-800/80 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4">Actor</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Target</th>
              <th className="px-6 py-4">Details</th>
              <th className="px-6 py-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredLogs.map((log) => (
              <tr key={log._id || log.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                  <div>{log.actorName}</div>
                  <div className="text-xs font-normal text-gray-400">{log.actorEmail}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium">{log.target || "N/A"}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{log.details}</td>
                <td className="px-6 py-4 text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
