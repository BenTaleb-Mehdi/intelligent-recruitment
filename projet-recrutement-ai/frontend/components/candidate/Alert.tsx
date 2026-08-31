"use client";

import React from "react";
import { Alert as HeroAlert, AlertProps as HeroAlertProps } from "@heroui/react";
import { Icon } from "@iconify/react";

export interface AlertProps extends Omit<HeroAlertProps, "status" | "children"> {
  children?: React.ReactNode;
  /** Alert status layout */
  status?: "default" | "accent" | "success" | "warning" | "danger";
  /** Optional icon override (Iconify identifier) */
  customIcon?: string;
  /** Optional title shorthand */
  title?: string;
  /** Optional description shorthand */
  description?: string;
  /** Additional styling classes */
  className?: string;
}

const AlertIcon: React.FC<{ icon?: string; className?: string }> = ({ icon, className = "" }) => {
  if (!icon) return null;
  return <Icon icon={icon} className={["text-lg flex-shrink-0 mt-0.5", className].join(" ")} />;
};
AlertIcon.displayName = "Alert.Icon";

const AlertTitle: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, className = "", ...props }) => (
  <span className={["font-semibold text-sm text-default-900 select-none", className].join(" ")} {...props}>
    {children}
  </span>
);
AlertTitle.displayName = "Alert.Title";

const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = "", ...props }) => (
  <p className={["text-xs text-default-500 mt-0.5 select-none", className].join(" ")} {...props}>
    {children}
  </p>
);
AlertDescription.displayName = "Alert.Description";

const AlertContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={["flex-1 flex flex-col gap-0.5", className].join(" ")} {...props}>
    {children}
  </div>
);
AlertContent.displayName = "Alert.Content";

/**
 * A highly configurable Alert molecule built on top of HeroUI Alert (v3).
 * Supports shorthand properties (title, description, customIcon) and
 * custom compound notation composition: Alert, Alert.Icon, Alert.Title, Alert.Description.
 */
export const Alert = ({
  children,
  title,
  description,
  customIcon,
  status = "default",
  className = "",
  ...props
}: AlertProps) => {
  const iconMap = {
    default: "solar:info-circle-bold-duotone",
    accent: "solar:info-circle-bold-duotone",
    success: "solar:check-circle-bold-duotone",
    warning: "solar:danger-bold-duotone",
    danger: "solar:close-circle-bold-duotone",
  };

  const selectedIcon = customIcon || iconMap[status] || iconMap.default;

  return (
    <HeroAlert
      status={status}
      className={[
        "flex items-start gap-3 p-4 rounded-xl border border-default-100 dark:border-default-50/5 shadow-sm w-full",
        className,
      ].join(" ")}
      {...props}
    >
      {children ? (
        children
      ) : (
        <div className="flex items-start gap-3 w-full">
          <AlertIcon icon={selectedIcon} />
          <AlertContent>
            {title && <AlertTitle>{title}</AlertTitle>}
            {description && <AlertDescription>{description}</AlertDescription>}
          </AlertContent>
        </div>
      )}
    </HeroAlert>
  );
};

Alert.Icon = AlertIcon;
Alert.Title = AlertTitle;
Alert.Description = AlertDescription;
Alert.Content = AlertContent;

Alert.displayName = "Alert";
