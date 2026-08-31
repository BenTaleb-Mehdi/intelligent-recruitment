"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { io } from "socket.io-client";
import ChatConversations from "@/components/recruiter/ChatConversations";
import ChatBox from "@/components/chat/ChatBox";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { RecruiterConversation } from "@/lib/recruiterChat";
import type { Conversation } from "@/lib/chat";

function RecruiterMessagesContent() {
  const searchParams = useSearchParams();
  const initialCandidateId = searchParams ? searchParams.get("appId") || searchParams.get("candidateId") : null;
  const initialCandidateName = searchParams ? searchParams.get("candidateName") : null;
  const initialCandidateTitle = searchParams ? searchParams.get("candidateTitle") : null;

  const [conversations, setConversations] = useState<RecruiterConversation[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [showConversations, setShowConversations] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [draftCandidate, setDraftCandidate] = useState<{
    id: string;
    name: string;
    title: string;
  } | null>(null);

  const loadConversationsFromMongo = async () => {
    try {
      const res = await api.get<{ success: boolean; data: RecruiterConversation[] }>(
        "/api/messages/conversations/recruiter"
      );
      if (res?.data) {
        setConversations(res.data);
        return res.data;
      }
    } catch (err) {
      console.error("Error fetching recruiter conversations from MongoDB:", err);
    }
    return [];
  };

  useEffect(() => {
    loadConversationsFromMongo().then((data) => {
      if (initialCandidateId && initialCandidateName) {
        const existing = data.find(
          (c) => c.candidateId === initialCandidateId || c.id === initialCandidateId
        );
        if (existing) {
          setActiveId(existing.id);
        } else {
          setDraftCandidate({
            id: initialCandidateId,
            name: initialCandidateName,
            title: initialCandidateTitle || "Postulant",
          });
          setActiveId(initialCandidateId);
        }
        setShowConversations(false);
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
  }, [initialCandidateId, initialCandidateName, initialCandidateTitle]);

  const activeConv: RecruiterConversation | null =
    conversations.find((c) => c.id === activeId || c.candidateId === activeId) ||
    (draftCandidate && draftCandidate.id === activeId
      ? {
          id: draftCandidate.id,
          candidateId: draftCandidate.id,
          candidateName: draftCandidate.name,
          candidateAvatar: (draftCandidate.name || "CA")
            .split(" ")
            .map((n) => n[0] || "")
            .join("")
            .toUpperCase()
            .slice(0, 2),
          candidateTitle: draftCandidate.title,
        }
      : null);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setShowConversations(false);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);

  // Adapt to Conversation[] for ChatConversations component compatibility
  const chatConversationsList: Conversation[] = conversations.map((c) => ({
    id: c.id,
    candidateId: c.candidateId,
    candidateName: c.candidateName,
    candidateAvatar: c.candidateAvatar,
    candidateTitle: c.candidateTitle,
    candidateImage: c.candidateImage,
    logo: c.logo,
    image: c.image,
    lastMessage: c.lastMessage || "Échange démarré",
    lastTime: c.lastTime || "Aujourd'hui",
    unread: c.unread || 0,
    online: c.online !== undefined ? c.online : true,
    messages: [],
  }));

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col font-sans overflow-hidden">
      {/* Mobile header */}
      {!showConversations && activeConv && (
        <div className="md:hidden flex items-center px-3 py-2 bg-white border-b border-slate-200 gap-2 shrink-0">
          <button
            onClick={() => setShowConversations(true)}
            className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" className="w-5 h-5" />
          </button>
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">
              {activeConv.candidateAvatar}
            </div>
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                {totalUnread}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-800">{activeConv.candidateName}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200/70">
        {/* Left panel - conversations list */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200/70 flex-shrink-0 ${
            showConversations ? "flex" : "hidden md:flex"
          } flex-col bg-white overflow-hidden`}
        >
          {conversations.length > 0 ? (
            <ChatConversations
              conversations={chatConversationsList}
              activeId={activeId}
              onSelect={handleSelect}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Icon icon="solar:chat-square-call-linear" className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Aucune conversation</h4>
              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed mb-4">
                Seuls les candidats avec qui vous avez échangé un message s'affichent ici.
              </p>
              <Link
                href="/recruiter/jobs"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Icon icon="solar:case-linear" className="w-4 h-4" />
                Voir mes Offres & Candidats
              </Link>
            </div>
          )}
        </div>

        {/* Right panel - real-time chat area */}
        <div
          className={`flex-1 flex flex-col bg-white ${
            showConversations ? "hidden md:flex" : "flex"
          }`}
        >
          {activeConv ? (
            <ChatBox
              key={activeConv.applicationId || activeConv.candidateId || activeConv.id}
              applicationId={activeConv.applicationId || activeConv.candidateId || activeConv.id}
              currentUserId="recruiter-1"
              currentUserRole="RECRUITER"
              currentUserName="Recruteur"
              otherUserName={activeConv.candidateName}
              otherUserLogo={activeConv.candidateImage || activeConv.logo || activeConv.image}
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
                  href="/recruiter/jobs"
                  className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                >
                  <Icon icon="solar:users-group-two-rounded-linear" className="w-4 h-4" />
                  Contacter un candidat depuis vos Offres
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <RecruiterMessagesContent />
    </Suspense>
  );
}
