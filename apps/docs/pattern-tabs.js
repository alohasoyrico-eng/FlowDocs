import { artifactContract, artifactDetailTable, artifactDocumentationSection, artifactFoundationTracePanel, docsLinkCard, componentAgentSpec, componentCopy, examplePanel, findComponent, findPattern, foundationExample, foundationRoles, html, iconFor, interpolateList, journeyCopy, primitiveExample, referenceCopy, referenceTemplate, slug, templateBlueprintFallbacks, templateBlueprints, threeTabs, ui, visualPanel, listPanel, accessibilityPanel, engineeringPanel, specPanel, guidelinesPanel, agentPanel } from "./detail-tabs-core.js?v=10";
import { hasPatternSource, patternContractTabs } from "./pattern-contract-tabs.js?v=59";
import { patternBuildGatePanel } from "./pattern-build-gates.js?v=5";
import { focusedPatternDesignPanels } from "./pattern-focused-design.js?v=26";
import { shellPatternOverviewDemo } from "./pattern-shell-react-demos.js?v=3";
import { patternMielTabs } from "./pattern-miel-tabs.js?v=8";
import { componentDemo } from "./component-demo.js?v=61";

export function patternTabs(entry) {
  if (entry.id === "sidebar" || entry.id === "topbar") {
    const reactOverview = shellPatternOverviewDemo(entry.id) || patternExamplePanel(entry);
    const tabs = [
      [ui("tabs.overview"), `${reactOverview}${patternStandardPanel(entry)}${artifactFoundationTracePanel(entry, "Pattern")}`],
      [ui("tabs.design"), patternDesignBody(entry)],
      [ui("tabs.build"), patternBuildBody(entry)],
      [ui("tabs.miel"), patternMielTabs(entry)],
    ];
    return tabs.map(([labelText, body]) => ({ id: slug(labelText), label: labelText, body }));
  }
  if (hasPatternSource(entry)) return patternContractTabs(entry);
  return threeTabs(entry, `${patternStandardPanel(entry)}${artifactFoundationTracePanel(entry, "Pattern")}${patternExamplePanel(entry)}`, patternDesignBody(entry), patternBuildBody(entry));
}

function patternDesignBody(entry) {
  if (entry.id === "sidebar" || entry.id === "topbar") {
    return focusedPatternDesignPanels(entry);
  }
  const leadPanel = journeyPanel(entry);
  return `${leadPanel}${patternDecisionTreePanel(entry)}${patternFailureModesPanel(entry)}${screensPanel(entry)}${metricsPanel(entry)}${researchPanel(entry)}${guidelinesPanel(entry)}`;
}

function patternBuildBody(entry) {
  const contractPanel = entry.id === "sidebar" ? sidebarContractPanel() : entry.id === "topbar" ? topbarContractPanel() : patternContractPanel(entry);
  if (entry.id === "sidebar" || entry.id === "topbar") return `${contractPanel}${patternBuildGatePanel(entry)}`;
  return `${contractPanel}${engineeringPanel(entry)}${specPanel(entry)}${agentPanel(entry, "Pattern")}`;
}

export function patternExamplePanel(entry) {
  if (entry.id === "topbar" || entry.id === "sidebar") return shellPatternOverviewDemo(entry.id) || examplePanel(entry);
  return examplePanel(entry);
}

function patternSection(title, body, className = "wide") {
  return artifactDocumentationSection({
    title,
    body,
    className,
    source: "pattern-tabs",
  });
}

function sidebarContractPanel() {
  const rows = [
    ["groups", "SidebarGroup[]", "yes", "Parent collections with icon, label, optional Badge count, and children."],
    ["activeItem", "RouteId", "yes", "Current child route; active state must not rely on color alone."],
    ["maxDepth", "2", "yes", "Only parent to child is visible. Third level moves to local nav, tabs, breadcrumbs, or Tree View."],
    ["defaultOpenGroups", "GroupId[]", "conditional", "Open groups based on active route or product default."],
    ["footer", "SidebarFooter", "optional", "Separate utility region for account, help, version, workspace, or environment."],
    ["responsiveMode", "persistent | drawer", "yes", "Breakpoint behavior coordinated with Topbar menu access."]
  ];
  return patternSection(ui("contract.pattern"), artifactDetailTable({ columns: [ui("table.field"), ui("table.type"), ui("table.required"), ui("table.notes")], rows }));
}

function topbarContractPanel() {
  const rows = [
    ["leading", "TopbarLeadingSlot", "yes", "Menu trigger, product switcher, or sidebar entry."],
    ["brand", "BrandSlot", "yes", "Logo, wordmark, mark, co-brand, or partner mark with accessible home label."],
    ["navigation", "TopbarNavItem[]", "conditional", "Global collections or product sections; active item uses aria-current."],
    ["search", "Search | Autocomplete", "conditional", "Topbar provides the slot; Search/Autocomplete own results, suggestions, recovery, and routing."],
    ["actions", "TopbarAction[]", "optional", "Icon Button/Menu actions such as language, contrast, grid, help, notifications."],
    ["notifications", "Badge | Notification Panel", "optional", "Badge count can be inline; notification lists, read state, and actions belong to Notification Panel."],
    ["account", "AvatarMenuSlot", "optional", "Avatar component plus Menu for settings, workspace, profile, sign out."],
    ["responsiveMode", "full | compact | mobile", "yes", "Defines which slots stay visible, compress, or move to sidebar/drawer."]
  ];
  return patternSection(ui("contract.pattern"), artifactDetailTable({ columns: [ui("table.field"), ui("table.type"), ui("table.required"), ui("table.notes")], rows }));
}

export function journeyPanel(entry) {
  const contract = artifactContract(entry);
  const steps = contract
    ? [
        ["Entry", contract.entryConditions?.[0]],
        ["Qualify", contract.entryConditions?.slice(1).join(" ")],
        ["Decide", contract.decisionTree?.join(" ")],
        ["Confirm", contract.successMetrics?.[0]],
        ["Recover", contract.failureModes?.[0]],
      ].filter(([, copy]) => copy)
    : ["Entry", "Orient", "Act", "Confirm", "Recover"].map((step) => [step, journeyCopy(entry, step)]);
  return html`
    <div class="timeline">
      ${steps
        .map(
          ([step, copy], index) => html`
            ${patternDocCard(step, copy, index)}
          `,
        )
        .join("")}
    </div>
  `;
}

export function screensPanel(entry) {
  const contract = artifactContract(entry);
  const componentsUsed = contract?.componentDependencies ?? entry.componentsUsed ?? [];
  return patternSection(ui("reference.screensComponents"), html`
      <p>These are the expected building blocks for ${entry.title}. Each one should link to its component contract before implementation.</p>
      <div class="relation-grid">
        ${componentsUsed.map((name) => docsLinkCard("components", slug(name), "widgets", name, findComponent(name)?.summary ?? "Component contract.")).join("")}
      </div>
  `);
}

export function metricsPanel(entry) {
  const contract = artifactContract(entry);
  return listPanel(ui("reference.successMetrics"), contract?.successMetrics ?? referenceCopy.metrics?.fallback ?? []);
}

export function researchPanel(entry) {
  const contract = artifactContract(entry);
  const questions = entry.type === "pattern" && contract
    ? [
        ...(contract.successMetrics ?? []).map((metric) => `Can users reach this outcome without facilitator help: ${metric}`),
        ...(contract.failureModes ?? []).slice(0, 2).map((mode) => `Where does this failure mode create confusion or support burden: ${mode}`),
      ]
    : interpolateList(referenceCopy.research?.fallbackQuestions, entry);
  return listPanel(ui("reference.researchQuestions"), questions);
}

export function patternStandardPanel(entry) {
  const contract = artifactContract(entry);
  return patternSection(`${entry.title} playbook`, html`
      <p>${entry.summary}</p>
      <p>${contract?.purpose ?? referenceCopy.pattern?.fallbackPurpose}</p>
  `, "wide reference-section");
}

export function patternDecisionTreePanel(entry) {
  const contract = artifactContract(entry);
  const decisions = contract?.decisionTree?.map((item, index) => [`Decision ${index + 1}`, item]) ?? [
    ...(referenceCopy.pattern?.fallbackDecisions ?? []),
  ].map((row) => row.map((value) => referenceTemplate(value, entry)));
  return patternSection(ui("reference.decisionTree"), html`
      <div class="architecture-chain">
        ${decisions.map(([name, copy], index) => patternDocCard(name, copy, index)).join("")}
      </div>
  `);
}

function patternDocCard(title, detail, index) {
  return componentDemo("card", { title, detail, status: String(index + 1), variant: "minimal", composition: "standard", fullWidth: true });
}

export function patternFailureModesPanel(entry) {
  const contract = artifactContract(entry);
  return listPanel(ui("reference.failureModes"), contract?.failureModes ?? interpolateList(referenceCopy.pattern?.fallbackFailureModes, entry));
}

export function patternContractPanel(entry) {
  const contract = artifactContract(entry);
  const rows = contract
    ? [
        ["entryConditions", "Condition[]", "yes", contract.entryConditions?.join(" · ") ?? ""],
        ["decisionTree", "Branch[]", "yes", contract.decisionTree?.join(" · ") ?? ""],
        ["componentDependencies", "ComponentRef[]", "yes", contract.componentDependencies?.join(", ") ?? ""],
        ["failureModes", "State[]", "yes", contract.failureModes?.join(" · ") ?? ""],
        ["successMetrics", "Metric[]", "yes", contract.successMetrics?.join(" · ") ?? ""],
      ]
    : (referenceCopy.pattern?.fallbackContractRows ?? []).map((row) => row.map((value) => referenceTemplate(value, entry, { componentsUsed: (entry.componentsUsed ?? []).join(", ") })));
  return patternSection(ui("contract.pattern"), html`
      ${artifactDetailTable({
        columns: [ui("table.field"), ui("table.type"), ui("table.required"), ui("table.notes")],
        rows,
      })}
  `);
}
