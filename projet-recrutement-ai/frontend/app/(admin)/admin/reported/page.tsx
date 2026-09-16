"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import {
  fetchAdminReports,
  updateAdminReportStatus,
  type AdminReport,
  type AdminReportStatus,
} from "@/services/adminService";

const statusColor = (status: AdminReportStatus): "default" | "success" | "danger" | "warning" | "accent" => {
  if (status === "PENDING") return "warning";
  if (status === "REVIEWING") return "accent";
  if (status === "RESOLVED") return "success";
  if (status === "DISMISSED") return "danger";
  return "default";
};

const displayStatus = (status: AdminReportStatus) => status.charAt(0) + status.slice(1).toLowerCase();

const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
}).format(new Date(value));

export default function ReportedUsersPage() {
  const router = useRouter();
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await fetchAdminReports();
      setReports(response.data);
      setError(null);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const counts = useMemo(() => ({
    PENDING: reports.filter((report) => report.status === "PENDING").length,
    REVIEWING: reports.filter((report) => report.status === "REVIEWING").length,
    RESOLVED: reports.filter((report) => report.status === "RESOLVED").length,
  }), [reports]);

  const changeStatus = async (id: string, status: AdminReportStatus) => {
    setUpdatingId(id);
    try {
      const response = await updateAdminReportStatus(id, status);
      setReports((current) => current.map((report) => report.id === id ? response.data : report));
      setError(null);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Failed to update report");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReportAction = (report: AdminReport, action: React.Key) => {
    switch (String(action)) {
      case "view":
        router.push(`/admin/users/${report.reportedUser.id}`);
        break;
      case "review":
        void changeStatus(report.id, "REVIEWING");
        break;
      case "resolve":
        void changeStatus(report.id, "RESOLVED");
        break;
      case "dismiss":
        void changeStatus(report.id, "DISMISSED");
        break;
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Reported Users"
        description="Review and moderate flagged user accounts"
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Reported Users" }]}
      />

      {error && (
        <Card className="mb-4 flex flex-row items-center justify-between gap-4 border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          <span>{error}</span>
          <Button size="sm" variant="ghost" onPress={loadReports}>Retry</Button>
        </Card>
      )}

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Pending", count: counts.PENDING, icon: "lucide:clock", color: "text-warning" },
          { label: "Under Review", count: counts.REVIEWING, icon: "lucide:search", color: "text-primary" },
          { label: "Resolved", count: counts.RESOLVED, icon: "lucide:check-circle", color: "text-success" },
        ].map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4 border border-default-200 bg-content1 p-4 shadow-sm dark:border-default-100/20">
            <div className={`flex size-10 items-center justify-center rounded-xl bg-default-100 ${stat.color}`}><Icon icon={stat.icon} className="size-5" /></div>
            <div><p className="text-2xl font-bold text-foreground">{stat.count}</p><p className="text-xs text-default-500">{stat.label}</p></div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border border-default-200 bg-content1 shadow-sm dark:border-default-100/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead><tr className="border-b border-default-200 bg-default-50 dark:border-default-100/20 dark:bg-default-100/5">
              {["User", "Role", "Reason", "Reported By", "Date", "Severity", "Status", "Actions"].map((col) => <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-default-500">{col}</th>)}
            </tr></thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-default-100 transition hover:bg-default-50 dark:border-default-100/10 dark:hover:bg-default-100/5">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-full bg-danger/10 text-xs font-semibold text-danger">{report.reportedUser.name.charAt(0)}</div><div><p className="text-sm font-medium text-foreground">{report.reportedUser.name}</p><p className="text-xs text-default-400">{report.reportedUser.email}</p></div></div></td>
                  <td className="px-4 py-3"><Chip size="sm" variant="soft" color="default">{report.reportedUser.role}</Chip></td>
                  <td className="max-w-[200px] px-4 py-3 text-sm text-default-600">{report.reason}</td>
                  <td className="px-4 py-3 text-sm text-default-500">{report.reporterUser.name}</td>
                  <td className="px-4 py-3 text-sm text-default-500">{formatDate(report.createdAt)}</td>
                  <td className="px-4 py-3"><Chip size="sm" variant="soft" color={report.severity === "HIGH" ? "danger" : report.severity === "MEDIUM" ? "warning" : "default"}>{report.severity.toLowerCase()}</Chip></td>
                  <td className="px-4 py-3"><Chip size="sm" variant="soft" color={statusColor(report.status)}>{displayStatus(report.status)}</Chip></td>
                  <td className="px-4 py-3"><Dropdown><DropdownTrigger><Button isIconOnly size="sm" variant="ghost"><Icon icon="lucide:more-horizontal" className="size-4" /></Button></DropdownTrigger><DropdownMenu aria-label="Report actions" onAction={(action) => handleReportAction(report, action)}>
                    <DropdownItem key="view"><div className="flex items-center gap-2"><Icon icon="lucide:eye" className="size-4" /><span>View user</span></div></DropdownItem>
                    <DropdownItem key="review" isDisabled={updatingId === report.id || report.status === "REVIEWING"}><div className="flex items-center gap-2"><Icon icon="lucide:search" className="size-4" /><span>Mark reviewing</span></div></DropdownItem>
                    <DropdownItem key="resolve" isDisabled={updatingId === report.id}><div className="flex items-center gap-2 text-success"><Icon icon="lucide:check" className="size-4" /><span>Resolve report</span></div></DropdownItem>
                    <DropdownItem key="dismiss" isDisabled={updatingId === report.id}><div className="flex items-center gap-2"><Icon icon="lucide:x" className="size-4" /><span>Dismiss report</span></div></DropdownItem>
                  </DropdownMenu></Dropdown></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div className="px-6 py-14 text-center text-sm text-default-500">Loading reports...</div>}
        {!loading && reports.length === 0 && <div className="px-6 py-14 text-center text-sm text-default-500">No reports have been submitted.</div>}
      </Card>
    </div>
  );
}
