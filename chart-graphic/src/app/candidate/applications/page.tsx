"use client";

import React from "react";
import ApplicationProgressCard from "@/components/candidate/ApplicationProgressCard";

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
          <ApplicationProgressCard key={idx} application={app} />
        ))}
      </div>
    </div>
  );
}

