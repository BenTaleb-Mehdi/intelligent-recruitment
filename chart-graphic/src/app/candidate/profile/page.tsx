"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Card } from "@/components/charts/molecules/Card";
import { Chip } from "@/components/charts/atoms/Chip";
import { Switch } from "@/components/charts/atoms/Switch";
import CvUploader from "@/components/candidate/CvUploader";
import DeveloperConnections from "@/components/candidate/DeveloperConnections";

export default function CandidateProfile() {
  const [fileName, setFileName] = useState("Mehdi_Ben_Taleb_CV.pdf");
  const [isGitHubConnected, setIsGitHubConnected] = useState(true);
  const [isPortfolioConnected, setIsPortfolioConnected] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

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
          <CvUploader fileName={fileName} onChange={setFileName} />

          {/* External Integrations */}
          <DeveloperConnections
            isGitHubConnected={isGitHubConnected}
            onGitHubToggle={setIsGitHubConnected}
            isPortfolioConnected={isPortfolioConnected}
            onPortfolioToggle={setIsPortfolioConnected}
          />
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

