"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Card } from "@/components/candidate/Card";
import { Button } from "@/components/candidate/Button";
import { Chip } from "@/components/candidate/Chip";
import { Alert } from "@/components/candidate/Alert";
import { Indicator } from "@/components/candidate/Indicator";

const JOBS_DATA = [
  {
    id: "0",
    title: "Senior React & Next.js Engineer",
    company: "ViteTech Solutions",
    location: "Paris, France (Hybrid)",
    salary: "$85k - $110k",
    experience: "5+ years",
    matchScore: 98,
    tags: ["Next.js", "HeroUI", "Tailwind CSS", "TypeScript", "React 19"],
    description: "Looking for an expert Frontend Architect to design our Next.js design system framework. Responsibilities include building highly performant dashboards, loading components optimization, and type safety compliance.",
    quizId: "react-core-eval",
    reasons: [
      "Your CV lists 5+ years of active experience with React architectures.",
      "High density of TypeScript commits in your synced GitHub repositories.",
      "Demonstrated experience with Tailwind CSS layout composition.",
    ],
    gaps: [
      "No direct database schema references found in recent frontend work (SQL/Prisma).",
    ],
  },
  {
    id: "1",
    title: "Lead Frontend Systems Engineer",
    company: "CognitiveAI Systems",
    location: "Remote (Europe)",
    salary: "$100k - $130k",
    experience: "6+ years",
    matchScore: 89,
    tags: ["React 19", "Typescript", "GraphQL", "Python", "Ray Serve"],
    description: "Join our core team linking LLM outputs to responsive, client-side React frameworks. Experience integrating client services, FastAPI, and client-side data state managers is a plus.",
    quizId: "graphql-systems",
    reasons: [
      "Strong React 18/19 compatibility markers found in profile.",
      "GitHub repo analysis shows multiple Python modules and repository files.",
    ],
    gaps: [
      "No active GraphQL schemas detected in your uploaded projects.",
      "Ray Serve framework is missing from your CV profile keyword listings.",
    ],
  },
];

export default function CandidateJobDetails() {
  const params = useParams();
  const router = useRouter();
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const job = useMemo(() => {
    const id = params.id as string;
    return JOBS_DATA.find((j) => j.id === id) || JOBS_DATA[0];
  }, [params.id]);

  const handleApply = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setApplied(true);
    }, 1200);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Back button header */}
      <div className="flex items-center gap-3">
        <Link
          href="/candidate/jobs"
          className="p-2 bg-blue-50/50 dark:bg-slate-800 rounded-xl text-accent hover:bg-blue-100/60 hover:text-blue-700 transition-colors"
        >
          <Icon icon="solar:arrow-left-bold" className="text-lg" />
        </Link>
        <div>
          <span className="text-xs font-semibold text-default-450 uppercase tracking-wider">Job Feed Detail View</span>
          <h1 className="text-xl font-bold tracking-tight">{job.title}</h1>
        </div>
      </div>

      {applied && (
        <Alert
          status="success"
          title="Application Submitted Successfully!"
          description="Your profile was sent to recruiters. ViteTech requires a technical skills quiz to finalize screening."
        />
      )}

      {/* Main Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Job Specs & Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Card.Content className="p-6 space-y-6">
              {/* Job Meta Info */}
              <div className="flex justify-between items-start border-b border-default-100 dark:border-default-50/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-default-900 dark:text-default-50">{job.title}</h2>
                  <p className="text-sm text-accent font-semibold mt-1">{job.company}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-default-900 dark:text-default-50">{job.salary}</span>
                  <p className="text-[10px] text-default-400 font-semibold uppercase">{job.location}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-default-700 dark:text-default-300 select-none">Position Description</h3>
                <p className="text-sm text-default-550 leading-relaxed">
                  {job.description}
                </p>
                <p className="text-sm text-default-550 leading-relaxed">
                  As part of our recruitment framework, we utilize automated matching evaluation and real-world repository syncing to check skills without standard filter tests.
                </p>
              </div>

              {/* Required Skills chips */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-default-700 dark:text-default-300 select-none">Core Technologies Required</h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((t, idx) => (
                    <Chip key={idx} variant="soft">{t}</Chip>
                  ))}
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Right Side: AI Match & Action */}
        <div className="space-y-6">
          <Card className="border-accent/30 shadow-accent/5">
            <Card.Header>
              <div>
                <Card.Title>AI Compatibility Report</Card.Title>
                <Card.Description>Matching index overview</Card.Description>
              </div>
              <Icon icon="solar:widget-2-bold-duotone" className="text-xl text-accent" />
            </Card.Header>
            <Card.Content className="space-y-6">
              {/* Match meter */}
              <div className="text-center py-4 bg-blue-50/20 dark:bg-slate-800/20 rounded-xl border border-blue-100/50 dark:border-slate-850">
                <span className="text-3xl font-black text-success">{job.matchScore}%</span>
                <p className="text-xs text-default-450 font-medium mt-1">Overall Profile Compatibility</p>
              </div>

              {/* Match Reasons */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-default-400 uppercase tracking-wider">Matching Points</h4>
                <ul className="space-y-2">
                  {job.reasons.map((r, i) => (
                    <li key={i} className="flex gap-2 text-xs text-default-600 leading-relaxed">
                      <Icon icon="solar:check-circle-bold" className="text-success text-base shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gaps */}
              {job.gaps.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-default-400 uppercase tracking-wider">Skill Gaps Detected</h4>
                  <ul className="space-y-2">
                    {job.gaps.map((g, i) => (
                      <li key={i} className="flex gap-2 text-xs text-default-600 leading-relaxed">
                        <Icon icon="solar:danger-triangle-bold" className="text-warning text-base shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card.Content>
            <Card.Footer className="flex-col gap-3">
              {applied ? (
                <>
                  <div className="w-full flex items-center justify-between p-3 bg-danger-soft/10 text-danger rounded-lg text-xs font-bold mb-1 select-none">
                    <span>Technical Quiz Pending</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
                  </div>
                  <Link href={`/candidate/quizzes/${job.quizId}`} className="w-full">
                    <Button
                      startIcon="solar:clipboard-list-bold"
                      variant="primary"
                      className="w-full"
                    >
                      Start Technical Assessment
                    </Button>
                  </Link>
                </>
              ) : (
                <Button
                  startIcon="solar:square-share-line-bold"
                  variant="primary"
                  className="w-full"
                  isLoading={loading}
                  onClick={handleApply}
                >
                  Submit Application
                </Button>
              )}
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
}
