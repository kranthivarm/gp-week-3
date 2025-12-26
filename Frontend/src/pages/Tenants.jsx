import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [editingTenantId, setEditingTenantId] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const loadTenants = async () => {
    try {
      const res = await api.get("/tenants");
      setTenants(res.data.data);
    } catch {
      setError("Failed to load tenants");
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const startEdit = (tenant) => {
    setEditingTenantId(tenant.id);
    setForm({
      name: tenant.name,
      status: tenant.status,
      subscriptionPlan: tenant.subscription_plan,
      maxUsers: tenant.max_users,
      maxProjects: tenant.max_projects,
    });
  };

  const cancelEdit = () => {
    setEditingTenantId(null);
    setForm({});
  };

  const saveEdit = async (tenantId) => {
    try {
      await api.put(`/tenants/${tenantId}`, form);
      toast.success("Tenant updated successfully");
      setEditingTenantId(null);
      loadTenants();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update tenant");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-emerald-50 min-h-screen">
        <h1 className="text-2xl font-bold text-emerald-900 mb-6">Tenants</h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <div className="grid gap-4">
          {tenants.map((t) => (
            <div
              key={t.id}
              className="bg-white shadow rounded-xl p-5 border-l-4 border-emerald-500"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  {editingTenantId === t.id ? (
                    <input
                      className="border p-2 rounded w-full mb-2"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  ) : (
                    <h2 className="text-lg font-bold text-emerald-800">{t.name}</h2>
                  )}
                  <p className="text-gray-600">Subdomain: {t.subdomain}</p>
                </div>

                <div>
                  {editingTenantId !== t.id ? (
                    <button
                      onClick={() => startEdit(t)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => saveEdit(t.id)}
                        className="text-green-600 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingTenantId === t.id ? (
                <div className="grid gap-2 md:grid-cols-3">
                  <select
                    value={form.subscriptionPlan}
                    onChange={(e) => setForm({ ...form, subscriptionPlan: e.target.value })}
                    className="border p-2 rounded"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                  <input
                    type="number"
                    value={form.maxUsers}
                    onChange={(e) =>
                      setForm({ ...form, maxUsers: Number(e.target.value) })
                    }
                    className="border p-2 rounded"
                    placeholder="Max Users"
                  />
                  <input
                    type="number"
                    value={form.maxProjects}
                    onChange={(e) =>
                      setForm({ ...form, maxProjects: Number(e.target.value) })
                    }
                    className="border p-2 rounded"
                    placeholder="Max Projects"
                  />
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="border p-2 rounded"
                  >
                    <option value="active">Active</option>
                    <option value="trial">Trial</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              ) : (
                <div className="text-gray-700 mt-2">
                  <p>Plan: {t.subscription_plan}</p>
                  <p>Max Users: {t.max_users}</p>
                  <p>Max Projects: {t.max_projects}</p>
                  <p>Status: {t.status}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
