import { html } from "./detail-tabs-core.js?v=5";

export function focusedPatternDesignPanels(entry) {
  if (entry.id === "sidebar") return sidebarDesignPanels();
  if (entry.id === "topbar") return topbarDesignPanels();
  return "";
}

function sidebarDesignPanels() {
  return `${sidebarViewportOrganizationPanel()}${sidebarResponsiveLayoutPanel()}${sidebarSlotContractPanel()}${sidebarVariantStatusPanel()}`;
}

function topbarDesignPanels() {
  return `${topbarViewportOrganizationPanel()}${topbarResponsiveLayoutPanel()}${topbarSlotContractPanel()}${topbarVariantStatusPanel()}`;
}

function sidebarViewportOrganizationPanel() {
  return designMatrixPanel("Viewport organization", [
    ["Desktop", "Current", "Persistent sidebar is rendered by the Flow React Sidebar pattern in the docs shell and the interactive pattern demo."],
    ["Mobile", "Current", "Drawer behavior is delegated through the Flow React Topbar to the Flow React Sidebar; docs must not author a separate close button."],
  ]);
}

function sidebarResponsiveLayoutPanel() {
  return designMatrixPanel("Responsive layout patterns", [
    ["Hierarchy", "Current", "Parent groups, active route, badges, and disclosure are owned by the Flow React Sidebar props."],
    ["Active route", "Current", "Active state uses Sidebar route state and Button semantics, not manual anchor classes."],
    ["Logo + footer", "Candidate", "Do not render locally in docs until Sidebar exposes brand/footer slots in Flow."],
    ["Drawer", "Current", "Drawer state must be exercised through the Topbar/Sidebar React contract."],
  ]);
}

function topbarViewportOrganizationPanel() {
  return designMatrixPanel("Viewport organization", [
    ["Desktop", "Current", "Topbar is rendered by the Flow React Topbar pattern with Search, Badge, IconButton, Avatar, Menu, Notification Panel, and Sidebar dependencies."],
    ["Compact", "Current", "The navigation action is part of Topbar props and controls the Sidebar drawer boundary."],
  ]);
}

function topbarResponsiveLayoutPanel() {
  return designMatrixPanel("Responsive layout patterns", [
    ["Search priority", "Current", "Topbar owns placement and delegates search behavior to the Flow Search/Autocomplete contracts."],
    ["Utilities", "Current", "Utility actions are IconButton props, not local action-container markup."],
    ["Sections + account", "Candidate", "Section navigation stays blocked until Flow Topbar exposes a governed navigation slot."],
    ["Menu entry", "Current", "The menu action uses Topbar `navigationAction`; docs must not ship a parallel hamburger implementation."],
  ]);
}

function designMatrixPanel(title, rows) {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-design-section" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">Design</span>
      <h2>${title}</h2>
      <div class="pattern-variant-grid">
        ${rows.map(([name, status, copy]) => variantCard(name, status, copy)).join("")}
      </div>
    </section>
  `;
}

function sidebarVariantStatusPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-design-section pattern-design-demo-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <h2>Variant status</h2>
      <div class="pattern-variant-grid">
        ${variantCard("Persistent", "Current", "Desktop and wide tablet use the real sidebar beside content.")}
        ${variantCard("Drawer", "Current", "Small viewports open the same sidebar from the docs menu button.")}
        ${variantCard("Logo + footer", "Candidate", "Useful when a product shell needs its own brand slot plus help, version, or workspace metadata at the bottom.")}
      </div>
    </section>
  `;
}

function topbarVariantStatusPanel() {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-design-section pattern-design-demo-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <h2>Variant status</h2>
      <div class="pattern-variant-grid">
        ${variantCard("Docs shell", "Current", "Brand, search, language, grid, and theme actions use the real topbar.")}
        ${variantCard("Compact menu", "Current", "The menu button appears for the responsive sidebar drawer.")}
        ${variantCard("Brand slot", "Candidate", "Logo swaps and co-branding need a product rule before becoming a documented variant.")}
        ${variantCard("Sections + account", "Candidate", "Documented as parent/child section navigation before search, plus Badge, Avatar, and account menu actions.")}
      </div>
    </section>
  `;
}

function sidebarSlotContractPanel() {
  const rows = [
    ["brand", "Candidate", "Optional product identity above navigation groups; current docs shell keeps brand in Topbar."],
    ["groups", "Current", "Collection parents use icons, disclosure, and count metadata."],
    ["items", "Current", "Child routes are text-first links with aria-current for the active page."],
    ["drawer", "Current", "Mobile opens the same sidebar from the Topbar menu button."],
    ["footer", "Candidate", "Optional support, workspace, environment, or version metadata anchored below navigation."],
  ];
  return slotContractPanel("Sidebar slot contract", rows);
}

function topbarSlotContractPanel() {
  const rows = [
    ["brand", "Current", "Home link with Design System identity."],
    ["sections", "Candidate", "Parent/child section navigation before search for product shells."],
    ["search", "Dependency", "Consumes Search and Autocomplete patterns when results, suggestions, recents, or routing are owned."],
    ["actions", "Current", "Language, grid, and contrast icon buttons."],
    ["notifications", "Dependency", "Badge count can live in Topbar; notification lists/actions belong to Notification Panel."],
    ["account", "Current", "Avatar-trigger Menu owns profile, settings, and session actions without local account buttons."],
  ];
  return slotContractPanel("Topbar slot contract", rows);
}

function slotContractPanel(title, rows) {
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-rule-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <h2>${title}</h2>
      <div class="props-table">
        ${rows.map(([slot, status, rule]) => `<div><code>${slot}</code><span>Slot</span><span>${status}</span><span>${rule}</span></div>`).join("")}
      </div>
    </section>
  `;
}

function variantCard(title, status, copy) {
  return html`<article class="pattern-variant-card" data-status="${status.toLowerCase().replaceAll(" ", "-")}"><strong>${title}</strong><span>${status}</span><p>${copy}</p></article>`;
}
