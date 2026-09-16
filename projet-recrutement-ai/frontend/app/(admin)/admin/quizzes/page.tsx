"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Card, Chip, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import PageHeader from "@/components/admin/PageHeader";
import {
  fetchAdminQuizResults,
  fetchAdminQuizzes,
  updateAdminQuizStatus,
  type AdminQuiz,
  type AdminQuizResult,
  type AdminQuizStatus,
} from "@/services/adminService";

function scoreColor(score: number) {
  if (score >= 70) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}

function scoreBackground(score: number) {
  if (score >= 70) return "bg-success";
  if (score >= 50) return "bg-warning";
  return "bg-danger";
}

function quizStatusColor(status: AdminQuizStatus): "success" | "warning" | "danger" {
  if (status === "VALIDATED") return "success";
  if (status === "REJECTED") return "danger";
  return "warning";
}

function formatDate(value: string | null) {
  if (!value) return "No deadline";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-default-100">
        <div className={`h-full rounded-full ${scoreBackground(score)}`} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
      </div>
      <span className={`text-sm font-bold ${scoreColor(score)}`}>{score}%</span>
    </div>
  );
}

function SummaryCards({ quizzes, results }: { quizzes: AdminQuiz[]; results: AdminQuizResult[] }) {
  const passed = results.filter((result) => result.passed).length;
  const average = results.length ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length) : 0;
  const pending = quizzes.filter((quiz) => quiz.status === "PENDING").length;
  const cards = [
    { label: "Total Attempts", value: results.length, icon: "lucide:clipboard-list", color: "bg-primary/10 text-primary" },
    { label: "Pass Rate", value: results.length ? `${Math.round((passed / results.length) * 100)}%` : "0%", icon: "lucide:check-circle", color: "bg-success/10 text-success" },
    { label: "Average Score", value: `${average}%`, icon: "lucide:bar-chart-2", color: "bg-secondary/10 text-secondary" },
    { label: "Pending Review", value: pending, icon: "lucide:clock", color: "bg-warning/10 text-warning" },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="flex items-center gap-4 border border-default-200 bg-content1 p-4 shadow-sm">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${card.color}`}><Icon icon={card.icon} className="size-5" /></div>
          <div><p className="text-xl font-bold text-foreground">{card.value}</p><p className="text-xs text-default-500">{card.label}</p></div>
        </Card>
      ))}
    </div>
  );
}

function QuizResultsTab({ results }: { results: AdminQuizResult[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return results.filter((result) => {
      const matchesSearch = !query || result.candidate.user.name.toLowerCase().includes(query) || result.candidate.user.email.toLowerCase().includes(query) || result.quiz.jobOffer.title.toLowerCase().includes(query) || (result.quiz.jobOffer.recruiter.companyName || "").toLowerCase().includes(query);
      const matchesFilter = filter === "all" || (filter === "passed" ? result.passed : !result.passed);
      return matchesSearch && matchesFilter;
    });
  }, [filter, results, search]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex max-w-md flex-1 items-center">
          <Icon icon="lucide:search" className="pointer-events-none absolute left-3 size-4 text-default-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidate, email, job, or company..." className="w-full rounded-lg border border-default-200 bg-default-50 py-2 pl-9 pr-8 text-sm outline-none focus:border-primary" />
          {search && <button type="button" onClick={() => setSearch("")} className="absolute right-2 text-default-400" aria-label="Clear search"><Icon icon="lucide:x" className="size-4" /></button>}
        </div>
        <div className="flex gap-2">
          {(["all", "passed", "failed"] as const).map((value) => <Button key={value} size="sm" variant={filter === value ? "primary" : "ghost"} onPress={() => setFilter(value)}>{value === "all" ? "All" : value === "passed" ? "Passed" : "Failed"}</Button>)}
        </div>
      </div>

      <Card className="overflow-hidden border border-default-200 bg-content1 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead><tr className="border-b border-default-200 bg-default-50">{["Candidate", "Job Offer", "Quiz", "Score", "Questions", "Completed", "Status", ""].map((column) => <th key={column} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-default-500">{column}</th>)}</tr></thead>
            <tbody>
              {filtered.map((result) => (
                <tr key={result.id} className="border-b border-default-100 transition hover:bg-default-50">
                  <td className="px-4 py-3"><p className="text-sm font-medium">{result.candidate.user.name}</p><p className="text-xs text-default-400">{result.candidate.user.email}</p></td>
                  <td className="px-4 py-3"><p className="text-sm font-medium">{result.quiz.jobOffer.title}</p><p className="text-xs text-default-400">{result.quiz.jobOffer.recruiter.companyName || "Company not set"}</p></td>
                  <td className="px-4 py-3 text-sm text-default-600">{result.quiz.title}</td>
                  <td className="px-4 py-3"><ScoreBar score={result.score} /></td>
                  <td className="px-4 py-3 text-sm text-default-600">{result.quiz._count.questions}</td>
                  <td className="px-4 py-3 text-sm text-default-500">{formatDate(result.completedAt)}</td>
                  <td className="px-4 py-3"><Chip size="sm" variant="soft" color={result.passed ? "success" : "danger"}>{result.passed ? "Passed" : "Failed"}</Chip></td>
                  <td className="px-4 py-3 text-right"><Link href={`/admin/quizzes/results/${result.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Review <Icon icon="lucide:arrow-right" className="size-4" /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="flex flex-col items-center gap-2 px-6 py-14 text-center text-default-500"><Icon icon="lucide:search-x" className="size-8 text-default-300" /><p className="text-sm">No quiz results match the current filters.</p></div>}
        <div className="border-t border-default-200 px-4 py-3 text-xs text-default-400">Showing {filtered.length} of {results.length} real quiz results</div>
      </Card>
    </div>
  );
}

function QuizManagementTab({ quizzes, updatingId, onStatusChange }: { quizzes: AdminQuiz[]; updatingId: string | null; onStatusChange: (id: string, status: AdminQuizStatus) => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | AdminQuizStatus>("ALL");
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return quizzes.filter((quiz) => {
      const matchesSearch = !query || quiz.title.toLowerCase().includes(query) || quiz.jobOffer.title.toLowerCase().includes(query) || (quiz.jobOffer.recruiter.companyName || "").toLowerCase().includes(query);
      return matchesSearch && (filter === "ALL" || quiz.status === filter);
    });
  }, [filter, quizzes, search]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex max-w-md flex-1 items-center"><Icon icon="lucide:search" className="pointer-events-none absolute left-3 size-4 text-default-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search quiz, job, or company..." className="w-full rounded-lg border border-default-200 bg-default-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary" /></div>
        <select value={filter} onChange={(event) => setFilter(event.target.value as "ALL" | AdminQuizStatus)} className="h-9 rounded-lg border border-default-200 bg-content1 px-3 text-sm"><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="VALIDATED">Validated</option><option value="REJECTED">Rejected</option></select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((quiz) => (
          <Card key={quiz.id} className="flex flex-col border border-default-200 bg-content1 shadow-sm">
            <div className="flex items-start justify-between border-b border-default-100 p-4"><div className="min-w-0"><p className="truncate text-sm font-bold">{quiz.title}</p><p className="truncate text-xs text-default-400">{quiz.jobOffer.title}</p><p className="truncate text-xs text-default-400">{quiz.jobOffer.recruiter.companyName || "Company not set"}</p></div><Chip size="sm" variant="soft" color={quizStatusColor(quiz.status)}>{quiz.status}</Chip></div>
            <div className="grid flex-1 grid-cols-2 gap-3 p-4">
              <div className="rounded-lg bg-default-50 p-3"><p className="text-xs text-default-400">Questions</p><p className="text-lg font-bold">{quiz._count.questions}</p></div>
              <div className="rounded-lg bg-default-50 p-3"><p className="text-xs text-default-400">Duration</p><p className="text-lg font-bold">{quiz.duration} min</p></div>
              <div className="rounded-lg bg-default-50 p-3"><p className="text-xs text-default-400">Attempts</p><p className="text-lg font-bold">{quiz._count.testResults}</p></div>
              <div className="rounded-lg bg-default-50 p-3"><p className="text-xs text-default-400">Average</p><p className="text-lg font-bold">{quiz.averageScore === null ? "—" : `${quiz.averageScore}%`}</p></div>
            </div>
            <div className="border-t border-default-100 p-3"><p className="mb-3 text-xs text-default-400">Deadline: {formatDate(quiz.deadline)}</p><div className="flex flex-wrap gap-2">{(["PENDING", "VALIDATED", "REJECTED"] as const).map((status) => <Button key={status} size="sm" variant={quiz.status === status ? "primary" : "ghost"} isDisabled={updatingId === quiz.id || quiz.status === status} onPress={() => onStatusChange(quiz.id, status)}>{updatingId === quiz.id && quiz.status !== status ? "Saving..." : status.charAt(0) + status.slice(1).toLowerCase()}</Button>)}</div></div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <div className="rounded-xl border border-dashed border-default-300 px-6 py-14 text-center text-sm text-default-500">No quizzes match the current filters.</div>}
    </div>
  );
}

export default function AdminQuizzesPage() {
  const [activeTab, setActiveTab] = useState<"results" | "management">("results");
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [results, setResults] = useState<AdminQuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchAdminQuizzes(), fetchAdminQuizResults()])
      .then(([quizResponse, resultResponse]) => {
        if (cancelled) return;
        setQuizzes(quizResponse.data);
        setResults(resultResponse.data);
        setError(null);
      })
      .catch((caught: unknown) => { if (!cancelled) setError(caught instanceof Error ? caught.message : "Failed to load quiz data"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const refresh = () => { setLoading(true); setReloadKey((value) => value + 1); };
  const changeStatus = async (id: string, status: AdminQuizStatus) => {
    setUpdatingId(id);
    try {
      await updateAdminQuizStatus(id, status);
      setQuizzes((current) => current.map((quiz) => (quiz.id === id ? { ...quiz, status } : quiz)));
      setError(null);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Failed to update quiz status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Quiz Management" description="Monitor real candidate results and moderate generated assessments" breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Quizzes" }]} />
      {error && <Card className="mb-4 flex flex-row items-center justify-between gap-4 border border-danger/30 bg-danger/5 p-4 text-sm text-danger"><span>{error}</span><Button size="sm" variant="ghost" onPress={refresh}>Retry</Button></Card>}
      {loading ? <div className="flex min-h-80 items-center justify-center"><Spinner size="lg" color="accent" /></div> : (
        <><SummaryCards quizzes={quizzes} results={results} /><div className="mb-6 flex w-fit gap-1 rounded-xl border border-default-200 bg-content1 p-1 shadow-sm"><Button variant={activeTab === "results" ? "primary" : "ghost"} onPress={() => setActiveTab("results")}><Icon icon="lucide:bar-chart-2" />Results</Button><Button variant={activeTab === "management" ? "primary" : "ghost"} onPress={() => setActiveTab("management")}><Icon icon="lucide:settings-2" />Manage Quizzes</Button></div>{activeTab === "results" ? <QuizResultsTab results={results} /> : <QuizManagementTab quizzes={quizzes} updatingId={updatingId} onStatusChange={changeStatus} />}</>
      )}
    </div>
  );
}
