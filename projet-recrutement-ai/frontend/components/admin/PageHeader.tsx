"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
}

export default function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-2 flex items-center gap-1.5 text-sm text-default-400">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.label}>
              {index > 0 && <Icon icon="lucide:chevron-right" className="size-3.5" />}
              {crumb.href ? (
                <Link href={crumb.href} className="transition hover:text-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h1>
      {description && <p className="mt-1 text-sm text-default-500">{description}</p>}
    </div>
  );
}
