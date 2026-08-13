import { artifactDocumentationSection, html } from "./detail-tabs-core.js?v=10";

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function patternReactDemo(pattern, props, state = "default", variant = "standard", fullWidth = true) {
  return `<div class="docs-react-island docs-pattern-demo" data-react-component="${pattern}" data-component-source="react-pattern" data-doc-pattern="${pattern}" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}

function mobileReactDemoSection(title, body) {
  return artifactDocumentationSection({
    title,
    body,
    className: "wide pattern-mobile-panel",
    source: "pattern-mobile-react-demos",
  });
}

const sheetItems = [
  { key: "receipt", label: "Open receipt", description: "Review station receipt before dispute." },
  { key: "limit", label: "Adjust temporary limit", description: "Apply a one-trip fuel exception." },
  { key: "support", label: "Contact support", description: "Escalate with route context." },
];

const quickActions = [
  { key: "freeze", label: "Freeze", icon: "block", status: { label: "Risk", tone: "warning" }, intent: "danger" },
  { key: "limits", label: "Limits", icon: "tune" },
  { key: "pin", label: "PIN", icon: "pin" },
  { key: "travel", label: "Travel", icon: "flight", permissionBlocked: true, status: { label: "Locked", tone: "neutral" }, tooltip: { content: "Travel requires finance approval." } },
];

export function mobileReactPatternOverviewDemo(patternId) {
  if (patternId === "bottom-sheet") return bottomSheetReactPanel();
  if (patternId === "fullscreen-sheet") return fullscreenSheetReactPanel();
  if (patternId === "swipe-actions") return swipeActionsReactPanel();
  if (patternId === "quick-actions-grid") return quickActionsGridReactPanel();
  if (patternId === "drawer-adapter") return drawerAdapterReactPanel();
  return "";
}

function bottomSheetReactPanel() {
  return mobileReactDemoSection("Contextual bottom sheet", patternReactDemo("bottom-sheet", {
    label: "Fuel purchase actions",
    description: "Mobile contextual actions stay delegated to Drawer/List/Button contracts.",
    density: "md",
    state: "open",
    open: true,
    triggerLabel: "Open purchase actions",
    closeLabel: "Close actions",
    items: sheetItems,
    actions: [{ key: "dispute", label: "Dispute charge", icon: "report", intent: "danger" }, { key: "close", label: "Close", variant: "secondary" }],
    validation: { label: "Context", message: "3 actions available for this purchase.", state: "info", live: true },
    drawer: { side: "bottom", label: "Fuel purchase actions" },
    "data-pattern-demo": "bottom-sheet",
  }, "open"));
}

function fullscreenSheetReactPanel() {
  return mobileReactDemoSection("Mobile station edit", patternReactDemo("fullscreen-sheet", {
    label: "Station policy",
    description: "A full-screen task flow using Stepper, fields, validation, actions, and feedback.",
    density: "md",
    state: "dirty",
    open: true,
    dirty: true,
    summary: { label: "Station 24", meta: "North ops", number: "Daily fuel limit", available: "$1,200", limit: "$1,200", status: "Ready" },
    steps: [{ label: "Station", description: "Context" }, { label: "Limit", description: "Policy" }, { label: "Review", description: "Confirm" }],
    currentStep: 1,
    fields: [
      { key: "station", kind: "input", label: "Station name", value: "Station 24" },
      { key: "owner", kind: "input", label: "Route owner", value: "North ops" },
      { key: "region", kind: "select", label: "Region", value: "north", options: [{ label: "North", value: "north" }, { label: "Central", value: "central" }] },
    ],
    validation: { label: "Policy status", message: "Review the route owner before saving.", state: "warning" },
    primaryAction: { key: "continue", label: "Continue", icon: "arrow_forward" },
    secondaryAction: { key: "back", label: "Back", variant: "secondary", icon: "arrow_back" },
    closeAction: { key: "close", label: "Close", variant: "ghost", icon: "close" },
    feedback: { label: "Draft saved locally", description: "Changes are ready to review.", tone: "info" },
    "data-pattern-demo": "fullscreen-sheet",
  }, "dirty"));
}

function swipeActionsReactPanel() {
  return mobileReactDemoSection("Row swipe actions", patternReactDemo("swipe-actions", {
    label: "Fuel purchase actions",
    density: "md",
    state: "revealed",
    revealed: true,
    row: { label: "Fuel purchase", meta: "Today - Station 24 - JMX-214-B", amount: "-$842", status: "Approved" },
    actions: [
      { key: "receipt", label: "Receipt", icon: "receipt_long", fallbackLabel: "Open receipt" },
      { key: "dispute", label: "Dispute", icon: "report", fallbackLabel: "Dispute", intent: "danger" },
    ],
    feedback: { label: "Actions revealed", description: "Keyboard fallbacks remain available.", tone: "info" },
    "data-pattern-demo": "swipe-actions",
  }, "revealed"));
}

function quickActionsGridReactPanel() {
  return mobileReactDemoSection("Card shortcut grid", patternReactDemo("quick-actions-grid", {
    label: "Card shortcuts",
    density: "md",
    state: "default",
    actions: quickActions,
    search: { label: "Search shortcuts", query: "", input: { label: "Search shortcuts", placeholder: "Freeze, limits, PIN..." } },
    confirmation: { label: "Freeze card?", description: "The driver cannot use this card until it is reactivated.", tone: "danger", actions: [{ key: "confirm", label: "Freeze card", intent: "danger" }, { key: "cancel", label: "Cancel", variant: "secondary" }] },
    feedback: { label: "4 shortcuts available", description: "Permission-blocked actions stay visible with explanation.", tone: "info" },
    "data-pattern-demo": "quick-actions-grid",
  }));
}

function drawerAdapterReactPanel() {
  return mobileReactDemoSection("Responsive drawer adapter", patternReactDemo("drawer-adapter", {
    label: "Vehicle inspector",
    description: "Drawer adapts shell, list, menu, and task content without a parallel overlay implementation.",
    density: "md",
    state: "responsive",
    open: true,
    responsive: true,
    modal: true,
    drawer: { label: "Vehicle inspector", description: "Adapted side panel content for mobile.", side: "right", triggerLabel: "Open inspector", closeLabel: "Close inspector" },
    list: { label: "Inspector sections", items: [{ key: "overview", label: "Overview" }, { key: "documents", label: "Documents" }, { key: "risk", label: "Risk review" }] },
    cards: [{ title: "JMX-214-B", description: "Ana Sosa - active route", tone: "info" }],
    menu: { triggerLabel: "Inspector menu", label: "Inspector sections", items: [{ key: "overview", label: "Overview" }, { key: "documents", label: "Documents" }, { key: "risk", label: "Risk review" }] },
    actions: [{ key: "risk", label: "Open risk review", variant: "secondary", icon: "report" }, { key: "close", label: "Close drawer", variant: "secondary" }],
    feedback: { label: "Drawer adapted", description: "Responsive mode keeps one Drawer contract.", tone: "success" },
    "data-pattern-demo": "drawer-adapter",
  }, "responsive"));
}
