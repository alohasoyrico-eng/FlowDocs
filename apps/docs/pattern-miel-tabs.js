import { html, ui } from "./detail-tabs-core.js?v=10";
import { componentDemo } from "./component-demo.js?v=61";
import { documentationSectionIsland } from "./documentation-section-island.js?v=1";

export function patternMielTabs(entry) {
  if (entry.id === "sidebar") return sidebarMielPanel();
  if (entry.id === "topbar") return topbarMielPanel();
  return "";
}

function sidebarMielPanel() {
  const canDecide = [
    "Variant: grouped, drawer, or logo + footer.",
    "Parent icons; child text, Badge, aria-current."
  ];
  const mustAsk = [
    "More than two levels are needed.",
    "Footer, workspace, account, or mobile owner changes."
  ];
  const rejectIf = [
    "Child items get decorative icons.",
    "It contains filters, tables, detail, or visual-only state."
  ];
  const handoff = "Confirm group order, active route, max depth, footer utilities, and mobile drawer owner.";
  return patternMielPanel("Sidebar MIEL", canDecide, mustAsk, rejectIf, handoff, {
    depth: "2 levels",
    owns: "Persistent navigation",
    dependsOn: "Badge, Icon Button, Tooltip",
    a11y: "aria-current, focus-visible, reduced motion",
  });
}

function topbarMielPanel() {
  const canDecide = [
    "Slot order: leading, brand, nav, search, actions, account.",
    "Badge counts, Avatar-trigger Menu, and compact Icon Button utilities when behavior is already defined."
  ];
  const mustAsk = [
    "Logo, co-brand, or brand hierarchy changes.",
    "Search, autocomplete, notification, logout, settings, or workspace policy changes."
  ];
  const rejectIf = [
    "Search or Autocomplete behavior is implemented inside Topbar.",
    "Notifications are visual-only, or menu/panel behavior is missing."
  ];
  const handoff = "Confirm slot priority, brand rules, search boundary, notification policy, account actions, and mobile fallback.";
  return patternMielPanel("Topbar MIEL", canDecide, mustAsk, rejectIf, handoff, {
    slots: "leading, brand, nav, search, actions, account",
    dependsOn: "Search, Autocomplete, Notification Panel, Sidebar",
    escalatesTo: "Command Palette, account/session pattern",
    a11y: "landmark, labels, focus-visible, reduced motion",
  });
}

function patternMielPanel(title, canDecide, mustAsk, rejectIf, handoff, machineContract) {
  return documentationSectionIsland({
    bodyHtml: html`
      <header class="pattern-miel-header">
        <span class="eyebrow">MIEL</span>
        <h2>${title}</h2>
        <p>Agent boundary, human checkpoints, and pattern rejection rules.</p>
      </header>
      <div class="pattern-miel-grid">
        ${mielRuleCard(ui("miel.agentCanDecide"), canDecide)}
        ${mielRuleCard(ui("miel.agentMustAsk"), mustAsk)}
        ${mielRuleCard(ui("miel.rejectIf"), rejectIf)}
      </div>
      <div class="pattern-miel-bottom">
        ${mielCard(ui("miel.handoff"), handoff)}
        ${mielCard(ui("miel.machineContract"), Object.entries(machineContract).map(([key, value]) => `${key}: ${value}`).join(" "))}
      </div>
    `,
    className: "artifact-detail-surface wide pattern-miel-panel",
    template: "artifact-detail",
    attrs: 'data-pattern-doc="miel"',
    source: "patternMielPanel",
  });
}

function mielRuleCard(title, items) {
  return mielCard(title, items.join(" "));
}

function mielCard(title, detail) {
  return componentDemo("card", { title, detail, variant: "minimal", composition: "standard", fullWidth: true });
}
