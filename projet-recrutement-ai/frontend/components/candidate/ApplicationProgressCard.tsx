"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Indicator } from "./Indicator";

export interface ApplicationStep {
  name: string;
  date: string;
  done: boolean;
  current?: boolean;
}

export interface Application {
  company: string;
  role: string;
  appliedDate: string;
  status: string; // "quiz-pending" | "interviewing" | "rejected" | other statuses
  statusLabel: string;
  matchScore: number;
  steps: ApplicationStep[];
}

interface ApplicationProgressCardProps {
  application: Application;
}

export default function ApplicationProgressCard({ application }: ApplicationProgressCardProps) {
  return (
    <Card>
      <Card.Content className="p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-center">
          {/* Job Info & Status Column */}
          <div className="space-y-2 lg:max-w-xs w-full">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-accent">{application.company}</span>
              <span className="text-default-300">•</span>
              <span className="text-xs text-default-450">{application.appliedDate}</span>
            </div>
            <h3 className="text-base font-bold text-default-900 dark:text-default-50">{application.role}</h3>
            <div className="pt-2">
              {application.status === "quiz-pending" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-danger-soft/10 text-danger rounded-full text-xs font-bold">
                  <Indicator status="danger" pulse />
                  {application.statusLabel}
                </div>
              )}
              {application.status === "interviewing" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-soft/10 text-success rounded-full text-xs font-bold">
                  <Indicator status="success" pulse />
                  {application.statusLabel}
                </div>
              )}
              {application.status !== "quiz-pending" && application.status !== "interviewing" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-default-100 dark:bg-default-800 text-default-500 rounded-full text-xs font-bold">
                  <Indicator status="default" pulse={false} />
                  {application.statusLabel}
                </div>
              )}
            </div>
          </div>

          {/* Vertical Process Timeline */}
          <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-4 md:items-center md:justify-around border-t lg:border-t-0 lg:border-l border-default-100 dark:border-default-50/10 pt-4 lg:pt-0 lg:pl-6">
            {application.steps.map((step, sIdx) => (
              <div key={sIdx} className="flex md:flex-col items-center md:items-center gap-3 md:gap-1.5 text-center relative">
                <div className={[
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm shrink-0",
                  step.done
                    ? "bg-success text-white"
                    : step.current
                      ? "bg-accent text-white animate-pulse"
                      : "bg-default-100 dark:bg-default-805 text-default-400 border border-slate-200 dark:border-slate-800",
                ].join(" ")}>
                  {step.done ? (
                    <Icon icon="solar:check-circle-bold" className="text-base" />
                  ) : (
                    <span>{sIdx + 1}</span>
                  )}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${step.done || step.current ? "text-default-800 dark:text-default-200" : "text-default-400"}`}>
                    {step.name}
                  </p>
                  <p className="text-[10px] text-default-450 mt-0.5">{step.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions column */}
          <div className="flex lg:flex-col items-end gap-3 self-stretch lg:self-auto justify-between lg:justify-center border-t lg:border-0 pt-4 lg:pt-0 border-default-105 dark:border-default-50/10">
            <div className="text-right hidden lg:block">
              <span className="text-sm font-bold text-accent">{application.matchScore}% Score</span>
            </div>
            {application.status === "quiz-pending" ? (
              <Link href="/candidate/quizzes/react-core-eval">
                <Button
                  size="sm"
                  variant="primary"
                  startIcon="solar:clipboard-list-bold"
                >
                  Take Quiz
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                variant="outline"
                startIcon="solar:chat-round-bold"
              >
                Contact Hiring
              </Button>
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
