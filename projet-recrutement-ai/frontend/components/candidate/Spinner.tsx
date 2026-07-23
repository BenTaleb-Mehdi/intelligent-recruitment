"use client";

import React from "react";
import { Spinner as HeroSpinner, SpinnerProps as HeroSpinnerProps } from "@heroui/react";

export interface SpinnerProps extends Omit<HeroSpinnerProps, "color"> {
  /** Optional loading text label displayed next to spinner */
  label?: string;
  /** Semantic color theme */
  color?: "current" | "accent" | "success" | "warning" | "danger";
}

/**
 * An accessible loading Spinner atom built on top of HeroUI Spinner (v3).
 * Implements customizable colors, labels, and sizes.
 */
export const Spinner: React.FC<SpinnerProps> = ({
  color = "accent",
  size = "md",
  label,
  className = "",
  ...props
}) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <HeroSpinner
        color={color}
        size={size}
        {...props}
      />
      {label && (
        <span className="text-xs text-default-500 font-medium select-none">
          {label}
        </span>
      )}
    </div>
  );
};
Spinner.displayName = "Spinner";
