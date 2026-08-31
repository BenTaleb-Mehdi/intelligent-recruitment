"use client";

import React from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", icon: "lucide:layout-dashboard", label: "Dashboard" },
  { href: "/admin/users", icon: "lucide:users", label: "Manage Users" },
  { href: "/admin/reported", icon: "lucide:shield-alert", label: "Reported Users", badge: "3" },
  { href: "/admin/jobs", icon: "lucide:briefcase", label: "Job Offers" },
  { href: "/admin/quizzes", icon: "lucide:clipboard-list", label: "Quizzes" },
];

function SidebarUserFooter({
  session,
  handleLogout,
}: {
  session: { user?: { name?: string; email?: string } } | null;
  handleLogout: () => void;
}) {
  if (!session?.user) return null;
  return (
    <div className="flex items-center gap-3 px-1 py-1">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {session.user.name?.charAt(0)?.toUpperCase() || "A"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{session.user.name || "Admin"}</p>
        <p className="truncate text-xs text-default-400">{session.user.email || ""}</p>
      </div>
<<<<<<< HEAD
      <Button isIconOnly variant="ghost" size="sm" onPress={handleLogout} aria-label="Sign out">
=======
      <Button isIconOnly variant="light" size="sm" onPress={handleLogout} aria-label="Sign out">
>>>>>>> 90525170874bf82114ff0e60a532cde0614c93da
        <Icon icon="lucide:log-out" className="size-4" />
      </Button>
    </div>
  );
}

function AdminNavItems() {
  const pathname = usePathname();
  const { expanded } = useSidebar();

  return (
    <Sidebar.Menu>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Sidebar.MenuItem
            key={item.href}
            href={item.href}
            isCurrent={active}
            icon={<Icon icon={item.icon} className="size-5" />}
            label={
              <span className="flex flex-1 items-center justify-between gap-2">
                {item.label}
                {item.badge && expanded && (
                  <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[10px] font-semibold text-danger">
                    {item.badge}
                  </span>
                )}
              </span>
            }
          />
        );
      })}
    </Sidebar.Menu>
  );
}

export default function AdminSidebar() {
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
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                RA
              </div>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-base font-bold">Recruitment AI</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Admin</span>
              </div>
              <Sidebar.Trigger className="shrink-0" />
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <Sidebar.Trigger />
            </div>
          )}
        </Sidebar.Header>

        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
            <AdminNavItems />
          </Sidebar.Group>
          <Sidebar.Group>
            <Sidebar.GroupLabel>System</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuItem
                href="/settings"
                icon={<Icon icon="lucide:settings" className="size-5" />}
                label="Settings"
              />
            </Sidebar.Menu>
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
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
              RA
            </div>
            <span className="truncate text-base font-bold">Admin Panel</span>
          </div>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
            <AdminNavItems />
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <SidebarUserFooter session={session} handleLogout={handleLogout} />
        </Sidebar.Footer>
      </Sidebar.Mobile>
    </>
  );
}
