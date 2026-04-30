import { useEffect, useState } from "react";
import ChatPanel from "../components/ChatPanel";
import OrdersView from "../components/OrdersView";
import { useApi } from "../hooks/useApi";

export default function Dashboard() {
  const api = useApi();
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
    <div className="space-y-4">
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
    </div>
  );
}
