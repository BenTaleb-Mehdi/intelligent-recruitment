"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Card } from "@/components/charts/molecules/Card";
import { Button } from "@/components/charts/atoms/Button";

interface ActionChecklistProps {
  cvUploaded: boolean;
  githubConnected: boolean;
  hasPendingQuiz: boolean;
  cvFileName?: string;
  githubRepoCount?: number;
  githubPrimaryLanguage?: string;
  pendingQuizTitle?: string;
}

export default function ActionChecklist({
  cvUploaded,
  githubConnected,
  hasPendingQuiz,
  cvFileName = "Mehdi_Ben_Taleb_CV.pdf",
  githubRepoCount = 14,
  githubPrimaryLanguage = "TypeScript",
  pendingQuizTitle = "React core evaluation assigned by ViteTech.",
}: ActionChecklistProps) {
  return (
    <Card>
      <Card.Content className="p-5 space-y-4 font-sans">
        {/* CV Checklist Item */}
        <div className="flex items-start gap-3">
          <div className={`p-1.5 rounded-lg mt-0.5 ${cvUploaded ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
            <Icon icon={cvUploaded ? "solar:check-circle-bold" : "solar:bill-cross-bold"} className="text-base" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-default-800 dark:text-default-200">Upload CV (PDF)</h5>
            <p className="text-xs text-default-450 mt-0.5">
              {cvUploaded ? `AI parsing complete. 24 skills extracted.` : "Please upload your resume to enable AI profile matching."}
            </p>
          </div>
        </div>

        {/* GitHub Checklist Item */}
        <div className="flex items-start gap-3">
          <div className={`p-1.5 rounded-lg mt-0.5 ${githubConnected ? "bg-success/15 text-success" : "bg-slate-100 text-slate-400"}`}>
            <Icon icon={githubConnected ? "solar:check-circle-bold" : "solar:link-broken-linear"} className="text-base" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-default-800 dark:text-default-200">GitHub Synchronization</h5>
            <p className="text-xs text-default-450 mt-0.5">
              {githubConnected 
                ? `Synced ${githubRepoCount} repositories. Top language: ${githubPrimaryLanguage}.`
                : "Connect your GitHub account to sync verified repository code."
              }
            </p>
          </div>
        </div>

        {/* Quiz Checklist Item */}
        <div className="flex items-start gap-3">
          <div className={`p-1.5 rounded-lg mt-0.5 ${hasPendingQuiz ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`}>
            <Icon 
              icon={hasPendingQuiz ? "solar:bell-bold" : "solar:check-circle-bold"} 
              className={`text-base ${hasPendingQuiz ? "animate-bounce" : ""}`} 
            />
          </div>
          <div>
            <h5 className="text-sm font-bold text-default-800 dark:text-default-200">Complete AI Tech Quiz</h5>
            <p className="text-xs text-default-450 mt-0.5">
              {hasPendingQuiz ? pendingQuizTitle : "All assigned assessments are successfully completed."}
            </p>
            {hasPendingQuiz && (
              <Link href="/candidate/quizzes">
                <Button size="sm" variant="primary" className="mt-2.5">
                  Start Quiz Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
