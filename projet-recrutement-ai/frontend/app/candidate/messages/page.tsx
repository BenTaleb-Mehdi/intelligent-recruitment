"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import ChatBox from "@/components/chat/ChatBox";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { CandidateConversation } from "@/lib/candidateChat";

function formatDisplayName(name: string, company?: string) {
  if (!name) return company || "Recruteur";
  if (!company) return name;
  const cleanName = name.trim();
  const cleanCompany = company.trim();
  if (cleanName.toLowerCase().includes(cleanCompany.toLowerCase())) {
    return cleanName;
  }
  return `${cleanName} (${cleanCompany})`;
}

function CandidateMessagesContent() {
  const searchParams = useSearchParams();
  const initialAppId = searchParams ? searchParams.get("appId") : null;
  const initialCompany = searchParams ? searchParams.get("company") : null;
  const initialRole = searchParams ? searchParams.get("role") : null;

  const [conversations, setConversations] = useState<CandidateConversation[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConversationsMobile, setShowConversationsMobile] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [draftJob, setDraftJob] = useState<{
    id: string;
    company: string;
    role: string;
  } | null>(null);

  const loadConversationsFromMongo = async () => {
    try {
      const res = await api.get<{ success: boolean; data: CandidateConversation[] }>(
        "/api/messages/conversations/candidate"
      );
      if (res?.data) {
        setConversations(res.data);
        return res.data;
      }
    } catch (err) {
      console.error("Error fetching candidate conversations from MongoDB:", err);
    }
    return [];
  };

  useEffect(() => {
    loadConversationsFromMongo().then((data) => {
      if (initialAppId && initialCompany) {
        const existing = data.find(
          (c) => c.applicationId === initialAppId || c.id === initialAppId
        );
        if (existing) {
          setActiveId(existing.id);
        } else {
          setDraftJob({
            id: initialAppId,
            company: initialCompany,
            role: initialRole || "Poste recommandé",
          });
          setActiveId(initialAppId);
        }
        setShowConversationsMobile(false);
      } else if (data.length > 0) {
        setActiveId(data[0].id);
      }
      setIsLoaded(true);
    });

    const socket = getSocket();
    const handleUpdate = () => {
      loadConversationsFromMongo();
    };

    socket.on("conversation_updated", handleUpdate);

    return () => {
      socket.off("conversation_updated", handleUpdate);
    };
  }, [initialAppId, initialCompany, initialRole]);

  const activeConv: CandidateConversation | null =
    conversations.find((c) => c.id === activeId || c.applicationId === activeId) ||
    (draftJob && draftJob.id === activeId
      ? {
          id: draftJob.id,
          applicationId: draftJob.id,
          companyName: draftJob.company,
          recruiterName: `Recruteur (${draftJob.company})`,
          role: draftJob.role,
          avatar: (draftJob.company || "RE").slice(0, 2).toUpperCase(),
          lastMessage: "Aucun message envoyé",
          lastTime: "Maintenant",
        }
      : null);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setShowConversationsMobile(false);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.recruiterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoaded) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col font-sans overflow-hidden">
      {/* Mobile navigation header when chatting */}
      {!showConversationsMobile && activeConv && (
        <div className="md:hidden flex items-center px-4 py-2.5 bg-white border-b border-slate-200 gap-3 shrink-0">
          <button
            onClick={() => setShowConversationsMobile(true)}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            {activeConv.avatar}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">{activeConv.recruiterName}</h4>
            <p className="text-[10px] text-slate-500">{activeConv.companyName}</p>
          </div>
        </div>
      )}

      {/* Main split view container */}
      <div className="flex-1 flex overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200/80">
        {/* Left Sidebar - Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200/80 flex-shrink-0 ${
            showConversationsMobile ? "flex" : "hidden md:flex"
          } flex-col bg-white overflow-hidden`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-white">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Icon icon="solar:chat-round-dots-bold" className="w-5 h-5 text-blue-600" />
              Messagerie Recruteurs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recruteurs avec qui vous avez un échange de message.
            </p>
          </div>

          {/* Search Box */}
          {conversations.length > 0 && (
            <div className="p-3 bg-slate-50/50 border-b border-slate-100">
              <div className="relative">
                <Icon
                  icon="solar:magnifer-linear"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Rechercher une entreprise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Conversation List or Empty State */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {filteredConversations.map((conv) => {
                  const isSelected = activeId === conv.id || activeId === conv.applicationId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelect(conv.id)}
                      className={`w-full flex items-start gap-3 p-3.5 text-left transition-all hover:bg-slate-50 ${
                        isSelected ? "bg-blue-50/70 border-l-4 border-blue-600" : ""
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {conv.avatar}
                        </div>
                        {conv.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {conv.companyName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">
                            {conv.lastTime}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600 truncate mt-0.5">
                          {conv.recruiterName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                          {conv.lastMessage}
                        </p>
                      </div>

                      {conv.unread && conv.unread > 0 ? (
                        <span className="shrink-0 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {conv.unread}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Icon icon="solar:chat-square-call-linear" className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">Aucune conversation</h4>
                <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed mb-4">
                  Seuls les recruteurs avec qui vous avez échangé un message s'affichent ici.
                </p>
                <Link
                  href="/candidate/jobs"
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Icon icon="solar:case-linear" className="w-4 h-4" />
                  Explorer le Feed d'offres
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Main Panel - Realtime ChatBox */}
        <div
          className={`flex-1 flex flex-col bg-white ${
            showConversationsMobile ? "hidden md:flex" : "flex"
          }`}
        >
          {activeConv ? (
            <ChatBox
              key={activeConv.applicationId || activeConv.id}
              applicationId={activeConv.applicationId || activeConv.id}
              currentUserId="candidate-1"
              currentUserRole="CANDIDATE"
              currentUserName="Mehdi Ben Taleb"
              otherUserName={formatDisplayName(activeConv.recruiterName, activeConv.companyName)}
              onMessageSent={() => {
                loadConversationsFromMongo();
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <Icon icon="solar:chat-round-dots-bold" className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Messagerie Recruteurs SmartRecruit</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Seules vos conversations actives avec des messages envoyés s'affichent ici. Vous n'avez aucun échange en cours pour le moment.
                </p>
                <Link
                  href="/candidate/jobs"
                  className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                >
                  <Icon icon="solar:letter-linear" className="w-4 h-4" />
                  Contacter un recruteur depuis le Feed d'offres
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CandidateMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <CandidateMessagesContent />
    </Suspense>
  );
}
