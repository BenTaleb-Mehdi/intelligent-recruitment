"use client";

import React from "react";
import { Badge as HeroBadge } from "@heroui/react";

export interface BadgeProps {
  children?: React.ReactNode;
  /** Counter, icon, or label text to show in the badge bubble */
  content?: React.ReactNode;
  /** Semantic color variant */
  color?: React.ComponentPropsWithoutRef<typeof HeroBadge>["color"];
  /** Visual theme variant */
  variant?: React.ComponentPropsWithoutRef<typeof HeroBadge>["variant"];
  /** Placement quadrant of the badge bubble */
  placement?: React.ComponentPropsWithoutRef<typeof HeroBadge>["placement"];
  /** Direct class name overrides */
  className?: string;
}

/**
 * An accessible Badge atom wrapper built on top of HeroUI Badge (v3).
 * Used to display status notifications, counters, or indicators on top of elements.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  content,
  color = "accent",
  variant = "primary",
  placement = "top-right",
  className = "",
  ...props
}) => {
  return (
    <HeroBadge
      color={color}
      variant={variant}
      placement={placement}
      className={className}
      {...props}
    >
      <HeroBadge.Anchor>{children}</HeroBadge.Anchor>
      {content && <HeroBadge.Label>{content}</HeroBadge.Label>}
    </HeroBadge>
  );
};
Badge.displayName = "Badge";
