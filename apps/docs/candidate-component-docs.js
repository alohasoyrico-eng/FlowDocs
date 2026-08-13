import { componentDemo } from "./component-demo.js?v=60";
import { candidateCompositionPlans } from "./candidate-component-plans.js?v=2";
import { componentDetailChecklist, componentDetailDemoGrid, componentDetailSection, componentDetailTable } from "./gold-component-core.js?v=221";

let html = String.raw;
let icon = () => "";
let ui = (key) => key;
let demoCell = (_label, content) => content;
let accessibilityPanel = () => "";
let guidelinesPanel = () => "";
let specPanel = () => "";
let agentPanel = () => "";
let artifactFoundationTracePanel = () => "";

export function configureCandidateComponentDocs(nextDeps) {
  html = nextDeps.html;
  icon = nextDeps.icon;
  ui = nextDeps.ui;
  demoCell = nextDeps.demoCell;
  accessibilityPanel = nextDeps.accessibilityPanel;
  guidelinesPanel = nextDeps.guidelinesPanel;
  specPanel = nextDeps.specPanel;
  agentPanel = nextDeps.agentPanel;
  artifactFoundationTracePanel = nextDeps.artifactFoundationTracePanel;
}

export function hasCandidateCompositionPlan(id) {
  return Boolean(candidateCompositionPlans[id]);
}

export function candidateComponentTabs(entry) {
  const plan = candidateCompositionPlans[entry.id];
  const overviewBody = `${candidateStandardPanel(entry)}${candidateCoveragePanel(entry, plan)}${artifactFoundationTracePanel(entry, "Component")}`;
  const designBody = `${candidateCompositionPanel(entry, plan)}${candidateBoundaryPanel(plan)}${accessibilityPanel(entry)}${guidelinesPanel(entry)}`;
  const buildBody = `${candidateDecisionPanel(entry, plan)}${specPanel(entry)}${agentPanel(entry, "Component")}`;
  return [
    { id: "overview", label: ui("tabs.overview"), body: overviewBody },
    { id: "design", label: ui("tabs.design"), body: designBody },
    { id: "build", label: ui("tabs.build"), body: buildBody },
  ];
}

function candidateStandardPanel(entry) {
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "candidate-standard",
      className: "reference-section",
      children: html`
      <span class="eyebrow">Candidate standard</span>
      <h2>${entry.title} documentation standard</h2>
      <p>${entry.summary}</p>
      <p>This route stays in component review while Design System proves whether package-backed components already cover the bounded control.</p>
      `,
    })}
  `;
}

function candidateCoveragePanel(entry, plan) {
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "candidate-coverage",
      className: "reference-section",
      attrs: `data-candidate-component="${entry.id}"`,
      children: html`
      <span class="eyebrow">Candidate coverage</span>
      <h2>${entry.title} stays pending</h2>
      <p>${plan.decision}</p>
      <div class="token-list">${plan.coverage.map((component) => `<code>${component}</code>`).join("")}</div>
      `,
    })}
  `;
}

function candidateCompositionPanel(entry, plan) {
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "candidate-composition",
      children: html`
      <h2>Design System composition substitute</h2>
      <p>${plan.summary}</p>
      ${candidateAssessmentMarkup(plan)}
      ${componentDetailDemoGrid({
        className: "candidate-composition-grid",
        items: plan.examples.map((example) => ({ label: example.label, content: candidateExampleMarkup(example) })),
      })}
      `,
    })}
  `;
}

function candidateAssessmentMarkup(plan) {
  const assessment = plan.assessment;
  if (!assessment) return "";
  return html`
    <div class="candidate-assessment" data-candidate-assessment="${assessment.status}">
      <div><code>Coverage</code><span>${assessment.status}</span></div>
      <div><code>Gap</code><span>${assessment.gap}</span></div>
      <div><code>Next</code><span>${assessment.next}</span></div>
    </div>
  `;
}

function candidateExampleMarkup(example) {
  const components = example.components ?? [];
  return html`
    <div class="candidate-composition" data-candidate-composition="${example.id ?? ""}">
      ${components.map(({ component, demo }) => componentDemo(component, demo ?? {})).join("")}
    </div>
  `;
}

function candidateBoundaryPanel(plan) {
  return html`
    ${componentDetailSection({
      component: "candidate-composition",
      section: "candidate-boundary",
      children: html`
      <h2>Pattern boundary</h2>
      <p>${plan.patternLater}</p>
      ${componentDetailChecklist([
        { copy: "Use package-backed components for the visible bounded controls." },
        { icon: "rule", tone: "action", copy: "Do not move this route until substitute coverage is visible and validated." },
        { icon: "account_tree", tone: "warning", copy: "Move only the orchestration, policy, and process layer to Patterns later." },
      ])}
      `,
    })}
  `;
}

function candidateDecisionPanel(entry, plan) {
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "candidate-decision",
      children: html`
      <h2>Backlog decision</h2>
      ${componentDetailTable({
        component: entry.id,
        section: "candidate-decision",
        columns: ["Field", "Decision"],
        rows: [
          ["Candidate", entry.title],
          ["Component coverage", plan.coverage.join(", ")],
          ["Coverage status", plan.assessment?.status ?? "pending"],
          ["Component gap", plan.assessment?.gap ?? "Pending assessment."],
          ["Boundary", plan.patternLater],
          ["Next action", plan.next],
          ["Next decision", plan.assessment?.next ?? plan.next],
        ],
      })}
      `,
    })}
  `;
}
