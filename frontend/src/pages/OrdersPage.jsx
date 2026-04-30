import { useEffect, useState } from "react";
import OrdersView from "../components/OrdersView";
import { useApi } from "../hooks/useApi";

export default function OrdersPage() {
  const api = useApi();
  const [payload, setPayload] = useState({ data: [], debug: {} });

  useEffect(() => {
    api.get("/orders")
      .then(({ data }) => setPayload(data))
      .catch(() => setPayload({ data: [], debug: { workshopId: "N/A", totalInDb: 0 } }));
  }, []);

  return <OrdersView orders={payload.data} debug={payload.debug} />;
}
