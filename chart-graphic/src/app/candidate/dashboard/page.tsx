"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Card } from "@/components/charts/molecules/Card";
import { Button } from "@/components/charts/atoms/Button";
import { Indicator } from "@/components/charts/atoms/Indicator";
import { ProgressCircle } from "@/components/charts/atoms/ProgressCircle";
import { Chip } from "@/components/charts/atoms/Chip";
import { Alert } from "@/components/charts/molecules/Alert";
import Link from "next/link";
import RecommendedJobs from "@/components/candidate/RecommendedJobs";
import ActionChecklist from "@/components/candidate/ActionChecklist";

export default function CandidateDashboard() {
  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="text-sm text-default-500">Track your employability index, AI matching ratings, and upcoming assessments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/candidate/profile">
            <Button startIcon="solar:upload-minimalistic-bold" variant="outline">
              Update CV
            </Button>
          </Link>
          <Link href="/candidate/jobs">
            <Button startIcon="solar:case-bold" variant="primary">
              Search Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Warning/Alert message */}
      <Alert
        status="warning"
        title="Pending Skills Assessment"
        description="You have 1 technical quiz pending completion. Completing this will boost your employability score by +8%."
      />

      {/* Stats and AI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Employability Score */}
        <Card className="flex flex-col justify-between">
          <Card.Header>
            <div>
              <Card.Title>AI Employability Index</Card.Title>
              <Card.Description>Market compatibility ranking</Card.Description>
            </div>
            <Icon icon="solar:bolt-bold-duotone" className="text-xl text-accent" />
          </Card.Header>
          <Card.Content className="flex items-center justify-between py-2">
            <div>
              <h2 className="text-4xl font-black text-default-900 dark:text-default-50">94%</h2>
              <p className="text-xs text-success font-semibold flex items-center gap-1 mt-2">
                <Icon icon="solar:arrow-right-up-bold" />
                Top 6% of applicants
              </p>
            </div>
            <ProgressCircle value={94} color="accent" strokeWidth={4} className="w-16 h-16" />
          </Card.Content>
          <Card.Footer className="border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-default-400">Calculated from CV + GitHub Sync</span>
          </Card.Footer>
        </Card>

        {/* Profile Completion */}
        <Card className="flex flex-col justify-between">
          <Card.Header>
            <div>
              <Card.Title>Profile Completion</Card.Title>
              <Card.Description>Complete details to unlock matching</Card.Description>
            </div>
            <Icon icon="solar:user-bold-duotone" className="text-xl text-success" />
          </Card.Header>
          <Card.Content className="flex items-center justify-between py-2">
            <div>
              <h2 className="text-4xl font-black text-default-900 dark:text-default-50">80%</h2>
              <p className="text-xs text-default-450 mt-2">Missing: Portfolio Links</p>
            </div>
            <ProgressCircle value={80} color="success" strokeWidth={4} className="w-16 h-16" />
          </Card.Content>
          <Card.Footer className="border-t border-slate-100 dark:border-slate-800">
            <Link href="/candidate/profile" className="w-full">
              <Button size="sm" variant="ghost" className="w-full">
                Complete Profile
              </Button>
            </Link>
          </Card.Footer>
        </Card>

        {/* Active Applications Stats */}
        <Card className="flex flex-col justify-between">
          <Card.Header>
            <div>
              <Card.Title>Application Status</Card.Title>
              <Card.Description>Active recruitment processes</Card.Description>
            </div>
            <Icon icon="solar:folder-open-bold-duotone" className="text-xl text-accent" />
          </Card.Header>
          <Card.Content className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-default-100 dark:border-default-50/10 pb-1.5">
              <span className="text-default-500 font-medium">Applied Jobs</span>
              <span className="font-bold text-default-800 dark:text-default-255">4</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-default-100 dark:border-default-50/10 pb-1.5">
              <span className="text-default-500 font-medium">Under AI Review</span>
              <span className="font-bold text-accent">2</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-default-500 font-medium">Interviews Scheduled</span>
              <span className="font-bold text-success">1</span>
            </div>
          </Card.Content>
          <Card.Footer className="border-t border-slate-100 dark:border-slate-800">
            <Link href="/candidate/applications" className="w-full">
              <Button size="sm" variant="ghost" className="w-full">
                Track Applications
              </Button>
            </Link>
          </Card.Footer>
        </Card>
      </div>

      {/* Split section: Recommendations & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended jobs lists */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-base text-default-800 dark:text-default-200 select-none">AI-Recommended Positions</h3>
          <RecommendedJobs
            jobs={[
              { company: "ViteTech Solutions", title: "Senior React & Next.js Engineer", match: 98, salary: "$85k - $110k", tags: ["Next.js", "HeroUI", "Tailwind"] },
              { company: "CognitiveAI Systems", title: "Lead Frontend Systems Engineer", match: 89, salary: "$100k - $130k", tags: ["React 19", "Typescript", "GraphQL"] },
            ]}
          />
        </div>

        {/* Action checklist */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-default-800 dark:text-default-200 select-none">Action Checklist</h3>
          <ActionChecklist
            cvUploaded={true}
            githubConnected={true}
            hasPendingQuiz={true}
          />
        </div>
      </div>
    </div>
  );
}
