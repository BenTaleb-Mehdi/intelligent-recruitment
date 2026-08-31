"use client";

<<<<<<< HEAD
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, Button, Chip, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import PageHeader from "@/components/admin/PageHeader";
import { apiFetch, type ApiJobOffer } from "@/lib/api";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<ApiJobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ success: boolean; data: ApiJobOffer[] }>("/api/job-offers");
      if (res.success && Array.isArray(res.data)) {
        setJobs(res.data);
      }
    } catch (err: any) {
      console.error("Error fetching job offers:", err);
      setError(err.message || "Failed to fetch job offers from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const toggleJobStatus = async (id: string) => {
    try {
      await apiFetch(`/api/job-offers/${id}/toggle-status`, { method: "PATCH" });
      loadJobs();
    } catch (err: any) {
      alert(err.message || "Failed to update job status");
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job offer?")) return;
    try {
      await apiFetch(`/api/job-offers/${id}`, { method: "DELETE" });
      loadJobs();
    } catch (err: any) {
      alert(err.message || "Failed to delete job offer");
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        search === "" ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        (job.recruiter?.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
        (job.location || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const openCount = jobs.filter((j) => j.status === "OPEN").length;
  const closedCount = jobs.filter((j) => j.status === "CLOSED").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Job Offers Moderation"
        description="Monitor, approve, and moderate real job listings posted by recruiters"
=======
import React from "react";
import { Card, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import PageHeader from "@/components/admin/PageHeader";

export default function AdminJobsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Job Offers"
        description="Moderate and manage job listings on the platform"
>>>>>>> 90525170874bf82114ff0e60a532cde0614c93da
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Job Offers" },
        ]}
      />

<<<<<<< HEAD
      {error && (
        <Card className="border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </Card>
      )}

      {/* Header Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-default-200 bg-content1 p-4 shadow-sm dark:border-default-100/20">
          <p className="text-xs font-medium text-default-500">Total Offers</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{loading ? "—" : jobs.length}</p>
        </Card>
        <Card className="border border-default-200 bg-content1 p-4 shadow-sm dark:border-default-100/20">
          <p className="text-xs font-medium text-default-500">Active Listings</p>
          <p className="mt-1 text-2xl font-bold text-success">{loading ? "—" : openCount}</p>
        </Card>
        <Card className="border border-default-200 bg-content1 p-4 shadow-sm dark:border-default-100/20">
          <p className="text-xs font-medium text-default-500">Closed Listings</p>
          <p className="mt-1 text-2xl font-bold text-default-400">{loading ? "—" : closedCount}</p>
        </Card>
      </div>

      {/* Main Content Table / Card Container */}
      <Card className="overflow-hidden border border-default-200 bg-content1 shadow-sm dark:border-default-100/20">
        <div className="border-b border-default-200 p-4 dark:border-default-100/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative max-w-md flex-1 flex items-center">
              <Icon icon="lucide:search" className="pointer-events-none absolute left-3 size-4 text-default-400" />
              <input
                placeholder="Search by job title, company, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-default-200 bg-default-50 py-2 pl-9 pr-8 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-default-100/20 dark:bg-default-100/10"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 text-default-400 hover:text-default-600"
                  aria-label="Clear"
                >
                  <Icon icon="lucide:x" className="size-3.5" />
                </button>
              )}
            </div>

            {/* Filter by status */}
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-lg border border-default-200 bg-content1 px-3 text-sm font-medium text-foreground outline-none dark:border-default-100/20"
                aria-label="Filter status"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open Only</option>
                <option value="CLOSED">Closed Only</option>
              </select>

              <Button size="sm" variant="ghost" onPress={loadJobs} aria-label="Refresh">
                <Icon icon="lucide:refresh-cw" className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Spinner size="lg" color="accent" />
          </div>
        ) : filteredJobs.length === 0 ? (
          /* Empty State — as requested: "no job offers yet stay alert" */
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Icon icon="lucide:briefcase" className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No job offers yet, stay alert!</h3>
            <p className="mt-1.5 max-w-sm text-xs text-default-500">
              Recruiters haven&apos;t posted any job offers matching your criteria. Once new listings are published, they will show up here automatically.
            </p>
          </div>
        ) : (
          /* Table of real job offers */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-default-200 bg-default-50 text-left text-xs font-semibold text-default-500 uppercase tracking-wider dark:border-default-100/20 dark:bg-default-100/5">
                  <th className="p-4">Title &amp; Company</th>
                  <th className="p-4">Type &amp; Location</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applications</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-100 dark:divide-default-100/10 text-sm">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="transition hover:bg-default-50/50 dark:hover:bg-default-100/5">
                    <td className="p-4 font-medium text-foreground">
                      <div className="font-semibold">{job.title}</div>
                      <div className="text-xs text-default-400">
                        {job.recruiter?.companyName || "Company"}
                      </div>
                    </td>
                    <td className="p-4 text-default-600">
                      <div>{job.contractType} · {job.locationType}</div>
                      <div className="text-xs text-default-400">{job.location || "Remote"}</div>
                    </td>
                    <td className="p-4 text-default-600">
                      {job.experienceYears} {job.experienceYears === 1 ? "year" : "years"}
                    </td>
                    <td className="p-4">
                      <Chip
                        size="sm"
                        variant="soft"
                        color={job.status === "OPEN" ? "success" : "default"}
                      >
                        {job.status}
                      </Chip>
                    </td>
                    <td className="p-4 font-semibold text-foreground">
                      {job._count?.applications ?? job.applications?.length ?? 0}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onPress={() => toggleJobStatus(job.id)}
                          aria-label="Toggle Status"
                        >
                          <Icon
                            icon={job.status === "OPEN" ? "lucide:pause-circle" : "lucide:play-circle"}
                            className="size-4"
                          />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger-soft"
                          onPress={() => deleteJob(job.id)}
                          aria-label="Delete Offer"
                        >
                          <Icon icon="lucide:trash-2" className="size-4 text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
=======
      <Card className="flex flex-col items-center justify-center border border-dashed border-default-300 bg-content1 px-6 py-20 text-center dark:border-default-100/30">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <Icon icon="lucide:briefcase" className="size-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Job moderation coming soon</h2>
        <p className="mt-2 max-w-md text-sm text-default-500">
          Once the JobOffer model is added in Sprint 3, you&apos;ll be able to approve, reject, and
          monitor all job listings here.
        </p>
        <Button className="mt-6" variant="flat" color="primary" isDisabled>
          No offers yet
        </Button>
>>>>>>> 90525170874bf82114ff0e60a532cde0614c93da
      </Card>
    </div>
  );
}
