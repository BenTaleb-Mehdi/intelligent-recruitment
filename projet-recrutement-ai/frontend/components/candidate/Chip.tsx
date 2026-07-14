"use client";

import React from "react";
import { Chip as HeroChip } from "@heroui/react";
import { Icon } from "@iconify/react";

export interface ChipProps {
  children?: React.ReactNode;
  /** Optional icon to render at the start of the chip (Iconify identifier) */
  startIcon?: string;
  /** Optional icon to render at the end of the chip (Iconify identifier) */
  endIcon?: string;
  /** CSS class overrides for the icon */
  iconClassName?: string;
  /** Semantic color variant */
  color?: "default" | "accent" | "success" | "warning" | "danger";
  /** Visual variant theme */
  variant?: "primary" | "secondary" | "soft" | "tertiary";
  /** Direct class overrides */
  className?: string;
}

/**
 * A highly reusable Chip atom built on top of HeroUI Chip (v3).
 * Adds native Iconify support for start/end icons, styled with Tailwind semantic tokens.
 */
export const Chip: React.FC<ChipProps> = ({
  children,
  startIcon,
  endIcon,
  iconClassName = "text-xs",
  color = "default",
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <HeroChip
      color={color}
      variant={variant}
      className={[
        "inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 text-xs h-6 rounded-full border border-transparent",
        className,
      ].join(" ")}
      {...props}
    >
      {startIcon && <Icon icon={startIcon} className={iconClassName} />}
      <HeroChip.Label className="px-0.5">{children}</HeroChip.Label>
      {endIcon && <Icon icon={endIcon} className={iconClassName} />}
    </HeroChip>
  );
};
Chip.displayName = "Chip";
