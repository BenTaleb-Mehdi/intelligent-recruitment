"use client";

import React from "react";
import type { Key } from "@heroui/react";
import { Select, ListBox } from "@heroui/react";
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
  const selectedKeys = React.useMemo(() => {
    if (value == null) return [];
    if (value instanceof Set) return Array.from(value);
    if (Array.isArray(value)) return value;
    return [value];
  }, [value]);

  const displayLabel = React.useMemo(() => {
    if (selectedKeys.length === 0) {
      return placeholder;
    }
    if (selectionMode === "multiple") {
      if (selectedKeys.length === options.length) {
        return placeholder || "Tous les statuts";
      }
      if (selectedKeys.length === 1) {
        const found = options.find((o) => String(o.id) === String(selectedKeys[0]));
        return found ? found.label : String(selectedKeys[0]);
      }
      return `${selectedKeys.length} sélectionnés`;
    } else {
      const found = options.find((o) => String(o.id) === String(selectedKeys[0]));
      return found ? found.label : String(selectedKeys[0]);
    }
  }, [selectedKeys, options, placeholder, selectionMode]);

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
      <Select.Trigger className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 h-10 shadow-sm transition-colors cursor-pointer data-[focus=true]:outline-none data-[focus=true]:ring-2 data-[focus=true]:ring-blue-500/20 data-[focus=true]:border-blue-500">
        <span className="truncate">{displayLabel}</span>
        <Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
      </Select.Trigger>
      <Select.Popover className="border border-slate-200/80 shadow-lg rounded-xl bg-white p-1 z-30 min-w-[200px]">
        <ListBox selectionMode={selectionMode}>
          {options.map((opt) => (
            <ListBox.Item
              key={opt.id}
              id={opt.id}
              textValue={opt.label}
              className="px-3 py-2 rounded-lg data-[hover=true]:bg-slate-100/80 cursor-pointer text-xs font-medium text-slate-600 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-600 outline-none select-none flex justify-between items-center w-full"
            >
              {opt.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}