"use client";

import React from "react";
import { Icon } from "@iconify/react";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  containerClassName?: string;
}

export default function SearchInput({
  icon = "solar:magnifer-linear",
  containerClassName = "",
  className = "",
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
        className={`w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium ${className}`}
        {...props}
      />
    </div>
  );
}
