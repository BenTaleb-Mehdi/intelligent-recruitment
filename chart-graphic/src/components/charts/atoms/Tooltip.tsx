"use client";

import React from "react";
import { Tooltip as HeroTooltip } from "@heroui/react";

export interface TooltipProps {
  children: React.ReactNode;
  /** Tooltip description content */
  content: React.ReactNode;
  /** Delay in milliseconds before showing the tooltip */
  delay?: number;
  /** Delay in milliseconds before closing the tooltip */
  closeDelay?: number;
  /** Placement direction of the tooltip */
  placement?: React.ComponentPropsWithoutRef<typeof HeroTooltip.Content>["placement"];
  /** Custom className for the content box */
  className?: string;
  /** Option to render standard pointer arrow */
  showArrow?: boolean;
}

/**
 * A highly reusable Tooltip component built on top of HeroUI's Tooltip (v3).
 * Styled with Tailwind semantic tokens for seamless integration across light and dark modes.
 */
export const Tooltip = ({
  children,
  content,
  delay = 100,
  closeDelay = 100,
  placement = "top",
  className = "",
  showArrow = false,
  ...props
}: TooltipProps) => {
  return (
    <HeroTooltip delay={delay} closeDelay={closeDelay} {...props}>
      <HeroTooltip.Trigger>
        <span className="inline-block">{children}</span>
      </HeroTooltip.Trigger>
      <HeroTooltip.Content
        placement={placement}
        showArrow={showArrow}
        className={[
          "py-1.5 px-3",
          "bg-content1 dark:bg-zinc-900",
          "text-default-900 dark:text-default-100",
          "text-xs font-medium",
          "rounded-md shadow-medium",
          "border border-default-100 dark:border-default-50/10",
          className,
        ].join(" ")}
      >
        {content}
      </HeroTooltip.Content>
    </HeroTooltip>
  );
};

Tooltip.Trigger = HeroTooltip.Trigger;
Tooltip.Content = HeroTooltip.Content;
Tooltip.Arrow = HeroTooltip.Arrow;

Tooltip.displayName = "Tooltip";
