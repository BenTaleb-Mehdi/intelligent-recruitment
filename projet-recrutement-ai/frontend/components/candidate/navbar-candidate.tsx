"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { Indicator } from "./Indicator";
import candidateNotificationsData from "@/data/notifications-candidate.json";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

interface NavbarCandidateProps {
  onToggleSidebar: () => void;
}

export default function NavbarCandidate({ onToggleSidebar }: NavbarCandidateProps) {
  const pathname = usePathname() || "";
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(candidateNotificationsData.notifications);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [candidateName, setCandidateName] = useState("Mehdi Ben Taleb");
  const [avatarUrl, setAvatarUrl] = useState("/avatar-mehdi.png");
  const { unreadCount: unreadMessageCount } = useUnreadMessages("CANDIDATE");

  // Load and listen to profile changes
  useEffect(() => {
    const loadProfile = () => {
      const stored = localStorage.getItem("candidate-profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setCandidateName(parsed.name);
          if (parsed.personalInfo?.avatarUrl) setAvatarUrl(parsed.personalInfo.avatarUrl);
          else if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadProfile();

    const handleProfileUpdate = () => {
      loadProfile();
    };

    window.addEventListener("candidate-profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("candidate-profile-updated", handleProfileUpdate);
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleReadStatus = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dynamic breadcrumb label mapping
  const getBreadcrumbLabel = () => {
    if (pathname.includes("/candidate/profile")) {
      return "Mon Profil & CV";
    }
    if (pathname.includes("/candidate/jobs")) {
      return "Feed d'offres";
    }
    if (pathname.includes("/candidate/applications")) {
      return "Candidatures";
    }
    if (pathname.includes("/candidate/quizzes")) {
      return "Assessments & Tests";
    }
    if (pathname.includes("/candidate/messages")) {
      return "Messagerie Recruteur";
    }
    return "Dashboard";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/60 flex items-center justify-between px-6 z-20 font-sans relative shrink-0">
      {/* Left side: Sidebar Toggle & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Toggle Button */}
        <button 
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Icon icon="solar:sidebar-minimalistic-linear" className="w-5 h-5" />
        </button>

        {/* Separator Line */}
        <div className="w-[1px] h-4 bg-slate-200"></div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-slate-400 select-none">
          <Icon icon="solar:user-linear" className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 font-light text-xs">/</span>
          <span className="text-slate-800 text-xs font-semibold tracking-wide">
            {getBreadcrumbLabel()}
          </span>
        </div>
      </div>

      {/* Right side: AI Matcher Sync Indicator & Notifications Dropdown */}
      <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-full text-xs font-semibold select-none border border-emerald-100/50 dark:border-emerald-900/50">
          <Indicator status="success" pulse={false} />
          AI Matcher Sync Active
        </div>

        {/* Messages Shortcut Button */}
        <Link
          href="/candidate/messages"
          className="relative p-2 text-slate-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
          aria-label="Messagerie Recruteur"
          title="Messagerie Recruteur"
        >
          {unreadMessageCount > 0 && (
            <span className="absolute top-1 right-1 px-1 min-w-[16px] h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white animate-pulse">
              {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
            </span>
          )}
          <Icon icon="solar:chat-round-dots-linear" className="w-5 h-5" />
        </Link>

        {/* Notification Bell Button */}
        <button 
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="relative p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 transition-colors"
          aria-label="Notifications"
        >
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white animate-pulse">
              {unreadCount}
            </span>
          )}
          <Icon icon="solar:bell-linear" className="w-5 h-5" />
        </button>

        {/* Notifications Dropdown Panel */}
        {isNotificationsOpen && (
          <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200/85 shadow-xl rounded-2xl p-2 z-50 animate-fade-in font-sans">
            {/* Dropdown Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 select-none">
              <span className="text-xs font-bold text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-72 overflow-y-auto mt-1 divide-y divide-slate-50">
              {notifications.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => toggleReadStatus(item.id)}
                  className={`flex gap-3 p-3 text-xs hover:bg-slate-50 transition-colors cursor-pointer ${
                    item.unread ? "bg-blue-50/20" : ""
                  }`}
                >
                  {/* Icon Container */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${item.color}`}>
                    <Icon icon={item.icon} className="w-4 h-4" />
                  </div>
                  {/* Text details */}
                  <div className="flex-1 space-y-0.5">
                    <div className="flex justify-between items-start gap-1.5">
                      <span className={`font-bold text-slate-850 ${item.unread ? "text-slate-900" : "text-slate-700"}`}>
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-slate-550 leading-relaxed font-medium">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vertical Separator */}
        <div className="h-5 w-[1px] bg-slate-200"></div>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-100 border border-blue-200/80 flex items-center justify-center text-blue-750 font-bold text-[10px] select-none relative">
            <img 
              src={avatarUrl} 
              alt={candidateName} 
              className="w-full h-full object-cover absolute inset-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span>{getInitials(candidateName)}</span>
          </div>
          <span className="text-xs font-medium text-slate-600 hidden sm:inline-block">
            {candidateName}
          </span>
        </div>
      </div>
    </header>
  );
}
