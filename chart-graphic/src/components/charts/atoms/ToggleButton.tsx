"use client";

import React from "react";
import { ToggleButton as HeroToggleButton, ToggleButtonProps as HeroToggleButtonProps } from "@heroui/react";
import { Icon } from "@iconify/react";

export interface ToggleButtonProps extends HeroToggleButtonProps {
  /** Optional icon to render before children text (Iconify identifier) */
  startIcon?: string;
  /** Optional icon to render after children text (Iconify identifier) */
  endIcon?: string;
  /** CSS class name overrides for the icons */
  iconClassName?: string;
}

/**
 * A ToggleButton atom built on top of HeroUI ToggleButton (v3).
 * Maintains an active/selected state, with built-in Iconify support.
 */
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  children,
  startIcon,
  endIcon,
  iconClassName = "text-lg",
  className = "",
  ...props
}) => {
  return (
    <HeroToggleButton className={className} {...props}>
      {(state) => (
        <div className="flex items-center gap-1.5 select-none">
          {startIcon && <Icon icon={startIcon} className={iconClassName} />}
          {typeof children === "function" ? children(state) : children}
          {endIcon && <Icon icon={endIcon} className={iconClassName} />}
        </div>
      )}
    </HeroToggleButton>
  );
};
ToggleButton.displayName = "ToggleButton";
