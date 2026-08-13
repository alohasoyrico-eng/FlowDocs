import { artifactDocumentationSection, html } from "./detail-tabs-core.js?v=10";

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function patternReactDemo(pattern, props, state = "default", variant = "standard", fullWidth = true) {
  return `<div class="docs-react-island docs-pattern-demo" data-react-component="${pattern}" data-component-source="react-pattern" data-doc-pattern="${pattern}" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}

function journeyReactDemoSection(title, body) {
  return artifactDocumentationSection({
    title,
    body,
    className: "wide pattern-journey-panel",
    source: "pattern-journey-react-demos",
  });
}

const setupSteps = [
  { label: "Identity", description: "Profile" },
  { label: "Verify", description: "Trust" },
  { label: "Ready", description: "Start" },
];

const fleetSteps = [
  { label: "Workspace", description: "Profile" },
  { label: "Fleet", description: "Import" },
  { label: "Access", description: "Roles" },
];

const reviewRows = [
  { id: "jmx-214-b", plate: "JMX-214-B", driver: "Ana Sosa", status: { label: "Ready", tone: "success" }, spend: "$842" },
  { id: "kld-901-c", plate: "KLD-901-C", driver: "Luis Vera", status: { label: "Needs role", tone: "warning" }, spend: "$631" },
];

export function journeyReactPatternOverviewDemo(patternId) {
  if (patternId === "driver-onboarding-mobile") return driverOnboardingReactPanel();
  if (patternId === "fleet-manager-onboarding-desktop") return fleetManagerOnboardingReactPanel();
  if (patternId === "multi-step-form") return multiStepFormReactPanel();
  if (patternId === "help-center") return helpCenterReactPanel();
  return "";
}

function driverOnboardingReactPanel() {
  return journeyReactDemoSection("Driver mobile setup", patternReactDemo("driver-onboarding-mobile", {
    label: "Driver mobile setup",
    description: "Phone, verification, biometric prompt, validation, and recovery stay owned by Flow.",
    density: "md",
    state: "in-progress",
    inProgress: true,
    currentStep: 1,
    steps: setupSteps,
    summary: { label: "Driver readiness", meta: "Phone verified, device trust pending", number: "2/3", status: "In progress", fullWidth: true },
    identity: { label: "Driver name", value: "Ana Sosa" },
    phone: { label: "Driver phone", value: "55 1030 4481", helper: "Used for dispatch and verification." },
    code: { label: "Verification code", value: "184290", helper: "Enter the SMS code before enabling biometrics." },
    validation: { label: "Driver setup", message: "Verify device trust before completing setup.", state: "info" },
    biometricPrompt: { label: "Enable quick access", description: "Let the driver unlock trip tools faster on this device.", actionLabel: "Enable", fallback: "Skip for now" },
    primaryAction: { key: "continue", label: "Continue", icon: "arrow_forward" },
    secondaryAction: { key: "back", label: "Back", variant: "secondary", icon: "arrow_back" },
    feedback: { label: "Setup draft saved", description: "The driver can continue on this device.", tone: "info" },
    "data-pattern-demo": "driver-onboarding-mobile",
  }, "in-progress"));
}

function fleetManagerOnboardingReactPanel() {
  return journeyReactDemoSection("Fleet manager workspace setup", patternReactDemo("fleet-manager-onboarding-desktop", {
    label: "Fleet manager setup",
    description: "Workspace profile, fleet import, access tasks, settings, and validation in one React pattern.",
    density: "md",
    state: "in-progress",
    inProgress: true,
    currentStep: 1,
    steps: fleetSteps,
    metrics: [{ key: "vehicles", label: "Vehicles", value: "42", tone: "info", icon: "directions_car" }, { key: "policies", label: "Policies", value: "8", tone: "warning", icon: "rule" }],
    tasks: [{ key: "ops-owner", label: "Invite operations owner", checked: true, description: "Can approve limits and review exceptions." }, { key: "finance", label: "Invite finance reviewer", checked: false, description: "Can review spend and export reports." }],
    fields: [{ key: "workspace", label: "Workspace name", value: "North fleet operations" }],
    selects: [{ key: "region", label: "Operating region", value: "mx", options: [{ label: "Mexico", value: "mx" }, { label: "Colombia", value: "co" }] }],
    reviewColumns: [
      { key: "plate", label: "Plate", priority: "primary" },
      { key: "driver", label: "Driver", priority: "secondary" },
      { key: "status", label: "Status", priority: "secondary" },
      { key: "spend", label: "Spend", align: "right", priority: "tertiary" },
    ],
    reviewRows,
    validation: { label: "Workspace setup", message: "Review fleet import and pending roles before finishing.", state: "warning" },
    primaryAction: { key: "continue", label: "Continue setup", icon: "arrow_forward" },
    secondaryAction: { key: "back", label: "Back", variant: "secondary", icon: "arrow_back" },
    feedback: { label: "Workspace setup saved", description: "Fleet manager can continue into templates.", tone: "success" },
    "data-pattern-demo": "fleet-manager-onboarding-desktop",
  }, "in-progress"));
}

function multiStepFormReactPanel() {
  return journeyReactDemoSection("Governed multi-step form", patternReactDemo("multi-step-form", {
    label: "Policy request",
    description: "Step navigation, field state, validation, save, and summary are owned by the React pattern.",
    density: "md",
    state: "dirty",
    started: true,
    dirty: true,
    currentStep: 1,
    steps: [{ label: "Context", description: "Route" }, { label: "Policy", description: "Limit" }, { label: "Review", description: "Submit" }],
    summary: { title: "Station exception", description: "Temporary fuel limit for North route.", status: "Draft" },
    fields: [
      { key: "station", kind: "input", label: "Station", value: "Station 24" },
      { key: "limit", kind: "input", label: "Daily fuel limit", value: "1200" },
      { key: "reason", kind: "select", label: "Reason", value: "route", options: [{ label: "Route exception", value: "route" }, { label: "Weather", value: "weather" }] },
    ],
    validation: { label: "Policy request", message: "Review policy reason before submitting.", state: "warning" },
    primaryAction: { key: "continue", label: "Continue", icon: "arrow_forward" },
    secondaryAction: { key: "cancel", label: "Cancel", variant: "secondary" },
    backAction: { key: "back", label: "Back", variant: "secondary", icon: "arrow_back" },
    saveAction: { key: "save", label: "Save draft", icon: "save" },
    feedback: { label: "Draft saved", description: "The request can be completed later.", tone: "info" },
    "data-pattern-demo": "multi-step-form",
  }, "dirty"));
}

function helpCenterReactPanel() {
  return journeyReactDemoSection("Contextual help center", patternReactDemo("help-center", {
    label: "Operations help",
    description: "Search, topics, articles, drawer, empty/recovery state, and sidebar routing use Flow contracts.",
    density: "md",
    state: "results",
    open: true,
    query: "fuel limit",
    selectedTopicKey: "policy",
    search: { label: "Search help articles", query: "fuel limit", input: { label: "Search help", placeholder: "Search by task or issue" } },
    topics: [{ key: "policy", label: "Policy", count: 8, tone: "info" }, { key: "cards", label: "Cards", count: 4 }, { key: "routes", label: "Routes", count: 6 }],
    articles: [
      { id: "fuel-limit", key: "fuel-limit", title: "Adjust a temporary fuel limit", label: "Adjust a temporary fuel limit", summary: "Use a governed approval request.", content: "Create a policy request and assign a finance reviewer.", open: true },
      { id: "decline", key: "decline", title: "Resolve a station decline", label: "Resolve a station decline", summary: "Check policy, station and driver status.", content: "Inspect card status before disputing a transaction." },
    ],
    drawer: { label: "Operations help", triggerLabel: "Open help", closeLabel: "Close help", side: "right" },
    recovery: { title: "No help articles found", description: "Try a broader task or contact support.", action: { key: "support", label: "Contact support" } },
    "data-pattern-demo": "help-center",
  }, "results"));
}
