"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";

// Import Atoms
import { Button } from "@/components/charts/atoms/Button";
import { Tooltip } from "@/components/charts/atoms/Tooltip";
import { Indicator } from "@/components/charts/atoms/Indicator";
import { Checkbox } from "@/components/charts/atoms/Checkbox";
import { Switch } from "@/components/charts/atoms/Switch";
import { ProgressCircle } from "@/components/charts/atoms/ProgressCircle";
import { ButtonGroup } from "@/components/charts/atoms/ButtonGroup";
import { ToggleButton } from "@/components/charts/atoms/ToggleButton";
import { ToggleButtonGroup } from "@/components/charts/atoms/ToggleButtonGroup";
import { Badge } from "@/components/charts/atoms/Badge";
import { Chip } from "@/components/charts/atoms/Chip";
import { Kbd } from "@/components/charts/atoms/Kbd";
import { Spinner } from "@/components/charts/atoms/Spinner";
import { Skeleton } from "@/components/charts/atoms/Skeleton";
import { Slider } from "@/components/charts/atoms/Slider";

// Import Molecules
import { Card } from "@/components/charts/molecules/Card";
import { Surface } from "@/components/charts/molecules/Surface";
import { Alert } from "@/components/charts/molecules/Alert";
import { Accordion } from "@/components/charts/molecules/Accordion";

interface ComponentItem {
  id: string;
  name: string;
  type: "atom" | "molecule";
  description: string;
  icon: string;
}

const COMPONENTS_MANIFEST: ComponentItem[] = [
  // Atoms
  { id: "button", name: "Button", type: "atom", description: "Standard interactive button supporting loading spinner states and start/end Iconify icons.", icon: "solar:button-bold" },
  { id: "tooltip", name: "Tooltip", type: "atom", description: "Contextual description popup showing on trigger hover or focus.", icon: "solar:info-circle-bold" },
  { id: "indicator", name: "Indicator", type: "atom", description: "Visual status dot or growth/decline trend badge wrapper.", icon: "solar:point-on-map-bold" },
  { id: "checkbox", name: "Checkbox", type: "atom", description: "Binary control toggle for options supporting label descriptions and custom colors.", icon: "solar:check-square-bold" },
  { id: "switch", name: "Switch", type: "atom", description: "Interactive sliding toggle switch supporting custom icons inside the track.", icon: "solar:slider-bold" },
  { id: "progress-circle", name: "ProgressCircle", type: "atom", description: "Circular indicator showing indeterminate or determinate loading states with optional center text.", icon: "solar:refresh-circle-bold" },
  { id: "button-group", name: "ButtonGroup", type: "atom", description: "Layout container grouping related buttons into unified visual segments.", icon: "solar:window-frame-bold" },
  { id: "toggle-button", name: "ToggleButton", type: "atom", description: "Selectable action button maintaining state value configurations.", icon: "solar:pin-bold" },
  { id: "toggle-button-group", name: "ToggleButtonGroup", type: "atom", description: "Container managing single or multiple selection groups for toggle buttons.", icon: "solar:layers-bold" },
  { id: "badge", name: "Badge", type: "atom", description: "Small anchor wrapper rendering numeric or status badges in corners.", icon: "solar:medal-ribbons-bold" },
  { id: "chip", name: "Chip", type: "atom", description: "Visual label pill representing tags, categories, or indicators.", icon: "solar:tag-bold" },
  { id: "kbd", name: "Kbd", type: "atom", description: "Keyboard key symbol indicator representing shortcut mappings.", icon: "solar:keyboard-bold" },
  { id: "spinner", name: "Spinner", type: "atom", description: "Animated visual loading element supporting customized descriptions.", icon: "solar:restart-bold" },
  { id: "skeleton", name: "Skeleton", type: "atom", description: "Layout placeholder box used to render content loading transitions.", icon: "solar:ghost-bold" },
  { id: "slider", name: "Slider", type: "atom", description: "Horizontal parameter selector supporting range fills and label outputs.", icon: "solar:tuning-bold" },

  // Molecules
  { id: "card", name: "Card", type: "molecule", description: "Composite container wrapper structuring layouts with Card.Header, Card.Content, and Card.Footer.", icon: "solar:card-rec-bold" },
  { id: "surface", name: "Surface", type: "molecule", description: "General visual backdrop container panel handling border elevation, variant types, and rounding.", icon: "solar:palette-bold" },
  { id: "alert", name: "Alert", type: "molecule", description: "Notification banner displaying status indicators, title headlines, and info descriptions.", icon: "solar:danger-triangle-bold" },
  { id: "accordion", name: "Accordion", type: "molecule", description: "Vertical collapsible list managing expandable panels via Accordion.Item blocks.", icon: "solar:double-alt-arrow-down-bold" },
];

export default function WorkshopPage() {
  const [selectedId, setSelectedId] = useState<string>("button");
  const [searchQuery, setSearchQuery] = useState("");

  // Search filter
  const filteredManifest = useMemo(() => {
    return COMPONENTS_MANIFEST.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const activeComponent = useMemo(() => {
    return COMPONENTS_MANIFEST.find((c) => c.id === selectedId) || COMPONENTS_MANIFEST[0];
  }, [selectedId]);

  // States for Playground Components
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnSize, setBtnSize] = useState<"sm" | "md" | "lg">("md");
  const [btnVariant, setBtnVariant] = useState<"primary" | "secondary" | "tertiary" | "outline" | "ghost">("primary");

  const [tooltipPlacement, setTooltipPlacement] = useState<any>("top");
  const [tooltipArrow, setTooltipArrow] = useState(true);

  const [indicatorStatus, setIndicatorStatus] = useState<any>("success");
  const [indicatorVariant, setIndicatorVariant] = useState<any>("dot");
  const [indicatorTrend, setIndicatorTrend] = useState<any>("up");
  const [indicatorPulse, setIndicatorPulse] = useState(true);

  const [chkColor, setChkColor] = useState<any>("accent");
  const [chkChecked, setChkChecked] = useState(false);
  const [chkDesc, setChkDesc] = useState("Enable optional usage tracking data analytics.");

  const [swColor, setSwColor] = useState<any>("accent");
  const [swChecked, setSwChecked] = useState(false);

  const [progressVal, setProgressVal] = useState(65);
  const [progressColor, setProgressColor] = useState<any>("accent");
  const [progressStroke, setProgressStroke] = useState(4);

  const [toggleSelected, setToggleSelected] = useState(false);
  const [toggleGroupSel, setToggleGroupSel] = useState<any>(new Set(["list"]));

  const [badgeColor, setBadgeColor] = useState<any>("accent");
  const [badgePlacement, setBadgePlacement] = useState<any>("top-right");

  const [chipColor, setChipColor] = useState<any>("default");
  const [chipVariant, setChipVariant] = useState<any>("soft");

  const [spinColor, setSpinColor] = useState<any>("accent");
  const [spinSize, setSpinSize] = useState<any>("md");
  const [spinLabel, setSpinLabel] = useState("Processing details...");

  const [skLoaded, setSkLoaded] = useState(false);
  const [skAnimation, setSkAnimation] = useState<any>("shimmer");

  const [sldColor, setSldColor] = useState<any>("accent");
  const [sldVal, setSldVal] = useState(45);
  const [sldShowVal, setSldShowVal] = useState(true);

  const [surfElevation, setSurfElevation] = useState<any>("raised");
  const [surfVariant, setSurfVariant] = useState<any>("solid");
  const [surfRounded, setSurfRounded] = useState<any>("xl");

  const [alertStatus, setAlertStatus] = useState<any>("warning");

  // Code snippets generator
  const codeSnippet = useMemo(() => {
    switch (activeComponent.id) {
      case "button":
        return `import { Button } from "@/components/charts/atoms/Button";\n\n<Button\n  startIcon="solar:star-bold"\n  isLoading={${btnLoading}}\n  isDisabled={${btnDisabled}}\n  size="${btnSize}"\n  variant="${btnVariant}"\n  color="accent"\n>\n  Explore Data\n</Button>`;
      case "tooltip":
        return `import { Tooltip } from "@/components/charts/atoms/Tooltip";\n\n<Tooltip\n  content="Configure chart threshold limits"\n  placement="${tooltipPlacement}"\n  showArrow={${tooltipArrow}}\n>\n  <Button color="accent">Hover Me</Button>\n</Tooltip>`;
      case "indicator":
        return `import { Indicator } from "@/components/charts/atoms/Indicator";\n\n${
          indicatorVariant === "dot"
            ? `<Indicator\n  status="${indicatorStatus}"\n  pulse={${indicatorPulse}}\n  label="Active Database Nodes"\n/>`
            : `<Indicator\n  variant="trend"\n  trend="${indicatorTrend}"\n  label="${indicatorTrend === "up" ? "+18.4%" : indicatorTrend === "down" ? "-5.2%" : "Neutral"}"\n/>`
        }`;
      case "checkbox":
        return `import { Checkbox } from "@/components/charts/atoms/Checkbox";\n\n<Checkbox\n  color="${chkColor}"\n  isSelected={${chkChecked}}\n  onChange={(e) => setChecked(e.target.checked)}\n  description="${chkDesc}"\n>\n  Data Analytics Feed\n</Checkbox>`;
      case "switch":
        return `import { Switch } from "@/components/charts/atoms/Switch";\n\n<Switch\n  color="${swColor}"\n  isSelected={${swChecked}}\n  startIcon="solar:sun-bold-duotone"\n  endIcon="solar:moon-bold-duotone"\n  onChange={(e) => setChecked(e.target.checked)}\n>\n  Dark Mode Override\n</Switch>`;
      case "progress-circle":
        return `import { ProgressCircle } from "@/components/charts/atoms/ProgressCircle";\n\n<ProgressCircle\n  value={${progressVal}}\n  color="${progressColor}"\n  strokeWidth={${progressStroke}}\n  centerContent={<span className="text-xs font-semibold">${progressVal}%</span>}\n/>`;
      case "button-group":
        return `import { Button } from "@/components/charts/atoms/Button";\nimport { ButtonGroup } from "@/components/charts/atoms/ButtonGroup";\n\n<ButtonGroup size="sm">\n  <Button startIcon="solar:playback-speed-bold">Play</Button>\n  <Button startIcon="solar:pause-bold">Pause</Button>\n  <Button startIcon="solar:stop-bold">Stop</Button>\n</ButtonGroup>`;
      case "toggle-button":
        return `import { ToggleButton } from "@/components/charts/atoms/ToggleButton";\n\n<ToggleButton\n  isSelected={${toggleSelected}}\n  onChange={setToggleSelected}\n  startIcon="solar:star-bold"\n  variant="ghost"\n>\n  Favorite Chart\n</ToggleButton>`;
      case "toggle-button-group":
        return `import { ToggleButton } from "@/components/charts/atoms/ToggleButton";\nimport { ToggleButtonGroup } from "@/components/charts/atoms/ToggleButtonGroup";\n\n<ToggleButtonGroup selectionMode="multiple" value={selectedValues}>\n  <ToggleButton id="line" startIcon="solar:graph-bold">Line</ToggleButton>\n  <ToggleButton id="bar" startIcon="solar:chart-square-bold">Bar</ToggleButton>\n  <ToggleButton id="pie" startIcon="solar:pie-chart-bold">Pie</ToggleButton>\n</ToggleButtonGroup>`;
      case "badge":
        return `import { Badge } from "@/components/charts/atoms/Badge";\nimport { Avatar } from "@heroui/react";\n\n<Badge\n  content="99+"\n  color="${badgeColor}"\n  placement="${badgePlacement}"\n>\n  <Avatar src="/default-avatar.png" />\n</Badge>`;
      case "chip":
        return `import { Chip } from "@/components/charts/atoms/Chip";\n\n<Chip\n  color="${chipColor}"\n  variant="${chipVariant}"\n  startIcon="solar:hashtag-bold"\n>\n  Marketing\n</Chip>`;
      case "kbd":
        return `import { Kbd } from "@/components/charts/atoms/Kbd";\n\n<Kbd keys={["command", "shift"]}>C</Kbd>`;
      case "spinner":
        return `import { Spinner } from "@/components/charts/atoms/Spinner";\n\n<Spinner\n  color="${spinColor}"\n  size="${spinSize}"\n  label="${spinLabel}"\n/>`;
      case "skeleton":
        return `import { Skeleton } from "@/components/charts/atoms/Skeleton";\n\n<Skeleton isLoaded={${skLoaded}} animationType="${skAnimation}">\n  <div className="p-4 border rounded-xl">Loaded card elements</div>\n</Skeleton>`;
      case "slider":
        return `import { Slider } from "@/components/charts/atoms/Slider";\n\n<Slider\n  label="Volume Control"\n  color="${sldColor}"\n  value={${sldVal}}\n  showValue={${sldShowVal}}\n/>`;
      case "card":
        return `import { Card } from "@/components/charts/molecules/Card";\n\n<Card>\n  <Card.Header>\n    <Card.Title>Weekly Revenue</Card.Title>\n    <Card.Description>Summary for latest sales figures</Card.Description>\n  </Card.Header>\n  <Card.Content>\n    <p className="text-2xl font-bold">$14,240.00</p>\n  </Card.Content>\n  <Card.Footer>\n    <Button size="sm">Manage Accounts</Button>\n  </Card.Footer>\n</Card>`;
      case "surface":
        return `import { Surface } from "@/components/charts/molecules/Surface";\n\n<Surface elevation="${surfElevation}" variant="${surfVariant}" rounded="${surfRounded}" className="p-6">\n  <h6>Interactive Panel Backing</h6>\n</Surface>`;
      case "alert":
        return `import { Alert } from "@/components/charts/molecules/Alert";\n\n<Alert\n  status="${alertStatus}"\n  title="Security Alert"\n  description="Your current configurations require updates."\n/>`;
      case "accordion":
        return `import { Accordion } from "@/components/charts/molecules/Accordion";\n\n<Accordion>\n  <Accordion.Item id="1" title="Node Deployment Settings" startIcon="solar:settings-bold">\n    Manage node structures and server groups here.\n  </Accordion.Item>\n  <Accordion.Item id="2" title="Cluster Configurations" startIcon="solar:cloud-bold">\n    Configure database synchronization timelines.\n  </Accordion.Item>\n</Accordion>`;
      default:
        return "";
    }
  }, [
    activeComponent.id,
    btnLoading,
    btnDisabled,
    btnSize,
    btnVariant,
    tooltipPlacement,
    tooltipArrow,
    indicatorStatus,
    indicatorVariant,
    indicatorTrend,
    indicatorPulse,
    chkColor,
    chkChecked,
    chkDesc,
    swColor,
    swChecked,
    progressVal,
    progressColor,
    progressStroke,
    toggleSelected,
    badgeColor,
    badgePlacement,
    chipColor,
    chipVariant,
    spinColor,
    spinSize,
    spinLabel,
    skLoaded,
    skAnimation,
    sldColor,
    sldVal,
    sldShowVal,
    surfElevation,
    surfVariant,
    surfRounded,
    alertStatus,
  ]);

  return (
    <div className="flex h-screen bg-slate-100/40 dark:bg-[#151a22] text-default-900 overflow-hidden font-sans">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#1e2530] flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-650/20">
              <Icon icon="solar:widget-bold" className="text-xl" />
            </div>
            <div>
              <h5 className="font-bold text-base tracking-tight">Workshop SDK</h5>
              <p className="text-[10px] text-default-400 font-semibold tracking-wider uppercase">HeroUI v3 Design System</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800 rounded font-bold text-slate-600 dark:text-slate-350">v3.0.0</span>
        </div>

        {/* Sidebar Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative flex items-center w-full">
            <Icon icon="solar:magnifier-linear" className="absolute left-3 text-default-400 text-lg" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 text-default-400 hover:text-default-600">
                <Icon icon="solar:close-circle-linear" className="text-base" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar List Scroll Container */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Atoms Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-default-400 uppercase tracking-widest">
              <Icon icon="solar:atom-bold-duotone" className="text-sm" />
              Atoms
            </div>
            {filteredManifest
              .filter((c) => c.type === "atom")
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={[
                    "w-full flex items-center justify-between py-2 text-sm transition-all duration-150 rounded-r-lg rounded-l-none border-l-4 pr-3 pl-3.5",
                    selectedId === c.id
                      ? "border-accent bg-slate-200/60 dark:bg-slate-800 text-accent font-bold shadow-sm"
                      : "border-transparent text-default-600 hover:text-default-900 hover:bg-default-100/50 dark:hover:bg-default-800/40 font-medium",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon icon={c.icon} className={`text-lg ${selectedId === c.id ? "text-accent" : "text-default-400"}`} />
                    <span>{c.name}</span>
                  </div>
                  <Icon icon="solar:alt-arrow-right-linear" className="text-xs opacity-0 hover:opacity-100 transition-opacity" />
                </button>
              ))}
          </div>

          {/* Molecules Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-default-400 uppercase tracking-widest">
              <Icon icon="solar:hierarchy-bold-duotone" className="text-sm" />
              Molecules
            </div>
            {filteredManifest
              .filter((c) => c.type === "molecule")
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={[
                    "w-full flex items-center justify-between py-2 text-sm transition-all duration-150 rounded-r-lg rounded-l-none border-l-4 pr-3 pl-3.5",
                    selectedId === c.id
                      ? "border-accent bg-slate-200/60 dark:bg-slate-800 text-accent font-bold shadow-sm"
                      : "border-transparent text-default-600 hover:text-default-900 hover:bg-default-100/50 dark:hover:bg-default-800/40 font-medium",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon icon={c.icon} className={`text-lg ${selectedId === c.id ? "text-accent" : "text-default-400"}`} />
                    <span>{c.name}</span>
                  </div>
                  <Icon icon="solar:alt-arrow-right-linear" className="text-xs opacity-0 hover:opacity-100 transition-opacity" />
                </button>
              ))}
          </div>

          {filteredManifest.length === 0 && (
            <div className="text-center py-8 text-sm text-default-400">
              <Icon icon="solar:box-search-broken" className="text-3xl mx-auto mb-2 text-default-300" />
              No components match search criteria
            </div>
          )}
        </nav>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 overflow-y-auto flex flex-col p-8">
        {/* Workspace Title Header */}
        <div className="mb-8 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold select-none uppercase tracking-wider ${
              activeComponent.type === "atom" ? "bg-cyan-500/10 text-cyan-500" : "bg-purple-500/10 text-purple-500"
            }`}>
              {activeComponent.type}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{activeComponent.name} Component</h2>
          <p className="text-sm text-default-500 max-w-2xl">{activeComponent.description}</p>
        </div>

        {/* Workspace Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          {/* Visual Preview Side */}
          <div className="flex flex-col gap-6">
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1f2633] rounded-xl p-8 shadow-sm flex items-center justify-center min-h-[300px]">
              {/* RENDER DYNAMIC PREVIEW ACCORDING TO COMPONENT ID */}
              {activeComponent.id === "button" && (
                <Button
                  startIcon="solar:star-bold"
                  isLoading={btnLoading}
                  isDisabled={btnDisabled}
                  size={btnSize}
                  variant={btnVariant}
                >
                  Action Button
                </Button>
              )}

              {activeComponent.id === "tooltip" && (
                <Tooltip
                  content="This is a helper tooltip popup!"
                  placement={tooltipPlacement}
                  showArrow={tooltipArrow}
                >
                  <Button variant="outline" startIcon="solar:question-square-bold">
                    Hover Over Me
                  </Button>
                </Tooltip>
              )}

              {activeComponent.id === "indicator" && (
                <div className="flex flex-col gap-4">
                  {indicatorVariant === "dot" ? (
                    <Indicator
                      status={indicatorStatus}
                      pulse={indicatorPulse}
                      label="Real-time Server State"
                    />
                  ) : (
                    <Indicator
                      variant="trend"
                      trend={indicatorTrend}
                      label={indicatorTrend === "up" ? "+14.2%" : indicatorTrend === "down" ? "-8.4%" : "Flatline"}
                    />
                  )}
                </div>
              )}

              {activeComponent.id === "checkbox" && (
                <Checkbox
                  color={chkColor}
                  isSelected={chkChecked}
                  onChange={setChkChecked}
                  description={chkDesc}
                >
                  Metric Logging System
                </Checkbox>
              )}

              {activeComponent.id === "switch" && (
                <Switch
                  color={swColor}
                  isSelected={swChecked}
                  startIcon="solar:sun-bold-duotone"
                  endIcon="solar:moon-bold-duotone"
                  onChange={setSwChecked}
                >
                  Data Refresh Rate Override
                </Switch>
              )}

              {activeComponent.id === "progress-circle" && (
                <ProgressCircle
                  value={progressVal}
                  color={progressColor}
                  strokeWidth={progressStroke}
                  centerContent={
                    <span className="text-xs font-bold text-default-800 dark:text-default-200">
                      {progressVal}%
                    </span>
                  }
                />
              )}

              {activeComponent.id === "button-group" && (
                <ButtonGroup size="sm">
                  <Button startIcon="solar:playback-speed-bold" variant="primary">Play</Button>
                  <Button startIcon="solar:pause-bold" variant="primary">Pause</Button>
                  <Button startIcon="solar:stop-bold" variant="primary">Stop</Button>
                </ButtonGroup>
              )}

              {activeComponent.id === "toggle-button" && (
                <ToggleButton
                  isSelected={toggleSelected}
                  onChange={setToggleSelected}
                  startIcon="solar:heart-bold"
                  variant="ghost"
                >
                  Bookmark Component
                </ToggleButton>
              )}

              {activeComponent.id === "toggle-button-group" && (
                <ToggleButtonGroup
                  selectionMode="multiple"
                  selectedKeys={toggleGroupSel}
                  onSelectionChange={setToggleGroupSel}
                >
                  <ToggleButton id="line" startIcon="solar:graph-bold">Line</ToggleButton>
                  <ToggleButton id="bar" startIcon="solar:chart-square-bold">Bar</ToggleButton>
                  <ToggleButton id="pie" startIcon="solar:pie-chart-bold">Pie</ToggleButton>
                </ToggleButtonGroup>
              )}

              {activeComponent.id === "badge" && (
                <Badge content="8" color={badgeColor} placement={badgePlacement}>
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                    <Icon icon="solar:bell-bold-duotone" className="text-2xl" />
                  </div>
                </Badge>
              )}

              {activeComponent.id === "chip" && (
                <div className="flex gap-2">
                  <Chip color={chipColor} variant={chipVariant} startIcon="solar:tag-bold">
                    Primary Data Segment
                  </Chip>
                </div>
              )}

              {activeComponent.id === "kbd" && (
                <div className="flex flex-col gap-2 items-center">
                  <Kbd keys={["command", "shift"]}>C</Kbd>
                  <span className="text-xs text-default-400 font-medium">Reset Data Cache Layout</span>
                </div>
              )}

              {activeComponent.id === "spinner" && (
                <Spinner color={spinColor} size={spinSize} label={spinLabel} />
              )}

              {activeComponent.id === "skeleton" && (
                <div className="w-full max-w-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton isLoaded={skLoaded} className="w-12 h-12 rounded-full" animationType={skAnimation}>
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                        <Icon icon="solar:user-bold" className="text-xl" />
                      </div>
                    </Skeleton>
                    <div className="space-y-1 flex-1">
                      <Skeleton isLoaded={skLoaded} className="h-4 w-3/4 rounded" animationType={skAnimation}>
                        <span className="text-sm font-semibold">Loaded User Profile</span>
                      </Skeleton>
                      <Skeleton isLoaded={skLoaded} className="h-3 w-1/2 rounded" animationType={skAnimation}>
                        <span className="text-xs text-default-500">Database node owner</span>
                      </Skeleton>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setSkLoaded(!skLoaded)}
                      className="text-xs px-2.5 py-1 bg-default-100 hover:bg-default-200 rounded font-semibold select-none transition-colors"
                    >
                      Toggle Skeleton Loader state
                    </button>
                  </div>
                </div>
              )}

              {activeComponent.id === "slider" && (
                <Slider
                  label="Refresh Frequency (seconds)"
                  color={sldColor}
                  value={sldVal}
                  onChange={(val) => setSldVal(val as number)}
                  showValue={sldShowVal}
                />
              )}

              {activeComponent.id === "card" && (
                <Card className="w-full max-w-sm">
                  <Card.Header>
                    <div>
                      <Card.Title>Weekly Revenue</Card.Title>
                      <Card.Description>Sales report summary</Card.Description>
                    </div>
                    <Icon icon="solar:dollar-minimalistic-bold-duotone" className="text-xl text-success" />
                  </Card.Header>
                  <Card.Content>
                    <h2 className="text-3xl font-bold tracking-tight text-default-900 dark:text-default-50">$18,450.00</h2>
                    <p className="text-xs text-success font-medium flex items-center gap-1 mt-1">
                      <Icon icon="solar:arrow-right-up-bold-duotone" />
                      +14.2% from last week
                    </p>
                  </Card.Content>
                  <Card.Footer>
                    <Button size="sm" variant="ghost">Detailed Report</Button>
                    <Button size="sm" variant="primary">Analyze Accounts</Button>
                  </Card.Footer>
                </Card>
              )}

              {activeComponent.id === "surface" && (
                <Surface
                  elevation={surfElevation}
                  variant={surfVariant}
                  rounded={surfRounded}
                  className="w-full max-w-sm p-6"
                >
                  <h6 className="font-semibold text-sm mb-2 text-default-800 dark:text-default-250">Surface Panel Backing</h6>
                  <p className="text-xs text-default-500 leading-relaxed">
                    Designed to frame dashboard blocks. Elevation sets borders and shadow depths, while rounding handles border radius styling.
                  </p>
                </Surface>
              )}

              {activeComponent.id === "alert" && (
                <Alert status={alertStatus} title="System Warning Alert" description="Server loads currently exceed target node limits. Sync operations are delayed." />
              )}

              {activeComponent.id === "accordion" && (
                <Accordion className="w-full max-w-sm">
                  <Accordion.Item id="node-settings" title="Node Deployment Configuration" startIcon="solar:settings-bold">
                    Manage active database synchronization pipelines, background schedules, and node credentials directly from this panel interface.
                  </Accordion.Item>
                  <Accordion.Item id="cluster-config" title="Cluster Synchronization" startIcon="solar:cloud-bold">
                    Synchronization thresholds are configured automatically depending on network latencies.
                  </Accordion.Item>
                </Accordion>
              )}
            </div>

            {/* Code / Implementation Block */}
            <div className="border border-slate-200 dark:border-slate-800 bg-[#1a1f29] rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 bg-[#151820] border-b border-slate-800 flex items-center justify-between text-xs text-zinc-400 font-mono select-none">
                <span>Code Example Implementation</span>
                <div className="flex items-center gap-1.5">
                  <Icon icon="solar:copy-linear" className="text-sm cursor-pointer hover:text-white transition-colors" />
                </div>
              </div>
              <div className="p-5 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed select-text">
                {codeSnippet}
              </div>
            </div>
          </div>

          {/* Playground Controls Side */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1f2633] rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h5 className="font-bold text-sm border-b border-default-100 dark:border-default-50/10 pb-3 flex items-center gap-2 select-none">
              <Icon icon="solar:tuning-bold-duotone" className="text-lg text-accent" />
              Playground Parameters
            </h5>

            {/* Render component-specific control options */}
            {activeComponent.id === "button" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-default-600 select-none">isLoading state</span>
                  <input type="checkbox" checked={btnLoading} onChange={(e) => setBtnLoading(e.target.checked)} className="cursor-pointer" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-default-600 select-none">isDisabled state</span>
                  <input type="checkbox" checked={btnDisabled} onChange={(e) => setBtnDisabled(e.target.checked)} className="cursor-pointer" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Button Size</span>
                  <select value={btnSize} onChange={(e: any) => setBtnSize(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="sm">Small (sm)</option>
                    <option value="md">Medium (md)</option>
                    <option value="lg">Large (lg)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Button Variant</span>
                  <select value={btnVariant} onChange={(e: any) => setBtnVariant(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="tertiary">Tertiary</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost</option>
                  </select>
                </div>
              </div>
            )}

            {activeComponent.id === "tooltip" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Placement Direction</span>
                  <select value={tooltipPlacement} onChange={(e: any) => setTooltipPlacement(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="top start">Top Start</option>
                    <option value="bottom end">Bottom End</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-default-600 select-none">Show Indicator Arrow</span>
                  <input type="checkbox" checked={tooltipArrow} onChange={(e) => setTooltipArrow(e.target.checked)} className="cursor-pointer" />
                </div>
              </div>
            )}

            {activeComponent.id === "indicator" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Indicator variant</span>
                  <select value={indicatorVariant} onChange={(e: any) => setIndicatorVariant(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="dot">Dot</option>
                    <option value="trend">Trend</option>
                  </select>
                </div>
                {indicatorVariant === "dot" ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-default-600 select-none">Dot Color Status</span>
                      <select value={indicatorStatus} onChange={(e: any) => setIndicatorStatus(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                        <option value="success">Success (green)</option>
                        <option value="warning">Warning (yellow)</option>
                        <option value="danger">Danger (red)</option>
                        <option value="primary">Primary (blue)</option>
                        <option value="default">Default (gray)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-default-600 select-none">Pulse animation ring</span>
                      <input type="checkbox" checked={indicatorPulse} onChange={(e) => setIndicatorPulse(e.target.checked)} className="cursor-pointer" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-default-600 select-none">Trend Direction</span>
                    <select value={indicatorTrend} onChange={(e: any) => setIndicatorTrend(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                      <option value="up">Growth Upward</option>
                      <option value="down">Decline Downward</option>
                      <option value="neutral">Neutral Flat</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {activeComponent.id === "checkbox" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Color accent theme</span>
                  <select value={chkColor} onChange={(e: any) => setChkColor(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="accent">Accent</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Helper description text</span>
                  <input type="text" value={chkDesc} onChange={(e) => setChkDesc(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-default-600 select-none">Checked state</span>
                  <input type="checkbox" checked={chkChecked} onChange={(e) => setChkChecked(e.target.checked)} className="cursor-pointer" />
                </div>
              </div>
            )}

            {activeComponent.id === "switch" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Color variant</span>
                  <select value={swColor} onChange={(e: any) => setSwColor(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="accent">Accent</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-default-600 select-none">Toggle Switch state</span>
                  <input type="checkbox" checked={swChecked} onChange={(e) => setSwChecked(e.target.checked)} className="cursor-pointer" />
                </div>
              </div>
            )}

            {activeComponent.id === "progress-circle" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between select-none">
                    <span className="text-xs font-semibold text-default-600">Progress value</span>
                    <span className="text-xs text-default-500 font-bold">{progressVal}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={progressVal} onChange={(e) => setProgressVal(Number(e.target.value))} className="w-full cursor-pointer accent-accent" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Progress stroke color</span>
                  <select value={progressColor} onChange={(e: any) => setProgressColor(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="accent">Accent</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Stroke Thickness ({progressStroke}px)</span>
                  <input type="range" min="1" max="10" value={progressStroke} onChange={(e) => setProgressStroke(Number(e.target.value))} className="w-full cursor-pointer accent-accent" />
                </div>
              </div>
            )}

            {activeComponent.id === "badge" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Badge Color Status</span>
                  <select value={badgeColor} onChange={(e: any) => setBadgeColor(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="accent">Accent</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Anchor Placement</span>
                  <select value={badgePlacement} onChange={(e: any) => setBadgePlacement(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>
              </div>
            )}

            {activeComponent.id === "chip" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Chip Color Status</span>
                  <select value={chipColor} onChange={(e: any) => setChipColor(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="default">Default (gray)</option>
                    <option value="accent">Accent (purple)</option>
                    <option value="success">Success (green)</option>
                    <option value="warning">Warning (yellow)</option>
                    <option value="danger">Danger (red)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Visual Variant</span>
                  <select value={chipVariant} onChange={(e: any) => setChipVariant(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="soft">Soft (Translucent)</option>
                    <option value="primary">Primary (Solid)</option>
                    <option value="secondary">Secondary (Bordered)</option>
                    <option value="tertiary">Tertiary (Subtle)</option>
                  </select>
                </div>
              </div>
            )}

            {activeComponent.id === "spinner" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Spinner Color Status</span>
                  <select value={spinColor} onChange={(e: any) => setSpinColor(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="accent">Accent</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Spinner Size</span>
                  <select value={spinSize} onChange={(e: any) => setSpinSize(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="sm">Small (sm)</option>
                    <option value="md">Medium (md)</option>
                    <option value="lg">Large (lg)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Spinner text label</span>
                  <input type="text" value={spinLabel} onChange={(e) => setSpinLabel(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded" />
                </div>
              </div>
            )}

            {activeComponent.id === "skeleton" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-default-600 select-none">Toggle skeleton state</span>
                  <input type="checkbox" checked={skLoaded} onChange={(e) => setSkLoaded(e.target.checked)} className="cursor-pointer" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Skeleton Animation</span>
                  <select value={skAnimation} onChange={(e: any) => setSkAnimation(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="shimmer">Shimmer</option>
                    <option value="pulse">Pulse</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            )}

            {activeComponent.id === "slider" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between select-none">
                    <span className="text-xs font-semibold text-default-600">Slider value threshold</span>
                    <span className="text-xs text-default-500 font-bold">{sldVal}s</span>
                  </div>
                  <input type="range" min="1" max="120" value={sldVal} onChange={(e) => setSldVal(Number(e.target.value))} className="w-full cursor-pointer accent-accent" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Fill Color Status</span>
                  <select value={sldColor} onChange={(e: any) => setSldColor(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="accent">Accent</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-default-600 select-none">Show output numerical label</span>
                  <input type="checkbox" checked={sldShowVal} onChange={(e) => setSldShowVal(e.target.checked)} className="cursor-pointer" />
                </div>
              </div>
            )}

            {activeComponent.id === "surface" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Elevation border depth</span>
                  <select value={surfElevation} onChange={(e: any) => setSurfElevation(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="none">None</option>
                    <option value="flat">Flat border</option>
                    <option value="raised">Raised (border + shadow)</option>
                    <option value="floating">Floating (border + deep shadow)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Backdrop background style</span>
                  <select value={surfVariant} onChange={(e: any) => setSurfVariant(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="solid">Solid Card backdrop</option>
                    <option value="translucent">Translucent glassmorphism</option>
                    <option value="muted">Muted dark backing</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Corner Rounding</span>
                  <select value={surfRounded} onChange={(e: any) => setSurfRounded(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="none">Square (none)</option>
                    <option value="sm">Small (sm)</option>
                    <option value="md">Medium (md)</option>
                    <option value="lg">Large (lg)</option>
                    <option value="xl">Extra Large (xl)</option>
                    <option value="2xl">Double Extra (2xl)</option>
                    <option value="full">Circle (full)</option>
                  </select>
                </div>
              </div>
            )}

            {activeComponent.id === "alert" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-default-600 select-none">Alert status theme</span>
                  <select value={alertStatus} onChange={(e: any) => setAlertStatus(e.target.value)} className="w-full text-xs p-2 bg-default-50 dark:bg-default-900 border border-default-250 dark:border-default-800 rounded">
                    <option value="default">Default</option>
                    <option value="accent">Accent</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                  </select>
                </div>
              </div>
            )}

            {/* Fallback parameters message */}
            {!["button", "tooltip", "indicator", "checkbox", "switch", "progress-circle", "badge", "chip", "spinner", "skeleton", "slider", "surface", "alert"].includes(activeComponent.id) && (
              <p className="text-xs text-default-400 text-center select-none py-8">
                No interactive parameters mapped for this composite molecule. Review code example.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
