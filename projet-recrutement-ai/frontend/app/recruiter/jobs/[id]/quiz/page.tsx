"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { parseDate, CalendarDate } from "@internationalized/date";
import Calendar from "@/components/recruiter/Calendar";
import { api } from "@/lib/api";
import type { ApiJobOffer } from "@/lib/api";

import QuizQuestionCard, { QuizQuestion } from "@/components/recruiter/QuizQuestionCard";

interface QuizData {
  jobTitle: string;
  status: "En attente" | "Validé" | "Refusé";
  aiGeneratedAt: string;
  questions: QuizQuestion[];
}

const QUIZZES_DB: Record<string, QuizData> = {};

export default function JobQuizPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [aiGeneratedAt, setAiGeneratedAt] = useState("");
  const [loading, setLoading] = useState(true);

  const [endDate, setEndDate] = useState<CalendarDate>(parseDate("2026-07-14"));
  const [endTime, setEndTime] = useState("23:59");
  const [duration, setDuration] = useState("30");

  const fetchQuiz = useCallback(async () => {
    try {
      const res = await api.get<{ data: ApiJobOffer }>(`/api/job-offers/${jobId}`);
      if (res?.data) {
        const offer = res.data;
        setJobTitle(offer.title);

        if (offer.quiz) {
          setQuestions(
            offer.quiz.questions.map((q: any) => ({
              id: q.id,
              question: q.text,
              options: Array.isArray(q.options)
                ? q.options
                : typeof q.options === "string"
                ? JSON.parse(q.options)
                : [],
              correctAnswer: q.correctAnswer,
            }))
          );
          setValidated(offer.quiz.status === "VALIDATED");
          setRejected(offer.quiz.status === "REJECTED");
          setAiGeneratedAt(
            new Date(offer.quiz.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) {
      fetchQuiz();
    }
  }, [fetchQuiz, jobId]);

  const handleCorrectChange = (qId: string, optIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, correctAnswer: optIndex } : q))
    );
    setValidated(false);
  };

  const handleQuestionChange = (qId: string, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, question: value } : q))
    );
    setValidated(false);
  };

  const handleOptionChange = (qId: string, optIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.map((o, i) => (i === optIndex ? value : o)) }
          : q
      )
    );
    setValidated(false);
  };

  const handleValidate = async () => {
    setValidating(true);
    try {
      const computedDeadline = (() => {
        if (!endDate) return null;
        try {
          const deadlineDate = new Date(endDate.year, endDate.month - 1, endDate.day);
          const [hStr, mStr] = (endTime || "23:59").split(":");
          const hours = parseInt(hStr || "23", 10);
          const minutes = parseInt(mStr || "59", 10);
          deadlineDate.setHours(isNaN(hours) ? 23 : hours, isNaN(minutes) ? 59 : minutes, 0, 0);
          return isNaN(deadlineDate.getTime()) ? null : deadlineDate.toISOString();
        } catch {
          return null;
        }
      })();

      await api.put(`/api/job-offers/${jobId}/quiz`, {
        status: "VALIDATED",
        duration: parseInt(duration, 10) || 30,
        deadline: computedDeadline,
        questions: questions.map((q) => ({
          text: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
      });
      setValidated(true);
      setRejected(false);
    } catch (err: any) {
      console.error("Error validating quiz:", err);
      alert(err.message || "Erreur lors de la validation du quiz.");
    } finally {
      setValidating(false);
    }
  };

  const handleReject = async () => {
    setValidating(true);
    try {
      await api.put(`/api/job-offers/${jobId}/quiz`, {
        status: "REJECTED",
      });
      setRejected(true);
      setValidated(false);
    } catch (err: any) {
      console.error("Error rejecting quiz:", err);
      alert(err.message || "Erreur lors du rejet du quiz.");
    } finally {
      setValidating(false);
    }
  };

  const handleRegenerate = async () => {
    setValidating(true);
    try {
      await api.post(`/api/job-offers/${jobId}/regenerate`, {});
      setTimeout(async () => {
        await fetchQuiz();
        setValidating(false);
        setValidated(false);
        setRejected(false);
      }, 4000);
    } catch (err: any) {
      console.error("Error triggering regeneration:", err);
      alert(err.message || "Erreur lors du déclenchement de la régénération.");
      setValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!questions.length) {
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
              Quiz IA - {jobTitle}
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
            Généré par l&apos;IA le {aiGeneratedAt} &middot; {questions.length} question{questions.length > 1 ? "s" : ""}
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
            <Calendar
              aria-label="Date limite du quiz"
              value={endDate}
              onChange={(date) => {
                if (date) {
                  setEndDate(date);
                  setValidated(false);
                }
              }}
            />
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
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setValidated(false);
                  }}
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
                    onClick={() => {
                      setDuration(timeOption);
                      setValidated(false);
                    }}
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
                    onChange={(e) => {
                      setDuration(e.target.value);
                      setValidated(false);
                    }}
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
          <QuizQuestionCard
            key={q.id}
            question={q}
            index={index}
            onQuestionChange={handleQuestionChange}
            onOptionChange={handleOptionChange}
            onCorrectChange={handleCorrectChange}
          />
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
