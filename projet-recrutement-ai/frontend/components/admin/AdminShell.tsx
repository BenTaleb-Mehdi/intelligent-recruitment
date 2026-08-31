"use client";

import React, { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isPending) return;

    if (!session) {
      router.push("/");
      return;
    }

    const role = (session.user as { role?: string }).role?.toUpperCase();
    if (role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [mounted, isPending, session, router]);

  if (!mounted || isPending) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  if (!session) return null;

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
