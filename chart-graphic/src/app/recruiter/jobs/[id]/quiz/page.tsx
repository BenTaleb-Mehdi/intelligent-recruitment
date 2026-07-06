"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizData {
  jobTitle: string;
  status: "En attente" | "Validé" | "Refusé";
  aiGeneratedAt: string;
  questions: QuizQuestion[];
}

const QUIZZES_DB: Record<string, QuizData> = {
  "1": {
    jobTitle: "Développeur Fullstack Node/Next.js",
    status: "En attente",
    aiGeneratedAt: "28 Juin 2026 à 14:32",
    questions: [
      {
        id: "q1",
        question: "En Next.js 14+ avec App Router, comment définir une route dynamique pour un profil utilisateur ?",
        options: [
          "pages/profile/[id].tsx",
          "app/profile/[id]/page.tsx",
          "app/profile/$id/page.tsx",
          "app/profile/:id/page.tsx",
        ],
        correctAnswer: 1,
      },
      {
        id: "q2",
        question: "Quelle est la différence entre un Server Component et un Client Component en Next.js ?",
        options: [
          "Les Server Components sont plus lents au chargement initial",
          "Les Client Components s'exécutent uniquement côté serveur",
          "Les Server Components sont rendus sur le serveur et envoient uniquement le HTML au client",
          "Il n'y a aucune différence",
        ],
        correctAnswer: 2,
      },
      {
        id: "q3",
        question: "Dans PostgreSQL, quelle est la différence entre `INNER JOIN` et `LEFT JOIN` ?",
        options: [
          "INNER JOIN retourne toutes les lignes de la table gauche, LEFT JOIN retourne uniquement les correspondances",
          "LEFT JOIN retourne toutes les lignes de la table gauche même sans correspondance",
          "Les deux sont identiques",
          "LEFT JOIN est plus rapide que INNER JOIN",
        ],
        correctAnswer: 1,
      },
      {
        id: "q4",
        question: "Quelle commande Docker permet de construire une image à partir d'un Dockerfile ?",
        options: ["docker run", "docker build", "docker compose", "docker create"],
        correctAnswer: 1,
      },
      {
        id: "q5",
        question: "En TypeScript, que fait le mot-clé `interface` ?",
        options: [
          "Il crée une instance d'objet",
          "Il définit un type personnalisé pour la structure d'un objet",
          "Il importe un module externe",
          "Il déclare une classe abstraite",
        ],
        correctAnswer: 1,
      },
    ],
  },
  "2": {
    jobTitle: "UI/UX Designer Senior",
    status: "Validé",
    aiGeneratedAt: "24 Juin 2026 à 09:15",
    questions: [
      {
        id: "q1",
        question: "Quelle est la première étape du processus Design Thinking ?",
        options: ["Prototypage", "Tests utilisateurs", "Empathie / Recherche utilisateur", "idéation"],
        correctAnswer: 2,
      },
      {
        id: "q2",
        question: "Quel outil est le plus adapté pour créer des Design Systems collaboratifs ?",
        options: ["Photoshop", "Figma", "Microsoft Word", "VS Code"],
        correctAnswer: 1,
      },
    ],
  },
};

export default function JobQuizPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const quiz = QUIZZES_DB[jobId];

  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz?.questions ?? []);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(quiz?.status === "Validé");
  const [rejected, setRejected] = useState(quiz?.status === "Refusé");

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <Icon icon="solar:file-remove-linear" className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-700">Quiz introuvable</h2>
        <p className="text-sm text-slate-400">Aucun quiz généré pour cette offre.</p>
        <Link href="/recruiter/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
          <Icon icon="solar:alt-arrow-left-linear" className="w-4 h-4" />
          Retour aux offres
        </Link>
      </div>
    );
  }

  const handleCorrectChange = (qId: string, optIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, correctAnswer: optIndex } : q))
    );
  };

  const handleQuestionChange = (qId: string, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, question: value } : q))
    );
  };

  const handleOptionChange = (qId: string, optIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.map((o, i) => (i === optIndex ? value : o)) }
          : q
      )
    );
  };

  const handleValidate = () => {
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setValidated(true);
      setRejected(false);
    }, 800);
  };

  const handleReject = () => {
    setRejected(true);
    setValidated(false);
  };

  const handleRegenerate = () => {
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setValidated(false);
      setRejected(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/recruiter/jobs"
          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-start gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Quiz IA - {quiz.jobTitle}
            </h2>
            {validated && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border leading-none bg-emerald-50 text-emerald-700 border-emerald-100/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Validé
              </span>
            )}
            {rejected && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border leading-none bg-rose-50 text-rose-700 border-rose-100/80">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Refusé
              </span>
            )}
            {!validated && !rejected && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border leading-none bg-amber-50 text-amber-700 border-amber-100/80">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                En attente
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Généré par l&apos;IA le {quiz.aiGeneratedAt} &middot; {questions.length} question{questions.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* AI Info Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100/80 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon icon="solar:magic-stick-3-linear" className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-purple-800">Quiz généré par l&apos;IA</p>
          <p className="text-xs text-purple-600/80 mt-0.5">
            Examinez les questions, modifiez-les si nécessaire, puis validez le quiz pour l&apos;associer à l&apos;offre.
          </p>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 space-y-4"
          >
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <div className="flex-1 space-y-3">
                <textarea
                  value={q.question}
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-600 transition-all resize-none"
                  rows={2}
                />
                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCorrectChange(q.id, optIndex)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          optIndex === q.correctAnswer
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-slate-300 hover:border-slate-400"
                        }`}
                        title="Marquer comme bonne réponse"
                      >
                        {optIndex === q.correctAnswer && (
                          <Icon icon="solar:check-circle-bold" className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(q.id, optIndex, e.target.value)}
                        className={`flex-1 bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                          optIndex === q.correctAnswer
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
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={validating}
          className="inline-flex items-center gap-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 font-semibold text-xs py-3 px-5 rounded-xl transition-all select-none disabled:opacity-50"
        >
          <Icon icon="solar:restart-linear" className="w-4 h-4" />
          Régénérer
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReject}
            disabled={validating || rejected}
            className="inline-flex items-center gap-2 bg-white border border-rose-200/80 hover:bg-rose-50 text-rose-600 font-semibold text-xs py-3 px-5 rounded-xl transition-all select-none disabled:opacity-50"
          >
            <Icon icon="solar:close-circle-linear" className="w-4 h-4" />
            Refuser
          </button>
          <button
            type="button"
            onClick={handleValidate}
            disabled={validating || validated}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-sm transition-all active:scale-[0.98] select-none disabled:opacity-75 disabled:cursor-not-allowed min-w-[120px]"
          >
            {validating ? (
              <>
                <Icon icon="solar:restart-bold" className="w-4 h-4 animate-spin" />
                Traitement...
              </>
            ) : validated ? (
              <>
                <Icon icon="solar:check-circle-bold" className="w-4 h-4" />
                Validé
              </>
            ) : (
              <>
                <Icon icon="solar:check-circle-linear" className="w-4 h-4" />
                Valider le quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
