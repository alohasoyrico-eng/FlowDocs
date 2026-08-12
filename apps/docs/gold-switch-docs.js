import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailRationaleCard, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, componentDetailSectionAttrs, demoCell, html, icon, ui, slug } from "./gold-component-core.js?v=214";
import { componentDemo } from "./component-demo.js?v=60";
import { playgroundStaticControls } from "./gold-component-data.js?v=230";

export function renderSwitchGoldSection(entry, section) {
  const renderers = {
    "operational-example": () => switchOperationalExamplePanel(),
    anatomy: () => switchAnatomyPanel(),
    accessibility: () => switchAccessibilityPanel(),
    variants: () => switchVariantsPanel(),
    states: () => switchStatesPanel(),
    "variant-state-behavior": () => switchStateVariantMatrixPanel(),
    "full-width": () => switchFullWidthPanel(),
    "responsive-layout-patterns": () => switchResponsivePanel(),
    "viewport-organization": () => switchViewportOrganizationPanel(),
    playground: () => switchPlaygroundPanel(),
    guidelines: () => switchGuidelinesPanel(),
    "api-foundations": () => switchContractPanel(),
    "tests-rejection-rules": () => switchTestPanel(),
    miel: () => componentMielPanel(entry),
  };
  return renderers[section]?.() ?? "";
}

function switchOperationalExamplePanel() {
  const scenario = componentSectionData("switch", "operational-example").scenario;
  return html`<section ${switchSurfaceAttrs("operational-example", "button-operational-panel")}><h2>${ui("component.operationalExample")}</h2><p>${componentSectionCopy("switch", "operational-example")}</p><div class="switch-scenario"><div class="switch-console"><header>${icon("toggle_on", { tone: "action", fill: true })}<div><strong>Driver settings</strong><small>Persistent on/off controls</small></div></header><div class="switch-stack">${(scenario.items ?? []).map(switchDemoFromData).join("")}</div></div>${componentDetailRationaleCard(scenario.rationaleTitle, scenario.rationale ?? [], "rule")}</div></section>`;
}

function switchAnatomyPanel() {
  const anatomy = componentSectionData("switch", "anatomy").items ?? [];
  return html`<section ${switchSurfaceAttrs("anatomy")}><h2>${ui("component.anatomy")}</h2>${componentDetailAnatomyGrid({ items: anatomy, iconName: "toggle_on" })}</section>`;
}

function switchAccessibilityPanel() {
  return html`<section ${switchSurfaceAttrs("accessibility")}>${componentDetailAccessibilityContent("switch")}</section>`;
}

function switchVariantsPanel() {
  const variants = componentDemoData("switch", "variants");
  return html`<section ${switchSurfaceAttrs("variants")}><h2>${ui("component.variants")}</h2><p>${componentSectionCopy("switch", "variants")}</p><div class="button-demo-grid states-grid">${variants.map((demo) => demoCell(demo.label, switchDemoFromData(demo))).join("")}</div></section>`;
}

function switchStatesPanel() {
  const states = componentDemoData("switch", "states");
  return html`<section ${switchSurfaceAttrs("states")}><h2>${ui("component.states")}</h2><p>${componentSectionCopy("switch", "states")}</p><div class="button-demo-grid states-grid">${states.map((demo) => demoCell(demo.label, switchDemoFromData(demo))).join("")}</div></section>`;
}

function switchStateVariantMatrixPanel() {
  const rows = componentDemoData("switch", "variant-state-behavior", "rows");
  const states = componentDemoData("switch", "variant-state-behavior", "states");
  return html`<section ${switchSurfaceAttrs("variant-state-behavior")}><h2>${ui("component.variantStateBehavior")}</h2><p>${componentSectionCopy("switch", "variant-state-behavior")}</p><div class="button-demo-grid state-behavior-grid">${rows.flatMap((row) => states.map((state) => demoCell(`${row.label} · ${state}`, switchDemoFromData(stateDemo(row.setting, state))))).join("")}</div></section>`;
}

function switchFullWidthPanel() {
  const items = componentDemoData("switch", "full-width", "items");
  return html`<section ${switchSurfaceAttrs("full-width")}><h2>${ui("component.fullWidth")}</h2><p>${componentSectionCopy("switch", "full-width")}</p><div class="full-width-demo">${items.map((item) => `<div><span class="overline">${item.label}</span>${item.layout === "container" ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}">${switchDemoFromData(demo)}</div>`).join("")}</div>` : `<div class="button-stack${item.layout === "natural" ? " natural" : ""}">${switchDemoFromData(item.demo)}</div>`}</div>`).join("")}</div></section>`;
}

function switchResponsivePanel() {
  const examples = componentDemoData("switch", "responsive-layout-patterns", "examples");
  return html`<section ${switchSurfaceAttrs("responsive-layout-patterns")}><h2>${ui("component.responsiveLayoutPatterns")}</h2><p>${componentSectionCopy("switch", "responsive-layout-patterns")}</p><div class="responsive-actions-demo">${examples.map((example) => `<article><span class="overline">${example.label}</span><div class="${example.layout}" data-density-context="${example.density}">${(example.demos ?? []).map((demo) => switchDemoFromData({ ...demo, density: example.density })).join("")}</div></article>`).join("")}</div></section>`;
}

function switchViewportOrganizationPanel() {
  const items = componentDemoData("switch", "viewport-organization", "items");
  return html`<section ${switchSurfaceAttrs("viewport-organization", "button-viewport-panel")}><h2>${ui("component.viewportOrganization")}</h2><p>${componentSectionCopy("switch", "viewport-organization")}</p><div class="viewport-doc-grid">${items.map((item) => `<article data-density-context="${item.density}"><header>${icon(item.icon, { tone: "action" })}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.title}</code>${switchDemoFromData(item.demo)}</article>`).join("")}</div></section>`;
}

function switchPlaygroundPanel() {
  const playground = componentSectionData("switch", "playground");
  return html`<section ${switchSurfaceAttrs("playground", "button-playground", `data-component-playground="switch" data-ready="false"`)}><h2>${ui("component.playground")}</h2><p>${componentSectionCopy("switch", "playground")}</p><div class="playground-layout"><div class="playground-controls" aria-label="${ui("playground.switchControls")}">${playgroundStaticControls(playground.controls ?? [], "data-component-playground-input")}</div><div class="playground-preview"><div data-component-preview data-density-context="${playground.preview?.density ?? "md"}">${switchDemoFromData(playground.preview ?? {})}</div><pre data-component-markup>${playground.snippet ?? ""}</pre></div></div></section>`;
}

function switchContractPanel() {
  return html`<section ${switchSurfaceAttrs("api-foundations")}><h2>${ui("build.apiAndFoundations")}</h2><p>${componentSectionCopy("switch", "api-foundations")}</p>${componentDetailApiPropsTable("switch")}</section>`;
}

function switchGuidelinesPanel() {
  return html`<section ${switchSurfaceAttrs("guidelines")}>${componentDetailGuidelinesContent("switch")}</section>`;
}

function switchTestPanel() {
  return html`<section ${switchSurfaceAttrs("tests-rejection-rules")}>${componentDetailTestsContent("switch")}</section>`;
}

function switchSurfaceAttrs(section, className = "", attrs = "") {
  return componentDetailSectionAttrs({ component: "switch", section, className, attrs });
}

function switchDemoFromData(demo) {
  return switchDemo(demo.label, demo.description ?? "", demo.checked ?? false, demo.state ?? "off", demo.density ?? "md");
}

export function switchDemo(label, description = "", checked = false, state = "off", density = "md") {
  return componentDemo("switch", { label, description, checked, state, density });
}

function stateDemo(setting, state) {
  return { ...setting, state, checked: state === "on" || state === "pressed" || state === "disabled", description: state === "error" ? "Review required before enabling." : setting.description };
}
