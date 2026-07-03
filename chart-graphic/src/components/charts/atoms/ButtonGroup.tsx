"use client";

import React from "react";
import { ButtonGroup as HeroButtonGroup, ButtonGroupProps as HeroButtonGroupProps } from "@heroui/react";

export interface ButtonGroupProps extends HeroButtonGroupProps {
  // Add design system specific extensions here if needed
}

/**
 * A ButtonGroup atom wrapper built on top of HeroUI ButtonGroup (v3).
 * Groups related buttons into a visual block.
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <HeroButtonGroup size={size} className={className} {...props}>
      {children}
    </HeroButtonGroup>
  );
};
ButtonGroup.displayName = "ButtonGroup";
