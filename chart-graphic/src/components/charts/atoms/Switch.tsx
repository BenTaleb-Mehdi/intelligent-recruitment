"use client";

import React from "react";
import { Switch as HeroSwitch, SwitchProps as HeroSwitchProps } from "@heroui/react";
import { Icon } from "@iconify/react";

export interface SwitchProps extends Omit<HeroSwitchProps, "children" | "color"> {
  children?: React.ReactNode;
  /** Optional icon to render inside the switch thumb when active (Iconify identifier) */
  startIcon?: string;
  /** Optional icon to render inside the switch thumb when inactive (Iconify identifier) */
  endIcon?: string;
  /** CSS class name overrides for the icons */
  iconClassName?: string;
  /** Semantic color variant */
  color?: "default" | "accent" | "success" | "warning" | "danger";
}

/**
 * A premium, accessible Switch atom built on top of HeroUI Switch (v3).
 * Adds support for Iconify icons inside the thumb, custom label layouts,
 * and Tailwind CSS hover states.
 */
export const Switch: React.FC<SwitchProps> = ({
  children,
  startIcon,
  endIcon,
  iconClassName = "text-[10px]",
  className = "",
  color = "accent",
  isSelected,
  ...props
}) => {
  const colorMap = {
    default: "group-data-[selected=true]/switch:bg-default-500",
    accent: "group-data-[selected=true]/switch:bg-accent",
    success: "group-data-[selected=true]/switch:bg-success",
    warning: "group-data-[selected=true]/switch:bg-warning",
    danger: "group-data-[selected=true]/switch:bg-danger",
  };

  return (
    <HeroSwitch
      className={`group/switch inline-flex flex-row items-center justify-between gap-3 ${className}`}
      isSelected={isSelected}
      {...props}
    >
      <HeroSwitch.Content className="flex flex-row items-center gap-2">
        <HeroSwitch.Control
          className={`w-10 h-6 bg-default-200 dark:bg-default-800 rounded-full p-0.5 relative transition-colors duration-200 cursor-pointer ${colorMap[color]}`}
        >
          <HeroSwitch.Thumb
            className="w-5 h-5 bg-white dark:bg-zinc-900 rounded-full shadow-sm flex items-center justify-center transition-all duration-200 absolute top-0.5 left-0.5 group-data-[selected=true]/switch:left-4.5"
          >
            {isSelected && startIcon && (
              <Icon icon={startIcon} className={`${iconClassName} text-default-800 dark:text-default-200`} />
            )}
            {!isSelected && endIcon && (
              <Icon icon={endIcon} className={`${iconClassName} text-default-400`} />
            )}
          </HeroSwitch.Thumb>
        </HeroSwitch.Control>
        {children && (
          <span className="text-sm text-default-700 dark:text-default-300 font-medium select-none">
            {children}
          </span>
        )}
      </HeroSwitch.Content>
    </HeroSwitch>
  );
};
Switch.displayName = "Switch";
