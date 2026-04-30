import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, workshop } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-100">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button className="rounded p-2 hover:bg-slate-100 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 sm:text-xl">Panel de Control</h1>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">{user?.fullName || "No autenticado"}</p>
            <p className="text-xs text-slate-500">{workshop?.name || "Taller no definido"}</p>
          </div>
        </header>

        <section className="mx-auto max-w-7xl p-3 sm:p-5 md:p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
