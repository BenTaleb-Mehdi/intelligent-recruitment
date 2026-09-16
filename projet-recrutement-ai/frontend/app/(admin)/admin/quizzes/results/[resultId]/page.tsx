"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, Chip, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { fetchAdminQuizResult, type AdminQuizResultDetail } from "@/services/adminService";

function decodeCorrectAnswers(value: number) {
  const answers: number[] = [];
  for (let index = 0; index < 31; index += 1) {
    if ((value & (1 << index)) !== 0) answers.push(index);
  }
  return answers;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminQuizResultPage() {
  const params = useParams<{ resultId: string }>();
  const resultId = params.resultId;
  const [result, setResult] = useState<AdminQuizResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAdminQuizResult(resultId)
      .then((response) => {
        if (!cancelled) setResult(response.data);
      })
      .catch((caught: unknown) => {
        if (!cancelled) setError(caught instanceof Error ? caught.message : "Failed to load quiz result");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [resultId]);

  if (loading) return <div className="flex min-h-80 items-center justify-center"><Spinner size="lg" color="accent" /></div>;

  if (error || !result) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <Icon icon="lucide:circle-alert" className="mx-auto size-10 text-danger" />
        <h1 className="mt-3 text-xl font-bold">Quiz result unavailable</h1>
        <p className="mt-2 text-sm text-default-500">{error || "This result no longer exists."}</p>
        <Link href="/admin/quizzes"><Button className="mt-5" variant="ghost">Back to quizzes</Button></Link>
      </div>
    );
  }

  const candidate = result.candidate;
  const quiz = result.quiz;
  const company = quiz.jobOffer.recruiter.companyName || "Company not set";

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Quiz Result Review"
        description={`${candidate.user.name} · ${quiz.jobOffer.title}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Quizzes", href: "/admin/quizzes" },
          { label: "Result" },
        ]}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="border border-default-200 bg-content1 p-5 md:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-default-400">Candidate</p>
              <h2 className="mt-1 text-xl font-bold">{candidate.user.name}</h2>
              <p className="text-sm text-default-500">{candidate.user.email}</p>
              <p className="mt-2 text-sm text-default-600">{candidate.title || "Candidate profile"}</p>
            </div>
            <Link href={`/admin/users/${candidate.user.id}`} className="text-sm font-semibold text-primary hover:underline">Open user profile</Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {candidate.skills.map((skill) => <Chip key={skill.id} size="sm" variant="soft">{skill.name}</Chip>)}
            {candidate.skills.length === 0 && <span className="text-xs text-default-400">No skills listed</span>}
          </div>
        </Card>

        <Card className="border border-default-200 bg-content1 p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-default-400">Final score</p>
          <p className={`mt-2 text-4xl font-black ${result.passed ? "text-success" : "text-danger"}`}>{result.score}%</p>
          <Chip className="mt-3" variant="soft" color={result.passed ? "success" : "danger"}>{result.passed ? "Passed" : "Failed"}</Chip>
        </Card>
      </div>

      <Card className="mb-6 border border-default-200 bg-content1 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-xs text-default-400">Quiz</p><p className="mt-1 text-sm font-semibold">{quiz.title}</p></div>
          <div><p className="text-xs text-default-400">Job offer</p><p className="mt-1 text-sm font-semibold">{quiz.jobOffer.title}</p></div>
          <div><p className="text-xs text-default-400">Company</p><p className="mt-1 text-sm font-semibold">{company}</p></div>
          <div><p className="text-xs text-default-400">Completed</p><p className="mt-1 text-sm font-semibold">{formatDate(result.completedAt)}</p></div>
          <div><p className="text-xs text-default-400">Target skill</p><p className="mt-1 text-sm font-semibold">{quiz.skillTarget}</p></div>
          <div><p className="text-xs text-default-400">Duration limit</p><p className="mt-1 text-sm font-semibold">{quiz.duration} minutes</p></div>
          <div><p className="text-xs text-default-400">Questions</p><p className="mt-1 text-sm font-semibold">{quiz.questions.length}</p></div>
          <div><p className="text-xs text-default-400">Quiz status</p><p className="mt-1 text-sm font-semibold">{quiz.status}</p></div>
        </div>
      </Card>

      <div className="mb-6 flex gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-warning-700">
        <Icon icon="lucide:info" className="mt-0.5 size-5 shrink-0" />
        <p>The current candidate submission stores the final score but not selected answers or time taken. The questions and official answers below are available for reference; candidate-by-candidate answer review will appear once that data is saved.</p>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((question, questionIndex) => {
          const options = Array.isArray(question.options) ? question.options : [];
          const correctIndexes = decodeCorrectAnswers(question.correctAnswer);
          return (
            <Card key={question.id} className="border border-default-200 bg-content1 p-5">
              <div className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{questionIndex + 1}</span><p className="font-semibold">{question.text}</p></div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {options.map((option, optionIndex) => {
                  const correct = correctIndexes.includes(optionIndex);
                  return <div key={`${question.id}-${optionIndex}`} className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${correct ? "border-success/40 bg-success/5 text-success-700" : "border-default-200 text-default-600"}`}><Icon icon={correct ? "lucide:check-circle" : "lucide:circle"} className="mt-0.5 size-4 shrink-0" /><span>{option}</span></div>;
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
