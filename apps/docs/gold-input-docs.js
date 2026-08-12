import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, componentDetailSectionAttrs, demoCell, html, icon, ui } from "./gold-component-core.js?v=214";
import { componentDemo } from "./component-demo.js?v=60";
import { playgroundStaticControls } from "./gold-component-data.js";

export function renderInputGoldSection(entry, section) {
  const renderers = {
    "operational-example": () => inputOperationalExamplePanel(),
    anatomy: () => inputAnatomyPanel(),
    accessibility: () => inputAccessibilityPanel(),
    variants: () => inputVariantsPanel(),
    states: () => inputStatesPanel(),
    "variant-state-behavior": () => inputStateVariantMatrixPanel(),
    "full-width": () => inputFullWidthPanel(),
    "responsive-layout-patterns": () => inputResponsivePanel(),
    "viewport-organization": () => inputViewportOrganizationPanel(),
    playground: () => inputPlaygroundPanel(),
    guidelines: () => inputGuidelinesPanel(),
    "api-foundations": () => inputContractPanel(),
    "tests-rejection-rules": () => inputTestPanel(),
    miel: () => componentMielPanel(entry),
  };
  return renderers[section]?.() ?? "";
}

function inputOperationalExamplePanel() {
  const scenario = componentSectionData("input", "operational-example").scenario;
  return html`
    <section ${inputSurfaceAttrs("operational-example", "button-operational-panel")}>
      <h2>${ui("component.operationalExample")}</h2>
      <p>${componentSectionCopy("input", "operational-example")}</p>
      <div class="input-scenario">
        <div class="filter-console">
          <header>${icon("edit", { tone: "action", fill: true })}<div><strong>Driver profile</strong><small>Editable operational values</small></div></header>
          <div class="input-stack">${scenario.fields.map(inputDemoFromData).join("")}</div>
        </div>
        <div class="fleet-panel-mini">
          <strong>${scenario.rationaleTitle}</strong>
          <ul>${scenario.rationale.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      </div>
    </section>
  `;
}

function inputAnatomyPanel() {
  const anatomy = componentSectionData("input", "anatomy").items ?? [];
  return html`
    <section ${inputSurfaceAttrs("anatomy")}>
      <h2>${ui("component.anatomy")}</h2>
      ${componentDetailAnatomyGrid({ items: anatomy, iconName: "edit" })}
    </section>
  `;
}

function inputAccessibilityPanel() {
  return html`<section ${inputSurfaceAttrs("accessibility")}>${componentDetailAccessibilityContent("input")}</section>`;
}

function inputVariantsPanel() {
  const variants = componentDemoData("input", "variants");
  return html`
    <section ${inputSurfaceAttrs("variants")}>
      <h2>${ui("component.variants")}</h2>
      <p>${componentSectionCopy("input", "variants")}</p>
      <div class="button-demo-grid states-grid">${variants.map((demo) => demoCell(demo.label, inputDemoFromData(demo))).join("")}</div>
    </section>
  `;
}

function inputStatesPanel() {
  const states = componentDemoData("input", "states");
  return html`
    <section ${inputSurfaceAttrs("states")}>
      <h2>${ui("component.states")}</h2>
      <p>${componentSectionCopy("input", "states")}</p>
      <div class="button-demo-grid states-grid">${states.map((demo) => demoCell(demo.label, inputDemoFromData(demo))).join("")}</div>
    </section>
  `;
}

function inputStateVariantMatrixPanel() {
  const rows = componentDemoData("input", "variant-state-behavior", "rows");
  const states = componentDemoData("input", "variant-state-behavior", "states");
  return html`
    <section ${inputSurfaceAttrs("variant-state-behavior")}>
      <h2>${ui("component.variantStateBehavior")}</h2>
      <p>${componentSectionCopy("input", "variant-state-behavior")}</p>
      <div class="button-demo-grid state-behavior-grid">
        ${rows.flatMap((row) => states.map((state) => demoCell(`${row.label} · ${state}`, inputDemo(row.field, stateValue(row, state), row.placeholder, stateHelper(state), "sm", state, row.icon)))).join("")}
      </div>
    </section>
  `;
}

function inputFullWidthPanel() {
  const items = componentDemoData("input", "full-width", "items");
  return html`
    <section ${inputSurfaceAttrs("full-width")}>
      <h2>${ui("component.fullWidth")}</h2>
      <p>${componentSectionCopy("input", "full-width")}</p>
      <div class="full-width-demo">
        ${items.map((item) => html`
          <div><span class="overline">${item.label}</span>
            ${item.layout === "container" ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}">${inputDemoFromData(demo)}</div>`).join("")}</div>` : `<div class="button-stack${item.layout === "stack-natural" ? " natural" : ""}">${inputDemoFromData(item.demo)}</div>`}
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function inputResponsivePanel() {
  const examples = componentDemoData("input", "responsive-layout-patterns", "examples");
  return html`
    <section ${inputSurfaceAttrs("responsive-layout-patterns")}>
      <h2>${ui("component.responsiveLayoutPatterns")}</h2>
      <p>${componentSectionCopy("input", "responsive-layout-patterns")}</p>
      <div class="responsive-actions-demo">
        ${examples.map((example) => html`
          <article><span class="overline">${example.label}</span>
            ${example.layout === "single" ? `<div data-density-context="${example.density}">${inputDemoFromData(example.demo)}</div>` : `<div class="${example.layout}" data-density-context="${example.density}">${example.demos.map(inputDemoFromData).join("")}</div>`}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function inputViewportOrganizationPanel() {
  const items = componentDemoData("input", "viewport-organization", "items");
  return html`
    <section ${inputSurfaceAttrs("viewport-organization", "button-viewport-panel")}>
      <h2>${ui("component.viewportOrganization")}</h2>
      <p>${componentSectionCopy("input", "viewport-organization")}</p>
      <div class="viewport-doc-grid">
        ${items.map((item) => html`
          <article data-density-context="${item.density}"><header>${icon(item.icon, { tone: "action" })}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.title}</code>${inputDemoFromData(item.demo)}</article>
        `).join("")}
      </div>
    </section>
  `;
}

function inputPlaygroundPanel() {
  const playground = componentSectionData("input", "playground");
  return html`
    <section ${inputSurfaceAttrs("playground", "button-playground", `data-component-playground="input" data-ready="false"`)}>
      <h2>${ui("component.playground")}</h2>
      <p>${componentSectionCopy("input", "playground")}</p>
      <div class="playground-layout">
        <div class="playground-controls" aria-label="${ui("playground.inputControls")}">${playgroundStaticControls(playground.controls ?? [], "data-component-playground-input")}</div>
        <div class="playground-preview"><div data-component-preview data-density-context="${playground.preview?.density ?? "md"}">${inputDemoFromData(playground.preview ?? {})}</div><pre data-component-markup>${playground.snippet ?? ""}</pre></div>
      </div>
    </section>
  `;
}

function inputContractPanel() {
  return html`
    <section ${inputSurfaceAttrs("api-foundations")}>
      <h2>${ui("build.apiAndFoundations")}</h2>
      <p>${componentSectionCopy("input", "api-foundations")}</p>
      ${componentDetailApiPropsTable("input")}
    </section>
  `;
}

function inputGuidelinesPanel() {
  return html`<section ${inputSurfaceAttrs("guidelines")}>${componentDetailGuidelinesContent("input")}</section>`;
}

function inputTestPanel() {
  return html`<section ${inputSurfaceAttrs("tests-rejection-rules")}>${componentDetailTestsContent("input")}</section>`;
}

function inputSurfaceAttrs(section, className = "", attrs = "") {
  return componentDetailSectionAttrs({ component: "input", section, className, attrs });
}

function inputDemoFromData(demo) {
  return inputDemo(demo.field ?? demo.label, demo.value, demo.placeholder, demo.helper, demo.density ?? "md", demo.state ?? "default", inputIconForDemo(demo), demo.suffix ?? "", demo.mono ?? false, demo);
}

export function inputDemo(label, value, placeholder, helper, density = "md", state = "default", leadingIcon = "", suffix = "", mono = false, extra = {}) {
  return componentDemo("input", {
    field: label,
    value,
    placeholder,
    helper,
    density,
    state,
    icon: leadingIcon,
    prefix: extra.prefix ?? "",
    suffix,
    mono,
    variant: extra.variant,
    inputVariant: extra.inputVariant,
    type: extra.type,
    inputMode: extra.inputMode,
    autocomplete: extra.autocomplete,
    align: extra.align,
    revealable: extra.revealable,
  });
}

function inputIconForDemo(demo = {}) {
  if (Object.prototype.hasOwnProperty.call(demo, "icon")) return demo.icon ?? "";
  const variant = demo.variant ?? demo.inputVariant ?? "text";
  if (variant === "email") return "mail";
  if (variant === "password") return "lock";
  if (variant === "currency") return "payments";
  if (variant === "unit" || variant === "number") return "scale";
  if (variant === "search") return "search";
  return "";
}

function stateValue(row, state) {
  if (state === "default" || state === "focus") return row.value || "";
  if (state === "error") return row.value || "ABC";
  return row.value || "MX-2048";
}

function stateHelper(state) {
  if (state === "loading") return "Checking value";
  if (state === "error") return "Fix the value to continue";
  if (state === "disabled") return "Managed by policy";
  return "Operational value";
}
