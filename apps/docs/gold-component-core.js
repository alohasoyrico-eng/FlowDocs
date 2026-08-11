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
  const surfaceAttrs = componentDetailSectionAttrs({ component, section, className, attrs });
  return html`
    <section ${surfaceAttrs}>
      ${children}
    </section>
  `;
}

function componentDetailSectionAttrs({ component, section, className = "", attrs = "" } = {}) {
  const classes = ["surface", "docs-section-surface", "component-detail-surface", "wide", className].filter(Boolean).join(" ");
  return `class="${classes}" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail" data-component-id="${escapeAttribute(component)}" data-component-section="${escapeAttribute(section)}" ${attrs}`;
}

function componentDetailTable({ component, section, className = "", columns = [], rows = [] } = {}) {
  return html`
    <div class="props-table ${className}">
      <div>${columns.map((column) => `<strong>${column}</strong>`).join("")}</div>
      ${rows
        .map(
          (row) => html`
            <div>
              ${row.map((value, index) => (index === 0 ? `<code>${value}</code>` : `<span>${value}</span>`)).join("")}
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function componentDetailDemoGrid({ items = [], className = "button-demo-grid states-grid" } = {}) {
  return html`
    <div class="${className}">
      ${items.map((item) => demoCell(item.label, item.content)).join("")}
    </div>
  `;
}

function componentDetailChecklist(items = []) {
  return html`
    <div class="checklist-grid">
      ${items
        .map(
          (item) => html`
            <article>${icon(item.icon ?? "check_circle", { tone: item.tone ?? "success", fill: true })}<span>${item.copy}</span></article>
          `,
        )
        .join("")}
    </div>
  `;
}

function componentDetailAccessibilityContent(component, fallbackStatePrecedence = "") {
  const accessibility = componentSectionData(component, "accessibility");
  const statePrecedence = accessibility.statePrecedence ?? fallbackStatePrecedence;
  return html`
    <h2>${ui("component.accessibility")}</h2>
    ${statePrecedence ? `<p>State precedence: ${statePrecedence}.</p>` : ""}
    ${componentDetailChecklist((accessibility.items ?? []).map((item) => ({ copy: item })))}
  `;
}

function componentDetailApiPropsTable(component, className = "") {
  const props = componentApiProps(component);
  return componentDetailTable({
    component,
    section: "api-foundations",
    className,
    columns: [ui("table.prop"), ui("table.type"), ui("table.required"), ui("table.notes")],
    rows: props.map((prop) => [prop.name, prop.type, prop.required, prop.notes]),
  });
}

function componentDetailGuidelinesContent(component) {
  const groups = componentSectionData(component, "guidelines").groups ?? [];
  return html`
    <h2>${ui("guidelines.title")}</h2>
    <div class="guidelines-grid">
      ${groups.map((group) => `<article><h3>${group.title}</h3><ul>${(group.items ?? []).map((item) => `<li>${item}</li>`).join("")}</ul></article>`).join("")}
    </div>
  `;
}

function componentDetailTestsContent(component, className = "two-column-list") {
  const tests = componentSectionData(component, "tests-rejection-rules");
  return html`
    <h2>${ui("tests.title")}</h2>
    <div class="${className}">
      <article><h3>${ui("tests.mustTest")}</h3><ul>${(tests.mustTest ?? []).map((item) => `<li>${item}</li>`).join("")}</ul></article>
      <article><h3>${ui("tests.rejectIf")}</h3><ul>${(tests.rejectIf ?? []).map((item) => `<li>${item}</li>`).join("")}</ul></article>
    </div>
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
  componentDetailAccessibilityContent,
  componentDetailApiPropsTable,
  componentDemoData,
  componentDetailChecklist,
  componentDetailDemoGrid,
  componentDetailGuidelinesContent,
  componentDetailSection,
  componentDetailSectionAttrs,
  componentDetailTable,
  componentDetailTestsContent,
  componentSectionCopy,
  componentSectionData,
  html,
  icon,
  referenceCopy,
  slug,
  ui,
};
