"use client";

import React from "react";
import { Card, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color?: "primary" | "success" | "warning" | "danger" | "secondary";
  loading?: boolean;
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  secondary: "bg-secondary/10 text-secondary",
};

export default function StatCard({ label, value, icon, color = "primary", loading }: StatCardProps) {
  return (
    <Card className="border border-default-200 bg-content1 p-5 shadow-sm dark:border-default-100/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-default-500">{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-16 rounded-lg" />
          ) : (
            <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
          )}
        </div>
        <div className={`flex size-11 items-center justify-center rounded-xl ${colorMap[color]}`}>
          <Icon icon={icon} className="size-5" />
        </div>
      </div>
    </Card>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCard key={i} label="" value="" icon="lucide:users" loading />
      ))}
    </div>
  );
}
