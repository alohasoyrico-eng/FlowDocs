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
  if (patternId === "account-operations") return accountOperationsPanel();
  if (patternId === "ticket-queue") return ticketQueuePanel();
  if (patternId === "case-management") return caseManagementPanel();
  if (patternId === "filterable-editable-table") return filterableEditableTablePanel();
  if (patternId === "pricing-operations") return pricingOperationsPanel();
  if (patternId === "backoffice-approval") return backofficeApprovalPanel();
  if (patternId === "email-template-layout") return emailTemplateLayoutPanel();
  if (patternId === "expandable-detail-table") return expandableDetailTablePanel();
  if (patternId === "agent-conversation") return agentConversationPanel();
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

const operationsRows = [
  { id: "acct-north", item: "North fleet account", owner: "Marta Diaz", state: { label: "Review", tone: "warning" }, updated: "09:42" },
  { id: "acct-west", item: "West fuel policy", owner: "Noe Ruiz", state: { label: "Active", tone: "success" }, updated: "10:15" },
  { id: "acct-south", item: "South exceptions", owner: "Iris Mora", state: { label: "Blocked", tone: "danger" }, updated: "11:03" },
];

const operationsColumns = [
  { key: "item", label: "Item", priority: "primary" },
  { key: "owner", label: "Owner", priority: "secondary" },
  { key: "state", label: "State", priority: "secondary" },
  { key: "updated", label: "Updated", align: "right", priority: "tertiary" },
];

const timelineEvents = [
  { key: "created", label: "Account created", description: "North fleet account opened.", meta: "Today 08:12", icon: "add_circle", state: "success" },
  { key: "owner", label: "Owner changed", description: "Ownership moved to Marta Diaz.", meta: "Today 09:42", icon: "manage_history", state: "warning" },
  { key: "review", label: "Review requested", description: "Finance needs final approval.", meta: "Today 10:15", icon: "rule", state: "info" },
];

function accountOperationsPanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Account operations</h2>${patternReactDemo("account-operations", {
    label: "Account operations",
    description: "Account list, detail drawer, audit timeline, metrics, and bulk actions are governed by Flow.",
    density: "sm",
    state: "detail-open",
    selectedAccountKey: "acct-north",
    detailOpen: true,
    summaries: [{ key: "open", label: "3 open", tone: "warning" }, { key: "active", label: "128 active", tone: "success" }],
    accounts: {
      label: "Account queue",
      selectedKeys: ["acct-north"],
      search: { label: "Search accounts", query: "North" },
      filters: [{ key: "state", label: "Review", tone: "warning", removable: true }],
      table: { label: "Accounts", rows: operationsRows, columns: operationsColumns, selectedKeys: ["acct-north"], density: "sm", selection: { enabled: false } },
      bulkActions: { label: "Account actions", selectedCount: 1, totalCount: 3, actions: [{ key: "assign", label: "Assign", icon: "person_add" }] },
    },
    detail: { label: "North fleet account", description: "Review owner, policy, and audit evidence.", open: true, actions: [{ key: "save", label: "Save", icon: "save" }] },
    timeline: { label: "Audit trail", events: timelineEvents, selectedKey: "owner" },
    "data-pattern-demo": "account-operations",
  }, "detail-open")}</section>`;
}

function ticketQueuePanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Support ticket queue</h2>${patternReactDemo("ticket-queue", {
    label: "Support ticket queue",
    description: "Alerts, dense list, drawer detail, and feedback are a single React orchestration.",
    density: "sm",
    state: "ticket-selected",
    selectedTicketKey: "acct-south",
    detailOpen: true,
    summaries: [{ key: "urgent", label: "4 urgent", tone: "warning" }, { key: "sla", label: "1 SLA risk", tone: "danger" }],
    alerts: { label: "Queue alerts", open: true, notifications: [{ key: "sla", label: "SLA risk", description: "South exceptions needs escalation.", unread: true }] },
    tickets: {
      label: "Tickets",
      selectedKeys: ["acct-south"],
      search: { label: "Search tickets", query: "SLA" },
      table: { label: "Tickets", rows: operationsRows, columns: operationsColumns, selectedKeys: ["acct-south"], density: "sm", selection: { enabled: false } },
      feedback: { label: "Ticket selected", message: "Detail and actions update with the selected ticket.", state: "info" },
    },
    detail: { label: "SLA risk", description: "Escalate tickets older than one hour.", open: true, actions: [{ key: "escalate", label: "Escalate", icon: "priority_high" }] },
    feedback: { kind: "inline", label: "Escalation ready", message: "Supervisor approval is available.", state: "warning" },
    "data-pattern-demo": "ticket-queue",
  }, "ticket-selected")}</section>`;
}

function caseManagementPanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Case management</h2>${patternReactDemo("case-management", {
    label: "Case management",
    description: "Filters, case list, detail drawer, timeline, and feedback stay inside the Flow pattern.",
    density: "sm",
    state: "detail-open",
    selectedCaseKey: "acct-west",
    detailOpen: true,
    summaries: [{ key: "cases", label: "12 cases", tone: "neutral" }, { key: "review", label: "5 review", tone: "warning" }],
    filters: { label: "Case filters", open: false, fields: [{ key: "status", label: "Status", value: "Review" }] },
    cases: {
      label: "Cases",
      selectedKeys: ["acct-west"],
      search: { label: "Search cases", query: "policy" },
      filters: [{ key: "owner", label: "Pricing ops", tone: "info", removable: true }],
      table: { label: "Cases", rows: operationsRows, columns: operationsColumns, selectedKeys: ["acct-west"], density: "sm", selection: { enabled: false } },
    },
    detail: { label: "West fuel policy", description: "Evidence and activity timeline.", open: true, actions: [{ key: "resolve", label: "Resolve", icon: "check_circle" }] },
    timeline: { label: "Case activity", events: timelineEvents, selectedKey: "review", filtered: true },
    feedback: { kind: "inline", label: "Activity filtered", message: "Timeline reflects current evidence scope.", state: "info" },
    "data-pattern-demo": "case-management",
  }, "detail-open")}</section>`;
}

function filterableEditableTablePanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Filterable editable table</h2>${patternReactDemo("filterable-editable-table", {
    label: "Editable records",
    description: "Advanced filters, virtual table, editor drawer, and feedback form one controlled boundary.",
    density: "sm",
    state: "editing",
    selectedRowKey: "acct-north",
    editing: true,
    metrics: [{ key: "visible", label: "3 visible", tone: "neutral" }, { key: "dirty", label: "1 editing", tone: "warning" }],
    filters: { label: "Record filters", open: false, fields: [{ key: "state", label: "State", value: "Review" }] },
    table: { label: "Editable records", rows: operationsRows, columns: operationsColumns, selectedKey: "acct-north", selectedKeys: ["acct-north"], density: "sm" },
    editor: { label: "Edit North fleet account", description: "Drawer Adapter owns the edit lifecycle.", open: true, actions: [{ key: "save", label: "Save changes", icon: "save" }] },
    feedback: { kind: "inline", label: "Unsaved changes", message: "Save or discard the current edit.", state: "warning" },
    "data-pattern-demo": "filterable-editable-table",
  }, "editing")}</section>`;
}

function pricingOperationsPanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Pricing operations</h2>${patternReactDemo("pricing-operations", {
    label: "Pricing operations",
    description: "Rules, queue table, approval drawer, role policy, and feedback are orchestrated by React.",
    density: "sm",
    state: "pending-approval",
    selectedRuleKey: "fuel-north",
    editorOpen: true,
    summaries: [{ key: "pending", label: "2 pending", tone: "warning" }, { key: "published", label: "18 live", tone: "success" }],
    rules: [{ key: "fuel-north", name: "North fuel cap", scope: "North", type: "Fuel", value: "$24.20", status: "Pending", owner: "Finance" }],
    queue: { label: "Pricing rules", rows: operationsRows, columns: operationsColumns, selectedKey: "acct-north", density: "sm" },
    editor: { label: "North fuel cap", description: "Finance reviewer must approve publication.", open: true, actions: [{ key: "submit", label: "Submit", icon: "send" }] },
    rolePolicy: { label: "Approval policy", permissions: [{ key: "publish", label: "Publish prices", checked: false }, { key: "review", label: "Review exceptions", checked: true }] },
    feedback: { kind: "inline", label: "Approval required", message: "Finance reviewer must approve publication.", state: "warning" },
    "data-pattern-demo": "pricing-operations",
  }, "pending-approval")}</section>`;
}

function backofficeApprovalPanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Backoffice approval</h2>${patternReactDemo("backoffice-approval", {
    label: "Backoffice approval",
    description: "Document queue, detail review, approve/reject actions, and feedback remain Flow-owned.",
    density: "sm",
    state: "detail-open",
    selectedDocumentKey: "doc-vehicle",
    detailOpen: true,
    summaries: [{ key: "pending", label: "7 pending", tone: "warning" }, { key: "blocked", label: "1 blocked", tone: "danger" }],
    documents: [{ key: "doc-vehicle", account: "North fleet", who: "Luis Vera", document: "Vehicle document", submitted: "Today", status: "Pending" }],
    queue: { label: "Approval queue", selectedKeys: ["doc-vehicle"], table: { label: "Documents", rows: operationsRows, columns: operationsColumns, selectedKeys: ["acct-north"], density: "sm", selection: { enabled: false } } },
    detail: { label: "Vehicle document", description: "Approval creates an audit event.", open: true, actions: [{ key: "approve", label: "Approve", icon: "check" }, { key: "reject", label: "Reject", intent: "danger", icon: "close" }] },
    feedback: { kind: "inline", label: "Ready to decide", message: "Decision actions are bound to the selected document.", state: "info" },
    "data-pattern-demo": "backoffice-approval",
  }, "detail-open")}</section>`;
}

function emailTemplateLayoutPanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Email template layout</h2>${patternReactDemo("email-template-layout", {
    variant: "operational-summary",
    density: "md",
    state: "ready",
    lang: "en",
    brand: "Flow",
    title: "Weekly operations summary",
    preheader: "412 trips, $48.2k revenue, and 3 alerts need review.",
    eyebrow: "Weekly summary",
    headline: "Marta, here is the North fleet summary",
    body: "This HTML-safe template keeps email constraints explicit while still using the Flow token contract.",
    metrics: [{ label: "Trips", value: "412", delta: "+12%" }, { label: "Revenue", value: "$48.2k", delta: "+8%" }, { label: "Open alerts", value: "3", delta: "-2", tone: "warning" }],
    rows: [{ label: "Workspace", value: "North fleet", strong: true }, { label: "Period", value: "Aug 4 - Aug 10" }],
    alertsTitle: "Needs review",
    alerts: [{ key: "price", label: "Station price exception" }, { key: "policy", label: "Policy approval pending" }],
    action: { label: "Open Flow" },
    footer: "Flow operational email preview",
    "data-pattern-demo": "email-template-layout",
  }, "ready", "operational-summary")}</section>`;
}

function expandableDetailTablePanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Expandable detail table</h2>${patternReactDemo("expandable-detail-table", {
    label: "Expandable rows",
    description: "Virtual table, expanded row state, detail drawer, and feedback are controlled by React.",
    density: "sm",
    state: "expanded",
    expandedRowKey: "acct-north",
    detailOpen: true,
    summaries: [{ key: "expanded", label: "1 expanded", tone: "info" }, { key: "rows", label: "3 rows", tone: "neutral" }],
    table: { label: "Expandable rows", rows: operationsRows, columns: operationsColumns, selectedKey: "acct-north", selectedKeys: ["acct-north"], density: "sm" },
    detail: { label: "Expanded row detail", description: "Detail review stays outside table row markup.", open: true, actions: [{ key: "collapse", label: "Collapse detail", variant: "secondary", icon: "unfold_less" }] },
    feedback: { kind: "inline", label: "Row expanded", message: "Detail content is synchronized with selected row.", state: "info" },
    "data-pattern-demo": "expandable-detail-table",
  }, "expanded")}</section>`;
}

function agentConversationPanel() {
  return html`<section class="doc-panel wide pattern-utility-panel"><span class="eyebrow">Operational demo</span><h2>Agent conversation</h2>${patternReactDemo("agent-conversation", {
    label: "Agent conversation",
    description: "Chat thread, composer, handoff, and status feedback stay inside the React pattern.",
    density: "md",
    state: "active",
    selectedMessageKey: "customer-1",
    thread: {
      label: "Support conversation",
      messages: [
        { key: "customer-1", author: "customer", label: "Ana Sosa", message: "My card was declined at Station 24.", meta: "2 min ago" },
        { key: "agent-1", author: "agent", label: "Support", message: "I can see the station requires a policy override.", meta: "Now" },
      ],
    },
    composer: { label: "Reply", value: "I can request the override now.", placeholder: "Write a governed response", sendLabel: "Send" },
    handoff: { active: true, title: "Policy handoff available", description: "Escalate to finance if the override is blocked.", action: { key: "handoff", label: "Handoff", variant: "secondary" } },
    feedback: { kind: "inline", label: "Conversation active", message: "Composer changes and send state are controlled.", state: "info" },
    "data-pattern-demo": "agent-conversation",
  }, "active")}</section>`;
}
