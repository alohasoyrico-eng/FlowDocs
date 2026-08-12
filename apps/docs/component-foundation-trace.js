import { componentDemo } from "./component-demo.js?v=61";

let html = String.raw;
let icon = () => "";
let iconFor = () => "";
let ui = (key) => key;
let artifactContract = () => null;

export function configureComponentFoundationTrace(nextDeps) {
  html = nextDeps.html;
  icon = nextDeps.icon;
  iconFor = nextDeps.iconFor;
  ui = nextDeps.ui;
  artifactContract = nextDeps.artifactContract;
}

export function artifactFoundationTracePanel(entry, artifactType) {
  const rows = artifactFoundationTraceRows(entry, artifactType);
  return html`
    <section class="surface docs-section-surface detail-section-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <span class="eyebrow">${ui("reference.foundationTrace")}</span>
      <h2>${ui("reference.howFoundationsGovern")} ${entry.title}</h2>
      <p>${entry.title} must be implemented through foundation decisions before it becomes a component, pattern, or template surface.</p>
      <div class="role-grid foundation-trace-grid" data-doc-primitive="foundation-trace-grid">
        ${rows
          .map(
            (row) => componentDemo("card", { title: row.foundation, detail: `${row.decision} ${row.contract}`, icon: icon(iconFor({ title: row.foundation })), variant: "minimal", composition: "standard", fullWidth: true }),
          )
          .join("")}
      </div>
    </section>
  `;
}

function artifactFoundationTraceRows(entry, artifactType) {
  const contract = artifactContract(entry);
  const contractFoundations = contract?.governingFoundations ?? Object.keys(contract?.foundations ?? {});
  if (contractFoundations.length) {
    return contractFoundations.slice(0, 8).map((foundation) => ({
      foundation,
      decision: foundationTraceDecision(foundation, entry, artifactType),
      contract: foundationTraceContractFromSpec(foundation, contract) ?? foundationTraceContract(foundation),
    }));
  }

  const names = new Set(["Energy", "Voice", "Frame", "State", "Accessibility"]);
  const text = `${entry.title} ${entry.group ?? ""} ${entry.platform ?? ""} ${entry.summary ?? ""}`.toLowerCase();

  if (artifactType !== "Component") names.add("Growth");
  if (artifactType === "Template") names.add("Depth");
  if (artifactType === "Template" || artifactType === "Pattern" || /mobile|map|route|sheet|overlay|dialog|drawer|feedback|motion|loading|auth/.test(text)) names.add("Momentum");
  if (/overlay|sheet|dialog|drawer|modal|dashboard|map|detail|template|desktop/.test(text)) names.add("Depth");
  if (/feedback|error|empty|auth|otp|permission|support|content|input|onboarding/.test(text) || artifactType !== "Component") names.add("Tone");
  if (/icon|quick action|pin|map|status|illustration|symbol|station|vehicle/.test(text)) {
    names.add("Iconography");
    names.add("Symbol");
  }

  return Array.from(names)
    .slice(0, 8)
    .map((foundation) => ({
      foundation,
      decision: foundationTraceDecision(foundation, entry, artifactType),
      contract: foundationTraceContract(foundation),
    }));
}

function foundationTraceDecision(foundation, entry, artifactType) {
  const label = `${artifactType.toLowerCase()} ${entry.title}`;
  const decisions = {
    Energy: `Defines color roles for ${label}: action, status, surface, border, and feedback cannot use raw values.`,
    Voice: `Sets type scale, title rhythm, labels, helper copy, captions, and code text for ${label}.`,
    Frame: `Controls spacing, density, radius, grid, control height, and responsive rhythm for ${label}.`,
    State: `Owns hover, focus, pressed, selected, loading, disabled, error, and permission precedence for ${label}.`,
    Accessibility: `Requires keyboard, touch target, focus restoration, names, contrast, reduced motion, and recovery behavior.`,
    Growth: `Connects ${label} to adoption, maturity, telemetry, deprecation, and validation signals.`,
    Momentum: `Defines transitions, entrance, exit, loading, route change, and reduced-motion behavior for ${label}.`,
    Depth: `Defines elevation, overlay, stacking, focus layer, and spatial priority for ${label}.`,
    Tone: `Controls neutral, assistive, urgent, success, warning, and repair language for ${label}.`,
    Iconography: `Uses Material Symbols by semantic name, size, weight, label visibility, and accessible name.`,
    Symbol: `Defines the visual metaphor only when ${label} needs status, domain, or explanatory imagery.`,
  };
  return decisions[foundation] ?? `Defines the semantic rule that ${label} must follow.`;
}

function foundationTraceContract(foundation) {
  const contracts = {
    Energy: "--sys-energy-*",
    Voice: "--sys-voice-*",
    Frame: "--sys-frame-*",
    State: "--sys-state-*",
    Accessibility: "--sys-a11y-*",
    Growth: "--sys-growth-*",
    Momentum: "--sys-momentum-*",
    Depth: "--sys-depth-*",
    Tone: "--sys-tone-*",
    Iconography: "--sys-icon-*",
    Symbol: "--sys-symbol-*",
  };
  return contracts[foundation] ?? "foundation contract";
}

function foundationTraceContractFromSpec(foundation, contract) {
  const key = foundation.toLowerCase();
  return contract.tokenDependencies?.find((token) => token.toLowerCase().includes(`.${key}.`)) ?? null;
}
