import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailFoundationCompactList, componentDetailGuidelineGroupsContent, componentDetailPropsRowsTable, componentDetailRationaleCard, componentDetailSection, componentDetailTestsListContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, demoCell, demoPlaygroundFrame, html, icon, artifactContract, referenceCopy, ui } from "./gold-component-core.js?v=221";
import { docsSourceMarkupSlot } from "./docs-code-block.js?v=2";
import { componentDemo } from "./component-demo.js?v=60";

import { buttonDemoFromData, playgroundControl } from "./gold-component-data.js?v=231";

export function renderButtonGoldSection(entry, section) {
  const renderers = {
    "operational-example": () => buttonOperationalExamplePanel(),
    anatomy: () => buttonAnatomyPanel(entry),
    accessibility: () => buttonAccessibilitySummaryPanel(entry),
    variants: () => buttonVariantsPanel(),
    states: () => buttonStatesPanel(),
    "variant-state-behavior": () => buttonStateVariantMatrixPanel(),
    "full-width": () => buttonFullWidthPanel(),
    "responsive-layout-patterns": () => buttonResponsivePanel(),
    "viewport-organization": () => buttonViewportOrganizationPanel(),
    playground: () => buttonPlaygroundPanel(),
    guidelines: () => buttonGuidelinesFromSpecPanel(entry),
    "api-foundations": () => buttonContractFromSpecPanel(entry),
    "tests-rejection-rules": () => buttonTestContractFromSpecPanel(entry),
    miel: () => componentMielPanel(entry),
  };
  return renderers[section]?.() ?? "";
}

function buttonSection(section, children, className = "", attrs = "") {
  return componentDetailSection({ component: "button", section, className, attrs, children });
}

function buttonContract(entry) {
  return artifactContract(entry) ?? {};
}

function buttonOperationalExamplePanel() {
  const scenario = componentSectionData("button", "operational-example").scenario;
  return buttonSection("operational-example", html`
      <h2>${ui("component.operationalExample")}</h2>
      <p>${componentSectionCopy("button", "operational-example")}</p>
      <div class="button-scenario" data-density-context="md">
        <div class="driver-sheet">
          <header>
            <span>${icon(scenario.sheet.icon)}</span>
            <div><strong>${scenario.sheet.title}</strong><small>${scenario.sheet.meta}</small></div>
          </header>
          <p>${scenario.sheet.body}</p>
          <div class="button-row">
            ${scenario.sheet.actions.map(buttonDemoFromData).join("")}
          </div>
        </div>
        ${componentDetailRationaleCard(scenario.rationaleTitle ?? "Why Button", scenario.rationale ?? scenario.decisions?.map((row) => row.note) ?? [], "rule")}
      </div>
  `, "button-operational-panel");
}

function buttonAnatomyPanel(entry) {
  const anatomy = buttonContract(entry).anatomy ?? componentSectionData("button", "anatomy").items ?? [];
  return buttonSection("anatomy", html`
      <h2>${ui("component.anatomy")}</h2>
      ${componentDetailAnatomyGrid({ items: anatomy, iconName: "ads_click" })}
  `);
}

function buttonAccessibilitySummaryPanel(entry) {
  const contract = buttonContract(entry);
  return buttonSection("accessibility", html`
      ${componentDetailAccessibilityContent("button", referenceCopy.accessibility?.statePrecedenceFallback, contract.statePrecedence)}
  `);
}

function buttonViewportOrganizationPanel() {
  const groups = componentDemoData("button", "viewport-organization", "items");
  return buttonSection("viewport-organization", html`
      <h2>${ui("component.viewportOrganization")}</h2>
      <p>${componentSectionCopy("button", "viewport-organization")}</p>
      <div class="docs-viewport-matrix">
        ${groups
          .map(
            (group) => html`
              <article data-doc-primitive="component-viewport-demo" data-density-context="${group.density}">
                <header>${icon(group.icon)}<h3>${group.title}</h3></header>
                <p>${group.rule}</p>
                <code>${group.layout}</code>
                ${buttonViewportSurface(group)}
              </article>
            `,
          )
          .join("")}
      </div>
  `, "button-viewport-panel");
}

function buttonViewportSurface(group) {
  if (group.surface === "phone") {
    return html`
      <div class="viewport-phone-demo">
        <div>
          <strong>${group.titleText}</strong>
          <p>${group.detail}</p>
        </div>
        ${group.buttons.map(buttonDemoFromData).join("")}
      </div>
    `;
  }
  if (group.surface === "laptop") {
    return html`
      <div class="viewport-laptop-demo">
        <header><strong>${group.titleText}</strong><span>${group.detail}</span></header>
        <div class="button-row">${group.buttons.map(buttonDemoFromData).join("")}</div>
      </div>
    `;
  }
  return html`
    <div class="viewport-tv-demo">
      <strong>${group.titleText}</strong>
      <span>${group.detail}</span>
      <div class="button-row">${group.buttons.map(buttonDemoFromData).join("")}</div>
    </div>
  `;
}

function buttonPlaygroundPanel() {
  const playground = componentSectionData("button", "playground");
  return buttonSection("playground", html`
      <h2>${ui("component.playground")}</h2>
      <p>${componentSectionCopy("button", "playground")}</p>
      ${demoPlaygroundFrame({
        label: ui("component.playground"),
        controlsTag: "form",
        controlsAttrs: `aria-label="${ui("playground.buttonControls")}"`,
        controlsHtml: (playground.controls ?? []).map((control) => playgroundControl(control, "data-button-playground-input")).join(""),
        previewHtml: `<div data-button-preview data-density-context="${playground.preview?.density ?? "md"}">${buttonDemoFromData(playground.preview ?? {})}</div><div class="playground-warning" data-button-warning hidden></div>`,
        sourceHtml: docsSourceMarkupSlot("", "data-button-markup"),
        source: "buttonPlaygroundPanel",
      })}
  `, "button-playground", 'data-button-playground data-ready="false"');
}

function buttonContractFromSpecPanel(entry) {
  const contract = buttonContract(entry);
  const props = (contract.props ?? []).filter((prop) => prop.name !== "density");
  const foundations = Object.entries(contract.foundations ?? {});
  return buttonSection("api-foundations", html`
      <h2>${ui("build.apiAndFoundations")}</h2>
      ${componentDetailPropsRowsTable({
        columns: [ui("table.prop"), ui("table.type"), ui("table.default"), ui("table.rule")],
        rows: props.map((prop) => [prop.name, prop.type, prop.default ?? (prop.required ? "required" : "none"), prop.description]),
      })}
      ${componentDetailFoundationCompactList(foundations)}
  `);
}

function buttonGuidelinesFromSpecPanel(entry) {
  const guidelines = buttonContract(entry).guidelines ?? {};
  const groups = [
    [ui("guidelines.do"), guidelines.do ?? []],
    [ui("guidelines.doNot"), guidelines.dont ?? []],
    [ui("guidelines.notes"), guidelines.info ?? []],
  ].map(([title, items]) => ({ title, items }));
  return buttonSection("guidelines", html`
      ${componentDetailGuidelineGroupsContent(groups)}
  `);
}

function buttonTestContractFromSpecPanel(entry) {
  const tests = (buttonContract(entry).tests ?? []).filter((item) => !/density/i.test(item));
  const rejectIf = (buttonContract(entry).rejectIf ?? []).filter((item) => !/density/i.test(item));
  return buttonSection("tests-rejection-rules", html`
      ${componentDetailTestsListContent({ mustTest: tests, rejectIf })}
  `);
}

function buttonStatesPanel() {
  const states = componentDemoData("button", "states");
  return buttonSection("states", html`
      <h2>${ui("component.states")}</h2>
      <p>${componentSectionCopy("button", "states")}</p>
      <div class="docs-demo-matrix states-grid">
        ${states.map((demo) => demoCell(demo.label, buttonDemoFromData(demo.button))).join("")}
      </div>
  `);
}

function buttonVariantsPanel() {
  const variants = componentDemoData("button", "variants");
  return buttonSection("variants", html`
      <h2>${ui("component.variants")}</h2>
      <p>${componentSectionCopy("button", "variants")}</p>
      <div class="docs-demo-matrix variant-grid">
        ${variants.map((demo) => demoCell(demo.label, buttonDemoFromData(demo.button))).join("")}
      </div>
  `);
}

function buttonStateVariantMatrixPanel() {
  const rows = componentDemoData("button", "variant-state-behavior", "rows");
  const states = componentDemoData("button", "variant-state-behavior", "states");
  return buttonSection("variant-state-behavior", html`
      <h2>${ui("component.variantStateBehavior")}</h2>
      <p>${componentSectionCopy("button", "variant-state-behavior")}</p>
      <div class="docs-demo-matrix docs-demo-matrix--state">
        ${rows
          .flatMap((row) =>
            states.map((state) =>
              demoCell(`${row.label} · ${state}`, buttonDemo(state === "loading" ? "Saving..." : row.label, row.variant, row.intent, "sm", state === "loading" ? "progress_activity" : "", state === "default" ? "" : state, "sm")),
            ),
          )
          .join("")}
      </div>
  `);
}

function buttonFullWidthPanel() {
  const items = componentDemoData("button", "full-width", "items");
  return buttonSection("full-width", html`
      <h2>${ui("component.fullWidth")}</h2>
      <p>${componentSectionCopy("button", "full-width")}</p>
      <div class="full-width-demo">
        ${items.map((item) => html`
          <div>
            <span class="overline">${item.label}</span>
            ${item.layout === "container"
              ? `<div class="container-demo">${item.buttons.map((demo) => `<div data-span="${demo.span}">${buttonDemoFromData(demo)}</div>`).join("")}</div>`
              : `<div class="button-stack${item.layout === "stack-natural" ? " natural" : ""}">${item.buttons.map(buttonDemoFromData).join("")}</div>`}
          </div>
        `).join("")}
      </div>
  `);
}

function buttonResponsivePanel() {
  const examples = componentDemoData("button", "responsive-layout-patterns", "examples");
  return buttonSection("responsive-layout-patterns", html`
      <h2>${ui("component.responsiveLayoutPatterns")}</h2>
      <p>${componentSectionCopy("button", "responsive-layout-patterns")}</p>
      <div class="responsive-actions-demo">
        ${examples.map((example) => html`
          <article data-doc-primitive="component-demo-container">
            <span class="overline">${example.label}</span>
            <div class="${example.layout}">${example.buttons.map(buttonDemoFromData).join("")}</div>
          </article>
        `).join("")}
      </div>
  `);
}

export function buttonDemo(label, variant = "primary", intent = "", size = "", iconName = "", state = "", density = "", trailingIcon = "") {
  const resolvedDensity = density || size || "md";
  return componentDemo("button", {
    label,
    variant: variant.replace(" full", ""),
    intent: intent || "default",
    icon: iconName,
    trailingIcon,
    state,
    density: resolvedDensity,
    fullWidth: variant.includes("full"),
  });
}
