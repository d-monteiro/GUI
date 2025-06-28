import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import type { BackendPacket } from "@/store/types";

export function useWebSocket() {
  const handleBackendPacket = useStore((s) => s.handleBackendPacket);
  const setConnectionStatus = useStore((s) => s.setConnectionStatus);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    setConnectionStatus("connecting");
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus("connected");
    };
    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setConnectionStatus("disconnected");
    };
    ws.onerror = (e) => {
      console.error("WebSocket error", e);
      setConnectionStatus("disconnected");
    };

    ws.onmessage = (event) => {
      const packet: BackendPacket = JSON.parse(event.data);
      handleBackendPacket(packet);
    };

    return () => {
      ws.close();
    };
  }, [handleBackendPacket, setConnectionStatus]);

  // Function to send a message to the backend
  const send = (data: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("query:", JSON.stringify(data));
      wsRef.current.send(JSON.stringify(data));
    }
  };

  return { send };
}