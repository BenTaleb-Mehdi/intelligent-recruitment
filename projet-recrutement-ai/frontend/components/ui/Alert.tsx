"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

type AlertVariant = "danger" | "success" | "warning" | "info";

interface AlertProps {
    variant: AlertVariant;
    message: string;
    title?: string;
    /** Auto-dismiss delay in ms. Set to 0 to disable auto-dismiss. Default: 5000 */
    duration?: number;
    className?: string;
}

const variantConfig: Record<
    AlertVariant,
    {
        icon: string;
        containerClass: string;
        iconWrapperClass: string;
        titleClass: string;
        messageClass: string;
        leftBarClass: string;
        progressClass: string;
    }
> = {
    danger: {
        icon: "solar:danger-triangle-bold",
        containerClass:
            "bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800/50 shadow-xl shadow-red-100/40 dark:shadow-red-950/20",
        iconWrapperClass:
            "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
        titleClass: "text-red-800 dark:text-red-300",
        messageClass: "text-red-600 dark:text-red-400",
        leftBarClass: "bg-red-500",
        progressClass: "bg-red-400",
    },
    success: {
        icon: "solar:check-circle-bold",
        containerClass:
            "bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800/50 shadow-xl shadow-emerald-100/40 dark:shadow-emerald-950/20",
        iconWrapperClass:
            "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
        titleClass: "text-emerald-800 dark:text-emerald-300",
        messageClass: "text-emerald-600 dark:text-emerald-400",
        leftBarClass: "bg-emerald-500",
        progressClass: "bg-emerald-400",
    },
    warning: {
        icon: "solar:bell-bing-bold",
        containerClass:
            "bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800/50 shadow-xl shadow-amber-100/40 dark:shadow-amber-950/20",
        iconWrapperClass:
            "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
        titleClass: "text-amber-800 dark:text-amber-300",
        messageClass: "text-amber-600 dark:text-amber-400",
        leftBarClass: "bg-amber-500",
        progressClass: "bg-amber-400",
    },
    info: {
        icon: "solar:info-circle-bold",
        containerClass:
            "bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-800/50 shadow-xl shadow-blue-100/40 dark:shadow-blue-950/20",
        iconWrapperClass:
            "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
        titleClass: "text-blue-800 dark:text-blue-300",
        messageClass: "text-blue-600 dark:text-blue-400",
        leftBarClass: "bg-blue-500",
        progressClass: "bg-blue-400",
    },
};

export default function Alert({
    variant,
    message,
    title,
    duration = 5000,
    className = "",
}: AlertProps) {
    const config = variantConfig[variant];
    const [visible, setVisible] = useState(true);

    // Reset visibility and restart the timer whenever the message changes
    useEffect(() => {
        setVisible(true);
        if (duration > 0) {
            const timer = setTimeout(() => setVisible(false), duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    role="alert"
                    key={message}
                    initial={{ opacity: 0, y: -24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className={`
                        fixed top-5 left-1/2 -translate-x-1/2 z-[9999]
                        w-[calc(100vw-32px)] max-w-[420px]
                        rounded-lg overflow-hidden bg-white
                        ${config.containerClass} ${className}
                    `}
                >
                    {/* Left accent bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[3.5px] ${config.leftBarClass}`} />

                    {/* Content row */}
                    <div className="flex items-start gap-3 px-4 py-3.5 pl-5">
                        {/* Icon bubble */}
                        <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${config.iconWrapperClass}`}>
                            <Icon icon={config.icon} className="w-[18px] h-[18px]" />
                        </div>

                        {/* Text */}
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                            {title && (
                                <p className={`text-[13px] font-semibold leading-snug ${config.titleClass}`}>
                                    {title}
                                </p>
                            )}
                            <p className={`text-xs leading-snug ${config.messageClass}`}>{message}</p>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setVisible(false)}
                            className="shrink-0 mt-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            aria-label="Dismiss alert"
                        >
                            <Icon icon="solar:close-circle-bold" className="w-4.5 h-4.5" />
                        </button>
                    </div>

                    {/* Auto-dismiss shrinking progress bar */}
                    {duration > 0 && (
                        <motion.div
                            className={`h-[2.5px] ${config.progressClass} origin-left`}
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: duration / 1000, ease: "linear" }}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
