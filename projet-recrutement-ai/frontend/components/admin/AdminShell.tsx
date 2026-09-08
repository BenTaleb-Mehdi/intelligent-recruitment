"use client";

import React, { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { Sidebar } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";
import { ScopedThemeProvider } from "@/app/providers";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const role = (session?.user as { role?: string } | undefined)?.role?.toUpperCase();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/");
      return;
    }

    if (role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [isPending, role, session, router]);

  if (isPending) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  if (!session || role !== "ADMIN") return null;

  return (
    <ScopedThemeProvider storageKey="theme-admin">
      <Sidebar.Provider variant="sidebar" collapsible="icon" defaultOpen navigate={router.push}>
        <AdminSidebar />
        <Sidebar.Main>
          <DashboardNavbar
            userName={session.user?.name}
            userEmail={session.user?.email ?? ""}
          />
          <div className="min-h-[calc(100vh-64px)] flex-1 bg-background p-4 md:p-6">{children}</div>
        </Sidebar.Main>
      </Sidebar.Provider>
    </ScopedThemeProvider>
  );
}
