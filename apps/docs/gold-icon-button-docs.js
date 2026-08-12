import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, componentDetailSectionAttrs, demoCell, html, icon, ui } from "./gold-component-core.js?v=214";
import { componentDemo } from "./component-demo.js?v=60";
import { playgroundStaticControls } from "./gold-component-data.js?v=230";

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
  return html`<section ${iconButtonSurfaceAttrs("operational-example", "button-operational-panel")}><h2>${ui("component.operationalExample")}</h2><p>${componentSectionCopy("icon-button", "operational-example")}</p><div class="icon-button-scenario"><div class="icon-button-console"><header>${icon("touch_app", { tone: "action", fill: true })}<div><strong>Topbar utilities</strong><small>Language, grid, and contrast</small></div></header><div class="icon-button-toolbar">${(scenario.items ?? []).map(iconButtonDemoFromData).join("")}</div></div><div class="fleet-panel-mini"><strong>${scenario.rationaleTitle}</strong><ul>${(scenario.rationale ?? []).map((item) => `<li>${item}</li>`).join("")}</ul></div></div></section>`;
}

function iconButtonAnatomyPanel() {
  const anatomy = componentSectionData("icon-button", "anatomy").items ?? [];
  return html`<section ${iconButtonSurfaceAttrs("anatomy")}><h2>${ui("component.anatomy")}</h2>${componentDetailAnatomyGrid({ items: anatomy, iconName: "ads_click" })}</section>`;
}

function iconButtonAccessibilityPanel() {
  return html`<section ${iconButtonSurfaceAttrs("accessibility")}>${componentDetailAccessibilityContent("icon-button")}</section>`;
}

function iconButtonVariantsPanel() {
  const variants = componentDemoData("icon-button", "variants");
  return html`<section ${iconButtonSurfaceAttrs("variants")}><h2>${ui("component.variants")}</h2><p>${componentSectionCopy("icon-button", "variants")}</p><div class="button-demo-grid states-grid">${variants.map((demo) => demoCell(demo.label, iconButtonDemoFromData(demo))).join("")}</div></section>`;
}

function iconButtonStatesPanel() {
  const states = componentDemoData("icon-button", "states");
  return html`<section ${iconButtonSurfaceAttrs("states")}><h2>${ui("component.states")}</h2><p>${componentSectionCopy("icon-button", "states")}</p><div class="button-demo-grid states-grid">${states.map((demo) => demoCell(demo.label, iconButtonDemoFromData(demo))).join("")}</div></section>`;
}

function iconButtonStateVariantMatrixPanel() {
  const rows = componentDemoData("icon-button", "variant-state-behavior", "rows");
  const states = componentDemoData("icon-button", "variant-state-behavior", "states");
  return html`<section ${iconButtonSurfaceAttrs("variant-state-behavior")}><h2>${ui("component.variantStateBehavior")}</h2><p>${componentSectionCopy("icon-button", "variant-state-behavior")}</p><div class="button-demo-grid state-behavior-grid">${rows.flatMap((row) => states.map((state) => demoCell(`${row.label} · ${state}`, iconButtonDemoFromData(stateDemo(row.button, state))))).join("")}</div></section>`;
}

function iconButtonFullWidthPanel() {
  const items = componentDemoData("icon-button", "full-width", "items");
  return html`<section ${iconButtonSurfaceAttrs("full-width")}><h2>${ui("component.fullWidth")}</h2><p>${componentSectionCopy("icon-button", "full-width")}</p><div class="full-width-demo">${items.map((item) => `<div><span class="overline">${item.label}</span>${item.layout === "container" ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}"><div class="icon-button-toolbar">${iconButtonDemoFromData(demo)}</div></div>`).join("")}</div>` : `<div class="icon-button-toolbar">${(item.demos ?? [item.demo]).map(iconButtonDemoFromData).join("")}</div>`}</div>`).join("")}</div></section>`;
}

function iconButtonResponsivePanel() {
  const examples = componentDemoData("icon-button", "responsive-layout-patterns", "examples");
  return html`<section ${iconButtonSurfaceAttrs("responsive-layout-patterns")}><h2>${ui("component.responsiveLayoutPatterns")}</h2><p>${componentSectionCopy("icon-button", "responsive-layout-patterns")}</p><div class="responsive-actions-demo">${examples.map((example) => `<article><span class="overline">${example.label}</span><div class="${example.layout}" data-density-context="${example.density}">${(example.demos ?? []).map((demo) => iconButtonDemoFromData({ ...demo, density: example.density })).join("")}</div></article>`).join("")}</div></section>`;
}

function iconButtonViewportOrganizationPanel() {
  const items = componentDemoData("icon-button", "viewport-organization", "items");
  return html`<section ${iconButtonSurfaceAttrs("viewport-organization", "button-viewport-panel")}><h2>${ui("component.viewportOrganization")}</h2><p>${componentSectionCopy("icon-button", "viewport-organization")}</p><div class="viewport-doc-grid">${items.map((item) => `<article data-density-context="${item.density}"><header>${icon(item.icon, { tone: "action" })}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.title}</code><div class="icon-button-toolbar">${iconButtonDemoFromData({ ...item.demo, density: item.density })}</div></article>`).join("")}</div></section>`;
}

function iconButtonPlaygroundPanel() {
  const playground = componentSectionData("icon-button", "playground");
  return html`<section ${iconButtonSurfaceAttrs("playground", "button-playground", `data-component-playground="icon-button" data-ready="false"`)}><h2>${ui("component.playground")}</h2><p>${componentSectionCopy("icon-button", "playground")}</p><div class="playground-layout"><div class="playground-controls" aria-label="${ui("playground.iconButtonControls")}">${playgroundStaticControls(playground.controls ?? [], "data-component-playground-input")}</div><div class="playground-preview"><div data-component-preview data-density-context="${playground.preview?.density ?? "md"}">${iconButtonDemoFromData(playground.preview ?? {})}</div><pre data-component-markup>${playground.snippet ?? ""}</pre></div></div></section>`;
}

function iconButtonContractPanel() {
  return html`<section ${iconButtonSurfaceAttrs("api-foundations")}><h2>${ui("build.apiAndFoundations")}</h2><p>${componentSectionCopy("icon-button", "api-foundations")}</p>${componentDetailApiPropsTable("icon-button")}</section>`;
}

function iconButtonGuidelinesPanel() {
  return html`<section ${iconButtonSurfaceAttrs("guidelines")}>${componentDetailGuidelinesContent("icon-button")}</section>`;
}

function iconButtonTestPanel() {
  return html`<section ${iconButtonSurfaceAttrs("tests-rejection-rules")}>${componentDetailTestsContent("icon-button")}</section>`;
}

function iconButtonSurfaceAttrs(section, className = "", attrs = "") {
  return componentDetailSectionAttrs({ component: "icon-button", section, className, attrs });
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
