"use client";

import React, { useRef, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import { useRouter, usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";
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

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await authClient.signOut();
    router.push("/");
  };

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <header className="relative flex h-16 items-center gap-2 border-b border-default-200 bg-content1 px-4 dark:border-default-100/20">
      <div className="flex shrink-0 items-center gap-2">
        <Button
          isIconOnly
          variant="ghost"
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

      <div className="flex-1 max-w-xl">
        <NavbarSearch />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <NavbarSearchMobile />
        <ThemeToggleButton />
        <NotificationDropdown />

        {/* Custom profile dropdown */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-default-100 dark:hover:bg-default-100/10"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-foreground">{userName}</p>
            </div>
            <Icon
              icon="lucide:chevron-down"
              className={`size-4 text-default-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-default-200 bg-content1 shadow-lg dark:border-default-100/20">
              {/* Email header */}
              <div className="border-b border-default-100 px-4 py-3 dark:border-default-100/10">
                <p className="text-xs text-default-400 truncate">{userEmail}</p>
              </div>

              {/* Menu items */}
              <div className="p-1">
                <button
                  type="button"
                  onClick={() => navigate("/settings")}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-default-100 dark:hover:bg-default-100/10"
                >
                  <Icon icon="lucide:user" className="size-4 text-default-500" />
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/settings")}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-default-100 dark:hover:bg-default-100/10"
                >
                  <Icon icon="lucide:settings" className="size-4 text-default-500" />
                  Account settings
                </button>
              </div>

              <div className="border-t border-default-100 p-1 dark:border-default-100/10">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger transition hover:bg-danger/5"
                >
                  <Icon icon="lucide:log-out" className="size-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
