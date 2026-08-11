import { html } from "./detail-tabs-core.js?v=5";
import { componentDemo } from "./component-demo.js?v=60";

function packageDemo(component, demo = {}, attrs = {}) {
  const markup = componentDemo(component, demo);
  if (!markup) return "";
  const attrText = Object.entries({ "data-pattern-component": component, ...attrs })
    .map(([key, value]) => value === "" ? key : `${key}="${String(value).replace(/"/g, "&quot;")}"`)
    .join(" ");
  return markup.replace(/^<([a-z0-9-]+)/i, `<$1 ${attrText}`);
}

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function patternReactDemo(pattern, props, state = "default", variant = "standard", fullWidth = true) {
  return `<div class="docs-react-island docs-pattern-demo" data-react-component="${pattern}" data-component-source="react-pattern" data-doc-pattern="${pattern}" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}

export function utilityPatternOverviewDemo(patternId) {
  if (patternId === "checkbox-group") return checkboxGroupDemoPanel();
  if (patternId === "radio-group") return radioGroupDemoPanel();
  if (patternId === "gantt-chart") return ganttChartDemoPanel();
  if (patternId === "waterfall-chart") return waterfallChartDemoPanel();
  if (patternId === "polar-chart") return polarChartDemoPanel();
  if (patternId === "preference-management") return preferenceManagementDemoPanel();
  if (patternId === "snackbar-provider") return snackbarProviderDemoPanel();
  if (patternId === "timeline") return timelineDemoPanel();
  if (patternId === "section-header") return sectionHeaderDemoPanel();
  if (patternId === "pull-to-refresh") return pullToRefreshDemoPanel();
  if (patternId === "avatar-group") return avatarGroupDemoPanel();
  if (patternId === "transfer-list") return transferListDemoPanel();
  if (patternId === "drag-sortable-list") return dragSortableListDemoPanel();
  if (patternId === "calendar-view") return calendarViewDemoPanel();
  return "";
}

function checkboxGroupDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">React pattern demo</span>
      <h2>Policy scope selection</h2>
      ${patternReactDemo("checkbox-group", {
        label: "Apply policy to",
        helper: "Surface owns the group boundary; Checkbox owns each binary option.",
        density: "md",
        selectAllLabel: "Select all active scopes",
        clearLabel: "Clear",
        applyAction: { label: "Apply scope", icon: "rule" },
        defaultValue: ["fuel", "cards"],
        options: [
          { label: "Fuel limits", value: "fuel", description: "Monthly spend, station rules, and exceptions.", variant: "descriptive" },
          { label: "Card controls", value: "cards", description: "Freeze, replace, and approval routing.", variant: "descriptive" },
          { label: "Driver onboarding", value: "drivers", description: "Identity, documents, and verification steps.", variant: "descriptive" },
          { label: "Finance export", value: "finance", description: "Restricted by permission review.", disabled: true, variant: "descriptive" },
        ],
        validation: { label: "Policy scope", message: "At least one active scope is required before saving.", state: "warning" },
        "data-pattern-demo": "checkbox-group",
      })}
    </section>
  `;
}

function radioGroupDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">React pattern demo</span>
      <h2>Approval routing choice</h2>
      ${patternReactDemo("radio-group", {
        label: "Route high-risk changes to",
        helper: "Radio Group owns one decision; Radio Button owns each choice.",
        density: "md",
        name: "docs-approval-routing",
        defaultValue: "owner",
        clearLabel: "Clear",
        applyAction: { label: "Save route", icon: "approval" },
        options: [
          { label: "Workspace owner", value: "owner", description: "Fastest route for low-risk operations.", variant: "descriptive" },
          { label: "Finance reviewer", value: "finance", description: "Required for export, card limits, and billing changes.", variant: "descriptive" },
          { label: "Security admin", value: "security", description: "Required for permission and access changes.", variant: "critical" },
        ],
        validation: { label: "Approval route", message: "Pick one route before publishing the change.", state: "warning" },
        "data-pattern-demo": "radio-group",
      })}
    </section>
  `;
}

function ganttChartDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">React pattern demo</span>
      <h2>Rollout schedule</h2>
      ${patternReactDemo("gantt-chart", {
        label: "Fleet migration rollout",
        description: "Tasks, milestones, dependencies, chart summary, and table evidence share one chart wrapper boundary.",
        selectedTaskKey: "pilot",
        metrics: [
          { label: "4 tasks", tone: "neutral" },
          { label: "2 dependencies", tone: "info" },
        ],
        tasks: [
          { key: "audit", label: "Policy audit", owner: "Operations", start: "2026-08-12", end: "2026-08-15", progress: 90, status: "Ready" },
          { key: "pilot", label: "North fleet pilot", owner: "Fleet admin", start: "2026-08-16", end: "2026-08-23", progress: 48, status: "Active" },
          { key: "finance", label: "Finance review", owner: "Finance", start: "2026-08-24", end: "2026-08-28", progress: 15, status: "Queued" },
          { key: "rollout", label: "Full rollout", owner: "Program", start: "2026-08-29", end: "2026-09-05", progress: 0, status: "Blocked" },
        ],
        milestones: [
          { key: "pilot-close", label: "Pilot close", date: "2026-08-23" },
          { key: "launch", label: "Launch review", date: "2026-09-05" },
        ],
        dependencies: [
          { from: "audit", to: "pilot" },
          { from: "finance", to: "rollout" },
        ],
        primaryAction: { label: "Review schedule", icon: "calendar_month" },
        "data-pattern-demo": "gantt-chart",
      })}
    </section>
  `;
}

function waterfallChartDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">React pattern demo</span>
      <h2>Spend bridge</h2>
      ${patternReactDemo("waterfall-chart", {
        label: "Monthly spend bridge",
        description: "Variance analysis keeps deltas, totals, summary badges, and table rows in one chart pattern.",
        selectedStepKey: "fuel",
        metrics: [
          { label: "$1.8M total", tone: "info" },
          { label: "+7% variance", tone: "warning" },
        ],
        steps: [
          { key: "base", label: "Base spend", value: 1280, formattedValue: "$1.28M", kind: "total", direction: "total", note: "Previous month baseline" },
          { key: "fuel", label: "Fuel increase", value: 240, formattedValue: "+$240k", direction: "increase", note: "Station and volume changes" },
          { key: "maintenance", label: "Maintenance savings", value: -80, formattedValue: "-$80k", direction: "decrease", note: "Recovered warranty work" },
          { key: "total", label: "Current spend", value: 1440, formattedValue: "$1.44M", kind: "total", direction: "total", note: "Current month" },
        ],
        primaryAction: { label: "Export bridge", icon: "download" },
        "data-pattern-demo": "waterfall-chart",
      })}
    </section>
  `;
}

function polarChartDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">React pattern demo</span>
      <h2>Fleet mix by risk</h2>
      ${patternReactDemo("polar-chart", {
        label: "Risk distribution",
        description: "Segment summaries, table evidence, and recovery states stay inside the chart pattern.",
        selectedSegmentKey: "review",
        metrics: [
          { label: "128 vehicles", tone: "neutral" },
          { label: "14 need review", tone: "warning" },
        ],
        segments: [
          { key: "active", label: "Active", value: 92, formattedValue: "92", share: "72%", status: "Healthy" },
          { key: "review", label: "Needs review", value: 24, formattedValue: "24", share: "19%", status: "Review" },
          { key: "blocked", label: "Blocked", value: 12, formattedValue: "12", share: "9%", status: "Blocked" },
        ],
        primaryAction: { label: "Inspect segment", icon: "pie_chart" },
        "data-pattern-demo": "polar-chart",
      })}
    </section>
  `;
}

function preferenceManagementDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">React pattern demo</span>
      <h2>Workspace preferences</h2>
      ${patternReactDemo("preference-management", {
        label: "Workspace preferences",
        description: "Preference Management composes Settings, Form Section, and Confirmation Dialog without owning local controls.",
        state: "dirty",
        dirty: true,
        summary: { label: "Unsaved", tone: "warning" },
        settings: {
          label: "Notification preferences",
          description: "Immediate controls announce state while the pattern owns save and reset.",
          dirty: true,
          groups: [
            {
              title: "Alerts",
              controls: [
                { key: "fuel-alerts", kind: "switch", label: "Fuel alerts", description: "Notify managers when spend exceeds policy.", checked: true },
                { key: "weekly-summary", kind: "switch", label: "Weekly summary", description: "Send a Monday digest to fleet owners.", checked: false },
              ],
            },
          ],
          saveAction: { label: "Save preferences", icon: "save" },
          resetAction: { label: "Reset", variant: "secondary" },
        },
        sections: [
          {
            key: "owner-copy",
            title: "Owner message",
            description: "A Form Section keeps local copy and validation bounded.",
            fields: [
              { key: "title", label: "Message title", value: "Policy update" },
              { key: "detail", label: "Message detail", value: "Explain what changed for operators.", kind: "text-area" },
            ],
            secondaryAction: { key: "preview", label: "Preview", variant: "secondary" },
          },
        ],
        dangerZone: {
          label: "Archive preferences",
          description: "Archiving requires confirmation and creates an audit event.",
          triggerLabel: "Archive preferences",
          confirm: { label: "Archive" },
          cancel: { label: "Cancel", variant: "secondary" },
          destructive: true,
        },
        "data-pattern-demo": "preference-management",
      })}
    </section>
  `;
}

function snackbarProviderDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">Interactive demo</span>
      <h2>Shared feedback queue</h2>
      ${patternReactDemo("snackbar-provider", {
        label: "Shared feedback queue",
        density: "md",
        maxVisible: 2,
        action: { label: "Queue feedback", icon: "add_alert" },
        "data-pattern-demo": "snackbar-provider",
      })}
    </section>
  `;
}

function timelineDemoPanel() {
  const events = [
    {
      key: "fuel-limit",
      label: "Fuel limit changed",
      description: "Ana Sosa updated JMX-214-B policy.",
      meta: "Today 09:42 - Operations",
      status: "logged",
      statusLabel: "Logged",
      icon: "manage_history",
    },
    {
      key: "sync-warning",
      label: "Sync warning",
      description: "Vehicle KLD-901-C needs document refresh.",
      meta: "Today 08:10 - System",
      status: "warning",
      statusLabel: "Warning",
      icon: "warning",
    },
    {
      key: "route-completed",
      label: "Route completed",
      description: "Station 24 route closed with receipt attached.",
      meta: "Yesterday 18:22 - Driver",
      status: "success",
      statusLabel: "Verified",
      icon: "route",
    },
  ];
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">Interactive demo</span>
      <h2>Fleet activity timeline</h2>
      ${patternReactDemo("timeline", {
        label: "Fleet activity timeline",
        description: "Filter operational events without creating a second timeline structure in Docs.",
        className: "pattern-timeline-demo pattern-utility-demo",
        density: "md",
        events,
        "data-timeline-demo": "react",
      })}
    </section>
  `;
}

function sectionHeaderDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">Interactive demo</span>
      <h2>Dense section entry</h2>
      <div class="pattern-section-header-demo pattern-utility-demo" data-section-header-demo>
        <header class="pattern-section-header-demo__header">
          <div>
            <span class="eyebrow">Dashboard module</span>
            <h3>Fleet exceptions</h3>
            <p>Review vehicles and cards that need attention before the next sync.</p>
          </div>
          <div class="pattern-section-header-demo__meta">
            ${packageDemo("badge", { label: "9 open", tone: "warning", variant: "standard" })}
            ${packageDemo("button", { label: "Export", variant: "secondary", icon: "download" })}
            ${packageDemo("button", { label: "Review", icon: "fact_check" })}
          </div>
        </header>
      </div>
    </section>
  `;
}

function pullToRefreshDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><span class="eyebrow">Interactive demo</span><h2>Refreshable movement feed</h2>
      ${patternReactDemo("pull-to-refresh", {
        label: "Refreshable movement feed",
        description: "Recent movements update without replacing the governed feed surface.",
        density: "md",
        fallbackAction: { label: "Refresh feed", icon: "refresh" },
        list: { label: "Recent movements", items: [{ label: "Fuel purchase", meta: "Station 24 - Today", value: "$842", icon: "local_gas_station" }, { label: "Receipt synced", meta: "Route 18 - Yesterday", value: "Done", icon: "receipt_long" }] },
        "data-pattern-demo": "pull-to-refresh",
      })}
    </section>`;
}

function avatarGroupDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><span class="eyebrow">Interactive demo</span><h2>Accountable team group</h2>
      ${patternReactDemo("avatar-group", {
        label: "Accountable team group",
        density: "md",
        maxVisible: 3,
        identities: [
          { key: "ana", name: "Ana Sosa", status: "online", meta: "Owner" },
          { key: "luis", name: "Luis Vera", status: "away", meta: "Approver" },
          { key: "iris", name: "Iris Mora", status: "none", meta: "Reviewer" },
          { key: "private", name: "4 hidden members", status: "none", meta: "Permission limited", permissionBlocked: true },
        ],
        overflow: { triggerLabel: "Show team", title: "Team members", description: "People with accountability in this workflow.", listLabel: "Hidden team members" },
        action: { label: "Review team", icon: "groups" },
        "data-pattern-demo": "avatar-group",
      })}
    </section>`;
}

function transferListDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><span class="eyebrow">Interactive demo</span><h2>Assign vehicles to policy</h2>
      ${patternReactDemo("transfer-list", {
        label: "Assign vehicles to policy",
        density: "md",
        sourceLabel: "Available vehicles",
        targetLabel: "Selected vehicles",
        filterInput: { label: "Search available", placeholder: "Vehicle or driver" },
        source: [
          { key: "jmx", label: "JMX-214-B", meta: "Ana Sosa", valueLabel: "Move", icon: "directions_car" },
          { key: "kld", label: "KLD-901-C", meta: "Luis Vera", valueLabel: "Move", icon: "directions_car" },
        ],
        validation: { label: "Policy assignment", message: "Move at least one vehicle into the policy before saving.", state: "info" },
        moveToTargetAction: { label: "Move selected", icon: "arrow_forward" },
        moveToSourceAction: { label: "Move back", icon: "arrow_back" },
        "data-pattern-demo": "transfer-list",
      })}
    </section>`;
}

function dragSortableListDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><span class="eyebrow">Interactive demo</span><h2>Dashboard module order</h2>
      ${patternReactDemo("drag-sortable-list", {
        label: "Dashboard order",
        density: "md",
        motionBoundary: { label: "Dashboard order", state: "ready" },
        items: [
          { key: "spend", label: "Spend overview", description: "Revenue and fuel deltas", icon: "dashboard" },
          { key: "exceptions", label: "Exceptions", description: "Open operational issues", icon: "report" },
          { key: "maintenance", label: "Maintenance", description: "Upcoming service windows", icon: "build" },
        ],
        saveAction: { label: "Save order", icon: "save" },
        undoAction: { label: "Undo move", icon: "undo" },
        resetAction: { label: "Reset order", icon: "restart_alt" },
        "data-pattern-demo": "drag-sortable-list",
      })}
    </section>`;
}

function calendarViewDemoPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-utility-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><span class="eyebrow">Interactive demo</span><h2>Maintenance calendar</h2>
      ${patternReactDemo("calendar-view", {
        label: "Maintenance calendar",
        density: "md", selectedDate: "2026-07-18", timezoneLabel: "America/Mexico_City",
        dateControl: { label: "Selected range", value: { from: "2026-07-18", to: "2026-07-18" } },
        events: [{ key: "brake", label: "Brake inspection", description: "JMX-214-B · 09:00", time: "09:00", owner: "Ana Sosa", icon: "event", status: "warning", statusLabel: "Due" }, { key: "policy", label: "Policy renewal", description: "Fleet North · 14:00", time: "14:00", owner: "Luis Vera", icon: "event_available", status: "success", statusLabel: "Review" }],
        detail: { triggerLabel: "Review schedule", placement: "bottom" }, "data-pattern-demo": "calendar-view",
      })}
    </section>`;
}
