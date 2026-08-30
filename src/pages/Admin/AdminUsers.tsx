import React, { useState, useEffect } from "react";
import { adminApiService } from "../../services/apiServices";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  RefreshCw,
  X,
  Mail,
  Calendar,
  Globe,
  Briefcase
} from "lucide-react";

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "demo_token_admin";
      const res = await adminApiService.getUsers(token);
      if (res && res.data) {
        setUsers(res.data);
      } else {
        // Fallback demo users
        setUsers([
          {
            _id: "u1",
            name: "Ramesh Patel",
            email: "ramesh@gmail.com",
            role: "USER",
            status: "ACTIVE",
            preferredLanguage: "Gujarati",
            createdAt: new Date("2026-01-15"),
            lastActive: new Date(),
            businessDetails: { businessName: "Patel Dairy Farm", industry: "Dairy & Livestock" },
            locationDetails: { district: "Anand", state: "Gujarat" }
          },
          {
            _id: "u2",
            name: "Sunita Sharma",
            email: "sunita@yahoo.com",
            role: "USER",
            status: "ACTIVE",
            preferredLanguage: "Hindi",
            createdAt: new Date("2026-02-10"),
            lastActive: new Date(Date.now() - 86400000),
            businessDetails: { businessName: "Sharma Food Processing", industry: "Food Processing" },
            locationDetails: { district: "Jaipur", state: "Rajasthan" }
          },
          {
            _id: "u3",
            name: "Amit Kumar",
            email: "admin@vyaparmitra.in",
            role: "SUPER_ADMIN",
            status: "ACTIVE",
            preferredLanguage: "English",
            createdAt: new Date("2025-12-01"),
            lastActive: new Date(),
            businessDetails: { businessName: "VyaparMitra HQ", industry: "Platform Governance" },
            locationDetails: { district: "Ahmedabad", state: "Gujarat" }
          }
        ]);
      }
    } catch (e) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    if (!window.confirm(`Are you sure you want to set status of ${user.name} (${user.email}) to ${newStatus}?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token") || "demo_token_admin";
      await adminApiService.updateUserStatus(token, user._id || user.id, newStatus);
      setUsers(users.map((u) => (u._id === user._id || u.id === user.id ? { ...u, status: newStatus } : u)));
      if (selectedUser && (selectedUser._id === user._id || selectedUser.id === user.id)) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (e: any) {
      alert("Failed to update user status: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.businessDetails?.businessName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">User Directory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage user accounts, view profiles, and control account status
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors w-fit"
        >
          <RefreshCw className="w-4 h-4 text-emerald-600" />
          Refresh Users
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-10 pr-4 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-semibold dark:text-white focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Standard User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-semibold dark:text-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Business</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                          {u.name ? u.name[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{u.name || "User"}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {u.businessDetails?.businessName || "Not Set"}
                      </div>
                      <div className="text-xs text-gray-500">{u.businessDetails?.industry || u.locationDetails?.district || "India"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          : u.role === "ADMIN"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}>
                        {u.role || "USER"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.status === "DISABLED"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}>
                        {u.status === "DISABLED" ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {u.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-300">
                      {u.preferredLanguage || "English"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        title="View User Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={actionLoading}
                        className={`p-1.5 rounded-lg font-semibold text-xs ${
                          u.status === "DISABLED"
                            ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                            : "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                        }`}
                        title={u.status === "DISABLED" ? "Activate User" : "Deactivate User"}
                      >
                        {u.status === "DISABLED" ? "Activate" : "Deactivate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
          <div className="h-full w-full max-w-md bg-white dark:bg-gray-900 p-6 shadow-xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">User Profile Details</h2>
              <button onClick={() => setSelectedUser(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-lg">
                  {selectedUser.name ? selectedUser.name[0] : "U"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Account Role</span>
                  <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{selectedUser.role || "USER"}</p>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Status</span>
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">{selectedUser.status || "ACTIVE"}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span>Business: {selectedUser.businessDetails?.businessName || "Not configured"}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span>Language: {selectedUser.preferredLanguage || "English"}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>Joined: {new Date(selectedUser.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => handleToggleStatus(selectedUser)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
                  selectedUser.status === "DISABLED"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-rose-600 text-white hover:bg-rose-700"
                }`}
              >
                {selectedUser.status === "DISABLED" ? "Activate User Account" : "Deactivate User Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
