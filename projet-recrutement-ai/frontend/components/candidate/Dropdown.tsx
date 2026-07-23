"use client";

import React from "react";
import type { Key } from "@heroui/react";
import { ListBox, Select } from "@heroui/react";
import { Icon } from "@iconify/react";

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
  // Convert standard React value/onChange to match HeroUI Select expectations
  const parsedValue = value as any;

  return (
    <Select
      className={className}
      placeholder={placeholder}
      selectionMode={selectionMode}
      value={parsedValue}
      selectedKey={selectionMode === "single" ? (value as Key) : undefined}
      onSelectionChange={selectionMode === "single" && onChange ? (key) => onChange(key) : undefined}
      onChange={selectionMode === "multiple" && onChange ? (keys) => onChange(keys) : undefined}
      aria-label={ariaLabel}
    >
      <Select.Trigger className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 h-10 shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-600">
        <Select.Value className="text-left" />
        <Select.Indicator>
          <Icon icon="solar:alt-arrow-down-linear" className="w-3 h-3 text-slate-400" />
        </Select.Indicator>
      </Select.Trigger>
      <Select.Popover className="border border-slate-200/80 shadow-lg rounded-xl bg-white p-1 z-30 mt-1 min-w-[200px]">
        <ListBox
          selectionMode={selectionMode}
          className="text-xs font-medium text-slate-600"
        >
          {options.map((opt) => (
            <ListBox.Item
              key={opt.id}
              id={opt.id}
              textValue={opt.label}
              className="px-3 py-2 rounded-lg hover:bg-slate-100/80 cursor-pointer flex justify-between items-center outline-none select-none"
            >
              {opt.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
