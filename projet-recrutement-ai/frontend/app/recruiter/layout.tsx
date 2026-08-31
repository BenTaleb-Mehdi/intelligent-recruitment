"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { api, ApiRecruiter } from "@/lib/api";
import SidebarRecruiter from "@/components/recruiter/sidebar-recruiter";
import NavbarRecruiter from "@/components/recruiter/navbar-recruiter";
import { AlertProvider } from "@/contexts/AlertContext";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [logo, setLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");

  const fetchRecruiter = async () => {
    try {
      if (!session?.user?.id) return;
      const { data: recruiters } = await api.get<{ data: ApiRecruiter[] }>("/api/recruiters");
      const recruiter = recruiters?.find((r) => r.userId === session.user.id);
      if (recruiter) {
        setLogo(recruiter.logo || null);
        setCompanyName(recruiter.companyName || "");
      }
    } catch (error) {
      console.error("Error fetching recruiter for sidebar:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchRecruiter();
    }
  }, [session]);

  useEffect(() => {
    const handleRecruiterUpdate = () => {
      fetchRecruiter();
    };
    window.addEventListener("recruiter-updated", handleRecruiterUpdate);
    return () => {
      window.removeEventListener("recruiter-updated", handleRecruiterUpdate);
    };
  }, [session]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace("/");

      } else if ((session.user as any).role !== "RECRUITER") {
        router.replace("/");

      }
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session || (session.user as any).role !== "RECRUITER") {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <AlertProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50">
        {/* Mobile Backdrop Overlay - closes the sidebar when clicked outside */}
        {isSidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          />
        )}

        {/* Sidebar Layout component */}
        <SidebarRecruiter 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          logo={logo} 
          companyName={companyName} 
        />
        
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col">
          {/* Navbar Layout component — fixed at top */}
          <NavbarRecruiter onToggleSidebar={toggleSidebar} />
          
          {/* Render space dyal dashboard / jobs */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
            {children}
          </main>
        </div>
      </div>
    </AlertProvider>
  );
}