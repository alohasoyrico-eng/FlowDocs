export function renderShell({ active = "", collectionIcon, collections, content, current, html, icon, iconFor, label, ui }) {
  const drawerGroups = Object.entries(collections)
    .map(([key, values]) => ({ key, values }))
    .map(
      ({ key, values }) => html`
        <details class="sidebar-group" ${active === key ? "open" : ""}>
          <summary><span class="sidebar-label">${icon(collectionIcon(key))}<span>${label(key)}</span><b class="sidebar-count">${values.length}</b></span></summary>
          <div>
            ${values.map((item) => `<a class="${current.collection === key && current.id === item.id ? "active" : ""}" href="#/${key}/${item.id}">${icon(iconFor(item))}<span>${item.title}</span></a>`).join("")}
          </div>
        </details>
      `,
    )
    .join("");
  return html`
    <div class="app-shell">
      <aside class="sidebar" aria-label="${ui("shell.designNavigation")}">
        ${drawerGroups}
        <a class="${active === "stack" ? "active" : ""}" href="#/stack"><span class="sidebar-label">${icon(collectionIcon("stack"))}<span>${ui("shell.stack")}</span></span></a>
      </aside>
      <div class="content-shell density-responsive">${content}</div>
    </div>
  `;
}

export function renderCollectionContent({ artifactCard, collection, collections, collectionMeta, groupCollection, html, label }) {
  const meta = collectionMeta[collection];
  const groups = groupCollection(collections[collection]);
  return html`
    <section class="page-hero">
      <p class="kicker">${meta.singular}s</p>
      <h1>${label(collection)}</h1>
      <p>${meta.intro}</p>
    </section>
    <section class="section tight">
      ${Object.entries(groups)
        .map(
          ([group, values]) => html`
            <div class="group-block">
              <h2>${group}</h2>
              <div class="catalog-grid">
                ${values
                  .map((entry) => artifactCard(collection, entry))
                  .join("")}
              </div>
            </div>
          `,
        )
        .join("")}
    </section>
  `;
}

function escapeAttribute(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function detailShellTabsIsland({ entry, tabs, ui }) {
  const props = {
    label: `${entry.title} ${ui("shell.sections")}`,
    selectedKey: tabs[0]?.id ?? "",
    variant: "default",
    className: "detail-tabs detail-tablist",
    "data-doc-template": "detail-shell",
    "data-doc-control-bridge": "detail-shell-tabs",
    "data-component-source": "flow",
    items: tabs.map((tab, index) => ({
      key: tab.id,
      label: tab.label,
      selected: index === 0,
    })),
  };
  return `<span class="docs-react-island docs-detail-tabs-island" data-react-component="detail-shell-tabs" data-component-source="react" data-doc-component="tabs" data-doc-template="detail-shell" data-doc-control-bridge="detail-shell-tabs" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

export function renderDetailContent({ artifactTypeLabel, collection, componentImplementationStatus, entry, html, icon, id, label, tabIcon, tabs, ui }) {
  const implementationLabel = componentImplementationLabel(collection, entry, componentImplementationStatus);
  return html`
    <article class="detail-page" data-detail="${collection}:${id}">
      <header class="detail-hero">
        <div class="detail-hero-content">
          <nav class="docs-breadcrumbs" aria-label="${ui("shell.breadcrumbs")}">
            <a href="#/home">${ui("shell.home")}</a>
            <span>/</span>
            <a href="#/${collection}">${label(collection)}</a>
            <span>/</span>
            <strong>${entry.title}</strong>
          </nav>
          <h1>${entry.title}</h1>
          <p class="detail-summary">${entry.summary}</p>
          <div class="detail-meta-row" aria-label="${ui("shell.artifactMetadata")}">
            <span class="tag detail-meta-tag" data-variant="metadata" data-tone="neutral">${artifactTypeLabel(collection)}</span>
            <span class="tag detail-meta-tag" data-variant="platform" data-tone="neutral">${entry.platform}</span>
            ${implementationLabel ? `<span class="tag detail-meta-tag" data-variant="metadata" data-tone="neutral">${implementationLabel}</span>` : ""}
            ${entry.audiences.map((audience) => `<span class="tag detail-meta-tag" data-variant="metadata" data-tone="neutral">${audience}</span>`).join("")}
          </div>
        </div>
      </header>
      <div class="detail-layout">
        ${detailShellTabsIsland({ entry, tabs, ui })}
        <section class="tab-panel" id="tabPanel">${tabs[0].body}</section>
      </div>
    </article>
  `;
}

function componentImplementationLabel(collection, entry, componentImplementationStatus) {
  if (collection !== "components") return "";
  return componentImplementationStatus?.components?.[entry.id] ? "Package component" : "Candidate scope";
}
