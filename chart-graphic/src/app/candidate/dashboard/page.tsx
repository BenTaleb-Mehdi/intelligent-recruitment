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
          <div className="space-y-4">
            {[
              { company: "ViteTech Solutions", title: "Senior React & Next.js Engineer", match: 98, salary: "$85k - $110k", tags: ["Next.js", "HeroUI", "Tailwind"] },
              { company: "CognitiveAI Systems", title: "Lead Frontend Systems Engineer", match: 89, salary: "$100k - $130k", tags: ["React 19", "Typescript", "GraphQL"] },
            ].map((job, idx) => (
              <Card key={idx} className="hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
                <Card.Content className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-accent">{job.company}</span>
                      <span className="text-default-300">•</span>
                      <span className="text-xs text-default-450">{job.salary}</span>
                    </div>
                    <h4 className="font-bold text-base text-default-900 dark:text-default-50">{job.title}</h4>
                    <div className="flex gap-1.5 mt-2">
                      {job.tags.map((t, i) => (
                        <Chip key={i} variant="soft">{t}</Chip>
                      ))}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-end gap-3 sm:gap-1.5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0 justify-between">
                    <div className="text-right">
                      <span className="text-sm font-bold text-success">{job.match}% Match</span>
                      <p className="text-[10px] text-default-400 font-semibold uppercase">Compatibility</p>
                    </div>
                    <Link href={`/candidate/jobs/${idx}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>

        {/* Action checklist */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-default-800 dark:text-default-200 select-none">Action Checklist</h3>
          <Card>
            <Card.Content className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-success/15 text-success rounded-lg mt-0.5">
                  <Icon icon="solar:check-circle-bold" className="text-base" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-default-800 dark:text-default-200">Upload CV (PDF)</h5>
                  <p className="text-xs text-default-450 mt-0.5">AI parsing complete. 24 skills extracted.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-success/15 text-success rounded-lg mt-0.5">
                  <Icon icon="solar:check-circle-bold" className="text-base" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-default-800 dark:text-default-200">GitHub Synchronization</h5>
                  <p className="text-xs text-default-450 mt-0.5">Synced 14 repositories. Top language: TypeScript.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-warning/15 text-warning rounded-lg mt-0.5">
                  <Icon icon="solar:bell-bold" className="text-base animate-bounce" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-default-800 dark:text-default-200">Complete AI Tech Quiz</h5>
                  <p className="text-xs text-default-450 mt-0.5">React core evaluation assigned by ViteTech.</p>
                  <Link href="/candidate/quizzes">
                    <Button size="sm" variant="primary" className="mt-2.5">
                      Start Quiz Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
