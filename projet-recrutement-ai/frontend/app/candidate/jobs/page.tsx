"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Card } from "@/components/candidate/Card";
import { Button } from "@/components/candidate/Button";
import { Chip } from "@/components/candidate/Chip";
import Link from "next/link";
import SearchInput from "@/components/candidate/SearchInput";
import { api } from "@/lib/api";

export default function CandidateJobsFeed() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch candidate profile to get skills
        const profileRes: any = await api.get("/api/candidates/profile");
        let skillsList: string[] = [];
        if (profileRes.success && profileRes.data) {
          skillsList = profileRes.data.skills.map((s: any) => s.name.toLowerCase());
        }

        // Fetch jobs
        const jobsRes: any = await api.get("/api/job-offers");
        if (jobsRes.success && Array.isArray(jobsRes.data)) {
          const mappedJobs = jobsRes.data.map((job: any) => {
            const jobSkills = job.skills ? job.skills.map((s: any) => s.name.toLowerCase()) : [];
            // Calculate compatibility score
            let matchScore = 70;
            if (jobSkills.length > 0 && skillsList.length > 0) {
              const intersect = jobSkills.filter((s: any) => skillsList.includes(s));
              matchScore = Math.round((intersect.length / jobSkills.length) * 100);
              matchScore = Math.max(50, Math.min(100, matchScore));
            }
            return {
              id: job.id,
              title: job.title,
              company: job.recruiter?.companyName || "Unknown Company",
              location: job.location || "Hybrid",
              salary: job.salary || "$70k - $90k",
              experience: `${job.experienceYears}+ years`,
              matchScore: matchScore,
              tags: job.skills ? job.skills.map((s: any) => s.name) : [],
              description: job.description
            };
          });
          setJobs(mappedJobs);
        }
      } catch (err) {
        console.error("Error loading jobs feed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
      );
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [search, jobs]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Recommended Job Feed</h1>
          <p className="text-sm text-default-500">Discover and apply to roles automatically ranked by compatibility with your CV & GitHub profile.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 bg-accent-soft/20 text-accent rounded-full font-bold select-none">
            {filteredJobs.length} Positions Matching
          </span>
        </div>
      </div>

      {/* Filters block */}
      <div className="bg-white dark:bg-[#1f2633] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-850 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 select-none">
              <Icon icon="solar:magnifer-linear" className="w-3.5 h-3.5 text-blue-500" />
              Sourcing keywords, skills, or companies
            </label>
            <SearchInput
              placeholder="e.g. Next.js, FastAPI, Python, Developer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* AI Sorting Status Badge */}
          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800 self-end md:self-auto shrink-0 select-none">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">AI Sorting Engine</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                Highest Match First
                <Icon icon="solar:magic-stick-3-bold" className="w-3.5 h-3.5 text-purple-500" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Feed list */}
      <div className="space-y-5">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-200">
            <Card.Content className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-default-900 dark:text-default-50 leading-snug">{job.title}</h3>
                     <Chip color="default" variant="soft">{job.company}</Chip>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-default-450 font-medium">
                    <span className="flex items-center gap-1">
                      <Icon icon="solar:map-point-bold" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon="solar:dollar-minimalistic-bold" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon="solar:case-minimalistic-bold" />
                      {job.experience}
                    </span>
                  </div>
                </div>

                {/* Match score display */}
                <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between border-t sm:border-0 pt-3 sm:pt-0 border-default-100 dark:border-default-50/10">
                  <div className="text-right sm:text-right">
                    <span className={`text-sm font-bold ${job.matchScore >= 80 ? "text-success" : job.matchScore >= 60 ? "text-warning" : "text-danger"}`}>
                      {job.matchScore}% Match
                    </span>
                    <p className="text-[10px] text-default-400 font-semibold uppercase">AI Match Score</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${job.matchScore >= 80 ? "bg-success" : job.matchScore >= 60 ? "bg-warning" : "bg-danger"}`} />
                </div>
              </div>

              {/* Description preview */}
              <p className="text-xs text-default-550 leading-relaxed mt-4 line-clamp-2">
                {job.description}
              </p>

              {/* Tags and Action row */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex flex-wrap gap-1.5">
                  {(job.tags || []).map((t: string, idx: number) => (
                    <Chip key={idx} variant="soft">{t}</Chip>
                  ))}
                </div>
                <Link href={`/candidate/jobs/${job.id}`}>
                  <Button
                    size="sm"
                    variant={job.matchScore >= 80 ? "primary" : "outline"}
                    className="sm:w-auto text-center w-full"
                  >
                    View Application Matches
                  </Button>
                </Link>
              </div>
            </Card.Content>
          </Card>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#1f2633] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-default-400">
            <Icon icon="solar:box-search-broken" className="text-4xl mx-auto mb-3 text-default-300" />
            <p className="font-bold text-sm">No jobs match your query</p>
            <p className="text-xs text-default-500 mt-1">Try changing the keywords to find other compatible opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
}
