"use client";

import React, { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { Icon } from "@iconify/react";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";

interface Message {
  _id?: string;
  applicationId: string;
  senderId: string;
  senderRole: "CANDIDATE" | "RECRUITER";
  senderName: string;
  content: string;
  createdAt: string;
  read?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
}

interface ChatBoxProps {
  applicationId: string;
  currentUserId: string;
  currentUserRole: "CANDIDATE" | "RECRUITER";
  currentUserName: string;
  otherUserName?: string;
  otherUserLogo?: string;
  onMessageSent?: (content: string) => void;
}

export default function ChatBox({
  applicationId,
  currentUserId,
  currentUserRole,
  currentUserName,
  otherUserName = "Correspondant",
  otherUserLogo,
  onMessageSent,
}: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const onMessageSentRef = useRef(onMessageSent);

  useEffect(() => {
    onMessageSentRef.current = onMessageSent;
  }, [onMessageSent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markConversationAsRead = async () => {
    if (!applicationId) return;
    try {
      await api.put(`/api/messages/read/${applicationId}`, { role: currentUserRole });
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  useEffect(() => {
    setMessages([]);

    // Fetch chat history from backend MongoDB & mark as read
    const fetchHistory = async () => {
      try {
        const res = await api.get<{ success: boolean; data: Message[] }>(
          `/api/messages/${applicationId}`
        );
        if (res?.data) {
          setMessages(res.data);
          markConversationAsRead();
        }
      } catch (err) {
        console.error("Error fetching message history:", err);
      }
    };

    if (applicationId) {
      fetchHistory();
    }

    const socket = getSocket();
    socketRef.current = socket;

    setConnected(socket.connected);

    const handleConnect = () => {
      setConnected(true);
      if (applicationId) {
        socket.emit("join_room", applicationId);
      }
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleReceiveMessage = (newMessage: Message) => {
      setMessages((prev) => {
        const index = prev.findIndex((m) => m._id && m._id === newMessage._id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = newMessage;
          return updated;
        }
        return [...prev, newMessage];
      });
      if (newMessage.senderRole !== currentUserRole) {
        markConversationAsRead();
      }
      if (onMessageSentRef.current) {
        onMessageSentRef.current(newMessage.content);
      }
    };

    const handleEditedMessage = (editedMsg: Message) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === editedMsg._id ? editedMsg : m))
      );
    };

    const handleDeletedMessage = (deletedMsg: Message) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === deletedMsg._id ? deletedMsg : m))
      );
    };

    const handleMessagesRead = (data: { applicationId: string }) => {
      if (data.applicationId === applicationId) {
        setMessages((prev) =>
          prev.map((m) => (m.senderRole === currentUserRole ? { ...m, read: true } : m))
        );
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_edited", handleEditedMessage);
    socket.on("message_deleted", handleDeletedMessage);
    socket.on("messages_read", handleMessagesRead);

    if (socket.connected && applicationId) {
      socket.emit("join_room", applicationId);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_edited", handleEditedMessage);
      socket.off("message_deleted", handleDeletedMessage);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [applicationId, currentUserRole]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const content = inputMessage.trim();
    setInputMessage("");

    const messageData = {
      applicationId,
      senderId: currentUserId,
      senderRole: currentUserRole,
      senderName: currentUserName,
      content,
    };

    // Save message to MongoDB via REST API endpoint (backend will broadcast via Socket.IO)
    try {
      const res = await api.post<{ success: boolean; data: Message }>(
        "/api/messages",
        messageData
      );
      if (res?.data) {
        setMessages((prev) => {
          if (prev.some((m) => m._id && m._id === res.data._id)) return prev;
          return [...prev, res.data];
        });
        if (onMessageSentRef.current) {
          onMessageSentRef.current(content);
        }
      }
    } catch (err) {
      console.error("Error saving message to MongoDB via REST API:", err);
    }
  };

  const handleStartEdit = (msg: Message) => {
    const targetId = msg._id || (msg as any).id;
    if (!targetId || msg.isDeleted) return;
    setEditingId(targetId);
    setEditingText(msg.content);
  };

  const handleSaveEdit = async (msgId: string) => {
    if (!editingText.trim()) return;

    const updatedText = editingText.trim();
    setEditingId(null);

    try {
      const res = await api.put<{ success: boolean; data: Message }>(
        `/api/messages/${msgId}`,
        { content: updatedText }
      );
      if (res?.data) {
        setMessages((prev) =>
          prev.map((m) => ((m._id && m._id === msgId) || (m as any).id === msgId ? res.data : m))
        );
      }
    } catch (err) {
      console.error("Error saving edited message:", err);
    }
  };

  const handleDeleteMessage = (msgId: string) => {
    setDeleteConfirmId(msgId);
  };

  const confirmDeleteMessage = async (msgId: string) => {
    try {
      const res = await api.delete<{ success: boolean; data: Message }>(
        `/api/messages/${msgId}`
      );
      if (res?.data) {
        setMessages((prev) =>
          prev.map((m) => ((m._id && m._id === msgId) || (m as any).id === msgId ? res.data : m))
        );
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    const clean = name.replace(/\(.*\)/g, "").trim();
    const parts = clean.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-[520px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            {otherUserLogo ? (
              <img
                src={otherUserLogo}
                alt={otherUserName}
                className="w-10 h-10 rounded-full object-cover shadow border border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow">
                {getInitials(otherUserName)}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                connected ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800">{otherUserName}</h4>
            <p className="text-xs text-slate-400">
              {connected ? "En ligne" : "Connexion en cours..."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-100">
            Discussion Directe
          </span>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <Icon icon="solar:chat-round-dots-bold-duotone" className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium">Aucun message pour le moment</p>
            <p className="text-xs max-w-xs">
              Démarrez la conversation avec {otherUserName} dès maintenant.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            const msgId = msg._id || (msg as any).id;
            const isEditingThis = Boolean(msgId && editingId === msgId);

            return (
              <div
                key={msgId || index}
                className={`group flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 max-w-[85%] relative">
                  {/* Action buttons on hover for sender */}
                  {isMe && !msg.isDeleted && msgId && !isEditingThis && (
                    <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-0.5 bg-white border border-slate-200/90 shadow-xs rounded-xl p-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(msg)}
                        title="Éditer le message"
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Icon icon="solar:pen-2-linear" className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msgId)}
                        title="Supprimer le message"
                        className="p-1 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Icon icon="solar:trash-bin-trash-linear" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Message content bubble or Inline Edit input */}
                  {isEditingThis ? (
                    <div className="flex items-center gap-1.5 bg-white p-2 rounded-2xl border border-blue-400 shadow-sm w-full">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="text-sm px-3 py-1 bg-slate-50 rounded-xl flex-1 focus:outline-none text-slate-800 border border-slate-200"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(msgId);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(msgId)}
                        className="p-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
                        title="Enregistrer"
                      >
                        <Icon icon="solar:check-circle-bold" className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-1.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Annuler"
                      >
                        <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm ${
                        msg.isDeleted
                          ? "bg-slate-100 text-slate-400 border border-slate-200/60 italic flex items-center gap-1.5"
                          : isMe
                          ? "bg-blue-600 text-white rounded-br-none shadow-sm"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs"
                      }`}
                    >
                      {msg.isDeleted ? (
                        <div className="flex items-center gap-1.5">
                          <Icon icon="solar:trash-bin-minimalistic-linear" className="w-4 h-4 shrink-0 text-slate-400" />
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Subtitle details OUTSIDE message bubble */}
                <div className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1.5">
                  {msg.senderName && !isMe ? `${msg.senderName} • ` : ""}
                  <span>
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {msg.isEdited && !msg.isDeleted && (
                    <span className="text-[9px] text-blue-500 font-medium italic bg-blue-50 px-1.5 py-0.5 rounded">
                      (édité)
                    </span>
                  )}
                  {isMe && !msg.isDeleted && (
  <span
    title={msg.read ? "Message lu par le destinataire" : "Message non lu"}
    className="ml-0.5 inline-flex items-center"
  >
    {msg.read ? (
      <Icon 
        icon="solar:check-read-linear" 
        className="w-4 h-4 text-[#53bdeb]" 
      />
    ) : (
      <Icon 
        icon="solar:check-read-linear" 
        className="w-4 h-4 text-slate-400" 
      />
    )}
  </span>
)}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-slate-100 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Écrire un message à ${otherUserName}...`}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center disabled:cursor-not-allowed"
        >
          <Icon icon="solar:plain-bold" className="w-5 h-5" />
        </button>
      </form>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150 font-sans">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-slate-800">Supprimer le message ?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ce message sera remplacé par "Ce message a été supprimé" pour tous les participants.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = deleteConfirmId;
                  setDeleteConfirmId(null);
                  if (id) confirmDeleteMessage(id);
                }}
                className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
