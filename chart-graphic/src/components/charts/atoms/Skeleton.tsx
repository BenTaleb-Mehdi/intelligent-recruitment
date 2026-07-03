"use client";

import React from "react";
import { Skeleton as HeroSkeleton } from "@heroui/react";

export interface SkeletonProps {
  /** The content to reveal when loading completes */
  children?: React.ReactNode;
  /** If true, hides the skeleton animation and reveals children content */
  isLoaded?: boolean;
  /** Visual placeholder animation style */
  animationType?: "none" | "pulse" | "shimmer";
  /** CSS class to apply to the skeleton placeholder */
  className?: string;
}

/**
 * A Skeleton loading placeholder atom built on top of HeroUI Skeleton (v3).
 * Custom-wrapped to support toggle loading visibility states.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  children,
  isLoaded = false,
  animationType = "shimmer",
  className = "",
}) => {
  if (isLoaded) {
    return <>{children}</>;
  }

  return (
    <HeroSkeleton
      animationType={animationType}
      className={className}
    />
  );
};
Skeleton.displayName = "Skeleton";
