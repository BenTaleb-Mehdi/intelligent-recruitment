"use client";

import React, { createContext, useContext, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface SidebarContextType {
  isOpen: boolean;
  expanded: boolean;
  toggleSidebar: () => void;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      isOpen: false,
      expanded: true,
      toggleSidebar: () => {},
      setIsOpen: () => {},
    };
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  variant?: string;
  collapsible?: string;
  defaultOpen?: boolean;
  navigate?: (path: string) => void;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen: isMobileOpen,
        expanded: isOpen,
        toggleSidebar,
        setIsOpen: setIsMobileOpen,
      }}
    >
      <div className="relative flex min-h-screen w-full bg-background text-foreground">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { expanded } = useSidebar();
  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-default-200 bg-content1 transition-all duration-300 md:flex ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      {children}
    </aside>
  );
}

Sidebar.Provider = SidebarProvider;

Sidebar.Header = function SidebarHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-b border-default-200">{children}</div>;
};

Sidebar.Trigger = function SidebarTrigger({ className = "" }: { className?: string }) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      isIconOnly
      variant="ghost"
      size="sm"
      onPress={toggleSidebar}
      className={className}
      aria-label="Toggle Sidebar"
    >
      <Icon icon="lucide:panel-left" className="size-5" />
    </Button>
  );
};

Sidebar.Content = function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-y-auto p-2 space-y-4">{children}</div>;
};

Sidebar.Group = function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
};

Sidebar.GroupLabel = function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  const { expanded } = useSidebar();
  if (!expanded) return null;
  return (
    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-default-400">
      {children}
    </div>
  );
};

Sidebar.Menu = function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <nav className="space-y-1">{children}</nav>;
};

Sidebar.MenuItem = function SidebarMenuItem({
  href,
  icon,
  label,
  isCurrent,
}: {
  href: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  isCurrent?: boolean;
}) {
  const { expanded } = useSidebar();
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isCurrent
          ? "bg-primary text-white"
          : "text-default-600 hover:bg-default-100 hover:text-default-900"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {expanded && <span className="flex-1 truncate">{label}</span>}
    </Link>
  );
};

Sidebar.Footer = function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-auto shrink-0 border-t border-default-200 p-3">{children}</div>;
};

Sidebar.Rail = function SidebarRail() {
  return null;
};

Sidebar.Mobile = function SidebarMobile({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useSidebar();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative flex w-64 flex-col bg-content1 p-4 shadow-xl z-10">
        {children}
      </div>
    </div>
  );
};

Sidebar.Main = function SidebarMain({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 flex-col min-w-0 h-screen overflow-y-auto">{children}</div>;
};
