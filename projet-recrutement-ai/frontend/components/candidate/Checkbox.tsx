"use client";

import React from "react";
import { Checkbox as HeroCheckbox, CheckboxProps as HeroCheckboxProps } from "@heroui/react";
import { Icon } from "@iconify/react";

export interface CheckboxProps extends HeroCheckboxProps {
  children?: React.ReactNode;
  /** Optional helper text displayed below the checkbox label */
  description?: string;
  /** Semantic color theme */
  color?: "default" | "accent" | "success" | "warning" | "danger";
  /** direct className overrides */
  className?: string;
}

/**
 * A highly maintainable and accessible Checkbox atom built on top of HeroUI Checkbox (v3).
 * Supports labels, helper descriptions, indeterminate states, and custom Tailwind styling.
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  children,
  description,
  className = "",
  color = "accent",
  isSelected,
  ...props
}) => {
  const colorMap = {
    default: "group-data-[selected=true]/checkbox:bg-default-500 group-data-[selected=true]/checkbox:border-default-500",
    accent: "group-data-[selected=true]/checkbox:bg-accent group-data-[selected=true]/checkbox:border-accent",
    success: "group-data-[selected=true]/checkbox:bg-success group-data-[selected=true]/checkbox:border-success",
    warning: "group-data-[selected=true]/checkbox:bg-warning group-data-[selected=true]/checkbox:border-warning",
    danger: "group-data-[selected=true]/checkbox:bg-danger group-data-[selected=true]/checkbox:border-danger",
  };

  return (
    <HeroCheckbox
      className={`group/checkbox inline-flex max-w-md items-start justify-start p-1.5 rounded-lg cursor-pointer transition-colors ${className}`}
      isSelected={isSelected}
      {...props}
    >
      <HeroCheckbox.Content className="flex flex-row items-start gap-2.5">
        <HeroCheckbox.Control
          className={`w-4 h-4 border border-default-400 dark:border-default-700 rounded flex items-center justify-center transition-colors shrink-0 mt-0.5 ${colorMap[color]}`}
        >
          <HeroCheckbox.Indicator className="text-white">
            <Icon icon="solar:check-bold" className="text-[10px]" />
          </HeroCheckbox.Indicator>
        </HeroCheckbox.Control>
        <div className="flex flex-col select-none">
          {children && (
            <span className="text-sm text-default-700 dark:text-default-300 font-medium">
              {children}
            </span>
          )}
          {description && (
            <span className="text-xs text-default-500 mt-0.5">
              {description}
            </span>
          )}
        </div>
      </HeroCheckbox.Content>
    </HeroCheckbox>
  );
};
Checkbox.displayName = "Checkbox";
