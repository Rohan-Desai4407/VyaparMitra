import React, { useState } from "react";
import { Bell, Send, Plus, CheckCircle2 } from "lucide-react";

export const AdminNotifications: React.FC = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("ALL");
  const [language, setLanguage] = useState("ALL");
  const [priority, setPriority] = useState("NORMAL");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Notification broadcast created for target [${target}] in language [${language}] with priority [${priority}]!`);
    setTitle("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Notification Broadcast Center</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create and publish scheme updates, market alerts, and system announcements to targeted user groups
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4 max-w-2xl">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-emerald-500" />
          Create Broadcast Notification
        </h2>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Notification Title</label>
          <input
            type="text"
            required
            placeholder="e.g., New PMEGP Subsidy Guidelines Released"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Message Content</label>
          <textarea
            required
            rows={4}
            placeholder="Enter detailed notification content..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Target Audience</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-xs font-semibold text-gray-900 dark:text-white"
            >
              <option value="ALL">All Users</option>
              <option value="DAIRY">Dairy Entrepreneurs</option>
              <option value="GUJARAT">Gujarat Region</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Language Target</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-xs font-semibold text-gray-900 dark:text-white"
            >
              <option value="ALL">All Languages</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarati</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-xs font-semibold text-gray-900 dark:text-white"
            >
              <option value="NORMAL">Normal</option>
              <option value="IMPORTANT">Important</option>
              <option value="CRITICAL">Critical Alert</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white shadow-md transition-colors"
        >
          Publish Notification Broadcast
        </button>
      </form>
    </div>
  );
};

export default AdminNotifications;
