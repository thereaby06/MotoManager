import { ClipboardList, LayoutDashboard, LogOut, MessageSquare, UserCircle2 } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/orders", label: "Órdenes", icon: ClipboardList },
  { to: "/chat", label: "Chat", icon: MessageSquare },
];

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="relative h-full w-72 bg-slate-900 text-slate-100">
      <div className="border-b border-slate-700 p-5">
        <p className="text-xl font-bold">
          Taller<span className="text-cyan-400">Moto</span>
        </p>
        <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">{user?.role || "INVITADO"}</p>
      </div>

      <nav className="space-y-1 p-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                isActive ? "bg-cyan-500/15 text-cyan-300" : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-72 border-t border-slate-700 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-lg bg-slate-800/50 px-3 py-2">
          <UserCircle2 size={18} />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">{user?.fullName || "Sin sesión"}</p>
            <p className="truncate text-[11px] text-slate-400">{user?.email || "-"}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
