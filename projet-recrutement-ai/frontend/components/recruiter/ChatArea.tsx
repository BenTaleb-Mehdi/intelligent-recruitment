"use client";

import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import type { Conversation } from "@/lib/chat";

interface ChatAreaProps {
  conversation: Conversation;
}

export default function ChatArea({ conversation }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white relative">
      {/* Fixed header — outside the scroll container */}
      <div className="shrink-0 px-4 py-2.5 bg-white border-b border-slate-200 flex items-center gap-3 shadow-sm">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold select-none shadow-sm">
            {conversation.candidateAvatar}
          </div>
          {conversation.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-400 border-2 border-white rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 truncate">
            {conversation.candidateName}
          </h3>
          <p className="text-[10px] text-blue-600 font-medium">
            {conversation.online ? "En ligne" : "Hors ligne"}
          </p>
        </div>
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors">
          <Icon icon="solar:menu-dots-vertical-linear" className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable messages only */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="px-4 py-3 space-y-1">
          {conversation.messages.map((msg) => {
            const isMine = msg.sender === "recruiter";
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                  <div
                    className={`max-w-[75%] px-3 py-1.5 rounded-lg text-xs leading-relaxed shadow-sm ${
                      isMine
                        ? "bg-[#dbeafe] text-slate-800 rounded-br-sm"
                        : "bg-slate-50 text-slate-800 rounded-bl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-0.5 mt-0.5 ${
                      isMine ? "text-blue-400" : "text-slate-400"
                    }`}>
                    <span className="text-[9px]">{msg.time}</span>
                    {isMine && (
                      <Icon icon="solar:check-read-linear" className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
