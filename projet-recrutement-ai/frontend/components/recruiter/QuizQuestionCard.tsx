"use client";

import React from "react";
import { Icon } from "@iconify/react";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number | number[];
}

export interface QuizQuestionCardProps {
  question: QuizQuestion;
  index: number;
  onQuestionChange: (qId: string, value: string) => void;
  onOptionChange: (qId: string, optIndex: number, value: string) => void;
  onCorrectChange: (qId: string, optIndex: number) => void;
}

export default function QuizQuestionCard({
  question,
  index,
  onQuestionChange,
  onOptionChange,
  onCorrectChange,
}: QuizQuestionCardProps) {
  const correctArr = Array.isArray(question.correctAnswer)
    ? question.correctAnswer
    : [question.correctAnswer];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 space-y-4 font-sans">
      <div className="flex items-start gap-3">
        <span className="w-7 h-7 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 select-none">
          {index + 1}
        </span>
        <div className="flex-1 space-y-3">
          <textarea
            value={question.question}
            onChange={(e) => onQuestionChange(question.id, e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-600 transition-all resize-none"
            rows={2}
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              <span>Options de réponse</span>
              <span className={correctArr.length > 1 ? "text-purple-600 font-bold" : "text-emerald-600 font-semibold"}>
                {correctArr.length > 1 ? `${correctArr.length} Réponses Cochées (Choix Multiple)` : "1 Réponse Cochée"}
              </span>
            </div>
            {question.options.map((opt, optIndex) => {
              const isCorrect = correctArr.includes(optIndex);

              return (
                <div key={optIndex} className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onCorrectChange(question.id, optIndex)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                      isCorrect
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-sm scale-105"
                        : "border-slate-300 hover:border-slate-400 bg-white"
                    }`}
                    title={isCorrect ? "Réponse exacte (Cochée)" : "Cocher comme réponse exacte"}
                  >
                    {isCorrect && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => onOptionChange(question.id, optIndex, e.target.value)}
                    className={`flex-1 bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                      isCorrect
                        ? "border-emerald-200 text-emerald-700 bg-emerald-50/40 focus:ring-emerald-500 font-semibold"
                        : "border-slate-200/80 text-slate-600 focus:ring-purple-600"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
