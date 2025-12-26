// import { getUser, logout } from "../auth/auth";

// export default function Navbar() {
//   const user = getUser();
// console.log(user.role);
//   return (
//     <div className="bg-gray-800 text-white p-4 flex gap-4">
//       {user?.role === "super_admin" && (
//         <a href="/tenants">Tenants</a>
//       )}
      

//         {user?.role === "tenant_admin" && (
//         <>
//           <a href="/dashboard">Dashboard</a>
//           <a href="/projects">Projects</a>
//           <a href="/users">Users</a>
//         </>
//       )}

//       {user?.role === "user" && (
//         <>
//           <a href="/dashboard">Dashboard</a>
//           <a href="/projects">Projects</a>
          
//         </>
//       )}
//       {user.role === "tenant_admin" && (
//   <a href="/settings">Organization</a>
// )}


//       <button onClick={logout} className="ml-auto">
//         Logout
//       </button>
//     </div>
//   );
// }

import { NavLink } from "react-router-dom";
import { getUser, logout } from "../auth/auth";

export default function Navbar() {
  const user = getUser();

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition font-medium ${
      isActive
        ? "bg-emerald-700 text-white"
        : "text-emerald-100 hover:bg-emerald-700 hover:text-white"
    }`;

  return (
    <nav className="bg-emerald-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
        
        {/* Logo / Title */}
        <h1 className="text-xl font-bold text-white mr-6">
          Multi-Tenant SaaS
        </h1>

        {/* Super Admin */}
        {user?.role === "super_admin" && (
          <NavLink to="/tenants" className={linkClass}>
            Tenants
          </NavLink>
        )}

        {/* Tenant Admin */}
        {user?.role === "tenant_admin" && (
          <>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/projects" className={linkClass}>
              Projects
            </NavLink>
            <NavLink to="/users" className={linkClass}>
              Users
            </NavLink>
            <NavLink to="/settings" className={linkClass}>
              Organization
            </NavLink>
          </>
        )}

        {/* Normal User */}
        {user?.role === "user" && (
          <>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/projects" className={linkClass}>
              Projects
            </NavLink>
          </>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="ml-auto bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
