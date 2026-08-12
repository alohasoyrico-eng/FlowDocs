import { componentDemo } from "./component-demo.js?v=61";

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
  return componentDemo("table", docsTableProps({ label: `${component} ${section}`, columns, rows, className }));
}

function docsTableProps({ label = "Documentation table", columns = [], rows = [], className = "" } = {}) {
  const safeColumns = columns.length ? columns : ["Name", "Value"];
  return {
    label,
    variant: "dense",
    fullWidth: true,
    className,
    columns: safeColumns.map((column, index) => ({ key: `c${index}`, label: column, mono: index === 0, priority: index === 0 ? "primary" : "secondary" })),
    rows: rows.map((row, rowIndex) => {
      const cells = Array.isArray(row) ? row : [row];
      return safeColumns.reduce((record, _column, index) => ({ ...record, [`c${index}`]: cells[index] ?? "", id: `row-${rowIndex}` }), {});
    }),
  };
}

function componentDetailDemoGrid({ items = [], className = "button-demo-grid states-grid" } = {}) {
  return html`
    <div class="${className}">
      ${items.map((item) => demoCell(item.label, item.content)).join("")}
    </div>
  `;
}

function componentDetailAnatomyGrid({ items = [], iconName = "widgets" } = {}) {
  return html`
    <div class="role-grid" data-doc-primitive="component-detail-anatomy-grid">
      ${items
        .map((item) => componentDocCard({ title: item.part, detail: `${item.rule} ${(item.tokens ?? []).join(", ")}`, iconName }))
        .join("")}
    </div>
  `;
}

function componentDetailChecklist(items = []) {
  return html`
    <div class="checklist-grid">
      ${items
        .map(
          (item) => componentDocCard({ title: item.copy, iconName: item.icon ?? "check_circle" }),
        )
        .join("")}
    </div>
  `;
}

function componentDocCard({ title, detail, status, iconName } = {}) {
  return componentDemo("card", { title, detail, status, icon: iconName ? icon(iconName, { tone: "action", fill: true }) : undefined, variant: "minimal", composition: "standard", fullWidth: true });
}

function componentDocListCard(title, items) {
  return componentDocCard({ title, detail: (items ?? []).join(" ") });
}

function componentDetailRationaleCard(title, items, iconName = "rule") {
  return componentDocCard({ title, detail: (items ?? []).join(" "), iconName });
}

function componentDetailAccessibilityContent(component, fallbackStatePrecedence = "", statePrecedenceOverride = "") {
  const accessibility = componentSectionData(component, "accessibility");
  const statePrecedence = statePrecedenceOverride || accessibility.statePrecedence || fallbackStatePrecedence;
  return html`
    <h2>${ui("component.accessibility")}</h2>
    ${statePrecedence ? `<p>State precedence: ${statePrecedence}.</p>` : ""}
    ${componentDetailChecklist((accessibility.items ?? []).map((item) => ({ copy: item })))}
  `;
}

function componentDetailPropsRowsTable({ className = "", columns = [], rows = [] } = {}) {
  return componentDetailTable({ className, columns, rows });
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

function componentDetailGuidelineGroupsContent(groups = []) {
  return html`
    <h2>${ui("guidelines.title")}</h2>
    <div class="guidelines-grid">
      ${groups.map((group) => componentDocListCard(group.title, group.items)).join("")}
    </div>
  `;
}

function componentDetailGuidelinesContent(component) {
  return componentDetailGuidelineGroupsContent(componentSectionData(component, "guidelines").groups ?? []);
}

function componentDetailTestsListContent({ mustTest = [], rejectIf = [], className = "two-column-list" } = {}) {
  return html`
    <h2>${ui("tests.title")}</h2>
    <div class="${className}">
      ${componentDocListCard(ui("tests.mustTest"), mustTest)}
      ${componentDocListCard(ui("tests.rejectIf"), rejectIf)}
    </div>
  `;
}

function componentDetailTestsContent(component, className = "two-column-list") {
  const tests = componentSectionData(component, "tests-rejection-rules");
  return componentDetailTestsListContent({ mustTest: tests.mustTest ?? [], rejectIf: tests.rejectIf ?? [], className });
}

function componentDetailFoundationCompactList(foundations = []) {
  return html`
    <div class="foundation-compact-list">
      ${foundations
        .map(([name, coverage]) => {
          const data = typeof coverage === "string" ? { status: "covered", decision: coverage, behavior: coverage, tokens: [] } : coverage;
          return html`
            <article>
              <header><strong>${name}</strong><span>${data.status}</span></header>
              <p>${data.decision}</p>
              <small>${data.behavior}</small>
              <div class="token-list">${(data.tokens ?? []).map((token) => `<code>${token}</code>`).join("")}</div>
            </article>
          `;
        })
        .join("")}
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
        ${componentDocListCard(ui("miel.agentCanDecide"), miel.canDecide)}
        ${componentDocListCard(ui("miel.agentMustAsk"), miel.mustAsk)}
        ${componentDocListCard(ui("miel.rejectIf"), miel.rejectIf)}
      </div>
      `,
    })}
    ${componentDetailSection({
      component: entry.id,
      section: "miel-handoff",
      children: html`
      <h2>${ui("miel.handoff")}</h2>
      ${componentDetailRationaleCard(ui("miel.handoff"), [miel.handoff ?? ""], "hive")}
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
  componentDetailAnatomyGrid,
  componentDetailApiPropsTable,
  componentDemoData,
  componentDetailChecklist,
  componentDetailDemoGrid,
  componentDetailFoundationCompactList,
  componentDetailGuidelineGroupsContent,
  componentDetailGuidelinesContent,
  componentDetailPropsRowsTable,
  componentDetailRationaleCard,
  componentDetailSection,
  componentDetailSectionAttrs,
  componentDetailTable,
  componentDetailTestsListContent,
  componentDetailTestsContent,
  componentSectionCopy,
  componentSectionData,
  html,
  icon,
  referenceCopy,
  slug,
  ui,
};
