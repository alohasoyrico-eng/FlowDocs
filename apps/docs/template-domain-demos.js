import { html, slug } from "./detail-tabs-core.js?v=3";
import { componentDemo } from "./component-demo.js?v=60";
import { renderSidebarPattern, renderTopbarPattern } from "./pattern-shell-renderers.js?v=6";

const templateFoundations = "energy frame voice depth momentum state tone growth symbol iconography accessibility";

function attrText(attrs = {}) {
  return Object.entries(attrs).map(([key, value]) => value === "" ? key : `${key}="${String(value).replace(/"/g, "&quot;")}"`).join(" ");
}

function packageDemo(component, demo = {}, attrs = {}) {
  const markup = componentDemo(component, demo);
  if (!markup) return "";
  return markup.replace(/^<([a-z0-9-]+)/i, `<$1 ${attrText({ "data-template-component": component, ...attrs })}`);
}

function patternAttr(name) {
  return `data-template-pattern="${slug(name)}"`;
}

function navPatternFor(item) {
  const patterns = {
    overview: "Fleet Dashboard Overview",
    combustible: "Fuel Dashboard",
    fuel: "Fuel Dashboard",
    mantenimiento: "Maintenance Dashboard",
    maintenance: "Maintenance Dashboard",
    ev: "Electromobility Dashboard",
    peaje: "Toll Dashboard",
    fleet: "Fleet Dashboard",
    flotilla: "Fleet Dashboard",
    finanzas: "Finance Dashboard",
    config: "Roles and Permissions",
    roles: "Roles and Permissions",
    drivers: "Driver and Vehicle Administration",
    vehicles: "Driver and Vehicle Administration",
    audit: "Roles and Permissions",
  };
  return patterns[slug(item)] ?? item;
}

function templateFrame(entry, blueprint, body) {
  return html`
    <div class="template-desktop-demo" data-template-desktop="${entry.id}" data-template-foundations="${templateFoundations}">
      ${renderTopbarPattern({ packageDemo })}
      <div class="template-desktop-demo__body">
        ${renderSidebarPattern({ title: entry.title, nav: blueprint.nav, packageDemo, navPatternFor })}
        <div class="template-desktop-demo__workspace">${body}</div>
      </div>
    </div>
  `;
}

function patternBadges(patterns = []) {
  return html`
    <div class="template-desktop-patterns" aria-label="Patterns consumed">
      ${patterns.map((pattern) => packageDemo("badge", { label: pattern, tone: "neutral", variant: "standard" }, { "data-template-pattern-badge": slug(pattern) })).join("")}
    </div>
  `;
}

function templateShell(entry, blueprint, body) {
  const frame = templateFrame(entry, blueprint, body);
  return html`
    <section class="doc-panel wide template-desktop-panel">
      <div class="template-desktop-panel__header">
        <div><span class="eyebrow">Product demo</span><h2>${entry.title}</h2></div>
        ${packageDemo("button", { label: "Open full screen", icon: "open_in_full" }, { "data-template-fullscreen-open": "" })}
      </div>
      ${patternBadges(entry.patternsUsed ?? [])}
      <div class="template-desktop-preview">${frame}</div>
      <div class="template-desktop-fullscreen" data-template-fullscreen hidden role="dialog" aria-modal="true" aria-label="${entry.title} full screen demo">
        <header class="template-desktop-fullscreen__bar">
          <strong>${entry.title}</strong>
          ${packageDemo("button", { label: "Close", variant: "secondary", icon: "close" }, { "data-template-fullscreen-close": "" })}
        </header>
        <div class="template-desktop-fullscreen__canvas">${frame}</div>
      </div>
    </section>
  `;
}

function templateModuleSurface({ title, detail, status = "", pattern, body = "" }) {
  return html`
    <section ${attrText({ class: "surface template-module-surface", "data-flow-primitive": "surface", "data-surface-role": "section", "data-state": status ? "raised" : "default", "data-template-module-surface": "", "data-template-pattern": slug(pattern) })}>
      <header class="template-module-header">
        <div><strong>${title}</strong><p>${detail}</p></div>
        ${status ? `<span>${status}</span>` : ""}
      </header>
      <div class="template-module-content">${body}</div>
    </section>
  `;
}

export function domainDesktopTemplateDemo(entry, blueprint) {
  if (entry.id === "driver-mobile-app") return driverMobileAppDesktopDemo(entry, blueprint);
  if (entry.id === "driver-card-wallet") return driverCardWalletDesktopDemo(entry, blueprint);
  if (entry.id === "routes-and-stations") return routesAndStationsDesktopDemo(entry, blueprint);
  if (entry.id === "agent-workspace") return agentWorkspaceDesktopDemo(entry, blueprint);
  if (entry.id === "internal-operations-console") return internalOperationsConsoleDesktopDemo(entry, blueprint);
  if (entry.id === "settings-workspace") return settingsWorkspaceDesktopDemo(entry, blueprint);
  return "";
}

function driverMobileAppDesktopDemo(entry, blueprint) {
  return templateShell(entry, blueprint, html`
    <div class="template-desktop-demo__filters" ${patternAttr("Driver Onboarding Mobile")}>
      ${packageDemo("segmented-control", { selectedKey: "today", items: [{ key: "today", label: "Today" }, { key: "route", label: "Route" }, { key: "wallet", label: "Wallet" }] })}
      ${packageDemo("badge", { label: "Mobile preview", tone: "info", variant: "standard" })}
    </div>
    <section class="template-desktop-demo__grid">
      ${templateModuleSurface({ title: "Driver task stack", detail: "Mobile journey states shown inside the desktop governance shell.", status: "3 tasks", pattern: "Driver Onboarding Mobile", body: html`${packageDemo("list", { label: "Driver actions", items: [{ label: "Start route", meta: "Route 18 - 6 stops", value: "Ready", icon: "route" }, { label: "Confirm vehicle", meta: "JMX-214-B", value: "Required", icon: "directions_car" }, { label: "Upload receipt", meta: "Station 24", value: "Pending", icon: "receipt_long" }] })}${packageDemo("quick-action", { label: "Start route", icon: "play_arrow" })}` })}
      ${templateModuleSurface({ title: "Recovery and feedback", detail: "Offline, loading, and blocked states stay delegated to components and feedback patterns.", status: "Online", pattern: "Status Feedback View", body: html`${packageDemo("progress-indicator", { label: "Syncing route context", value: 72 })}${packageDemo("toast", { label: "Route context synced", description: "Stops and card limits are available offline.", tone: "success" })}` })}
    </section>
  `);
}

function driverCardWalletDesktopDemo(entry, blueprint) {
  return templateShell(entry, blueprint, html`
    <section class="template-desktop-demo__kpis" ${patternAttr("Payment Form")}>
      ${packageDemo("kpi-tile", { label: "Available cards", value: "3", delta: "1 virtual", tone: "info", icon: "credit_card" })}
      ${packageDemo("kpi-tile", { label: "Monthly limit", value: "$8.4k", delta: "$2.1k remaining", tone: "success", icon: "account_balance_wallet" })}
      ${packageDemo("kpi-tile", { label: "Blocked attempts", value: "2", delta: "Policy review", tone: "warning", icon: "block" })}
    </section>
    <section class="template-desktop-demo__grid">
      ${templateModuleSurface({ title: "Card wallet", detail: "Card summaries and movement rows form the wallet without a local card pattern.", status: "Active", pattern: "Payment Form", body: html`${packageDemo("card-summary", { label: "Edenred Fleet", meta: "Ana Sosa", number: "•••• 2148", available: "$2,160", limit: "$8,400", status: "Active" })}${packageDemo("movement-row", { label: "Fuel purchase", meta: "Station 24 - Today", value: "$842", icon: "local_gas_station" })}${packageDemo("movement-row", { label: "Receipt synced", meta: "Route 18 - Yesterday", value: "Done", icon: "receipt_long" })}` })}
      ${templateModuleSurface({ title: "High-risk card action", detail: "Destructive wallet actions go through confirmation and feedback.", status: "Review", pattern: "Confirmation Dialog", body: html`${packageDemo("button", { label: "Freeze card", intent: "danger", icon: "block" })}${packageDemo("dialog", { label: "Freeze this card?", description: "Freezing blocks driver payments and creates an audit event.", tone: "danger", actions: [{ label: "Freeze card", intent: "danger", key: "confirm" }, { label: "Cancel", variant: "secondary", key: "cancel" }] })}` })}
    </section>
  `);
}

function routesAndStationsDesktopDemo(entry, blueprint) {
  const stationRows = [{ id: "st-24", station: "Station 24", distance: "1.2 km", status: "Open", price: "$24.10" }, { id: "st-18", station: "Station 18", distance: "4.8 km", status: "Busy", price: "$24.80" }, { id: "st-09", station: "Station 09", distance: "8.1 km", status: "Restricted", price: "$23.90" }];
  return templateShell(entry, blueprint, html`
    <div class="template-desktop-demo__filters" ${patternAttr("Station Discovery")}>${packageDemo("input", { label: "Search route or station", placeholder: "Station, route, city" })}${packageDemo("button", { label: "Find stations", icon: "local_gas_station" })}</div>
    <section class="template-desktop-demo__grid">
      ${templateModuleSurface({ title: "Route summary", detail: "Route choice, map markers, and station evidence stay separated by component ownership.", status: "6 stops", pattern: "Station Discovery", body: html`${packageDemo("route-summary", { label: "Route 18", meta: "North fleet", distance: "42 km", duration: "1h 20m", status: "Ready" })}<div class="template-station-pin-row">${packageDemo("station-pin", { label: "Station 24", state: "selected", price: "$24.10" })}${packageDemo("station-pin", { label: "Station 18", state: "default", price: "$24.80" })}${packageDemo("station-pin", { label: "Station 09", state: "warning", price: "$23.90" })}</div>` })}
      ${templateModuleSurface({ title: "Station evidence", detail: "Table remains the evidence surface for station choice.", status: "Policy checked", pattern: "Virtual Data Table", body: packageDemo("table", { label: "Nearby stations", rows: stationRows, columns: [{ key: "station", label: "Station" }, { key: "distance", label: "Distance" }, { key: "status", label: "Status" }, { key: "price", label: "Price", align: "right" }] }) })}
    </section>
  `);
}

function agentWorkspaceDesktopDemo(entry, blueprint) {
  return templateShell(entry, blueprint, html`
    <section class="template-desktop-demo__grid">
      ${templateModuleSurface({ title: "Conversation queue", detail: "Agent queue uses list, status, and feedback components while the conversation pattern owns routing.", status: "12 open", pattern: "Agent Conversation", body: packageDemo("list", { label: "Open conversations", interactive: true, items: [{ label: "Ana Sosa", meta: "Card limit request", value: "Urgent", icon: "support_agent" }, { label: "Luis Vera", meta: "Receipt missing", value: "New", icon: "support_agent" }, { label: "Iris Mora", meta: "Route exception", value: "Review", icon: "support_agent" }] }) })}
      ${templateModuleSurface({ title: "Active support thread", detail: "Message and composer components stay inside the Agent Conversation pattern boundary.", status: "Live", pattern: "Agent Conversation", body: html`${packageDemo("chat-message", { author: "customer", label: "Ana Sosa", message: "My fuel card was declined at Station 24.", meta: "2 min ago" })}${packageDemo("chat-message", { author: "agent", label: "Support", message: "I can see the station requires a policy override.", meta: "Now" })}${packageDemo("chat-composer", { label: "Reply", placeholder: "Write a governed support response" })}` })}
    </section>
  `);
}

function internalOperationsConsoleDesktopDemo(entry, blueprint) {
  const rows = [{ id: "price-01", item: "Station price exception", owner: "Pricing ops", state: "Review", age: "18 min" }, { id: "role-02", item: "Permission escalation", owner: "Security", state: "Blocked", age: "1 h" }, { id: "sync-03", item: "Provider sync delay", owner: "Integrations", state: "Open", age: "3 h" }];
  return templateShell(entry, blueprint, html`
    <div class="template-desktop-demo__filters" ${patternAttr("Advanced Filters")}>${packageDemo("select", { label: "Queue", value: "all", options: [{ label: "All queues", value: "all" }, { label: "Pricing", value: "pricing" }, { label: "Security", value: "security" }] })}${packageDemo("button", { label: "Apply filters", icon: "filter_alt" })}${packageDemo("button", { label: "Export", variant: "secondary", icon: "download" })}</div>
    <section class="template-desktop-demo__grid">
      ${templateModuleSurface({ title: "Operations queue", detail: "The console delegates filtering and table behavior to existing patterns.", status: "3 active", pattern: "Virtual Data Table", body: packageDemo("table", { label: "Operations queue", rows, columns: [{ key: "item", label: "Item" }, { key: "owner", label: "Owner" }, { key: "state", label: "State" }, { key: "age", label: "Age" }] }) })}
      ${templateModuleSurface({ title: "Review drawer preview", detail: "Editors and recovery states must remain in Drawer Adapter and Status Feedback View.", status: "Selected", pattern: "Drawer Adapter", body: html`${packageDemo("drawer", { label: "Station price exception", description: "Review provider variance before publishing.", open: true })}${packageDemo("error-panel", { label: "Provider evidence stale", description: "Refresh evidence before approving.", state: "warning", actionLabel: "Refresh" })}` })}
    </section>
  `);
}

function settingsWorkspaceDesktopDemo(entry, blueprint) {
  return templateShell(entry, blueprint, html`
    <section class="template-desktop-demo__grid">
      ${templateModuleSurface({ title: "Preference groups", detail: "Settings Workspace consumes Preference Management instead of owning local settings rows.", status: "Unsaved", pattern: "Preference Management", body: html`${packageDemo("switch", { label: "Fuel alerts", description: "Notify managers when spend exceeds policy.", checked: true })}${packageDemo("switch", { label: "Weekly digest", description: "Send fleet summary every Monday.", checked: false })}${packageDemo("inline-validation", { label: "Preferences", message: "Unsaved changes affect the whole workspace.", state: "warning" })}` })}
      ${templateModuleSurface({ title: "Access and audit", detail: "Role review and audit event evidence remain separate governed patterns.", status: "Governed", pattern: "Roles and Permissions", body: html`${packageDemo("badge", { label: "Admin only", tone: "warning", variant: "standard" })}${packageDemo("audit-event", { label: "Preference changed", description: "Fuel alerts enabled for North fleet.", meta: "Today 09:42 - Admin", status: "Logged", icon: "manage_history" })}${packageDemo("button", { label: "Review roles", icon: "admin_panel_settings" })}` })}
    </section>
  `);
}
