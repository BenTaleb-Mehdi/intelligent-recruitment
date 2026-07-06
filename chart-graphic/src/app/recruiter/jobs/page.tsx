"use client";

import React, { useState, useMemo } from "react";
import JobsHeader from "@/components/recruiter/jobs-header";
import JobsFilters from "@/components/recruiter/jobs-filters";
import JobsTable, { JobOffer } from "@/components/recruiter/jobs-table";

const INITIAL_JOBS: JobOffer[] = [
  { id: "1", title: "Développeur Fullstack Node/Next.js", date: "28 Juin 2026", status: "Ouverte", applicants: 32 },
  { id: "2", title: "UI/UX Designer Senior", date: "24 Juin 2026", status: "Ouverte", applicants: 18 },
  { id: "3", title: "DevOps Engineer AWS/Docker", date: "15 Juin 2026", status: "Fermée", applicants: 12 },
  { id: "4", title: "Product Manager Tech", date: "10 Juin 2026", status: "Ouverte", applicants: 8 },
  { id: "5", title: "Développeur React Native", date: "01 Juin 2026", status: "Fermée", applicants: 24 },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>(INITIAL_JOBS);
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
