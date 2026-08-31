"use client";

import React from "react";
import { Icon } from "@iconify/react";

export interface IndicatorProps {
  /** The color scheme status of the indicator */
  status?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  /** The presentation style */
  variant?: "dot" | "trend";
  /** Trend direction (required if variant is 'trend') */
  trend?: "up" | "down" | "neutral";
  /** Adds a pulsing animation ring behind the dot */
  pulse?: boolean;
  /** Size multiplier of the dot/text */
  size?: "sm" | "md" | "lg";
  /** Custom class overrides */
  className?: string;
  /** Text label alongside the indicator */
  label?: string;
}

/**
 * A highly configurable Indicator atom used to represent status dots or numeric trends.
 * Implements @iconify/react for icons and Tailwind CSS semantic color schemes.
 */
export const Indicator: React.FC<IndicatorProps> = ({
  status = "default",
  variant = "dot",
  trend,
  pulse = false,
  size = "md",
  className = "",
  label,
}) => {
  const sizeClasses = {
    sm: "h-1.5 w-1.5",
    md: "h-2.5 w-2.5",
    lg: "h-3.5 w-3.5",
  };

  const statusClasses = {
    default: "bg-default-400 text-default-600",
    primary: "bg-primary text-primary",
    secondary: "bg-secondary text-secondary",
    success: "bg-success text-success",
    warning: "bg-warning text-warning",
    danger: "bg-danger text-danger",
  };

  const textClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (variant === "trend" && trend) {
    const trendConfig = {
      up: {
        icon: "solar:arrow-right-up-bold-duotone",
        color: "text-success bg-success-50 dark:bg-success-950/20 border-success-100 dark:border-success-900/30",
      },
      down: {
        icon: "solar:arrow-right-down-bold-duotone",
        color: "text-danger bg-danger-50 dark:bg-danger-950/20 border-danger-100 dark:border-danger-900/30",
      },
      neutral: {
        icon: "solar:arrow-right-bold-duotone",
        color: "text-default-500 bg-default-50 dark:bg-default-900/20 border-default-100 dark:border-default-800/30",
      },
    };

    const config = trendConfig[trend];

    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 border rounded ${config.color} ${textClasses[size]} font-semibold ${className}`}
      >
        <Icon icon={config.icon} className="flex-shrink-0 text-[1.1em]" />
        {label}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusClasses[status].split(" ")[0]}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full ${sizeClasses[size]} ${statusClasses[status].split(" ")[0]}`}
        />
      </span>
      {label && (
        <span className={`${textClasses[size]} font-medium text-default-700 dark:text-default-300`}>
          {label}
        </span>
      )}
    </div>
  );
};
Indicator.displayName = "Indicator";
