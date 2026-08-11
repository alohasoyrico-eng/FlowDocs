import { html } from "./detail-tabs-core.js?v=3";

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function templateReactDemo(template, props, state = "loaded", variant = "standard") {
  return `<div class="docs-react-island docs-template-demo" data-react-component="${template}" data-component-source="react-template" data-doc-template="${template}" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="true" data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}

const templateData = {
  "fleet-manager-desktop": {
    component: "fleet-manager-desktop",
    props: {
      label: "Fleet manager desktop",
      description: "Executive fleet workspace with shell, navigation, KPI band, exceptions, permissions, timeline, and filters delegated to Flow.",
      density: "sm",
      state: "loaded",
      selectedDashboard: "overview",
      metrics: [
        { key: "health", label: "Fleet health", value: "93%", detail: "18 open exceptions", tone: "info" },
        { key: "fuel", label: "Fuel spend", value: "$84.2k", detail: "+12% vs last week", tone: "warning" },
        { key: "ready", label: "Vehicles ready", value: "128", detail: "4 need review", tone: "success" },
      ],
      exceptions: [
        { key: "fuel-limit", label: "Fuel limit spike", owner: "Ana Sosa", severity: "High", age: "18 min" },
        { key: "docs", label: "Vehicle docs expired", owner: "Luis Vera", severity: "Review", age: "2 h" },
      ],
      rolesAndPermissions: {
        label: "Fleet scope permissions",
        roles: [{ key: "manager", label: "Fleet manager" }, { key: "finance", label: "Finance reviewer" }],
        permissions: [{ key: "export", label: "Export dashboard" }, { key: "approve", label: "Approve exception" }],
        values: { manager: ["export", "approve"], finance: ["export"] },
      },
      "data-template-demo": "fleet-manager-desktop",
    },
  },
  "fleet-dashboard-suite": {
    component: "fleet-dashboard-suite",
    props: {
      label: "Fleet dashboard suite",
      description: "Dashboard switcher, shared filters, KPI stack, chart summary, and drill-down evidence are one template boundary.",
      density: "sm",
      state: "loaded",
      selectedDashboard: "fuel",
      filters: [{ key: "period", label: "Period", value: "Week" }, { key: "segment", label: "Segment", value: "All" }],
      kpis: [
        { key: "spend", label: "Monthly spend", value: "$1.8M", threshold: "Budget", trend: "+7%" },
        { key: "thresholds", label: "Thresholds", value: "14", threshold: "3 high", trend: "Review" },
      ],
      drillDownRows: [
        { key: "north", domain: "North", owner: "Finance", threshold: "$84.2k", evidence: "Fuel trend" },
        { key: "ev", domain: "EV", owner: "Ops", threshold: "72%", evidence: "Charging use" },
      ],
      financeVisible: true,
      "data-template-demo": "fleet-dashboard-suite",
    },
  },
  "configuration-console": {
    component: "configuration-console",
    props: {
      label: "Configuration console",
      description: "Permission matrix, driver lifecycle, vehicle lifecycle, audit trail, and authentication gate stay in Flow.",
      density: "sm",
      state: "loaded",
      selectedModule: "permissions",
      rolesAndPermissions: {
        label: "Admin roles",
        roles: [{ key: "admin", label: "Admin" }, { key: "viewer", label: "Audit viewer" }],
        permissions: [{ key: "write", label: "Write config" }, { key: "audit", label: "View audit" }],
        values: { admin: ["write", "audit"], viewer: ["audit"] },
      },
      driverAdministration: { label: "Driver lifecycle", selectedKey: "ana", records: [{ id: "ana", driver: "Ana Sosa", plate: "JMX-214-B", status: "Active" }] },
      vehicleAdministration: { label: "Vehicle lifecycle", selectedKey: "jmx", records: [{ id: "jmx", driver: "Ana Sosa", plate: "JMX-214-B", status: "Active" }] },
      authentication: { label: "Authentication gate", state: "otp-sent", otp: { label: "OTP", value: "184290" } },
      "data-template-demo": "configuration-console",
    },
  },
  "driver-mobile-app": {
    component: "driver-mobile-app",
    props: {
      label: "Driver mobile app",
      description: "Mobile shell, driver readiness, station discovery, movement feed, and support path are governed by React.",
      density: "sm",
      state: "loaded",
      selectedTab: "routes",
      card: { status: "Active", available: "$2,160", limit: "$8,400", detail: "JMX-214-B" },
      movements: [{ key: "fuel", label: "Fuel purchase", amount: "$842", status: "Synced" }, { key: "receipt", label: "Receipt upload", amount: "Done", status: "Ready" }],
      "data-template-demo": "driver-mobile-app",
    },
  },
  "driver-card-wallet": {
    component: "driver-card-wallet",
    props: {
      label: "Driver card wallet",
      description: "Wallet navigation, card summary, quick actions, movement receipt, and dispute entry point are one template.",
      density: "sm",
      state: "loaded",
      selectedSection: "card",
      card: { label: "Edenred Fleet", meta: "Ana Sosa", number: "**** 2148", available: "$2,160", limit: "$8,400", status: "Active" },
      actions: [{ key: "freeze", label: "Freeze card", icon: "block", intent: "danger" }, { key: "receipt", label: "Upload receipt", icon: "receipt_long" }],
      movements: [{ key: "fuel", label: "Fuel purchase", meta: "Station 24", value: "$842", icon: "local_gas_station" }],
      "data-template-demo": "driver-card-wallet",
    },
  },
  "routes-and-stations": {
    component: "routes-and-stations",
    props: {
      label: "Routes and stations",
      description: "Discovery region, map pins, station fallback, services, and route handoff are one mobile template.",
      density: "sm",
      state: "loaded",
      selectedStationKey: "station-24",
      stations: [
        { key: "station-24", label: "Station 24", value: "$24.10", distance: "2.1 km", status: "Open", selected: true },
        { key: "station-18", label: "Station 18", value: "$24.80", distance: "4.8 km", status: "Review" },
      ],
      route: { label: "Route to Station 24", eta: "12 min", distance: "2.1 km", actions: [{ key: "navigate", label: "Navigate", icon: "near_me" }] },
      "data-template-demo": "routes-and-stations",
    },
  },
  "agent-workspace": {
    component: "agent-workspace",
    props: {
      label: "Agent workspace",
      description: "Conversation queue, active thread, composer, context, handoff, and recovery feedback stay in Flow.",
      density: "sm",
      state: "handoff",
      handoff: true,
      selectedConversation: "handoff",
      conversations: [{ key: "handoff", label: "Ana Sosa", meta: "Card limit request", unread: 2, tone: "warning" }, { key: "receipt", label: "Luis Vera", meta: "Receipt missing", unread: 1 }],
      thread: { label: "Support thread", messages: [{ key: "customer", author: "customer", label: "Ana Sosa", message: "My card was declined.", meta: "2 min ago" }] },
      composer: { label: "Reply", value: "I can request the override now.", sendLabel: "Send" },
      feedback: { kind: "inline", label: "Handoff available", message: "Finance can review the policy exception.", state: "warning" },
      "data-template-demo": "agent-workspace",
    },
  },
  "internal-operations-console": {
    component: "internal-operations-console",
    props: {
      label: "Internal operations console",
      description: "Cases, tickets, accounts, pricing, approvals, and growth queues exercise the full pattern cascade.",
      density: "sm",
      state: "loaded",
      selectedModule: "cases",
      cases: { state: "detail-open", selectedCaseKey: "case-1", detailOpen: true },
      tickets: { state: "ticket-selected", selectedTicketKey: "ticket-1" },
      accounts: { state: "account-selected", selectedAccountKey: "account-1" },
      pricing: { state: "pending-approval", selectedRuleKey: "rule-1" },
      backoffice: { state: "pending-review", selectedDocumentKey: "doc-1" },
      "data-template-demo": "internal-operations-console",
    },
  },
  "settings-workspace": {
    component: "settings-workspace",
    props: {
      label: "Settings workspace",
      description: "Section tabs, preference management, dirty state, save flow, and danger confirmation are template owned.",
      density: "sm",
      state: "dirty",
      dirty: true,
      selectedSection: "notifications",
      preferences: {
        label: "Notification preferences",
        groups: [{ key: "alerts", label: "Alerts", preferences: [{ key: "fuel", label: "Fuel alerts", enabled: true }, { key: "digest", label: "Weekly digest", enabled: false }] }],
      },
      "data-template-demo": "settings-workspace",
    },
  },
};

export function reactTemplateDemo(entry) {
  const demo = templateData[entry.id];
  if (!demo) return "";
  return html`
    <section class="doc-panel wide template-desktop-panel">
      <div class="template-desktop-panel__header">
        <div>
          <span class="eyebrow">Product demo</span>
          <h2>${entry.title}</h2>
        </div>
      </div>
      ${templateReactDemo(demo.component, demo.props, demo.props.state ?? "loaded")}
    </section>
  `;
}
