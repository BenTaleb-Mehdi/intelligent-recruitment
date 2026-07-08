"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface SkillsTagInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
}

export default function SkillsTagInput({
  skills,
  onChange,
  placeholder = "Saisissez une compétence (ex: React) et appuyez sur Entrée...",
}: SkillsTagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addSkill = (skill: string) => {
    const cleaned = skill.trim();
    if (!cleaned) return;
    
    // Prevent duplicates (case-insensitive checking)
    if (skills.some((s) => s.toLowerCase() === cleaned.toLowerCase())) {
      setInputValue("");
      return;
    }

    onChange([...skills, cleaned]);
    setInputValue("");
  };

  const removeSkill = (indexToRemove: number) => {
    onChange(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  return (
    <div className="space-y-2.5 font-sans">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Compétences & Mots-clés requis (Matching IA)
      </label>
      
      {/* Input container wrapper */}
      <div className="w-full min-h-[100px] bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-3 focus-within:bg-white dark:focus-within:bg-zinc-950 focus-within:ring-1 focus-within:ring-blue-600/80 transition-all">
        {/* Render Active Skill Badges */}
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100/80 px-2.5 py-1 rounded-lg text-xs font-semibold select-none animate-fade-in dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="hover:text-blue-950 dark:hover:text-blue-300 transition-colors focus:outline-none"
              >
                <Icon icon="solar:close-circle-linear" className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {/* Text Input inside the box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addSkill(inputValue)}
            placeholder={skills.length === 0 ? placeholder : "Ajouter une compétence..."}
            className="flex-1 bg-transparent border-none outline-none text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 p-0 focus:ring-0"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => addSkill(inputValue)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              Ajouter
            </button>
          )}
        </div>
      </div>
      
      <p className="text-[11px] text-slate-400">
        Appuyez sur <kbd className="px-1 py-0.5 bg-slate-100 rounded border border-slate-200 text-[10px] font-semibold dark:bg-zinc-800 dark:border-zinc-700">Entrée</kbd> ou <kbd className="px-1 py-0.5 bg-slate-100 rounded border border-slate-200 text-[10px] font-semibold dark:bg-zinc-800 dark:border-zinc-700">,</kbd> pour valider un tag. Ces compétences sont directement indexées par l'IA de recrutement.
      </p>
    </div>
  );
}
