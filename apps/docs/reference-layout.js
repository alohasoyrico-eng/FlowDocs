import { documentationSectionIsland } from "./documentation-section-island.js?v=1";
import { docsCodeBlock } from "./docs-code-block.js?v=2";
import { escapeHtml } from "./utils.js";

let deps = {};

export function configureReferenceLayout(nextDeps) {
  deps = nextDeps;
}

export function referenceBreadcrumbs(collection, entry) {
  const { html, label, ui } = deps;
  return html`
    <nav class="docs-breadcrumbs" aria-label="${ui("shell.breadcrumbs")}">
      <a href="#/home">${ui("shell.home")}</a>
      <span>/</span>
      <a href="#/${collection}">${label(collection)}</a>
      <span>/</span>
      <strong>${entry.title}</strong>
    </nav>
  `;
}

export function referencePeerNav(collection, entry) {
  const { collections, html, icon, iconFor, label, ui } = deps;
  const values = collections[collection];
  return html`
    <aside class="reference-peer-nav" aria-label="${label(collection)} ${ui("shell.detailNavigation")}">
      <strong>${label(collection)}</strong>
      <nav>
        ${values.map((item) => `<a class="${item.id === entry.id ? "active" : ""}" href="#/${collection}/${item.id}">${icon(iconFor(item))}<span>${item.title}</span></a>`).join("")}
      </nav>
    </aside>
  `;
}

export function referenceHeader(collection, entry, options = {}) {
  const { html } = deps;
  const { chapter = "", subtitle = "" } = options;
  return html`
    <header class="reference-header">
      ${referenceBreadcrumbs(collection, entry)}
      <span>${chapter}</span>
      <div class="reference-title-row">
        <b class="reference-badge" data-foundation="${entry.id}">${entry.title.charAt(0)}</b>
        <div>
          <h1>${entry.title}</h1>
          <p class="reference-subtitle">${subtitle}</p>
        </div>
      </div>
      <p>${entry.summary}</p>
    </header>
  `;
}

export function referenceCallout(title, copy, intent = "accent") {
  const props = {
    title,
    description: copy,
    className: "reference-callout",
    layout: "callout",
    state: "callout",
    tone: intent === "warning" ? "warning" : "default",
    "data-intent": intent,
    "data-doc-template": "foundation-primitive-detail",
    "data-flowdocs-section-source": "referenceCallout",
  };
  return `<div class="docs-react-island docs-documentation-section-island" data-react-component="documentation-section" data-component-source="react-pattern" data-doc-pattern="documentation-section" data-flowdocs-boundary="documentation-section" data-doc-template="foundation-primitive-detail" data-doc-primitive="reference-callout" data-react-props="${escapeHtml(JSON.stringify(props))}"></div>`;
}

export function referenceSection(title, description, body, headingRole = "display") {
  return documentationSectionIsland({
    title,
    description,
    bodyHtml: body,
    className: "foundation-primitive-detail-surface reference-section-block",
    template: "foundation-primitive-detail",
    attrs: `data-heading-role="${headingRole}"`,
    source: "referenceSection",
  });
}

export function referenceDivider() {
  return `<hr class="reference-divider" />`;
}

export function referenceCodeBlock(code) {
  return docsCodeBlock(code, { className: "reference-code" });
}

export function referenceList(items = [], { label = "", className = "reference-list" } = {}) {
  const props = {
    items: items.map((item, index) => ({
      key: `reference-item-${index}`,
      label: item,
    })),
    label,
    variant: "standard",
    density: "sm",
    className,
  };
  return `<div class="docs-react-island docs-reference-list-island" data-react-component="list" data-component-source="react-component" data-doc-component="list" data-flowdocs-boundary="list" data-doc-primitive="reference-list" data-react-props="${escapeHtml(JSON.stringify(props))}"></div>`;
}

export function referenceTokenGrid(tokens = [], { label = "Token reference", className = "reference-token-grid" } = {}) {
  const props = {
    items: tokens,
    label,
    variant: "tokens",
    density: "sm",
    className,
  };
  return `<div class="docs-react-island docs-reference-token-grid-island" data-react-component="documentation-token-grid" data-component-source="react-pattern" data-doc-pattern="documentation-token-grid" data-flowdocs-boundary="documentation-token-grid" data-doc-primitive="reference-token-grid" data-react-props="${escapeHtml(JSON.stringify(props))}"></div>`;
}

export function referenceSummaryGrid(className, items = []) {
  return referenceGridIsland({
    className,
    kind: "summary",
    items: items.map((item) => ({ title: item.label, value: item.value, composition: "stats" })),
  });
}

export function referenceRuleGrid(items = []) {
  return referenceGridIsland({
    className: "reference-rule-grid",
    kind: "rule",
    items: items.map((item) => ({ title: item.title, detail: item.copy })),
  });
}

export function referenceMatrixGrid(rows = [], className = "reference-matrix") {
  return referenceGridIsland({
    className,
    kind: "matrix",
    items: rows.map((row) => ({ title: row.contract, detail: row.notes, status: row.aspect })),
  });
}

function referenceGridIsland({ className, kind, items }) {
  const props = {
    kind,
    className,
    items,
    density: "sm",
  };
  return `<div class="docs-react-island docs-reference-grid-island" data-react-component="documentation-reference-grid" data-component-source="react-pattern" data-doc-pattern="documentation-reference-grid" data-flowdocs-boundary="documentation-reference-grid" data-doc-primitive="reference-${kind}-grid" data-react-props="${escapeHtml(JSON.stringify(props))}"></div>`;
}
