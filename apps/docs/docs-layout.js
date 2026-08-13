import { escapeHtml } from "./utils.js";

export function renderShell({ active = "", collectionIcon, collections, content, current, html, icon, iconFor, label, ui }) {
  return content;
}

export function renderCollectionContent({ artifactCard, collection, collections, collectionMeta, groupCollection, html, label }) {
  const meta = collectionMeta[collection];
  const groups = groupCollection(collections[collection]);
  return html`
    <section class="docs-page-intro">
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

function detailMetadataItems({ artifactTypeLabel, collection, componentImplementationStatus, entry }) {
  const implementationLabel = componentImplementationLabel(collection, entry, componentImplementationStatus);
  return [
    { label: artifactTypeLabel(collection), kind: "tag", variant: "metadata", tone: "neutral" },
    { label: entry.platform, kind: "tag", variant: "metadata", tone: "neutral" },
    implementationLabel ? { label: implementationLabel, kind: "tag", variant: "metadata", tone: "neutral" } : null,
    ...(entry.audiences ?? []).map((audience) => ({ label: audience, kind: "tag", variant: "metadata", tone: "neutral" })),
  ].filter(Boolean);
}

function docsArtifactDetailTemplateIsland({ artifactTypeLabel, bodyHtml = "", className = "detail-page", collection, componentImplementationStatus, contentClassName = "detail-layout", entry, id, label, referencePageMarker = "", tabs = [], ui }) {
  const props = {
    label: `${entry.title} ${ui("shell.sections")}`,
    artifactType: artifactTypeLabel(collection),
    title: entry.title,
    description: entry.summary,
    density: "md",
    className: "detail-page",
    contentClassName: "detail-layout",
    "data-doc-primitive": "detail-page-shell",
    "data-detail": `${collection}:${id}`,
    breadcrumbs: [
      { id: "home", label: ui("shell.home"), href: "#/home" },
      { id: collection, label: label(collection), href: `#/${collection}` },
      { id: entry.id, label: entry.title, current: true },
    ],
    metadata: detailMetadataItems({ artifactTypeLabel, collection, componentImplementationStatus, entry }),
    tabs: tabs.map((tab, index) => ({
      key: tab.id,
      label: tab.label,
      selected: index === 0,
    })),
    selectedTabKey: tabs[0]?.id ?? "",
    bodyHtml: bodyHtml || tabs[0]?.body || "",
    className,
    contentClassName,
  };
  return `<div class="docs-react-island docs-artifact-detail-template-island" data-react-component="docs-artifact-detail-template" data-component-source="react-template" data-doc-template="artifact-detail" data-flowdocs-boundary="docs-artifact-detail-template" data-doc-primitive="detail-page-shell" ${referencePageMarker ? `data-doc-reference-page="${escapeHtml(referencePageMarker)}"` : ""} data-detail="${escapeHtml(`${collection}:${id}`)}" data-react-props="${escapeHtml(JSON.stringify(props))}"></div>`;
}

export function renderDetailContent({ artifactTypeLabel, collection, componentImplementationStatus, entry, html, icon, id, label, tabIcon, tabs, ui }) {
  return docsArtifactDetailTemplateIsland({ artifactTypeLabel, collection, componentImplementationStatus, entry, id, label, tabs, ui });
}

export function renderReferenceDetailContent({ artifactTypeLabel, bodyHtml, collection, entry, id, label, referencePageMarker, ui }) {
  return docsArtifactDetailTemplateIsland({
    artifactTypeLabel,
    bodyHtml,
    className: `reference-doc ${collection === "foundations" ? "foundation-deep-dive" : "primitive-deep-dive"}`,
    collection,
    contentClassName: "reference-main",
    entry,
    id,
    label,
    referencePageMarker,
    tabs: [],
    ui,
  });
}

function componentImplementationLabel(collection, entry, componentImplementationStatus) {
  if (collection !== "components") return "";
  return componentImplementationStatus?.components?.[entry.id] ? "Package component" : "Candidate scope";
}
