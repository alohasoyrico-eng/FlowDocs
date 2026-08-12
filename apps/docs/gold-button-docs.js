import { componentDetailAccessibilityContent, componentDetailAnatomyGrid, componentDetailFoundationCompactList, componentDetailGuidelineGroupsContent, componentDetailPropsRowsTable, componentDetailRationaleCard, componentDetailSectionAttrs, componentDetailTestsListContent, componentMielPanel, componentSectionCopy, componentSectionData, componentDemoData, demoCell, html, icon, artifactContract, referenceCopy, ui } from "./gold-component-core.js?v=214";
import { componentDemo } from "./component-demo.js?v=60";

import { buttonDemoFromData, playgroundControl } from "./gold-component-data.js?v=230";

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

function buttonSurfaceAttrs(section, className = "", attrs = "") {
  return componentDetailSectionAttrs({ component: "button", section, className, attrs });
}

function buttonContract(entry) {
  return artifactContract(entry) ?? {};
}

function buttonOperationalExamplePanel() {
  const scenario = componentSectionData("button", "operational-example").scenario;
  return html`
    <section ${buttonSurfaceAttrs("operational-example", "button-operational-panel")}>
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
    </section>
  `;
}

function buttonAnatomyPanel(entry) {
  const anatomy = buttonContract(entry).anatomy ?? componentSectionData("button", "anatomy").items ?? [];
  return html`
    <section ${buttonSurfaceAttrs("anatomy")}>
      <h2>${ui("component.anatomy")}</h2>
      ${componentDetailAnatomyGrid({ items: anatomy, iconName: "ads_click" })}
    </section>
  `;
}

function buttonAccessibilitySummaryPanel(entry) {
  const contract = buttonContract(entry);
  return html`
    <section ${buttonSurfaceAttrs("accessibility")}>
      ${componentDetailAccessibilityContent("button", referenceCopy.accessibility?.statePrecedenceFallback, contract.statePrecedence)}
    </section>
  `;
}

function buttonViewportOrganizationPanel() {
  const groups = componentDemoData("button", "viewport-organization", "items");
  return html`
    <section ${buttonSurfaceAttrs("viewport-organization", "button-viewport-panel")}>
      <h2>${ui("component.viewportOrganization")}</h2>
      <p>${componentSectionCopy("button", "viewport-organization")}</p>
      <div class="viewport-doc-grid">
        ${groups
          .map(
            (group) => html`
              <article data-density-context="${group.density}">
                <header>${icon(group.icon)}<h3>${group.title}</h3></header>
                <p>${group.rule}</p>
                <code>${group.layout}</code>
                ${buttonViewportSurface(group)}
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
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
  return html`
    <section ${buttonSurfaceAttrs("playground", "button-playground", 'data-button-playground data-ready="false"')}>
      <h2>${ui("component.playground")}</h2>
      <p>${componentSectionCopy("button", "playground")}</p>
      <div class="playground-layout">
        <form class="playground-controls" aria-label="${ui("playground.buttonControls")}">
          ${(playground.controls ?? []).map((control) => playgroundControl(control, "data-button-playground-input")).join("")}
        </form>
        <div class="playground-preview">
          <div data-button-preview data-density-context="${playground.preview?.density ?? "md"}">${buttonDemoFromData(playground.preview ?? {})}</div>
          <div class="playground-warning" data-button-warning hidden></div>
          <pre data-button-markup></pre>
        </div>
      </div>
    </section>
  `;
}

function buttonContractFromSpecPanel(entry) {
  const contract = buttonContract(entry);
  const props = (contract.props ?? []).filter((prop) => prop.name !== "density");
  const foundations = Object.entries(contract.foundations ?? {});
  return html`
    <section ${buttonSurfaceAttrs("api-foundations")}>
      <h2>${ui("build.apiAndFoundations")}</h2>
      ${componentDetailPropsRowsTable({
        columns: [ui("table.prop"), ui("table.type"), ui("table.default"), ui("table.rule")],
        rows: props.map((prop) => [prop.name, prop.type, prop.default ?? (prop.required ? "required" : "none"), prop.description]),
      })}
      ${componentDetailFoundationCompactList(foundations)}
    </section>
  `;
}

function buttonGuidelinesFromSpecPanel(entry) {
  const guidelines = buttonContract(entry).guidelines ?? {};
  const groups = [
    [ui("guidelines.do"), guidelines.do ?? []],
    [ui("guidelines.doNot"), guidelines.dont ?? []],
    [ui("guidelines.notes"), guidelines.info ?? []],
  ].map(([title, items]) => ({ title, items }));
  return html`
    <section ${buttonSurfaceAttrs("guidelines")}>
      ${componentDetailGuidelineGroupsContent(groups)}
    </section>
  `;
}

function buttonTestContractFromSpecPanel(entry) {
  const tests = (buttonContract(entry).tests ?? []).filter((item) => !/density/i.test(item));
  const rejectIf = (buttonContract(entry).rejectIf ?? []).filter((item) => !/density/i.test(item));
  return html`
    <section ${buttonSurfaceAttrs("tests-rejection-rules")}>
      ${componentDetailTestsListContent({ mustTest: tests, rejectIf })}
    </section>
  `;
}

function buttonStatesPanel() {
  const states = componentDemoData("button", "states");
  return html`
    <section ${buttonSurfaceAttrs("states")}>
      <h2>${ui("component.states")}</h2>
      <p>${componentSectionCopy("button", "states")}</p>
      <div class="button-demo-grid states-grid">
        ${states.map((demo) => demoCell(demo.label, buttonDemoFromData(demo.button))).join("")}
      </div>
    </section>
  `;
}

function buttonVariantsPanel() {
  const variants = componentDemoData("button", "variants");
  return html`
    <section ${buttonSurfaceAttrs("variants")}>
      <h2>${ui("component.variants")}</h2>
      <p>${componentSectionCopy("button", "variants")}</p>
      <div class="button-demo-grid variant-grid">
        ${variants.map((demo) => demoCell(demo.label, buttonDemoFromData(demo.button))).join("")}
      </div>
    </section>
  `;
}

function buttonStateVariantMatrixPanel() {
  const rows = componentDemoData("button", "variant-state-behavior", "rows");
  const states = componentDemoData("button", "variant-state-behavior", "states");
  return html`
    <section ${buttonSurfaceAttrs("variant-state-behavior")}>
      <h2>${ui("component.variantStateBehavior")}</h2>
      <p>${componentSectionCopy("button", "variant-state-behavior")}</p>
      <div class="button-demo-grid state-behavior-grid">
        ${rows
          .flatMap((row) =>
            states.map((state) =>
              demoCell(`${row.label} · ${state}`, buttonDemo(state === "loading" ? "Saving..." : row.label, row.variant, row.intent, "sm", state === "loading" ? "progress_activity" : "", state === "default" ? "" : state, "sm")),
            ),
          )
          .join("")}
      </div>
    </section>
  `;
}

function buttonFullWidthPanel() {
  const items = componentDemoData("button", "full-width", "items");
  return html`
    <section ${buttonSurfaceAttrs("full-width")}>
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
    </section>
  `;
}

function buttonResponsivePanel() {
  const examples = componentDemoData("button", "responsive-layout-patterns", "examples");
  return html`
    <section ${buttonSurfaceAttrs("responsive-layout-patterns")}>
      <h2>${ui("component.responsiveLayoutPatterns")}</h2>
      <p>${componentSectionCopy("button", "responsive-layout-patterns")}</p>
      <div class="responsive-actions-demo">
        ${examples.map((example) => html`
          <article>
            <span class="overline">${example.label}</span>
            <div class="${example.layout}">${example.buttons.map(buttonDemoFromData).join("")}</div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
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
