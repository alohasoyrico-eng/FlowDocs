import { artifactDetailTable, examplePanel, html, icon, interpolateList, primitiveExample, referenceCopy, referenceTemplate, threeTabs, ui, listPanel, guidelinesPanel, specPanel, agentPanel } from "./detail-tabs-core.js?v=5";
import { componentDemo } from "./component-demo.js?v=61";

export function primitiveTabs(entry) {
  if (entry.title === "Density") {
    return threeTabs(
      entry,
      `${primitiveOverviewPanel(entry)}${densityCoordinatorPanel()}${primitiveDemoPanel(entry)}${examplePanel(entry)}`,
      `${densityDecisionPanel()}${primitiveResponsibilitiesPanel(entry)}${primitiveTokenChainPanel(entry)}${guidelinesPanel(entry)}`,
      `${primitiveApiPanel(entry)}${specPanel(entry)}${agentPanel(entry, "Primitive")}`,
    );
  }
  return threeTabs(entry, `${primitiveOverviewPanel(entry)}${primitiveDemoPanel(entry)}${examplePanel(entry)}`, `${primitiveResponsibilitiesPanel(entry)}${primitiveTokenChainPanel(entry)}${guidelinesPanel(entry)}`, `${primitiveApiPanel(entry)}${specPanel(entry)}${agentPanel(entry, "Primitive")}`);
}

export function primitiveOverviewPanel(entry) {
  return html`
    <section class="surface docs-section-surface foundation-primitive-detail-surface wide reference-section" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="foundation-primitive-detail">
      <span class="eyebrow">${ui("reference.primitiveOverview")}</span>
      <h2>${entry.title}</h2>
      <p>${entry.summary}</p>
      <p>${referenceCopy.primitive?.overviewCopy}</p>
    </section>
  `;
}

export function densityCoordinatorPanel() {
  const dependencies = referenceCopy.density?.dependencies ?? [];
  return html`
    <section class="surface docs-section-surface foundation-primitive-detail-surface wide density-coordinator-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="foundation-primitive-detail">
      <h2>${ui("reference.coordinatorRole")}</h2>
      <p>${referenceCopy.density?.coordinatorCopy}</p>
      <div class="density-coordinator-grid">
        ${dependencies
          .map(
            ([name, copy, iconName]) => componentDemo("card", { title: name, detail: copy, icon: icon(iconName), variant: "minimal", composition: "standard", fullWidth: true }),
          )
          .join("")}
      </div>
    </section>
  `;
}

export function densityDecisionPanel() {
  const rows = referenceCopy.density?.decisionRows ?? [];
  return html`
    <section class="surface docs-section-surface foundation-primitive-detail-surface wide density-decision-panel" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="foundation-primitive-detail">
      <h2>${ui("reference.densityDecision")}</h2>
      <p>${referenceCopy.density?.decisionCopy}</p>
      <div class="density-decision-grid">
        ${rows
          .map(
            ([density, title, context, outcome]) => html`
              <article data-density-context="${density}">
                <header><strong>${density}</strong><span>${title}</span></header>
                <p>${context}</p>
                <small>${outcome}</small>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

export function primitiveDemoPanel(entry) {
  return html`
    <section class="surface docs-section-surface foundation-primitive-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="foundation-primitive-detail">
      <h2>${ui("reference.liveDemo")}</h2>
      <p>${referenceCopy.primitive?.demoCopy}</p>
      ${primitiveExample(entry)}
    </section>
  `;
}

export function primitiveResponsibilitiesPanel(entry) {
  return listPanel(ui("reference.responsibilities"), interpolateList(referenceCopy.primitive?.responsibilities, entry));
}

export function primitiveTokenChainPanel(entry) {
  return html`
    <section class="surface docs-section-surface foundation-primitive-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="foundation-primitive-detail">
      <h2>${ui("reference.tokenChain")}</h2>
      <p>${referenceCopy.primitive?.tokenChainCopy}</p>
      <div class="architecture-chain">
        ${(referenceCopy.primitive?.tokenChainSteps ?? []).map((step, index) => componentDemo("card", { title: step, status: String(index + 1), variant: "minimal", composition: "standard", fullWidth: true })).join("")}
      </div>
      <div class="token-list">${entry.tokens.map((token) => `<code>${token}</code>`).join("")}</div>
    </section>
  `;
}

export function primitiveApiPanel(entry) {
  return html`
    <section class="surface docs-section-surface foundation-primitive-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="foundation-primitive-detail">
      <h2>${ui("reference.primitiveApi")}</h2>
      ${artifactDetailTable({
        columns: [ui("table.prop"), ui("table.type"), ui("table.required"), ui("table.notes")],
        rows: (referenceCopy.primitive?.apiRows ?? []).map((row) => row.map((value) => referenceTemplate(value, entry))),
      })}
    </section>
  `;
}

export function usagePanel(entry) {
  return listPanel(ui("reference.usageRules"), interpolateList(referenceCopy.primitive?.usageRules, entry));
}

export function anatomyPanel(entry) {
  return listPanel(ui("reference.anatomy"), interpolateList(referenceCopy.primitive?.anatomy, entry));
}

export function statesPanel() {
  return listPanel(ui("reference.requiredStates"), interpolateList(referenceCopy.primitive?.states));
}
