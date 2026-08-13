import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailRationaleCard, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, componentDetailSection, demoCell, demoPlaygroundFrame, html, icon, ui, slug } from "./gold-component-core.js?v=221";
import { docsSourceMarkupSlot } from "./docs-code-block.js?v=2";
import { componentDemo } from "./component-demo.js?v=60";
import { playgroundStaticControls } from "./gold-component-data.js?v=231";

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
  return switchSection("operational-example", html`<h2>${ui("component.operationalExample")}</h2><p>${componentSectionCopy("switch", "operational-example")}</p><div class="switch-scenario"><div class="switch-console"><header>${icon("toggle_on", { tone: "action", fill: true })}<div><strong>Driver settings</strong><small>Persistent on/off controls</small></div></header><div class="switch-stack">${(scenario.items ?? []).map(switchDemoFromData).join("")}</div></div>${componentDetailRationaleCard(scenario.rationaleTitle, scenario.rationale ?? [], "rule")}</div>`, "button-operational-panel", "");
}

function switchAnatomyPanel() {
  const anatomy = componentSectionData("switch", "anatomy").items ?? [];
  return switchSection("anatomy", html`<h2>${ui("component.anatomy")}</h2>${componentDetailAnatomyGrid({ items: anatomy, iconName: "toggle_on" })}`, "", "");
}

function switchAccessibilityPanel() {
  return switchSection("accessibility", html`${componentDetailAccessibilityContent("switch")}`, "", "");
}

function switchVariantsPanel() {
  const variants = componentDemoData("switch", "variants");
  return switchSection("variants", html`<h2>${ui("component.variants")}</h2><p>${componentSectionCopy("switch", "variants")}</p><div class="docs-demo-matrix states-grid">${variants.map((demo) => demoCell(demo.label, switchDemoFromData(demo))).join("")}</div>`, "", "");
}

function switchStatesPanel() {
  const states = componentDemoData("switch", "states");
  return switchSection("states", html`<h2>${ui("component.states")}</h2><p>${componentSectionCopy("switch", "states")}</p><div class="docs-demo-matrix states-grid">${states.map((demo) => demoCell(demo.label, switchDemoFromData(demo))).join("")}</div>`, "", "");
}

function switchStateVariantMatrixPanel() {
  const rows = componentDemoData("switch", "variant-state-behavior", "rows");
  const states = componentDemoData("switch", "variant-state-behavior", "states");
  return switchSection("variant-state-behavior", html`<h2>${ui("component.variantStateBehavior")}</h2><p>${componentSectionCopy("switch", "variant-state-behavior")}</p><div class="docs-demo-matrix docs-demo-matrix--state">${rows.flatMap((row) => states.map((state) => demoCell(`${row.label} · ${state}`, switchDemoFromData(stateDemo(row.setting, state))))).join("")}</div>`, "", "");
}

function switchFullWidthPanel() {
  const items = componentDemoData("switch", "full-width", "items");
  return switchSection("full-width", html`<h2>${ui("component.fullWidth")}</h2><p>${componentSectionCopy("switch", "full-width")}</p><div class="full-width-demo">${items.map((item) => `<div><span class="overline">${item.label}</span>${item.layout === "container" ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}">${switchDemoFromData(demo)}</div>`).join("")}</div>` : `<div class="button-stack${item.layout === "natural" ? " natural" : ""}">${switchDemoFromData(item.demo)}</div>`}</div>`).join("")}</div>`, "", "");
}

function switchResponsivePanel() {
  const examples = componentDemoData("switch", "responsive-layout-patterns", "examples");
  return switchSection("responsive-layout-patterns", html`<h2>${ui("component.responsiveLayoutPatterns")}</h2><p>${componentSectionCopy("switch", "responsive-layout-patterns")}</p><div class="responsive-actions-demo">${examples.map((example) => `<article data-doc-primitive="component-demo-container"><span class="overline">${example.label}</span><div class="${example.layout}" data-density-context="${example.density}">${(example.demos ?? []).map((demo) => switchDemoFromData({ ...demo, density: example.density })).join("")}</div></article>`).join("")}</div>`, "", "");
}

function switchViewportOrganizationPanel() {
  const items = componentDemoData("switch", "viewport-organization", "items");
  return switchSection("viewport-organization", html`<h2>${ui("component.viewportOrganization")}</h2><p>${componentSectionCopy("switch", "viewport-organization")}</p><div class="docs-viewport-matrix">${items.map((item) => `<article data-doc-primitive="component-viewport-demo" data-density-context="${item.density}"><header>${icon(item.icon, { tone: "action" })}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.title}</code>${switchDemoFromData(item.demo)}</article>`).join("")}</div>`, "button-viewport-panel", "");
}

function switchPlaygroundPanel() {
  const playground = componentSectionData("switch", "playground");
  return switchSection("playground", html`<h2>${ui("component.playground")}</h2><p>${componentSectionCopy("switch", "playground")}</p>${demoPlaygroundFrame({ label: ui("component.playground"), controlsAttrs: `aria-label="${ui("playground.switchControls")}"`, controlsHtml: playgroundStaticControls(playground.controls ?? [], "data-component-playground-input"), previewHtml: `<div data-doc-playground-preview data-density-context="${playground.preview?.density ?? "md"}">${switchDemoFromData(playground.preview ?? {})}</div>`, sourceHtml: docsSourceMarkupSlot(playground.snippet ?? ""), source: "switchPlaygroundPanel" })}`, "button-playground", `data-component-playground="switch" data-ready="false"`);
}

function switchContractPanel() {
  return switchSection("api-foundations", html`<h2>${ui("build.apiAndFoundations")}</h2><p>${componentSectionCopy("switch", "api-foundations")}</p>${componentDetailApiPropsTable("switch")}`, "", "");
}

function switchGuidelinesPanel() {
  return switchSection("guidelines", html`${componentDetailGuidelinesContent("switch")}`, "", "");
}

function switchTestPanel() {
  return switchSection("tests-rejection-rules", html`${componentDetailTestsContent("switch")}`, "", "");
}

function switchSection(section, children, className = "", attrs = "") {
  return componentDetailSection({ component: "switch", section, className, attrs, children });
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
