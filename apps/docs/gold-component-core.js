let componentCopy = {};
let componentDocs = {};
let html = String.raw;
let icon = () => "";
let ui = (key) => key;
let slug = (value) => String(value ?? "");
let artifactContract = () => null;
let componentAgentSpec = () => ({});
let referenceCopy = {};

export function configureGoldComponentContext(nextDeps) {
  componentCopy = nextDeps.componentCopy;
  componentDocs = nextDeps.componentDocs;
  html = nextDeps.html;
  icon = nextDeps.icon;
  ui = nextDeps.ui;
  slug = nextDeps.slug;
  artifactContract = nextDeps.artifactContract;
  componentAgentSpec = nextDeps.componentAgentSpec;
  referenceCopy = nextDeps.referenceCopy;
}

function componentSectionCopy(componentId, sectionId) {
  return componentCopy?.components?.[componentId]?.[sectionId]?.copy ?? "";
}

function componentSectionData(componentId, sectionId) {
  return componentCopy?.components?.[componentId]?.[sectionId] ?? {};
}

function componentApiProps(componentId) {
  return componentSectionData(componentId, "api-foundations").props ?? [];
}

function componentDemoData(componentId, sectionId, key = "demos") {
  return componentSectionData(componentId, sectionId)[key] ?? [];
}

function escapeAttribute(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function demoCell(label, content) {
  return `<div class="demo-cell" data-density-context="md"><h3 class="demo-cell__title">${label}</h3><div class="demo-cell__body">${content}</div></div>`;
}

function componentDetailSection({ component, section, className = "", attrs = "", children = "" } = {}) {
  const classes = ["surface", "docs-section-surface", "component-detail-surface", "wide", className].filter(Boolean).join(" ");
  return html`
    <section class="${classes}" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail" data-component-id="${escapeAttribute(component)}" data-component-section="${escapeAttribute(section)}" ${attrs}>
      ${children}
    </section>
  `;
}

export function componentMielPanel(entry) {
  const miel = componentSectionData(entry.id, "miel");
  const agentSpec = componentAgentSpec(entry, "Component");
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "miel",
      children: html`
      <span class="eyebrow">MIEL</span>
      <h2>${ui("miel.title")}</h2>
      <p>${miel.copy}</p>
      <div class="guidelines-grid">
        <article><h3>${ui("miel.agentCanDecide")}</h3><ul>${(miel.canDecide ?? []).map((item) => `<li>${item}</li>`).join("")}</ul></article>
        <article><h3>${ui("miel.agentMustAsk")}</h3><ul>${(miel.mustAsk ?? []).map((item) => `<li>${item}</li>`).join("")}</ul></article>
        <article><h3>${ui("miel.rejectIf")}</h3><ul>${(miel.rejectIf ?? []).map((item) => `<li>${item}</li>`).join("")}</ul></article>
      </div>
      `,
    })}
    ${componentDetailSection({
      component: entry.id,
      section: "miel-handoff",
      children: html`
      <h2>${ui("miel.handoff")}</h2>
      <div class="fleet-panel-mini">
        ${icon("hive", { tone: "action", fill: true })}
        <p>${miel.handoff ?? ""}</p>
      </div>
      `,
    })}
    ${componentDetailSection({
      component: entry.id,
      section: "miel-machine-contract",
      children: html`
      <h2>${ui("miel.machineContract")}</h2>
      <pre>${JSON.stringify(agentSpec, null, 2)}</pre>
      `,
    })}
  `;
}

export {
  artifactContract,
  componentAgentSpec,
  componentApiProps,
  componentCopy,
  componentDemoData,
  componentDetailSection,
  componentSectionCopy,
  componentSectionData,
  html,
  icon,
  referenceCopy,
  slug,
  ui,
};
