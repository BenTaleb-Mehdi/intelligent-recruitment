"use client";

import React, { useState, useCallback } from "react";
import ChatConversations from "@/components/recruiter/ChatConversations";
import ChatArea from "@/components/recruiter/ChatArea";
import ChatInput from "@/components/recruiter/ChatInput";
import messagesData from "@/data/messages.json";
import type { Conversation, Message } from "@/lib/chat";

export type { Conversation, Message };

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

const initialConversations: Conversation[] = messagesData.conversations as Conversation[];

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? "");
  const [showConversations, setShowConversations] = useState(true);

  const activeConv = conversations.find((c) => c.id === activeId) ?? conversations[0];

  const handleSend = useCallback(
    (text: string) => {
      if (!activeConv) return;
      const newMsg: Message = {
        id: generateId(),
        sender: "recruiter",
        text,
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                messages: [...c.messages, newMsg],
                lastMessage: text,
                lastTime: "À l'instant",
                unread: 0,
              }
            : c
        )
      );
    },
    [activeId, activeConv]
  );

  const handleSelect = (id: string) => {
    setActiveId(id);
    setShowConversations(false);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="h-full flex flex-col font-sans overflow-hidden">
      {/* Mobile back button */}
      {!showConversations && (
        <div className="md:hidden flex items-center px-3 py-2 bg-white border-b border-slate-200 gap-2">
          <button
            onClick={() => setShowConversations(true)}
            className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold">
              {activeConv?.candidateAvatar ?? ""}
            </div>
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                {totalUnread}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-800">{activeConv?.candidateName}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200/70">
        {/* Left panel - conversations list */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200/70 flex-shrink-0 ${
            showConversations ? "flex" : "hidden md:flex"
          } flex-col bg-white overflow-hidden`}
        >
          <ChatConversations
            conversations={conversations}
            activeId={activeId}
            onSelect={handleSelect}
          />
        </div>

        {/* Right panel - chat area */}
        <div
          className={`flex-1 flex flex-col bg-white ${
            showConversations ? "hidden md:flex" : "flex"
          }`}
        >
          {activeConv ? (
            <>
              <ChatArea conversation={activeConv} />
              <ChatInput onSend={handleSend} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-slate-600 mb-1">Messagerie SmartRecruit</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Sélectionnez une conversation pour commencer à discuter avec vos candidats.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
