import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailRationaleCard, componentDetailSection, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, demoCell, demoPlaygroundFrame, demoViewportFrame, html, icon, ui } from "./gold-component-core.js?v=221";
import { playgroundStaticControls } from "./gold-component-data.js?v=231";
import { docsSourceMarkupSlot } from "./docs-code-block.js?v=2";
import { componentDemo } from "./component-demo.js?v=61";

export function simpleDemo(component, demo = {}) {
  return componentDemo(component, demo) || "";
}

const wideDemoComponents = new Set([
  "breadcrumbs",
  "chart-panel",
  "date-range-picker",
  "pagination",
  "progress-indicator",
  "segmented-control",
  "slider",
  "stepper",
  "station-pin",
  "tabs",
]);

const fullDemoComponents = new Set([
  "skeleton",
  "table",
]);

const legacyDemoFrameClassMap = new Map([
  [["simple", "demo-row"].join("-"), "docs-demo-row"],
  [["simple", "viewport-demo"].join("-"), "docs-viewport-demo"],
  [["docs", "demo-layout"].join("-"), "docs-demo-frame"],
]);

function demoGridClass(component, mode = "states") {
  const classes = ["docs-demo-matrix", mode === "matrix" ? "docs-demo-matrix--state" : "states-grid"];
  if (wideDemoComponents.has(component)) classes.push("docs-demo-grid--wide");
  if (fullDemoComponents.has(component)) classes.push("docs-demo-grid--full");
  if (component === "tabs") classes.push("tabs-doc-demo-grid");
  if (component === "table") classes.push("table-doc-demo-grid");
  return classes.join(" ");
}

function demoLayoutClass(component, baseClass = "") {
  const classes = [normalizeDemoFrameClass(baseClass), `docs-demo-frame--${component}`];
  if (wideDemoComponents.has(component)) classes.push("docs-demo-frame--wide");
  if (fullDemoComponents.has(component)) classes.push("docs-demo-frame--full");
  return classes.filter(Boolean).join(" ");
}

function normalizeDemoFrameClass(className = "") {
  return String(className)
    .split(/\s+/)
    .map((name) => legacyDemoFrameClassMap.get(name) ?? name)
    .filter(Boolean)
    .join(" ");
}

export function simpleOperationalExamplePanel(component, demoFromData) {
  const scenario = componentSectionData(component, "operational-example").scenario;
  const demos = scenario.demo ? [scenario.demo] : (scenario.items ?? []);
  const semanticDecision = scenario.semanticDecision
    ? componentDetailRationaleCard(
        scenario.semanticDecision.title,
        (scenario.semanticDecision.rows ?? []).map((row) => `${row.label}: ${row.value}`),
        "fact_check",
      )
    : "";
  return componentDetailSection({
    component,
    section: "operational-example",
    className: "button-operational-panel",
    children: html`
      <h2>${ui("component.operationalExample")}</h2>
      <p>${componentSectionCopy(component, "operational-example")}</p>
      <div class="${demoLayoutClass(component, "simple-scenario")}">
        <div class="simple-console" data-density-context="md">
          <header>${icon(scenario.icon, { tone: "action", fill: true })}<div><strong>${scenario.title}</strong><small>${scenario.meta}</small></div></header>
          <div class="${demoLayoutClass(component, "docs-demo-row")}">${demos.map(demoFromData).join("")}</div>
        </div>
        ${componentDetailRationaleCard(scenario.rationaleTitle, scenario.rationale ?? [], "rule")}
        ${semanticDecision}
      </div>
    `,
  });
}

export function simpleAnatomyPanel(component) {
  const anatomy = componentSectionData(component, "anatomy").items ?? [];
  return componentDetailSection({ component, section: "anatomy", children: html`<h2>${ui("component.anatomy")}</h2>${componentDetailAnatomyGrid({ items: anatomy })}` });
}

export function simpleAccessibilityPanel(component) {
  return componentDetailSection({ component, section: "accessibility", children: componentDetailAccessibilityContent(component) });
}

export function simpleVariantsPanel(component, demoFromData) {
  const variants = componentDemoData(component, "variants");
  const gridClass = demoGridClass(component);
  return componentDetailSection({ component, section: "variants", children: html`<h2>${ui("component.variants")}</h2><p>${componentSectionCopy(component, "variants")}</p><div class="${gridClass}">${variants.map((demo) => demoCell(demo.label, demoFromData(demo))).join("")}</div>` });
}

export function simpleStatesPanel(component, demoFromData) {
  const states = componentDemoData(component, "states");
  const gridClass = demoGridClass(component);
  return componentDetailSection({ component, section: "states", children: html`<h2>${ui("component.states")}</h2><p>${componentSectionCopy(component, "states")}</p><div class="${gridClass}">${states.map((demo) => demoCell(demo.label, demoFromData(demo))).join("")}</div>` });
}

export function simpleStateVariantMatrixPanel(component, demoFromData) {
  const matrix = componentSectionData(component, "variant-state-behavior");
  const gridClass = demoGridClass(component, "matrix");
  return componentDetailSection({ component, section: "variant-state-behavior", children: html`<h2>${ui("component.variantStateBehavior")}</h2><p>${componentSectionCopy(component, "variant-state-behavior")}</p><div class="${gridClass}">${(matrix.rows ?? []).flatMap((row) => (matrix.states ?? []).map((state) => demoCell(`${row.label} · ${state}`, demoFromData({ ...(row.demo ?? {}), state })))).join("")}</div>` });
}

export function simpleFullWidthPanel(component, demoFromData) {
  const items = componentDemoData(component, "full-width", "items");
  const content = (item) => (item.demos ?? [item.demo]).filter(Boolean).map(demoFromData).join("");
  if (component === "toast") {
    return componentDetailSection({ component, section: "full-width", children: html`<h2>${ui("component.fullWidth")}</h2><p>${componentSectionCopy(component, "full-width")}</p><div class="responsive-actions-demo toast-full-width-demo">${items.map((item) => `<article data-doc-primitive="component-demo-container"><strong>${item.label}</strong><div class="toast-region-demo" data-toast-align="${item.align ?? "end"}">${content(item)}</div></article>`).join("")}</div>` });
  }
  return componentDetailSection({ component, section: "full-width", children: html`<h2>${ui("component.fullWidth")}</h2><p>${componentSectionCopy(component, "full-width")}</p><div class="${demoLayoutClass(component, "responsive-actions-demo")}">${items.map((item) => `<article data-doc-primitive="component-demo-container"><strong>${item.label}</strong><div class="${demoLayoutClass(component, item.layout === "row" ? "docs-demo-row" : "button-stack")}">${content(item)}</div></article>`).join("")}</div>` });
}

export function simpleResponsivePanel(component, demoFromData) {
  const examples = componentDemoData(component, "responsive-layout-patterns", "examples");
  return componentDetailSection({ component, section: "responsive-layout-patterns", children: html`<h2>${ui("component.responsiveLayoutPatterns")}</h2><p>${componentSectionCopy(component, "responsive-layout-patterns")}</p><div class="${demoLayoutClass(component, "responsive-actions-demo")}">${examples.map((example) => `<article data-doc-primitive="component-demo-container" data-density-context="${example.density ?? "md"}"><strong>${example.label}</strong><div class="${demoLayoutClass(component, example.layout ?? "docs-demo-row")}">${(example.demos ?? []).map((demo) => demoFromData({ ...demo, density: demo.density ?? example.density })).join("")}</div></article>`).join("")}</div>` });
}

export function simpleViewportOrganizationPanel(component, demoFromData) {
  const items = componentDemoData(component, "viewport-organization", "items");
  return componentDetailSection({ component, section: "viewport-organization", className: "button-viewport-panel", children: html`<h2>${ui("component.viewportOrganization")}</h2><p>${componentSectionCopy(component, "viewport-organization")}</p><div class="${demoLayoutClass(component, "docs-viewport-matrix")}">${items.map((item) => `<article data-doc-primitive="component-viewport-demo" data-density-context="${item.density}"><header>${icon(item.icon)}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.layout}</code>${demoViewportFrame({ label: item.title, previewHtml: demoFromData({ ...(item.demo ?? {}), density: item.demo?.density ?? item.density }), density: item.density, layout: item.layout ?? "inline", className: demoLayoutClass(component, ""), source: "simpleViewportOrganizationPanel" })}</article>`).join("")}</div>` });
}

export function simplePlaygroundPanel(component, demoFromData) {
  const playground = componentSectionData(component, "playground");
  return componentDetailSection({ component, section: "playground", className: "button-playground", attrs: `data-component-playground="${component}"`, children: html`<h2>${ui("component.playground")}</h2><p>${componentSectionCopy(component, "playground")}</p>${demoPlaygroundFrame({ label: ui("component.playground"), controlsHtml: `<div role="group" aria-label="${ui(`playground.${component.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}Controls`)}">${playgroundStaticControls(playground.controls ?? [], "data-component-playground-input")}</div>`, previewHtml: `<div data-doc-playground-preview data-density-context="${playground.preview?.density ?? "md"}">${demoFromData(playground.preview ?? {})}</div>`, sourceHtml: docsSourceMarkupSlot(playground.snippet ?? ""), source: "simplePlaygroundPanel" })}` });
}

export function simpleGuidelinesPanel(component) {
  return componentDetailSection({ component, section: "guidelines", children: componentDetailGuidelinesContent(component) });
}

export function simpleContractPanel(component) {
  return componentDetailSection({ component, section: "api-foundations", children: html`<h2>${ui("build.apiAndFoundations")}</h2><p>${componentSectionCopy(component, "api-foundations")}</p>${componentDetailApiPropsTable(component, "comparison-table")}` });
}

export function simpleTestPanel(component) {
  return componentDetailSection({ component, section: "tests-rejection-rules", children: componentDetailTestsContent(component, "guidelines-grid") });
}

export function renderSimpleGoldSection(entry, section, demoFromData) {
  const renderers = {
    "operational-example": () => simpleOperationalExamplePanel(entry.id, demoFromData),
    anatomy: () => simpleAnatomyPanel(entry.id),
    accessibility: () => simpleAccessibilityPanel(entry.id),
    variants: () => simpleVariantsPanel(entry.id, demoFromData),
    states: () => simpleStatesPanel(entry.id, demoFromData),
    "variant-state-behavior": () => simpleStateVariantMatrixPanel(entry.id, demoFromData),
    "full-width": () => simpleFullWidthPanel(entry.id, demoFromData),
    "responsive-layout-patterns": () => simpleResponsivePanel(entry.id, demoFromData),
    "viewport-organization": () => simpleViewportOrganizationPanel(entry.id, demoFromData),
    playground: () => simplePlaygroundPanel(entry.id, demoFromData),
    guidelines: () => simpleGuidelinesPanel(entry.id),
    "api-foundations": () => simpleContractPanel(entry.id),
    "tests-rejection-rules": () => simpleTestPanel(entry.id),
    miel: () => componentMielPanel(entry),
  };
  return renderers[section]?.() ?? "";
}
