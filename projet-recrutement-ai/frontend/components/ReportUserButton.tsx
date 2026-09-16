"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { api } from "@/lib/api";

export default function ReportUserButton({ userId, className = "" }: { userId?: string; className?: string }) {
  const [submitting, setSubmitting] = useState(false);

  const submitReport = async () => {
    if (!userId || submitting) return;
    const reason = window.prompt("Please briefly explain why you are reporting this user:");
    if (!reason?.trim()) return;

    setSubmitting(true);
    try {
      await api.post("/api/reports", { reportedUserId: userId, reason: reason.trim(), severity: "MEDIUM" });
      window.alert("Your report was submitted for admin review.");
    } catch (caught: unknown) {
      window.alert(caught instanceof Error ? caught.message : "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  if (!userId) return null;

  return (
    <button
      type="button"
      disabled={submitting}
      onClick={submitReport}
      className={`inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <Icon icon="lucide:flag" className="h-4 w-4" />
      {submitting ? "Submitting..." : "Report user"}
    </button>
  );
}
