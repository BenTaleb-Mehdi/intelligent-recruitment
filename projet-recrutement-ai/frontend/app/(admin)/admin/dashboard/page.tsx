"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import PageHeader from "@/components/admin/PageHeader";
import StatCard, { StatCardsSkeleton } from "@/components/admin/StatCard";
import { fetchAdminStats, type AdminStats, type StatsResponse } from "@/services/adminService";

const MOCK_REPORTS = [
  { id: "1", name: "John Smith", reason: "Fake CV / misleading profile", date: "2 hours ago", severity: "high" },
  { id: "2", name: "Marie Dupont", reason: "Spam job applications", date: "5 hours ago", severity: "medium" },
  { id: "3", name: "Alex Chen", reason: "Harassment in messages", date: "1 day ago", severity: "high" },
];

const QUICK_LINKS = [
  { href: "/admin/users", label: "Manage Users", icon: "lucide:users", desc: "Browse & verify all accounts" },
  { href: "/admin/reported", label: "Reported Users", icon: "lucide:shield-alert", desc: "Anti-Fake CV moderation" },
  { href: "/admin/jobs", label: "Job Offers", icon: "lucide:briefcase", desc: "Moderate recruiter listings" },
  { href: "/admin/quizzes", label: "Quizzes", icon: "lucide:clipboard-list", desc: "Monitor AI-generated tests" },
];

const ECOSYSTEM_PIPELINE = [
  {
    icon: "lucide:brain",
    title: "IA Matching Engine",
    desc: "Cosine similarity ranking between CVs and job offers",
    status: "Sprint 4",
    iconClass: "bg-primary/10 text-primary",
  },
  {
    icon: "lucide:message-square-text",
    title: "Explainable AI (XAI)",
    desc: "Transparent match explanations for recruiters & candidates",
    status: "Sprint 4",
    iconClass: "bg-secondary/10 text-secondary",
  },
  {
    icon: "lucide:github",
    title: "GitHub & Portfolio Sync",
    desc: "Proof-based hiring via BidigitalHub integration",
    status: "Sprint 5",
    iconClass: "bg-success/10 text-success",
  },
  {
    icon: "lucide:file-text",
    title: "CV NLP Parser",
    desc: "Automatic skill extraction from uploaded PDFs",
    status: "Sprint 4",
    iconClass: "bg-warning/10 text-warning",
  },
];

function ProgressBar({ value, colorClass = "bg-primary" }: { value: number; colorClass?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-default-100 mb-1">
      <div className={`h-full rounded-full transition-all duration-300 ${colorClass}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats()
      .then((res: StatsResponse) => setStats(res.stats))
      .catch((err: Error) => setError(err.message))
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

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Admin Dashboard"
        description="Global platform statistics, moderation queue & ecosystem health"
        breadcrumbs={[{ label: "Dashboard" }]}
      />

      {error && (
        <Card className="mb-6 border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </Card>
      )}

      {/* User statistics — live from DB */}
      {loading ? (
        <StatCardsSkeleton />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon="lucide:users" color="primary" />
            <StatCard label="Candidats" value={stats?.candidats ?? 0} icon="lucide:user-search" color="success" />
            <StatCard label="Recruteurs" value={stats?.recruteurs ?? 0} icon="lucide:briefcase" color="secondary" />
            <StatCard label="New This Week" value={stats?.newThisWeek ?? 0} icon="lucide:trending-up" color="warning" />
          </div>

          {/* Ecosystem stats — placeholders until Sprint 3+ models exist */}
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Job Offers"
              value={stats?.jobOffers ?? 0}
              icon="lucide:building-2"
              color="primary"
            />
            <StatCard
              label="Applications"
              value={stats?.applications ?? 0}
              icon="lucide:send"
              color="success"
            />
            <StatCard
              label="Quiz Results"
              value={stats?.quizResults ?? 0}
              icon="lucide:award"
              color="secondary"
            />
          </div>
        </>
      )}

      {/* Trust & moderation */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="border border-default-200 bg-content1 p-5 shadow-sm dark:border-default-100/20 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Icon icon="lucide:shield-check" className="size-5 text-success" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Platform Trust & Moderation</h2>
              <p className="text-xs text-default-500">Anti-Fake CV · profile verification · user safety</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-default-200 p-4 dark:border-default-100/20">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-default-600">Email verified</span>
                <span className="text-sm font-bold text-foreground">
                  {loading ? "—" : `${stats?.verifiedEmails ?? 0} / ${stats?.totalUsers ?? 0}`}
                </span>
              </div>
              <ProgressBar value={loading ? 0 : verificationRate} colorClass="bg-success" />
              <p className="text-xs text-default-400">{verificationRate}% of users verified</p>
            </div>

            <div className="rounded-xl border border-default-200 p-4 dark:border-default-100/20">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-default-600">Onboarding complete</span>
                <span className="text-sm font-bold text-foreground">
                  {loading ? "—" : `${stats?.onboardedUsers ?? 0} / ${stats?.totalUsers ?? 0}`}
                </span>
              </div>
              <ProgressBar value={loading ? 0 : onboardingRate} colorClass="bg-primary" />
              <p className="text-xs text-default-400">{onboardingRate}% chose their role</p>
            </div>

            <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 sm:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-danger/10">
                    <Icon icon="lucide:flag" className="size-5 text-danger" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Pending reports</p>
                    <p className="text-xs text-default-500">Users flagged for Fake CV or abuse</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-danger">
                    {loading ? "—" : stats?.pendingReports ?? 0}
                  </span>
                  <Button as={Link} href="/admin/reported" size="sm" variant="ghost">
                    Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-default-200 bg-content1 p-5 shadow-sm dark:border-default-100/20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Role Breakdown</h2>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 animate-pulse rounded-lg bg-default-100" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { label: "Candidats", value: stats?.candidats ?? 0, total: stats?.totalUsers ?? 1, color: "bg-success" },
                { label: "Recruteurs", value: stats?.recruteurs ?? 0, total: stats?.totalUsers ?? 1, color: "bg-secondary" },
                { label: "Admins", value: stats?.admins ?? 0, total: stats?.totalUsers ?? 1, color: "bg-danger" },
              ].map((item) => {
                const pct = stats?.totalUsers ? Math.round((item.value / stats.totalUsers) * 100) : 0;
                return (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-default-600">{item.label}</span>
                      <span className="font-medium text-foreground">
                        {item.value} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-default-100">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Bidirectional matching concept */}
      <Card className="mt-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon icon="lucide:git-compare-arrows" className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Bidirectional IA Matching</h2>
              <p className="mt-1 max-w-xl text-sm text-default-500">
                Recruteur → Candidat ranking & Candidat → Emploi recommendations powered by NLP
                embeddings and cosine similarity. XAI explanations will show why each match scored
                the way it did.
              </p>
            </div>
          </div>
          <Chip variant="soft" className="shrink-0 text-xs">
            AI Sprint — coming soon
          </Chip>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="border border-default-200 bg-content1 p-5 shadow-sm dark:border-default-100/20 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-start gap-3 rounded-xl border border-default-200 p-4 transition hover:border-primary/40 hover:bg-primary/5 dark:border-default-100/20"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon icon={link.icon} className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{link.label}</p>
                  <p className="text-xs text-default-500">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="border border-default-200 bg-content1 p-5 shadow-sm dark:border-default-100/20">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Ecosystem Pipeline</h2>
          <div className="space-y-3">
            {ECOSYSTEM_PIPELINE.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-lg border border-default-200 p-3 dark:border-default-100/20"
              >
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}>
                  <Icon icon={item.icon} className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <Chip size="sm" variant="soft" className="shrink-0 text-[10px]">
                      {item.status}
                    </Chip>
                  </div>
                  <p className="text-xs text-default-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 border border-default-200 bg-content1 shadow-sm dark:border-default-100/20">
        <div className="flex items-center justify-between border-b border-default-200 p-5 dark:border-default-100/20">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent Reports</h2>
            <p className="text-xs text-default-500">Users flagged for moderation review</p>
          </div>
          <Button as={Link} href="/admin/reported" size="sm" variant="ghost">
            View all
          </Button>
        </div>
        <div className="divide-y divide-default-100 dark:divide-default-100/10">
          {MOCK_REPORTS.map((report) => (
            <div key={report.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-danger/10 text-sm font-semibold text-danger">
                  {report.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{report.name}</p>
                  <p className="text-xs text-default-500">{report.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Chip size="sm" variant="soft">
                  {report.severity}
                </Chip>
                <span className="hidden text-xs text-default-400 sm:block">{report.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
