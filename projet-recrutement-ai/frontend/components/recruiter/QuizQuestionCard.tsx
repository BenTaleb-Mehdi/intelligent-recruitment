"use client";

import React from "react";
import { Icon } from "@iconify/react";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
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
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 space-y-4">
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
            {question.options.map((opt, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onCorrectChange(question.id, optIndex)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    optIndex === question.correctAnswer
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                  title="Marquer comme bonne réponse"
                >
                  {optIndex === question.correctAnswer && (
                    <Icon icon="solar:check-circle-bold" className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => onOptionChange(question.id, optIndex, e.target.value)}
                  className={`flex-1 bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    optIndex === question.correctAnswer
                      ? "border-emerald-200/80 text-emerald-700 bg-emerald-50/50 focus:ring-emerald-500"
                      : "border-slate-200/80 text-slate-600 focus:ring-purple-600"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
