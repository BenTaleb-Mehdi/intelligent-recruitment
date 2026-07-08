"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Card } from "@/components/charts/molecules/Card";
import { Button } from "@/components/charts/atoms/Button";
import { Chip } from "@/components/charts/atoms/Chip";
import { Slider } from "@/components/charts/atoms/Slider";
import Link from "next/link";
import SearchInput from "@/components/charts/atoms/SearchInput";

const JOBS_DATA = [
  {
    id: "0",
    title: "Senior React & Next.js Engineer",
    company: "ViteTech Solutions",
    location: "Paris, France (Hybrid)",
    salary: "$85k - $110k",
    experience: "5+ years",
    matchScore: 98,
    tags: ["Next.js", "HeroUI", "Tailwind CSS", "TypeScript", "React 19"],
    description: "Looking for an expert Frontend Architect to design our Next.js design system framework. Responsibilities include building highly performant dashboards, loading components optimization, and type safety compliance.",
  },
  {
    id: "1",
    title: "Lead Frontend Systems Engineer",
    company: "CognitiveAI Systems",
    location: "Remote (Europe)",
    salary: "$100k - $130k",
    experience: "6+ years",
    matchScore: 89,
    tags: ["React 19", "Typescript", "GraphQL", "Python", "Ray Serve"],
    description: "Join our core team linking LLM outputs to responsive, client-side React frameworks. Experience integrating client services, FastAPI, and client-side data state managers is a plus.",
  },
  {
    id: "2",
    title: "Full Stack JavaScript Developer",
    company: "ReSync Tech Labs",
    location: "Lyon, France",
    salary: "$65k - $80k",
    experience: "3+ years",
    matchScore: 78,
    tags: ["Node.js", "Express", "Prisma", "MySQL", "Next.js"],
    description: "Help connect our SQL-relational schemas and prisma models to frontend app dashboards. Maintain and optimize database queries and serverless API endpoints.",
  },
  {
    id: "3",
    title: "ML / Backend Engineer",
    company: "Vector Recruitment",
    location: "Paris, France (On-site)",
    salary: "$90k - $120k",
    experience: "4+ years",
    matchScore: 54,
    tags: ["Python", "TensorFlow", "FastAPI", "MongoDB", "Ray"],
    description: "Optimize our AI-based candidate matching engine using Cosine similarity models and embeddings generation. Spring Boot or Node.js middleware knowledge helpful.",
  },
];

export default function CandidateJobsFeed() {
  const [search, setSearch] = useState("");
  const [minMatch, setMinMatch] = useState(60);

  const filteredJobs = useMemo(() => {
    return JOBS_DATA.filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchScoreVal = job.matchScore >= minMatch;
      return matchSearch && matchScoreVal;
    });
  }, [search, minMatch]);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-white dark:bg-[#1f2633] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="md:col-span-2 space-y-1.5">
          <span className="text-xs font-semibold text-default-500 select-none">Search keywords, skills, companies</span>
          <SearchInput
            placeholder="e.g. Next.js, ViteTech, Developer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Min Match Rating */}
        <div className="space-y-1.5 pb-0.5">
          <div className="flex justify-between select-none">
            <span className="text-xs font-semibold text-default-500">Min Compatibility</span>
            <span className="text-xs font-bold text-accent">{minMatch}% Match</span>
          </div>
          <input
            type="range"
            min="30"
            max="95"
            value={minMatch}
            onChange={(e) => setMinMatch(Number(e.target.value))}
            className="w-full cursor-pointer accent-accent py-2"
          />
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
                  {job.tags.map((t, idx) => (
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
            <p className="font-bold text-sm">No jobs match your active filters</p>
            <p className="text-xs text-default-500 mt-1">Try lowering the minimum compatibility limit or changing the keyword query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
