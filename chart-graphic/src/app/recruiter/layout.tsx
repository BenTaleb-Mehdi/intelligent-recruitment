"use client";

import React, { useState, useEffect } from "react";
import SidebarRecruiter from "@/components/recruiter/sidebar-recruiter";
import NavbarRecruiter from "@/components/recruiter/navbar-recruiter";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sidebar state: open by default on desktop, can be closed.
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Mobile Backdrop Overlay - closes the sidebar when clicked outside */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Layout component */}
      <SidebarRecruiter isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar Layout component */}
        <NavbarRecruiter onToggleSidebar={toggleSidebar} />
        
        {/* Render space dyal dashboard / jobs */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}