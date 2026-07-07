"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Calendar } from "@heroui/react";
import { parseDate } from "@internationalized/date";

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

  const [endDate, setEndDate] = useState(parseDate("2026-07-14"));
  const [endTime, setEndTime] = useState("23:59");
  const [duration, setDuration] = useState("30");

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

      {/* Access & Time Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Icon icon="solar:calendar-date-linear" className="w-4 h-4 text-purple-600" />
          Paramètres d&apos;accès & Temps
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Calendar Picker Column */}
          <div className="flex flex-col items-center sm:items-start space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider self-start">
              Date limite de passage
            </span>
            <div className="quiz-calendar bg-slate-50 p-3 rounded-2xl border border-slate-200/50 w-full max-w-[280px] sm:max-w-none flex justify-center">
              <Calendar 
                aria-label="Date limite du quiz" 
                value={endDate} 
                onChange={(date) => {
                  if (date) setEndDate(date);
                }}
              >
                <Calendar.Header>
                  <Calendar.Heading />
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>
                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                </Calendar.Grid>
              </Calendar>
              <style dangerouslySetInnerHTML={{ __html: `
                /* Heading (e.g., July 2026) */
                .quiz-calendar [data-slot="calendar-heading"] {
                  color: #1e293b !important;
                }
                /* Weekday headers (Sun, Mon...) */
                .quiz-calendar [data-slot="calendar-header-cell"] {
                  color: #64748b !important;
                }
                /* Calendar day cells */
                .quiz-calendar [data-slot="calendar-cell"] {
                  color: #1e293b !important;
                }
                /* Selected calendar day cell */
                .quiz-calendar [data-slot="calendar-cell"][data-selected="true"] {
                  color: #ffffff !important;
                }
                /* Outside month / disabled cells */
                .quiz-calendar [data-slot="calendar-cell"][data-outside-month="true"],
                .quiz-calendar [data-slot="calendar-cell"][data-outside-visible-range="true"],
                .quiz-calendar [data-slot="calendar-cell"][data-disabled="true"] {
                  color: #cbd5e1 !important;
                  opacity: 0.5;
                }
              `}} />
            </div>
          </div>

          {/* Time & Duration settings Column */}
          <div className="space-y-5">
            {/* End Time */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Heure limite de passage
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-600 transition-all"
                />
              </div>
            </div>

            {/* Duration select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Durée limite du test
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["15", "30", "45", "60", "90"].map((timeOption) => (
                  <button
                    key={timeOption}
                    type="button"
                    onClick={() => setDuration(timeOption)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      duration === timeOption
                        ? "bg-purple-50 border-purple-200 text-purple-700 shadow-sm"
                        : "bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {timeOption} min
                  </button>
                ))}
                {/* Custom input */}
                <div className="relative flex items-center bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-600">
                  <input
                    type="number"
                    min="1"
                    placeholder="Autre"
                    value={!["15", "30", "45", "60", "90"].includes(duration) ? duration : ""}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-transparent border-none text-xs font-semibold text-slate-700 placeholder-slate-400 p-0 focus:ring-0 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 font-medium ml-1">min</span>
                </div>
              </div>
            </div>

            {/* Dynamic Info Panel */}
            <div className="bg-purple-50/50 border border-purple-100/50 rounded-xl p-4 space-y-2">
              <div className="flex gap-2 items-center text-purple-800">
                <Icon icon="solar:info-circle-linear" className="w-4.5 h-4.5 flex-shrink-0" />
                <span className="text-xs font-bold">Récapitulatif des règles</span>
              </div>
              <p className="text-xs text-purple-700/80 leading-relaxed">
                Le test prendra fin le <strong className="text-purple-900">{endDate ? `${endDate.day}/${endDate.month}/${endDate.year}` : ""}</strong> à <strong className="text-purple-900">{endTime}</strong>.
                Chaque candidat disposera de <strong className="text-purple-900">{duration || "0"} minutes</strong> pour répondre aux questions une fois le test lancé.
              </p>
            </div>
          </div>
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
