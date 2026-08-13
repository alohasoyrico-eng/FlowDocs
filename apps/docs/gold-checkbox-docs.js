import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailRationaleCard, componentDetailSection, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, demoCell, demoPlaygroundFrame, html, icon, ui } from "./gold-component-core.js?v=221";
import { docsSourceMarkupSlot } from "./docs-code-block.js?v=2";
import { componentDemo } from "./component-demo.js?v=60";
import { playgroundStaticControls } from "./gold-component-data.js?v=231";

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

function checkboxSection(section, children, className = "", attrs = "") {
  return componentDetailSection({ component: "checkbox", section, className, attrs, children });
}

function checkboxOperationalExamplePanel() {
  const scenario = componentSectionData("checkbox", "operational-example").scenario;
  return checkboxSection("operational-example", html`
      <h2>${ui("component.operationalExample")}</h2>
      <p>${componentSectionCopy("checkbox", "operational-example")}</p>
      <div class="checkbox-scenario">
        <div class="checkbox-console">
          <header>${icon("checklist", { tone: "action", fill: true })}<div><strong>Driver permissions</strong><small>Selection and policy controls</small></div></header>
          <div class="checkbox-stack">${(scenario.items ?? []).map(checkboxDemoFromData).join("")}</div>
        </div>
        ${componentDetailRationaleCard(scenario.rationaleTitle, scenario.rationale ?? [], "rule")}
      </div>
  `, "button-operational-panel");
}

function checkboxAnatomyPanel() {
  const anatomy = componentSectionData("checkbox", "anatomy").items ?? [];
  return checkboxSection("anatomy", html`
      <h2>${ui("component.anatomy")}</h2>
      ${componentDetailAnatomyGrid({ items: anatomy, iconName: "check_box" })}
  `);
}

function checkboxAccessibilityPanel() {
  return checkboxSection("accessibility", html`${componentDetailAccessibilityContent("checkbox")}`, "", "");
}

function checkboxVariantsPanel() {
  const variants = componentDemoData("checkbox", "variants");
  return checkboxSection("variants", html`
      <h2>${ui("component.variants")}</h2>
      <p>${componentSectionCopy("checkbox", "variants")}</p>
      <div class="docs-demo-matrix states-grid">${variants.map((demo) => demoCell(demo.label, checkboxDemoFromData(demo))).join("")}</div>
  `);
}

function checkboxStatesPanel() {
  const states = componentDemoData("checkbox", "states");
  return checkboxSection("states", html`
      <h2>${ui("component.states")}</h2>
      <p>${componentSectionCopy("checkbox", "states")}</p>
      <div class="docs-demo-matrix states-grid">${states.map((demo) => demoCell(demo.label, checkboxDemoFromData(demo))).join("")}</div>
  `);
}

function checkboxStateVariantMatrixPanel() {
  const rows = componentDemoData("checkbox", "variant-state-behavior", "rows");
  const states = componentDemoData("checkbox", "variant-state-behavior", "states");
  return checkboxSection("variant-state-behavior", html`
      <h2>${ui("component.variantStateBehavior")}</h2>
      <p>${componentSectionCopy("checkbox", "variant-state-behavior")}</p>
      <div class="docs-demo-matrix docs-demo-matrix--state">
        ${rows.flatMap((row) => states.map((state) => demoCell(`${row.label} · ${state}`, checkboxDemoFromData(stateDemo(row.choice, state))))).join("")}
      </div>
  `);
}

function checkboxFullWidthPanel() {
  const items = componentDemoData("checkbox", "full-width", "items");
  return checkboxSection("full-width", html`
      <h2>${ui("component.fullWidth")}</h2>
      <p>${componentSectionCopy("checkbox", "full-width")}</p>
      <div class="full-width-demo">
        ${items.map((item) => html`
          <div><span class="overline">${item.label}</span>
            ${item.layout === "container" ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}">${checkboxDemoFromData(demo)}</div>`).join("")}</div>` : `<div class="button-stack${item.layout === "natural" ? " natural" : ""}">${checkboxDemoFromData(item.demo)}</div>`}
          </div>
        `).join("")}
      </div>
  `);
}

function checkboxResponsivePanel() {
  const examples = componentDemoData("checkbox", "responsive-layout-patterns", "examples");
  return checkboxSection("responsive-layout-patterns", html`
      <h2>${ui("component.responsiveLayoutPatterns")}</h2>
      <p>${componentSectionCopy("checkbox", "responsive-layout-patterns")}</p>
      <div class="responsive-actions-demo">
        ${examples.map((example) => html`
          <article data-doc-primitive="component-demo-container"><span class="overline">${example.label}</span>
            <div class="${example.layout}" data-density-context="${example.density}">${(example.demos ?? []).map((demo) => checkboxDemoFromData({ ...demo, density: example.density })).join("")}</div>
          </article>
        `).join("")}
      </div>
  `);
}

function checkboxViewportOrganizationPanel() {
  const items = componentDemoData("checkbox", "viewport-organization", "items");
  return checkboxSection("viewport-organization", html`
      <h2>${ui("component.viewportOrganization")}</h2>
      <p>${componentSectionCopy("checkbox", "viewport-organization")}</p>
      <div class="docs-viewport-matrix">
        ${items.map((item) => html`
          <article data-doc-primitive="component-viewport-demo" data-density-context="${item.density}"><header>${icon(item.icon, { tone: "action" })}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.title}</code>${checkboxDemoFromData(item.demo)}</article>
        `).join("")}
      </div>
  `, "button-viewport-panel");
}

function checkboxPlaygroundPanel() {
  const playground = componentSectionData("checkbox", "playground");
  return checkboxSection("playground", html`
      <h2>${ui("component.playground")}</h2>
      <p>${componentSectionCopy("checkbox", "playground")}</p>
      ${demoPlaygroundFrame({
        label: ui("component.playground"),
        controlsAttrs: `aria-label="${ui("playground.checkboxControls")}"`,
        controlsHtml: playgroundStaticControls(playground.controls ?? [], "data-component-playground-input"),
        previewHtml: `<div data-doc-playground-preview data-density-context="${playground.preview?.density ?? "md"}">${checkboxDemoFromData(playground.preview ?? {})}</div>`,
        sourceHtml: docsSourceMarkupSlot(playground.snippet ?? ""),
        source: "checkboxPlaygroundPanel",
      })}
  `, "button-playground", 'data-component-playground="checkbox" data-ready="false"');
}

function checkboxContractPanel() {
  return checkboxSection("api-foundations", html`
      <h2>${ui("build.apiAndFoundations")}</h2>
      <p>${componentSectionCopy("checkbox", "api-foundations")}</p>
      ${componentDetailApiPropsTable("checkbox")}
  `);
}

function checkboxGuidelinesPanel() {
  return checkboxSection("guidelines", html`${componentDetailGuidelinesContent("checkbox")}`, "", "");
}

function checkboxTestPanel() {
  return checkboxSection("tests-rejection-rules", html`${componentDetailTestsContent("checkbox")}`, "", "");
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
