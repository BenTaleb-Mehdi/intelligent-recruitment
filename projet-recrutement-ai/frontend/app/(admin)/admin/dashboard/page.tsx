"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/candidate/Card";
import { Button } from "@/components/candidate/Button";
import { Alert } from "@/components/candidate/Alert";
import { ProgressCircle } from "@/components/candidate/ProgressCircle";
import StatCard, { StatCardsSkeleton } from "@/components/admin/StatCard";
import PageHeader from "@/components/admin/PageHeader";
import { fetchAdminStats, type AdminStats } from "@/services/adminService";

const QUICK_LINKS = [
  { href: "/admin/users", label: "Manage Users", icon: "solar:users-group-two-rounded-bold-duotone", desc: "Browse & verify all accounts" },
  { href: "/admin/reported", label: "Reported Users", icon: "solar:shield-warning-bold-duotone", desc: "Anti-Fake CV moderation" },
  { href: "/admin/jobs", label: "Job Offers", icon: "solar:case-round-bold-duotone", desc: "Moderate recruiter listings" },
  { href: "/admin/quizzes", label: "Quizzes", icon: "solar:clipboard-list-bold-duotone", desc: "Monitor AI-generated tests" },
];

const ECOSYSTEM_PIPELINE = [
  {
    icon: "solar:brain-bold-duotone",
    title: "IA Matching Engine",
    desc: "Cosine similarity ranking between CVs and job offers",
    status: "Sprint 4",
    colorClass: "bg-primary/10 text-primary",
  },
  {
    icon: "solar:chat-square-like-bold-duotone",
    title: "Explainable AI (XAI)",
    desc: "Transparent match explanations for recruiters & candidates",
    status: "Sprint 4",
    colorClass: "bg-secondary/10 text-secondary",
  },
  {
    icon: "solar:code-square-bold-duotone",
    title: "GitHub & Portfolio Sync",
    desc: "Proof-based hiring via BidigitalHub integration",
    status: "Sprint 5",
    colorClass: "bg-success/10 text-success",
  },
  {
    icon: "solar:document-text-bold-duotone",
    title: "CV NLP Parser",
    desc: "Automatic skill extraction from uploaded PDFs",
    status: "Sprint 4",
    colorClass: "bg-warning/10 text-warning",
  },
];

export default function AdminDashboardPage() {
  const { data: session } = authClient.useSession();
  const adminName = session?.user?.name?.split(" ")[0] ?? "Admin";

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats()
      .then((res) => setStats(res.stats))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const verificationRate =
    stats && stats.totalUsers > 0
      ? Math.round((stats.verifiedEmails / stats.totalUsers) * 100)
      : 0;

  const onboardingRate =
    stats && stats.totalUsers > 0
      ? Math.round((stats.onboardedUsers / stats.totalUsers) * 100)
      : 0;

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title Header — mirrors candidate dashboard style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, {adminName}
          </h1>
          <p className="text-sm text-default-500 mt-1">
            Global platform statistics, moderation queue &amp; ecosystem health
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/users">
            <Button startIcon="solar:users-group-two-rounded-bold" variant="outline">
              All Users
            </Button>
          </Link>
          <Link href="/admin/reported">
            <Button startIcon="solar:shield-warning-bold" variant="primary">
              Moderation
            </Button>
          </Link>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <Alert status="danger" title="Failed to load stats" description={error} />
      )}

      {/* Top stat cards — live from DB */}
      {loading ? (
        <StatCardsSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon="lucide:users" color="primary" />
            <StatCard label="Candidates" value={stats?.candidats ?? 0} icon="lucide:user-search" color="success" />
            <StatCard label="Recruiters" value={stats?.recruteurs ?? 0} icon="lucide:briefcase" color="secondary" />
            <StatCard label="New This Week" value={stats?.newThisWeek ?? 0} icon="lucide:trending-up" color="warning" />
          </div>

          {/* Ecosystem stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard label="Job Offers" value={stats?.jobOffers ?? 0} icon="lucide:building-2" color="primary" />
            <StatCard label="Applications" value={stats?.applications ?? 0} icon="lucide:send" color="success" />
            <StatCard label="Quiz Results" value={stats?.quizResults ?? 0} icon="lucide:award" color="secondary" />
          </div>
        </>
      )}

      {/* Trust & Verification section — mirrors candidate card style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Trust card — lg:col-span-2 */}
        <Card className="flex flex-col justify-between lg:col-span-2">
          <Card.Header>
            <div>
              <Card.Title>Platform Trust &amp; Moderation</Card.Title>
              <Card.Description>Email verification · onboarding · pending reports</Card.Description>
            </div>
            <Icon icon="solar:shield-check-bold-duotone" className="text-xl text-success" />
          </Card.Header>
          <Card.Content className="space-y-5">
            {/* Email verification progress */}
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-default-600 font-medium">Email verified</span>
                  <span className="font-semibold text-foreground">
                    {loading ? "—" : `${stats?.verifiedEmails ?? 0} / ${stats?.totalUsers ?? 0}`}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-default-100">
                  <div
                    className="h-full rounded-full bg-success transition-all duration-500"
                    style={{ width: `${loading ? 0 : verificationRate}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-default-400">{verificationRate}% of users verified</p>
              </div>
              <ProgressCircle value={verificationRate} color="success" strokeWidth={4} className="w-14 h-14 shrink-0" />
            </div>

            {/* Onboarding progress */}
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-default-600 font-medium">Onboarding complete</span>
                  <span className="font-semibold text-foreground">
                    {loading ? "—" : `${stats?.onboardedUsers ?? 0} / ${stats?.totalUsers ?? 0}`}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-default-100">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${loading ? 0 : onboardingRate}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-default-400">{onboardingRate}% chose their role</p>
              </div>
              <ProgressCircle value={onboardingRate} color="accent" strokeWidth={4} className="w-14 h-14 shrink-0" />
            </div>

            {/* Pending reports pill */}
            <div className="flex items-center justify-between rounded-xl border border-danger/20 bg-danger/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-danger/10">
                  <Icon icon="solar:flag-bold-duotone" className="size-5 text-danger" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Pending reports</p>
                  <p className="text-xs text-default-500">Flagged for Fake CV or abuse</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-danger">
                  {loading ? "—" : stats?.pendingReports ?? 0}
                </span>
                <Link href="/admin/reported">
                  <Button size="sm" variant="outline">Review</Button>
                </Link>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Role Breakdown card */}
        <Card className="flex flex-col justify-between">
          <Card.Header>
            <div>
              <Card.Title>Role Breakdown</Card.Title>
              <Card.Description>User distribution by role</Card.Description>
            </div>
            <Icon icon="solar:pie-chart-2-bold-duotone" className="text-xl text-accent" />
          </Card.Header>
          <Card.Content className="py-4 space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 animate-pulse rounded-lg bg-default-100" />
                ))}
              </div>
            ) : (
              [
                { label: "Candidates", value: stats?.candidats ?? 0, color: "bg-success", textColor: "text-success" },
                { label: "Recruiters", value: stats?.recruteurs ?? 0, color: "bg-secondary", textColor: "text-secondary" },
                { label: "Admins", value: stats?.admins ?? 0, color: "bg-danger", textColor: "text-danger" },
              ].map((item) => {
                const pct = stats?.totalUsers ? Math.round((item.value / stats.totalUsers) * 100) : 0;
                return (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-default-600">{item.label}</span>
                      <span className={`font-bold ${item.textColor}`}>{item.value} ({pct}%)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-default-100">
                      <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </Card.Content>
          <Card.Footer className="border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-default-400">Live data from DB</span>
          </Card.Footer>
        </Card>
      </div>

      {/* AI Matching Banner — mirrors candidate alert section */}
      <Alert
        status="accent"
        customIcon="solar:brain-bold-duotone"
        title="Bidirectional IA Matching — Sprint 4"
        description="Recruteur → Candidat ranking & Candidat → Emploi recommendations powered by NLP embeddings and cosine similarity. XAI explanations will show why each match scored the way it did."
      />

      {/* Quick Actions & Ecosystem Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions — lg:col-span-2 */}
        <Card className="flex flex-col lg:col-span-2">
          <Card.Header>
            <div>
              <Card.Title>Quick Actions</Card.Title>
              <Card.Description>Jump to any moderation or management section</Card.Description>
            </div>
            <Icon icon="solar:widget-2-bold-duotone" className="text-xl text-primary" />
          </Card.Header>
          <Card.Content className="grid gap-3 sm:grid-cols-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-start gap-3 rounded-xl border border-default-100 dark:border-default-50/10 p-4 transition hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon icon={link.icon} className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-default-900 dark:text-default-50 text-sm">{link.label}</p>
                  <p className="text-xs text-default-500 mt-0.5">{link.desc}</p>
                </div>
              </Link>
            ))}
          </Card.Content>
        </Card>

        {/* Ecosystem Pipeline */}
        <Card className="flex flex-col">
          <Card.Header>
            <div>
              <Card.Title>Ecosystem Pipeline</Card.Title>
              <Card.Description>Sprint roadmap status</Card.Description>
            </div>
            <Icon icon="solar:rocket-bold-duotone" className="text-xl text-secondary" />
          </Card.Header>
          <Card.Content className="space-y-3">
            {ECOSYSTEM_PIPELINE.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-lg border border-default-100 dark:border-default-50/10 p-3"
              >
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.colorClass}`}>
                  <Icon icon={item.icon} className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <Chip size="sm" variant="soft" className="shrink-0 text-[10px]">
                      {item.status}
                    </Chip>
                  </div>
                  <p className="text-xs text-default-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
