"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Card } from "@/components/candidate/Card";
import { Switch } from "@/components/candidate/Switch";
import { Slider } from "@/components/candidate/Slider";
import { Checkbox } from "@/components/candidate/Checkbox";
import { Button } from "@/components/candidate/Button";
import { Alert } from "@/components/candidate/Alert";
import Dropdown from "@/components/candidate/Dropdown";

type Tab = "preferences" | "ai" | "notifications" | "security";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "preferences", label: "Job Preferences", icon: "solar:case-linear" },
  { id: "ai", label: "AI & Privacy", icon: "solar:magic-stick-3-linear" },
  { id: "notifications", label: "Notifications", icon: "solar:bell-linear" },
  { id: "security", label: "Security & Account", icon: "solar:shield-check-linear" },
];

const STATUS_OPTIONS = [
  { id: "active", label: "Actively Looking (Active Search)" },
  { id: "open", label: "Open to Opportunities" },
  { id: "not_looking", label: "Not Looking / Employed" },
];

const WORK_MODE_OPTIONS = [
  { id: "remote", label: "100% Remote" },
  { id: "hybrid", label: "Hybrid" },
  { id: "onsite", label: "On-site" },
];

const FREQUENCY_OPTIONS = [
  { id: "daily", label: "Daily Digests" },
  { id: "weekly", label: "Weekly Summary" },
  { id: "never", label: "Never" },
];

export default function CandidateSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("preferences");
  
  // Alert Banner State
  const [alertInfo, setAlertInfo] = useState<{ show: boolean; message: string; status: "success" | "danger" }>({
    show: false,
    message: "",
    status: "success",
  });

  // Tab 1: Job Preferences State
  const [searchStatus, setSearchStatus] = useState<string>("active");
  const [jobTypes, setJobTypes] = useState<string[]>(["cdi", "freelance"]);
  const [workMode, setWorkMode] = useState<string>("hybrid");
  const [desiredSalary, setDesiredSalary] = useState<number>(35000); // 35k DH/month
  const [desiredLocations, setDesiredLocations] = useState<string>("Casablanca, Remote");

  // Tab 2: AI & Privacy State
  const [aiProfileVisibility, setAiProfileVisibility] = useState<boolean>(true);
  const [cvAnonymization, setCvAnonymization] = useState<boolean>(false);
  const [autoApplyMatching, setAutoApplyMatching] = useState<boolean>(true);

  // Tab 3: Notifications State
  const [jobMatchAlerts, setJobMatchAlerts] = useState<string>("daily");
  const [applicationStatusUpdates, setApplicationStatusUpdates] = useState<boolean>(true);
  const [assessmentReminders, setAssessmentReminders] = useState<boolean>(true);

  // Tab 4: Security State
  const [email, setEmail] = useState<string>("m.bentaleb@example.com");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Load from local storage
  useEffect(() => {
    // Sync email from candidate profile if available
    const profileStored = localStorage.getItem("candidate-profile");
    if (profileStored) {
      try {
        const parsed = JSON.parse(profileStored);
        const fetchedEmail = parsed.personalInfo?.email || parsed.email;
        if (fetchedEmail) setEmail(fetchedEmail);
      } catch (e) {
        console.error(e);
      }
    }

    // Load candidate-settings
    const settingsStored = localStorage.getItem("candidate-settings");
    if (settingsStored) {
      try {
        const parsed = JSON.parse(settingsStored);
        if (parsed.searchStatus) setSearchStatus(parsed.searchStatus);
        if (parsed.jobTypes) setJobTypes(parsed.jobTypes);
        if (parsed.workMode) setWorkMode(parsed.workMode);
        if (parsed.desiredSalary !== undefined) setDesiredSalary(parsed.desiredSalary);
        if (parsed.desiredLocations) setDesiredLocations(parsed.desiredLocations);
        
        if (parsed.aiProfileVisibility !== undefined) setAiProfileVisibility(parsed.aiProfileVisibility);
        if (parsed.cvAnonymization !== undefined) setCvAnonymization(parsed.cvAnonymization);
        if (parsed.autoApplyMatching !== undefined) setAutoApplyMatching(parsed.autoApplyMatching);
        
        if (parsed.jobMatchAlerts) setJobMatchAlerts(parsed.jobMatchAlerts);
        if (parsed.applicationStatusUpdates !== undefined) setApplicationStatusUpdates(parsed.applicationStatusUpdates);
        if (parsed.assessmentReminders !== undefined) setAssessmentReminders(parsed.assessmentReminders);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const triggerAlert = (message: string, status: "success" | "danger" = "success") => {
    setAlertInfo({ show: true, message, status });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setAlertInfo((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleSavePreferences = () => {
    const existing = localStorage.getItem("candidate-settings") ? JSON.parse(localStorage.getItem("candidate-settings")!) : {};
    const updated = {
      ...existing,
      searchStatus,
      jobTypes,
      workMode,
      desiredSalary,
      desiredLocations,
    };
    localStorage.setItem("candidate-settings", JSON.stringify(updated));
    triggerAlert("Your job preferences have been updated successfully!");
  };

  const handleSaveAiPrivacy = () => {
    const existing = localStorage.getItem("candidate-settings") ? JSON.parse(localStorage.getItem("candidate-settings")!) : {};
    const updated = {
      ...existing,
      aiProfileVisibility,
      cvAnonymization,
      autoApplyMatching,
    };
    localStorage.setItem("candidate-settings", JSON.stringify(updated));
    triggerAlert("Your AI match & privacy preferences have been updated successfully!");
  };

  const handleSaveNotifications = () => {
    const existing = localStorage.getItem("candidate-settings") ? JSON.parse(localStorage.getItem("candidate-settings")!) : {};
    const updated = {
      ...existing,
      jobMatchAlerts,
      applicationStatusUpdates,
      assessmentReminders,
    };
    localStorage.setItem("candidate-settings", JSON.stringify(updated));
    triggerAlert("Your notification alert rules have been updated successfully!");
  };

  const handleUpdateAccount = () => {
    if (newPassword && newPassword !== confirmPassword) {
      triggerAlert("New passwords do not match. Please verify them.", "danger");
      return;
    }

    // Sync updated email back to candidate-profile
    const profileStored = localStorage.getItem("candidate-profile");
    if (profileStored) {
      try {
        const parsed = JSON.parse(profileStored);
        if (parsed.personalInfo) {
          parsed.personalInfo.email = email;
        }
        parsed.email = email;
        localStorage.setItem("candidate-profile", JSON.stringify(parsed));
        // Dispatch event so layout and components update
        window.dispatchEvent(new Event("candidate-profile-updated"));
      } catch (e) {
        console.error(e);
      }
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    triggerAlert("Account security settings updated successfully!");
  };

  const handleToggleJobType = (typeId: string) => {
    if (jobTypes.includes(typeId)) {
      setJobTypes(jobTypes.filter((t) => t !== typeId));
    } else {
      setJobTypes([...jobTypes, typeId]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your AI job matching parameters, notifications rules, and account credentials.
          </p>
        </div>
      </div>

      {/* Success/Error Alert Message */}
      {alertInfo.show && (
        <Alert
          status={alertInfo.status}
          title={alertInfo.status === "success" ? "Settings Saved" : "Error Occurred"}
          description={alertInfo.message}
          className="animate-in fade-in slide-in-from-top-4 duration-300"
        />
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl sticky top-0 z-10 overflow-x-auto shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all flex-1 justify-center whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <Icon icon={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Panels */}
      
      {/* 1. Job Preferences */}
      {activeTab === "preferences" && (
        <Card>
          <Card.Header>
            <div>
              <Card.Title className="flex items-center gap-2">
                <Icon icon="solar:case-linear" className="w-4 h-4 text-blue-500" />
                Job Sourcing Preferences
              </Card.Title>
              <Card.Description>Configure your active searching parameters to sync with our AI Matcher.</Card.Description>
            </div>
          </Card.Header>
          <Card.Content className="space-y-6">
            
            {/* Search Status & Work Mode in a Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search Status</label>
                <Dropdown
                  options={STATUS_OPTIONS}
                  value={searchStatus}
                  onChange={(val) => { if (val) setSearchStatus(val); }}
                  placeholder="Select Search Status"
                  ariaLabel="Search Status dropdown selection"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Workplace Mode</label>
                <Dropdown
                  options={WORK_MODE_OPTIONS}
                  value={workMode}
                  onChange={(val) => { if (val) setWorkMode(val); }}
                  placeholder="Select Work Mode"
                  ariaLabel="Workplace Mode dropdown selection"
                />
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Locations</label>
              <input
                type="text"
                value={desiredLocations}
                onChange={(e) => setDesiredLocations(e.target.value)}
                placeholder="e.g. Casablanca, Remote, Rabat"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
              <span className="text-[10px] text-slate-400">Separate cities with commas</span>
            </div>

            {/* Job Types (CDI, CDD...) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Contract Types Preferred</label>
              <div className="flex flex-wrap gap-4">
                <Checkbox
                  isSelected={jobTypes.includes("cdi")}
                  onChange={() => handleToggleJobType("cdi")}
                  color="accent"
                >
                  CDI (Permanent)
                </Checkbox>
                <Checkbox
                  isSelected={jobTypes.includes("cdd")}
                  onChange={() => handleToggleJobType("cdd")}
                  color="accent"
                >
                  CDD (Temporary)
                </Checkbox>
                <Checkbox
                  isSelected={jobTypes.includes("freelance")}
                  onChange={() => handleToggleJobType("freelance")}
                  color="accent"
                >
                  Freelance / Contract
                </Checkbox>
                <Checkbox
                  isSelected={jobTypes.includes("internship")}
                  onChange={() => handleToggleJobType("internship")}
                  color="accent"
                >
                  Internship / Stage
                </Checkbox>
              </div>
            </div>

            {/* Desired Salary Slider */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Minimum Desired Salary</label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg">
                  {desiredSalary.toLocaleString()} DH / month
                </span>
              </div>
              <Slider
                minValue={5000}
                maxValue={100000}
                step={1000}
                value={desiredSalary}
                onChange={(val) => setDesiredSalary(val as number)}
                showValue={false}
                color="accent"
                className="max-w-full"
              />
              <p className="text-[10px] text-slate-400">
                This helps the AI matching system prioritize job listings that match your salary expectations.
              </p>
            </div>

          </Card.Content>
          <Card.Footer>
            <Button
              onClick={handleSavePreferences}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              startIcon="solar:diskette-linear"
            >
              Save Preferences
            </Button>
          </Card.Footer>
        </Card>
      )}

      {/* 2. AI & Privacy */}
      {activeTab === "ai" && (
        <Card>
          <Card.Header>
            <div>
              <Card.Title className="flex items-center gap-2">
                <Icon icon="solar:magic-stick-3-linear" className="w-4 h-4 text-purple-500" />
                AI Sourcing & Profile Privacy
              </Card.Title>
              <Card.Description>Manage how the system's smart AI algorithms utilize and present your profile data.</Card.Description>
            </div>
          </Card.Header>
          <Card.Content className="space-y-6 divide-y divide-slate-100">
            
            {/* Toggle 1: Profile Visibility */}
            <div className="flex items-start justify-between py-4 first:pt-0">
              <div className="space-y-0.5 max-w-[80%]">
                <h4 className="text-xs font-bold text-slate-800">AI Recruiter Discoverability</h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Allows recruiters' automated matching and candidate discovery models to parse your skills and recommend you for open roles.
                </p>
              </div>
              <Switch
                isSelected={aiProfileVisibility}
                onChange={(checked) => setAiProfileVisibility(checked)}
                color="accent"
                aria-label="AI Recruiter Discoverability"
              />
            </div>

            {/* Toggle 2: CV Anonymization */}
            <div className="flex items-start justify-between py-4">
              <div className="space-y-0.5 max-w-[80%]">
                <h4 className="text-xs font-bold text-slate-800">AI Screening CV Anonymization</h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Masks your name, telephone, email address, and avatar during initial AI matching phases. Full information is revealed only when you accept direct recruitment interview requests.
                </p>
              </div>
              <Switch
                isSelected={cvAnonymization}
                onChange={(checked) => setCvAnonymization(checked)}
                color="accent"
                aria-label="AI Screening CV Anonymization"
              />
            </div>

            {/* Toggle 3: Auto Match Scores */}
            <div className="flex items-start justify-between py-4">
              <div className="space-y-0.5 max-w-[80%]">
                <h4 className="text-xs font-bold text-slate-800">Automated Job Feed Matching</h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Calculate and overlay AI alignment compatibility scores (e.g. 87% match) directly on your dashboard job feed in real-time.
                </p>
              </div>
              <Switch
                isSelected={autoApplyMatching}
                onChange={(checked) => setAutoApplyMatching(checked)}
                color="accent"
                aria-label="Automated Job Feed Matching"
              />
            </div>

          </Card.Content>
          <Card.Footer>
            <Button
              onClick={handleSaveAiPrivacy}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2 px-5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              startIcon="solar:diskette-linear"
            >
              Save AI Settings
            </Button>
          </Card.Footer>
        </Card>
      )}

      {/* 3. Notifications */}
      {activeTab === "notifications" && (
        <Card>
          <Card.Header>
            <div>
              <Card.Title className="flex items-center gap-2">
                <Icon icon="solar:bell-linear" className="w-4 h-4 text-amber-500" />
                Notification Channels & Frequency
              </Card.Title>
              <Card.Description>Control when and how you are contacted about matches, quiz completions, and staging updates.</Card.Description>
            </div>
          </Card.Header>
          <Card.Content className="space-y-6">
            
            {/* Alert Digest Dropdown */}
            <div className="space-y-2 max-w-md">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI High-Match Job Digests</label>
              <Dropdown
                options={FREQUENCY_OPTIONS}
                value={jobMatchAlerts}
                onChange={(val) => { if (val) setJobMatchAlerts(val); }}
                placeholder="Select Alert Frequency"
                ariaLabel="AI High Match alert frequency dropdown"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Receive bundled email suggestions when jobs matching your profile by 80%+ are published.
              </span>
            </div>

            {/* Email Toggles */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-start justify-between py-2">
                <div className="space-y-0.5 max-w-[80%]">
                  <h4 className="text-xs font-bold text-slate-800">Application Stage Progress Alerts</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Receive immediate notifications when recruiter reviews, reviews CVs, or changes application progress stage.
                  </p>
                </div>
                <Switch
                  isSelected={applicationStatusUpdates}
                  onChange={(checked) => setApplicationStatusUpdates(checked)}
                  color="accent"
                  aria-label="Application Stage Progress Alerts"
                />
              </div>

              <div className="flex items-start justify-between py-2 border-t border-slate-50">
                <div className="space-y-0.5 max-w-[80%]">
                  <h4 className="text-xs font-bold text-slate-800">Skill Test & Assessment Reminders</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Get notifications for pending recruiter technical tests, coding quizzes, and calendar scheduling updates.
                  </p>
                </div>
                <Switch
                  isSelected={assessmentReminders}
                  onChange={(checked) => setAssessmentReminders(checked)}
                  color="accent"
                  aria-label="Skill Test & Assessment Reminders"
                />
              </div>
            </div>

          </Card.Content>
          <Card.Footer>
            <Button
              onClick={handleSaveNotifications}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-2 px-5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              startIcon="solar:diskette-linear"
            >
              Save Notification Rules
            </Button>
          </Card.Footer>
        </Card>
      )}

      {/* 4. Security & Account */}
      {activeTab === "security" && (
        <Card>
          <Card.Header>
            <div>
              <Card.Title className="flex items-center gap-2">
                <Icon icon="solar:shield-check-linear" className="w-4 h-4 text-emerald-500" />
                Account Security & Credentials
              </Card.Title>
              <Card.Description>Update your email address or update password details.</Card.Description>
            </div>
          </Card.Header>
          <Card.Content className="space-y-6">
            
            {/* Account Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Account Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>

            {/* Password Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-rose-100 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                  <Icon icon="solar:danger-bold-duotone" className="w-4 h-4 text-rose-500" />
                  Danger Zone
                </h4>
                <p className="text-[10px] text-slate-450 mt-1 leading-normal">
                  Permanently erase your candidate profile, file uploads, quiz responses, application history, and account. This action is irreversible.
                </p>
              </div>
              <Button
                className="bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 text-rose-600 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm w-fit cursor-pointer flex items-center gap-1.5"
                startIcon="solar:trash-bin-trash-linear"
                onClick={() => {
                  if (confirm("Are you absolutely sure you want to delete your candidate profile? This cannot be undone.")) {
                    localStorage.removeItem("candidate-profile");
                    localStorage.removeItem("candidate-settings");
                    triggerAlert("Account deleted (simulation). Profile data cleared.", "danger");
                    setTimeout(() => {
                      window.location.href = "/";
                    }, 2000);
                  }
                }}
              >
                Delete Candidate Profile
              </Button>
            </div>

          </Card.Content>
          <Card.Footer>
            <Button
              onClick={handleUpdateAccount}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              startIcon="solar:shield-check-linear"
            >
              Update Credentials
            </Button>
          </Card.Footer>
        </Card>
      )}

    </div>
  );
}
