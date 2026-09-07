"use client";
import React, { useState } from "react";
import { Button, Dropdown, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";

interface NotificationItem {
  id: string;
  name: string;
  action: string;
  target: string;
  time: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: "1", name: "Terry Franci", action: "requests permission to change", target: "Project - Nganter App", time: "5 min ago" },
  { id: "2", name: "Alena Franci", action: "requests permission to change", target: "Project - Nganter App", time: "8 min ago" },
];

export default function NotificationDropdown() {
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <Dropdown onOpenChange={(open) => open && setHasUnread(false)}>
      <Dropdown.Trigger>
        <Button isIconOnly variant="ghost" aria-label="Notifications">
          {hasUnread ? (
            <Badge color="danger" placement="top-right" size="sm">
              <Icon icon="solar:bell-bold" className="text-lg" />
            </Badge>
          ) : (
            <Icon icon="solar:bell-bold" className="text-lg" />
          )}
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu className="w-80">
          {MOCK_NOTIFICATIONS.map((n) => (
            <Dropdown.Item key={n.id} className="py-3">
              <p className="text-sm text-default-700">
                <span className="font-semibold text-default-900">{n.name}</span> {n.action}{" "}
                <span className="font-semibold text-default-900">{n.target}</span>
              </p>
              <p className="text-xs text-default-400 mt-1">{n.time}</p>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}