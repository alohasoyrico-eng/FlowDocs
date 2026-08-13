import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailApiPropsTable, componentDetailGuidelinesContent, componentDetailRationaleCard, componentDetailTestsContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, componentDetailSection, demoCell, demoPlaygroundFrame, html, icon, ui } from "./gold-component-core.js?v=221";
import { docsSourceMarkupSlot } from "./docs-code-block.js?v=2";
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
  return inputSection("operational-example", html`
      <h2>${ui("component.operationalExample")}</h2>
      <p>${componentSectionCopy("input", "operational-example")}</p>
      <div class="input-scenario">
        <div class="filter-console">
          <header>${icon("edit", { tone: "action", fill: true })}<div><strong>Driver profile</strong><small>Editable operational values</small></div></header>
          <div class="input-stack">${scenario.fields.map(inputDemoFromData).join("")}</div>
        </div>
        ${componentDetailRationaleCard(scenario.rationaleTitle, scenario.rationale ?? [], "rule")}
      </div>
  `, "button-operational-panel");
}

function inputAnatomyPanel() {
  const anatomy = componentSectionData("input", "anatomy").items ?? [];
  return inputSection("anatomy", html`
      <h2>${ui("component.anatomy")}</h2>
      ${componentDetailAnatomyGrid({ items: anatomy, iconName: "edit" })}
  `);
}

function inputAccessibilityPanel() {
  return inputSection("accessibility", html`${componentDetailAccessibilityContent("input")}`, "", "");
}

function inputVariantsPanel() {
  const variants = componentDemoData("input", "variants");
  return inputSection("variants", html`
      <h2>${ui("component.variants")}</h2>
      <p>${componentSectionCopy("input", "variants")}</p>
      <div class="docs-demo-matrix states-grid">${variants.map((demo) => demoCell(demo.label, inputDemoFromData(demo))).join("")}</div>
  `);
}

function inputStatesPanel() {
  const states = componentDemoData("input", "states");
  return inputSection("states", html`
      <h2>${ui("component.states")}</h2>
      <p>${componentSectionCopy("input", "states")}</p>
      <div class="docs-demo-matrix states-grid">${states.map((demo) => demoCell(demo.label, inputDemoFromData(demo))).join("")}</div>
  `);
}

function inputStateVariantMatrixPanel() {
  const rows = componentDemoData("input", "variant-state-behavior", "rows");
  const states = componentDemoData("input", "variant-state-behavior", "states");
  return inputSection("variant-state-behavior", html`
      <h2>${ui("component.variantStateBehavior")}</h2>
      <p>${componentSectionCopy("input", "variant-state-behavior")}</p>
      <div class="docs-demo-matrix docs-demo-matrix--state">
        ${rows.flatMap((row) => states.map((state) => demoCell(`${row.label} · ${state}`, inputDemo(row.field, stateValue(row, state), row.placeholder, stateHelper(state), "sm", state, row.icon)))).join("")}
      </div>
  `);
}

function inputFullWidthPanel() {
  const items = componentDemoData("input", "full-width", "items");
  return inputSection("full-width", html`
      <h2>${ui("component.fullWidth")}</h2>
      <p>${componentSectionCopy("input", "full-width")}</p>
      <div class="full-width-demo">
        ${items.map((item) => html`
          <div><span class="overline">${item.label}</span>
            ${item.layout === "container" ? `<div class="container-demo">${item.demos.map((demo) => `<div data-span="${demo.span}">${inputDemoFromData(demo)}</div>`).join("")}</div>` : `<div class="button-stack${item.layout === "stack-natural" ? " natural" : ""}">${inputDemoFromData(item.demo)}</div>`}
          </div>
        `).join("")}
      </div>
  `);
}

function inputResponsivePanel() {
  const examples = componentDemoData("input", "responsive-layout-patterns", "examples");
  return inputSection("responsive-layout-patterns", html`
      <h2>${ui("component.responsiveLayoutPatterns")}</h2>
      <p>${componentSectionCopy("input", "responsive-layout-patterns")}</p>
      <div class="responsive-actions-demo">
        ${examples.map((example) => html`
          <article data-doc-primitive="component-demo-container"><span class="overline">${example.label}</span>
            ${example.layout === "single" ? `<div data-density-context="${example.density}">${inputDemoFromData(example.demo)}</div>` : `<div class="${example.layout}" data-density-context="${example.density}">${example.demos.map(inputDemoFromData).join("")}</div>`}
          </article>
        `).join("")}
      </div>
  `);
}

function inputViewportOrganizationPanel() {
  const items = componentDemoData("input", "viewport-organization", "items");
  return inputSection("viewport-organization", html`
      <h2>${ui("component.viewportOrganization")}</h2>
      <p>${componentSectionCopy("input", "viewport-organization")}</p>
      <div class="docs-viewport-matrix">
        ${items.map((item) => html`
          <article data-doc-primitive="component-viewport-demo" data-density-context="${item.density}"><header>${icon(item.icon, { tone: "action" })}<h3>${item.title}</h3></header><p>${item.rule}</p><code>${item.title}</code>${inputDemoFromData(item.demo)}</article>
        `).join("")}
      </div>
  `, "button-viewport-panel");
}

function inputPlaygroundPanel() {
  const playground = componentSectionData("input", "playground");
  return inputSection("playground", html`
      <h2>${ui("component.playground")}</h2>
      <p>${componentSectionCopy("input", "playground")}</p>
      ${demoPlaygroundFrame({
        label: ui("component.playground"),
        controlsAttrs: `aria-label="${ui("playground.inputControls")}"`,
        controlsHtml: playgroundStaticControls(playground.controls ?? [], "data-component-playground-input"),
        previewHtml: `<div data-doc-playground-preview data-density-context="${playground.preview?.density ?? "md"}">${inputDemoFromData(playground.preview ?? {})}</div>`,
        sourceHtml: docsSourceMarkupSlot(playground.snippet ?? ""),
        source: "inputPlaygroundPanel",
      })}
  `, "button-playground", `data-component-playground="input" data-ready="false"`);
}

function inputContractPanel() {
  return inputSection("api-foundations", html`
      <h2>${ui("build.apiAndFoundations")}</h2>
      <p>${componentSectionCopy("input", "api-foundations")}</p>
      ${componentDetailApiPropsTable("input")}
  `);
}

function inputGuidelinesPanel() {
  return inputSection("guidelines", html`${componentDetailGuidelinesContent("input")}`, "", "");
}

function inputTestPanel() {
  return inputSection("tests-rejection-rules", html`${componentDetailTestsContent("input")}`, "", "");
}

function inputSection(section, children, className = "", attrs = "") {
  return componentDetailSection({ component: "input", section, className, attrs, children });
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
