import React, { useState, useEffect } from "react";
import { adminApiService } from "../../services/apiServices";
import {
  ShieldCheck,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Lock
} from "lucide-react";

export const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditPermsModal, setShowEditPermsModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);

  // Form states
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([
    "VIEW_USERS", "VIEW_ASSESSMENTS", "VIEW_MARKET_DATA", "VIEW_SCHEMES"
  ]);

  const allPermissions = [
    { key: "VIEW_USERS", label: "View Users Directory" },
    { key: "MANAGE_USERS", label: "Manage / Toggle Users" },
    { key: "VIEW_ASSESSMENTS", label: "View Business Assessments" },
    { key: "VIEW_MARKET_DATA", label: "View Market Intelligence" },
    { key: "MANAGE_MARKET_DATA", label: "Manage Market Data" },
    { key: "VIEW_SCHEMES", label: "View Government Schemes" },
    { key: "MANAGE_SCHEMES", label: "Manage Government Schemes" },
    { key: "VIEW_NOTIFICATIONS", label: "View Notifications" },
    { key: "MANAGE_NOTIFICATIONS", label: "Publish Notifications" },
    { key: "VIEW_ANALYTICS", label: "View Analytics" },
    { key: "VIEW_REPORTS", label: "View Reports" },
    { key: "MANAGE_CONTENT", label: "Manage Content & Config" },
    { key: "VIEW_AI_ANALYTICS", label: "View AI Monitor" }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "demo_token_admin";
      const [adminRes, userRes] = await Promise.all([
        adminApiService.getAdmins(token).catch(() => null),
        adminApiService.getUsers(token).catch(() => null)
      ]);

      if (adminRes && adminRes.data) {
        setAdmins(adminRes.data);
      } else {
        setAdmins([
          {
            _id: "adm-1",
            name: "Main Administrator",
            email: "admin@vyaparmitra.in",
            role: "SUPER_ADMIN",
            status: "ACTIVE",
            permissions: allPermissions.map((p) => p.key),
            createdAt: new Date("2025-12-01")
          }
        ]);
      }

      if (userRes && userRes.data) {
        setUsers(userRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      alert("Please select a user to promote to administrator.");
      return;
    }

    try {
      const token = localStorage.getItem("token") || "demo_token_admin";
      await adminApiService.assignAdmin(token, {
        userId: selectedUserId,
        role: selectedRole,
        permissions: selectedPerms
      });
      alert("Admin access assigned successfully!");
      setShowAddModal(false);
      loadData();
    } catch (err: any) {
      alert("Failed to assign admin: " + err.message);
    }
  };

  const handleUpdatePerms = async () => {
    if (!selectedAdmin) return;
    try {
      const token = localStorage.getItem("token") || "demo_token_admin";
      await adminApiService.updatePermissions(token, selectedAdmin._id || selectedAdmin.id, selectedPerms);
      alert("Admin permissions updated successfully!");
      setShowEditPermsModal(false);
      loadData();
    } catch (err: any) {
      alert("Failed to update permissions: " + err.message);
    }
  };

  const handleRevokeAdmin = async (admin: any) => {
    if (admin.role === "SUPER_ADMIN") {
      const superAdmins = admins.filter((a) => a.role === "SUPER_ADMIN" && a.status === "ACTIVE");
      if (superAdmins.length <= 1) {
        alert("LOCKOUT PROTECTION: You cannot revoke privileges from the last active Super Admin.");
        return;
      }
    }

    if (!window.confirm(`Are you sure you want to revoke admin privileges from ${admin.name} (${admin.email})? They will revert to a standard USER.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token") || "demo_token_admin";
      await adminApiService.revokeAdmin(token, admin._id || admin.id);
      alert("Admin privileges revoked.");
      loadData();
    } catch (err: any) {
      alert("Revoke failed: " + err.message);
    }
  };

  const togglePerm = (key: string) => {
    if (selectedPerms.includes(key)) {
      setSelectedPerms(selectedPerms.filter((p) => p !== key));
    } else {
      setSelectedPerms([...selectedPerms, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-purple-950 dark:text-purple-300 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Super Admin Control Center
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Grant admin rights to existing users, customize granular permissions, and enforce administrative access
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedPerms(["VIEW_USERS", "VIEW_ASSESSMENTS", "VIEW_MARKET_DATA", "VIEW_SCHEMES"]);
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-4 py-2 shadow-md transition-colors w-fit"
        >
          <UserPlus className="w-4 h-4" />
          Add Administrator
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-purple-50 dark:bg-purple-950/40 text-xs uppercase font-semibold text-purple-900 dark:text-purple-300 border-b border-purple-100 dark:border-purple-900/50">
            <tr>
              <th className="px-6 py-4">Administrator</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Permissions Assigned</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {admins.map((adm) => (
              <tr key={adm._id || adm.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/10">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 dark:text-white">{adm.name}</div>
                  <div className="text-xs text-gray-500">{adm.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    adm.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  }`}>
                    {adm.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                  {adm.role === "SUPER_ADMIN" ? (
                    <span className="font-bold text-purple-600">Full System Access</span>
                  ) : (
                    <span>{adm.permissions?.length || 0} permissions</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle className="w-3 h-3" />
                    {adm.status || "ACTIVE"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {adm.role !== "SUPER_ADMIN" && (
                    <button
                      onClick={() => {
                        setSelectedAdmin(adm);
                        setSelectedPerms(adm.permissions || []);
                        setShowEditPermsModal(true);
                      }}
                      className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950"
                      title="Edit Permissions"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRevokeAdmin(adm)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                    title="Revoke Admin Rights"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Promote Existing User to Admin</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Select User</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 text-xs font-medium dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- Choose User --</option>
                  {users.map((u) => (
                    <option key={u._id || u.id} value={u._id || u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Admin Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 text-xs font-semibold dark:bg-gray-800 dark:text-white"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Granular Permissions</label>
                <div className="space-y-2 max-h-48 overflow-y-auto p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                  {allPermissions.map((p) => (
                    <label key={p.key} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPerms.includes(p.key)}
                        onChange={() => togglePerm(p.key)}
                        className="rounded-md border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700">
                Cancel
              </button>
              <button onClick={handleAssignAdmin} className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-md">
                Grant Admin Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
