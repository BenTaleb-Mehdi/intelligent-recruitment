"use client";

import React from "react";
import { Card, Skeleton } from "@heroui/react";

export default function UsersTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <Card className="overflow-hidden border border-default-200 bg-content1 shadow-sm dark:border-default-100/20">
      <div className="border-b border-default-200 p-4 dark:border-default-100/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-full max-w-md rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-default-200 bg-default-50 dark:border-default-100/20 dark:bg-default-100/5">
              {["Id", "Name", "Email", "Verified", "Role", "Joined", "Actions"].map((col) => (
                <th key={col} className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-16 rounded-md" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b border-default-100 dark:border-default-100/10">
                {Array.from({ length: 7 }).map((__, j) => (
                  <td key={j} className="px-4 py-4">
                    <Skeleton className="h-4 w-full max-w-[120px] rounded-md" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
