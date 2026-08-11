import { html } from "./detail-tabs-core.js?v=3";

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function patternReactDemo(pattern, props, state = "default", variant = "standard", fullWidth = true) {
  return `<div class="docs-react-island docs-pattern-demo" data-react-component="${pattern}" data-component-source="react-pattern" data-doc-pattern="${pattern}" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}

const vehicleRows = [
  { id: "jmx-214-b", plate: "JMX-214-B", driver: "Ana Sosa", status: { label: "Active", tone: "success" }, region: "North", spend: "$842" },
  { id: "kld-901-c", plate: "KLD-901-C", driver: "Luis Vera", status: { label: "Review", tone: "warning" }, region: "North", spend: "$631" },
  { id: "mtr-330-a", plate: "MTR-330-A", driver: "Iris Mora", status: { label: "Frozen", tone: "danger" }, region: "Central", spend: "$120" },
];

const vehicleColumns = [
  { key: "plate", label: "Plate", priority: "primary", mono: true },
  { key: "driver", label: "Driver", priority: "secondary" },
  { key: "status", label: "Status", priority: "secondary" },
  { key: "spend", label: "Spend", align: "right", priority: "tertiary" },
];

export function operationalReactPatternOverviewDemo(patternId) {
  if (patternId === "driver-and-vehicle-administration") return driverVehicleAdminPanel();
  if (patternId === "station-discovery") return stationDiscoveryPanel();
  if (patternId === "kanban-board") return kanbanBoardPanel();
  if (patternId === "status-feedback-view") return statusFeedbackViewPanel();
  if (patternId === "payment-form") return paymentFormPanel();
  if (patternId === "dense-operational-list") return denseOperationalListPanel();
  return "";
}

function driverVehicleAdminPanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Driver and vehicle administration</h2>${patternReactDemo("driver-and-vehicle-administration", {
    label: "Driver and vehicle administration",
    description: "Toolbar, table, quick actions, audit evidence, pagination, and dialog stay in one Flow pattern.",
    density: "sm",
    state: "selected",
    selectedKey: "kld-901-c",
    toolbar: { label: "Administration tools", search: { label: "Search records", query: "KLD" }, actions: [{ key: "add", label: "Add record", icon: "add" }] },
    summary: { label: "Fleet records", meta: "North operations", number: "128", status: "3 need review", fullWidth: true },
    records: vehicleRows,
    columns: vehicleColumns,
    actions: [{ key: "documents", label: "Documents", icon: "description" }, { key: "freeze", label: "Freeze", icon: "block", intent: "danger" }],
    primaryAction: { key: "add", label: "Add driver", icon: "person_add" },
    secondaryAction: { key: "export", label: "Export", variant: "secondary", icon: "download" },
    audit: { label: "Record updated", description: "Vehicle owner changed.", meta: "Today 09:42 - Admin", status: "Logged", icon: "manage_history" },
    feedback: { label: "KLD-901-C selected", description: "Quick actions reflect permissions.", tone: "info" },
    "data-pattern-demo": "driver-and-vehicle-administration",
  }, "selected")}</section>`;
}

function stationDiscoveryPanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Station discovery</h2>${patternReactDemo("station-discovery", {
    label: "Station discovery",
    description: "Search, station pins, route summary, fallback, and runtime state are Flow-owned.",
    density: "md",
    state: "selected",
    permission: "granted",
    query: "Station 24",
    stations: [
      { key: "station-24", label: "Station 24", value: "$24.10", distance: "2.1 km", meta: "North route", status: "Open", selected: true, variant: "fuel", state: "selected" },
      { key: "station-18", label: "Station 18", value: "$24.80", distance: "4.8 km", meta: "Policy exception", status: "Review", variant: "fuel" },
    ],
    selectedStationKey: "station-24",
    route: { label: "Route to Station 24", eta: "12 min", distance: "2.1 km", metrics: [{ label: "ETA", value: "12 min" }, { label: "Savings", value: "$0.70/L" }], actions: [{ key: "navigate", label: "Navigate", icon: "near_me" }] },
    search: { label: "Search stations", query: "Station 24", results: [{ key: "station-24", label: "Station 24", meta: "2.1 km - Open" }] },
    fallbackList: { reason: "Map provider unavailable", action: "Use list", items: [{ key: "station-24", label: "Station 24", meta: "2.1 km", value: "$24.10", icon: "local_gas_station" }] },
    "data-pattern-demo": "station-discovery",
  }, "selected")}</section>`;
}

function kanbanBoardPanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Operational Kanban</h2>${patternReactDemo("kanban-board", {
    label: "Approval workflow",
    description: "Columns, move controls, card status, limits, empty state, and save feedback are one React pattern.",
    density: "sm",
    state: "idle",
    sortable: true,
    selectedKey: "price-exception",
    selectedColumnKey: "review",
    columns: [
      { key: "new", label: "New", status: { label: "1", tone: "neutral" }, items: [{ key: "fuel-receipt", label: "Fuel receipt", description: "Receipt upload missing.", meta: "Support", icon: "receipt_long" }] },
      { key: "review", label: "Review", tone: "warning", status: { label: "2", tone: "warning" }, items: [{ key: "price-exception", label: "Price exception", description: "Station price exceeds policy.", meta: "Pricing ops", icon: "rule", status: { label: "Selected", tone: "info" } }] },
      { key: "done", label: "Done", tone: "success", items: [{ key: "permission", label: "Permission update", description: "Owner approved.", meta: "Security", icon: "check_circle" }] },
    ],
    actions: [{ key: "save", label: "Save order", icon: "save" }, { key: "add", label: "Add card", variant: "secondary", icon: "add" }],
    "data-pattern-demo": "kanban-board",
  })}</section>`;
}

function statusFeedbackViewPanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Status feedback routing</h2>${patternReactDemo("status-feedback-view", {
    kind: "notifications",
    label: "Operations feedback",
    title: "Sync delayed",
    description: "Retry without losing current context.",
    density: "md",
    state: "warning",
    tone: "warning",
    open: true,
    live: true,
    notifications: [{ key: "sync", label: "Sync delayed", description: "Retry queued for vehicle operations.", unread: true }, { key: "policy", label: "Policy request saved", description: "Ready for finance review." }],
    messages: [{ key: "retry", label: "Retry queued", description: "The user can keep working.", tone: "success" }],
    action: { key: "retry", label: "Retry", variant: "secondary" },
    "data-pattern-demo": "status-feedback-view",
  }, "warning")}</section>`;
}

function paymentFormPanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Payment credential flow</h2>${patternReactDemo("payment-form", {
    label: "Add payment card",
    description: "Card number, expiry, CVC, amount, validation, submit and feedback are composed by Flow.",
    density: "md",
    state: "review",
    cardNumber: { label: "Card number", value: "4111111111111111" },
    expiry: { label: "Expiry", value: "12/28" },
    securityCode: { label: "Security code", value: "123" },
    amount: { label: "Initial limit", value: "1200", currency: "MXN" },
    validation: { label: "Payment status", message: "Review card details before saving.", state: "warning" },
    feedback: { kind: "inline", label: "Card ready for review", message: "Credential is not stored until submit.", state: "info" },
    submitAction: { key: "submit", label: "Save card", icon: "credit_card" },
    secondaryAction: { key: "cancel", label: "Cancel", variant: "secondary" },
    "data-pattern-demo": "payment-form",
  }, "review")}</section>`;
}

function denseOperationalListPanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Dense operational list</h2>${patternReactDemo("dense-operational-list", {
    label: "Operations queue",
    description: "Search, filters, toolbar, virtual table, bulk actions, and feedback stay delegated.",
    density: "sm",
    state: "selected",
    resultCount: 3,
    selectedKeys: ["kld-901-c"],
    search: { label: "Search queue", query: "review", input: { label: "Search queue", placeholder: "Case, owner, or state" } },
    filters: [{ key: "status", label: "Status: Review", tone: "warning", removable: true }, { key: "region", label: "North", tone: "info", removable: true }],
    toolbar: { label: "Queue tools", actions: [{ key: "refresh", label: "Refresh", icon: "sync" }, { key: "export", label: "Export", icon: "download", variant: "secondary" }] },
    table: { label: "Operational queue", rows: vehicleRows, columns: vehicleColumns, selectedKeys: ["kld-901-c"], density: "sm", state: "selected" },
    bulkActions: { label: "Queue bulk actions", selectedCount: 1, totalCount: 3, actions: [{ key: "assign", label: "Assign", icon: "person_add" }] },
    feedback: { kind: "inline", label: "1 row selected", message: "Bulk actions reflect eligibility.", state: "info" },
    "data-pattern-demo": "dense-operational-list",
  }, "selected")}</section>`;
}
