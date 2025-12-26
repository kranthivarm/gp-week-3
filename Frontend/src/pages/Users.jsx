import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { getUser } from "../auth/auth";

export default function Users() {
  const currentUser = getUser();
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const createUser = async () => {
    if (!email || !password || !fullName) return toast.error("All fields are required");
    try {
      await api.post("/users", { email, fullName, password, role: "user" });
      setEmail(""); setFullName(""); setPassword("");
      toast.success("User created successfully");
      loadUsers();
    } catch {
      toast.error("Failed to create user");
    }
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({
      fullName: u.full_name,
      role: u.role,
      isActive: u.is_active ? "true" : "false",
    });
  };

  const cancelEdit = () => { setEditingId(null); setForm({}); };

  const saveEdit = async (userId) => {
    try {
      await api.put(`/users/${userId}`, {
        fullName: form.fullName,
        role: currentUser.role === "tenant_admin" ? form.role : undefined,
        isActive: currentUser.role === "tenant_admin" && currentUser.userId !== userId
          ? form.isActive === "true"
          : undefined,
      });
      toast.success("User updated successfully");
      setEditingId(null);
      loadUsers();
    } catch {
      toast.error("Update failed (Tenant admins cannot deactivate themselves)");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-emerald-50 min-h-screen">
        <h1 className="text-2xl font-bold text-emerald-900 mb-6">Users</h1>

        {/* Create User */}
        {currentUser.role === "tenant_admin" && (
          <div className="bg-white shadow rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4">Add User</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-2">
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-emerald-500"
                placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)}
              />
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-emerald-500"
                placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <input
              type="password"
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-emerald-500"
              placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            />
            <button
              onClick={createUser}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded"
            >
              Create User
            </button>
          </div>
        )}

        {/* Users List */}
        <div className="grid gap-4">
          {users.map(u => {
            const isSelf = currentUser.userId === u.id;
            const canEdit = currentUser.role === "tenant_admin" || isSelf;

            return (
              <div key={u.id} className="bg-white shadow rounded-xl p-5 border-l-4 border-emerald-500">
                <div className="flex justify-between items-start">
                  <div>
                    {editingId === u.id ? (
                      <input
                        className="border p-2 rounded w-full mb-2"
                        value={form.fullName}
                        onChange={e => setForm({...form, fullName: e.target.value})}
                      />
                    ) : (
                      <h3 className="text-lg font-bold text-emerald-800">{u.full_name}</h3>
                    )}
                    <p className="text-gray-600">{u.email}</p>
                    <p className="mt-1 text-sm">Role: {u.role}</p>
                    <p className="text-sm">Status: {u.is_active ? "Active" : "Inactive"}</p>
                  </div>

                  {canEdit && (
                    <div>
                      {editingId !== u.id ? (
                        <button onClick={() => startEdit(u)} className="text-blue-600">Edit</button>
                      ) : (
                        <>
                          <button onClick={() => saveEdit(u.id)} className="text-green-600 mr-2">Save</button>
                          <button onClick={cancelEdit} className="text-gray-600">Cancel</button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Admin-only editable fields */}
                {editingId === u.id && currentUser.role === "tenant_admin" && !isSelf && (
                  <div className="mt-2 flex gap-2">
                    <select
                      value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                      className="border p-2 rounded"
                    >
                      <option value="user">User</option>
                      <option value="tenant_admin">Tenant Admin</option>
                    </select>
                    <select
                      value={form.isActive} onChange={e => setForm({...form, isActive: e.target.value})}
                      className="border p-2 rounded"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
