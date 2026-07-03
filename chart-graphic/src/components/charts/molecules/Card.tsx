"use client";

import React from "react";
import { Card as HeroCard, CardProps as HeroCardProps } from "@heroui/react";

export interface CardProps extends HeroCardProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<React.ComponentProps<typeof HeroCard.Header>> = ({ className = "", ...props }) => (
  <HeroCard.Header
    className={[
      "px-5 pt-4 pb-3 flex items-center justify-between border-b border-default-100 dark:border-default-50/10",
      className,
    ].join(" ")}
    {...props}
  />
);
Header.displayName = "Card.Header";

const Title: React.FC<React.ComponentProps<typeof HeroCard.Title>> = ({ className = "", ...props }) => (
  <HeroCard.Title
    className={[
      "text-base font-semibold text-default-900 dark:text-default-50",
      className,
    ].join(" ")}
    {...props}
  />
);
Title.displayName = "Card.Title";

const Description: React.FC<React.ComponentProps<typeof HeroCard.Description>> = ({ className = "", ...props }) => (
  <HeroCard.Description
    className={[
      "text-xs text-default-500",
      className,
    ].join(" ")}
    {...props}
  />
);
Description.displayName = "Card.Description";

const Content: React.FC<React.ComponentProps<typeof HeroCard.Content>> = ({ className = "", ...props }) => (
  <HeroCard.Content
    className={[
      "p-5 text-default-700 dark:text-default-300",
      className,
    ].join(" ")}
    {...props}
  />
);
Content.displayName = "Card.Content";

const Footer: React.FC<React.ComponentProps<typeof HeroCard.Footer>> = ({ className = "", ...props }) => (
  <HeroCard.Footer
    className={[
      "px-5 py-3 border-t border-default-100 dark:border-default-50/10 flex items-center justify-end gap-2",
      className,
    ].join(" ")}
    {...props}
  />
);
Footer.displayName = "Card.Footer";

/**
 * A composite Card molecule styled with design system defaults (backgrounds, borders, shadows) in HeroUI v3.
 * Utilizes dot-notation syntax: Card.Header, Card.Body (now Card.Content), and Card.Footer.
 */
export const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <HeroCard
      className={[
        "bg-content1 dark:bg-zinc-900 border border-default-100 dark:border-default-50/5 shadow-sm rounded-xl overflow-hidden",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </HeroCard>
  );
};

Card.Header = Header;
Card.Title = Title;
Card.Description = Description;
Card.Content = Content;
Card.Footer = Footer;

Card.displayName = "Card";
