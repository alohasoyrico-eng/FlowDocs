import { html } from "./detail-tabs-core.js?v=5";

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
  { id: "pzn-118-d", plate: "PZN-118-D", driver: "Noe Ruiz", status: { label: "Active", tone: "success" }, region: "West", spend: "$410" },
];

const vehicleColumns = [
  { key: "plate", label: "Plate", mono: true, sortable: true, priority: "primary" },
  { key: "driver", label: "Driver", sortable: true },
  { key: "status", label: "Status" },
  { key: "region", label: "Region" },
  { key: "spend", label: "Spend", align: "right", sortable: true },
];

export function desktopReactPatternOverviewDemo(patternId) {
  if (patternId === "kpi-card") return kpiCardReactPanel();
  if (patternId === "chart-wrapper") return chartWrapperReactPanel();
  if (patternId === "virtual-data-table") return virtualDataTableReactPanel();
  if (patternId === "advanced-filters") return advancedFiltersReactPanel();
  if (patternId === "column-configurator") return columnConfiguratorReactPanel();
  if (patternId === "roles-and-permissions") return rolesAndPermissionsReactPanel();
  if (patternId === "bulk-actions") return bulkActionsReactPanel();
  return "";
}

function kpiCardReactPanel() {
  return html`<section class="surface docs-section-surface detail-section-surface wide pattern-desktop-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><span class="eyebrow">Interactive demo</span><h2>Dashboard KPI card</h2>${patternReactDemo("kpi-card", {
    label: "Fuel spend",
    value: "$84.2k",
    unit: "MXN",
    delta: "+12% vs last week",
    trend: "up",
    tone: "warning",
    icon: "local_gas_station",
    density: "md",
    state: "interactive",
    status: { label: "Updated 4 min ago", tone: "neutral", variant: "standard" },
    tag: { label: "Policy", tone: "warning", icon: "rule" },
    action: { key: "investigate", label: "Investigate", icon: "troubleshoot", variant: "secondary" },
    "data-pattern-demo": "kpi-card",
  })}</section>`;
}

function chartWrapperReactPanel() {
  return html`<section class="surface docs-section-surface detail-section-surface wide pattern-desktop-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><span class="eyebrow">Interactive demo</span><h2>Chart module with summary</h2>${patternReactDemo("chart-wrapper", {
    label: "Fuel spend trend",
    description: "Chart, summary metric, table fallback, and actions stay in one governed pattern.",
    density: "md",
    state: "filtered",
    filtered: true,
    chart: { label: "Fuel spend by period", value: "$84.2k", caption: "Last 6 periods.", values: [32, 54, 48, 70, 62, 84] },
    summary: { label: "Fuel trend", value: "84%", delta: "Compared with last quarter", tone: "info" },
    status: { label: "Filtered", tone: "info", variant: "standard" },
    primaryAction: { key: "export", label: "Export", icon: "download", variant: "secondary" },
    table: { label: "Chart data summary", rows: [{ id: "jan", period: "Jan", spend: "$62k" }, { id: "feb", period: "Feb", spend: "$70k" }, { id: "mar", period: "Mar", spend: "$84k" }], columns: [{ key: "period", label: "Period" }, { key: "spend", label: "Spend", align: "right" }] },
    "data-pattern-demo": "chart-wrapper",
  })}</section>`;
}

function virtualDataTableReactPanel() {
  return html`<section class="surface docs-section-surface detail-section-surface wide pattern-desktop-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><span class="eyebrow">Interactive demo</span><h2>Operational data table</h2>${patternReactDemo("virtual-data-table", {
    label: "Vehicle operations",
    description: "Sortable, selectable, paginated table without a parallel docs table implementation.",
    density: "sm",
    state: "selected",
    virtualized: true,
    columns: vehicleColumns,
    rows: vehicleRows,
    rowKey: "id",
    selectedKeys: ["kld-901-c"],
    sortKey: "plate",
    sortDir: "ascending",
    page: 1,
    pageCount: 3,
    pagination: { label: "Vehicle pages", pageSize: 4 },
    selection: { enabled: true, label: "Select vehicles", rowLabel: "Select row" },
    bulkActions: [{ key: "review", label: "Mark review", icon: "fact_check" }, { key: "export", label: "Export", variant: "secondary", icon: "download" }],
    "data-pattern-demo": "virtual-data-table",
  })}</section>`;
}

function advancedFiltersReactPanel() {
  return html`<section class="surface docs-section-surface detail-section-surface wide pattern-desktop-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><span class="eyebrow">Interactive demo</span><h2>Advanced filters</h2>${patternReactDemo("advanced-filters", {
    label: "Vehicle filters",
    description: "Saved views, fields, applied chips, validation, and feedback are composed from Flow.",
    density: "md",
    state: "dirty",
    open: true,
    dirty: true,
    fields: [
      { key: "plate", kind: "input", label: "Plate or driver", value: "JMX", placeholder: "Plate, driver, or status", icon: "search" },
      { key: "region", kind: "select", label: "Region", value: "north", options: [{ label: "North", value: "north" }, { label: "Central", value: "central" }] },
      { key: "window", kind: "date-range", label: "Activity window", value: "Last 7 days", presets: ["Today", "Last 7 days", "This month"] },
    ],
    appliedFilters: [{ key: "region", label: "North", tone: "info", removable: true }, { key: "status", label: "Review", tone: "warning", removable: true }],
    validation: { label: "Filter status", message: "2 filters pending apply.", state: "warning" },
    applyAction: { key: "apply", label: "Apply filters", icon: "filter_alt" },
    resetAction: { key: "reset", label: "Reset", variant: "secondary", icon: "restart_alt" },
    savedViews: { triggerLabel: "Saved views", label: "Saved filter views", items: [{ key: "high-risk", label: "High risk" }, { key: "north", label: "North fleet" }] },
    "data-pattern-demo": "advanced-filters",
  })}</section>`;
}

function columnConfiguratorReactPanel() {
  return html`<section class="surface docs-section-surface detail-section-surface wide pattern-desktop-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><span class="eyebrow">Interactive demo</span><h2>Column configuration</h2>${patternReactDemo("column-configurator", {
    label: "Vehicle columns",
    description: "Column visibility persists without inventing a docs-only chooser.",
    density: "sm",
    state: "dirty",
    open: true,
    surface: { mode: "drawer", label: "Configure columns", triggerLabel: "Columns", side: "right" },
    columns: [
      { key: "plate", label: "Plate", visible: true, required: true, description: "Primary vehicle identifier" },
      { key: "driver", label: "Driver", visible: true },
      { key: "status", label: "Status", visible: true, status: { label: "Required", tone: "info" } },
      { key: "region", label: "Region", visible: false },
      { key: "spend", label: "Spend", visible: true, align: "right" },
    ],
    visibleKeys: ["plate", "driver", "status", "spend"],
    rows: vehicleRows,
    rowKey: "id",
    table: { label: "Column preview", columns: vehicleColumns, rows: vehicleRows, density: "sm" },
    applyAction: { key: "apply", label: "Apply columns", icon: "view_column" },
    resetAction: { key: "reset", label: "Reset", variant: "secondary", icon: "restart_alt" },
    validation: { label: "Column status", message: "One optional column is hidden.", state: "warning" },
    "data-pattern-demo": "column-configurator",
  })}</section>`;
}

function rolesAndPermissionsReactPanel() {
  return html`<section class="surface docs-section-surface detail-section-surface wide pattern-desktop-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><span class="eyebrow">Interactive demo</span><h2>Roles and permissions</h2>${patternReactDemo("roles-and-permissions", {
    label: "Fleet access matrix",
    description: "Permission changes remain auditable and confirmation-aware.",
    density: "sm",
    state: "dirty",
    mode: "switch",
    roles: [{ key: "admin", label: "Admin" }, { key: "manager", label: "Manager" }, { key: "support", label: "Support" }],
    permissions: [
      { key: "view", label: "View fleet", scope: "Workspace", tone: "success" },
      { key: "approve", label: "Approve exceptions", scope: "Policy", tone: "warning" },
      { key: "export", label: "Export data", scope: "Sensitive", tone: "danger", reason: "Requires audit trail" },
    ],
    values: { admin: { view: true, approve: true, export: true }, manager: { view: true, approve: true, export: false }, support: { view: true, approve: false, export: false } },
    validation: { label: "Permission status", message: "Export permission requires confirmation.", state: "warning", live: true },
    audit: { label: "Last change", description: "Manager approval enabled.", meta: "Today 09:42 - Admin", status: "Logged", icon: "manage_history" },
    actions: [{ key: "save", label: "Save roles", icon: "save" }, { key: "reset", label: "Reset", variant: "secondary", icon: "restart_alt" }],
    "data-pattern-demo": "roles-and-permissions",
  })}</section>`;
}

function bulkActionsReactPanel() {
  return html`<section class="surface docs-section-surface detail-section-surface wide pattern-desktop-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><span class="eyebrow">Interactive demo</span><h2>Bulk actions toolbar</h2>${patternReactDemo("bulk-actions", {
    label: "Vehicle bulk actions",
    density: "sm",
    state: "selected",
    selectedCount: 2,
    totalCount: 4,
    eligibleCount: 1,
    selection: { label: "Select all visible rows", description: "2 selected, 1 eligible for review." },
    table: { label: "Selected vehicles", columns: vehicleColumns, rows: vehicleRows, rowKey: "id", selectedKey: "kld-901-c", density: "sm", variant: "selectable" },
    actions: [{ key: "review", label: "Mark review", icon: "fact_check" }, { key: "export", label: "Export", variant: "secondary", icon: "download" }],
    overflow: { triggerLabel: "More bulk actions", label: "More bulk actions", items: [{ key: "assign", label: "Assign owner" }, { key: "archive", label: "Archive" }] },
    feedback: { label: "2 rows selected", description: "Actions reflect eligibility and permissions.", tone: "info" },
    "data-pattern-demo": "bulk-actions",
  })}</section>`;
}
