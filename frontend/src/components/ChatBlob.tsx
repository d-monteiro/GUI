import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";

export function ChatBlob() {
  const chatHistory = useStore((s) => s.chatHistory);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Show notification for 10 seconds when a new message arrives
  useEffect(() => {
    if (chatHistory.length === 0) return;

    const lastMsg = chatHistory[chatHistory.length - 1]?.content;
    setNotificationMsg(lastMsg);
    setShowNotification(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowNotification(false), 10000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [chatHistory]);

  // Always show the chat blob (could be a button or minimized chat)
  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button className="bg-[#222] text-[#affddb] px-4 py-3 rounded-full shadow-lg hover:bg-[#333] transition">
          💬
        </button>
      </div>
      {showNotification && notificationMsg && (
        <div className="fixed bottom-20 right-6 z-50 max-w-xs bg-black/90 text-[#affddb] px-4 py-3 rounded-xl shadow-lg animate-fade-in">
          <span>{notificationMsg}</span>
        </div>
      )}
    </>
  );
}