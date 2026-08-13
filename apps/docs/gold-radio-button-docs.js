import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailRationaleCard, componentDetailSection, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, demoCell, demoPlaygroundFrame, html, icon, ui, slug } from "./gold-component-core.js?v=221";
import { docsSourceMarkupSlot } from "./docs-code-block.js?v=2";
import { componentDemo } from "./component-demo.js?v=60";
import { playgroundStaticControls } from "./gold-component-data.js?v=231";

export function renderRadioButtonGoldSection(entry, section) {
  const renderers = {
    "operational-example": () => radioButtonOperationalExamplePanel(),
    anatomy: () => radioButtonAnatomyPanel(),
    accessibility: () => radioButtonAccessibilityPanel(),
    variants: () => radioButtonVariantsPanel(),
    states: () => radioButtonStatesPanel(),
    "variant-state-behavior": () => radioButtonStateVariantMatrixPanel(),
    "full-width": () => radioButtonFullWidthPanel(),
    "responsive-layout-patterns": () => radioButtonResponsivePanel(),
    "viewport-organization": () => radioButtonViewportOrganizationPanel(),
    playground: () => radioButtonPlaygroundPanel(),
    guidelines: () => radioButtonGuidelinesPanel(),
    "api-foundations": () => radioButtonContractPanel(),
    "tests-rejection-rules": () => radioButtonTestPanel(),
    miel: () => componentMielPanel(entry),
  };
  return renderers[section]?.() ?? "";
}

function radioButtonSection(section, children, className = "", attrs = "") {
  return componentDetailSection({ component: "radio-button", section, className, attrs, children });
}

function radioButtonOperationalExamplePanel() {
  const scenario = componentSectionData("radio-button", "operational-example").scenario;
  return radioButtonSection("operational-example", html`
      <h2>${ui("component.operationalExample")}</h2>
      <p>${componentSectionCopy("radio-button", "operational-example")}</p>
      <div class="radio-scenario">
        <div class="radio-console">
          <header>${icon("radio_button_checked", { tone: "action", fill: true })}<div><strong>Route preference</strong><small>Atomic exclusive-choice options</small></div></header>
          <div class="radio-stack">${(scenario.items ?? []).map((demo) => radioButtonDemoFromData({ ...demo, name: "route-preference-demo" })).join("")}</div>
        </div>
        ${componentDetailRationaleCard(scenario.rationaleTitle, scenario.rationale ?? [], "rule")}
      </div>
  `, "button-operational-panel");
}

function radioButtonAnatomyPanel() {
  const anatomy = componentSectionData("radio-button", "anatomy").items ?? [];
  return radioButtonSection("anatomy", html`<h2>${ui("component.anatomy")}</h2>${componentDetailAnatomyGrid({ items: anatomy, iconName: "radio_button_checked" })}`, "", "");
}

function radioButtonAccessibilityPanel() {
  return radioButtonSection("accessibility", html`${componentDetailAccessibilityContent("radio-button")}`, "", "");
}

function radioButtonVariantsPanel() {
  const variants = componentDemoData("radio-button", "variants");
  return radioButtonSection("variants", html`<h2>${ui("component.variants")}</h2><p>${componentSectionCopy("radio-button", "variants")}</p><div class="docs-demo-matrix states-grid">${variants.map((demo) => demoCell(demo.variant ?? demo.label, radioButtonDemoFromData(demo))).join("")}</div>`, "", "");
}

function radioButtonStatesPanel() {
  const states = componentDemoData("radio-button", "states");
  return radioButtonSection("states", html`<h2>${ui("component.states")}</h2><p>${componentSectionCopy("radio-button", "states")}</p><div class="docs-demo-matrix states-grid">${states.map((demo) => demoCell(demo.state ?? demo.label, radioButtonDemoFromData(demo))).join("")}</div>`, "", "");
}

function radioButtonStateVariantMatrixPanel() {
  const rows = componentDemoData("radio-button", "variant-state-behavior", "rows");
  const states = componentDemoData("radio-button", "variant-state-behavior", "states");
  return radioButtonSection("variant-state-behavior", html`<h2>${ui("component.variantStateBehavior")}</h2><p>${componentSectionCopy("radio-button", "variant-state-behavior")}</p><div class="docs-demo-matrix docs-demo-matrix--state">${rows.flatMap((row) => states.map((state) => demoCell(`${row.label} · ${state}`, radioButtonDemoFromData(stateDemo(row.choice, state))))).join("")}</div>`, "", "");
}

function radioButtonFullWidthPanel() {
  const items = componentDemoData("radio-button", "full-width", "items");
  return radioButtonSection("full-width", html`<h2>${ui("component.fullWidth")}</h2><p>${componentSectionCopy("radio-button", "full-width")}</p><div class="full-width-demo">${items.map((item) => `<div><span class="overline">${item.label}</span>${item.layout === "container" ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}">${radioButtonDemoFromData({ ...demo, name: `radio-container-${slug(item.label)}` })}</div>`).join("")}</div>` : `<div class="button-stack${item.layout === "natural" ? " natural" : ""}">${radioButtonDemoFromData(item.demo)}</div>`}</div>`).join("")}</div>`, "", "");
}

function radioButtonResponsivePanel() {
  const examples = componentDemoData("radio-button", "responsive-layout-patterns", "examples");
  return radioButtonSection("responsive-layout-patterns", html`<h2>${ui("component.responsiveLayoutPatterns")}</h2><p>${componentSectionCopy("radio-button", "responsive-layout-patterns")}</p><div class="responsive-actions-demo">${examples.map((example) => `<article data-doc-primitive="component-demo-container"><span class="overline">${example.label}</span><div class="${example.layout}" data-density-context="${example.density}">${(example.demos ?? []).map((demo) => radioButtonDemoFromData({ ...demo, density: example.density, name: `radio-responsive-${slug(example.label)}` })).join("")}</div></article>`).join("")}</div>`, "", "");
}

function radioButtonViewportOrganizationPanel() {
  const items = componentDemoData("radio-button", "viewport-organization", "items");
  return radioButtonSection("viewport-organization", html`<h2>${ui("component.viewportOrganization")}</h2><p>${componentSectionCopy("radio-button", "viewport-organization")}</p><div class="docs-viewport-matrix">${items.map((item) => `<article data-doc-primitive="component-viewport-demo" data-density-context="${item.density}"><header>${icon(item.icon, { tone: "action" })}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.title}</code>${radioButtonDemoFromData(item.demo)}</article>`).join("")}</div>`, "button-viewport-panel", "");
}

function radioButtonPlaygroundPanel() {
  const playground = componentSectionData("radio-button", "playground");
  return radioButtonSection("playground", html`<h2>${ui("component.playground")}</h2><p>${componentSectionCopy("radio-button", "playground")}</p>${demoPlaygroundFrame({ label: ui("component.playground"), controlsAttrs: `aria-label="${ui("playground.radioButtonControls")}"`, controlsHtml: playgroundStaticControls(playground.controls ?? [], "data-component-playground-input"), previewHtml: `<div data-doc-playground-preview data-density-context="${playground.preview?.density ?? "md"}">${radioButtonDemoFromData(playground.preview ?? {})}</div>`, sourceHtml: docsSourceMarkupSlot(playground.snippet ?? ""), source: "radioButtonPlaygroundPanel" })}`, "button-playground", 'data-component-playground="radio-button" data-ready="false"');
}

function radioButtonContractPanel() {
  return radioButtonSection("api-foundations", html`<h2>${ui("build.apiAndFoundations")}</h2><p>${componentSectionCopy("radio-button", "api-foundations")}</p>${componentDetailApiPropsTable("radio-button")}`, "", "");
}

function radioButtonGuidelinesPanel() {
  return radioButtonSection("guidelines", html`${componentDetailGuidelinesContent("radio-button")}`, "", "");
}

function radioButtonTestPanel() {
  return radioButtonSection("tests-rejection-rules", html`${componentDetailTestsContent("radio-button")}`, "", "");
}

function radioButtonDemoFromData(demo) {
  const state = demo.state ?? "unselected";
  const checked = state === "selected" || Boolean(demo.checked);
  return radioButtonDemo(demo.label, demo.value ?? slug(demo.label), demo.description ?? "", checked, state, demo.density ?? "md", demo.name, demo.variant ?? "default", demo.error ?? "");
}

export function radioButtonDemo(label, value, description = "", checked = false, state = "unselected", density = "md", name = "", variant = "default", error = "") {
  const isSelected = state === "selected" || (checked && state !== "unselected");
  const radioName = name || `radio-${slug(`${label}-${value}-${state}-${density}`)}`;
  return componentDemo("radio-button", { label, value, description, checked: isSelected, state, density, name: radioName, variant, error });
}

function stateDemo(choice, state) {
  return { ...choice, state, checked: state === "selected" || state === "disabled", description: state === "error" ? "Select an available option." : choice.description };
}
