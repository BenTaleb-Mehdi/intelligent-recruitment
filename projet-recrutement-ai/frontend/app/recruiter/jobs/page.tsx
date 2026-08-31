"use client";

import React, { useState, useMemo, useEffect } from "react";
import JobsHeader from "@/components/recruiter/jobs-header";
import JobsFilters from "@/components/recruiter/jobs-filters";
import JobsTable, { JobOffer } from "@/components/recruiter/jobs-table";
import { api, ApiJobOffer, ApiRecruiter } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Toutes" | "Ouverte" | "Fermée">("Toutes");
  const [recruiterId, setRecruiterId] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (!session?.user?.id) return;

        const { data: recruiters } = await api.get<{ data: ApiRecruiter[] }>("/api/recruiters");
        const recruiter = recruiters?.find((r) => r.userId === session.user.id);
        if (!recruiter) return;

        setRecruiterId(recruiter.id);

        const { data: offers } = await api.get<{ data: ApiJobOffer[] }>(
          `/api/job-offers?recruiterId=${recruiter.id}`
        );

        const mapped: JobOffer[] = (offers || []).map((o) => ({
          id: o.id,
          title: o.title,
          date: new Date(o.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          status: o.status === "OPEN" ? "Ouverte" : "Fermée",
          applicants: o._count?.applications || 0,
          skills: o.skills,
          recruiterId: o.recruiterId,
        }));

        setJobs(mapped);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "Toutes" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  const toggleJobStatus = async (id: string) => {
    try {
      const { data: updated } = await api.patch<{ data: ApiJobOffer }>(
        `/api/job-offers/${id}/toggle-status`
      );
      if (updated) {
        setJobs((prev) =>
          prev.map((job) =>
            job.id === id
              ? { ...job, status: updated.status === "OPEN" ? "Ouverte" : "Fermée" }
              : job
          )
        );
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <JobsHeader />
      <JobsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <JobsTable jobs={filteredJobs} onToggleStatus={toggleJobStatus} />
    </div>
  );
}
