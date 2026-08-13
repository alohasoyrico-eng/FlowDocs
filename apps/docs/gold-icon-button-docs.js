import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailRationaleCard, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, componentDetailSection, demoCell, demoPlaygroundFrame, html, icon, ui } from "./gold-component-core.js?v=221";
import { docsSourceMarkupSlot } from "./docs-code-block.js?v=2";
import { componentDemo } from "./component-demo.js?v=60";
import { playgroundStaticControls } from "./gold-component-data.js?v=231";

export function renderIconButtonGoldSection(entry, section) {
  const renderers = {
    "operational-example": () => iconButtonOperationalExamplePanel(),
    anatomy: () => iconButtonAnatomyPanel(),
    accessibility: () => iconButtonAccessibilityPanel(),
    variants: () => iconButtonVariantsPanel(),
    states: () => iconButtonStatesPanel(),
    "variant-state-behavior": () => iconButtonStateVariantMatrixPanel(),
    "full-width": () => iconButtonFullWidthPanel(),
    "responsive-layout-patterns": () => iconButtonResponsivePanel(),
    "viewport-organization": () => iconButtonViewportOrganizationPanel(),
    playground: () => iconButtonPlaygroundPanel(),
    guidelines: () => iconButtonGuidelinesPanel(),
    "api-foundations": () => iconButtonContractPanel(),
    "tests-rejection-rules": () => iconButtonTestPanel(),
    miel: () => componentMielPanel(entry),
  };
  return renderers[section]?.() ?? "";
}

function iconButtonOperationalExamplePanel() {
  const scenario = componentSectionData("icon-button", "operational-example").scenario;
  return iconButtonSection("operational-example", html`<h2>${ui("component.operationalExample")}</h2><p>${componentSectionCopy("icon-button", "operational-example")}</p><div class="icon-button-scenario"><div class="icon-button-console"><header>${icon("touch_app", { tone: "action", fill: true })}<div><strong>Topbar utilities</strong><small>Language, grid, and contrast</small></div></header><div class="icon-button-toolbar">${(scenario.items ?? []).map(iconButtonDemoFromData).join("")}</div></div>${componentDetailRationaleCard(scenario.rationaleTitle, scenario.rationale ?? [], "rule")}</div>`, "button-operational-panel", "");
}

function iconButtonAnatomyPanel() {
  const anatomy = componentSectionData("icon-button", "anatomy").items ?? [];
  return iconButtonSection("anatomy", html`<h2>${ui("component.anatomy")}</h2>${componentDetailAnatomyGrid({ items: anatomy, iconName: "ads_click" })}`, "", "");
}

function iconButtonAccessibilityPanel() {
  return iconButtonSection("accessibility", html`${componentDetailAccessibilityContent("icon-button")}`, "", "");
}

function iconButtonVariantsPanel() {
  const variants = componentDemoData("icon-button", "variants");
  return iconButtonSection("variants", html`<h2>${ui("component.variants")}</h2><p>${componentSectionCopy("icon-button", "variants")}</p><div class="docs-demo-matrix states-grid">${variants.map((demo) => demoCell(demo.label, iconButtonDemoFromData(demo))).join("")}</div>`, "", "");
}

function iconButtonStatesPanel() {
  const states = componentDemoData("icon-button", "states");
  return iconButtonSection("states", html`<h2>${ui("component.states")}</h2><p>${componentSectionCopy("icon-button", "states")}</p><div class="docs-demo-matrix states-grid">${states.map((demo) => demoCell(demo.label, iconButtonDemoFromData(demo))).join("")}</div>`, "", "");
}

function iconButtonStateVariantMatrixPanel() {
  const rows = componentDemoData("icon-button", "variant-state-behavior", "rows");
  const states = componentDemoData("icon-button", "variant-state-behavior", "states");
  return iconButtonSection("variant-state-behavior", html`<h2>${ui("component.variantStateBehavior")}</h2><p>${componentSectionCopy("icon-button", "variant-state-behavior")}</p><div class="docs-demo-matrix docs-demo-matrix--state">${rows.flatMap((row) => states.map((state) => demoCell(`${row.label} · ${state}`, iconButtonDemoFromData(stateDemo(row.button, state))))).join("")}</div>`, "", "");
}

function iconButtonFullWidthPanel() {
  const items = componentDemoData("icon-button", "full-width", "items");
  return iconButtonSection("full-width", html`<h2>${ui("component.fullWidth")}</h2><p>${componentSectionCopy("icon-button", "full-width")}</p><div class="full-width-demo">${items.map((item) => `<div><span class="overline">${item.label}</span>${item.layout === "container" ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}"><div class="icon-button-toolbar">${iconButtonDemoFromData(demo)}</div></div>`).join("")}</div>` : `<div class="icon-button-toolbar">${(item.demos ?? [item.demo]).map(iconButtonDemoFromData).join("")}</div>`}</div>`).join("")}</div>`, "", "");
}

function iconButtonResponsivePanel() {
  const examples = componentDemoData("icon-button", "responsive-layout-patterns", "examples");
  return iconButtonSection("responsive-layout-patterns", html`<h2>${ui("component.responsiveLayoutPatterns")}</h2><p>${componentSectionCopy("icon-button", "responsive-layout-patterns")}</p><div class="responsive-actions-demo">${examples.map((example) => `<article data-doc-primitive="component-demo-container"><span class="overline">${example.label}</span><div class="${example.layout}" data-density-context="${example.density}">${(example.demos ?? []).map((demo) => iconButtonDemoFromData({ ...demo, density: example.density })).join("")}</div></article>`).join("")}</div>`, "", "");
}

function iconButtonViewportOrganizationPanel() {
  const items = componentDemoData("icon-button", "viewport-organization", "items");
  return iconButtonSection("viewport-organization", html`<h2>${ui("component.viewportOrganization")}</h2><p>${componentSectionCopy("icon-button", "viewport-organization")}</p><div class="docs-viewport-matrix">${items.map((item) => `<article data-doc-primitive="component-viewport-demo" data-density-context="${item.density}"><header>${icon(item.icon, { tone: "action" })}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.title}</code><div class="icon-button-toolbar">${iconButtonDemoFromData({ ...item.demo, density: item.density })}</div></article>`).join("")}</div>`, "button-viewport-panel", "");
}

function iconButtonPlaygroundPanel() {
  const playground = componentSectionData("icon-button", "playground");
  return iconButtonSection("playground", html`<h2>${ui("component.playground")}</h2><p>${componentSectionCopy("icon-button", "playground")}</p>${demoPlaygroundFrame({ label: ui("component.playground"), controlsAttrs: `aria-label="${ui("playground.iconButtonControls")}"`, controlsHtml: playgroundStaticControls(playground.controls ?? [], "data-component-playground-input"), previewHtml: `<div data-doc-playground-preview data-density-context="${playground.preview?.density ?? "md"}">${iconButtonDemoFromData(playground.preview ?? {})}</div>`, sourceHtml: docsSourceMarkupSlot(playground.snippet ?? ""), source: "iconButtonPlaygroundPanel" })}`, "button-playground", `data-component-playground="icon-button" data-ready="false"`);
}

function iconButtonContractPanel() {
  return iconButtonSection("api-foundations", html`<h2>${ui("build.apiAndFoundations")}</h2><p>${componentSectionCopy("icon-button", "api-foundations")}</p>${componentDetailApiPropsTable("icon-button")}`, "", "");
}

function iconButtonGuidelinesPanel() {
  return iconButtonSection("guidelines", html`${componentDetailGuidelinesContent("icon-button")}`, "", "");
}

function iconButtonTestPanel() {
  return iconButtonSection("tests-rejection-rules", html`${componentDetailTestsContent("icon-button")}`, "", "");
}

function iconButtonSection(section, children, className = "", attrs = "") {
  return componentDetailSection({ component: "icon-button", section, className, attrs, children });
}

function iconButtonDemoFromData(demo) {
  return iconButtonDemo(demo.icon ?? "grid_view", demo.ariaLabel ?? "Show grid", demo.variant ?? "ghost", Boolean(demo.selected), Boolean(demo.badge), demo.state ?? "default", demo.density ?? "md");
}

export function iconButtonDemo(iconName, ariaLabel, variant = "ghost", selected = false, badge = false, state = "default", density = "md") {
  return componentDemo("icon-button", { icon: iconName, ariaLabel, variant, selected, badge, state, density });
}

function stateDemo(button, state) {
  return { ...button, state, selected: state === "selected" || Boolean(button.selected), badge: state === "badged" || Boolean(button.badge) };
}
