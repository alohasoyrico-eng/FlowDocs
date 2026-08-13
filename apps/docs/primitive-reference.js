import { referenceCallout, referenceCodeBlock, referenceList, referenceMatrixGrid, referenceRuleGrid, referenceSection, referenceTokenGrid } from "./reference-layout.js?v=6";
import { escapeHtml } from "./utils.js";

let primitiveCopy = {};
let html = String.raw;
let icon = () => "";
let ui = (key) => key;
let artifactContract = () => null;
let buttonDemo = () => "";

export function configurePrimitiveReference(nextDeps) {
  primitiveCopy = nextDeps.primitiveCopy;
  html = nextDeps.html;
  icon = nextDeps.icon;
  ui = nextDeps.ui;
  artifactContract = nextDeps.artifactContract;
  buttonDemo = nextDeps.buttonDemo;
}

function primitiveTemplate(value, entry) {
  return String(value ?? "")
    .replaceAll("{{title}}", entry.title)
    .replaceAll("{{titleLower}}", entry.title.toLowerCase())
    .replaceAll("{{firstToken}}", entry.tokens[0] ?? `${entry.id}.*`)
    .replaceAll("{{componentName}}", entry.title.replace(/\s+/g, ""));
}

export function primitivePurposeSection(entry) {
  const contract = artifactContract(entry);
  if (contract) {
    return referenceSection(
      ui("reference.purpose"),
      "",
      html`
        <p class="reference-lede">${contract.purpose}</p>
        <div class="reference-copy-grid">
          <p>${entry.title} consumes ${contract.governingFoundations.join(", ")} and exposes implementation-safe primitive roles.</p>
          <p>Foundation inputs: ${contract.foundationInputs.join(", ")}.</p>
          <p>Its API outputs ${contract.api.outputs.join(", ")} instead of raw styling decisions.</p>
          <p>Agents must reject outputs when: ${contract.rejectIf[0]}</p>
        </div>
      `,
      "large",
    );
  }
  const fallback = primitiveCopy?.purposeFallback?.columns ?? [];
  return referenceSection(
    ui("reference.purpose"),
    "",
    html`
      <p class="reference-lede">${entry.summary}</p>
      <div class="reference-copy-grid">
        ${fallback.map((copy) => `<p>${primitiveTemplate(copy, entry)}</p>`).join("")}
      </div>
    `,
    "large",
  );
}

export function primitiveLiveDemoSection(entry) {
  return referenceSection(
    ui("reference.liveDemo"),
    primitiveCopy?.liveDemo?.description ?? "",
    primitiveReferenceDemo(entry),
  );
}

function primitiveDemoCopy(entry) {
  return primitiveCopy?.demos?.[entry.title] ?? primitiveCopy?.demos?.fallback ?? {};
}

function primitiveDemoAria(demo, entry) {
  return primitiveTemplate(demo.ariaLabel ?? demo.ariaLabelTemplate ?? "", entry);
}

function primitiveReferenceDemo(entry) {
  const demo = primitiveDemoCopy(entry);
  const props = {
    ...demo,
    ariaLabel: primitiveDemoAria(demo, entry),
    density: "sm",
  };
  return `<div class="docs-react-island docs-primitive-demo-island" data-react-component="documentation-primitive-demo" data-component-source="react-pattern" data-doc-pattern="documentation-primitive-demo" data-flowdocs-boundary="documentation-primitive-demo" data-doc-primitive="primitive-demo" data-demo-type="${escapeHtml(demo.type ?? "surface")}" data-react-props="${escapeHtml(JSON.stringify(props))}"></div>`;
}

export function primitiveResponsibilitiesReferenceSection(entry) {
  const responsibilities = primitiveResponsibilities(entry);
  return referenceSection(
    ui("reference.responsibilities"),
    "",
    referenceList(responsibilities, { label: ui("reference.responsibilities") }),
  );
}

export function primitiveSpecMatrixSection(entry) {
  const rows = primitiveSpecRows(entry);
  return referenceSection(
    ui("reference.specificationMatrix"),
    ui("reference.specificationMatrixIntro"),
    html`
      ${referenceMatrixGrid(rows)}
    `,
  );
}

function primitiveSpecRows(entry) {
  const contract = artifactContract(entry);
  const matrix = primitiveCopy?.specMatrix ?? {};
  if (contract) {
    const rows = matrix.contractRows ?? {};
    return [
      { aspect: rows.governingFoundations?.aspect ?? "", contract: contract.governingFoundations.join(" / "), notes: rows.governingFoundations?.notes ?? "" },
      { aspect: rows.foundationInputs?.aspect ?? "", contract: contract.foundationInputs.join(" / "), notes: rows.foundationInputs?.notes ?? "" },
      { aspect: rows.roles?.aspect ?? "", contract: contract.roles.map((role) => role.id).join(" / "), notes: rows.roles?.notes ?? "" },
      { aspect: rows.states?.aspect ?? "", contract: contract.states.join(" / "), notes: rows.states?.notes ?? "" },
      { aspect: rows.apiOutputs?.aspect ?? "", contract: contract.api.outputs.join(" / "), notes: rows.apiOutputs?.notes ?? "" },
    ];
  }
  const rows = matrix.byPrimitive?.[entry.title] ?? matrix.shared ?? [];
  return rows.map((row) => ({
    aspect: row.aspect,
    contract: primitiveTemplate(row.contract ?? row.contractTemplate, entry),
    notes: primitiveTemplate(row.notes, entry),
  }));
}

function primitiveResponsibilities(entry) {
  const responsibilities = primitiveCopy?.responsibilities?.[entry.title] ?? primitiveCopy?.responsibilities?.fallback ?? [];
  return responsibilities.map((item) => primitiveTemplate(item, entry));
}

export function primitiveApiReferenceSection(entry) {
  return referenceSection(
    ui("reference.apiReference"),
    "",
    html`
      ${referenceCodeBlock(primitiveApiCode(entry))}
      ${referenceCallout("Prevents", primitivePrevents(entry), "warning")}
    `,
  );
}

function primitiveApiCode(entry) {
  const contract = artifactContract(entry);
  if (contract) {
    const componentName = entry.title.replace(/\s+/g, "");
    return `<${componentName}
  ${contract.api.props.map((prop) => `${prop}?: semantic`).join("\n  ")}
/>

outputs:
${contract.api.outputs.map((output) => `  - ${output}`).join("\n")}

tokens:
${contract.tokenDependencies.map((token) => `  - ${token}`).join("\n")}

rejectIf:
${contract.rejectIf.map((item) => `  - ${item}`).join("\n")}`;
  }
  return primitiveTemplate(primitiveCopy?.apiFallbacks?.[entry.title] ?? primitiveCopy?.apiFallbacks?.fallbackTemplate, entry);
}

function primitivePrevents(entry) {
  const contract = artifactContract(entry);
  if (contract) return contract.rejectIf.join(" ");
  return primitiveTemplate(primitiveCopy?.prevents?.[entry.title] ?? primitiveCopy?.prevents?.fallbackTemplate, entry);
}

export function primitiveTokenReferenceSection(entry) {
  const cards = primitiveCopy?.tokenReference?.cards ?? [];
  return referenceSection(
    ui("reference.tokenReference"),
    ui("reference.tokenReferenceIntro"),
    html`
      ${referenceTokenGrid(entry.tokens, { label: ui("reference.tokenReference") })}
      ${referenceRuleGrid(cards.map((card) => ({ title: card.title, copy: primitiveTemplate(card.copyTemplate, entry) })))}
    `,
  );
}

function primitiveAdapterCopy(entry, title) {
  const card = (primitiveCopy?.tokenReference?.cards ?? []).find((item) => item.title === title);
  return primitiveTemplate(card?.copyTemplate, entry);
}
