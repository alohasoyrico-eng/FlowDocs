import { artifactContract, artifactDetailTable, artifactFoundationTracePanel, artifactRoleGrid, cardLink, examplePanel, findPattern, html, interpolateList, referenceCopy, referenceTemplate, slug, templateBlueprintFallbacks, templateBlueprints, ui, listPanel, engineeringPanel, specPanel, guidelinesPanel, agentPanel, overviewPanel, teamsPanel } from "./detail-tabs-core.js?v=5";
import { componentDemo } from "./component-demo.js?v=60";
import { desktopTemplateDemo } from "./template-desktop-demos.js?v=17";

export function templateTabs(entry) {
  const blueprint = templateBlueprints[entry.title];
  const tabs = [
    [ui("tabs.overview"), `${desktopTemplateDemo(entry, blueprint)}${overviewPanel(entry)}${teamsPanel(entry)}${templateStandardPanel(entry)}${artifactFoundationTracePanel(entry, "Template")}${productPanel(entry)}${examplePanel(entry)}`],
    [ui("tabs.design"), `${templateScreenSystemPanel(entry)}${iaPanel(entry)}${flowsPanel(entry)}${templateStateMatrixPanel(entry)}${dataPanel(entry)}${guidelinesPanel(entry)}`],
    [ui("tabs.build"), `${templateContractPanel(entry)}${engineeringPanel(entry)}${specPanel(entry)}${agentPanel(entry, "Template")}`],
  ];
  return tabs.map(([labelText, body]) => ({ id: slug(labelText), label: labelText, body }));
}

export function productPanel(entry) {
  const blueprint = templateBlueprints[entry.title];
  return html`
    <section class="surface docs-section-surface detail-section-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <h2>${ui("reference.productContext")}</h2>
      <p>${entry.summary}</p>
      <p>${blueprint?.primary ?? templateBlueprintFallbacks.primary}</p>
      ${
        blueprint
          ? `<div class="blueprint-grid">${blueprint.modules.map((module) => componentDemo("card", { title: module, detail: moduleBlueprintCopy(blueprint, module), variant: "minimal", composition: "standard", fullWidth: true })).join("")}</div>`
          : ""
      }
    </section>
  `;
}

export function templateStandardPanel(entry) {
  const blueprint = templateBlueprints[entry.title];
  return html`
    <section class="surface docs-section-surface detail-section-surface wide reference-section" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">${ui("reference.templateStandard")}</span>
      <h2>${entry.title} production model</h2>
      <p>${entry.summary}</p>
      <p>${blueprint?.standard ?? templateBlueprintFallbacks.standard}</p>
    </section>
  `;
}

export function templateScreenSystemPanel(entry) {
  const blueprint = templateBlueprints[entry.title];
  const modules = blueprint?.modules ?? [];
  return html`
    <section class="surface docs-section-surface detail-section-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <h2>${ui("reference.screenSystem")}</h2>
      <p>${blueprint?.screenSystem ?? templateBlueprintFallbacks.screenSystem}</p>
      ${artifactRoleGrid({
        items: modules.map((module) => ({ icon: moduleBlueprintIcon(blueprint, module), title: module, copy: moduleBlueprintCopy(blueprint, module) })),
      })}
    </section>
  `;
}

export function templateStateMatrixPanel(entry) {
  const blueprint = templateBlueprints[entry.title];
  const states = blueprint?.states ?? ["loaded", "loading", "empty", "error", "permission", "offline"];
  const surfaces = blueprint?.surfaces ?? ["Mobile", "Tablet", "Laptop", "Desktop"];
  return html`
    <section class="surface docs-section-surface detail-section-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <h2>${ui("reference.templateStateMatrix")}</h2>
      <p>${referenceTemplate(templateBlueprintFallbacks.stateMatrixCopy, entry)}</p>
      <div class="button-matrix">
        <span></span>
        ${surfaces.map((surface) => `<strong>${surface}</strong>`).join("")}
        ${states.map((state) => `<b>${state}</b>${surfaces.map((surface) => componentDemo("tag", { label: `${surface}: ${stateLabel(state)}`, variant: "status", tone: tagToneForState(state), state: normalizeDemoState(state) })).join("")}`).join("")}
      </div>
    </section>
  `;
}

function tagToneForState(state) {
  if (["error", "offline", "permission"].includes(state)) return "danger";
  if (state === "loading") return "info";
  if (state === "loaded") return "success";
  return "neutral";
}

function normalizeDemoState(state) {
  if (["loading", "error", "disabled"].includes(state)) return state;
  if (state === "loaded") return "default";
  return "";
}

export function stateLabel(state) {
  const fallback = `${state.charAt(0).toUpperCase()}${state.slice(1)}`;
  return referenceCopy.stateLabels?.[state] ?? referenceTemplate(referenceCopy.stateLabels?.fallbackTemplate, {}, { state: fallback }) ?? `${fallback} state`;
}

export function templateContractPanel(entry) {
  const blueprint = templateBlueprints[entry.title];
  return html`
    <section class="surface docs-section-surface detail-section-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <h2>${ui("contract.template")}</h2>
      ${artifactDetailTable({
        columns: [ui("table.field"), ui("table.type"), ui("table.required"), ui("table.notes")],
        rows: [
          ["patternsUsed", "PatternRef[]", "yes", (entry.patternsUsed ?? []).join(", ") || "None"],
          ["templateModulesUsed", "TemplateModuleRef[]", "yes", (entry.templateModulesUsed ?? []).join(", ") || "None"],
          ["dataSources", "DataSource[]", "yes", blueprint?.data?.join(", ") ?? templateBlueprintFallbacks.dataSources],
          ["permissions", "PermissionRole[]", "yes", blueprint?.permissions?.join(", ") ?? templateBlueprintFallbacks.permissions],
          ["states", "StateMatrix", "yes", blueprint?.states?.join(", ") ?? templateBlueprintFallbacks.states],
          ["telemetry", "EventSpec[]", "yes", blueprint?.telemetry?.join(", ") ?? templateBlueprintFallbacks.telemetry],
        ],
      })}
    </section>
  `;
}

export function iaPanel(entry) {
  const patternsUsed = entry.patternsUsed ?? [];
  const templateModulesUsed = entry.templateModulesUsed ?? [];
  const blueprint = templateBlueprints[entry.title];
  return html`
    <section class="surface docs-section-surface detail-section-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <h2>${ui("reference.informationArchitecture")}</h2>
      <p>${blueprint?.informationArchitecture ?? templateBlueprintFallbacks.informationArchitecture}</p>
      ${blueprint ? `<div class="nav-model">${blueprint.nav.map((item) => `<span>${item}</span>`).join("")}</div>` : ""}
      <div class="relation-grid">
        ${patternsUsed.map((name) => cardLink("patterns", slug(name), "account_tree", name, findPattern(name)?.summary ?? "Pattern contract.")).join("")}
        ${templateModulesUsed.map((name) => cardLink("templates", entry.id, "view_module", name, blueprint?.templateModuleDetails?.[name] ?? templateBlueprintFallbacks.moduleDetail)).join("")}
      </div>
    </section>
  `;
}

export function flowsPanel(entry) {
  const blueprint = templateBlueprints[entry.title];
  const flows = (entry.patternsUsed ?? []).map((patternName) => `${patternName}: ${blueprint?.patternDetails?.[patternName] ?? templateBlueprintFallbacks.processDetail}`);
  const modules = (entry.templateModulesUsed ?? []).map((moduleName) => `${moduleName}: ${blueprint?.templateModuleDetails?.[moduleName] ?? templateBlueprintFallbacks.moduleDetail}`);
  return html`
    ${listPanel(ui("reference.coreProcesses"), flows)}
    ${modules.length ? listPanel(ui("reference.templateModules"), modules) : blueprint ? listPanel(ui("reference.templateModules"), blueprint.modules) : ""}
  `;
}

export function dataPanel(entry) {
  const blueprint = templateBlueprints[entry.title];
  return listPanel(ui("reference.dataPermissions"), [
    ...(blueprint ? blueprint.data.map((item) => `Data source: ${item}.`) : [templateBlueprintFallbacks.dataPermissions?.[0]]),
    ...(blueprint ? blueprint.permissions.map((item) => `Permission: ${item}.`) : [templateBlueprintFallbacks.dataPermissions?.[1]]),
    ...(blueprint?.telemetry ? blueprint.telemetry.map((item) => `Telemetry: ${item}.`) : [templateBlueprintFallbacks.dataPermissions?.[2]]),
    ...(blueprint?.qualityGates ?? [templateBlueprintFallbacks.dataPermissions?.[3]]),
  ]);
}

export function moduleBlueprintCopy(blueprint, module) {
  return blueprint?.moduleDetails?.[module]?.copy ?? templateBlueprintFallbacks.moduleDetail;
}

export function moduleBlueprintIcon(blueprint, module) {
  return blueprint?.moduleDetails?.[module]?.icon ?? "view_quilt";
}
