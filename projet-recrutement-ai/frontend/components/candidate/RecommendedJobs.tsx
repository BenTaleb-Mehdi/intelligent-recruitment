"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Chip } from "./Chip";

export interface RecommendedJob {
  id?: string;
  company: string;
  title: string;
  match: number;
  salary: string;
  tags: string[];
}

interface RecommendedJobsProps {
  jobs: RecommendedJob[];
  loading?: boolean;
}

export default function RecommendedJobs({ jobs, loading }: RecommendedJobsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-800/60" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
          <Icon icon="solar:bell-bold-duotone" className="size-6" />
        </div>
        <h4 className="font-bold text-sm text-default-900 dark:text-default-50">
          No job offers yet, stay alert!
        </h4>
        <p className="text-xs text-default-400 mt-1 max-w-sm">
          Recruiters have not published any job offers yet. As soon as new positions are uploaded, they will be matched here automatically.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job, idx) => (
        <Card key={job.id || idx} className="hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-200">
          <Card.Content className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-accent">{job.company}</span>
                <span className="text-default-300">•</span>
                <span className="text-xs text-default-450">{job.salary}</span>
              </div>
              <h4 className="font-bold text-base text-default-900 dark:text-default-50">{job.title}</h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {job.tags.map((t, i) => (
                  <Chip key={i} variant="soft">{t}</Chip>
                ))}
              </div>
            </div>
            <div className="flex sm:flex-col items-end gap-3 sm:gap-1.5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0 justify-between">
              <div className="text-right">
                <span className="text-sm font-bold text-success">{job.match}% Match</span>
                <p className="text-[10px] text-default-400 font-semibold uppercase">Compatibility</p>
              </div>
              <Link href={job.id ? `/candidate/jobs/${job.id}` : "/candidate/jobs"}>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </Link>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
}
