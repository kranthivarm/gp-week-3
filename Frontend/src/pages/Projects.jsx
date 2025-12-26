import { useEffect, useState } from "react";
import api from "../api/api";
import { getUser } from "../auth/auth";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Projects() {
  const navigate = useNavigate();
  const currentUser = getUser();

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const loadProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.data);
    } catch {
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async () => {
    if (!name) {
      toast.error("Project name is required");
      return;
    }

    try {
      await api.post("/projects", { name, description });
      setName("");
      setDescription("");
      toast.success("Project created");
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      status: p.status,
    });
  };

  const saveEdit = async (projectId) => {
    try {
      await api.put(`/projects/${projectId}`, form);
      toast.success("Project updated");
      setEditingId(null);
      loadProjects();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${projectId}`);
      toast.success("Project deleted");
      loadProjects();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-emerald-50 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-6">Projects</h1>

        {/* CREATE PROJECT */}
        {currentUser.role === "tenant_admin" && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-emerald-700 mb-4">
              Add New Project
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border border-emerald-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="border border-emerald-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              onClick={createProject}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
            >
              Create Project
            </button>
          </div>
        )}

        {/* PROJECT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const canEdit =
              currentUser.role === "tenant_admin" ||
              currentUser.userId === p.created_by;

            return (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 border-t-4 border-emerald-500"
              >
                {editingId === p.id ? (
                  <>
                    <input
                      className="border p-2 w-full mb-2 rounded"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />

                    <input
                      className="border p-2 w-full mb-2 rounded"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />

                    <select
                      className="border p-2 w-full mb-3 rounded"
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>

                    <div className="flex gap-3">
                      <button
                        onClick={() => saveEdit(p.id)}
                        className="text-emerald-600 font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3
                      className="text-xl font-bold text-emerald-800 cursor-pointer"
                      onClick={() => navigate(`/projects/${p.id}`)}
                    >
                      {p.name}
                    </h3>

                    <p className="text-gray-600 mt-2">
                      {p.description || "No description"}
                    </p>

                    <span className="inline-block mt-3 text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      {p.status}
                    </span>

                    {canEdit && (
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() => startEdit(p)}
                          className="text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
