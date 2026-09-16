"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";
import { apiFetch } from "@/lib/api";
import { getSocket } from "@/lib/socket";

interface NotificationItem {
  id: string;
  name: string;
  action: string;
  target: string;
  category: string;
  time: string;
  status: "online" | "offline";
  title?: string;
  description?: string;
  href?: string;
  unread?: boolean;
}

interface AdminNotification {
  id: string;
  type: "report" | "quiz" | "job";
  title: string;
  description: string;
  createdAt: string;
  unread: boolean;
  href: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: "1", name: "Terry Franci", action: "requests permission to change", target: "Project - Nganter App", category: "Project", time: "5 min ago", status: "online" },
  { id: "2", name: "Alena Franci", action: "requests permission to change", target: "Project - Nganter App", category: "Project", time: "8 min ago", status: "online" },
  { id: "3", name: "Jocelyn Kenter", action: "requests permission to change", target: "Project - Nganter App", category: "Project", time: "15 min ago", status: "online" },
  { id: "4", name: "Brandon Philips", action: "requests permission to change", target: "Project - Nganter App", category: "Project", time: "1 hr ago", status: "offline" },
];

function formatRelativeDate(value: string) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Recently";
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function mapAdminNotification(notification: AdminNotification): NotificationItem {
  const category = notification.type === "report" ? "Moderation" : notification.type === "quiz" ? "Quiz" : "Job offer";
  return {
    id: notification.id,
    name: "Admin alert",
    action: "",
    target: "",
    category,
    time: formatRelativeDate(notification.createdAt),
    status: "online",
    title: notification.title,
    description: notification.description,
    href: notification.href,
    unread: notification.unread,
  };
}

function AvatarInitials({ name, status }: { name: string; status: "online" | "offline" }) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span className="relative block size-10 shrink-0">
      <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{initials}</span>
      <span className={`absolute bottom-0 right-0 size-2.5 rounded-full border-[1.5px] border-content1 ${status === "online" ? "bg-success" : "bg-danger"}`} />
    </span>
  );
}

export default function NotificationDropdown({ isAdmin = false }: { isAdmin?: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(isAdmin);
  const [notifications, setNotifications] = useState<NotificationItem[]>(isAdmin ? [] : MOCK_NOTIFICATIONS);
  const notifying = notifications.some((notification) => notification.unread);

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    const loadNotifications = async () => {
      try {
        const response = await apiFetch<{ success: boolean; data: AdminNotification[] }>("/api/admin/notifications");
        if (active) setNotifications(response.data.map(mapAdminNotification));
      } catch (error) {
        console.error("Failed to load admin notifications:", error);
        if (active) setNotifications([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadNotifications();
    const socket = getSocket();
    const refreshNotifications = () => void loadNotifications();
    socket.on("admin_notification", refreshNotifications);
    return () => {
      active = false;
      socket.off("admin_notification", refreshNotifications);
    };
  }, [isAdmin]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    setIsOpen(false);
    if (notification.href) router.push(notification.href);
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Button isIconOnly variant="ghost" aria-label="Notifications" className="relative border-default-200 bg-content1 text-default-500 hover:bg-default-100 dark:border-default-100/20 dark:bg-content1 dark:text-default-400 dark:hover:bg-default-100/10">
          {notifying && <span className="absolute right-0.5 top-0.5 z-10 flex size-2 rounded-full bg-warning"><span className="absolute inline-flex size-full animate-ping rounded-full bg-warning opacity-75" /></span>}
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z" fill="currentColor" />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0 sm:w-[361px]">
        <div className="flex w-full flex-col rounded-2xl border border-default-200 bg-content1 shadow-lg dark:border-default-100/20">
          <div className="flex items-center justify-between border-b border-default-200 px-4 py-3 dark:border-default-100/20">
            <h5 className="text-lg font-semibold text-foreground">Notifications</h5>
            <button type="button" onClick={() => setIsOpen(false)} className="text-default-400 transition hover:text-foreground" aria-label="Close notifications">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z" fill="currentColor" /></svg>
            </button>
          </div>
          <ul className="max-h-[360px] overflow-y-auto">
            {loading ? <li className="px-4 py-8 text-center text-sm text-default-500">Loading notifications...</li> : notifications.length === 0 ? <li className="px-4 py-8 text-center text-sm text-default-500">No new notifications</li> : notifications.map((notification) => (
              <li key={notification.id}>
                <button type="button" onClick={() => handleNotificationClick(notification)} className="flex w-full gap-3 border-b border-default-200 px-4 py-3 text-left transition hover:bg-default-100 dark:border-default-100/20 dark:hover:bg-default-100/10">
                  <AvatarInitials name={notification.name} status={notification.status} />
                  <span className="min-w-0 flex-1">
                    {notification.title ? <><span className="mb-1 block text-sm font-medium text-foreground">{notification.title}</span><span className="block text-xs text-default-500">{notification.description}</span></> : <span className="mb-1.5 block text-sm text-default-500"><span className="font-medium text-foreground">{notification.name}</span>{" "}{notification.action}{" "}<span className="font-medium text-foreground">{notification.target}</span></span>}
                    <span className="mt-1 flex items-center gap-2 text-xs text-default-400"><span>{notification.category}</span><span className="size-1 rounded-full bg-default-400" /><span>{notification.time}</span></span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="p-3"><Link href={isAdmin ? "/admin/reported" : "#"} onClick={() => setIsOpen(false)} className="block rounded-lg border border-default-200 bg-content1 px-4 py-2 text-center text-sm font-medium text-default-600 transition hover:bg-default-100 dark:border-default-100/20 dark:text-default-400 dark:hover:bg-default-100/10">View All Notifications</Link></div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
