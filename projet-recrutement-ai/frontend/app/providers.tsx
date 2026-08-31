"use client";

import React from "react";
import { ThemeProvider } from "next-themes";

/**
 * Root provider — used only by public/auth pages (no role-scoped theme).
 * Admin, candidate, and recruiter layouts each wrap with their own
 * ScopedThemeProvider so themes do NOT bleed across roles.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="theme-global"
    >
      {children}
    </ThemeProvider>
  );
}

/**
 * A scoped ThemeProvider that uses a role-specific localStorage key so
 * toggling dark/light in the admin panel never affects recruiter or
 * candidate sessions, and vice-versa.
 */
export function ScopedThemeProvider({
  storageKey,
  children,
}: {
  storageKey: string;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey={storageKey}
    >
      {children}
    </ThemeProvider>
  );
}
