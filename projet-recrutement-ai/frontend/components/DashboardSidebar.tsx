"use client";

import React from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  );
}

function SidebarMenuItems() {
  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem
        href="/dashboard"
        icon={<DashboardIcon />}
        label="Overview"
      />
      <Sidebar.MenuItem
        href="/dashboard/jobs"
        icon={<BriefcaseIcon />}
        label="Jobs"
      />
      <Sidebar.MenuItem
        href="/dashboard/profile"
        icon={<UserIcon />}
        label="Profile"
      />
      <Sidebar.MenuItem
        href="/dashboard/settings"
        icon={<SettingsIcon />}
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
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="size-4"
        >
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
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
