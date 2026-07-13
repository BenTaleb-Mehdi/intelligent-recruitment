"use client";

import React from "react";
import { Calendar as HeroUICalendar } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";

export interface CalendarProps {
  value: CalendarDate | null;
  onChange: (date: CalendarDate | null) => void;
  ariaLabel?: string;
  className?: string;
}

export default function Calendar({
  value,
  onChange,
  ariaLabel = "Calendar",
  className = "",
}: CalendarProps) {
  return (
    <div
      className={`bg-white p-3 rounded-2xl border border-slate-200/50 w-full max-w-[280px] sm:max-w-none flex justify-center ${className}`}
    >
      <HeroUICalendar aria-label={ariaLabel} value={value} onChange={onChange}>
        <HeroUICalendar.Header>
          <HeroUICalendar.Heading />
          <HeroUICalendar.NavButton slot="previous" />
          <HeroUICalendar.NavButton slot="next" />
        </HeroUICalendar.Header>
        <HeroUICalendar.Grid>
          <HeroUICalendar.GridHeader>
            {(day: string) => (
              <HeroUICalendar.HeaderCell>{day}</HeroUICalendar.HeaderCell>
            )}
          </HeroUICalendar.GridHeader>
          <HeroUICalendar.GridBody>
            {(date: CalendarDate) => <HeroUICalendar.Cell date={date} />}
          </HeroUICalendar.GridBody>
        </HeroUICalendar.Grid>
      </HeroUICalendar>
      <style>{`
        [data-slot="calendar-heading"] {
          color: #1e293b !important;
        }
        [data-slot="calendar-header-cell"] {
          color: #64748b !important;
        }
        [data-slot="calendar-cell"] {
          color: #1e293b !important;
        }
        [data-slot="calendar-cell"][data-selected="true"] {
          color: #ffffff !important;
        }
        [data-slot="calendar-cell"][data-outside-month="true"],
        [data-slot="calendar-cell"][data-outside-visible-range="true"],
        [data-slot="calendar-cell"][data-disabled="true"] {
          color: #cbd5e1 !important;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
