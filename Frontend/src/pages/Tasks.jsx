import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { getUser } from "../auth/auth";
import { toast } from "react-toastify";

export default function Tasks() {
  const { projectId } = useParams();
  const currentUser = getUser();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const loadTasks = async () => {
    try {
      const res = await api.get(`/tasks?projectId=${projectId}`);
      setTasks(res.data.data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data.filter((u) => u.is_active));
    } catch {}
  };

  useEffect(() => {
    loadTasks();
    if (currentUser.role === "tenant_admin") loadUsers();
  }, [projectId]);

  const createTask = async () => {
    if (!title) return toast.error("Task title required");

    try {
      await api.post(`/projects/${projectId}/tasks`, {
        title,
        description,
        priority,
        assignedTo: assignedTo || null,
        dueDate: dueDate || null,
      });
      toast.success("Task created");
      setTitle(""); setDescription(""); setPriority("medium"); setAssignedTo(""); setDueDate("");
      loadTasks();
    } catch {
      toast.error("Failed to create task");
    }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({
      status: t.status,
      priority: t.priority,
      assignedTo: t.assignedTo || "",
      dueDate: t.dueDate ? t.dueDate.split("T")[0] : "",
    });
  };

  const saveEdit = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, {
        status: form.status,
        priority: form.priority,
        assignedTo: form.assignedTo || null,
        dueDate: form.dueDate || null,
      });
      toast.success("Task updated");
      setEditingId(null);
      loadTasks();
    } catch {
      toast.error("Update failed");
    }
  };

  const cancelEdit = () => { setEditingId(null); setForm({}); };

  return (
    <>
      <Navbar />
      <div className="bg-emerald-50 min-h-screen p-6">
        <h1 className="text-3xl font-bold text-emerald-900 mb-6">Project Tasks</h1>

        {currentUser.role === "tenant_admin" && (
          <div className="bg-white shadow rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4">Add Task</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border border-emerald-300 p-2 rounded focus:ring-2 focus:ring-emerald-500"
                placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="border border-emerald-300 p-2 rounded focus:ring-2 focus:ring-emerald-500"
                placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
              />
              <select
                className="border border-emerald-300 p-2 rounded focus:ring-2 focus:ring-emerald-500"
                value={priority} onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                className="border border-emerald-300 p-2 rounded focus:ring-2 focus:ring-emerald-500"
                value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Unassigned</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
              </select>
              <input
                type="date" className="border border-emerald-300 p-2 rounded focus:ring-2 focus:ring-emerald-500"
                value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <button
              onClick={createTask}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
            >Create Task</button>
          </div>
        )}

        <div className="grid gap-6">
          {tasks.map(t => (
            <div key={t.id} className="bg-white rounded-xl shadow p-5 border-l-4 border-emerald-500">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-emerald-800">{t.title}</h3>
                {currentUser.role === "tenant_admin" && (
                  <div>
                    {editingId !== t.id ? (
                      <button onClick={() => startEdit(t)} className="text-blue-600 mr-2">Edit</button>
                    ) : (
                      <>
                        <button onClick={() => saveEdit(t.id)} className="text-green-600 mr-2">Save</button>
                        <button onClick={cancelEdit} className="text-gray-600">Cancel</button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {editingId === t.id ? (
                <>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="border p-2 rounded w-full mt-2">
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="border p-2 rounded w-full mt-2">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <select value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} className="border p-2 rounded w-full mt-2">
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                  </select>
                  <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="border p-2 rounded w-full mt-2" />
                </>
              ) : (
                <div className="mt-2 text-gray-700">
                  <p>{t.description || "No description"}</p>
                  <p className="inline-block mt-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 mr-2">{t.status}</p>
                  <p className="inline-block mt-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">{t.priority}</p>
                  <p className="mt-1">Assigned: {t.assignedToName || "—"}</p>
                  <p>Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
