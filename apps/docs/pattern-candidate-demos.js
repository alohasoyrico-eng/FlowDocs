import { html } from "./detail-tabs-core.js?v=3";
import { avatarMenuMarkup } from "./avatar-menu-slot.js?v=1";
import { patternPackageDemo as packageDemo, searchSlotMarkup } from "./search-slot.js?v=2";

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
      <div class="pattern-avatar-menu-demo" data-avatar-menu-demo>
        ${avatarMenuMarkup({ attrs: { "data-avatar-menu": "" } })}
      </div>
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
  const results = [
    ["vehicle", "JMX-214-B", "Vehicle - Active card", "vehicle card active jmx"],
    ["driver", "Ana Sosa", "Driver - Fleet operations", "driver ana fleet"],
    ["station", "Station 24", "Station - Preferred fuel", "station fuel preferred"],
    ["card", "Corporate card 4821", "Card - Pending review", "card payment corporate 4821"],
  ];
  return html`
    <section class="doc-panel wide pattern-search-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Scoped search</h2>
      <div class="pattern-search-demo" data-search-demo data-search-state="idle">
        <div class="pattern-search-demo__controls">
          ${searchSlotMarkup({
            label: "Search fleet records",
            placeholder: "Search vehicle, driver, card, or station",
            attrs: { "data-search-control": "" },
            ariaLabel: "Search fleet records",
          })}
          ${packageDemo("select", { label: "Scope", value: "all", options: [{ label: "All entities", value: "all" }, { label: "Vehicles", value: "vehicle" }, { label: "Drivers", value: "driver" }, { label: "Stations", value: "station" }, { label: "Cards", value: "card" }] }, { "data-search-scope": "" })}
        </div>
        <p data-search-status aria-live="polite">Recent entities</p>
        ${packageDemo("list", { label: "Recent searchable entities", items: results.map(([id, label, meta]) => ({ label, meta, value: "Open", icon: id === "driver" ? "person" : id === "station" ? "local_gas_station" : id === "card" ? "credit_card" : "directions_car" })) }, { "data-search-list": "" })}
        <div class="pattern-search-demo__results" data-search-results hidden>
          ${results.map(([id, label, meta, keywords]) => packageDemo("button", { label: `${label} - ${meta}`, variant: "secondary", trailingIcon: "arrow_forward" }, { "data-search-result": id, "data-search-type": id, "data-search-label": label, "data-search-keywords": keywords, hidden: "" })).join("")}
        </div>
        <div data-search-empty hidden>${packageDemo("empty-state", { label: "No records found", description: "Try a broader scope or another keyword.", icon: "search_off" })}</div>
        <div data-search-validation hidden>${packageDemo("inline-validation", { label: "Search query", message: "Type at least two characters to search.", state: "warning" })}</div>
        <div data-search-selected hidden>${packageDemo("inline-validation", { label: "Selected result", message: "Result selected.", state: "success" })}</div>
      </div>
    </section>
  `;
}

function autocompleteDemoPanel() {
  const suggestions = [
    ["jmx", "JMX-214-B", "Vehicle - Ana Sosa", "jmx vehicle ana"],
    ["kld", "KLD-901-C", "Vehicle - Luis Vera", "kld vehicle luis"],
    ["station", "Station 24", "Preferred fuel station", "station fuel"],
  ];
  return html`
    <section class="doc-panel wide pattern-autocomplete-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Entity autocomplete</h2>
      <div class="pattern-autocomplete-demo" data-autocomplete-demo>
        ${packageDemo("combobox", {
          label: "Assign vehicle or station",
          placeholder: "Start typing an entity",
          helper: "Choose a valid operational entity.",
          icon: "search",
          state: "open",
          options: suggestions.map(([id, label, meta]) => ({ label, value: id, meta })),
        }, { "data-autocomplete-control": "" })}
        <div data-autocomplete-loading hidden>${packageDemo("skeleton", { label: "Loading suggestions", rows: 3 })}</div>
        <div data-autocomplete-empty hidden>${packageDemo("empty-state", { label: "No suggestions", description: "Check spelling or create a support request.", icon: "search_off" })}</div>
        <div data-autocomplete-validation hidden>${packageDemo("inline-validation", { label: "Selected entity", message: "Choose a valid suggestion before continuing.", state: "warning" })}</div>
      </div>
    </section>
  `;
}

function selectOptionLayerDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-select-layer-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Permissioned option layer</h2>
      <div class="pattern-select-layer-demo" data-select-layer-demo>
        ${packageDemo("select", { label: "Card policy", value: "standard", options: [{ label: "Standard policy", value: "standard" }, { label: "Fuel only", value: "fuel" }, { label: "International travel", value: "international" }] }, { "data-select-layer-field": "" })}
        <div class="pattern-select-layer-demo__options">
          <div data-select-layer-option="standard" data-selected="true">
            ${packageDemo("card", { title: "Standard policy", detail: "Default card controls", status: "Selected" })}
            ${packageDemo("badge", { label: "Selected", tone: "info" })}
          </div>
          <div data-select-layer-option="fuel">
            ${packageDemo("card", { title: "Fuel only", detail: "Restricts spend to fuel stations", status: "Available" })}
            ${packageDemo("button", { label: "Choose fuel only", variant: "secondary" }, { "data-select-layer-choose": "fuel" })}
          </div>
          <div data-select-layer-option="international" data-option-blocked="true">
            ${packageDemo("card", { title: "International travel", detail: "Requires finance approval before selection", status: "Approval needed" })}
            ${packageDemo("button", { label: "Review approval", variant: "secondary" }, { "data-select-layer-blocked": "" })}
          </div>
        </div>
        <div data-select-layer-validation hidden>${packageDemo("inline-validation", { label: "International travel", message: "Finance approval is required before this option is available.", state: "warning" })}</div>
        <div data-select-layer-sheet hidden>${bottomSheetPatternDemo({ label: "Card policy options", description: "Use this sheet on constrained mobile viewports.", items: ["Standard policy", "Fuel only", "International travel"] })}</div>
      </div>
    </section>
  `;
}

function multiSelectDemoPanel() {
  const options = [
    ["north", "North region", "12 vehicles"],
    ["central", "Central region", "18 vehicles"],
    ["airport", "Airport stations", "6 stations"],
  ];
  return html`
    <section class="doc-panel wide pattern-multi-select-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Multi select filters</h2>
      <div class="pattern-multi-select-demo" data-multi-select-demo data-max="2">
        <div class="pattern-multi-select-demo__options">
          ${options.map(([id, label, description]) => packageDemo("checkbox", { label, description, value: id }, { "data-multi-select-option": id })).join("")}
        </div>
        <div class="pattern-multi-select-demo__chips" data-multi-select-chips>
          ${packageDemo("empty-state", { label: "No filters selected", description: "Select up to two filters to preview the query.", icon: "filter_alt_off" }, { "data-multi-select-empty": "" })}
          ${options.map(([id, label]) => packageDemo("chip", { label, selected: true }, { "data-multi-select-chip": id, hidden: "" })).join("")}
        </div>
        <div data-multi-select-validation hidden>${packageDemo("inline-validation", { label: "Filter limit", message: "Select no more than two filters for this view.", state: "warning" })}</div>
        <footer>
          ${packageDemo("badge", { label: "0 selected", tone: "neutral", variant: "standard", live: true, ariaLabel: "0 filters selected" }, { "data-multi-select-count": "" })}
          ${packageDemo("button", { label: "Apply filters", icon: "check" }, { "data-multi-select-apply": "" })}
        </footer>
        <div data-multi-select-toast hidden>${packageDemo("toast", { label: "Filters applied", description: "0 filters are active.", tone: "success" }, { "data-pattern-toast": "multi-select" })}</div>
      </div>
    </section>
  `;
}

function formSectionDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-form-section-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Editable form section</h2>
      <div class="pattern-form-section-demo" data-form-section-demo data-pattern-primitive="surface" data-form-state="default">
        <header class="pattern-form-section-demo__header">
          <div>
            <h3>Driver profile</h3>
            <p>Update the operational details used by dispatch, compliance, and support.</p>
          </div>
          ${packageDemo("icon-button", { ariaLabel: "Review section settings", icon: "tune", variant: "ghost" }, { "data-form-section-settings": "" })}
        </header>
        <div class="pattern-form-section-demo__fields">
          ${packageDemo("input", { label: "Driver name", value: "Ana Sosa" }, { "data-form-section-field": "name" })}
          ${packageDemo("select", { label: "Region", value: "north", options: [{ label: "North Region", value: "north" }, { label: "South Region", value: "south" }, { label: "Maintenance", value: "maintenance" }] }, { "data-form-section-field": "region" })}
          ${packageDemo("checkbox", { label: "Can approve fuel overrides", description: "Requires supervisor review.", checked: true }, { "data-form-section-field": "approval" })}
          ${packageDemo("switch", { label: "Send route alerts", description: "Notify driver and dispatcher.", checked: true }, { "data-form-section-field": "alerts" })}
          ${packageDemo("radio-button", { label: "Day shift", name: "driver-shift", checked: true }, { "data-form-section-field": "shift-day" })}
          ${packageDemo("text-area", { label: "Operational notes", value: "Authorized for city routes." }, { "data-form-section-field": "notes" })}
        </div>
        <p class="pattern-form-section-demo__validation" data-form-section-validation role="alert" hidden>Driver name is required before saving.</p>
        <footer>${packageDemo("button", { label: "Save section", icon: "save" }, { "data-form-section-save": "" })}</footer>
        <p class="pattern-form-section-demo__feedback" data-form-section-feedback role="status" hidden>Driver profile changes were saved.</p>
      </div>
    </section>
  `;
}

function toolbarDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-toolbar-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Table toolbar</h2>
      <div class="pattern-toolbar-demo" data-toolbar-demo>
        ${packageDemo("input", { label: "Search vehicles", placeholder: "Plate, driver, or region" }, { "data-toolbar-search": "" })}
        <div class="pattern-toolbar-demo__actions">
          ${packageDemo("button", { label: "Export", icon: "download", variant: "secondary" }, { "data-toolbar-export": "" })}
          ${packageDemo("button", { label: "Add vehicle", icon: "add" }, { "data-toolbar-primary": "" })}
          ${packageDemo("menu", { trigger: "More actions", label: "Toolbar actions", items: [{ label: "Columns" }, { label: "Saved views" }, { label: "Reset table" }] }, { "data-toolbar-menu": "" })}
        </div>
        <div class="pattern-toolbar-demo__status">
          ${packageDemo("badge", { label: "2 filters", tone: "info", variant: "standard", live: true }, { "data-toolbar-count": "" })}
          ${packageDemo("chip", { label: "Region: North", selected: true, removable: true }, { "data-toolbar-chip": "region" })}
        </div>
        <div data-toolbar-toast hidden>${packageDemo("toast", { label: "Export started", description: "Vehicle export is being prepared.", tone: "success" }, { "data-pattern-toast": "toolbar" })}</div>
      </div>
    </section>
  `;
}

function filterChipGroupDemoPanel() {
  const filters = [["region", "Region: North"], ["status", "Status: Active"], ["policy", "Policy: Fuel only"]];
  return html`
    <section class="doc-panel wide pattern-filter-chip-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Active filter chips</h2>
      <div class="pattern-filter-chip-demo" data-filter-chip-demo>
        ${packageDemo("badge", { label: "3 active", tone: "info", variant: "standard", live: true }, { "data-filter-chip-count": "" })}
        <div class="pattern-filter-chip-demo__chips" data-filter-chip-list>
          ${filters.map(([id, label]) => packageDemo("chip", { label, selected: true, removable: true }, { "data-filter-chip": id })).join("")}
        </div>
        <div data-filter-chip-empty hidden>${packageDemo("empty-state", { label: "No active filters", description: "Add filters from the toolbar to refine this view.", icon: "filter_alt_off" })}</div>
        <footer>${packageDemo("button", { label: "Clear all filters", variant: "secondary", icon: "close" }, { "data-filter-chip-clear": "" })}</footer>
        <div data-filter-chip-toast hidden>${packageDemo("toast", { label: "Filters cleared", description: "All active filters were removed.", tone: "success" }, { "data-pattern-toast": "filter-chip-group" })}</div>
      </div>
    </section>
  `;
}

function fileUploadDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-file-upload-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Evidence upload</h2>
      <div class="pattern-file-upload-demo" data-file-upload-demo data-file-state="empty">
        <div data-file-upload-empty>${packageDemo("empty-state", { label: "No document selected", description: "Upload a PDF or image under 10 MB.", icon: "upload_file" })}</div>
        <div class="pattern-file-upload-demo__actions">
          ${packageDemo("button", { label: "Choose document", icon: "upload_file" }, { "data-file-upload-choose": "" })}
          ${packageDemo("button", { label: "Remove", variant: "secondary", icon: "delete" }, { "data-file-upload-remove": "", hidden: "" })}
        </div>
        <div data-file-upload-summary hidden>${packageDemo("tag", { label: "invoice-july.pdf", tone: "info", icon: "description" })}</div>
        <div data-file-upload-progress hidden>${packageDemo("progress-indicator", { label: "Upload progress", value: 65, max: 100 })}</div>
        <div data-file-upload-validation hidden>${packageDemo("inline-validation", { label: "File policy", message: "Only PDF, JPG, or PNG files under 10 MB are accepted.", state: "warning" })}</div>
        <div data-file-upload-toast hidden>${packageDemo("toast", { label: "Upload complete", description: "invoice-july.pdf is ready for review.", tone: "success" }, { "data-pattern-toast": "file-upload" })}</div>
      </div>
    </section>
  `;
}
