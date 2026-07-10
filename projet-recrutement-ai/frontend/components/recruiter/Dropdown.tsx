"use client";

import React from "react";
import type { Key } from "@heroui/react";
import { Select, ListBox, Label } from "@heroui/react";

export interface DropdownOption {
  id: string;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  value?: Key | Key[] | Set<string>;
  onChange?: (value: any) => void;
  selectionMode?: "single" | "multiple";
  className?: string;
  ariaLabel?: string;
}

export default function Dropdown({
  options,
  placeholder = "Sélectionner...",
  value,
  onChange,
  selectionMode = "single",
  className = "",
  ariaLabel,
}: DropdownProps) {

  const normalizedValue =
    value != null
      ? value instanceof Set
        ? [...value]
        : value
      : selectionMode === "multiple"
        ? []
        : null;

  return (
    <Select
      className={className}
      placeholder={placeholder}
      selectionMode={selectionMode}
      value={normalizedValue}
      onChange={(val) => onChange?.(val)}
      aria-label={ariaLabel || "Dropdown"}
    >
      <Select.Trigger className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 h-10 shadow-sm transition-colors cursor-pointer data-[focus=true]:outline-none data-[focus=true]:ring-1 data-[focus=true]:ring-blue-600">
        <Select.Value />
      </Select.Trigger>
      <Select.Popover className="border border-slate-200/80 shadow-lg rounded-xl bg-white p-1 z-30 min-w-[200px]">
        <ListBox selectionMode={selectionMode}>
          {options.map((opt) => (
            <ListBox.Item
              key={opt.id}
              id={opt.id}
              textValue={opt.label}
              className="px-3 py-2 rounded-lg data-[hover=true]:bg-slate-100/80 cursor-pointer text-xs font-medium text-slate-600 data-[selected=true]:bg-slate-50 data-[selected=true]:text-blue-600 outline-none select-none flex justify-between items-center w-full"
            >
              {opt.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}