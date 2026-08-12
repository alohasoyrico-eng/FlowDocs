import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailSectionAttrs, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, demoCell, html, icon, ui } from "./gold-component-core.js?v=214";
import { componentDemo } from "./component-demo.js?v=60";
import { playgroundStaticControls } from "./gold-component-data.js?v=230";

export function renderCheckboxGoldSection(entry, section) {
  const renderers = {
    "operational-example": () => checkboxOperationalExamplePanel(),
    anatomy: () => checkboxAnatomyPanel(),
    accessibility: () => checkboxAccessibilityPanel(),
    variants: () => checkboxVariantsPanel(),
    states: () => checkboxStatesPanel(),
    "variant-state-behavior": () => checkboxStateVariantMatrixPanel(),
    "full-width": () => checkboxFullWidthPanel(),
    "responsive-layout-patterns": () => checkboxResponsivePanel(),
    "viewport-organization": () => checkboxViewportOrganizationPanel(),
    playground: () => checkboxPlaygroundPanel(),
    guidelines: () => checkboxGuidelinesPanel(),
    "api-foundations": () => checkboxContractPanel(),
    "tests-rejection-rules": () => checkboxTestPanel(),
    miel: () => componentMielPanel(entry),
  };
  return renderers[section]?.() ?? "";
}

function checkboxSurfaceAttrs(section, className = "", attrs = "") {
  return componentDetailSectionAttrs({ component: "checkbox", section, className, attrs });
}

function checkboxOperationalExamplePanel() {
  const scenario = componentSectionData("checkbox", "operational-example").scenario;
  return html`
    <section ${checkboxSurfaceAttrs("operational-example", "button-operational-panel")}>
      <h2>${ui("component.operationalExample")}</h2>
      <p>${componentSectionCopy("checkbox", "operational-example")}</p>
      <div class="checkbox-scenario">
        <div class="checkbox-console">
          <header>${icon("checklist", { tone: "action", fill: true })}<div><strong>Driver permissions</strong><small>Selection and policy controls</small></div></header>
          <div class="checkbox-stack">${(scenario.items ?? []).map(checkboxDemoFromData).join("")}</div>
        </div>
        <div class="fleet-panel-mini">
          <strong>${scenario.rationaleTitle}</strong>
          <ul>${(scenario.rationale ?? []).map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      </div>
    </section>
  `;
}

function checkboxAnatomyPanel() {
  const anatomy = componentSectionData("checkbox", "anatomy").items ?? [];
  return html`
    <section ${checkboxSurfaceAttrs("anatomy")}>
      <h2>${ui("component.anatomy")}</h2>
      ${componentDetailAnatomyGrid({ items: anatomy, iconName: "check_box" })}
    </section>
  `;
}

function checkboxAccessibilityPanel() {
  return html`<section ${checkboxSurfaceAttrs("accessibility")}>${componentDetailAccessibilityContent("checkbox")}</section>`;
}

function checkboxVariantsPanel() {
  const variants = componentDemoData("checkbox", "variants");
  return html`
    <section ${checkboxSurfaceAttrs("variants")}>
      <h2>${ui("component.variants")}</h2>
      <p>${componentSectionCopy("checkbox", "variants")}</p>
      <div class="button-demo-grid states-grid">${variants.map((demo) => demoCell(demo.label, checkboxDemoFromData(demo))).join("")}</div>
    </section>
  `;
}

function checkboxStatesPanel() {
  const states = componentDemoData("checkbox", "states");
  return html`
    <section ${checkboxSurfaceAttrs("states")}>
      <h2>${ui("component.states")}</h2>
      <p>${componentSectionCopy("checkbox", "states")}</p>
      <div class="button-demo-grid states-grid">${states.map((demo) => demoCell(demo.label, checkboxDemoFromData(demo))).join("")}</div>
    </section>
  `;
}

function checkboxStateVariantMatrixPanel() {
  const rows = componentDemoData("checkbox", "variant-state-behavior", "rows");
  const states = componentDemoData("checkbox", "variant-state-behavior", "states");
  return html`
    <section ${checkboxSurfaceAttrs("variant-state-behavior")}>
      <h2>${ui("component.variantStateBehavior")}</h2>
      <p>${componentSectionCopy("checkbox", "variant-state-behavior")}</p>
      <div class="button-demo-grid state-behavior-grid">
        ${rows.flatMap((row) => states.map((state) => demoCell(`${row.label} · ${state}`, checkboxDemoFromData(stateDemo(row.choice, state))))).join("")}
      </div>
    </section>
  `;
}

function checkboxFullWidthPanel() {
  const items = componentDemoData("checkbox", "full-width", "items");
  return html`
    <section ${checkboxSurfaceAttrs("full-width")}>
      <h2>${ui("component.fullWidth")}</h2>
      <p>${componentSectionCopy("checkbox", "full-width")}</p>
      <div class="full-width-demo">
        ${items.map((item) => html`
          <div><span class="overline">${item.label}</span>
            ${item.layout === "container" ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}">${checkboxDemoFromData(demo)}</div>`).join("")}</div>` : `<div class="button-stack${item.layout === "natural" ? " natural" : ""}">${checkboxDemoFromData(item.demo)}</div>`}
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function checkboxResponsivePanel() {
  const examples = componentDemoData("checkbox", "responsive-layout-patterns", "examples");
  return html`
    <section ${checkboxSurfaceAttrs("responsive-layout-patterns")}>
      <h2>${ui("component.responsiveLayoutPatterns")}</h2>
      <p>${componentSectionCopy("checkbox", "responsive-layout-patterns")}</p>
      <div class="responsive-actions-demo">
        ${examples.map((example) => html`
          <article><span class="overline">${example.label}</span>
            <div class="${example.layout}" data-density-context="${example.density}">${(example.demos ?? []).map((demo) => checkboxDemoFromData({ ...demo, density: example.density })).join("")}</div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function checkboxViewportOrganizationPanel() {
  const items = componentDemoData("checkbox", "viewport-organization", "items");
  return html`
    <section ${checkboxSurfaceAttrs("viewport-organization", "button-viewport-panel")}>
      <h2>${ui("component.viewportOrganization")}</h2>
      <p>${componentSectionCopy("checkbox", "viewport-organization")}</p>
      <div class="viewport-doc-grid">
        ${items.map((item) => html`
          <article data-density-context="${item.density}"><header>${icon(item.icon, { tone: "action" })}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.title}</code>${checkboxDemoFromData(item.demo)}</article>
        `).join("")}
      </div>
    </section>
  `;
}

function checkboxPlaygroundPanel() {
  const playground = componentSectionData("checkbox", "playground");
  return html`
    <section ${checkboxSurfaceAttrs("playground", "button-playground", 'data-component-playground="checkbox" data-ready="false"')}>
      <h2>${ui("component.playground")}</h2>
      <p>${componentSectionCopy("checkbox", "playground")}</p>
      <div class="playground-layout">
        <div class="playground-controls" aria-label="${ui("playground.checkboxControls")}">${playgroundStaticControls(playground.controls ?? [], "data-component-playground-input")}</div>
        <div class="playground-preview"><div data-component-preview data-density-context="${playground.preview?.density ?? "md"}">${checkboxDemoFromData(playground.preview ?? {})}</div><pre data-component-markup>${playground.snippet ?? ""}</pre></div>
      </div>
    </section>
  `;
}

function checkboxContractPanel() {
  return html`
    <section ${checkboxSurfaceAttrs("api-foundations")}>
      <h2>${ui("build.apiAndFoundations")}</h2>
      <p>${componentSectionCopy("checkbox", "api-foundations")}</p>
      ${componentDetailApiPropsTable("checkbox")}
    </section>
  `;
}

function checkboxGuidelinesPanel() {
  return html`<section ${checkboxSurfaceAttrs("guidelines")}>${componentDetailGuidelinesContent("checkbox")}</section>`;
}

function checkboxTestPanel() {
  return html`<section ${checkboxSurfaceAttrs("tests-rejection-rules")}>${componentDetailTestsContent("checkbox")}</section>`;
}

function checkboxDemoFromData(demo) {
  return checkboxDemo(demo.label, demo.description ?? "", demo.checked ?? false, demo.indeterminate ?? false, demo.state ?? "unchecked", demo.density ?? "md", demo.variant ?? "default", demo.error ?? "");
}

export function checkboxDemo(label, description = "", checked = false, indeterminate = false, state = "unchecked", density = "md", variant = "default", error = "") {
  return componentDemo("checkbox", { label, description, checked, indeterminate, state, density, variant, error });
}

function stateDemo(choice, state) {
  return {
    ...choice,
    state,
    checked: state === "checked" || state === "disabled",
    indeterminate: state === "indeterminate",
    description: state === "error" ? "Required before continuing." : choice.description,
  };
}
