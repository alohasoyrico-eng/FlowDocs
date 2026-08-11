import { html, slug } from "./detail-tabs-core.js?v=5";

function attrText(attrs = {}) {
  return Object.entries(attrs)
    .map(([key, value]) => value === "" ? key : `${key}="${String(value).replace(/"/g, "&quot;")}"`)
    .join(" ");
}

function renderTemplateModuleSurface({ title, detail, status = "", attrs = {}, body = "" }) {
  return html`
    <section ${attrText({ class: "surface template-module-surface", "data-flow-primitive": "surface", "data-surface-role": "section", "data-state": status ? "raised" : "default", "data-template-module-surface": "", ...attrs })}>
      <header class="template-module-header">
        <div>
          <strong>${title}</strong>
          <p>${detail}</p>
        </div>
        ${status ? `<span>${status}</span>` : ""}
      </header>
      <div class="template-module-content">${body}</div>
    </section>
  `;
}

export function renderRolesAndPermissionsToolbar({ packageDemo }) {
  return html`
    <div class="template-desktop-demo__filters" data-template-pattern="${slug("Roles and Permissions")}" data-pattern-renderer="roles-and-permissions">
      ${packageDemo("segmented-control", { selectedKey: "admin", items: [{ key: "admin", label: "Admin" }, { key: "approver", label: "Approver" }, { key: "audit-viewer", label: "Audit viewer" }] }, { "data-config-role-control": "" })}
      ${packageDemo("badge", { label: "24 pending changes", tone: "warning", variant: "standard" }, { "data-config-pending-badge": "" })}
      ${packageDemo("button", { label: "Save review", icon: "verified_user" }, { "data-template-save": "" })}
      ${packageDemo("button", { label: "Open audit", variant: "secondary", icon: "manage_history" }, { "data-template-audit": "" })}
    </div>
  `;
}

export function renderRolesAndPermissionsPattern({ packageDemo, rows = [] }) {
  return renderTemplateModuleSurface({
    title: "Permission matrix",
    detail: "Role capabilities, dependency warnings, approval requirements, and risky changes before save.",
    status: "2 warnings",
    attrs: { "data-template-panel": "roles", "data-template-pattern": slug("Roles and Permissions"), "data-pattern-renderer": "roles-and-permissions" },
    body: html`
      ${packageDemo("table", { label: "Role permissions", rows, columns: [{ key: "role", label: "Role" }, { key: "permissions", label: "Permissions" }, { key: "review", label: "Review" }] })}
      <div class="template-config-controls">
        ${packageDemo("switch", { label: "Finance reviewer can export reports", checked: false }, { "data-config-dirty-control": "", "data-config-control-label": "Finance export permission" })}
        ${packageDemo("checkbox", { label: "Require owner approval for role changes", checked: true }, { "data-config-dirty-control": "", "data-config-control-label": "Owner approval requirement" })}
      </div>
    `,
  });
}

export function renderDriverVehicleAdministrationPattern({ packageDemo, driverRows = [], vehicleRows = [] }) {
  return html`
    ${renderTemplateModuleSurface({
      title: "Driver lifecycle",
      detail: "Driver creation, suspension, recovery, ownership, and evidence states.",
      status: "3 records",
      attrs: { "data-template-panel": "drivers", "data-template-pattern": slug("Driver and Vehicle Administration"), "data-pattern-renderer": "driver-and-vehicle-administration" },
      body: html`
      ${packageDemo("table", { label: "Drivers", rows: driverRows, columns: [{ key: "driver", label: "Driver" }, { key: "status", label: "Status" }, { key: "vehicle", label: "Vehicle" }] })}
      <footer class="template-config-actions">
        ${packageDemo("button", { label: "Suspend driver", intent: "danger", icon: "block" }, { "data-config-lifecycle-action": "Driver suspended" })}
        ${packageDemo("button", { label: "Recover driver", variant: "secondary", icon: "restart_alt" }, { "data-config-lifecycle-action": "Driver recovery requested" })}
      </footer>
      `,
    })}
    ${renderTemplateModuleSurface({
      title: "Vehicle lifecycle",
      detail: "Vehicle status, assignment, eligibility, documents, and operational blockers.",
      status: "1 blocked",
      attrs: { "data-template-panel": "vehicles", "data-template-pattern": slug("Driver and Vehicle Administration"), "data-pattern-renderer": "driver-and-vehicle-administration", hidden: "" },
      body: html`
      ${packageDemo("table", { label: "Vehicles", rows: vehicleRows, columns: [{ key: "vehicle", label: "Vehicle" }, { key: "status", label: "Status" }, { key: "driver", label: "Driver" }, { key: "docs", label: "Documents" }] })}
      <footer class="template-config-actions">
        ${packageDemo("button", { label: "Assign vehicle", icon: "directions_car" }, { "data-config-lifecycle-action": "Vehicle assignment changed" })}
        ${packageDemo("button", { label: "Block vehicle", intent: "danger", icon: "no_crash" }, { "data-config-lifecycle-action": "Vehicle blocked" })}
      </footer>
      `,
    })}
  `;
}

export function renderAdminRiskReviewPattern({ packageDemo }) {
  return renderTemplateModuleSurface({
    title: "Audit trail",
    detail: "Who changed what, when, why, and what downstream object was affected.",
    status: "Protected",
    attrs: { "data-template-panel": "audit", "data-template-pattern": slug("Authentication, Login, Biometrics and OTP"), "data-pattern-renderer": "admin-risk-review", hidden: "" },
    body: html`
      <div data-config-audit-log>
        ${packageDemo("audit-event", { label: "Role dependency warning", description: "Finance export permission requires approver review.", meta: "Today 10:22 - Admin", status: "Warning", icon: "admin_panel_settings" })}
      </div>
      ${packageDemo("error-panel", { label: "Risky changes need approval", description: "Save is available after owner review or after removing dependent permissions.", actionLabel: "Review dependencies", state: "warning" })}
    `,
  });
}
