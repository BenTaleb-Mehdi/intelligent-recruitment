"use client";

import React from "react";
import Link from "next/link";
import { Card, Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";

const MOCK_REPORTED = [
  {
    id: "r1",
    userId: "usr-001",
    name: "John Smith",
    email: "john.smith@email.com",
    role: "candidat",
    reason: "Fake CV — skills don't match portfolio",
    reportedBy: "TechCorp HR",
    date: "09 Jul, 2026",
    status: "pending",
    severity: "high",
  },
  {
    id: "r2",
    userId: "usr-002",
    name: "Marie Dupont",
    email: "marie.d@email.com",
    role: "recruteur",
    reason: "Spam job listings — duplicate offers",
    reportedBy: "Platform Auto-detect",
    date: "08 Jul, 2026",
    status: "pending",
    severity: "medium",
  },
  {
    id: "r3",
    userId: "usr-003",
    name: "Alex Chen",
    email: "alex.chen@email.com",
    role: "candidat",
    reason: "Harassment reported by recruiter",
    reportedBy: "Sarah Johnson",
    date: "07 Jul, 2026",
    status: "reviewing",
    severity: "high",
  },
  {
    id: "r4",
    userId: "usr-004",
    name: "Lisa Wong",
    email: "lisa.w@email.com",
    role: "candidat",
    reason: "Profile photo inappropriate",
    reportedBy: "Admin review",
    date: "05 Jul, 2026",
    status: "resolved",
    severity: "low",
  },
];

const statusColor = (status: string): "default" | "success" | "danger" | "warning" | "accent" => {
  if (status === "pending") return "warning";
  if (status === "reviewing") return "accent";
  if (status === "resolved") return "success";
  return "default";
};

export default function ReportedUsersPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Reported Users"
        description="Review and moderate flagged user accounts"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Reported Users" },
        ]}
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Pending", count: 2, icon: "lucide:clock", color: "text-warning" },
          { label: "Under Review", count: 1, icon: "lucide:search", color: "text-primary" },
          { label: "Resolved", count: 1, icon: "lucide:check-circle", color: "text-success" },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="flex items-center gap-4 border border-default-200 bg-content1 p-4 shadow-sm dark:border-default-100/20"
          >
            <div className={`flex size-10 items-center justify-center rounded-xl bg-default-100 ${stat.color}`}>
              <Icon icon={stat.icon} className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.count}</p>
              <p className="text-xs text-default-500">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border border-default-200 bg-content1 shadow-sm dark:border-default-100/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-default-200 bg-default-50 dark:border-default-100/20 dark:bg-default-100/5">
                {["User", "Role", "Reason", "Reported By", "Date", "Severity", "Status", "Actions"].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-default-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_REPORTED.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-default-100 transition hover:bg-default-50 dark:border-default-100/10 dark:hover:bg-default-100/5"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-danger/10 text-xs font-semibold text-danger">
                        {report.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{report.name}</p>
                        <p className="text-xs text-default-400">{report.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Chip size="sm" variant="soft" color="default">
                      {report.role}
                    </Chip>
                  </td>
                  <td className="max-w-[200px] px-4 py-3 text-sm text-default-600">{report.reason}</td>
                  <td className="px-4 py-3 text-sm text-default-500">{report.reportedBy}</td>
                  <td className="px-4 py-3 text-sm text-default-500">{report.date}</td>
                  <td className="px-4 py-3">
                    <Chip
                      size="sm"
                      variant="soft"
                      color={report.severity === "high" ? "danger" : report.severity === "medium" ? "warning" : "default"}
                    >
                      {report.severity}
                    </Chip>
                  </td>
                  <td className="px-4 py-3">
                    <Chip size="sm" variant="soft" color={statusColor(report.status)}>
                      {report.status}
                    </Chip>
                  </td>
                  <td className="px-4 py-3">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="ghost">
                          <Icon icon="lucide:more-horizontal" className="size-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Report actions">
                        <DropdownItem
                          key="view"
                          onClick={() => router.push(`/admin/users/${report.userId}`)}
                        >
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:eye" className="size-4" />
                            <span>View user</span>
                          </div>
                        </DropdownItem>
                        <DropdownItem key="review">
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:search" className="size-4" />
                            <span>Mark reviewing</span>
                          </div>
                        </DropdownItem>
                        <DropdownItem key="ban">
                          <div className="flex items-center gap-2 text-danger">
                            <Icon icon="lucide:ban" className="size-4" />
                            <span>Suspend account</span>
                          </div>
                        </DropdownItem>
                        <DropdownItem key="dismiss">
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:x" className="size-4" />
                            <span>Dismiss report</span>
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
