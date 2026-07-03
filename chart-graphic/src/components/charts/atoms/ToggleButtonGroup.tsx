"use client";

import React from "react";
import { ToggleButtonGroup as HeroToggleButtonGroup, ToggleButtonGroupProps as HeroToggleButtonGroupProps } from "@heroui/react";

export interface ToggleButtonGroupProps extends HeroToggleButtonGroupProps {
  // Add design system specific extensions here if needed
}

/**
 * A ToggleButtonGroup atom wrapper built on top of HeroUI ToggleButtonGroup (v3).
 * Groups multiple ToggleButton items together, managing selection states (single/multiple).
 */
export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  children,
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <HeroToggleButtonGroup
      size={size}
      className={className}
      {...props}
    >
      {children}
    </HeroToggleButtonGroup>
  );
};
ToggleButtonGroup.displayName = "ToggleButtonGroup";
