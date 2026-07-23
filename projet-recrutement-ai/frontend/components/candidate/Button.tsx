"use client";

import React from "react";
import { Button as HeroButton, ButtonProps as HeroButtonProps } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Spinner } from "./Spinner";

export interface ButtonProps extends HeroButtonProps {
  /** Optional icon to render before children text (Iconify identifier) */
  startIcon?: string;
  /** Optional icon to render after children text (Iconify identifier) */
  endIcon?: string;
  /** Custom class overrides for the icon size/styles */
  iconClassName?: string;
  /** Displays a spinner loading state and disables the button */
  isLoading?: boolean;
}

/**
 * A highly reusable Button atom built on top of HeroUI Button (v3),
 * extending support for Iconify icons and standardized loaders.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  startIcon,
  endIcon,
  iconClassName = "text-lg",
  isLoading = false,
  className = "",
  isDisabled,
  ...props
}) => {
  return (
    <HeroButton
      className={className}
      isDisabled={isDisabled || isLoading}
      {...props}
    >
      {(state) => (
        <div className="flex items-center gap-1.5 select-none">
          {isLoading && <Spinner size="sm" color="current" />}
          {!isLoading && startIcon && <Icon icon={startIcon} className={iconClassName} />}
          {typeof children === "function" ? children(state) : children}
          {!isLoading && endIcon && <Icon icon={endIcon} className={iconClassName} />}
        </div>
      )}
    </HeroButton>
  );
};
Button.displayName = "Button";
