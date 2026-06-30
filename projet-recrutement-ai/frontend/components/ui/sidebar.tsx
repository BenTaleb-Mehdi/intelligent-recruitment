"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

function parseShortcut(shortcut: string) {
  const parts = shortcut.split("+");
  const key = parts.pop()?.toLowerCase() ?? "";
  const hasMod = parts.includes("mod") || parts.includes("cmd");
  const ctrl = parts.includes("ctrl") || (!isMac() && hasMod);
  const meta = parts.includes("meta") || (isMac() && hasMod);
  const shift = parts.includes("shift");
  const alt = parts.includes("alt");
  return { key, ctrl, meta, shift, alt };
}

type Side = "left" | "right";
type Variant = "sidebar" | "floating" | "inset";
type Collapsible = "icon" | "offcanvas" | "none";

interface SidebarContextValue {
  expanded: boolean;
  setExpanded: (open: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsible: Collapsible;
  variant: Variant;
  side: Side;
  navigate?: (href: string) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  variant?: Variant;
  collapsible?: Collapsible;
  toggleShortcut?: string | false | null;
  navigate?: (href: string) => void;
}

function SidebarProvider({
  children,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  side = "left",
  variant = "sidebar",
  collapsible = "icon",
  toggleShortcut = "mod+b",
  navigate,
}: SidebarProviderProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const expanded = isControlled ? controlledOpen : internalOpen;

  const setExpanded = useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setExpanded(!expanded);
    }
  }, [isMobile, expanded, setExpanded]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!toggleShortcut) return;
    const handler = (e: KeyboardEvent) => {
      const { key, ctrl, meta, shift, alt } = parseShortcut(toggleShortcut);
      const match =
        e.key.toLowerCase() === key &&
        e.ctrlKey === ctrl &&
        e.metaKey === meta &&
        e.shiftKey === shift &&
        e.altKey === alt;
      if (match) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleShortcut, toggleSidebar]);

  const value: SidebarContextValue = {
    expanded,
    setExpanded,
    toggleSidebar,
    isMobile,
    mobileOpen,
    setMobileOpen,
    collapsible,
    variant,
    side,
    navigate,
  };

  return (
    <SidebarContext.Provider value={value}>
      <div
        className={cn(
          "flex min-h-svh w-full",
          side === "right" && "flex-row-reverse",
        )}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

const SidebarPanel = forwardRef<HTMLElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    const { expanded, isMobile, collapsible, side, variant } = useSidebar();

    if (isMobile) return null;

    const isCollapsed = !expanded && collapsible !== "none";
    const isOffcanvas = collapsible === "offcanvas" && !expanded;

    return (
      <aside
        ref={ref}
        className={cn(
          "h-svh flex flex-col overflow-hidden bg-content1 transition-all duration-200 ease relative",
          variant === "sidebar" && "border-r border-divider",
          variant === "floating" && "m-2 rounded-xl shadow-md",
          variant === "inset" && "bg-transparent",
          side === "left" && "order-0",
          side === "right" && "order-1",
          isCollapsed && !isOffcanvas && "w-[var(--sidebar-width-collapsed,56px)]",
          isCollapsed && isOffcanvas && "w-0 translate-x-full",
          !isCollapsed && collapsible !== "none" && "w-[var(--sidebar-width,240px)]",
          collapsible === "none" && "w-[var(--sidebar-width,240px)]",
          className,
        )}
        data-state={expanded ? "expanded" : "collapsed"}
        data-collapsible={collapsible}
        style={
          {
            "--sidebar-width": "240px",
            "--sidebar-width-collapsed": "56px",
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </aside>
    );
  },
);
SidebarPanel.displayName = "Sidebar";

function SidebarHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col px-3 py-4 border-b border-divider", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-3 py-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col px-3 py-4 border-t border-divider", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function SidebarGroup({ className, children, ...props }: SidebarGroupProps) {
  return (
    <div className={cn("flex flex-col [&+&]:mt-4", className)} {...props}>
      {children}
    </div>
  );
}

function SidebarGroupLabel({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { expanded } = useSidebar();
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-default-400",
        !expanded && "hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarMenuProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function SidebarMenu({ className, children, ...props }: SidebarMenuProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)} {...props}>
      {children}
    </div>
  );
}

interface SidebarMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  href?: string;
  isCurrent?: boolean;
  forceReload?: boolean;
  icon?: ReactNode;
  label?: ReactNode;
  chip?: ReactNode;
  children?: ReactNode;
}

function SidebarMenuItem({
  className,
  href,
  isCurrent = false,
  forceReload = false,
  icon,
  label,
  chip,
  children,
  ...props
}: SidebarMenuItemProps) {
  const { expanded, navigate, setMobileOpen } = useSidebar();
  const pathname = usePathname();
  const active = isCurrent || (href && pathname === href);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const hasChildren = React.Children.count(children) > 0;

  const handleClick = useCallback(() => {
    if (hasChildren) {
      setSubmenuOpen((prev) => !prev);
      return;
    }
    if (href) {
      if (href.startsWith("http://") || href.startsWith("https://")) {
        window.open(href, "_blank");
      } else if (forceReload) {
        window.location.href = href;
      } else if (navigate) {
        navigate(href);
      } else {
        window.location.href = href;
      }
    }
    setMobileOpen(false);
  }, [href, forceReload, navigate, hasChildren, setMobileOpen]);

  return (
    <div className={cn("relative", className)}>
      <div
        role="button"
        tabIndex={0}
        aria-current={active ? "page" : undefined}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className={cn(
          "relative flex items-center gap-2 rounded-2xl min-h-9 px-2 py-1.5 cursor-pointer transition-colors duration-150",
          "hover:bg-default-100",
          active && "bg-default-200 font-medium",
          !expanded && "justify-center px-0",
        )}
        title={!expanded && typeof label === "string" ? label : undefined}
        {...props}
      >
        {icon && (
          <span className="size-5 flex-shrink-0 text-default-500">
            {icon}
          </span>
        )}
        {label && (
          <span className={cn("flex-1 text-sm truncate", !expanded && "hidden")}>
            {label}
          </span>
        )}
        {chip && (
          <span className={cn("text-xs tabular-nums text-default-400", !expanded && "hidden")}>
            {chip}
          </span>
        )}
        {hasChildren && (
          <svg
            className={cn(
              "size-4 text-default-400 transition-transform duration-200 flex-shrink-0",
              submenuOpen && "rotate-90",
              !expanded && "hidden",
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        )}
      </div>
      {hasChildren && (
        <AnimatePresence initial={false}>
          {submenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-4 pl-2 border-l border-divider mt-0.5">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function SidebarMenuIcon({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("size-5 flex-shrink-0", className)} {...props}>
      {children}
    </span>
  );
}

function SidebarMenuLabel({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("text-sm truncate flex-1", className)} {...props}>
      {children}
    </span>
  );
}

function SidebarMenuChip({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("text-xs tabular-nums text-default-400", className)} {...props}>
      {children}
    </span>
  );
}

function SidebarSeparator({
  className,
  ...props
}: HTMLAttributes<HTMLHRElement>) {
  return (
    <hr className={cn("my-2 border-divider", className)} {...props} />
  );
}

function SidebarRail({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { toggleSidebar, side } = useSidebar();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Toggle sidebar"
      onClick={toggleSidebar}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleSidebar();
        }
      }}
      className={cn(
        "absolute top-0 bottom-0 w-1.5 cursor-col-resize z-10",
        "hover:bg-primary/20 transition-colors",
        side === "left" ? "right-0" : "left-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="sm"
      isIconOnly
      onPress={toggleSidebar}
      className={cn("", className)}
      {...props}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
      </svg>
    </Button>
  );
}

function SidebarMain({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <main className={cn("flex-1 min-h-svh overflow-auto", className)} {...props}>
      {children}
    </main>
  );
}

function SidebarMobile({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const { isMobile, mobileOpen, setMobileOpen, side } = useSidebar();

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: side === "left" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "left" ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 bottom-0 z-50 w-[280px] bg-content1 shadow-xl flex flex-col overflow-hidden",
              side === "left" ? "left-0" : "right-0",
              className,
            )}
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

const Sidebar = Object.assign(SidebarPanel, {
  Provider: SidebarProvider,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuIcon: SidebarMenuIcon,
  MenuLabel: SidebarMenuLabel,
  MenuChip: SidebarMenuChip,
  Separator: SidebarSeparator,
  Rail: SidebarRail,
  Trigger: SidebarTrigger,
  Main: SidebarMain,
  Mobile: SidebarMobile,
});

export { Sidebar, useSidebar };
