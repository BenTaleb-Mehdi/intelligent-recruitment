"use client";

import React from "react";
import { Icon } from "@iconify/react";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  containerClassName?: string;
  onClear?: () => void;
}

export default function SearchInput({
  icon = "solar:magnifer-linear",
  containerClassName = "",
  className = "",
  onClear,
  value,
  ...props
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center w-full ${containerClassName}`}>
      <Icon
        icon={icon}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        className={`w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 ${value && onClear ? 'pr-9' : 'pr-4'} py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium h-10 shadow-sm ${className}`}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
        >
          <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
