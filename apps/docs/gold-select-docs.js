import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailRationaleCard, componentDetailSectionAttrs, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, demoCell, html, icon, ui } from "./gold-component-core.js?v=214";
import { componentDemo } from "./component-demo.js?v=60";
import { playgroundStaticControls, selectDemoFromData } from "./gold-component-data.js?v=230";

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

function selectSurfaceAttrs(section, className = "", attrs = "") {
  return componentDetailSectionAttrs({ component: "select", section, className, attrs });
}

function selectOperationalExamplePanel() {
  const scenario = componentSectionData("select", "operational-example").scenario;
  return html`
    <section ${selectSurfaceAttrs("operational-example", "button-operational-panel")}>
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
    </section>
  `;
}

function selectAnatomyPanel() {
  const anatomy = componentSectionData("select", "anatomy").items ?? [];
  return html`
    <section ${selectSurfaceAttrs("anatomy")}>
      <h2>${ui("component.anatomy")}</h2>
      ${componentDetailAnatomyGrid({ items: anatomy, iconName: "arrow_drop_down_circle" })}
    </section>
  `;
}

function selectAccessibilityPanel() {
  return html`<section ${selectSurfaceAttrs("accessibility")}>${componentDetailAccessibilityContent("select", "disabled, loading, error, open, focus, filled, default")}</section>`;
}

function selectViewportOrganizationPanel() {
  const items = componentDemoData("select", "viewport-organization", "items");
  return html`
    <section ${selectSurfaceAttrs("viewport-organization", "button-viewport-panel")}>
      <h2>${ui("component.viewportOrganization")}</h2>
      <p>${componentSectionCopy("select", "viewport-organization")}</p>
      <div class="viewport-doc-grid">
        ${items.map((item) => html`
          <article data-density-context="${item.density}">
            <header>${icon(item.icon)}<h3>${item.title}</h3></header>
            <p>${item.rule}</p>
            <code>${item.title}</code>
            ${selectDemoFromData(item.demo)}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function selectVariantsPanel() {
  const variants = componentDemoData("select", "variants");
  return html`
    <section ${selectSurfaceAttrs("variants")}>
      <h2>${ui("component.variants")}</h2>
      <p>${componentSectionCopy("select", "variants")}</p>
      <div class="button-demo-grid states-grid">
        ${variants.map((demo) => demoCell(demo.label, selectDemo(demo.field, demo.value, demo.helper, demo.density, demo.state, demo.variant, demo.icon ?? ""))).join("")}
      </div>
    </section>
  `;
}

function selectStatesPanel() {
  const states = componentDemoData("select", "states");
  return html`
    <section ${selectSurfaceAttrs("states")}>
      <h2>${ui("component.states")}</h2>
      <p>${componentSectionCopy("select", "states")}</p>
      <div class="button-demo-grid states-grid">
        ${states.map((demo) => demoCell(demo.label, selectDemo(demo.field, demo.value, demo.helper, demo.density, demo.state, demo.variant ?? "default", demo.icon ?? ""))).join("")}
      </div>
    </section>
  `;
}

function selectStateVariantMatrixPanel() {
  const rows = componentDemoData("select", "variant-state-behavior", "rows");
  const states = componentDemoData("select", "variant-state-behavior", "states");
  return html`
    <section ${selectSurfaceAttrs("variant-state-behavior")}>
      <h2>${ui("component.variantStateBehavior")}</h2>
      <p>${componentSectionCopy("select", "variant-state-behavior")}</p>
      <div class="button-demo-grid state-behavior-grid">
        ${rows
          .flatMap((row) =>
            states.map((state) =>
              demoCell(`${row.label} · ${state}`, selectDemo(row.field, state === "loading" ? "Loading..." : row.value, state === "disabled" ? "No permission" : "Operational filter", "sm", state === "default" ? "" : state, "default", row.icon ?? "")),
            ),
          )
          .join("")}
      </div>
    </section>
  `;
}

function selectFullWidthPanel() {
  const items = componentDemoData("select", "full-width", "items");
  return html`
    <section ${selectSurfaceAttrs("full-width")}>
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
    </section>
  `;
}

function selectResponsivePanel() {
  const examples = componentDemoData("select", "responsive-layout-patterns", "examples");
  return html`
    <section ${selectSurfaceAttrs("responsive-layout-patterns")}>
      <h2>${ui("component.responsiveLayoutPatterns")}</h2>
      <p>${componentSectionCopy("select", "responsive-layout-patterns")}</p>
      <div class="responsive-actions-demo">
        ${examples.map((example) => html`
          <article>
            <span class="overline">${example.label}</span>
            ${example.layout === "density-scale"
                ? `<div class="select-density-scale">${example.demos.map((demo) => `<div data-density-label="${demo.density}">${selectDemoFromData(demo)}</div>`).join("")}</div>`
              : `<div class="${example.layout}">${example.demos.map((demo) => selectDemoFromData(demo)).join("")}</div>`}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function selectPlaygroundPanel() {
  const playground = componentSectionData("select", "playground");
  return html`
    <section ${selectSurfaceAttrs("playground", "button-playground", 'data-component-playground="select" data-ready="false"')}>
      <h2>${ui("component.playground")}</h2>
      <p>${componentSectionCopy("select", "playground")}</p>
      <div class="playground-layout">
        <div class="playground-controls" aria-label="${ui("playground.selectControls")}">
          ${playgroundStaticControls(playground.controls ?? [], "data-component-playground-input")}
        </div>
        <div class="playground-preview">
          <div data-component-preview data-density-context="${playground.preview?.density ?? "md"}">${selectDemoFromData(playground.preview ?? {})}</div>
          <pre data-component-markup>${playground.snippet ?? ""}</pre>
        </div>
      </div>
    </section>
  `;
}

function selectContractPanel() {
  return html`
    <section ${selectSurfaceAttrs("api-foundations")}>
      <h2>${ui("build.apiAndFoundations")}</h2>
      <p>${componentSectionCopy("select", "api-foundations")}</p>
      ${componentDetailApiPropsTable("select")}
    </section>
  `;
}

function selectGuidelinesPanel() {
  return html`<section ${selectSurfaceAttrs("guidelines")}>${componentDetailGuidelinesContent("select")}</section>`;
}

function selectTestPanel() {
  return html`<section ${selectSurfaceAttrs("tests-rejection-rules")}>${componentDetailTestsContent("select")}</section>`;
}

export function selectDemo(label, value, helper, density = "", state = "", variant = "default", leadingIcon = "") {
  return componentDemo("select", { field: label, value, helper, density, state, variant, icon: leadingIcon });
}
