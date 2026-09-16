"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Chip, Button, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";
import PageHeader from "@/components/admin/PageHeader";
import { fetchAdminUser, type AdminUserDetail } from "@/services/adminService";

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminUser(userId)
      .then((res) => setUser(res.user))
      .catch((caught: unknown) => {
        setUser(null);
        setError(caught instanceof Error ? caught.message : "Failed to load user");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl">
        <Skeleton className="mb-6 h-8 w-48 rounded-lg" />
        <Card className="border border-default-200 bg-content1 p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-4 w-56 rounded-lg" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <Icon icon="lucide:user-x" className="mx-auto size-12 text-default-300" />
        <h2 className="mt-4 text-xl font-semibold">{error || "User not found"}</h2>
        <Link href="/admin/users">
          <Button className="mt-4" variant="ghost">
            Back to users
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={user.name}
        description={user.email}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Users", href: "/admin/users" },
          { label: user.name },
        ]}
      />

      <Card className="border border-default-200 bg-content1 p-6 shadow-sm dark:border-default-100/20">
        <div className="flex items-start gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Chip size="sm" variant="soft" color={user.role?.toUpperCase() === "ADMIN" ? "danger" : user.role?.toUpperCase() === "RECRUITER" ? "success" : "default"}>
                {user.role}
              </Chip>
              <Chip size="sm" variant="soft" color={user.emailVerified ? "success" : "warning"}>
                {user.emailVerified ? "Verified" : "Unverified"}
              </Chip>
              {user.isOnboarded && (
                <Chip size="sm" variant="soft" color="default">
                  Onboarded
                </Chip>
              )}
            </div>
            <p className="mt-3 text-xs text-default-400">
              ID: <code className="text-default-600">{user.id}</code>
            </p>
            <p className="mt-1 text-sm text-default-500">
              Joined{" "}
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).format(new Date(user.createdAt))}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="ghost" isDisabled>
            <Icon icon="lucide:edit" />
            <span>Edit role</span>
          </Button>
          <Button variant="ghost" isDisabled className="text-danger">
            <Icon icon="lucide:ban" />
            <span>Suspend</span>
          </Button>
        </div>

        {user.candidate && (
          <div className="mt-6 grid gap-3 border-t border-default-200 pt-6 sm:grid-cols-3">
            <div><p className="text-xs text-default-400">Candidate title</p><p className="mt-1 text-sm font-semibold">{user.candidate.title}</p></div>
            <div><p className="text-xs text-default-400">Applications</p><p className="mt-1 text-sm font-semibold">{user.candidate._count.applications}</p></div>
            <div><p className="text-xs text-default-400">Quiz results</p><p className="mt-1 text-sm font-semibold">{user.candidate._count.testResults}</p></div>
          </div>
        )}

        {user.recruiter && (
          <div className="mt-6 grid gap-3 border-t border-default-200 pt-6 sm:grid-cols-3">
            <div><p className="text-xs text-default-400">Company</p><p className="mt-1 text-sm font-semibold">{user.recruiter.companyName || "Not set"}</p></div>
            <div><p className="text-xs text-default-400">Verification</p><p className="mt-1 text-sm font-semibold">{user.recruiter.verificationStatus}</p></div>
            <div><p className="text-xs text-default-400">Job offers</p><p className="mt-1 text-sm font-semibold">{user.recruiter._count.jobOffers}</p></div>
          </div>
        )}
      </Card>
    </div>
  );
}
