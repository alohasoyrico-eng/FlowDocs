import { componentDemo } from "./component-demo.js?v=61";

function escapeAttribute(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function docsHomeTemplateIsland(props) {
  return `<div class="docs-react-island docs-home-template-island" data-react-component="docs-home-template" data-component-source="react-template" data-doc-template="docs-home-template" data-flowdocs-boundary="docs-home-template" data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}

export function renderHomeContent({ docsLinkCard, collections, findAny, homeContent, html, slug, stack, ui }) {
  const home = homeContent ?? {};
  const collectionCount = (collection) => (collection === "stack" ? stack.length : collections[collection]?.length ?? 0);
  const heroVisual = html`
    <div
      data-illustration-slot="home-intro"
      data-illustration-id="home-intro"
      data-source="custom-artwork"
      data-purpose="decorative"
      data-src="./assets/hero-visual-light.png?v=2"
      data-dark-src="./assets/hero-visual-dark.png?v=1"
      data-alt=""
    ></div>
  `;
  const coverageHtml = html`
    <div class="section-head">
      <p class="kicker">${home.coverage?.kicker ?? ""}</p>
      <h2>${home.coverage?.title ?? ""}</h2>
      <p>${home.coverage?.copy ?? ""}</p>
    </div>
      <div class="coverage-grid">
        ${(home.coverage?.items ?? [])
          .map((item) => homeCard({ title: item.label, value: String(collectionCount(item.collection)), detail: item.reference, status: item.status, composition: "stats" }))
          .join("")}
      </div>
  `;
  const statusHtml = html`
    <div class="section-head">
      <p class="kicker">${home.documentationStatus?.kicker ?? ""}</p>
      <h2>${home.documentationStatus?.title ?? ""}</h2>
      <p>${home.documentationStatus?.copy ?? ""}</p>
    </div>
      <div class="doc-status-grid">
        ${(home.documentationStatus?.items ?? [])
          .map((item) => homeCard({ title: item.status, detail: item.detail, status: item.layer }))
          .join("")}
      </div>
  `;
  const childrenHtml = html`
    <section class="section tight">
      <div class="section-head">
        <p class="kicker">${home.visualMigration?.kicker ?? ""}</p>
        <h2>${home.visualMigration?.title ?? ""}</h2>
        <p>${home.visualMigration?.copy ?? ""}</p>
      </div>
      <div class="doc-status-grid">
        ${(home.visualMigration?.items ?? [])
          .map((item) => homeCard({ title: item.label, detail: item.detail, status: item.status }))
          .join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <p class="kicker">${home.architecture?.kicker ?? ""}</p>
        <h2>${home.architecture?.title ?? ""}</h2>
        <p>${home.architecture?.copy ?? ""}</p>
      </div>
      <div class="layer-grid">
        ${(home.architecture?.layers ?? [])
          .map((layer, index) => homeCard({ title: layer.name, detail: layer.copy, status: String(index + 1) }))
          .join("")}
      </div>
    </section>
    <section class="section band">
      <div class="section-head">
        <p class="kicker">${home.fastPaths?.kicker ?? ""}</p>
        <h2>${home.fastPaths?.title ?? ""}</h2>
      </div>
      <div class="spotlight-grid">
        ${(home.fastPaths?.items ?? [])
          .map((item) => docsLinkCard(item.collection, slug(item.title), item.icon, item.title, findAny(item.title)?.summary ?? item.summary ?? ""))
          .join("")}
      </div>
    </section>
  `;
  return docsHomeTemplateIsland({
    title: home.hero?.title ?? ui("shell.home"),
    description: home.hero?.lede ?? "",
    density: "md",
    state: "default",
    className: "docs-home-template--flowdocs",
    coverageHtml,
    heroVisualHtml: heroVisual,
    statusHtml,
    childrenHtml,
    metadata: [
      { label: home.hero?.kicker ?? "", kind: "tag", variant: "metadata", tone: "neutral" },
    ].filter((item) => item.label),
    "data-doc-template": "docs-home-template",
    "data-flowdocs-template-source": "home-stack-renderers",
  });
}

export function renderStackContent({ html, referenceCopy, stack }) {
  const page = referenceCopy.stackPage ?? {};
  return html`
    <section class="docs-page-intro">
      <p class="kicker">${page.kicker ?? ""}</p>
      <h1>${page.title ?? ""}</h1>
      <p>${page.copy ?? ""}</p>
    </section>
    <section class="section tight">
      <div class="stack-grid">
        ${stack
          .map((entry) => homeCard({ title: entry.title, detail: `${entry.summary} ${page.ruleLabel ?? ""}: ${entry.rule} ${(entry.tokens ?? []).join(", ")}`, status: entry.category }))
          .join("")}
      </div>
    </section>
  `;
}

function homeCard({ title, value, detail, status, composition = "standard" } = {}) {
  return componentDemo("card", { title, value, detail, status, variant: "minimal", composition, fullWidth: true });
}
