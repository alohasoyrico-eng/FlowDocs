import { componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, componentApiProps, demoCell, html, icon, ui, slug } from "./gold-component-core.js?v=214";
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

function radioButtonOperationalExamplePanel() {
  const scenario = componentSectionData("radio-button", "operational-example").scenario;
  return html`
    <section class="surface docs-section-surface component-detail-surface wide button-operational-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail">
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
  return html`<section class="surface docs-section-surface component-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail"><h2>${ui("component.anatomy")}</h2><div class="button-anatomy">${anatomy.map((item, index) => `<article><b>${index + 1}</b><div><strong>${item.part}</strong><p>${item.rule}</p><div class="token-list">${item.tokens.map((token) => `<code>${token}</code>`).join("")}</div></div></article>`).join("")}</div></section>`;
}

function radioButtonAccessibilityPanel() {
  const accessibility = componentSectionData("radio-button", "accessibility");
  return html`<section class="surface docs-section-surface component-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail"><h2>${ui("component.accessibility")}</h2><p>State precedence: ${accessibility.statePrecedence}.</p><div class="checklist-grid">${(accessibility.items ?? []).map((item) => `<article>${icon("check_circle", { tone: "success", fill: true })}<span>${item}</span></article>`).join("")}</div></section>`;
}

function radioButtonVariantsPanel() {
  const variants = componentDemoData("radio-button", "variants");
  return html`<section class="surface docs-section-surface component-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail"><h2>${ui("component.variants")}</h2><p>${componentSectionCopy("radio-button", "variants")}</p><div class="button-demo-grid states-grid">${variants.map((demo) => demoCell(demo.variant ?? demo.label, radioButtonDemoFromData(demo))).join("")}</div></section>`;
}

function radioButtonStatesPanel() {
  const states = componentDemoData("radio-button", "states");
  return html`<section class="surface docs-section-surface component-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail"><h2>${ui("component.states")}</h2><p>${componentSectionCopy("radio-button", "states")}</p><div class="button-demo-grid states-grid">${states.map((demo) => demoCell(demo.state ?? demo.label, radioButtonDemoFromData(demo))).join("")}</div></section>`;
}

function radioButtonStateVariantMatrixPanel() {
  const rows = componentDemoData("radio-button", "variant-state-behavior", "rows");
  const states = componentDemoData("radio-button", "variant-state-behavior", "states");
  return html`<section class="surface docs-section-surface component-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail"><h2>${ui("component.variantStateBehavior")}</h2><p>${componentSectionCopy("radio-button", "variant-state-behavior")}</p><div class="button-demo-grid state-behavior-grid">${rows.flatMap((row) => states.map((state) => demoCell(`${row.label} · ${state}`, radioButtonDemoFromData(stateDemo(row.choice, state))))).join("")}</div></section>`;
}

function radioButtonFullWidthPanel() {
  const items = componentDemoData("radio-button", "full-width", "items");
  return html`<section class="surface docs-section-surface component-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail"><h2>${ui("component.fullWidth")}</h2><p>${componentSectionCopy("radio-button", "full-width")}</p><div class="full-width-demo">${items.map((item) => `<div><span class="overline">${item.label}</span>${item.layout === "container" ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}">${radioButtonDemoFromData({ ...demo, name: `radio-container-${slug(item.label)}` })}</div>`).join("")}</div>` : `<div class="button-stack${item.layout === "natural" ? " natural" : ""}">${radioButtonDemoFromData(item.demo)}</div>`}</div>`).join("")}</div></section>`;
}

function radioButtonResponsivePanel() {
  const examples = componentDemoData("radio-button", "responsive-layout-patterns", "examples");
  return html`<section class="surface docs-section-surface component-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail"><h2>${ui("component.responsiveLayoutPatterns")}</h2><p>${componentSectionCopy("radio-button", "responsive-layout-patterns")}</p><div class="responsive-actions-demo">${examples.map((example) => `<article><span class="overline">${example.label}</span><div class="${example.layout}" data-density-context="${example.density}">${(example.demos ?? []).map((demo) => radioButtonDemoFromData({ ...demo, density: example.density, name: `radio-responsive-${slug(example.label)}` })).join("")}</div></article>`).join("")}</div></section>`;
}

function radioButtonViewportOrganizationPanel() {
  const items = componentDemoData("radio-button", "viewport-organization", "items");
  return html`<section class="surface docs-section-surface component-detail-surface wide button-viewport-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail"><h2>${ui("component.viewportOrganization")}</h2><p>${componentSectionCopy("radio-button", "viewport-organization")}</p><div class="viewport-doc-grid">${items.map((item) => `<article data-density-context="${item.density}"><header>${icon(item.icon, { tone: "action" })}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.title}</code>${radioButtonDemoFromData(item.demo)}</article>`).join("")}</div></section>`;
}

function radioButtonPlaygroundPanel() {
  const playground = componentSectionData("radio-button", "playground");
  return html`<section class="surface docs-section-surface component-detail-surface wide button-playground" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail" data-component-playground="radio-button" data-ready="false"><h2>${ui("component.playground")}</h2><p>${componentSectionCopy("radio-button", "playground")}</p><div class="playground-layout"><div class="playground-controls" aria-label="${ui("playground.radioButtonControls")}">${playgroundStaticControls(playground.controls ?? [], "data-component-playground-input")}</div><div class="playground-preview"><div data-component-preview data-density-context="${playground.preview?.density ?? "md"}">${radioButtonDemoFromData(playground.preview ?? {})}</div><pre data-component-markup>${playground.snippet ?? ""}</pre></div></div></section>`;
}

function radioButtonContractPanel() {
  const props = componentApiProps("radio-button");
  return html`<section class="surface docs-section-surface component-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail"><h2>${ui("build.apiAndFoundations")}</h2><p>${componentSectionCopy("radio-button", "api-foundations")}</p><div class="props-table"><div><strong>${ui("table.prop")}</strong><strong>${ui("table.type")}</strong><strong>${ui("table.required")}</strong><strong>${ui("table.notes")}</strong></div>${props.map((prop) => `<div><code>${prop.name}</code><span>${prop.type}</span><span>${prop.required}</span><span>${prop.notes}</span></div>`).join("")}</div></section>`;
}

function radioButtonGuidelinesPanel() {
  const groups = componentSectionData("radio-button", "guidelines").groups ?? [];
  return html`<section class="surface docs-section-surface component-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail"><h2>${ui("guidelines.title")}</h2><div class="guidelines-grid">${groups.map((group) => `<article><h3>${group.title}</h3><ul>${group.items.map((item) => `<li>${item}</li>`).join("")}</ul></article>`).join("")}</div></section>`;
}

function radioButtonTestPanel() {
  const tests = componentSectionData("radio-button", "tests-rejection-rules");
  return html`<section class="surface docs-section-surface component-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-surface-focus-mode="none" data-surface-breakpoint="base" data-state="default" data-doc-template="component-detail"><h2>${ui("tests.title")}</h2><div class="two-column-list"><article><h3>${ui("tests.mustTest")}</h3><ul>${(tests.mustTest ?? []).map((item) => `<li>${item}</li>`).join("")}</ul></article><article><h3>${ui("tests.rejectIf")}</h3><ul>${(tests.rejectIf ?? []).map((item) => `<li>${item}</li>`).join("")}</ul></article></div></section>`;
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
