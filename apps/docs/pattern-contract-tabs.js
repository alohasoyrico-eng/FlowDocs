import { artifactContract, artifactDetailTable, artifactDocumentationSection, artifactFoundationTracePanel, artifactVariantGrid, docsLinkCard, findComponent, html, icon, slug, teamsPanel, ui, listPanel } from "./detail-tabs-core.js?v=10";
import { componentDemo } from "./component-demo.js?v=60";
import { patternCopy } from "./docs-state.js";
import { patternBuildGatePanel } from "./pattern-build-gates.js?v=5";
import { candidatePatternOverviewDemo } from "./pattern-candidate-demos.js?v=28";
import { desktopPatternOverviewDemo } from "./pattern-desktop-demos.js?v=8";
import { mobilePatternOverviewDemo } from "./pattern-mobile-demos.js?v=11";
import { utilityPatternOverviewDemo } from "./pattern-utility-demos.js?v=10";
import { journeyPatternOverviewDemo } from "./pattern-journey-demos.js?v=6";
import { operationalPatternOverviewDemo } from "./pattern-operational-demos.js?v=5";

export function hasPatternSource(entry) {
  return Boolean(patternSource(entry));
}

export function patternContractTabs(entry) {
  const tabs = [
    [ui("tabs.overview"), `${patternContractOverview(entry)}${teamsPanel(entry)}${artifactFoundationTracePanel(entry, "Pattern")}`],
    [ui("tabs.design"), patternContractDesign(entry)],
    [ui("tabs.build"), patternContractBuild(entry)],
    [ui("tabs.miel"), patternContractMiel(entry)],
  ];
  return tabs.map(([labelText, body]) => ({ id: slug(labelText), label: labelText, body }));
}

function patternSource(entry) {
  return patternCopy?.patterns?.[entry.id] ?? null;
}

function patternContractSection(className, title, body, attrs = "") {
  return artifactDocumentationSection({
    title,
    body,
    className: ["wide", className].filter(Boolean).join(" "),
    attrs,
    source: "pattern-contract-tabs",
  });
}

function patternContractOverview(entry) {
  const source = patternSource(entry);
  return html`
    ${patternContractSection("pattern-stage-panel", entry.title, html`
      <p>${source.purpose ?? entry.summary}</p>
      <div class="pattern-variant-grid">
        ${patternInfoCard("Use when", source.useWhen)}
        ${patternInfoCard("Review before use", source.doNotUseWithoutReview)}
      </div>
    `)}
    ${patternOverviewDemo(entry.id)}
    ${patternDependencyPanel(entry, source)}
  `;
}

function patternOverviewDemo(patternId) {
  const dedicatedDemo = candidatePatternOverviewDemo(patternId) || operationalPatternOverviewDemo(patternId) || desktopPatternOverviewDemo(patternId) || utilityPatternOverviewDemo(patternId) || mobilePatternOverviewDemo(patternId) || journeyPatternOverviewDemo(patternId);
  if (dedicatedDemo) return dedicatedDemo;
  if (patternId === "bulk-actions") return bulkActionsDemoPanel();
  if (patternId === "multi-step-form") return multiStepFormDemoPanel();
  if (patternId === "help-center") return helpCenterDemoPanel();
  return "";
}

function packageDemo(component, demo = {}, attrs = {}) {
  const markup = componentDemo(component, demo);
  if (!markup) return "";
  const attrText = Object.entries({ "data-pattern-component": component, ...attrs })
    .map(([key, value]) => value === "" ? key : `${key}="${String(value).replace(/"/g, "&quot;")}"`)
    .join(" ");
  return markup.replace(/^<([a-z0-9-]+)/i, `<$1 ${attrText}`);
}

function bulkActionsDemoPanel() {
  const rows = [
    { id: "jmx-214-b", plate: "JMX-214-B", driver: "Ana Sosa", status: "Active", spend: "$842" },
    { id: "kld-901-c", plate: "KLD-901-C", driver: "Luis Vera", status: "Review", spend: "$631" },
    { id: "mtr-330-a", plate: "MTR-330-A", driver: "Iris Mora", status: "Frozen", spend: "$120" },
  ];
  return patternContractSection("pattern-bulk-demo-panel", "Bulk action selection", html`
      <div class="pattern-bulk-demo" data-pattern-bulk-actions data-selected-count="0">
        <div class="pattern-bulk-demo__toolbar" data-bulk-toolbar hidden>
          <strong><span data-bulk-count>0</span> selected</strong>
          <div>
            ${packageDemo("button", { label: "Export", variant: "secondary", icon: "download" }, { "data-bulk-action": "export" })}
            ${packageDemo("button", { label: "Mark review", icon: "fact_check" }, { "data-bulk-action": "review" })}
            ${packageDemo("button", { label: "Freeze", intent: "danger", icon: "block" }, { "data-bulk-action": "freeze" })}
          </div>
        </div>
        <div class="pattern-bulk-demo__selection">
          ${packageDemo("checkbox", { label: "Select all visible vehicles", value: "all" }, { "data-bulk-select-all-control": "" })}
          <div class="pattern-bulk-demo__selection-list" aria-label="Selectable vehicles">
            ${rows.map((row) => packageDemo("checkbox", {
              label: row.plate,
              description: `${row.driver} - ${row.status}`,
              value: row.id,
            }, {
              "data-bulk-item-control": "",
              "data-bulk-id": row.id,
            })).join("")}
          </div>
        </div>
        ${packageDemo("table", { label: "Selected vehicle context", rows, selectedKey: "" }, { "data-bulk-table": "" })}
        <div data-bulk-dialog hidden>
          ${packageDemo("dialog", {
            label: "Freeze selected vehicles?",
            description: "This action affects selected vehicles and requires an audit trail.",
            trigger: "Freeze selected",
            tone: "danger",
            primaryLabel: "Freeze vehicles",
            actions: [{ label: "Freeze vehicles", intent: "danger", key: "confirm" }, { label: "Cancel", variant: "secondary", key: "cancel" }],
          }, { "data-pattern-dialog": "bulk" })}
        </div>
        <div data-bulk-toast hidden>
          ${packageDemo("toast", { label: "Bulk action queued", description: "Selected vehicles are being processed.", tone: "success" }, { "data-pattern-toast": "bulk" })}
        </div>
      </div>
  `);
}

function multiStepFormDemoPanel() {
  return patternContractSection("pattern-multi-step-panel", "Vehicle request wizard", html`
      <div class="pattern-multi-step" data-multi-step-demo data-step-index="0">
        <div data-stepper>${packageDemo("stepper", { current: 0, steps: [{ label: "Vehicle", description: "Basic data" }, { label: "Limit", description: "Policy" }, { label: "Review", description: "Submit" }] })}</div>
        <div class="pattern-multi-step__body">
          <form class="pattern-multi-step__form" data-step-panel="0" novalidate>
            ${packageDemo("input", { label: "Plate", value: "JMX-214-B" }, { "data-step-field": "plate" })}
            ${packageDemo("input", { label: "Driver", value: "Ana Sosa" }, { "data-step-field": "driver" })}
          </form>
          <form class="pattern-multi-step__form" data-step-panel="1" hidden novalidate>
            ${packageDemo("input", { label: "Monthly limit", value: "850", type: "number" }, { "data-step-field": "limit" })}
            ${packageDemo("input", { label: "Policy owner", value: "Fleet ops" }, { "data-step-field": "owner" })}
          </form>
          <div class="pattern-multi-step__review" data-step-panel="2" hidden>
            ${stepSummaryCard("Vehicle", "JMX-214-B", "plate")}${stepSummaryCard("Driver", "Ana Sosa", "driver")}
            ${stepSummaryCard("Monthly limit", "$850", "limit")}${stepSummaryCard("Owner", "Fleet ops", "owner")}
          </div>
          <p class="pattern-multi-step__error" data-step-error hidden role="alert">Complete the current step before continuing.</p>
        </div>
        <footer class="pattern-multi-step__actions">
          ${packageDemo("button", { label: "Save draft", variant: "secondary", icon: "save" }, { "data-step-save": "" })}
          <div>
            ${packageDemo("button", { label: "Back", variant: "secondary" }, { "data-step-prev": "", hidden: "" })}
            ${packageDemo("button", { label: "Continue" }, { "data-step-next": "" })}
          </div>
        </footer>
        <div data-step-toast hidden>
          ${packageDemo("toast", { label: "Draft saved", description: "Progress is available for resume.", tone: "success" }, { "data-pattern-toast": "multi-step" })}
        </div>
      </div>
  `);
}

function stepSummaryCard(title, value, key) { return packageDemo("card", { title, value, variant: "minimal", composition: "stats", fullWidth: true }, { "data-step-summary-card": key, "data-step-summary": key }); }

function settingsDemoPanel() {
  return patternContractSection("pattern-settings-panel", "Workspace settings", html`
      <div class="pattern-settings-demo" data-settings-demo data-dirty="false">
        <div class="pattern-settings-demo__section">
          <header>
            <h3>Notifications</h3>
            <p>Immediate settings announce saved state after a user change.</p>
          </header>
          ${packageDemo("switch", { label: "Fuel alerts", description: "Notify managers when spend exceeds policy.", checked: true }, { "data-setting-control": "", "data-setting-mode": "immediate" })}
          ${packageDemo("select", {
            label: "Weekly summary",
            helper: "Send a Monday digest to fleet owners.",
            value: "managers",
            options: [{ label: "Managers only", value: "managers" }, { label: "All operators", value: "operators" }, { label: "Disabled", value: "disabled" }],
          }, { "data-setting-control": "", "data-setting-mode": "explicit" })}
        </div>
        <div class="pattern-settings-demo__section pattern-settings-demo__section--danger">
          <header>
            <h3>Danger zone</h3>
            <p>Destructive actions stay separated and require confirmation.</p>
          </header>
          ${packageDemo("button", { label: "Archive workspace", intent: "danger", icon: "delete" }, { "data-settings-danger": "" })}
        </div>
        <footer class="pattern-settings-demo__save" data-settings-savebar hidden>
          <span data-settings-status>Unsaved changes</span>
          ${packageDemo("button", { label: "Save changes" }, { "data-settings-save": "" })}
        </footer>
        <div data-settings-dialog hidden>
          ${packageDemo("dialog", {
            label: "Archive this workspace?",
            description: "This removes the workspace from active operations and creates an audit event.",
            trigger: "Archive workspace",
            tone: "danger",
            actions: [{ label: "Archive", intent: "danger", key: "confirm" }, { label: "Cancel", variant: "secondary", key: "cancel" }],
          }, { "data-pattern-dialog": "settings" })}
        </div>
        <div data-settings-toast hidden>
          ${packageDemo("toast", { label: "Settings saved", description: "Workspace preferences are up to date.", tone: "success" }, { "data-pattern-toast": "settings" })}
        </div>
      </div>
  `);
}

function helpCenterDemoPanel() {
  const articles = [
    ["limits", "Card limits", "Learn how monthly limits and owner approvals work.", "Billing", "limits policy cards"],
    ["fuel", "Fuel alerts", "Set threshold alerts for stations, spend, and exceptions.", "Operations", "alerts fuel stations"],
    ["roles", "Roles and access", "Review workspace permissions before inviting operators.", "Security", "roles access permissions"],
  ];
  return patternContractSection("pattern-help-panel", "Help center search", html`
      <div class="pattern-help-demo" data-help-demo>
        <label class="pattern-help-demo__search">
          ${packageDemo("input", { label: "Search help articles", placeholder: "Search articles, tags, or keywords", type: "search" }, { "data-help-search-control": "" })}
        </label>
        <div class="pattern-help-demo__layout">
          <nav class="pattern-help-demo__categories" aria-label="Help categories">
            ${packageDemo("button", { label: "All", variant: "secondary" }, { "data-help-category": "all", "aria-pressed": "true" })}
            ${packageDemo("button", { label: "Billing", variant: "secondary" }, { "data-help-category": "Billing" })}
            ${packageDemo("button", { label: "Operations", variant: "secondary" }, { "data-help-category": "Operations" })}
            ${packageDemo("button", { label: "Security", variant: "secondary" }, { "data-help-category": "Security" })}
          </nav>
          <div class="pattern-help-demo__results" data-help-results>
            ${articles.map(([id, title, summary, category, keywords]) => html`
              ${packageDemo("card", { title, detail: summary, status: category }, { "data-help-article": id, "data-help-category-name": category, "data-help-keywords": keywords, role: "button", "aria-selected": "false", tabindex: "0" })}
            `).join("")}
          </div>
          <article class="pattern-help-demo__article" data-doc-primitive="pattern-help-article-demo" data-help-article-panel tabindex="-1">
            <span class="eyebrow" data-help-article-category>Billing</span>
            <h3 data-help-article-title>Card limits</h3>
            <p data-help-article-copy>Learn how monthly limits and owner approvals work.</p>
            ${packageDemo("button", { label: "Contact support", variant: "secondary", icon: "support_agent" })}
          </article>
          <div class="pattern-help-demo__empty" data-help-empty hidden role="status">
            ${packageDemo("empty-state", { label: "No articles found", description: "Try a broader keyword or contact support.", icon: "search_off", actionLabel: "Contact support" })}
          </div>
        </div>
      </div>
  `);
}

function patternInfoCard(title, items = []) {
  return patternMielCard(title, items);
}

function patternDependencyPanel(entry, source) {
  const contract = artifactContract(entry);
  const foundations = contract?.governingFoundations ?? Object.keys(contract?.foundations ?? {});
  const primitives = contract?.primitiveDependencies ?? [];
  const components = contract?.componentDependencies ?? source.componentsUsed ?? entry.componentsUsed ?? [];
  const patterns = contract?.patternDependencies ?? [];
  const tokens = contract?.tokenDependencies ?? entry.tokens ?? [];
  const primitiveSlots = (source.slots ?? []).filter((row) => primitives.includes(row[1]));
  return patternContractSection("", "Design System dependencies", html`
      ${dependencyGroup("Foundations", foundations, (name) =>
        docsLinkCard("foundations", slug(name), "foundation", name, "Governing foundation consumed by this pattern contract."),
      )}
      ${dependencyGroup("Primitives", primitives, (name) =>
        docsLinkCard("primitives", slug(name), "category", name, primitiveDependencySummary(name, primitiveSlots)),
      )}
      ${dependencyGroup("Components", components, (name) =>
        docsLinkCard("components", slug(name), "widgets", name, findComponent(name)?.summary ?? "Package component dependency."),
      )}
      ${dependencyGroup("Pattern dependencies", patterns, (name) =>
        docsLinkCard("patterns", slug(name), "account_tree", name, "Composed pattern dependency declared by the contract."),
      )}
      ${tokens.length ? html`
        <div class="pattern-dependency-group">
          <h3>Token contract</h3>
          <div class="token-list">${tokens.map((token) => `<code>${token}</code>`).join("")}</div>
        </div>
      ` : ""}
  `);
}

function dependencyGroup(title, items, renderItem) {
  const uniqueItems = [...new Set(items ?? [])].filter(Boolean);
  if (!uniqueItems.length) return "";
  return html`
    <div class="pattern-dependency-group">
      <h3>${title}</h3>
      <div class="relation-grid">
        ${uniqueItems.map(renderItem).join("")}
      </div>
    </div>
  `;
}

function primitiveDependencySummary(name, primitiveSlots) {
  const slots = primitiveSlots.filter((row) => row[1] === name).map((row) => row[0]);
  if (slots.length) return `Primitive dependency owning structural slot(s): ${slots.join(", ")}.`;
  return "Primitive dependency declared by this pattern contract.";
}

function patternContractDesign(entry) {
  const source = patternSource(entry);
  return html`
    ${patternFoundationPanel(source)}
    ${patternSlotContractPanel(source)}
    ${patternVariantPanel(source)}
    ${patternMotionPanel(source)}
    ${listPanel("Accessibility contract", source.accessibility ?? [])}
  `;
}

function patternFoundationPanel(source) {
  return patternContractSection("pattern-rule-panel", "Foundations consumed", html`
      ${artifactDetailTable({
        columns: ["Foundation", "Type", "Required", "Rule"],
        rows: (source.foundations ?? []).map(([name, rule]) => [name, "Foundation", "Required", rule]),
      })}
  `);
}

function patternSlotContractPanel(source) {
  return patternContractSection("pattern-rule-panel", "Slot contract", html`
      ${artifactDetailTable({
        columns: ["Slot", "Type", "Required", "Notes"],
        rows: source.slots ?? [],
      })}
  `);
}

function patternVariantPanel(source) {
  return patternContractSection("pattern-design-section pattern-design-demo-panel", "Variants and states", html`
      ${artifactVariantGrid({
        items: (source.variants ?? []).map(([title, status, copy]) => ({ title, status, copy })),
      })}
  `);
}

function patternMotionPanel(source) {
  return patternContractSection("pattern-rule-panel", "Motion contract", html`
      <div class="architecture-chain">
        ${(source.motion ?? []).map(([name, rule], index) => packageDemo("card", {
          title: name,
          detail: rule,
          status: String(index + 1),
          variant: "minimal",
          composition: "standard",
          fullWidth: true,
        })).join("")}
      </div>
  `);
}

function patternContractBuild(entry) {
  const source = patternSource(entry);
  const requiredSlots = (source.slots ?? []).filter((row) => row[2] === "yes").map((row) => `Declare ${row[0]}: ${row[3]}`);
  return html`
    ${patternSlotContractPanel(source)}
    ${listPanel("Implementation checklist", [...requiredSlots, ...(source.tests ?? [])])}
    ${listPanel("Tests and rejection rules", [...(source.tests ?? []), ...((source.miel?.rejectIf ?? []).map((item) => `Reject if: ${item}`))])}
    ${patternBuildGatePanel(entry)}
  `;
}

function patternContractMiel(entry) {
  const source = patternSource(entry);
  const miel = source.miel ?? {};
  return patternContractSection("pattern-miel-panel", `${entry.title} MIEL`, html`
      <header class="pattern-miel-header">
        <span class="eyebrow">MIEL</span>
        <p>Agent boundary, human checkpoints, and pattern rejection rules.</p>
      </header>
      <div class="pattern-miel-grid">
        ${patternMielCard(ui("miel.agentCanDecide"), miel.canDecide ?? [])}
        ${patternMielCard(ui("miel.agentMustAsk"), miel.mustAsk ?? [])}
        ${patternMielCard(ui("miel.rejectIf"), miel.rejectIf ?? [])}
      </div>
      <div class="pattern-miel-bottom">
        ${packageDemo("card", { title: ui("miel.handoff"), detail: miel.handoff ?? "", variant: "minimal", composition: "standard", fullWidth: true })}
      </div>
  `, `data-pattern-doc="miel"`);
}

function patternMielCard(title, items) {
  return packageDemo("card", { title, detail: items.join(" "), variant: "minimal", composition: "standard", fullWidth: true });
}
