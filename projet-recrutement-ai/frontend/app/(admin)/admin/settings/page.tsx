"use client";

import React from "react";
import Link from "next/link";
import { Card, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import PageHeader from "@/components/admin/PageHeader";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { authClient } from "@/lib/auth-client";

const ADMIN_AREAS = [
  { href: "/admin/users", label: "User Management", description: "Inspect user accounts, roles, and onboarding status", icon: "lucide:users" },
  { href: "/admin/reported", label: "Moderation Queue", description: "Review reported accounts and platform issues", icon: "lucide:shield-alert" },
  { href: "/admin/jobs", label: "Job Moderation", description: "Monitor active and closed job offers", icon: "lucide:briefcase" },
  { href: "/admin/quizzes", label: "Quiz Management", description: "Review results and control quiz publication status", icon: "lucide:clipboard-check" },
];

export default function AdminSettingsPage() {
  const { data: session } = authClient.useSession();
  const { resolvedTheme } = useTheme();

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Admin Settings"
        description="Manage your administrator workspace and access platform controls"
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Settings" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border border-default-200 bg-content1 p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon icon="lucide:shield-check" className="size-5" /></div>
            <div><h2 className="font-semibold">Administrator account</h2><p className="text-sm text-default-500">Your current authenticated identity</p></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-default-50 p-4"><p className="text-xs text-default-400">Name</p><p className="mt-1 font-semibold">{session?.user?.name || "Admin"}</p></div>
            <div className="rounded-xl bg-default-50 p-4"><p className="text-xs text-default-400">Email</p><p className="mt-1 break-all font-semibold">{session?.user?.email || "—"}</p></div>
          </div>
        </Card>

        <Card className="border border-default-200 bg-content1 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-xs text-default-400">Access level</p><p className="mt-1 font-semibold">Platform administrator</p></div>
            <Chip color="success" variant="soft">Active</Chip>
          </div>
          <div className="mt-5 border-t border-default-200 pt-5">
            <div className="flex items-center justify-between gap-4">
              <div><p className="font-medium">Appearance</p><p className="text-xs capitalize text-default-500">{resolvedTheme || "light"} mode</p></div>
              <ThemeToggleButton />
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6 border border-default-200 bg-content1 p-6 shadow-sm">
        <div className="mb-5"><h2 className="text-lg font-semibold">Platform controls</h2><p className="text-sm text-default-500">Quick access to administrator-only areas</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {ADMIN_AREAS.map((area) => (
            <Link key={area.href} href={area.href} className="group flex items-center gap-4 rounded-xl border border-default-200 p-4 transition hover:border-primary/40 hover:bg-primary/5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-default-100 text-primary"><Icon icon={area.icon} className="size-5" /></div>
              <div className="min-w-0 flex-1"><p className="font-semibold">{area.label}</p><p className="text-xs text-default-500">{area.description}</p></div>
              <Icon icon="lucide:chevron-right" className="size-4 text-default-300 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </Card>

      <div className="mt-6 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-warning-700">
        <div className="flex gap-3"><Icon icon="lucide:info" className="mt-0.5 size-5 shrink-0" /><p>Role changes, account suspension, report rules, and global platform configuration will be enabled only after their protected backend operations are available. This page does not expose non-functional destructive controls.</p></div>
      </div>
    </div>
  );
}
