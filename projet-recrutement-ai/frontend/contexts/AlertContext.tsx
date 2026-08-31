"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import Alert from "@/components/ui/Alert";

type AlertVariant = "danger" | "success" | "warning" | "info";

interface AlertContextValue {
  showAlert: (variant: AlertVariant, message: string, title?: string) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alertInfo, setAlertInfo] = useState<{
    variant: AlertVariant;
    message: string;
    title?: string;
    key: number;
  } | null>(null);

  const showAlert = useCallback(
    (variant: AlertVariant, message: string, title?: string) => {
      setAlertInfo({ variant, message, title, key: Date.now() });
    },
    []
  );

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {alertInfo && (
        <Alert
          key={alertInfo.key}
          variant={alertInfo.variant}
          message={alertInfo.message}
          title={alertInfo.title}
          duration={5000}
        />
      )}
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within an AlertProvider");
  return ctx;
}
