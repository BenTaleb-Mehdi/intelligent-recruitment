"use client";

import React from "react";
import {
  Accordion as HeroAccordion,
  AccordionItemProps as HeroAccordionItemProps,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  hideSeparator?: boolean;
}

export interface AccordionItemProps extends Omit<HeroAccordionItemProps, "children" | "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  startIcon?: string;
  children?: React.ReactNode;
  className?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  title,
  subtitle,
  startIcon,
  className = "",
  id,
  ...props
}) => {
  return (
    <HeroAccordion.Item
      id={id}
      className={`py-2 border-b border-default-100 dark:border-default-50/5 last:border-b-0 ${className}`}
      {...props}
    >
      <HeroAccordion.Heading>
        <HeroAccordion.Trigger className="flex w-full items-center justify-between py-2 hover:bg-default-50 dark:hover:bg-default-50/5 px-2 rounded-lg transition-colors group">
          <div className="flex items-center gap-2">
            {startIcon && <Icon icon={startIcon} className="text-lg text-default-500" />}
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-default-800 dark:text-default-200 select-none">
                {title}
              </span>
              {subtitle && <span className="text-xs text-default-500 select-none">{subtitle}</span>}
            </div>
          </div>
          <HeroAccordion.Indicator className="text-base text-default-400 transition-transform duration-300 group-data-[expanded=true]:rotate-180 group-data-[expanded=true]:text-accent">
            <Icon icon="solar:alt-arrow-down-bold-duotone" />
          </HeroAccordion.Indicator>
        </HeroAccordion.Trigger>
      </HeroAccordion.Heading>
      <HeroAccordion.Panel className="px-2">
        <HeroAccordion.Body className="text-sm text-default-600 dark:text-default-400 py-2">
          {children}
        </HeroAccordion.Body>
      </HeroAccordion.Panel>
    </HeroAccordion.Item>
  );
};
AccordionItem.displayName = "Accordion.Item";

/**
 * A highly styled Accordion molecule built on top of HeroUI Accordion (v3).
 * Utilizes dot-notation: Accordion and Accordion.Item.
 * Uses solar Iconify icons for expand indicators.
 */
export const Accordion = ({ children, className = "", hideSeparator = false, ...props }: AccordionProps) => {
  return (
    <HeroAccordion
      hideSeparator={hideSeparator}
      className={[
        "w-full bg-content1 dark:bg-zinc-900 border border-default-100 dark:border-default-50/5 shadow-sm rounded-xl p-4",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </HeroAccordion>
  );
};

Accordion.Item = AccordionItem;
Accordion.displayName = "Accordion";
