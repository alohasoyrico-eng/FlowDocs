import { artifactDetailTable, examplePanel, html, icon, interpolateList, primitiveExample, referenceCopy, referenceTemplate, threeTabs, ui, listPanel, guidelinesPanel, specPanel, agentPanel } from "./detail-tabs-core.js?v=10";
import { componentDemo } from "./component-demo.js?v=61";
import { documentationSectionIsland } from "./documentation-section-island.js?v=1";

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

function primitiveSection(title, body, className = "wide") {
  return documentationSectionIsland({
    title,
    bodyHtml: body,
    className: ["foundation-primitive-detail-surface", className].filter(Boolean).join(" "),
    template: "foundation-primitive-detail",
    source: "primitive-tabs",
  });
}

export function primitiveOverviewPanel(entry) {
  return primitiveSection(entry.title, html`
      <p>${entry.summary}</p>
      <p>${referenceCopy.primitive?.overviewCopy}</p>
  `, "wide reference-section");
}

export function densityCoordinatorPanel() {
  const dependencies = referenceCopy.density?.dependencies ?? [];
  return primitiveSection(ui("reference.coordinatorRole"), html`
      <p>${referenceCopy.density?.coordinatorCopy}</p>
      <div class="density-coordinator-grid">
        ${dependencies
          .map(
            ([name, copy, iconName]) => componentDemo("card", { title: name, detail: copy, icon: icon(iconName), variant: "minimal", composition: "standard", fullWidth: true }),
          )
          .join("")}
      </div>
  `, "wide density-coordinator-panel");
}

export function densityDecisionPanel() {
  const rows = referenceCopy.density?.decisionRows ?? [];
  return primitiveSection(ui("reference.densityDecision"), html`
      <p>${referenceCopy.density?.decisionCopy}</p>
      <div class="density-decision-grid">
        ${rows
          .map(
            ([density, title, context, outcome]) => html`
              <article data-doc-primitive="density-decision-demo" data-density-context="${density}">
                <header><strong>${density}</strong><span>${title}</span></header>
                <p>${context}</p>
                <small>${outcome}</small>
              </article>
            `,
          )
          .join("")}
      </div>
  `, "wide density-decision-panel");
}

export function primitiveDemoPanel(entry) {
  return primitiveSection(ui("reference.liveDemo"), html`
      <p>${referenceCopy.primitive?.demoCopy}</p>
      ${primitiveExample(entry)}
  `);
}

export function primitiveResponsibilitiesPanel(entry) {
  return listPanel(ui("reference.responsibilities"), interpolateList(referenceCopy.primitive?.responsibilities, entry));
}

export function primitiveTokenChainPanel(entry) {
  return primitiveSection(ui("reference.tokenChain"), html`
      <p>${referenceCopy.primitive?.tokenChainCopy}</p>
      <div class="architecture-chain">
        ${(referenceCopy.primitive?.tokenChainSteps ?? []).map((step, index) => componentDemo("card", { title: step, status: String(index + 1), variant: "minimal", composition: "standard", fullWidth: true })).join("")}
      </div>
      <div class="token-list">${entry.tokens.map((token) => `<code>${token}</code>`).join("")}</div>
  `);
}

export function primitiveApiPanel(entry) {
  return primitiveSection(ui("reference.primitiveApi"), html`
      ${artifactDetailTable({
        columns: [ui("table.prop"), ui("table.type"), ui("table.required"), ui("table.notes")],
        rows: (referenceCopy.primitive?.apiRows ?? []).map((row) => row.map((value) => referenceTemplate(value, entry))),
      })}
  `);
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
