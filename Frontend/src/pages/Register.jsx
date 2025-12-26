import { useState } from "react";
import api from "../api/api";

export default function Register() {
  const [tenantName, setTenantName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register-tenant", {
        tenantName,
        subdomain,
        adminFullName: adminName,
        adminEmail: email,
        adminPassword: password,
      });
      setMessage("Organization registered successfully. Please login.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >
        <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
          Register Organization
        </h2>

        {message && (
          <p className="bg-emerald-100 text-emerald-700 p-2 rounded mb-3">
            {message}
          </p>
        )}

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-3">
            {error}
          </p>
        )}

        {[
          ["Company Name", tenantName, setTenantName],
          ["Subdomain", subdomain, setSubdomain],
          ["Admin Name", adminName, setAdminName],
          ["Admin Email", email, setEmail],
        ].map(([ph, val, setter]) => (
          <input
            key={ph}
            className="border border-emerald-300 p-2 w-full mb-3 rounded-lg focus:ring-2 focus:ring-emerald-500"
            placeholder={ph}
            value={val}
            onChange={(e) => setter(e.target.value)}
          />
        ))}

        <input
          type="password"
          className="border border-emerald-300 p-2 w-full mb-5 rounded-lg focus:ring-2 focus:ring-emerald-500"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full p-2 rounded-lg font-semibold">
          Register
        </button>

        <p className="text-sm mt-4 text-center text-gray-600">
          Already registered?{" "}
          <a href="/" className="text-emerald-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
