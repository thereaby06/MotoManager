import { MoreVertical, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const categories = ["Chat Grupal", "Mensajes Privados", "Chats de Órdenes"];

export default function ChatPanel({ messages, onSend, onEdit, onDelete }) {
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState(categories[0]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="grid grid-cols-1 gap-4 rounded-xl bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-4">
      <aside className="rounded-lg bg-slate-100 p-3 lg:col-span-1">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelected(cat)} className={`mb-2 w-full rounded-md px-3 py-2 text-left text-sm ${selected === cat ? "bg-white shadow" : ""}`}>
            {cat}
          </button>
        ))}
      </aside>
      <div className="flex h-[26rem] flex-col rounded-lg border lg:col-span-3">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((msg) => (
            <article key={msg.id} className="rounded-lg bg-slate-50 p-3">
              <div className="mb-1 flex items-center justify-between">
                <strong className="text-sm">{msg.sender?.fullName || "Usuario"}</strong>
                <details className="relative">
                  <summary className="list-none cursor-pointer"><MoreVertical size={16} /></summary>
                  <div className="absolute right-0 mt-1 rounded-md border bg-white p-1 text-xs shadow">
                    <button onClick={() => onEdit(msg)} className="block w-full px-2 py-1 text-left">Editar</button>
                    <button onClick={() => onDelete(msg.id)} className="block w-full px-2 py-1 text-left text-red-600">Eliminar</button>
                  </div>
                </details>
              </div>
              <p className="text-sm">{msg.content}</p>
              {msg.isEdited && <span className="text-[10px] text-slate-500">editado</span>}
            </article>
          ))}
          <div ref={endRef} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!content.trim()) return;
            onSend(content.trim());
            setContent("");
          }}
          className="flex items-center gap-2 border-t p-3"
        >
          <input className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escribe un mensaje..." />
          <button className="rounded-lg bg-slate-900 p-2 text-white"><Send size={16} /></button>
        </form>
      </div>
    </section>
  );
}
