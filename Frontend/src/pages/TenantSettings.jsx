import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { getUser } from "../auth/auth";

export default function TenantSettings() {
  const user = getUser();
  const [tenant, setTenant] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTenant = async () => {
    try {
      const res = await api.get("/tenants/me");
      setTenant(res.data.data);
      setName(res.data.data.name);
    } catch {
      toast.error("Failed to load tenant details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenant();
  }, []);

  const updateName = async () => {
    if (!name.trim()) return toast.error("Company name cannot be empty");
    try {
      await api.put(`/tenants/${tenant.id}`, { name });
      toast.success("Company name updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return null;

  return (
    <>
      <Navbar />
      <div className="p-6 bg-emerald-50 min-h-screen">
        <div className="max-w-xl mx-auto bg-white shadow rounded-xl p-6">
          <h1 className="text-2xl font-bold text-emerald-900 mb-4">
            Organization Settings
          </h1>

          {/* Company Name */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Company Name</label>
            <input
              className="border p-2 w-full rounded focus:ring-2 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button
            onClick={updateName}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 mb-6"
          >
            Save Changes
          </button>

          {/* Read-only Info */}
          <div className="border-t pt-4 text-gray-700">
            <p><strong>Plan:</strong> {tenant.subscription_plan}</p>
            <p><strong>Status:</strong> {tenant.status}</p>
            <p><strong>Max Users:</strong> {tenant.max_users}</p>
            <p><strong>Max Projects:</strong> {tenant.max_projects}</p>
          </div>
        </div>
      </div>
    </>
  );
}
