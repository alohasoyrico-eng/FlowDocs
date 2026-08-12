import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailSectionAttrs, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, demoCell, html, icon, ui, slug } from "./gold-component-core.js?v=214";
import { componentDemo } from "./component-demo.js?v=60";
import { playgroundStaticControls } from "./gold-component-data.js?v=230";

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

function radioButtonSurfaceAttrs(section, className = "", attrs = "") {
  return componentDetailSectionAttrs({ component: "radio-button", section, className, attrs });
}

function radioButtonOperationalExamplePanel() {
  const scenario = componentSectionData("radio-button", "operational-example").scenario;
  return html`
    <section ${radioButtonSurfaceAttrs("operational-example", "button-operational-panel")}>
      <h2>${ui("component.operationalExample")}</h2>
      <p>${componentSectionCopy("radio-button", "operational-example")}</p>
      <div class="radio-scenario">
        <div class="radio-console">
          <header>${icon("radio_button_checked", { tone: "action", fill: true })}<div><strong>Route preference</strong><small>Atomic exclusive-choice options</small></div></header>
          <div class="radio-stack">${(scenario.items ?? []).map((demo) => radioButtonDemoFromData({ ...demo, name: "route-preference-demo" })).join("")}</div>
        </div>
        <div class="fleet-panel-mini"><strong>${scenario.rationaleTitle}</strong><ul>${(scenario.rationale ?? []).map((item) => `<li>${item}</li>`).join("")}</ul></div>
      </div>
    </section>
  `;
}

function radioButtonAnatomyPanel() {
  const anatomy = componentSectionData("radio-button", "anatomy").items ?? [];
  return html`<section ${radioButtonSurfaceAttrs("anatomy")}><h2>${ui("component.anatomy")}</h2>${componentDetailAnatomyGrid({ items: anatomy, iconName: "radio_button_checked" })}</section>`;
}

function radioButtonAccessibilityPanel() {
  return html`<section ${radioButtonSurfaceAttrs("accessibility")}>${componentDetailAccessibilityContent("radio-button")}</section>`;
}

function radioButtonVariantsPanel() {
  const variants = componentDemoData("radio-button", "variants");
  return html`<section ${radioButtonSurfaceAttrs("variants")}><h2>${ui("component.variants")}</h2><p>${componentSectionCopy("radio-button", "variants")}</p><div class="button-demo-grid states-grid">${variants.map((demo) => demoCell(demo.variant ?? demo.label, radioButtonDemoFromData(demo))).join("")}</div></section>`;
}

function radioButtonStatesPanel() {
  const states = componentDemoData("radio-button", "states");
  return html`<section ${radioButtonSurfaceAttrs("states")}><h2>${ui("component.states")}</h2><p>${componentSectionCopy("radio-button", "states")}</p><div class="button-demo-grid states-grid">${states.map((demo) => demoCell(demo.state ?? demo.label, radioButtonDemoFromData(demo))).join("")}</div></section>`;
}

function radioButtonStateVariantMatrixPanel() {
  const rows = componentDemoData("radio-button", "variant-state-behavior", "rows");
  const states = componentDemoData("radio-button", "variant-state-behavior", "states");
  return html`<section ${radioButtonSurfaceAttrs("variant-state-behavior")}><h2>${ui("component.variantStateBehavior")}</h2><p>${componentSectionCopy("radio-button", "variant-state-behavior")}</p><div class="button-demo-grid state-behavior-grid">${rows.flatMap((row) => states.map((state) => demoCell(`${row.label} · ${state}`, radioButtonDemoFromData(stateDemo(row.choice, state))))).join("")}</div></section>`;
}

function radioButtonFullWidthPanel() {
  const items = componentDemoData("radio-button", "full-width", "items");
  return html`<section ${radioButtonSurfaceAttrs("full-width")}><h2>${ui("component.fullWidth")}</h2><p>${componentSectionCopy("radio-button", "full-width")}</p><div class="full-width-demo">${items.map((item) => `<div><span class="overline">${item.label}</span>${item.layout === "container" ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}">${radioButtonDemoFromData({ ...demo, name: `radio-container-${slug(item.label)}` })}</div>`).join("")}</div>` : `<div class="button-stack${item.layout === "natural" ? " natural" : ""}">${radioButtonDemoFromData(item.demo)}</div>`}</div>`).join("")}</div></section>`;
}

function radioButtonResponsivePanel() {
  const examples = componentDemoData("radio-button", "responsive-layout-patterns", "examples");
  return html`<section ${radioButtonSurfaceAttrs("responsive-layout-patterns")}><h2>${ui("component.responsiveLayoutPatterns")}</h2><p>${componentSectionCopy("radio-button", "responsive-layout-patterns")}</p><div class="responsive-actions-demo">${examples.map((example) => `<article><span class="overline">${example.label}</span><div class="${example.layout}" data-density-context="${example.density}">${(example.demos ?? []).map((demo) => radioButtonDemoFromData({ ...demo, density: example.density, name: `radio-responsive-${slug(example.label)}` })).join("")}</div></article>`).join("")}</div></section>`;
}

function radioButtonViewportOrganizationPanel() {
  const items = componentDemoData("radio-button", "viewport-organization", "items");
  return html`<section ${radioButtonSurfaceAttrs("viewport-organization", "button-viewport-panel")}><h2>${ui("component.viewportOrganization")}</h2><p>${componentSectionCopy("radio-button", "viewport-organization")}</p><div class="viewport-doc-grid">${items.map((item) => `<article data-density-context="${item.density}"><header>${icon(item.icon, { tone: "action" })}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.title}</code>${radioButtonDemoFromData(item.demo)}</article>`).join("")}</div></section>`;
}

function radioButtonPlaygroundPanel() {
  const playground = componentSectionData("radio-button", "playground");
  return html`<section ${radioButtonSurfaceAttrs("playground", "button-playground", 'data-component-playground="radio-button" data-ready="false"')}><h2>${ui("component.playground")}</h2><p>${componentSectionCopy("radio-button", "playground")}</p><div class="playground-layout"><div class="playground-controls" aria-label="${ui("playground.radioButtonControls")}">${playgroundStaticControls(playground.controls ?? [], "data-component-playground-input")}</div><div class="playground-preview"><div data-component-preview data-density-context="${playground.preview?.density ?? "md"}">${radioButtonDemoFromData(playground.preview ?? {})}</div><pre data-component-markup>${playground.snippet ?? ""}</pre></div></div></section>`;
}

function radioButtonContractPanel() {
  return html`<section ${radioButtonSurfaceAttrs("api-foundations")}><h2>${ui("build.apiAndFoundations")}</h2><p>${componentSectionCopy("radio-button", "api-foundations")}</p>${componentDetailApiPropsTable("radio-button")}</section>`;
}

function radioButtonGuidelinesPanel() {
  return html`<section ${radioButtonSurfaceAttrs("guidelines")}>${componentDetailGuidelinesContent("radio-button")}</section>`;
}

function radioButtonTestPanel() {
  return html`<section ${radioButtonSurfaceAttrs("tests-rejection-rules")}>${componentDetailTestsContent("radio-button")}</section>`;
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
