import React from "react";
import StatsCards from "@/components/recruiter/stats-cards";
import ChartsSection from "@/components/recruiter/charts-section";
import RecentActivity from "@/components/recruiter/recent-activity";

export default function RecruiterDashboard() {
  return (
    <div className="space-y-6">
      {/* Section 1: Top Statistics Cards */}
      <StatsCards />

      {/* Section 2: Charts Area */}
      <ChartsSection />

      {/* Section 3: Recent Candidates Table */}
      <RecentActivity />
    </div>
  );
}