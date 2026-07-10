"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import notificationsData from "@/data/notifications.json";
import { authClient } from "@/lib/auth-client";

interface NavbarRecruiterProps {
  onToggleSidebar: () => void;
}
// Helper function to extract initials from a name
const getInitials = (name?: string) => {
  if (!name) return "U"; // Default fallback if no name
  const words = name.trim().split(/\s+/); // Split by spaces
  if (words.length >= 2) {
    // If 2 or more words, take the first letter of the first two words
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  // If only 1 word, take the first two letters of that word
  return name.substring(0, 2).toUpperCase();
};
export default function NavbarRecruiter({ onToggleSidebar }: NavbarRecruiterProps) {
  const pathname = usePathname() || "";
  const dropdownRef = useRef<HTMLDivElement>(null);
const [user, setUser] = useState<{ name?: string } | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData.notifications);
useEffect(() => {
    const fetchUser = async () => {
      const { data } = await authClient.getSession();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);
  // Click outside to close notifications dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  // Dynamic breadcrumb name mapping based on path
  const getBreadcrumbLabel = () => {
    if (pathname.includes("/recruiter/jobs/create")) {
      return "Créer une Offre";
    }
    if (pathname.includes("/applicants")) {
      return "Candidats & Evaluation";
    }
    if (pathname.startsWith("/recruiter/jobs")) {
      return "Mes Offres";
    }
    if (pathname.includes("/recruiter/settings")) {
      return "Paramètres";
    }
    if (pathname.includes("/recruiter/messages")) {
      return "Messages";
    }
    return "Dashboard";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/60 flex items-center justify-between px-6 z-20 font-sans relative">
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
          <Icon icon="solar:home-smile-linear" className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 font-light text-xs">/</span>
          <span className="text-slate-800 text-xs font-semibold tracking-wide truncate max-w-[120px] sm:max-w-none">
            {getBreadcrumbLabel()}
          </span>
        </div>
      </div>

      {/* Right side: Actions & User Info */}
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
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
          <div className="absolute right-0 top-12 w-[calc(100vw-2rem)] sm:w-80 max-w-[20rem] bg-white border border-slate-200/85 shadow-xl rounded-2xl p-2 z-50 animate-fade-in font-sans">
            {/* Dropdown Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 select-none">
              <span className="text-xs font-bold text-slate-850">Notifications</span>
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
                  onClick={() => markAsRead(item.id)}
                  className={`p-3 rounded-xl flex gap-3 transition-colors cursor-pointer select-none ${
                    item.unread ? "bg-slate-50/60 hover:bg-slate-100/60" : "hover:bg-slate-50/60"
                  }`}
                >
                  {/* Category icon */}
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <Icon icon={item.icon} className="w-4 h-4" />
                  </div>
                  {/* Description details */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1.5">
                      <p className={`text-xs truncate ${item.unread ? "font-bold text-slate-800" : "font-medium text-slate-600"}`}>
                        {item.title}
                      </p>
                      {item.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                      {item.description}
                    </p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-6 text-slate-400">
                  <Icon icon="solar:bell-linear" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold">Aucune notification</p>
                </div>
              )}
            </div>

            {/* Dropdown Footer */}
            <div className="border-t border-slate-100 mt-1 pt-1.5 pb-0.5 text-center">
              <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 transition-colors hover:underline w-full">
                Voir toutes les notifications
              </button>
            </div>
          </div>
        )}

        {/* Vertical Separator */}
        <div className="h-5 w-[1px] bg-slate-200"></div>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 font-semibold text-xs select-none">
          {getInitials(user?.name)}
          </div>
          <span className="text-xs font-medium text-slate-600 hidden sm:inline-block">
            {user?.name || "Loading..."}
          </span>
        </div>
      </div>
    </header>
  );
}