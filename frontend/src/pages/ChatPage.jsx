import { useEffect, useState } from "react";
import ChatPanel from "../components/ChatPanel";
import { useApi } from "../hooks/useApi";

export default function ChatPage() {
  const api = useApi();
  const [messages, setMessages] = useState([]);

  const loadMessages = async () => {
    const { data } = await api.get("/chat");
    setMessages(data);
  };

  useEffect(() => {
    loadMessages().catch(() => {});
  }, []);

  return (
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
  );
}
