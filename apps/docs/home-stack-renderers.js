import { componentDemo } from "./component-demo.js?v=61";

export function renderHomeContent({ cardLink, collections, findAny, homeContent, html, icon, slug, stack, ui }) {
  const home = homeContent ?? {};
  const collectionCount = (collection) => (collection === "stack" ? stack.length : collections[collection]?.length ?? 0);
  return html`
    <section class="hero">
      <div class="hero-copy">
        <p class="kicker">${home.hero?.kicker ?? ""}</p>
        <h1>${home.hero?.title ?? ui("shell.home")}</h1>
        <p class="lede">${home.hero?.lede ?? ""}</p>
        <div class="hero-actions">
          ${(home.hero?.actions ?? []).map((action) => `<a class="hero-action ${action.variant}" href="${action.href}">${icon(action.icon)} ${action.label}</a>`).join("")}
        </div>
      </div>
      <div
        class="hero-visual"
        data-illustration-slot="home-hero"
        data-illustration-id="home-hero"
        data-source="custom-artwork"
        data-purpose="decorative"
        data-src="./assets/hero-visual-light.png?v=2"
        data-dark-src="./assets/hero-visual-dark.png?v=1"
        data-alt=""
      ></div>
    </section>
    <section class="section tight">
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
    </section>
    <section class="section tight">
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
    </section>
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
          .map((item) => cardLink(item.collection, slug(item.title), item.icon, item.title, findAny(item.title)?.summary ?? item.summary ?? ""))
          .join("")}
      </div>
    </section>
  `;
}

export function renderStackContent({ html, referenceCopy, stack }) {
  const page = referenceCopy.stackPage ?? {};
  return html`
    <section class="page-hero">
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
