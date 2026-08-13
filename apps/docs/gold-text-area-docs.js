import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailRationaleCard, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, componentDetailSection, demoCell, demoPlaygroundFrame, html, icon, ui } from "./gold-component-core.js?v=221";
import { docsSourceMarkupSlot } from "./docs-code-block.js?v=2";
import { componentDemo } from "./component-demo.js?v=60";
import { playgroundStaticControls } from "./gold-component-data.js?v=231";

export function renderTextAreaGoldSection(entry, section) {
  const renderers = {
    "operational-example": () => textAreaOperationalExamplePanel(),
    anatomy: () => textAreaAnatomyPanel(),
    accessibility: () => textAreaAccessibilityPanel(),
    variants: () => textAreaVariantsPanel(),
    states: () => textAreaStatesPanel(),
    "variant-state-behavior": () => textAreaStateVariantMatrixPanel(),
    "full-width": () => textAreaFullWidthPanel(),
    "responsive-layout-patterns": () => textAreaResponsivePanel(),
    "viewport-organization": () => textAreaViewportOrganizationPanel(),
    playground: () => textAreaPlaygroundPanel(),
    guidelines: () => textAreaGuidelinesPanel(),
    "api-foundations": () => textAreaContractPanel(),
    "tests-rejection-rules": () => textAreaTestPanel(),
    miel: () => componentMielPanel(entry),
  };
  return renderers[section]?.() ?? "";
}

function textAreaOperationalExamplePanel() {
  const scenario = componentSectionData("text-area", "operational-example").scenario;
  return textAreaSection("operational-example", html`<h2>${ui("component.operationalExample")}</h2><p>${componentSectionCopy("text-area", "operational-example")}</p><div class="text-area-scenario"><div class="filter-console"><header>${icon("edit_note", { tone: "action", fill: true })}<div><strong>Operational notes</strong><small>Multiline values with review context</small></div></header><div class="text-area-stack">${(scenario.fields ?? []).map(textAreaDemoFromData).join("")}</div></div>${componentDetailRationaleCard(scenario.rationaleTitle, scenario.rationale ?? [], "rule")}</div>`, "button-operational-panel", "");
}

function textAreaAnatomyPanel() {
  const anatomy = componentSectionData("text-area", "anatomy").items ?? [];
  return textAreaSection("anatomy", html`<h2>${ui("component.anatomy")}</h2>${componentDetailAnatomyGrid({ items: anatomy, iconName: "edit_note" })}`, "", "");
}

function textAreaAccessibilityPanel() {
  return textAreaSection("accessibility", html`${componentDetailAccessibilityContent("text-area")}`, "", "");
}

function textAreaVariantsPanel() {
  const variants = componentDemoData("text-area", "variants");
  return textAreaSection("variants", html`<h2>${ui("component.variants")}</h2><p>${componentSectionCopy("text-area", "variants")}</p><div class="docs-demo-matrix states-grid">${variants.map((demo) => demoCell(demo.label, textAreaDemoFromData(demo))).join("")}</div>`, "", "");
}

function textAreaStatesPanel() {
  const states = componentDemoData("text-area", "states");
  return textAreaSection("states", html`<h2>${ui("component.states")}</h2><p>${componentSectionCopy("text-area", "states")}</p><div class="docs-demo-matrix states-grid">${states.map((demo) => demoCell(demo.label, textAreaDemoFromData(demo))).join("")}</div>`, "", "");
}

function textAreaStateVariantMatrixPanel() {
  const rows = componentDemoData("text-area", "variant-state-behavior", "rows");
  const states = componentDemoData("text-area", "variant-state-behavior", "states");
  return textAreaSection("variant-state-behavior", html`<h2>${ui("component.variantStateBehavior")}</h2><p>${componentSectionCopy("text-area", "variant-state-behavior")}</p><div class="docs-demo-matrix docs-demo-matrix--state">${rows.flatMap((row) => states.map((state) => demoCell(`${row.label} · ${state}`, textAreaDemo(row.field, stateValue(row, state), row.placeholder, stateHelper(row, state), row.rows, row.maxLength, "sm", state)))).join("")}</div>`, "", "");
}

function textAreaFullWidthPanel() {
  const items = componentDemoData("text-area", "full-width", "items");
  return textAreaSection("full-width", html`<h2>${ui("component.fullWidth")}</h2><p>${componentSectionCopy("text-area", "full-width")}</p><div class="full-width-demo">${items.map((item) => `<div><span class="overline">${item.label}</span>${item.layout === "container" ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}">${textAreaDemoFromData(demo)}</div>`).join("")}</div>` : `<div class="button-stack${item.layout === "stack-natural" ? " natural" : ""}">${textAreaDemoFromData(item.demo)}</div>`}</div>`).join("")}</div>`, "", "");
}

function textAreaResponsivePanel() {
  const examples = componentDemoData("text-area", "responsive-layout-patterns", "examples");
  return textAreaSection("responsive-layout-patterns", html`<h2>${ui("component.responsiveLayoutPatterns")}</h2><p>${componentSectionCopy("text-area", "responsive-layout-patterns")}</p><div class="responsive-actions-demo">${examples.map((example) => `<article data-doc-primitive="component-demo-container"><span class="overline">${example.label}</span><div class="${example.layout}" data-density-context="${example.density}">${(example.demos ?? []).map((demo) => textAreaDemoFromData({ ...demo, density: example.density })).join("")}</div></article>`).join("")}</div>`, "", "");
}

function textAreaViewportOrganizationPanel() {
  const items = componentDemoData("text-area", "viewport-organization", "items");
  return textAreaSection("viewport-organization", html`<h2>${ui("component.viewportOrganization")}</h2><p>${componentSectionCopy("text-area", "viewport-organization")}</p><div class="docs-viewport-matrix">${items.map((item) => `<article data-doc-primitive="component-viewport-demo" data-density-context="${item.density}"><header>${icon(item.icon, { tone: "action" })}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.title}</code>${textAreaDemoFromData(item.demo)}</article>`).join("")}</div>`, "button-viewport-panel", "");
}

function textAreaPlaygroundPanel() {
  const playground = componentSectionData("text-area", "playground");
  return textAreaSection("playground", html`<h2>${ui("component.playground")}</h2><p>${componentSectionCopy("text-area", "playground")}</p>${demoPlaygroundFrame({ label: ui("component.playground"), controlsAttrs: `aria-label="${ui("playground.textAreaControls")}"`, controlsHtml: playgroundStaticControls(playground.controls ?? [], "data-component-playground-input"), previewHtml: `<div data-doc-playground-preview data-density-context="${playground.preview?.density ?? "md"}">${textAreaDemoFromData(playground.preview ?? {})}</div>`, sourceHtml: docsSourceMarkupSlot(playground.snippet ?? ""), source: "textAreaPlaygroundPanel" })}`, "button-playground", `data-component-playground="text-area" data-ready="false"`);
}

function textAreaContractPanel() {
  return textAreaSection("api-foundations", html`<h2>${ui("build.apiAndFoundations")}</h2><p>${componentSectionCopy("text-area", "api-foundations")}</p>${componentDetailApiPropsTable("text-area")}`, "", "");
}

function textAreaGuidelinesPanel() {
  return textAreaSection("guidelines", html`${componentDetailGuidelinesContent("text-area")}`, "", "");
}

function textAreaTestPanel() {
  return textAreaSection("tests-rejection-rules", html`${componentDetailTestsContent("text-area")}`, "", "");
}

function textAreaSection(section, children, className = "", attrs = "") {
  return componentDetailSection({ component: "text-area", section, className, attrs, children });
}

function textAreaDemoFromData(demo) {
  return textAreaDemo(demo.field, demo.value ?? "", demo.placeholder ?? "", demo.helper ?? "", demo.rows ?? 3, demo.maxLength, demo.density ?? "md", demo.state ?? "default");
}

export function textAreaDemo(label, value = "", placeholder = "", helper = "", rows = 3, maxLength, density = "md", state = "default") {
  return componentDemo("text-area", { field: label, value, placeholder, helper, rows, maxLength, density, state });
}

function stateValue(row, state) {
  if (state === "default" || state === "focus") return "";
  if (state === "error") return "Ok";
  return row.value ?? "";
}

function stateHelper(row, state) {
  if (state === "loading") return "Checking policy language.";
  if (state === "error") return "Use at least 20 characters.";
  if (state === "disabled") return "Managed by policy.";
  return row.helper ?? "Operational note.";
}
