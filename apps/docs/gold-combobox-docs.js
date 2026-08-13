import {
  simpleAccessibilityPanel,
  simpleAnatomyPanel,
  simpleContractPanel,
  simpleDemo,
  simpleFullWidthPanel,
  simpleGuidelinesPanel,
  simpleOperationalExamplePanel,
  simplePlaygroundPanel,
  simpleResponsivePanel,
  simpleStateVariantMatrixPanel,
  simpleStatesPanel,
  simpleTestPanel,
  simpleVariantsPanel,
  simpleViewportOrganizationPanel,
} from "./gold-simple-component-docs.js?v=260";
import { docsSourceMarkupSlot } from "./docs-code-block.js?v=2";
import { componentDetailRationaleCard, componentDetailSection, componentMielPanel, componentSectionCopy, componentSectionData, demoPlaygroundFrame, html, icon, ui } from "./gold-component-core.js?v=221";
import { playgroundStaticControls } from "./gold-component-data.js?v=231";

export function comboboxDemo(label = "Vehicle", value = "MX-4821 - Ana Gomez", state = "filled") { return simpleDemo("combobox", { label, value, state }); }
export function comboboxDemoFromData(demo = {}) { return simpleDemo("combobox", demo); }

export function renderComboboxGoldSection(entry, section) {
  const renderers = {
    "operational-example": () => comboboxOperationalExamplePanel(),
    anatomy: () => comboboxAnatomyPanel(),
    accessibility: () => comboboxAccessibilityPanel(),
    variants: () => comboboxVariantsPanel(),
    states: () => comboboxStatesPanel(),
    "variant-state-behavior": () => comboboxStateVariantMatrixPanel(),
    "full-width": () => comboboxFullWidthPanel(),
    "responsive-layout-patterns": () => comboboxResponsivePanel(),
    "viewport-organization": () => comboboxViewportOrganizationPanel(),
    playground: () => comboboxPlaygroundPanel(),
    guidelines: () => comboboxGuidelinesPanel(),
    "api-foundations": () => comboboxContractPanel(),
    "tests-rejection-rules": () => comboboxTestPanel(),
    miel: () => componentMielPanel(entry),
  };
  return renderers[section]?.() ?? "";
}

function comboboxSection(section, children, className = "", attrs = "") {
  return componentDetailSection({ component: "combobox", section, className, attrs, children });
}

export function comboboxOperationalExamplePanel() {
  const scenario = componentSectionData("combobox", "operational-example").scenario ?? {
    icon: "manage_search",
    title: "Vehicle lookup",
    meta: "Editable select input",
    items: [{ label: "Vehicle", value: "MX-4821 - Ana Gomez", state: "filled" }],
    rationaleTitle: "Why Combobox",
    rationale: [],
  };
  return comboboxSection("operational-example", html`
      <h2>${ui("component.operationalExample")}</h2>
      <p>${componentSectionCopy("combobox", "operational-example")}</p>
      <div class="simple-scenario">
        <div class="simple-console">
          <header>${icon(scenario.icon, { tone: "action", fill: true })}<div><strong>${scenario.title}</strong><small>${scenario.meta}</small></div></header>
          <div class="docs-demo-row">${(scenario.items ?? []).map(comboboxDemoFromData).join("")}</div>
        </div>
        ${componentDetailRationaleCard(scenario.rationaleTitle, scenario.rationale ?? [], "rule")}
      </div>
  `, "button-operational-panel");
}
export function comboboxAnatomyPanel() { return simpleAnatomyPanel("combobox"); }
export function comboboxAccessibilityPanel() { return simpleAccessibilityPanel("combobox"); }
export function comboboxVariantsPanel() { return simpleVariantsPanel("combobox", comboboxDemoFromData); }
export function comboboxStatesPanel() { return simpleStatesPanel("combobox", comboboxDemoFromData); }
export function comboboxStateVariantMatrixPanel() { return simpleStateVariantMatrixPanel("combobox", comboboxDemoFromData); }
export function comboboxFullWidthPanel() { return simpleFullWidthPanel("combobox", comboboxDemoFromData); }
export function comboboxResponsivePanel() { return simpleResponsivePanel("combobox", comboboxDemoFromData); }
export function comboboxViewportOrganizationPanel() { return simpleViewportOrganizationPanel("combobox", comboboxDemoFromData); }
export function comboboxPlaygroundPanel() {
  const playground = componentSectionData("combobox", "playground");
  return comboboxSection("playground", html`
      <h2>${ui("component.playground")}</h2>
      <p>${componentSectionCopy("combobox", "playground")}</p>
      ${demoPlaygroundFrame({
        label: ui("component.playground"),
        controlsAttrs: `aria-label="${ui("playground.comboboxControls")}"`,
        controlsHtml: playgroundStaticControls(playground.controls ?? [], "data-component-playground-input"),
        previewHtml: `<div data-doc-playground-preview data-density-context="${playground.preview?.density ?? "md"}">${comboboxDemoFromData(playground.preview ?? {})}</div>`,
        sourceHtml: docsSourceMarkupSlot(playground.snippet ?? ""),
        source: "comboboxPlaygroundPanel",
      })}
  `, "button-playground", 'data-component-playground="combobox" data-ready="false"');
}
export function comboboxContractPanel() { return simpleContractPanel("combobox"); }
export function comboboxGuidelinesPanel() { return simpleGuidelinesPanel("combobox"); }
export function comboboxTestPanel() { return simpleTestPanel("combobox"); }
