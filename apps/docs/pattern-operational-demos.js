import { html, slug } from "./detail-tabs-core.js?v=5";
import { componentDemo } from "./component-demo.js?v=60";
import { operationalReactPatternOverviewDemo } from "./pattern-operational-react-demos.js?v=3";

function attrText(attrs = {}) {
  return Object.entries(attrs).map(([key, value]) => value === "" ? key : `${key}="${String(value).replace(/"/g, "&quot;")}"`).join(" ");
}

function packageDemo(component, demo = {}, attrs = {}) {
  const markup = componentDemo(component, demo);
  if (!markup) return "";
  return markup.replace(/^<([a-z0-9-]+)/i, `<$1 ${attrText({ "data-pattern-component": component, ...attrs })}`);
}

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function patternReactDemo(pattern, props, state = "default", variant = "standard") {
  return `<div class="docs-react-island docs-pattern-demo" data-react-component="${pattern}" data-component-source="react-pattern" data-doc-pattern="${pattern}" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="true" data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}

const operationalPatterns = {
  "chart-legend-item": {
    title: "Chart legend synchronization",
    pattern: "Chart Wrapper",
    components: ["chart-legend-item", "chart-panel"],
    body: () => html`
      <div class="template-station-pin-row" data-chart-legend-items>
        ${patternReactDemo("chart-legend-item", { label: "Fuel spend", value: "$84.2k", description: "Primary cost series", colorLabel: "Blue", selected: true, density: "sm", status: { label: "Visible", tone: "info", variant: "standard" }, "data-pattern-demo": "chart-legend-item" }, "selected")}
        ${patternReactDemo("chart-legend-item", { label: "Maintenance", value: "$18.4k", description: "Secondary cost series", colorLabel: "Green", selected: true, density: "sm", control: "chip", tag: { label: "Compare", tone: "neutral" }, "data-pattern-demo": "chart-legend-item" }, "selected", "chip")}
        ${patternReactDemo("chart-legend-item", { label: "Tolls", value: "$9.8k", description: "Hidden by default for comparison", colorLabel: "Amber", hidden: true, density: "sm", control: "button", tooltip: { label: "Toggle toll spend in the chart" }, "data-pattern-demo": "chart-legend-item" }, "hidden", "button")}
      </div>
      ${packageDemo("chart-panel", { label: "Selected series", value: "$102.6k", caption: "Legend state is reflected in chart and table fallback.", values: [32, 54, 48, 70, 62, 84] })}
    `,
  },
  "station-discovery": {
    title: "Station discovery handoff",
    pattern: "Search",
    components: ["input", "station-pin", "route-summary", "table"],
    body: () => html`
      ${packageDemo("input", { label: "Search station", placeholder: "Station, city, or route" })}
      <div class="template-station-pin-row">${packageDemo("station-pin", { label: "Station 24", state: "selected", price: "$24.10" })}${packageDemo("station-pin", { label: "Station 18", state: "warning", price: "$24.80" })}</div>
      ${packageDemo("route-summary", { label: "Route 18", meta: "North fleet", distance: "42 km", duration: "1h 20m", status: "Ready" })}
    `,
  },
  "kanban-board": {
    title: "Operational Kanban",
    pattern: "Drag Sortable List",
    components: ["badge", "list", "button"],
    body: () => html`
      <div class="pattern-transfer-list-demo__panes">
        <div>${packageDemo("badge", { label: "New", tone: "neutral", variant: "standard" })}${packageDemo("list", { label: "New cases", items: [{ label: "Price exception", meta: "Pricing", value: "New", icon: "view_kanban" }] })}</div>
        <div>${packageDemo("badge", { label: "Review", tone: "warning", variant: "standard" })}${packageDemo("list", { label: "Review cases", items: [{ label: "Permission escalation", meta: "Security", value: "Blocked", icon: "view_kanban" }] })}</div>
      </div>
    `,
  },
  "status-feedback-view": {
    title: "Feedback routing",
    pattern: "Snackbar Provider",
    components: ["empty-state", "error-panel", "toast"],
    body: () => html`
      ${packageDemo("empty-state", { label: "No results", description: "Clear filters or broaden the query.", icon: "search_off" })}
      ${packageDemo("error-panel", { label: "Sync delayed", description: "Retry without losing current context.", state: "warning", actionLabel: "Retry" })}
      ${packageDemo("toast", { label: "Retry queued", description: "The user can keep working.", tone: "success" })}
    `,
  },
  "payment-form": {
    title: "Payment credential flow",
    pattern: "Status Feedback View",
    components: ["card-number-input", "card-expiry-input", "card-security-code-input", "input-amount"],
    body: () => html`
      ${packageDemo("card-number-input", { label: "Card number", value: "4111111111111111" })}
      ${packageDemo("card-expiry-input", { label: "Expiry", value: "12/28" })}
      ${packageDemo("card-security-code-input", { label: "Security code", value: "123" })}
    `,
  },
  "dense-operational-list": {
    title: "Dense queue list",
    pattern: "Virtual Data Table",
    components: ["input", "chip", "list", "badge"],
    body: () => html`
      ${packageDemo("input", { label: "Search queue", placeholder: "Case, owner, or state" })}
      <div>${packageDemo("chip", { label: "Status: Review", selected: true, removable: true })}${packageDemo("badge", { label: "12 visible", tone: "neutral", variant: "standard" })}</div>
      ${packageDemo("list", { label: "Operational queue", items: [{ label: "Station price exception", meta: "Pricing ops", value: "Review", icon: "list_alt" }, { label: "Permission escalation", meta: "Security", value: "Blocked", icon: "lock" }] })}
    `,
  },
  "account-operations": {
    title: "Account operations",
    pattern: "Dense Operational List",
    components: ["table", "drawer", "audit-event"],
    body: () => html`${operationTable("Accounts")}${packageDemo("drawer", { label: "Account detail", description: "Selected account review.", open: true })}${packageDemo("audit-event", { label: "Account updated", description: "Owner changed for North fleet.", meta: "Today 09:42", status: "Logged", icon: "manage_history" })}`,
  },
  "ticket-queue": {
    title: "Support ticket queue",
    pattern: "Notification Panel",
    components: ["badge", "table", "error-panel"],
    body: () => html`${packageDemo("badge", { label: "4 urgent", tone: "warning", variant: "standard" })}${operationTable("Tickets")}${packageDemo("error-panel", { label: "SLA risk", description: "Escalate tickets older than one hour.", state: "warning", actionLabel: "Escalate" })}`,
  },
  "case-management": {
    title: "Case management",
    pattern: "Timeline",
    components: ["table", "drawer", "audit-event"],
    body: () => html`${operationTable("Cases")}${packageDemo("drawer", { label: "Case detail", description: "Evidence and activity timeline.", open: true })}${packageDemo("audit-event", { label: "Case assigned", description: "Assigned to pricing ops.", meta: "Today 10:15", status: "Review", icon: "assignment_ind" })}`,
  },
  "filterable-editable-table": {
    title: "Editable table boundary",
    pattern: "Advanced Filters",
    components: ["select", "table", "drawer"],
    body: () => html`${packageDemo("select", { label: "Status", value: "review", options: [{ label: "Review", value: "review" }, { label: "Active", value: "active" }] })}${operationTable("Editable records")}${packageDemo("drawer", { label: "Edit record", description: "Drawer Adapter owns edit lifecycle.", open: true })}`,
  },
  "pricing-operations": {
    title: "Pricing operations",
    pattern: "Roles and Permissions",
    components: ["table", "badge", "error-panel"],
    body: () => html`${packageDemo("badge", { label: "Approval required", tone: "warning", variant: "standard" })}${operationTable("Pricing rules")}${packageDemo("error-panel", { label: "Permission gated", description: "Finance reviewer must approve publication.", state: "warning", actionLabel: "Request approval" })}`,
  },
  "backoffice-approval": {
    title: "Backoffice approval",
    pattern: "Dense Operational List",
    components: ["list", "dialog", "toast"],
    body: () => html`${packageDemo("list", { label: "Approval queue", items: [{ label: "Vehicle document", meta: "Luis Vera", value: "Approve", icon: "fact_check" }, { label: "Card limit", meta: "Ana Sosa", value: "Reject", icon: "rule" }] })}${packageDemo("dialog", { label: "Approve item?", description: "Approval creates an audit event.", actions: [{ label: "Approve", key: "confirm" }, { label: "Cancel", variant: "secondary", key: "cancel" }] })}${packageDemo("toast", { label: "Approval saved", description: "Queue item was updated.", tone: "success" })}`,
  },
  "email-template-layout": {
    title: "Email layout preview",
    pattern: "Status Feedback View",
    components: ["badge", "button", "list"],
    body: () => html`${packageDemo("badge", { label: "Email-safe", tone: "info", variant: "standard" })}${packageDemo("list", { label: "Email sections", items: [{ label: "Preheader", meta: "Hidden preview text", value: "Required", icon: "mail" }, { label: "Primary CTA", meta: "Table-safe button", value: "Required", icon: "touch_app" }] })}${packageDemo("button", { label: "Preview email", icon: "mail" })}`,
  },
  "expandable-detail-table": {
    title: "Expandable table detail",
    pattern: "Virtual Data Table",
    components: ["table", "drawer", "button"],
    body: () => html`${operationTable("Expandable rows")}${packageDemo("drawer", { label: "Expanded row detail", description: "Detail review stays outside table row markup.", open: true })}${packageDemo("button", { label: "Collapse detail", variant: "secondary", icon: "unfold_less" })}`,
  },
  "agent-conversation": {
    title: "Agent conversation",
    pattern: "Status Feedback View",
    components: ["chat-message", "chat-composer", "toast"],
    body: () => html`${packageDemo("chat-message", { author: "customer", label: "Ana Sosa", message: "My card was declined.", meta: "2 min ago" })}${packageDemo("chat-message", { author: "agent", label: "Support", message: "I can see the station requires a policy override.", meta: "Now" })}${packageDemo("chat-composer", { label: "Reply", placeholder: "Write a governed response" })}`,
  },
};

function operationTable(label) {
  const rows = [{ id: "one", item: "Station price exception", owner: "Pricing ops", state: "Review" }, { id: "two", item: "Permission escalation", owner: "Security", state: "Blocked" }];
  return packageDemo("table", { label, rows, columns: [{ key: "item", label: "Item" }, { key: "owner", label: "Owner" }, { key: "state", label: "State" }] });
}

export function operationalPatternOverviewDemo(patternId) {
  const reactDemo = operationalReactPatternOverviewDemo(patternId);
  if (reactDemo) return reactDemo;
  const demo = operationalPatterns[patternId];
  if (!demo) return "";
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail" data-operational-pattern-demo="${patternId}">
      <span class="eyebrow">Operational demo</span>
      <h2>${demo.title}</h2>
      <div class="surface template-module-surface" data-flow-primitive="surface" data-surface-role="section" data-template-pattern="${slug(demo.pattern)}">
        <header class="template-module-header">
          <div><strong>${demo.pattern}</strong><p>${demo.components.join(", ")}</p></div>
          ${packageDemo("badge", { label: "Flow-owned", tone: "neutral", variant: "standard" })}
        </header>
        <div class="template-module-content">${demo.body()}</div>
      </div>
    </section>
  `;
}
