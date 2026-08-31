"use client";

import React, { useState, useEffect } from "react";
import SidebarCandidate from "@/components/candidate/sidebar-candidate";
import NavbarCandidate from "@/components/candidate/navbar-candidate";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { ScopedThemeProvider } from "@/app/providers";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  // Sidebar state: open by default on desktop, can be closed.
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace("/");
      } else {
        const role = (session.user as any).role?.toUpperCase();
        const isOnboarded = (session.user as any).isOnboarded;
        if (role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else if (!isOnboarded) {
          router.replace("/welcome");
        } else if (role !== "CANDIDATE") {
          if (role === "RECRUITER") {
            router.replace("/recruiter/dashboard");
          } else {
            router.replace("/welcome");
          }
        }
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session || (session.user as any).role !== "CANDIDATE") {
    return null;
  }

  return (
    <ScopedThemeProvider storageKey="theme-candidate">
      <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-zinc-950">
        {/* Mobile Backdrop Overlay - closes the sidebar when clicked outside */}
        {isSidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          />
        )}

        {/* Sidebar Layout component */}
        <SidebarCandidate isOpen={isSidebarOpen} onClose={closeSidebar} />
        
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Navbar Layout component */}
          <NavbarCandidate onToggleSidebar={toggleSidebar} />
          
          {/* Render space dyal candidate page view */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ScopedThemeProvider>
  );
}
