import { html } from "./detail-tabs-core.js?v=5";

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function patternReactDemo(pattern, props, state = "default", variant = "standard", fullWidth = true) {
  return `<div class="docs-react-island docs-pattern-demo" data-react-component="${pattern}" data-component-source="react-pattern" data-doc-pattern="${pattern}" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}

export function shellPatternOverviewDemo(patternId) {
  if (patternId === "topbar") return topbarDemoPanel();
  if (patternId === "sidebar") return sidebarDemoPanel();
  if (patternId === "section-header") return sectionHeaderDemoPanel();
  if (patternId === "settings") return settingsReactDemoPanel();
  return "";
}

function topbarDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-topbar-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">Interactive demo</span>
      <h2>Product shell topbar</h2>
      ${patternReactDemo("topbar", {
        label: "Fleet operations shell",
        density: "md",
        search: {
          label: "Search operations",
          triggerLabel: "Search fleet",
          placeholder: "Search vehicles, stations, cases...",
          query: "",
          delegate: {
            label: "Search results",
            query: "",
            results: [
              { key: "vehicle", label: "JMX-214-B", meta: "Ana Sosa - active" },
              { key: "station", label: "Station 24", meta: "Policy exception" },
            ],
          },
        },
        notifications: {
          label: "Notifications",
          open: false,
          notifications: [
            { key: "approval", label: "Approval pending", description: "2 min ago", unread: true },
            { key: "sync", label: "Sync issue", description: "Cards service", unread: true },
          ],
        },
        account: {
          name: "Fleet Ops",
          status: "online",
          triggerLabel: "Open Fleet Ops menu",
          items: [
            { key: "profile", label: "Profile" },
            { key: "settings", label: "Settings" },
            { key: "sign-out", label: "Sign out" },
          ],
        },
        actions: [
          { key: "language", label: "Switch language", icon: "language" },
          { key: "grid", label: "Show grid", icon: "grid_on" },
        ],
        sidebar: {
          label: "Fleet navigation",
          drawerOpen: false,
          groups: [
            { key: "workspace", title: "Workspace", open: true, routes: [{ key: "overview", label: "Overview", icon: "dashboard", active: true }, { key: "vehicles", label: "Vehicles", icon: "directions_car" }] },
          ],
        },
        "data-pattern-demo": "topbar",
      })}
    </section>
  `;
}

function sidebarDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-sidebar-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">Interactive demo</span>
      <h2>Workspace sidebar</h2>
      ${patternReactDemo("sidebar", {
        label: "Fleet navigation",
        density: "md",
        activeKey: "overview",
        breadcrumbs: [{ label: "Fleet", href: "#/templates/fleet-manager-desktop" }, { label: "Overview" }],
        groups: [
          {
            key: "workspace",
            title: "Workspace",
            icon: "dashboard",
            badge: "4",
            open: true,
            routes: [
              { key: "overview", label: "Overview", icon: "dashboard", active: true },
              { key: "exceptions", label: "Exceptions", icon: "report", badge: "3", badgeTone: "warning" },
              { key: "vehicles", label: "Vehicles", icon: "directions_car" },
            ],
          },
          {
            key: "admin",
            title: "Administration",
            icon: "admin_panel_settings",
            open: true,
            routes: [
              { key: "roles", label: "Roles", icon: "group" },
              { key: "audit", label: "Audit log", icon: "manage_history" },
            ],
          },
        ],
        drawer: { label: "Fleet navigation drawer", side: "left" },
        "data-pattern-demo": "sidebar",
      })}
    </section>
  `;
}

function sectionHeaderDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-section-header-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">Interactive demo</span>
      <h2>Operational section header</h2>
      ${patternReactDemo("section-header", {
        title: "Vehicle exceptions",
        description: "Review high-risk fuel, document, and route exceptions before dispatch.",
        headingLevel: 3,
        density: "md",
        dirty: true,
        badge: { label: "3 open", tone: "warning", variant: "status" },
        tag: { label: "Ops", tone: "info" },
        actions: [
          { key: "assign", label: "Assign owner", icon: "person_add", variant: "secondary" },
          { key: "resolve", label: "Resolve selected", icon: "check_circle", variant: "primary" },
        ],
        overflow: {
          triggerLabel: "More exception actions",
          label: "Exception actions",
          items: [
            { key: "export", label: "Export" },
            { key: "subscribe", label: "Subscribe" },
          ],
        },
        toolbar: {
          label: "Exception tools",
          search: { label: "Search exceptions", query: "", input: { label: "Search exceptions", placeholder: "Plate, driver, issue" } },
          actions: [{ key: "filter", label: "Filter", icon: "filter_alt", variant: "secondary" }],
        },
        "data-pattern-demo": "section-header",
      })}
    </section>
  `;
}

function settingsReactDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-settings-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">Interactive demo</span>
      <h2>Workspace settings</h2>
      ${patternReactDemo("settings", {
        label: "Workspace settings",
        description: "Preference changes remain auditable and permission-aware.",
        density: "md",
        dirty: true,
        summary: { title: "Fleet preferences", value: "4 controls", detail: "Shared by dispatch and support", status: "Unsaved" },
        groups: [
          {
            key: "notifications",
            title: "Notifications",
            description: "Operational alert preferences",
            controls: [
              { key: "fuel-alerts", kind: "switch", label: "Fuel alerts", description: "Notify managers when fuel spend exceeds policy.", checked: true },
              { key: "weekly-digest", kind: "switch", label: "Weekly digest", description: "Send a weekly operations summary.", checked: false },
            ],
          },
          {
            key: "scope",
            title: "Scope",
            description: "Default operational context",
            controls: [
              { key: "region", kind: "select", label: "Default region", value: "north", options: [{ label: "North", value: "north" }, { label: "Central", value: "central" }] },
              { key: "owner", kind: "input", label: "Policy owner", value: "Fleet ops", description: "Shown in audit events." },
            ],
          },
        ],
        validation: { message: "Unsaved changes affect the whole workspace.", description: "Save or reset before leaving.", state: "warning" },
        saveAction: { label: "Save changes", icon: "save" },
        resetAction: { label: "Reset", variant: "secondary", icon: "restart_alt" },
        "data-pattern-demo": "settings",
      })}
    </section>
  `;
}
