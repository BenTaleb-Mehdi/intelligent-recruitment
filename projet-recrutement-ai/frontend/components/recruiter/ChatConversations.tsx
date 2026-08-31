"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import type { Conversation } from "@/lib/chat";

interface ChatConversationsProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function ChatConversations({
  conversations,
  activeId,
  onSelect,
}: ChatConversationsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = conversations.filter((c) =>
    c.candidateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-100 bg-white">
        <h2 className="text-sm font-bold text-slate-800">Messages</h2>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Icon
            icon="solar:magnifer-linear"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Rechercher ou démarrer une conversation"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
              activeId === conv.id ? "bg-blue-50/70" : ""
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {conv.candidateImage || conv.logo || conv.image ? (
                <img
                  src={conv.candidateImage || conv.logo || conv.image}
                  alt={conv.candidateName}
                  className="w-11 h-11 rounded-full object-cover shadow-sm border border-slate-200"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold select-none shadow-sm">
                  {conv.candidateAvatar}
                </div>
              )}
              {conv.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-400 border-2 border-white rounded-full" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-slate-800 truncate">
                  {conv.candidateName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
                  {conv.lastTime}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                {conv.lastMessage}
              </p>
            </div>

            {/* Unread badge */}
            {conv.unread > 0 && (
              <span className="flex-shrink-0 mt-0.5 w-4.5 h-4.5 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
                {conv.unread}
              </span>
            )}
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Icon icon="solar:chat-round-linear" className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs text-slate-400 font-semibold">Aucune conversation trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
