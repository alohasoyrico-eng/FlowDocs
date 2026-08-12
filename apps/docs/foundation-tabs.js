import { artifactDetailTable, examplePanel, foundationExample, foundationRoles, html, icon, referenceCopy, referenceTemplate, threeTabs, ui, guidelinesPanel, specPanel, agentPanel } from "./detail-tabs-core.js?v=5";

export function foundationTabs(entry) {
  return threeTabs(entry, `${foundationOverviewPanel(entry)}${foundationRoleGrid(entry)}${examplePanel(entry)}`, `${foundationArchitecturePanel(entry)}${foundationVisualExplanationPanel(entry)}${guidelinesPanel(entry)}`, `${foundationContractPanel(entry)}${specPanel(entry)}${agentPanel(entry, "Foundation")}`);
}

export function foundationOverviewPanel(entry) {
  return html`
    <section class="surface docs-section-surface foundation-primitive-detail-surface wide reference-section" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="foundation-primitive-detail">
      <span class="eyebrow">${ui("reference.overview")}</span>
      <h2>${entry.title} foundation</h2>
      <p>${entry.summary}</p>
      <p>${referenceTemplate(referenceCopy.foundation?.overviewCopy, entry)}</p>
    </section>
  `;
}

export function foundationRoleGrid(entry) {
  const roles = foundationRoles(entry);
  return html`
    <section class="surface docs-section-surface foundation-primitive-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="foundation-primitive-detail">
      <h2>${ui("reference.semanticRoleGroups")}</h2>
      <p>${referenceCopy.foundation?.roleGridCopy}</p>
      <div class="role-grid">
        ${roles.map((role) => `<article><span>${icon(role.icon)}</span><strong>${role.name}</strong><p>${role.copy}</p></article>`).join("")}
      </div>
    </section>
  `;
}

export function foundationArchitecturePanel(entry) {
  return html`
    <section class="surface docs-section-surface foundation-primitive-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="foundation-primitive-detail">
      <h2>${ui("reference.architecture")}</h2>
      <p>${referenceTemplate(referenceCopy.foundation?.architectureCopy, entry)}</p>
      <div class="architecture-chain">
        ${(referenceCopy.foundation?.architectureSteps ?? []).map((step, index) => `<article><b>${index + 1}</b><span>${step}</span></article>`).join("")}
      </div>
      <pre>${entry.title.toLowerCase()}.foundation
  -> ${entry.tokens[0] ?? `${entry.id}.role`}
  -> component semantic prop
  -> pattern decision tree
  -> template product behavior</pre>
    </section>
  `;
}

export function foundationVisualExplanationPanel(entry) {
  return html`
    <section class="surface docs-section-surface foundation-primitive-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="foundation-primitive-detail">
      <h2>${ui("reference.visualExplanation")}</h2>
      <p>${referenceTemplate(referenceCopy.foundation?.visualExplanationCopy, entry)}</p>
      ${foundationExample(entry)}
    </section>
  `;
}

export function foundationContractPanel(entry) {
  return html`
    <section class="surface docs-section-surface foundation-primitive-detail-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="foundation-primitive-detail">
      <h2>${ui("reference.foundationContract")}</h2>
      ${artifactDetailTable({
        columns: [ui("table.contract"), ui("table.meaning"), ui("table.required"), ui("table.prevents")],
        rows: (referenceCopy.foundation?.contractRows ?? [])
          .map((row) => row.map((value) => referenceTemplate(value, entry, { tokens: entry.tokens.join(", "), roles: foundationRoles(entry).map((role) => role.name).join(", ") }))),
      })}
    </section>
  `;
}
