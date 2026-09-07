"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface AdminThemeCtx {
  resolvedTheme: Theme;
  toggle: () => void;
}

const AdminThemeContext = createContext<AdminThemeCtx>({
  resolvedTheme: "light",
  toggle: () => {},
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // On mount: read saved preference
  useEffect(() => {
    const saved = localStorage.getItem("admin-theme") as Theme | null;
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  // Whenever theme changes: apply/remove `dark` on <html> so both
  // HeroUI and Tailwind dark: classes respond correctly.
  // Cleanup removes the class when the admin layout unmounts (user
  // navigates to recruiter / auth pages).
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    return () => {
      html.classList.remove("dark");
    };
  }, [theme]);

  const toggle = () =>
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      localStorage.setItem("admin-theme", next);
      return next;
    });

  return (
    <AdminThemeContext.Provider value={{ resolvedTheme: theme, toggle }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export const useAdminTheme = () => useContext(AdminThemeContext);
