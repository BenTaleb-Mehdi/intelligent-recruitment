"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Input,
  Switch,
  Button,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import AdminShell from "@/components/admin/AdminShell";
import { Sidebar } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";

function SettingsContent() {
  const { data: session } = authClient.useSession();
  const { resolvedTheme } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [profilePublic, setProfilePublic] = useState(true);

  const user = session?.user;
  const role = (user as { role?: string })?.role;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Account Settings</h1>
        <p className="mt-1 text-sm text-default-500">
          Manage your profile, preferences, and account security
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border border-default-200 bg-content1 p-6 shadow-sm dark:border-default-100/20">
          <div className="mb-4 flex items-center gap-2">
            <Icon icon="lucide:user" className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full name"
              defaultValue={user?.name ?? ""}
              variant="bordered"
              isReadOnly
            />
            <Input
              label="Email address"
              defaultValue={user?.email ?? ""}
              variant="bordered"
              isReadOnly
            />
            <Input
              label="Role"
              defaultValue={role ?? "—"}
              variant="bordered"
              isReadOnly
              className="sm:col-span-2"
            />
          </div>
          <Button className="mt-4" variant="flat" color="primary" isDisabled>
            Save changes
          </Button>
        </Card>

        <Card className="border border-default-200 bg-content1 p-6 shadow-sm dark:border-default-100/20">
          <div className="mb-4 flex items-center gap-2">
            <Icon icon="lucide:palette" className="size-5 text-secondary" />
            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-default-200 p-4 dark:border-default-100/20">
            <div>
              <p className="font-medium text-foreground">Theme</p>
              <p className="text-sm text-default-500">
                Currently using <span className="capitalize">{resolvedTheme ?? "light"}</span> mode
              </p>
            </div>
            <ThemeToggleButton />
          </div>
        </Card>

        <Card className="border border-default-200 bg-content1 p-6 shadow-sm dark:border-default-100/20">
          <div className="mb-4 flex items-center gap-2">
            <Icon icon="lucide:bell" className="size-5 text-warning" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Email notifications", desc: "Receive updates about applications and matches", value: emailNotifs, setter: setEmailNotifs },
              { label: "Push notifications", desc: "Browser alerts for important events", value: pushNotifs, setter: setPushNotifs },
              { label: "Marketing emails", desc: "Tips, product updates, and newsletters", value: marketingEmails, setter: setMarketingEmails },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-default-500">{item.desc}</p>
                </div>
                <Switch isSelected={item.value} onValueChange={item.setter} color="primary" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-default-200 bg-content1 p-6 shadow-sm dark:border-default-100/20">
          <div className="mb-4 flex items-center gap-2">
            <Icon icon="lucide:shield" className="size-5 text-success" />
            <h2 className="text-lg font-semibold text-foreground">Privacy</h2>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Public profile</p>
              <p className="text-sm text-default-500">Allow recruiters to discover your profile</p>
            </div>
            <Switch isSelected={profilePublic} onValueChange={setProfilePublic} color="primary" />
          </div>
        </Card>

        <Card className="border border-danger/30 bg-danger/5 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Icon icon="lucide:alert-triangle" className="size-5 text-danger" />
            <h2 className="text-lg font-semibold text-danger">Danger Zone</h2>
          </div>
          <p className="mb-4 text-sm text-default-600">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button color="danger" variant="flat" isDisabled>
            Delete account
          </Button>
        </Card>
      </div>
    </div>
  );
}

function UserSettingsShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || isPending) return;
    if (!session) router.push("/");
  }, [mounted, isPending, session, router]);

  if (!mounted || isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <Sidebar.Provider variant="sidebar" collapsible="icon" defaultOpen navigate={router.push}>
      <DashboardSidebar />
      <Sidebar.Main>
        <DashboardNavbar userName={session.user?.name} userEmail={session.user?.email ?? ""} />
        <div className="min-h-[calc(100vh-64px)] flex-1 bg-background p-4 md:p-6">{children}</div>
      </Sidebar.Main>
    </Sidebar.Provider>
  );
}

export default function SettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  if (isAdmin) {
    return (
      <AdminShell>
        <SettingsContent />
      </AdminShell>
    );
  }

  return (
    <UserSettingsShell>
      <SettingsContent />
    </UserSettingsShell>
  );
}
