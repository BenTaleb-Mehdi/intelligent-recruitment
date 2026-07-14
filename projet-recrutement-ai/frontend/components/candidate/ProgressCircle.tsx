"use client";

import React from "react";
import { ProgressCircle as HeroProgressCircle } from "@heroui/react";

export interface ProgressCircleProps {
  /** The progress value (0 to 100) */
  value?: number;
  /** Optional content to render at the exact center of the circle progress (e.g. icons, percentages, small labels) */
  centerContent?: React.ReactNode;
  /** Custom stroke width for the track and fill circles */
  strokeWidth?: number;
  /** Semantic color variant */
  color?: "default" | "accent" | "success" | "warning" | "danger";
  /** Optional label class overrides */
  className?: string;
}

/**
 * A styled ProgressCircle atom built on top of HeroUI ProgressCircle (v3).
 * Supports custom center overlays, transition animations, and dark mode compliance.
 */
export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  centerContent,
  strokeWidth = 3,
  color = "accent",
  className = "",
  ...props
}) => {
  const colorMap = {
    default: "stroke-default-400",
    accent: "stroke-accent",
    success: "stroke-success",
    warning: "stroke-warning",
    danger: "stroke-danger",
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <HeroProgressCircle value={value} aria-label="Progress circle" {...props}>
        <HeroProgressCircle.Track>
          <HeroProgressCircle.TrackCircle
            strokeWidth={strokeWidth}
            className="stroke-default-100 dark:stroke-default-850"
          />
          <HeroProgressCircle.FillCircle
            strokeWidth={strokeWidth}
            className={[colorMap[color], "transition-all duration-500 ease-in-out"].join(" ")}
          />
        </HeroProgressCircle.Track>
      </HeroProgressCircle>
      {centerContent && (
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          {centerContent}
        </div>
      )}
    </div>
  );
};
ProgressCircle.displayName = "ProgressCircle";
