"use client";

import React from "react";
import { Card, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import PageHeader from "@/components/admin/PageHeader";

export default function AdminQuizzesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Quizzes Moderation"
        description="Monitor AI-generated technical assessments"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Quizzes" },
        ]}
      />

      <Card className="flex flex-col items-center justify-center border border-dashed border-default-300 bg-content1 px-6 py-20 text-center dark:border-default-100/30">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-secondary/10">
          <Icon icon="lucide:clipboard-list" className="size-8 text-secondary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Quiz moderation coming soon</h2>
        <p className="mt-2 max-w-md text-sm text-default-500">
          AI-generated quizzes will appear here once the Python microservice and Quiz model are
          connected in a later sprint.
        </p>
<<<<<<< HEAD
        <Button className="mt-6" variant="ghost" isDisabled>
=======
        <Button className="mt-6" variant="flat" color="secondary" isDisabled>
>>>>>>> 90525170874bf82114ff0e60a532cde0614c93da
          No quizzes yet
        </Button>
      </Card>
    </div>
  );
}
