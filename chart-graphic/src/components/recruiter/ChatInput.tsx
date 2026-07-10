"use client";

import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";

interface ChatInputProps {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = () => {
    fileRef.current?.click();
  };

  return (
    <div className="relative z-10 px-3 py-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
      {/* File upload button */}
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onSend(`📎 ${file.name}`);
          }
        }}
      />
      <button
        onClick={handleFileUpload}
        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
        title="Joindre un fichier"
      >
        <Icon icon="solar:file-linear" className="w-5 h-5" />
      </button>

      {/* Input */}
      <div className="flex-1 bg-white rounded-lg border border-slate-200/80 flex items-center px-3 py-1 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-300 transition-all">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tapez un message..."
          className="flex-1 text-xs text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent py-1.5"
        />
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className={`p-2 rounded-full transition-all flex-shrink-0 ${
          text.trim()
            ? "bg-blue-500 text-white shadow-sm hover:bg-blue-600 active:scale-95"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        <Icon icon="solar:plain-linear" className="w-4 h-4" />
      </button>
    </div>
  );
}
