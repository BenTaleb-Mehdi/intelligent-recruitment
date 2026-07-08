"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Card } from "@/components/charts/molecules/Card";
import { Button } from "@/components/charts/atoms/Button";
import { Chip } from "@/components/charts/atoms/Chip";

interface DeveloperConnectionsProps {
  isGitHubConnected: boolean;
  onGitHubToggle: (val: boolean) => void;
  isPortfolioConnected: boolean;
  onPortfolioToggle: (val: boolean) => void;
}

export default function DeveloperConnections({
  isGitHubConnected,
  onGitHubToggle,
  isPortfolioConnected,
  onPortfolioToggle,
}: DeveloperConnectionsProps) {
  return (
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
                <Button size="sm" variant="outline" onClick={() => onGitHubToggle(false)}>Disconnect</Button>
              </>
            ) : (
              <Button size="sm" variant="primary" startIcon="solar:key-bold" onClick={() => onGitHubToggle(true)}>Connect GitHub</Button>
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
                <Button size="sm" variant="outline" onClick={() => onPortfolioToggle(false)}>Disconnect</Button>
              </>
            ) : (
              <Button size="sm" variant="primary" startIcon="solar:key-bold" onClick={() => onPortfolioToggle(true)}>Connect Hub</Button>
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
