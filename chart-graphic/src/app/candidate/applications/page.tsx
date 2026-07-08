"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Card } from "@/components/charts/molecules/Card";
import { Button } from "@/components/charts/atoms/Button";
import { Chip } from "@/components/charts/atoms/Chip";
import { Indicator } from "@/components/charts/atoms/Indicator";
import Link from "next/link";

const APPLICATIONS_DATA = [
  {
    company: "ViteTech Solutions",
    role: "Senior React & Next.js Engineer",
    appliedDate: "July 2, 2026",
    status: "quiz-pending",
    statusLabel: "Technical Assessment Assigned",
    matchScore: 98,
    steps: [
      { name: "Application Submitted", date: "July 2, 2026", done: true },
      { name: "AI Resume Verification", date: "July 2, 2026", done: true },
      { name: "Skills Assessment (Quiz)", date: "Pending", done: false },
      { name: "Final Interview Scheduling", date: "-", done: false },
    ],
  },
  {
    company: "CognitiveAI Systems",
    role: "Lead Frontend Systems Engineer",
    appliedDate: "June 28, 2026",
    status: "interviewing",
    statusLabel: "Panel Interview Scheduled",
    matchScore: 89,
    steps: [
      { name: "Application Submitted", date: "June 28, 2026", done: true },
      { name: "AI Resume Verification", date: "June 28, 2026", done: true },
      { name: "Skills Assessment (Quiz)", date: "June 29, 2026", done: true },
      { name: "Panel Interview (Tomorrow 10AM)", date: "July 4, 2026", done: false, current: true },
    ],
  },
  {
    company: "SyncData Labs",
    role: "Junior Full Stack Engineer",
    appliedDate: "June 15, 2026",
    status: "rejected",
    statusLabel: "Archived Processes",
    matchScore: 68,
    steps: [
      { name: "Application Submitted", date: "June 15, 2026", done: true },
      { name: "AI Resume Screening", date: "June 16, 2026", done: true },
      { name: "Process Finished", date: "June 18, 2026", done: true },
    ],
  },
];

export default function CandidateApplications() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications Tracking</h1>
        <p className="text-sm text-default-500">Monitor your recruitment processes milestones, view assessment statuses, and track next actions.</p>
      </div>

      {/* Main List */}
      <div className="space-y-6">
        {APPLICATIONS_DATA.map((app, idx) => (
          <Card key={idx}>
            <Card.Content className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-center">
                {/* Job Info & Status Column */}
                <div className="space-y-2 lg:max-w-xs w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-accent">{app.company}</span>
                    <span className="text-default-300">•</span>
                    <span className="text-xs text-default-450">{app.appliedDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-default-900 dark:text-default-50">{app.role}</h3>
                  <div className="pt-2">
                    {app.status === "quiz-pending" && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-danger-soft/10 text-danger rounded-full text-xs font-bold">
                        <Indicator status="danger" pulse />
                        {app.statusLabel}
                      </div>
                    )}
                    {app.status === "interviewing" && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-soft/10 text-success rounded-full text-xs font-bold">
                        <Indicator status="success" pulse />
                        {app.statusLabel}
                      </div>
                    )}
                    {app.status === "rejected" && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-default-100 dark:bg-default-800 text-default-500 rounded-full text-xs font-bold">
                        <Indicator status="default" pulse={false} />
                        {app.statusLabel}
                      </div>
                    )}
                  </div>
                </div>

                {/* Vertical Process Timeline */}
                <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-4 md:items-center md:justify-around border-t lg:border-t-0 lg:border-l border-default-100 dark:border-default-50/10 pt-4 lg:pt-0 lg:pl-6">
                  {app.steps.map((step, sIdx) => (
                    <div key={sIdx} className="flex md:flex-col items-center md:items-center gap-3 md:gap-1.5 text-center relative">
                      <div className={[
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm shrink-0",
                        step.done
                          ? "bg-success text-white"
                          : step.current
                            ? "bg-accent text-white animate-pulse"
                            : "bg-default-100 dark:bg-default-805 text-default-400 border border-slate-200 dark:border-slate-800",
                      ].join(" ")}>
                        {step.done ? (
                          <Icon icon="solar:check-circle-bold" className="text-base" />
                        ) : (
                          <span>{sIdx + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${step.done || step.current ? "text-default-800 dark:text-default-200" : "text-default-400"}`}>
                          {step.name}
                        </p>
                        <p className="text-[10px] text-default-450 mt-0.5">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions column */}
                <div className="flex lg:flex-col items-end gap-3 self-stretch lg:self-auto justify-between lg:justify-center border-t lg:border-0 pt-4 lg:pt-0 border-default-105 dark:border-default-50/10">
                  <div className="text-right hidden lg:block">
                    <span className="text-sm font-bold text-accent">{app.matchScore}% Score</span>
                  </div>
                  {app.status === "quiz-pending" ? (
                    <Link href="/candidate/quizzes/react-core-eval">
                      <Button
                        size="sm"
                        variant="primary"
                        startIcon="solar:clipboard-list-bold"
                      >
                        Take Quiz
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      startIcon="solar:chat-round-bold"
                    >
                      Contact Hiring
                    </Button>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
}
