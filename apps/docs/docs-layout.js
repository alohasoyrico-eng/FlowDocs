import { escapeHtml } from "./utils.js";

export function renderShell({ active = "", collectionIcon, collections, content, current, html, icon, iconFor, label, ui }) {
  return content;
}

function docsCollectionTemplateIsland(props) {
  return `<div class="docs-react-island docs-collection-template-island" data-react-component="docs-collection-template" data-component-source="react-template" data-doc-template="docs-collection-template" data-flowdocs-boundary="docs-collection-template" data-react-props="${escapeHtml(JSON.stringify(props))}"></div>`;
}

function referenceDetailTemplateIsland(props, { collection, id, referencePageMarker = "" } = {}) {
  return `<div class="docs-react-island docs-reference-detail-template-island" data-react-component="reference-detail-template" data-component-source="react-template" data-doc-template="reference-detail-template" data-flowdocs-boundary="reference-detail-template" data-doc-primitive="reference-detail-template" ${referencePageMarker ? `data-doc-reference-page="${escapeHtml(referencePageMarker)}"` : ""} data-detail="${escapeHtml(`${collection}:${id}`)}" data-react-props="${escapeHtml(JSON.stringify(props))}"></div>`;
}

export function renderCollectionContent({ artifactCard, collection, collections, collectionMeta, groupCollection, html, label }) {
  const meta = collectionMeta[collection];
  const groups = groupCollection(collections[collection]);
  const childrenHtml = html`
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
  `;
  return docsCollectionTemplateIsland({
    title: label(collection),
    description: meta.intro,
    density: "md",
    state: "default",
    className: `docs-collection-template--${collection}`,
    childrenHtml,
    metadata: [
      { label: `${meta.singular}s`, kind: "tag", variant: "metadata", tone: "neutral" },
      { label: `${collections[collection].length} entries`, kind: "tag", variant: "metadata", tone: "neutral" },
    ],
    "data-doc-template": "docs-collection-template",
    "data-flowdocs-template-source": "docs-layout",
    "data-doc-collection": collection,
  });
}

function detailMetadataItems({ artifactTypeLabel, collection, componentImplementationStatus, entry }) {
  const implementationLabel = componentImplementationLabel(collection, entry, componentImplementationStatus);
  return [
    { label: artifactTypeLabel(collection), kind: "tag", variant: "metadata", tone: "neutral", "data-doc-class": "detail-meta-tag" },
    { label: entry.platform, kind: "tag", variant: "metadata", tone: "neutral", "data-doc-class": "detail-meta-tag" },
    implementationLabel ? { label: implementationLabel, kind: "tag", variant: "metadata", tone: "neutral", "data-doc-class": "detail-meta-tag" } : null,
    ...(entry.audiences ?? []).map((audience) => ({ label: audience, kind: "tag", variant: "metadata", tone: "neutral", "data-doc-class": "detail-meta-tag" })),
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
    tabBodiesHtml: Object.fromEntries(tabs.map((tab) => [tab.id, tab.body])),
    className,
    contentClassName,
  };
  return `<div class="docs-react-island docs-artifact-detail-template-island" data-react-component="docs-artifact-detail-template" data-component-source="react-template" data-doc-template="artifact-detail" data-flowdocs-boundary="docs-artifact-detail-template" data-doc-primitive="detail-page-shell" ${referencePageMarker ? `data-doc-reference-page="${escapeHtml(referencePageMarker)}"` : ""} data-detail="${escapeHtml(`${collection}:${id}`)}" data-react-props="${escapeHtml(JSON.stringify(props))}"></div>`;
}

export function renderDetailContent({ artifactTypeLabel, collection, componentImplementationStatus, entry, html, icon, id, label, tabIcon, tabs, ui }) {
  return docsArtifactDetailTemplateIsland({ artifactTypeLabel, collection, componentImplementationStatus, entry, id, label, tabs, ui });
}

export function renderReferenceDetailContent({ artifactTypeLabel, bodyHtml, collection, entry, id, label, referencePageMarker, ui }) {
  const sectionLabels = collection === "foundations"
    ? ["Purpose", "Semantic roles", "Architecture", "Contract"]
    : ["Purpose", "Live demo", "Responsibilities", "API", "Tokens"];
  return referenceDetailTemplateIsland({
    title: entry.title,
    description: entry.summary,
    density: "md",
    state: "default",
    className: `reference-doc ${collection === "foundations" ? "foundation-deep-dive" : "primitive-deep-dive"}`,
    bodyHtml,
    navItems: sectionLabels.map((section, index) => ({
      id: `${entry.id}-reference-${index + 1}`,
      label: section,
      active: index === 0,
    })),
    "data-doc-template": "reference-detail-template",
    "data-flowdocs-template-source": "docs-layout",
    "data-doc-collection": collection,
    "data-doc-artifact-type": artifactTypeLabel(collection),
    "aria-label": `${entry.title} ${ui("shell.sections")}`,
  }, { collection, id, referencePageMarker });
}

function componentImplementationLabel(collection, entry, componentImplementationStatus) {
  if (collection !== "components") return "";
  return componentImplementationStatus?.components?.[entry.id] ? "Package component" : "Candidate scope";
}
