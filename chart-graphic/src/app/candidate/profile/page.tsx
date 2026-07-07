"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Card } from "@/components/charts/molecules/Card";
import { Button } from "@/components/charts/atoms/Button";
import { Indicator } from "@/components/charts/atoms/Indicator";
import { Chip } from "@/components/charts/atoms/Chip";
import { Switch } from "@/components/charts/atoms/Switch";
import { Alert } from "@/components/charts/molecules/Alert";

export default function CandidateProfile() {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("Mehdi_Ben_Taleb_CV.pdf");
  const [isGitHubConnected, setIsGitHubConnected] = useState(true);
  const [isPortfolioConnected, setIsPortfolioConnected] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile & CV</h1>
        <p className="text-sm text-default-500">Manage your CV upload documents, connect external developer portfolios, and review extracted AI skillsets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: CV Upload and Developer Sync */}
        <div className="lg:col-span-2 space-y-8">
          {/* CV Drag & Drop Card */}
          <Card>
            <Card.Header>
              <div>
                <Card.Title>Curriculum Vitae (CV)</Card.Title>
                <Card.Description>Primary resume parsed by AI for skill matching</Card.Description>
              </div>
              <Icon icon="solar:document-text-bold-duotone" className="text-xl text-accent" />
            </Card.Header>
            <Card.Content className="space-y-6">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={[
                  "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[180px]",
                  dragOver
                    ? "border-accent bg-accent/5"
                    : "border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/10 hover:border-accent/40 dark:hover:border-slate-700",
                ].join(" ")}
              >
                <div className="p-3 bg-accent/15 text-accent rounded-full mb-3 shadow-sm">
                  <Icon icon="solar:cloud-upload-bold" className="text-2xl" />
                </div>
                <h4 className="text-sm font-bold text-default-800 dark:text-default-250">
                  {dragOver ? "Drop file to upload!" : "Drag & drop your CV file here"}
                </h4>
                <p className="text-xs text-default-450 mt-1">Supports PDF, DOCX or TXT up to 10MB</p>
                <input type="file" id="cv-file" className="hidden" onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFileName(e.target.files[0].name);
                  }
                }} />
                <Button size="sm" variant="outline" className="mt-4" onClick={() => document.getElementById("cv-file")?.click()}>
                  Browse Files
                </Button>
              </div>

              {/* Uploaded File status */}
              {fileName && (
                <div className="flex items-center justify-between p-3.5 bg-blue-50/20 dark:bg-slate-800/20 border border-blue-100/50 dark:border-slate-800 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                      <Icon icon="solar:document-bold" className="text-lg" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-default-800 dark:text-default-200 truncate">{fileName}</p>
                      <p className="text-[10px] text-default-400 font-semibold uppercase">Parsed by AI Matcher • 2 mins ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Indicator status="success" label="Active" />
                    <button
                      onClick={() => setFileName("")}
                      className="p-1.5 text-default-400 hover:text-danger rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <Icon icon="solar:trash-bin-trash-bold" className="text-base" />
                    </button>
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* External Integrations */}
          <Card>
            <Card.Header>
              <div>
                <Card.Title>Developer Connections</Card.Title>
                <Card.Description>Sync project metrics for verification (Proof-based hiring)</Card.Description>
              </div>
              <Icon icon="solar:link-bold-duotone" className="text-xl text-accent" />
            </Card.Header>
            <Card.Content className="space-y-6">
              {/* GitHub connection */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-default-100 dark:border-default-50/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xl">
                    <Icon icon="mdi:github" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-default-900 dark:text-default-50">GitHub Workspace</h5>
                    <p className="text-xs text-default-450 mt-0.5">
                      {isGitHubConnected ? "Connected to github.com/mehdi-bentaleb" : "Not connected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {isGitHubConnected ? (
                    <>
                      <Chip color="success" variant="soft">14 Repos Synced</Chip>
                      <Button size="sm" variant="outline" onClick={() => setIsGitHubConnected(false)}>Disconnect</Button>
                    </>
                  ) : (
                    <Button size="sm" variant="primary" startIcon="solar:key-bold" onClick={() => setIsGitHubConnected(true)}>Connect GitHub</Button>
                  )}
                </div>
              </div>

              {/* BidigitalHub connection */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-600 text-white rounded-xl flex items-center justify-center text-xl">
                    <Icon icon="solar:notebook-bold" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-default-900 dark:text-default-50">BidigitalHub Portfolio</h5>
                    <p className="text-xs text-default-450 mt-0.5">
                      {isPortfolioConnected ? "Connected to bidigitalhub.com/user/bentaleb" : "Not connected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {isPortfolioConnected ? (
                    <>
                      <Chip color="success" variant="soft">Synced</Chip>
                      <Button size="sm" variant="outline" onClick={() => setIsPortfolioConnected(false)}>Disconnect</Button>
                    </>
                  ) : (
                    <Button size="sm" variant="primary" startIcon="solar:key-bold" onClick={() => setIsPortfolioConnected(true)}>Connect Hub</Button>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Right 1 Col: Extracted Skills & Preferences */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <div>
                <Card.Title>Extracted Skills</Card.Title>
                <Card.Description>Verified from resume & repos</Card.Description>
              </div>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <h5 className="text-xs font-bold text-default-400 uppercase tracking-wider mb-2">Core Technical</h5>
                <div className="flex flex-wrap gap-1.5">
                  <Chip color="accent" variant="soft">React 19</Chip>
                  <Chip color="accent" variant="soft">Next.js</Chip>
                  <Chip color="accent" variant="soft">TypeScript</Chip>
                  <Chip color="accent" variant="soft">Node.js</Chip>
                  <Chip color="accent" variant="soft">Tailwind CSS</Chip>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-default-400 uppercase tracking-wider mb-2">Database & Tools</h5>
                <div className="flex flex-wrap gap-1.5">
                  <Chip color="default" variant="soft">Prisma</Chip>
                  <Chip color="default" variant="soft">MySQL</Chip>
                  <Chip color="default" variant="soft">MongoDB</Chip>
                  <Chip color="default" variant="soft">Git</Chip>
                  <Chip color="default" variant="soft">Docker</Chip>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-default-400 uppercase tracking-wider mb-2">AI & Machine Learning</h5>
                <div className="flex flex-wrap gap-1.5">
                  <Chip color="default" variant="soft">Python</Chip>
                  <Chip color="default" variant="soft">FastAPI</Chip>
                  <Chip color="default" variant="soft">TensorFlow</Chip>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Sync Switch Settings */}
          <Card>
            <Card.Content className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-default-800 dark:text-default-200">Auto-Update Profile</h5>
                  <p className="text-[10px] text-default-450 mt-0.5">Rescan connected accounts daily</p>
                </div>
                <Switch isSelected={autoSync} onChange={setAutoSync} color="accent" />
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
