"use client";

import React from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";

function SidebarMenuItems() {
  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem
        href="/dashboard"
        icon={<Icon icon="lucide:layout-dashboard" className="size-5" />}
        label="Overview"
      />
      <Sidebar.MenuItem
        href="/dashboard/jobs"
        icon={<Icon icon="lucide:briefcase" className="size-5" />}
        label="Jobs"
      />
      <Sidebar.MenuItem
        href="/dashboard/profile"
        icon={<Icon icon="lucide:user" className="size-5" />}
        label="Profile"
      />
      <Sidebar.MenuItem
        href="/dashboard/settings"
        icon={<Icon icon="lucide:settings" className="size-5" />}
        label="Settings"
      />
    </Sidebar.Menu>
  );
}

function SidebarUserFooter({
  session,
  handleLogout,
}: {
  session: any;
  handleLogout: () => void;
}) {
  if (!session?.user) return null;
  return (
    <div className="flex items-center gap-3 px-1 py-1">
      <div className="size-8 rounded-full bg-default-200 flex items-center justify-center text-default-600 font-semibold text-sm flex-shrink-0">
        {session.user.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{session.user.name || "User"}</p>
        <p className="text-xs text-default-400 truncate">{session.user.email || ""}</p>
      </div>
      <Button
        isIconOnly
        variant="light"
        size="sm"
        onPress={handleLogout}
        aria-label="Sign out"
      >
        <Icon icon="lucide:log-out" className="size-4" />
      </Button>
    </div>
  );
}

export default function DashboardSidebar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { expanded } = useSidebar();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <>
      <Sidebar>
        <Sidebar.Header>
          {expanded ? (
            <div className="flex items-center gap-3 px-1 py-1">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                RA
              </div>
              <span className="font-bold text-base truncate flex-1">Recruitment AI</span>
              <Sidebar.Trigger className="flex-shrink-0" />
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <Sidebar.Trigger />
            </div>
          )}
        </Sidebar.Header>

        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Main</Sidebar.GroupLabel>
            <SidebarMenuItems />
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          <SidebarUserFooter session={session} handleLogout={handleLogout} />
        </Sidebar.Footer>

        <Sidebar.Rail />
      </Sidebar>

      <Sidebar.Mobile>
        <Sidebar.Header>
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
              RA
            </div>
            <span className="font-bold text-base truncate flex-1">Recruitment AI</span>
          </div>
        </Sidebar.Header>

        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Main</Sidebar.GroupLabel>
            <SidebarMenuItems />
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          <SidebarUserFooter session={session} handleLogout={handleLogout} />
        </Sidebar.Footer>
      </Sidebar.Mobile>
    </>
  );
}
