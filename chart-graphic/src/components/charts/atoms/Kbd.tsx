"use client";

import React from "react";
import { Kbd as HeroKbd } from "@heroui/react";

export interface KbdProps {
  children?: React.ReactNode;
  /** Modifier keys (e.g. 'command', 'shift', 'ctrl', 'alt') */
  keys?: ("command" | "shift" | "ctrl" | "alt" | "option" | "enter")[];
  className?: string;
}

/**
 * A keyboard shortcut key (Kbd) atom built on top of HeroUI Kbd (v3).
 * Custom-wrapped to translate modifier arrays to v3 compound component layout.
 */
export const Kbd: React.FC<KbdProps> = ({
  children,
  keys = [],
  className = "",
  ...props
}) => {
  return (
    <HeroKbd
      className={[
        "px-1.5 py-0.5 rounded border border-default-250 dark:border-default-100/20",
        "bg-default-50 dark:bg-zinc-900 text-default-600 dark:text-default-300 font-sans shadow-sm",
        "inline-flex items-center gap-1",
        className,
      ].join(" ")}
      {...props}
    >
      {keys.map((key) => (
        <HeroKbd.Abbr key={key} keyValue={key} />
      ))}
      {children && <HeroKbd.Content>{children}</HeroKbd.Content>}
    </HeroKbd>
  );
};
Kbd.displayName = "Kbd";
