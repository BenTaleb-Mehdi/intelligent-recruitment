"use client";

import React, { useState, useMemo } from "react";
import JobsHeader from "@/components/recruiter/jobs-header";
import JobsFilters from "@/components/recruiter/jobs-filters";
import JobsTable, { JobOffer } from "@/components/recruiter/jobs-table";
import jobsData from "@/data/jobs.json";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>(jobsData.jobs as JobOffer[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Toutes" | "Ouverte" | "Fermée">("Toutes");

  // Filter logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "Toutes" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  // Toggle status action
  const toggleJobStatus = (id: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === id
          ? { ...job, status: job.status === "Ouverte" ? "Fermée" : "Ouverte" }
          : job
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Header */}
      <JobsHeader />

      {/* Section 2: Search Bar & Dropdown Select Filters */}
      <JobsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Section 3: Interactive Jobs Table */}
      <JobsTable 
        jobs={filteredJobs} 
        onToggleStatus={toggleJobStatus} 
      />
    </div>
  );
}
