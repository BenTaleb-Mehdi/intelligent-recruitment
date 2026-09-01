"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";

export function useUnreadMessages(role: "RECRUITER" | "CANDIDATE") {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get<{ success: boolean; count: number }>(
        `/api/messages/unread-count?role=${role}`
      );
      if (typeof res?.count === "number") {
        setUnreadCount(res.count);
      }
    } catch (err) {
      console.error("Error fetching unread message count:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const socket = getSocket();

    const handleUpdate = () => {
      fetchUnreadCount();
    };

    socket.on("conversation_updated", handleUpdate);
    socket.on("receive_message", handleUpdate);

    return () => {
      socket.off("conversation_updated", handleUpdate);
      socket.off("receive_message", handleUpdate);
    };
  }, [role]);

  return { unreadCount, refreshUnread: fetchUnreadCount };
}
