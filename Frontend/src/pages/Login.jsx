import { useState } from "react";
import api from "../api/api";
import { saveAuth } from "../auth/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantSubdomain, setTenantSubdomain] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
        tenantSubdomain: tenantSubdomain || undefined,
      });

      saveAuth(res.data.data.token, res.data.data.user);
      const user = res.data.data.user;

      if (user.role === "super_admin") {
        window.location.href = "/tenants";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >
        <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
          Login to your Workspace
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <input
          className="border border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none p-2 w-full mb-3 rounded-lg"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none p-2 w-full mb-3 rounded-lg"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="border border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none p-2 w-full mb-5 rounded-lg"
          placeholder="Tenant subdomain (optional)"
          value={tenantSubdomain}
          onChange={(e) => setTenantSubdomain(e.target.value)}
        />

        <button className="bg-emerald-600 hover:bg-emerald-700 transition text-white w-full p-2 rounded-lg font-semibold">
          Login
        </button>

        <p className="text-sm mt-5 text-center text-gray-600">
          New organization?{" "}
          <a href="/register" className="text-emerald-600 font-medium hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}
