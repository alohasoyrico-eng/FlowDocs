import { html } from "./detail-tabs-core.js?v=3";
import { patternPackageDemo as packageDemo } from "./search-slot.js?v=2";
import { shellPatternOverviewDemo } from "./pattern-shell-react-demos.js?v=1";

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function patternReactDemo(pattern, props, state = "default", variant = "standard", fullWidth = true) {
  return `<div class="docs-react-island docs-pattern-demo" data-react-component="${pattern}" data-component-source="react-pattern" data-doc-pattern="${pattern}" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}

function bottomSheetPatternDemo({
  label = "Mobile sheet",
  description = "",
  items = [],
  state = "open",
  actions = [],
} = {}, attrs = {}) {
  const attrText = Object.entries(attrs)
    .map(([key, value]) => value === "" ? key : `${key}="${String(value).replace(/"/g, "&quot;")}"`)
    .join(" ");
  return html`
    <section class="bottom-sheet-demo" data-pattern-sheet="bottom-sheet" data-state="${state}" ${attrText}>
      <div class="bottom-sheet-demo__scrim">
        <div class="bottom-sheet-demo__panel" role="dialog" aria-modal="true" aria-label="${label}">
          <span class="bottom-sheet-demo__handle" aria-hidden="true"></span>
          <header>
            <div>
              <strong>${label}</strong>
              ${description ? `<p>${description}</p>` : ""}
            </div>
          </header>
          <div class="bottom-sheet-demo__body">
            ${items.map((item) => `<span>${typeof item === "string" ? item : item.label}</span>`).join("")}
          </div>
          ${actions.length ? `<footer>${actions.map((action) => packageDemo("button", action)).join("")}</footer>` : ""}
        </div>
      </div>
    </section>
  `;
}

export function candidatePatternOverviewDemo(patternId) {
  const shellDemo = shellPatternOverviewDemo(patternId);
  if (shellDemo) return shellDemo;
  if (patternId === "command-palette") return commandPaletteDemoPanel();
  if (patternId === "notification-panel") return notificationPanelDemoPanel();
  if (patternId === "avatar-menu") return avatarMenuDemoPanel();
  if (patternId === "confirmation-dialog") return confirmationDialogDemoPanel();
  if (patternId === "action-sheet") return actionSheetDemoPanel();
  if (patternId === "search") return searchDemoPanel();
  if (patternId === "autocomplete") return autocompleteDemoPanel();
  if (patternId === "select-option-layer") return selectOptionLayerDemoPanel();
  if (patternId === "multi-select") return multiSelectDemoPanel();
  if (patternId === "form-section") return formSectionDemoPanel();
  if (patternId === "toolbar") return toolbarDemoPanel();
  if (patternId === "filter-chip-group") return filterChipGroupDemoPanel();
  if (patternId === "file-upload") return fileUploadDemoPanel();
  return "";
}

function commandPaletteDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-command-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Command palette</h2>
      ${patternReactDemo("command-palette", {
        label: "Command palette",
        description: "Search routes, actions, entities, and help topics.",
        triggerLabel: "Open command palette",
        placeholder: "Type route, action, or help",
        density: "md",
        commands: [
          { key: "fleet", label: "Open fleet dashboard", group: "Navigation", icon: "dashboard", shortcut: "G F", reason: "dashboard fleet overview" },
          { key: "freeze", label: "Freeze selected card", group: "Action", icon: "block", shortcut: "F", reason: "card security block" },
          { key: "support", label: "Contact support", group: "Help", icon: "support_agent", shortcut: "?", reason: "help support ticket" },
        ],
        empty: { title: "No commands found", description: "Try a route, entity, or action keyword.", icon: "search_off" },
        "data-pattern-demo": "command-palette",
      })}
    </section>
  `;
}

function notificationPanelDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-notification-demo-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Notification panel</h2>
      ${patternReactDemo("notification-panel", {
        label: "Notifications",
        description: "Operational alerts that need review.",
        density: "md",
        notifications: [
          { key: "approval", label: "Approval pending", description: "Fleet ops · 2 min", unread: true },
          { key: "sync", label: "Sync issue", description: "Cards service · 12 min", unread: true },
          { key: "fuel", label: "Fuel alert", description: "Station 24 · Today", unread: true },
        ],
        markAllAction: { label: "Mark all read", icon: "done_all" },
        empty: { title: "All clear", description: "No notifications need attention.", icon: "notifications_none" },
        "data-pattern-demo": "notification-panel",
      })}
    </section>
  `;
}

function avatarMenuDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-avatar-menu-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Avatar menu</h2>
      ${patternReactDemo("avatar-menu", {
        name: "Ana Sosa",
        status: "online",
        triggerLabel: "Ana Sosa",
        density: "md",
        items: [
          { key: "profile", label: "Profile", icon: "account_circle" },
          { key: "settings", label: "Settings", icon: "settings" },
          "divider",
          { key: "sign-out", label: "Sign out", icon: "logout", tone: "danger" },
        ],
        "data-pattern-demo": "avatar-menu",
      })}
    </section>
  `;
}

function confirmationDialogDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-confirmation-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Destructive confirmation</h2>
      ${patternReactDemo("confirmation-dialog", {
        label: "Freeze JMX-214-B?",
        description: "The assigned driver cannot use this card until it is reactivated.",
        triggerLabel: "Freeze card",
        closeLabel: "Cancel",
        density: "md",
        destructive: true,
        confirm: { key: "confirm", label: "Freeze card", icon: "block" },
        cancel: { key: "cancel", label: "Cancel", variant: "secondary" },
        validation: { label: "Freeze card", message: "This action creates an audit event.", state: "warning" },
        "data-pattern-demo": "confirmation-dialog",
      })}
    </section>
  `;
}

function actionSheetDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-action-sheet-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Mobile action sheet</h2>
      ${patternReactDemo("action-sheet", {
        label: "JMX-214-B actions",
        description: "Choose a contextual action for this vehicle.",
        density: "md",
        dialog: { triggerLabel: "Vehicle actions", closeLabel: "Cancel", variant: "confirmation" },
        actions: [
          { key: "open", label: "Open detail", icon: "open_in_new", prominent: true },
          { key: "share", label: "Share route", icon: "ios_share" },
          { key: "freeze", label: "Freeze card", icon: "block", tone: "danger" },
        ],
        overflow: { triggerLabel: "More actions", label: "Vehicle actions" },
        cancelAction: { key: "cancel", label: "Cancel", variant: "secondary" },
        "data-pattern-demo": "action-sheet",
      })}
    </section>
  `;
}

function searchDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-search-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Scoped search</h2>
      ${patternReactDemo("search", {
        label: "Search fleet records",
        placeholder: "Search vehicle, driver, card, or station",
        density: "md",
        scopeValue: "all",
        scopes: [
          { label: "All entities", value: "all" },
          { label: "Vehicles", value: "vehicle" },
          { label: "Drivers", value: "driver" },
          { label: "Stations", value: "station" },
          { label: "Cards", value: "card" },
        ],
        results: [
          { key: "vehicle", scope: "vehicle", label: "JMX-214-B", meta: "Vehicle - Active card", valueLabel: "Open", icon: "directions_car", keywords: "vehicle card active jmx" },
          { key: "driver", scope: "driver", label: "Ana Sosa", meta: "Driver - Fleet operations", valueLabel: "Open", icon: "person", keywords: "driver ana fleet" },
          { key: "station", scope: "station", label: "Station 24", meta: "Station - Preferred fuel", valueLabel: "Open", icon: "local_gas_station", keywords: "station fuel preferred" },
          { key: "card", scope: "card", label: "Corporate card 4821", meta: "Card - Pending review", valueLabel: "Open", icon: "credit_card", keywords: "card payment corporate 4821" },
        ],
        empty: { title: "No records found", description: "Try a broader scope or another keyword.", icon: "search_off" },
        clearAction: { label: "Clear search", icon: "close" },
        "data-pattern-demo": "search",
      })}
    </section>
  `;
}

function autocompleteDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-autocomplete-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Entity autocomplete</h2>
      ${patternReactDemo("autocomplete", {
        label: "Assign vehicle or station",
        placeholder: "Start typing an entity",
        helper: "Choose a valid operational entity.",
        density: "md",
        suggestions: [
          { key: "jmx", value: "jmx", label: "JMX-214-B", meta: "Vehicle - Ana Sosa", keywords: "jmx vehicle ana" },
          { key: "kld", value: "kld", label: "KLD-901-C", meta: "Vehicle - Luis Vera", keywords: "kld vehicle luis" },
          { key: "station", value: "station", label: "Station 24", meta: "Preferred fuel station", keywords: "station fuel" },
        ],
        empty: { title: "No suggestions", description: "Check spelling or create a support request.", icon: "search_off" },
        "data-pattern-demo": "autocomplete",
      })}
    </section>
  `;
}

function selectOptionLayerDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-select-layer-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Permissioned option layer</h2>
      ${patternReactDemo("select-option-layer", {
        label: "Card policy",
        helper: "Unavailable policies stay visible with a reason.",
        value: "standard",
        density: "md",
        options: [
          { label: "Standard policy", value: "standard", reason: "Default card controls" },
          { label: "Fuel only", value: "fuel", reason: "Restricts spend to fuel stations" },
          { label: "International travel", value: "international", reason: "Requires finance approval", unavailable: true },
        ],
        action: { key: "review-approval", label: "Review approval", icon: "policy", variant: "secondary" },
        "data-pattern-demo": "select-option-layer",
      })}
    </section>
  `;
}

function multiSelectDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-multi-select-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Multi select filters</h2>
      ${patternReactDemo("multi-select", {
        label: "Fleet filters",
        helper: "Select up to two filters to preview the query.",
        placeholder: "Select filters",
        density: "md",
        maxVisibleChips: 2,
        maxSelected: 2,
        options: [
          { value: "north", label: "North region", meta: "12 vehicles" },
          { value: "central", label: "Central region", meta: "18 vehicles" },
          { value: "airport", label: "Airport stations", meta: "6 stations" },
        ],
        empty: { title: "No filters available", description: "Add filters from the toolbar to refine this view.", icon: "filter_alt_off" },
        clearAction: { label: "Clear filters", icon: "close", variant: "secondary" },
        "data-pattern-demo": "multi-select",
      })}
    </section>
  `;
}

function formSectionDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-form-section-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Editable form section</h2>
      ${patternReactDemo("form-section", {
        title: "Driver profile",
        description: "Update the operational details used by dispatch, compliance, and support.",
        density: "md",
        state: "idle",
        fields: [
          { key: "name", name: "driver-name", label: "Driver name", value: "Ana Sosa", required: true, icon: "person" },
          { key: "region", name: "driver-region", label: "Region", value: "North Region", helper: "Use an operational region name until Select fields are part of the pattern contract.", icon: "map" },
          { key: "authorization", name: "driver-authorization", label: "Authorization scope", value: "Fuel overrides with supervisor review", icon: "verified_user" },
          { key: "notes", name: "driver-notes", kind: "text-area", label: "Operational notes", value: "Authorized for city routes.", rows: 3 },
        ],
        primaryAction: { key: "save", label: "Save section", icon: "save" },
        secondaryAction: { key: "reset", label: "Reset", icon: "refresh", variant: "secondary" },
        "data-pattern-demo": "form-section",
      })}
    </section>
  `;
}

function toolbarDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-toolbar-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Table toolbar</h2>
      ${patternReactDemo("toolbar", {
        label: "Vehicle table actions",
        density: "md",
        search: {
          label: "Search vehicles",
          query: "",
          input: { label: "Search vehicles", placeholder: "Plate, driver, or region" },
          delegate: {
            label: "Search vehicles",
            query: "",
            results: [
              { key: "mx-4821", label: "MX-4821", meta: "Ana Sosa · North Region" },
              { key: "mx-9130", label: "MX-9130", meta: "City route" },
            ],
          },
        },
        filters: [
          { key: "region", label: "Region: North", selected: true },
          { key: "status", label: "Status: Active", selected: true },
        ],
        actions: [
          { key: "export", label: "Export", icon: "download", variant: "secondary" },
          { key: "add", label: "Add vehicle", icon: "add", variant: "primary" },
        ],
        overflow: {
          triggerLabel: "More actions",
          label: "Toolbar actions",
          items: [
            { key: "columns", label: "Columns" },
            { key: "saved-views", label: "Saved views" },
            { key: "reset", label: "Reset table" },
          ],
        },
        "data-pattern-demo": "toolbar",
      })}
    </section>
  `;
}

function filterChipGroupDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-filter-chip-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Active filter chips</h2>
      ${patternReactDemo("filter-chip-group", {
        label: "Active vehicle filters",
        density: "md",
        state: "active",
        resultCount: 128,
        filters: [
          { key: "region", label: "Region: North" },
          { key: "status", label: "Status: Active" },
          { key: "policy", label: "Policy: Fuel only", tone: "warning" },
        ],
        empty: { title: "No active filters", description: "Add filters from the toolbar or advanced filters to refine this view.", icon: "filter_alt_off" },
        reset: { label: "Clear all filters", variant: "secondary" },
        "data-pattern-demo": "filter-chip-group",
      })}
    </section>
  `;
}

function fileUploadDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-file-upload-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Evidence upload</h2>
      ${patternReactDemo("file-upload", {
        label: "Evidence upload",
        description: "Upload a PDF or image under 10 MB.",
        density: "md",
        state: "empty",
        empty: { title: "No document selected", description: "Upload a PDF or image under 10 MB.", icon: "upload_file" },
        chooseAction: { key: "choose", label: "Choose document", icon: "upload_file" },
        removeAction: { key: "remove", label: "Remove", variant: "secondary", icon: "delete" },
        validation: { label: "File policy", message: "Only PDF, JPG, or PNG files under 10 MB are accepted.", state: "warning", live: true },
        "data-pattern-demo": "file-upload",
      })}
    </section>
  `;
}
