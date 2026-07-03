"use client";

import React from "react";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Visual layer depth representing border and shadow intensity */
  elevation?: "none" | "flat" | "raised" | "floating";
  /** Surface background variant */
  variant?: "solid" | "translucent" | "muted";
  /** Corner radius */
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

/**
 * A layout container Surface molecule representing background planes.
 * Handles borders, semantic styling, light/dark layers, and shadow elevations.
 */
export const Surface: React.FC<SurfaceProps> = ({
  children,
  elevation = "raised",
  variant = "solid",
  rounded = "xl",
  className = "",
  ...props
}) => {
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  const elevationClasses = {
    none: "border-none shadow-none",
    flat: "border border-default-100 dark:border-default-50/5 shadow-none",
    raised: "border border-default-100 dark:border-default-50/5 shadow-sm",
    floating: "border border-default-100 dark:border-default-50/10 shadow-md hover:shadow-lg transition-shadow duration-350",
  };

  const variantClasses = {
    solid: "bg-content1 dark:bg-zinc-900 text-default-900",
    translucent: "bg-content1/80 dark:bg-zinc-900/80 backdrop-blur-md text-default-900",
    muted: "bg-default-50 dark:bg-default-950/40 text-default-800",
  };

  return (
    <div
      className={[
        roundedClasses[rounded],
        elevationClasses[elevation],
        variantClasses[variant],
        "transition-all duration-300",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};
Surface.displayName = "Surface";
