"use client";

import React from "react";
import Link from "next/link";
import { Card } from "./Card";
import { Button } from "./Button";
import { Chip } from "./Chip";

export interface RecommendedJob {
  company: string;
  title: string;
  match: number;
  salary: string;
  tags: string[];
}

interface RecommendedJobsProps {
  jobs: RecommendedJob[];
}

export default function RecommendedJobs({ jobs }: RecommendedJobsProps) {
  return (
    <div className="space-y-4">
      {jobs.map((job, idx) => (
        <Card key={idx} className="hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-200">
          <Card.Content className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-accent">{job.company}</span>
                <span className="text-default-300">•</span>
                <span className="text-xs text-default-450">{job.salary}</span>
              </div>
              <h4 className="font-bold text-base text-default-900 dark:text-default-50">{job.title}</h4>
              <div className="flex gap-1.5 mt-2">
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
              <Link href={`/candidate/jobs/${idx}`}>
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
