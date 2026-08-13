import { artifactDetailTable, artifactRoleGrid, examplePanel, foundationExample, foundationRoles, html, referenceCopy, referenceTemplate, threeTabs, ui, guidelinesPanel, specPanel, agentPanel } from "./detail-tabs-core.js?v=10";
import { documentationSectionIsland } from "./documentation-section-island.js?v=1";
import { docsCodeBlock } from "./docs-code-block.js?v=2";

export function foundationTabs(entry) {
  return threeTabs(entry, `${foundationOverviewPanel(entry)}${foundationRoleGrid(entry)}${examplePanel(entry)}`, `${foundationArchitecturePanel(entry)}${foundationVisualExplanationPanel(entry)}${guidelinesPanel(entry)}`, `${foundationContractPanel(entry)}${specPanel(entry)}${agentPanel(entry, "Foundation")}`);
}

function foundationSection(title, body, className = "wide") {
  return documentationSectionIsland({
    title,
    bodyHtml: body,
    className: ["foundation-primitive-detail-surface", className].filter(Boolean).join(" "),
    template: "foundation-primitive-detail",
    source: "foundation-tabs",
  });
}

export function foundationOverviewPanel(entry) {
  return foundationSection(`${entry.title} foundation`, html`
      <p>${entry.summary}</p>
      <p>${referenceTemplate(referenceCopy.foundation?.overviewCopy, entry)}</p>
  `, "wide reference-section");
}

export function foundationRoleGrid(entry) {
  const roles = foundationRoles(entry);
  return foundationSection(ui("reference.semanticRoleGroups"), html`
      <p>${referenceCopy.foundation?.roleGridCopy}</p>
      ${artifactRoleGrid({
        items: roles.map((role) => ({ icon: role.icon, title: role.name, copy: role.copy })),
      })}
  `);
}

export function foundationArchitecturePanel(entry) {
  return foundationSection(ui("reference.architecture"), html`
      <p>${referenceTemplate(referenceCopy.foundation?.architectureCopy, entry)}</p>
      ${artifactRoleGrid({
        className: "architecture-chain",
        items: (referenceCopy.foundation?.architectureSteps ?? []).map((step, index) => ({ icon: "account_tree", title: `${index + 1}`, copy: step })),
      })}
      ${docsCodeBlock(`${entry.title.toLowerCase()}.foundation
  -> ${entry.tokens[0] ?? `${entry.id}.role`}
  -> component semantic prop
  -> pattern decision tree
  -> template product behavior`)}
  `);
}

export function foundationVisualExplanationPanel(entry) {
  return foundationSection(ui("reference.visualExplanation"), html`
      <p>${referenceTemplate(referenceCopy.foundation?.visualExplanationCopy, entry)}</p>
      ${foundationExample(entry)}
  `);
}

export function foundationContractPanel(entry) {
  return foundationSection(ui("reference.foundationContract"), html`
      ${artifactDetailTable({
        columns: [ui("table.contract"), ui("table.meaning"), ui("table.required"), ui("table.prevents")],
        rows: (referenceCopy.foundation?.contractRows ?? [])
          .map((row) => row.map((value) => referenceTemplate(value, entry, { tokens: entry.tokens.join(", "), roles: foundationRoles(entry).map((role) => role.name).join(", ") }))),
      })}
  `);
}
