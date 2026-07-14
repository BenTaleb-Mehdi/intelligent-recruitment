"use client";

import React from "react";
import { Slider as HeroSlider, SliderProps as HeroSliderProps } from "@heroui/react";

export interface SliderProps extends Omit<HeroSliderProps, "children"> {
  /** Text label displayed above the slider */
  label?: string;
  /** Direct className styled override */
  className?: string;
  /** Semantic color theme */
  color?: "default" | "accent" | "success" | "warning" | "danger";
  /** Option to display the value output label */
  showValue?: boolean;
}

/**
 * A highly interactive Slider atom built on top of HeroUI Slider (v3).
 * Ideal for parameters, range zoom, or data filtering thresholds in dashboards.
 */
export const Slider: React.FC<SliderProps> = ({
  label,
  className = "",
  color = "accent",
  showValue = true,
  ...props
}) => {
  const colorMap = {
    default: "bg-default-400",
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  };

  return (
    <HeroSlider className={`max-w-md w-full gap-2 ${className}`} {...props}>
      {(label || showValue) && (
        <div className="flex justify-between items-baseline mb-1.5">
          {label && (
            <span className="text-sm font-semibold text-default-700 dark:text-default-300 select-none">
              {label}
            </span>
          )}
          {showValue && <HeroSlider.Output className="text-sm font-medium text-default-500" />}
        </div>
      )}
      <HeroSlider.Track className="bg-default-100 dark:bg-default-850 h-1.5 rounded-full relative">
        <HeroSlider.Fill className={`h-full rounded-full absolute ${colorMap[color]}`} />
        <HeroSlider.Thumb className="w-5 h-5 bg-white dark:bg-zinc-900 border border-default-250 dark:border-default-700 shadow-md rounded-full top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent" />
      </HeroSlider.Track>
    </HeroSlider>
  );
};
Slider.displayName = "Slider";
