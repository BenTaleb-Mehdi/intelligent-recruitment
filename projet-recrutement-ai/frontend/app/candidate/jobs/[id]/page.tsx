"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Card } from "@/components/candidate/Card";
import { Button } from "@/components/candidate/Button";
import { Chip } from "@/components/candidate/Chip";
import { Alert } from "@/components/candidate/Alert";
import { api } from "@/lib/api";

export default function CandidateJobDetails() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);

  const loadJobDetails = async () => {
    try {
      // 1. Fetch Candidate Profile to compare skills
      const profileRes: any = await api.get("/api/candidates/profile");
      let skillsList: string[] = [];
      if (profileRes.success && profileRes.data) {
        skillsList = profileRes.data.skills.map((s: any) => s.name.toLowerCase());
      }

      // 2. Fetch Job Details
      const jobRes: any = await api.get(`/api/job-offers/${params.id}`);
      if (jobRes.success && jobRes.data) {
        const jd = jobRes.data;
        const jobSkills = jd.skills ? jd.skills.map((s: any) => s.name.toLowerCase()) : [];

        // Calculate dynamic matching compatibility score
        let matchScore = 70;
        if (jobSkills.length > 0 && skillsList.length > 0) {
          const intersect = jobSkills.filter((s: any) => skillsList.includes(s));
          matchScore = Math.round((intersect.length / jobSkills.length) * 100);
          matchScore = Math.max(50, Math.min(100, matchScore));
        }

        // Generate matching points based on candidate skills
        const reasons = jd.skills
          ? jd.skills
              .filter((s: any) => skillsList.includes(s.name.toLowerCase()))
              .map((s: any) => `Your profile matching tags include: ${s.name}`)
          : [];
        if (reasons.length === 0) {
          reasons.push("Your profile matches general standard developer profiles.");
        }

        // Generate skill gaps
        const gaps = jd.skills
          ? jd.skills
              .filter((s: any) => !skillsList.includes(s.name.toLowerCase()))
              .map((s: any) => `Consider adding technology tag: ${s.name}`)
          : [];

        // Resolve quiz ID from the database record
        const quizId = jd.quiz ? jd.quiz.id : "react-core-eval";

        setJob({
          id: jd.id,
          title: jd.title,
          company: jd.recruiter?.companyName || "Unknown Company",
          location: jd.location || "Hybrid",
          salary: jd.salary || "$70k - $90k",
          experience: `${jd.experienceYears}+ years`,
          matchScore,
          tags: jd.skills ? jd.skills.map((s: any) => s.name) : [],
          description: jd.description,
          quizId,
          reasons,
          gaps
        });
      }

      // 3. Fetch applications to see if candidate already applied
      const appsRes: any = await api.get("/api/candidates/applications");
      if (appsRes.success && Array.isArray(appsRes.data)) {
        const hasApplied = appsRes.data.some((app: any) => app.jobOfferId === params.id);
        setApplied(hasApplied);
      }

    } catch (e) {
      console.error("Error loading job details:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobDetails();
  }, [params.id]);

  const handleApply = async () => {
    setApplyLoading(true);
    try {
      const response: any = await api.post("/api/candidates/applications", {
        jobOfferId: params.id
      });
      if (response.success) {
        setApplied(true);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-default-450 font-bold max-w-5xl mx-auto py-24">
        <Icon icon="solar:spinner-bold" className="animate-spin text-3xl mx-auto mb-2 text-accent" />
        Loading Position Details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 text-center text-danger font-bold max-w-5xl mx-auto py-24">
        Job not found.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Back button header */}
      <div className="flex items-center gap-3">
        <Link
          href="/candidate/jobs"
          className="p-2 bg-blue-50/50 dark:bg-slate-800 rounded-xl text-accent hover:bg-blue-100/60 hover:text-blue-700 transition-colors"
        >
          <Icon icon="solar:arrow-left-bold" className="text-lg" />
        </Link>
        <div>
          <span className="text-xs font-semibold text-default-450 uppercase tracking-wider">Job Feed Detail View</span>
          <h1 className="text-xl font-bold tracking-tight">{job.title}</h1>
        </div>
      </div>

      {applied && (
        <Alert
          status="success"
          title="Application Submitted Successfully!"
          description="Your profile was sent to recruiters. Technical skills quiz required to finalize screening."
        />
      )}

      {/* Main Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Job Specs & Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Card.Content className="p-6 space-y-6">
              {/* Job Meta Info */}
              <div className="flex justify-between items-start border-b border-default-100 dark:border-default-50/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-default-900 dark:text-default-50">{job.title}</h2>
                  <p className="text-sm text-accent font-semibold mt-1">{job.company}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-default-900 dark:text-default-50">{job.salary}</span>
                  <p className="text-[10px] text-default-400 font-semibold uppercase">{job.location}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-default-700 dark:text-default-300 select-none">Position Description</h3>
                <p className="text-sm text-default-550 leading-relaxed">
                  {job.description}
                </p>
                <p className="text-sm text-default-550 leading-relaxed">
                  As part of our recruitment framework, we utilize automated matching evaluation and real-world repository syncing to check skills without standard filter tests.
                </p>
              </div>

              {/* Required Skills chips */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-default-700 dark:text-default-300 select-none">Core Technologies Required</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(job.tags || []).map((t: string, idx: number) => (
                    <Chip key={idx} variant="soft">{t}</Chip>
                  ))}
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Right Side: AI Match & Action */}
        <div className="space-y-6">
          <Card className="border-accent/30 shadow-accent/5">
            <Card.Header>
              <div>
                <Card.Title>AI Compatibility Report</Card.Title>
                <Card.Description>Matching index overview</Card.Description>
              </div>
              <Icon icon="solar:widget-2-bold-duotone" className="text-xl text-accent" />
            </Card.Header>
            <Card.Content className="space-y-6">
              {/* Match meter */}
              <div className="text-center py-4 bg-blue-50/20 dark:bg-slate-800/20 rounded-xl border border-blue-100/50 dark:border-slate-850">
                <span className="text-3xl font-black text-success">{job.matchScore}%</span>
                <p className="text-xs text-default-450 font-medium mt-1">Overall Profile Compatibility</p>
              </div>

              {/* Match Reasons */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-default-400 uppercase tracking-wider">Matching Points</h4>
                <ul className="space-y-2">
                  {job.reasons.map((r: string, i: number) => (
                    <li key={i} className="flex gap-2 text-xs text-default-600 leading-relaxed">
                      <Icon icon="solar:check-circle-bold" className="text-success text-base shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gaps */}
              {job.gaps.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-default-400 uppercase tracking-wider">Skill Gaps Detected</h4>
                  <ul className="space-y-2">
                    {job.gaps.map((g: string, i: number) => (
                      <li key={i} className="flex gap-2 text-xs text-default-600 leading-relaxed">
                        <Icon icon="solar:danger-triangle-bold" className="text-warning text-base shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card.Content>
            <Card.Footer className="flex-col gap-3">
              {applied ? (
                <>
                  <div className="w-full flex items-center justify-between p-3 bg-danger-soft/10 text-danger rounded-lg text-xs font-bold mb-1 select-none">
                    <span>Technical Quiz Pending</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
                  </div>
                  <Link href={`/candidate/quizzes/${job.quizId}`} className="w-full">
                    <Button
                      startIcon="solar:clipboard-list-bold"
                      variant="primary"
                      className="w-full"
                    >
                      Start Technical Assessment
                    </Button>
                  </Link>
                </>
              ) : (
                <Button
                  startIcon="solar:square-share-line-bold"
                  variant="primary"
                  className="w-full"
                  isLoading={applyLoading}
                  onClick={handleApply}
                >
                  Submit Application
                </Button>
              )}
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
}
