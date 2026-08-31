"use client";

import React, { useState, useEffect } from "react";
import ApplicationProgressCard from "@/components/candidate/ApplicationProgressCard";
import { api } from "@/lib/api";
import { Icon } from "@iconify/react";

export default function CandidateApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const res: any = await api.get("/api/candidates/applications");
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((app: any) => {
            const appliedDateStr = new Date(app.appliedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            });
            let status = "quiz-pending";
            let statusLabel = "Technical Assessment Assigned";
            if (app.status === "REJECTED") {
              status = "rejected";
              statusLabel = "Archived Processes";
            } else if (app.status === "INTERVIEW") {
              status = "interviewing";
              statusLabel = "Panel Interview Scheduled";
            } else if (app.status === "VALIDATED") {
              status = "passed";
              statusLabel = "Assessment Passed";
            }
            
            const steps = [
              { name: "Application Submitted", date: appliedDateStr, done: true },
              { name: "AI Resume Verification", date: appliedDateStr, done: true },
              { 
                name: "Skills Assessment (Quiz)", 
                date: app.status === "REJECTED" ? "Finished" : (app.status === "NEW" ? "Pending" : "Completed"), 
                done: app.status !== "NEW" 
              },
              { 
                name: "Final Interview Scheduling", 
                date: app.status === "INTERVIEW" ? "Scheduled" : "-", 
                done: app.status === "INTERVIEW",
                current: app.status === "INTERVIEW" 
              },
            ];

            return {
              id: app.id,
              candidateId: app.candidateId,
              company: app.jobOffer?.recruiter?.companyName || "Unknown Company",
              role: app.jobOffer?.title || "Position",
              appliedDate: appliedDateStr,
              status,
              statusLabel,
              matchScore: app.matchScore || 70,
              steps
            };
          });
          setApplications(mapped);
        }
      } catch (err) {
        console.error("Error loading applications:", err);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications Tracking</h1>
        <p className="text-sm text-default-500">Monitor your recruitment processes milestones, view assessment statuses, and track next actions.</p>
      </div>

      {/* Main List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-24 text-default-450 font-bold">
            <Icon icon="solar:spinner-bold" className="animate-spin text-3xl mx-auto mb-2 text-accent" />
            Loading Applications...
          </div>
        ) : applications.length > 0 ? (
          applications.map((app, idx) => (
            <ApplicationProgressCard key={idx} application={app} />
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#1f2633] rounded-2xl border border-slate-200/80 dark:border-slate-850 shadow-sm text-default-400">
            <Icon icon="solar:folder-open-broken" className="text-4xl mx-auto mb-3 text-default-300" />
            <p className="font-bold text-sm">No applications submitted yet</p>
            <p className="text-xs text-default-500 mt-1">Explore job openings in the Job Feed and apply to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
