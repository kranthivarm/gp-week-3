import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { getUser } from "../auth/auth";

export default function Dashboard() {
  const user = getUser();

  const [stats, setStats] = useState({
    projects: 0,
    users: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const projectsRes = await api.get("/projects");

        let usersCount = 0;
        if (user.role === "tenant_admin") {
          const usersRes = await api.get("/users");
          usersCount = usersRes.data.data.length;
        }

        setStats({
          projects: projectsRes.data.data.length,
          users: usersCount,
        });
      } catch {
        // silent
      }
    };

    loadStats();
  }, [user.role]);

  return (
    <>
      <Navbar />

      <div className="bg-emerald-50 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Projects Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <h2 className="text-lg font-semibold text-emerald-700">
              Total Projects
            </h2>
            <p className="text-4xl font-bold text-emerald-900 mt-2">
              {stats.projects}
            </p>
          </div>

          {/* Users Card */}
          {user.role === "tenant_admin" && (
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-600">
              <h2 className="text-lg font-semibold text-emerald-700">
                Organization Users
              </h2>
              <p className="text-4xl font-bold text-emerald-900 mt-2">
                {stats.users}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
