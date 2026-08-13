import { componentDemo } from "./component-demo.js?v=60";
import { documentationSectionIsland } from "./documentation-section-island.js?v=1";
import { docsCodeBlock } from "./docs-code-block.js?v=2";

export let html = String.raw;
export let icon = () => "";
export let iconFor = () => "";
export let ui = (key) => key;
export let slug = (value) => String(value ?? "");
export let interpolateList = () => [];
export let referenceTemplate = (value) => value ?? "";
export let referenceCopy = {};
export let componentCopy = {};
export let patternCopy = {};
export let componentDocs = {};
export let templateBlueprints = {};
export let templateBlueprintFallbacks = {};
export let artifactContract = () => null;
export let componentAgentSpec = () => ({});
export let foundationRoles = () => [];
export let foundationExample = () => "";
export let primitiveExample = () => "";
export let examplePanel = () => "";
export let visualPanel = () => "";
export let journeyCopy = () => "";
export let docsLinkCard = () => "";
export let findComponent = () => null;
export let findPattern = () => null;
export let goldComponentDocumentationTabs = () => [];
export let familyComponentTabs = () => [];
export let artifactFoundationTracePanel = () => "";

export function configureDetailTabsContext(nextDeps) {
  html = nextDeps.html;
  icon = nextDeps.icon;
  iconFor = nextDeps.iconFor;
  ui = nextDeps.ui;
  slug = nextDeps.slug;
  interpolateList = nextDeps.interpolateList;
  referenceTemplate = nextDeps.referenceTemplate;
  referenceCopy = nextDeps.referenceCopy;
  componentCopy = nextDeps.componentCopy;
  patternCopy = nextDeps.patternCopy;
  componentDocs = nextDeps.componentDocs;
  templateBlueprints = nextDeps.templateBlueprints;
  templateBlueprintFallbacks = nextDeps.templateBlueprintFallbacks;
  artifactContract = nextDeps.artifactContract;
  componentAgentSpec = nextDeps.componentAgentSpec;
  foundationRoles = nextDeps.foundationRoles;
  foundationExample = nextDeps.foundationExample;
  primitiveExample = nextDeps.primitiveExample;
  examplePanel = nextDeps.examplePanel;
  visualPanel = nextDeps.visualPanel;
  journeyCopy = nextDeps.journeyCopy;
  docsLinkCard = nextDeps.docsLinkCard;
  findComponent = nextDeps.findComponent;
  findPattern = nextDeps.findPattern;
  goldComponentDocumentationTabs = nextDeps.goldComponentDocumentationTabs;
  familyComponentTabs = nextDeps.familyComponentTabs;
  artifactFoundationTracePanel = nextDeps.artifactFoundationTracePanel;
}

export function threeTabs(entry, overviewExtra, designBody, buildBody) {
  const tabs = [
    [ui("tabs.overview"), `${overviewPanel(entry)}${teamsPanel(entry)}${overviewExtra}`],
    [ui("tabs.design"), designBody],
    [ui("tabs.build"), buildBody],
  ];
  return tabs.map(([labelText, body]) => ({ id: slug(labelText), label: labelText, body }));
}

export function overviewPanel(entry) {
  return html`
    <div class="panel-grid">
      ${artifactDocumentationSection({
        title: ui("overview.whyItExists"),
        body: `<p>${entry.summary}</p><p>${ui("overview.intentCopy")}</p>`,
        className: "wide",
        source: "overviewPanel",
      })}
      ${artifactDocumentationSection({
        title: ui("overview.platform"),
        body: `<p>${entry.platform}</p>`,
        className: "",
        source: "overviewPanel",
      })}
      ${artifactDocumentationSection({
        title: ui("overview.publicTokens"),
        body: `<div class="token-list">${entry.tokens.map((token) => `<code>${token}</code>`).join("")}</div>`,
        className: "",
        source: "overviewPanel",
      })}
    </div>
  `;
}

export function teamsPanel(entry) {
  const teamNotes = referenceCopy.teamNotes ?? {};
  const audiences = entry.audiences.length ? entry.audiences : ["Product Designers", "Developers", "PMs"];
  return html`
    <div class="audience-grid">
      ${audiences
        .map(
          (audience) => html`
            ${artifactDocumentationSection({
              title: audience,
              body: `<p>${teamNotes[audience] ?? teamNotes.fallback}</p>`,
              className: "",
              source: "teamsPanel",
            })}
          `,
        )
        .join("")}
    </div>
  `;
}

export function rulesPanel(entry) {
  return listPanel(ui("reference.rules"), interpolateList(referenceCopy.rules, entry));
}

export function decisionPanel(entry) {
  return listPanel(ui("reference.decisionTree"), interpolateList(referenceCopy.decisionTree, entry));
}

export function tokenPanel(entry) {
  return artifactDocumentationSection({
    title: ui("reference.tokenModel"),
    body: `<p>${referenceCopy.tokenModel?.copy}</p><div class="token-list">${entry.tokens.map((token) => `<code>${token}</code>`).join("")}</div>`,
    source: "tokenPanel",
  });
}

export function accessibilityPanel(entry) {
  return listPanel(ui("reference.accessibilityContract"), interpolateList(referenceCopy.primitive?.accessibility, entry));
}

export function engineeringPanel(entry) {
  const contract = artifactContract(entry);
  const items = contract
    ? [
        contract.primitiveDependencies?.length ? `Primitive dependencies: ${contract.primitiveDependencies.join(", ")}.` : "",
        contract.componentDependencies?.length ? `Component dependencies: ${contract.componentDependencies.join(", ")}.` : "",
        contract.patternDependencies?.length ? `Pattern dependencies: ${contract.patternDependencies.join(", ")}.` : "",
        contract.tokenDependencies?.length ? `Token dependencies: ${contract.tokenDependencies.join(", ")}.` : "",
        contract.states?.length ? `States: ${contract.states.join(", ")}.` : "",
        contract.agentInstructions?.length ? `Implementation instructions: ${contract.agentInstructions.join(" ")}` : "",
      ].filter(Boolean)
    : referenceCopy.engineering?.fallbackItems ?? [];
  const payload = contract
    ? {
        artifact: entry.title,
        layer: contract.layer,
        platform: contract.platform,
        tokenDependencies: contract.tokenDependencies ?? [],
        primitiveDependencies: contract.primitiveDependencies ?? [],
        componentDependencies: contract.componentDependencies ?? [],
        patternDependencies: contract.patternDependencies ?? [],
      }
    : {
        artifact: entry.title,
        layer: entry.type,
        platform: entry.platform,
        tokens: entry.tokens,
      };
  return artifactDocumentationSection({
    title: ui("build.engineeringContract"),
    body: `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>${docsCodeBlock(JSON.stringify(payload, null, 2))}`,
    source: "engineeringPanel",
  });
}

export function specPanel(entry) {
  const props = specProps(entry);
  const gates = specQualityGates(entry);
  return artifactDocumentationSection({
    title: ui("build.specAndApi"),
    body: html`
      <p>${ui("build.specIntro")}</p>
      ${artifactDetailTable({
        columns: [ui("table.name"), ui("table.type"), ui("table.required"), ui("table.notes")],
        rows: props,
      })}
      <div class="quality-gates">
        <h3>${ui("build.qualityGates")}</h3>
        <ul>
          ${gates.map((gate) => `<li>${gate}</li>`).join("")}
        </ul>
      </div>
    `,
    source: "specPanel",
  });
}

export function artifactDetailTable({ className = "", columns = [], rows = [], firstColumn = "code" } = {}) {
  const normalizeRow = (row) => {
    if (Array.isArray(row)) return row;
    if (row && typeof row === "object") {
      return [row.name ?? row.field ?? row.id ?? "", row.type ?? "", row.required ?? "", row.notes ?? row.description ?? ""];
    }
    return [row ?? "", "", "", ""].slice(0, Math.max(columns.length, 1));
  };
  return artifactTable({ label: "Artifact detail table", className, columns, rows: rows.map(normalizeRow), firstColumn });
}

function artifactTable({ label = "Artifact detail table", className = "", columns = [], rows = [], firstColumn = "code" } = {}) {
  const safeColumns = columns.length ? columns : ["Name", "Value"];
  return componentDemo("table", {
    label,
    variant: "dense",
    fullWidth: true,
    className,
    columns: safeColumns.map((column, index) => ({ key: `c${index}`, label: column, mono: index === 0 && firstColumn === "code", priority: index === 0 ? "primary" : "secondary" })),
    rows: rows.map((row, rowIndex) => safeColumns.reduce((record, _column, index) => ({ ...record, [`c${index}`]: row[index] ?? "", id: `row-${rowIndex}` }), {})),
  });
}

export function artifactRoleGrid({ className = "", items = [] } = {}) {
  const classes = ["docs-role-matrix", className].filter(Boolean).join(" ");
  return html`
    <div class="${classes}" data-doc-primitive="docs-role-matrix">
      ${items
        .map(({ icon: iconName, title, copy }) => artifactCard({ title, detail: copy, iconName }))
        .join("")}
    </div>
  `;
}

export function artifactVariantGrid({ className = "", items = [] } = {}) {
  const classes = ["pattern-variant-grid", className].filter(Boolean).join(" ");
  return html`
    <div class="${classes}" data-doc-primitive="artifact-variant-grid">
      ${items
        .map(({ title, status, copy }) => artifactCard({ title, detail: copy, status }))
        .join("")}
    </div>
  `;
}

function artifactCard({ title, detail, status, iconName } = {}) {
  return componentDemo("card", { title, detail, status, icon: iconName ? icon(iconName) : undefined, variant: "minimal", composition: "standard", fullWidth: true });
}

function artifactListCard(title, items) {
  return artifactCard({ title, detail: (items ?? []).join(" ") });
}

export function specProps(entry) {
  const contract = artifactContract(entry);
  const blueprint = entry.type === "template" ? templateBlueprints[entry.title] : null;
  const contractProps = contract?.api?.props;
  if (Array.isArray(contractProps) && contractProps.length) {
    return contractProps.map((prop) => Array.isArray(prop)
      ? prop
      : [prop, "contract prop", "conditional", `Declared by the ${entry.title} contract.`]);
  }
  if (blueprint) {
    return [
      ["modules", "TemplateModule[]", "yes", "Screen modules owned by the template."],
      ["states", "TemplateState[]", "yes", "Critical states covered by the template."],
      ["permissions", "Permission[]", "conditional", "Only when the product surface requires access control."],
      ["telemetry", "TelemetryEvent[]", "yes", "Signals tied to product decisions."],
    ];
  }
  return interpolateList(referenceCopy.primitive?.apiRows ?? referenceCopy.spec?.apiRows ?? [], entry);
}

export function specQualityGates(entry) {
  const blueprint = entry.type === "template" ? templateBlueprints[entry.title] : null;
  if (blueprint?.qualityGates?.length) return blueprint.qualityGates;
  return referenceCopy.spec?.qualityGates ?? [];
}

export function guidelinesPanel(entry) {
  const contract = artifactContract(entry);
  const doItems = ["pattern", "template"].includes(entry.type) && contract?.agentInstructions ? contract.agentInstructions : referenceCopy.guidelines?.do ?? [];
  const dontItems = ["pattern", "template"].includes(entry.type) && contract?.rejectIf ? contract.rejectIf : referenceCopy.guidelines?.doNot ?? [];
  return artifactDocumentationSection({
    title: ui("guidelines.title"),
    body: html`
      <div class="guidelines-grid">
        ${artifactListCard(ui("guidelines.do"), doItems)}
        ${artifactListCard(ui("guidelines.doNot"), dontItems)}
      </div>
    `,
    source: "guidelinesPanel",
  });
}

export function demoMatrixPanel(entry) {
  return artifactDocumentationSection({
    title: ui("reference.demoMatrix"),
    body: html`
      <p>${referenceCopy.demoMatrix?.copy}</p>
      <div class="demo-matrix">
        ${(referenceCopy.demoMatrix?.states ?? []).map((state) => `<span>${state}</span>`).join("")}
        ${(referenceCopy.demoMatrix?.platforms ?? []).map((state) => `<span>${state}</span>`).join("")}
      </div>
    `,
    source: "demoMatrixPanel",
  });
}

export function agentPanel(entry, layerName) {
  const contract = artifactContract(entry);
  const agentSpec = componentAgentSpec(entry, layerName);
  const briefExamples = interpolateList(referenceCopy.mielGeneric?.brief, entry);
  const canDecide = interpolateList(referenceCopy.mielGeneric?.canDecide, entry);
  const mustAsk = interpolateList(referenceCopy.mielGeneric?.mustAsk, entry);
  const preserve = interpolateList(referenceCopy.mielGeneric?.preserve, entry);
  if (contract) {
    return html`
      ${artifactDocumentationSection({ body: html`
        <span class="eyebrow">MIEL</span>
        <h2>${ui("miel.title")}</h2>
        <p>${ui("miel.intro")}</p>
        <div class="guidelines-grid">
          ${artifactListCard(ui("miel.briefAgent"), briefExamples)}
          ${artifactListCard(ui("miel.agentCanDecide"), canDecide)}
          ${artifactListCard(ui("miel.agentMustAsk"), mustAsk)}
        </div>
      `, source: "agentPanel" })}
      ${artifactDocumentationSection({ title: ui("miel.humanReview"), body: `<div class="checklist-grid">${preserve.map((item) => artifactCard({ title: item, iconName: "check_circle" })).join("")}</div>`, source: "agentPanel" })}
      ${artifactDocumentationSection({ title: ui("miel.machineContract"), body: docsCodeBlock(JSON.stringify(agentSpec, null, 2)), source: "agentPanel" })}
    `;
  }
  return html`
    ${artifactDocumentationSection({ body: html`
      <span class="eyebrow">MIEL</span>
      <h2>${ui("miel.title")}</h2>
      <p>${ui("miel.intro")}</p>
      <div class="guidelines-grid">
        ${artifactListCard(ui("miel.briefAgent"), briefExamples)}
        ${artifactListCard(ui("miel.agentCanDecide"), canDecide)}
        ${artifactListCard(ui("miel.agentMustAsk"), mustAsk)}
      </div>
    `, source: "agentPanel" })}
    ${artifactDocumentationSection({ title: ui("miel.humanReview"), body: `<div class="checklist-grid">${preserve.map((item) => artifactCard({ title: item, iconName: "check_circle" })).join("")}</div>`, source: "agentPanel" })}
    ${artifactDocumentationSection({ title: ui("miel.machineContract"), body: docsCodeBlock(JSON.stringify(agentSpec, null, 2)), source: "agentPanel" })}
  `;
}

export function listPanel(title, items) {
  return artifactDocumentationSection({
    title,
    body: `<ul>${items.map((entry) => `<li>${entry}</li>`).join("")}</ul>`,
    source: "listPanel",
  });
}

export function artifactDocumentationSection({ title, description, body = "", className = "wide", attrs = "", source = "detail-tabs-core" } = {}) {
  return documentationSectionIsland({
    title,
    description,
    bodyHtml: body,
    className: ["artifact-detail-surface", className].filter(Boolean).join(" "),
    template: "artifact-detail",
    attrs,
    source,
  });
}
