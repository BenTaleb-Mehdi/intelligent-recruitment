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
  const [statusFilter, setStatusFilter] = useState<string>("Toutes");
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [locationTypeFilter, setLocationTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
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
          createdAtRaw: o.createdAt,
          status: o.status === "OPEN" ? "Ouverte" : "Fermée",
          contractType: o.contractType,
          locationType: o.locationType,
          location: o.location,
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

  // Extract available distinct contract types and location types
  const availableContracts = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.contractType) set.add(j.contractType);
    });
    return Array.from(set);
  }, [jobs]);

  const availableLocationTypes = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.locationType) set.add(j.locationType);
    });
    return Array.from(set);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      // 1. Search Query: Matches title, contract type, or any skill name
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        job.title.toLowerCase().includes(q) ||
        (job.contractType && job.contractType.toLowerCase().includes(q)) ||
        (job.skills && job.skills.some((s) => s.name.toLowerCase().includes(q)));

      // 2. Status Filter
      const matchesStatus = statusFilter === "Toutes" || job.status === statusFilter;

      // 3. Contract Type Filter
      const matchesContract =
        contractFilter === "all" ||
        (job.contractType && job.contractType.toLowerCase() === contractFilter.toLowerCase());

      // 4. Location / Work Mode Filter
      const matchesLocation =
        locationTypeFilter === "all" ||
        (job.locationType && job.locationType.toLowerCase() === locationTypeFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesContract && matchesLocation;
    });

    // 5. Sort By
    result.sort((a, b) => {
      if (sortBy === "newest") {
        const dateA = a.createdAtRaw ? new Date(a.createdAtRaw).getTime() : 0;
        const dateB = b.createdAtRaw ? new Date(b.createdAtRaw).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === "oldest") {
        const dateA = a.createdAtRaw ? new Date(a.createdAtRaw).getTime() : 0;
        const dateB = b.createdAtRaw ? new Date(b.createdAtRaw).getTime() : 0;
        return dateA - dateB;
      }
      if (sortBy === "applicants-desc") {
        return (b.applicants || 0) - (a.applicants || 0);
      }
      if (sortBy === "applicants-asc") {
        return (a.applicants || 0) - (b.applicants || 0);
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return result;
  }, [jobs, searchQuery, statusFilter, contractFilter, locationTypeFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("Toutes");
    setContractFilter("all");
    setLocationTypeFilter("all");
    setSortBy("newest");
  };

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
        contractFilter={contractFilter}
        setContractFilter={setContractFilter}
        locationTypeFilter={locationTypeFilter}
        setLocationTypeFilter={setLocationTypeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        availableContracts={availableContracts}
        availableLocationTypes={availableLocationTypes}
        totalResults={filteredJobs.length}
        onResetFilters={handleResetFilters}
      />
      <JobsTable jobs={filteredJobs} onToggleStatus={toggleJobStatus} />
    </div>
  );
}
