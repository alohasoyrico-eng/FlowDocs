import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailRationaleCard, componentDetailSection, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, demoCell, demoPlaygroundFrame, html, icon, ui } from "./gold-component-core.js?v=221";
import { docsSourceMarkupSlot } from "./docs-code-block.js?v=2";
import { componentDemo } from "./component-demo.js?v=60";
import { playgroundStaticControls, selectDemoFromData } from "./gold-component-data.js?v=231";

export function renderSelectGoldSection(entry, section) {
  const renderers = {
    "operational-example": () => selectOperationalExamplePanel(),
    anatomy: () => selectAnatomyPanel(),
    accessibility: () => selectAccessibilityPanel(),
    variants: () => selectVariantsPanel(),
    states: () => selectStatesPanel(),
    "variant-state-behavior": () => selectStateVariantMatrixPanel(),
    "full-width": () => selectFullWidthPanel(),
    "responsive-layout-patterns": () => selectResponsivePanel(),
    "viewport-organization": () => selectViewportOrganizationPanel(),
    playground: () => selectPlaygroundPanel(),
    guidelines: () => selectGuidelinesPanel(),
    "api-foundations": () => selectContractPanel(),
    "tests-rejection-rules": () => selectTestPanel(),
    miel: () => componentMielPanel(entry),
  };
  return renderers[section]?.() ?? "";
}

function selectSection(section, children, className = "", attrs = "") {
  return componentDetailSection({ component: "select", section, className, attrs, children });
}

function selectOperationalExamplePanel() {
  const scenario = componentSectionData("select", "operational-example").scenario;
  return selectSection("operational-example", html`
      <h2>${ui("component.operationalExample")}</h2>
      <p>${componentSectionCopy("select", "operational-example")}</p>
      <div class="select-scenario">
        <div class="filter-console">
          <header>
            <span>${icon(scenario.console.icon)}</span>
            <div><strong>${scenario.console.title}</strong><small>${scenario.console.meta}</small></div>
          </header>
          <div class="select-stack">
            ${scenario.console.fields.map(selectDemoFromData).join("")}
          </div>
        </div>
        ${componentDetailRationaleCard(scenario.rationaleTitle, scenario.rationale ?? [], "rule")}
      </div>
  `, "button-operational-panel");
}

function selectAnatomyPanel() {
  const anatomy = componentSectionData("select", "anatomy").items ?? [];
  return selectSection("anatomy", html`
      <h2>${ui("component.anatomy")}</h2>
      ${componentDetailAnatomyGrid({ items: anatomy, iconName: "arrow_drop_down_circle" })}
  `);
}

function selectAccessibilityPanel() {
  return selectSection("accessibility", html`${componentDetailAccessibilityContent("select", "disabled, loading, error, open, focus, filled, default")}`, "", "");
}

function selectViewportOrganizationPanel() {
  const items = componentDemoData("select", "viewport-organization", "items");
  return selectSection("viewport-organization", html`
      <h2>${ui("component.viewportOrganization")}</h2>
      <p>${componentSectionCopy("select", "viewport-organization")}</p>
      <div class="docs-viewport-matrix">
        ${items.map((item) => html`
          <article data-doc-primitive="component-viewport-demo" data-density-context="${item.density}">
            <header>${icon(item.icon)}<h3>${item.title}</h3></header>
            <p>${item.rule}</p>
            <code>${item.title}</code>
            ${selectDemoFromData(item.demo)}
          </article>
        `).join("")}
      </div>
  `, "button-viewport-panel");
}

function selectVariantsPanel() {
  const variants = componentDemoData("select", "variants");
  return selectSection("variants", html`
      <h2>${ui("component.variants")}</h2>
      <p>${componentSectionCopy("select", "variants")}</p>
      <div class="docs-demo-matrix states-grid">
        ${variants.map((demo) => demoCell(demo.label, selectDemo(demo.field, demo.value, demo.helper, demo.density, demo.state, demo.variant, demo.icon ?? ""))).join("")}
      </div>
  `);
}

function selectStatesPanel() {
  const states = componentDemoData("select", "states");
  return selectSection("states", html`
      <h2>${ui("component.states")}</h2>
      <p>${componentSectionCopy("select", "states")}</p>
      <div class="docs-demo-matrix states-grid">
        ${states.map((demo) => demoCell(demo.label, selectDemo(demo.field, demo.value, demo.helper, demo.density, demo.state, demo.variant ?? "default", demo.icon ?? ""))).join("")}
      </div>
  `);
}

function selectStateVariantMatrixPanel() {
  const rows = componentDemoData("select", "variant-state-behavior", "rows");
  const states = componentDemoData("select", "variant-state-behavior", "states");
  return selectSection("variant-state-behavior", html`
      <h2>${ui("component.variantStateBehavior")}</h2>
      <p>${componentSectionCopy("select", "variant-state-behavior")}</p>
      <div class="docs-demo-matrix docs-demo-matrix--state">
        ${rows
          .flatMap((row) =>
            states.map((state) =>
              demoCell(`${row.label} · ${state}`, selectDemo(row.field, state === "loading" ? "Loading..." : row.value, state === "disabled" ? "No permission" : "Operational filter", "sm", state === "default" ? "" : state, "default", row.icon ?? "")),
            ),
          )
          .join("")}
      </div>
  `);
}

function selectFullWidthPanel() {
  const items = componentDemoData("select", "full-width", "items");
  return selectSection("full-width", html`
      <h2>${ui("component.fullWidth")}</h2>
      <p>${componentSectionCopy("select", "full-width")}</p>
      <div class="full-width-demo">
        ${items.map((item) => html`
          <div>
            <span class="overline">${item.label}</span>
            ${item.layout === "container"
              ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}">${selectDemoFromData(demo)}</div>`).join("")}</div>`
              : `<div class="button-stack${item.layout === "stack-natural" ? " natural" : ""}">${selectDemoFromData(item.demo)}</div>`}
          </div>
        `).join("")}
      </div>
  `);
}

function selectResponsivePanel() {
  const examples = componentDemoData("select", "responsive-layout-patterns", "examples");
  return selectSection("responsive-layout-patterns", html`
      <h2>${ui("component.responsiveLayoutPatterns")}</h2>
      <p>${componentSectionCopy("select", "responsive-layout-patterns")}</p>
      <div class="responsive-actions-demo">
        ${examples.map((example) => html`
          <article data-doc-primitive="component-demo-container">
            <span class="overline">${example.label}</span>
            ${example.layout === "density-scale"
                ? `<div class="select-density-scale">${example.demos.map((demo) => `<div data-density-label="${demo.density}">${selectDemoFromData(demo)}</div>`).join("")}</div>`
              : `<div class="${example.layout}">${example.demos.map((demo) => selectDemoFromData(demo)).join("")}</div>`}
          </article>
        `).join("")}
      </div>
  `);
}

function selectPlaygroundPanel() {
  const playground = componentSectionData("select", "playground");
  return selectSection("playground", html`
      <h2>${ui("component.playground")}</h2>
      <p>${componentSectionCopy("select", "playground")}</p>
      ${demoPlaygroundFrame({
        label: ui("component.playground"),
        controlsAttrs: `aria-label="${ui("playground.selectControls")}"`,
        controlsHtml: playgroundStaticControls(playground.controls ?? [], "data-component-playground-input"),
        previewHtml: `<div data-doc-playground-preview data-density-context="${playground.preview?.density ?? "md"}">${selectDemoFromData(playground.preview ?? {})}</div>`,
        sourceHtml: docsSourceMarkupSlot(playground.snippet ?? ""),
        source: "selectPlaygroundPanel",
      })}
  `, "button-playground", 'data-component-playground="select" data-ready="false"');
}

function selectContractPanel() {
  return selectSection("api-foundations", html`
      <h2>${ui("build.apiAndFoundations")}</h2>
      <p>${componentSectionCopy("select", "api-foundations")}</p>
      ${componentDetailApiPropsTable("select")}
  `);
}

function selectGuidelinesPanel() {
  return selectSection("guidelines", html`${componentDetailGuidelinesContent("select")}`, "", "");
}

function selectTestPanel() {
  return selectSection("tests-rejection-rules", html`${componentDetailTestsContent("select")}`, "", "");
}

export function selectDemo(label, value, helper, density = "", state = "", variant = "default", leadingIcon = "") {
  return componentDemo("select", { field: label, value, helper, density, state, variant, icon: leadingIcon });
}
