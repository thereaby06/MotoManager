import { LayoutGrid, List, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function OrdersView({ orders, debug }) {
  const [tab, setTab] = useState("ACTIVAS");
  const [view, setView] = useState("GRID");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return orders
      .filter((order) => (tab === "ACTIVAS" ? order.status !== "TERMINADA" : order.status === "TERMINADA"))
      .filter((order) => {
        const byNumber = order.number?.toLowerCase().includes(normalized);
        const byClient = order.client?.fullName?.toLowerCase().includes(normalized);
        const byPlate = order.vehicle?.plate?.toLowerCase().includes(normalized);
        return byNumber || byClient || byPlate;
      });
  }, [orders, query, tab]);

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          <button onClick={() => setTab("ACTIVAS")} className={`rounded-md px-3 py-2 text-sm ${tab === "ACTIVAS" ? "bg-white shadow" : ""}`}>Órdenes Activas</button>
          <button onClick={() => setTab("HISTORIAL")} className={`rounded-md px-3 py-2 text-sm ${tab === "HISTORIAL" ? "bg-white shadow" : ""}`}>Historial</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView("GRID")} className={`rounded-md p-2 ${view === "GRID" ? "bg-slate-800 text-white" : "bg-slate-100"}`}><LayoutGrid size={18} /></button>
          <button onClick={() => setView("TABLE")} className={`rounded-md p-2 ${view === "TABLE" ? "bg-slate-800 text-white" : "bg-slate-100"}`}><List size={18} /></button>
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
        <Search size={18} />
        <input
          className="w-full border-0 bg-transparent outline-none"
          placeholder="Buscar por orden, cliente o placa"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {filtered.length === 0 ? (
        <div className="mt-5 rounded-lg border border-dashed p-6 text-center text-slate-600">
          No hay órdenes para mostrar en esta vista.
          <div className="mt-2 text-xs text-slate-500">Debug: Taller ID {debug?.workshopId || "N/A"} | Total en DB {debug?.totalInDb ?? 0}</div>
        </div>
      ) : view === "GRID" ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order) => (
            <article key={order.id} className="rounded-xl bg-slate-50 p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-semibold">{order.number}</p>
              <p className="text-sm">{order.client?.fullName}</p>
              <p className="text-xs text-slate-600">{order.vehicle?.plate}</p>
              <p className="mt-2 text-xs">Estado: {order.status}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2">Orden</th>
                <th className="p-2">Cliente</th>
                <th className="p-2">Placa</th>
                <th className="p-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-2">{order.number}</td>
                  <td className="p-2">{order.client?.fullName}</td>
                  <td className="p-2">{order.vehicle?.plate}</td>
                  <td className="p-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
