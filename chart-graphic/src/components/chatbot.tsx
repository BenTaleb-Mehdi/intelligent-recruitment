"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  isLink?: boolean;
  linkHref?: string;
  linkLabel?: string;
}

const suggestions = [
  { text: "Comment fonctionne l'IA ?", key: "ia" },
  { text: "Trouver un emploi Tech", key: "jobs" },
  { text: "Recruter des talents", key: "recruiter" },
  { text: "Où sont vos bureaux ?", key: "offices" },
];

const responses: Record<string, { text: string; linkLabel?: string; linkHref?: string }> = {
  ia: {
    text: "Notre IA de matching analyse les compétences, l'expérience, le salaire et la localisation des candidats pour les comparer aux critères des offres. Elle calcule un score de compatibilité précis pour éviter les mauvais recrutements !",
  },
  jobs: {
    text: "C'est très simple ! Vous pouvez consulter les offres d'emploi disponibles sur notre page Offres et postuler directement en créant votre profil candidat.",
    linkLabel: "Voir les Offres",
    linkHref: "/offres",
  },
  recruiter: {
    text: "Iksatech permet aux recruteurs de publier des offres, de filtrer automatiquement les CVs grâce à l'IA et d'envoyer des tests techniques automatisés.",
    linkLabel: "Espace Recruteur",
    linkHref: "/recruteurs",
  },
  offices: {
    text: "Nos bureaux principaux sont basés au Maroc, notamment à Casablanca (Marina) et Rabat (Agdal). Nous couvrons également de nombreuses offres en remote.",
    linkLabel: "Contactez-nous",
    linkHref: "/contact",
  },
  default: {
    text: "Je comprends ! Pour toute autre question ou demande d'assistance, n'hésitez pas à nous envoyer un message via notre page de contact.",
    linkLabel: "Aller au Contact",
    linkHref: "/contact",
  },
};

export default function Chatbot() {
  const pathname = usePathname() || "";

  // Hide chatbot on candidate or recruiter portal routes
  if (pathname.startsWith("/candidate") || pathname.startsWith("/recruiter")) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "bot",
      text: "Bonjour ! Je suis IksaBot 🤖. Comment puis-je vous aider aujourd'hui dans vos recherches tech ?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target as Node) &&
        (!buttonRef.current || !buttonRef.current.contains(event.target as Node))
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = (text: string, responseKey?: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      setIsTyping(false);
      const matchedKey = responseKey || Object.keys(responses).find((key) =>
        text.toLowerCase().includes(key) || text.toLowerCase().includes(responses[key].linkLabel?.toLowerCase() || "")
      ) || "default";

      const reply = responses[matchedKey] || responses.default;

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: reply.text,
          isLink: !!reply.linkHref,
          linkHref: reply.linkHref,
          linkLabel: reply.linkLabel,
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-50">
            <motion.button
              ref={buttonRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30 cursor-pointer border border-blue-500/20 relative"
              aria-label="Contacter l'assistant IA"
            >
              <Icon icon="solar:chat-round-dots-bold-duotone" className="w-6.5 h-6.5" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatbotRef}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[380px] h-[480px] bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 p-4 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                  <Icon icon="solar:stars-linear" className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wide">IksaBot Assistant</h4>
                  <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    En ligne · IA Active
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-350 hover:text-white transition-colors py-1 px-2.5 rounded-xl hover:bg-white/10 flex items-center gap-1.5 border border-white/10 text-[10px] font-bold uppercase tracking-wider"
              >
                <span>Fermer</span>
                <Icon icon="solar:close-circle-linear" className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-medium leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10"
                        : "bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.isLink && msg.linkHref && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-end">
                        <Link
                          href={msg.linkHref}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          {msg.linkLabel}
                          <Icon icon="solar:arrow-right-linear" className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Loader Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            {messages.length === 1 && !isTyping && (
              <div className="p-3 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => handleSend(s.text, s.key)}
                    className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer shadow-sm"
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-3 bg-white border-t border-slate-100 flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-400 transition"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-blue-500/10"
              >
                <Icon icon="solar:arrow-up-linear" className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
