"use client";

import { authClient } from "@/lib/auth-client";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useRouter, usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";
import React from "react";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import NotificationDropdown from "@/components/NotificationDropdown";
import NavbarSearch from "@/components/NavbarSearch";
import { NavbarSearchMobile } from "@/components/NavbarSearchMobile";

interface DashboardNavbarProps {
  userName?: string;
  userEmail?: string;
}

export default function DashboardNavbar({ userName = "User", userEmail = "" }: DashboardNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const isAdmin = pathname.startsWith("/admin");

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <header className="relative flex h-16 items-center gap-2 border-b border-default-200 bg-content1 px-4 dark:border-default-100/20">
      <div className="flex shrink-0 items-center gap-2">
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={toggleSidebar}
          aria-label="Toggle sidebar"
          className="md:hidden"
        >
          <Icon icon="lucide:menu" className="size-5" />
        </Button>
        <div className="hidden md:block">
          <p className="text-sm font-semibold text-foreground">
            {isAdmin ? "Admin Dashboard" : "Dashboard"}
          </p>
          <p className="text-[11px] text-default-400">
            {isAdmin ? "Platform moderation & statistics" : "Recruitment AI Platform"}
          </p>
        </div>
        <span className="text-base font-bold text-foreground md:hidden">Recruitment AI</span>
      </div>

      <NavbarSearch />

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <NavbarSearchMobile />
        <ThemeToggleButton />
        <NotificationDropdown />

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button type="button" className="flex cursor-pointer items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-foreground">{userName}</p>
              </div>
              <Icon icon="lucide:chevron-down" className="size-4 text-default-400" />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile actions">
            <DropdownItem key="email" isReadOnly className="opacity-70">
              {userEmail}
            </DropdownItem>
            <DropdownItem
              key="profile"
              startContent={<Icon icon="lucide:user" />}
              onPress={() => router.push("/settings")}
            >
              Edit profile
            </DropdownItem>
            <DropdownItem
              key="settings"
              startContent={<Icon icon="lucide:settings" />}
              onPress={() => router.push("/settings")}
            >
              Account settings
            </DropdownItem>
            <DropdownItem
              key="signout"
              color="danger"
              startContent={<Icon icon="lucide:log-out" />}
              onPress={handleLogout}
            >
              Sign out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
