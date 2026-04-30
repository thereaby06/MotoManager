import { useEffect, useState } from "react";
import OrdersView from "./components/OrdersView";
import ChatPanel from "./components/ChatPanel";
import { useApi } from "./hooks/useApi";
import { useAuth } from "./context/AuthContext";

function App() {
  const api = useApi();
  const { user, workshop } = useAuth();
  const [ordersPayload, setOrdersPayload] = useState({ data: [], debug: {} });
  const [messages, setMessages] = useState([]);

  const loadOrders = async () => {
    const { data } = await api.get("/orders");
    setOrdersPayload(data);
  };

  const loadMessages = async () => {
    const { data } = await api.get("/chat");
    setMessages(data);
  };

  useEffect(() => {
    loadOrders().catch(() => {});
    loadMessages().catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-3 sm:p-5 md:p-6 lg:p-8">
      <header className="rounded-xl bg-slate-900 p-4 text-white sm:p-6">
        <h1 className="m-0 text-xl font-semibold sm:text-2xl">MotoManager Suite</h1>
        <p className="mt-2 text-sm text-slate-300">
          Taller: {workshop?.name || "No definido"} | Usuario: {user?.fullName || "No autenticado"}
        </p>
      </header>
      <OrdersView orders={ordersPayload.data} debug={ordersPayload.debug} />
      <ChatPanel
        messages={messages}
        onSend={async (content) => {
          await api.post("/chat", { content });
          loadMessages();
        }}
        onEdit={async (msg) => {
          const content = window.prompt("Editar mensaje", msg.content);
          if (!content) return;
          await api.patch(`/chat/${msg.id}`, { content });
          loadMessages();
        }}
        onDelete={async (id) => {
          await api.delete(`/chat/${id}`);
          loadMessages();
        }}
      />
    </main>
  );
}

export default App;
