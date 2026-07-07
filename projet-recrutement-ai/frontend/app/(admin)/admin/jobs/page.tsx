"use client";

import React from "react";
import { Card, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import PageHeader from "@/components/admin/PageHeader";

export default function AdminJobsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Job Offers"
        description="Moderate and manage job listings on the platform"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Job Offers" },
        ]}
      />

      <Card className="flex flex-col items-center justify-center border border-dashed border-default-300 bg-content1 px-6 py-20 text-center dark:border-default-100/30">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <Icon icon="lucide:briefcase" className="size-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Job moderation coming soon</h2>
        <p className="mt-2 max-w-md text-sm text-default-500">
          Once the JobOffer model is added in Sprint 3, you&apos;ll be able to approve, reject, and
          monitor all job listings here.
        </p>
        <Button className="mt-6" variant="flat" color="primary" isDisabled>
          No offers yet
        </Button>
      </Card>
    </div>
  );
}
