import { candidateComponentTabs, configureCandidateComponentDocs, hasCandidateCompositionPlan } from "./candidate-component-docs.js?v=2";
import { artifactFoundationTracePanel, configureComponentFoundationTrace } from "./component-foundation-trace.js?v=1";
import { componentDemo } from "./component-demo.js?v=60";
import { componentDetailDemoGrid, componentDetailSection, componentDetailTable } from "./gold-component-core.js?v=214";

export { artifactFoundationTracePanel };

let componentCopy = {};
let referenceCopy = {};
let html = String.raw;
let icon = () => "";
let iconFor = () => "";
let ui = (key) => key;
let referenceTemplate = (value) => value ?? "";
let interpolateList = () => [];
let selectDemo = () => "";
let demoCell = (_label, content) => content;
let threeTabs = (_entry, overviewExtra, designBody, buildBody) => [overviewExtra, designBody, buildBody];
let accessibilityPanel = () => "";
let guidelinesPanel = () => "";
let specPanel = () => "";
let agentPanel = () => "";
let listPanel = () => "";

export function configureFamilyComponentDocs(nextDeps) {
  componentCopy = nextDeps.componentCopy;
  referenceCopy = nextDeps.referenceCopy;
  html = nextDeps.html;
  icon = nextDeps.icon;
  iconFor = nextDeps.iconFor;
  ui = nextDeps.ui;
  referenceTemplate = nextDeps.referenceTemplate;
  interpolateList = nextDeps.interpolateList;
  selectDemo = nextDeps.selectDemo;
  demoCell = nextDeps.demoCell;
  threeTabs = nextDeps.threeTabs;
  accessibilityPanel = nextDeps.accessibilityPanel;
  guidelinesPanel = nextDeps.guidelinesPanel;
  specPanel = nextDeps.specPanel;
  agentPanel = nextDeps.agentPanel;
  listPanel = nextDeps.listPanel;
  configureComponentFoundationTrace(nextDeps);
  configureCandidateComponentDocs({ ...nextDeps, artifactFoundationTracePanel });
}

export function familyComponentTabs(entry) {
  if (hasCandidateCompositionPlan(entry.id)) return candidateComponentTabs(entry);
  if (componentCopy?.components?.[entry.id]) return componentContractFallbackTabs(entry);
  const profile = componentFamilyProfile(entry);
  return threeTabs(
    entry,
    `${componentStandardPanel(entry, profile)}${componentScenarioPanel(entry, profile)}${artifactFoundationTracePanel(entry, "Component")}`,
    `${componentFamilyDemoPanel(entry, profile)}${componentStateMatrixPanel(entry, profile)}${componentResponsiveContractPanel(entry, profile)}${accessibilityPanel(entry)}${guidelinesPanel(entry)}`,
    `${componentFamilyApiPanel(entry, profile)}${componentFamilyTestPanel(entry, profile)}${specPanel(entry)}${agentPanel(entry, "Component")}`,
  );
}

function componentContractFallbackTabs(entry) {
  const copy = componentCopy.components[entry.id] ?? {};
  return threeTabs(
    entry,
    `${componentStandardPanel(entry, componentFamilyProfile(entry))}${componentContractScenarioPanel(entry, copy)}${artifactFoundationTracePanel(entry, "Component")}`,
    `${componentContractDemoPanel(entry, copy, "states")}${componentContractAnatomyPanel(entry, copy)}${componentContractDemoPanel(entry, copy, "variants")}${accessibilityPanel(entry)}${guidelinesPanel(entry)}`,
    `${componentContractApiPanel(entry, copy)}${componentFamilyTestPanel(entry, componentFamilyProfile(entry))}${specPanel(entry)}${agentPanel(entry, "Component")}`,
  );
}

function componentContractScenarioPanel(entry, copy) {
  const scenario = copy["operational-example"]?.scenario;
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "operational-example",
      children: html`
      <h2>${ui("reference.operationalScenario")}</h2>
      <p>${copy["operational-example"]?.copy ?? entry.summary}</p>
      <div class="component-standard-demo">
        <article>
          <header><span>${icon(iconFor(entry))}</span><strong>${scenario?.rationaleTitle ?? entry.title}</strong></header>
          <ul>${(scenario?.rationale ?? []).map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article>
          <strong>${ui("reference.mustProve")}</strong>
          <div class="component-standard-surface">${componentDemo(entry.id, contractDemoDefaults(entry))}</div>
        </article>
      </div>
      `,
    })}
  `;
}

function componentContractDemoPanel(entry, copy, sectionId) {
  const section = copy[sectionId] ?? {};
  const demos = dedupeDemos(section.demos ?? []).slice(0, sectionId === "states" ? 8 : 6);
  if (!demos.length) return "";
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: sectionId,
      children: html`
      <h2>${sectionId === "states" ? ui("reference.stateMatrix") : "Variants"}</h2>
      <p>${section.copy ?? ""}</p>
      ${componentDetailDemoGrid({
        items: demos.map((demo) => ({
          label: demo.label ?? demo.state ?? demo.variant ?? entry.title,
          content: componentDemo(entry.id, normalizeContractDemo(entry, demo)),
        })),
      })}
      `,
    })}
  `;
}

function componentContractAnatomyPanel(entry, copy) {
  const anatomy = copy.anatomy?.items ?? [];
  if (!anatomy.length) return "";
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "anatomy",
      children: html`
      <h2>Anatomy</h2>
      <div class="role-grid">
        ${anatomy.map((item) => `<article><span>${icon(iconFor(entry))}</span><strong>${item.part}</strong><p>${item.rule}</p><code>${(item.tokens ?? []).join(", ")}</code></article>`).join("")}
      </div>
      `,
    })}
  `;
}

function componentContractApiPanel(entry, copy) {
  const props = copy["api-foundations"]?.props ?? [];
  if (!props.length) return componentFamilyApiPanel(entry);
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "api-foundations",
      children: html`
      <h2>${entry.title} ${ui("contract.api")}</h2>
      <p>${copy["api-foundations"]?.copy ?? ""}</p>
      ${componentDetailTable({
        columns: [ui("table.prop"), ui("table.type"), ui("table.required"), ui("table.notes")],
        rows: props.map((prop) => [prop.name, prop.type, prop.required, prop.notes]),
      })}
      `,
    })}
  `;
}

function dedupeDemos(demos) {
  const seen = new Set();
  return demos.filter((demo) => {
    const key = JSON.stringify(demo);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeContractDemo(entry, demo = {}) {
  if (entry.id === "chat-message") return { label: demo.label ?? "Message", body: demo.body ?? demo.message ?? "I can help with that.", meta: demo.timestamp ?? demo.meta ?? "Now", ...demo };
  if (entry.id === "chat-thread") return { label: demo.label ?? "Support thread", description: "Conversation history", ...demo, messages: chatThreadMessages(demo) };
  return { label: entry.title, ...demo };
}

function contractDemoDefaults(entry) {
  if (entry.id === "input-amount") return { label: "Approved amount", value: "1250.00", currency: "MXN" };
  if (entry.id === "chat-composer") return { label: "Reply", value: "Can you review this card limit?", sendLabel: "Send" };
  if (entry.id === "chat-message") return { label: "Support", body: "I can see the station requires a policy override.", meta: "Now", author: "agent" };
  if (entry.id === "chat-thread") return { label: "Support thread", description: "Conversation history", messages: chatThreadMessages({ messages: 3 }) };
  return { label: entry.title };
}

function chatThreadMessages(demo = {}) {
  const count = Number(demo.messages ?? 3);
  if (!count) return [];
  return [
    { key: "customer", author: "user", label: "Ana Sosa", body: "My fuel card was declined at Station 24.", meta: "2 min ago" },
    { key: "agent", author: "agent", label: "Support", body: "I can see the station requires a policy override.", meta: "Now" },
    { key: "system", author: "system", label: "Policy", body: "Override request logged for audit.", meta: "Now" },
  ].slice(0, Math.min(count, 3));
}

function componentFamilyProfile(entry) {
  const standards = componentCopy?.familyStandards ?? {};
  const [family, scenario, states] = standards.profiles?.[entry.group] ?? standards.fallbackProfile ?? ["", "", []];
  return { family, scenario, states };
}

function componentStandardPanel(entry, profile) {
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "family-standard",
      className: "reference-section",
      children: html`
      <span class="eyebrow">${entry.group} standard</span>
      <h2>${entry.title} documentation standard</h2>
      <p>${entry.summary}</p>
      <p>${referenceTemplate(componentCopy?.familyStandards?.standardCopy, entry, { family: profile.family })}</p>
      `,
    })}
  `;
}

function componentScenarioPanel(entry, profile) {
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "operational-example",
      children: html`
      <h2>${ui("reference.operationalScenario")}</h2>
      <p>${profile.scenario}</p>
      <div class="component-standard-demo">
        <article>
          <header><span>${icon(iconFor(entry))}</span><strong>${entry.title}</strong></header>
          <p>${componentScenarioCopy(entry)}</p>
          <div class="component-standard-surface">${componentFamilyDemo(entry, "default")}</div>
        </article>
        <article>
          <strong>${ui("reference.mustProve")}</strong>
          <ul>${(componentCopy?.familyStandards?.mustProve ?? []).map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      </div>
      `,
    })}
  `;
}

function componentFamilyDemoPanel(entry, profile) {
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "family-demo",
      children: html`
      <h2>${ui("reference.groupDemo")}</h2>
      <p>${referenceTemplate(componentCopy?.familyStandards?.demoCopy, entry, { group: entry.group })}</p>
      ${componentDetailDemoGrid({
        items: profile.states.map((state) => ({ label: state, content: componentFamilyDemo(entry, state) })),
      })}
      `,
    })}
  `;
}

function componentStateMatrixPanel(entry, profile) {
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "states",
      children: html`
      <h2>${ui("reference.stateMatrix")}</h2>
      <p>${componentCopy?.familyStandards?.stateMatrixCopy}</p>
      ${componentDetailDemoGrid({
        items: profile.states.slice(0, 6).map((state) => ({ label: state, content: componentFamilyDemo(entry, state) })),
      })}
      `,
    })}
  `;
}

function componentResponsiveContractPanel(entry) {
  return listPanel(ui("reference.responsiveBehavior"), interpolateList(componentCopy?.familyStandards?.responsiveBehavior, entry));
}

function componentFamilyApiPanel(entry) {
  const props = componentCopy?.familyStandards?.apiRows ?? [];
  return html`
    ${componentDetailSection({
      component: entry.id,
      section: "api-foundations",
      children: html`
      <h2>${entry.group} ${ui("contract.api")}</h2>
      ${componentDetailTable({
        columns: [ui("table.prop"), ui("table.type"), ui("table.required"), ui("table.notes")],
        rows: props,
      })}
      `,
    })}
  `;
}

function componentFamilyTestPanel(entry, profile) {
  const rows = (componentCopy?.familyStandards?.testRows ?? []).map((row) =>
    row.map((value) => referenceTemplate(value, entry, { states: profile.states.join(", ") })),
  );
  return componentTestingContractPanel(entry.title, rows);
}

function componentTestingContractPanel(title, rows) {
  return html`
    ${componentDetailSection({
      component: title,
      section: "tests-rejection-rules",
      children: html`
      <span class="eyebrow">${ui("reference.componentTestingContract")}</span>
      <h2>${ui("tests.required")}</h2>
      <p>${referenceTemplate(componentCopy?.familyStandards?.testingModelCopy, { title })}</p>
      ${componentDetailTable({
        className: "testing-contract-table",
        columns: [ui("table.layer"), ui("table.expectation"), ui("table.foundation"), ui("table.evidence")],
        rows: rows.map(([layer, expectation]) => [layer, expectation, testingFoundationFor(layer), testingEvidenceFor(layer)]),
      })}
      `,
    })}
  `;
}

function testingFoundationFor(layer) {
  const foundations = {
    Rendering: "Voice + Accessibility",
    Props: "State + Growth",
    States: "State + Energy",
    Interaction: "State + Momentum",
    Accessibility: "Accessibility + Frame",
    Responsive: "Frame + Voice",
    "Token compliance": "All foundations",
    "Product contract": "Growth + Tone",
  };
  return foundations[layer] ?? "Foundation contract";
}

function testingEvidenceFor(layer) {
  return referenceCopy.testingEvidence?.[layer] ?? referenceCopy.testingEvidence?.fallback;
}

function componentScenarioCopy(entry) {
  return componentCopy?.familyStandards?.scenarioCopy?.[entry.group] ?? componentCopy?.familyStandards?.scenarioCopy?.fallback ?? "";
}

function componentFamilyDemo(entry, state) {
  if (entry.group === "Selection" || entry.group === "Inputs") return selectDemo(entry.title, state === "empty" ? "Choose value" : `${entry.title} value`, stateLabel(state), "sm", normalizeDemoState(state));
  if (entry.group === "Feedback") return `<div class="standard-chip ${state}">${icon(iconFor(entry))}<strong>${stateLabel(state)}</strong></div>`;
  if (entry.group === "Overlay") return `<div class="standard-popover"><span class="standard-popover__trigger">${entry.title}</span><span>${stateLabel(state)}</span></div>`;
  if (entry.group === "Dashboards" || entry.group === "Data") return `<div class="standard-metric"><strong>${state === "empty" ? "--" : "24"}</strong><span>${stateLabel(state)}</span></div>`;
  if (entry.group === "Mobile" || entry.group === "Maps") return `<div class="standard-phone-row">${icon(iconFor(entry))}<span>${stateLabel(state)}</span></div>`;
  return `<div class="standard-chip ${state}">${icon(iconFor(entry))}<strong>${stateLabel(state)}</strong></div>`;
}

function normalizeDemoState(state) {
  if (["focus", "loading", "error", "disabled", "open"].includes(state)) return state;
  if (state === "selected" || state === "filled") return "filled";
  return "";
}

function stateLabel(state) {
  const fallback = `${state.charAt(0).toUpperCase()}${state.slice(1)}`;
  return referenceCopy.stateLabels?.[state] ?? referenceTemplate(referenceCopy.stateLabels?.fallbackTemplate, {}, { state: fallback }) ?? `${fallback} state`;
}
