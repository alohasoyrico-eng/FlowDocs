import { componentDemo } from "./component-demo.js?v=61";
import { artifactMetadataBar } from "./artifact-metadata-bar.js?v=2";

let deps = {};

export function configureCatalogRenderers(nextDeps) {
  deps = nextDeps;
}

export function artifactCard(collection, entry) {
  const { iconFor } = deps;
  const meta = collection === "components" ? [entry.platform, componentImplementationLabel(entry)] : entry.platform;
  return docsLinkCard(collection, entry.id, iconFor(entry), entry.title, entry.summary, meta);
}

export function docsLinkCard(collection, id, symbol, title, summary, meta = "") {
  const { html } = deps;
  const href = collection === "stack" ? "#/stack" : `#/${collection}/${id}`;
  const layerClass = collection === "stack" ? "stack-link" : collection.slice(0, -1);
  const metaItems = (Array.isArray(meta) ? meta : [meta]).filter(Boolean);
  return html`
    <a class="docs-artifact-link ${layerClass}" data-doc-boundary="artifact-link-card" href="${href}">
      ${componentDemo("card", {
        title,
        detail: summary,
        status: metaItems.join(" · "),
        icon: symbol,
        variant: "minimal",
        composition: "standard",
        fullWidth: true,
      })}
      ${artifactMetadataBar(metaItems, { ariaLabel: "Card metadata", className: "card-meta-row" })}
    </a>
  `;
}

export function groupCollection(values) {
  return values.reduce((groups, entry) => {
    const group = entry.group ?? entry.platform ?? "System";
    groups[group] ??= [];
    groups[group].push(entry);
    return groups;
  }, {});
}

export function label(key) {
  const { ui } = deps;
  return ui(`collections.${key}`) !== `collections.${key}` ? ui(`collections.${key}`) : key.charAt(0).toUpperCase() + key.slice(1);
}

export function artifactTypeLabel(collection) {
  const { collectionMeta, ui } = deps;
  const singular = collectionMeta[collection]?.singular ?? collection.replace(/s$/, "");
  return ui(`artifact.${singular.toLowerCase()}`) !== `artifact.${singular.toLowerCase()}` ? ui(`artifact.${singular.toLowerCase()}`) : singular;
}

function componentImplementationLabel(entry) {
  const { componentImplementationStatus } = deps;
  return componentImplementationStatus?.components?.[entry.id] ? "Package component" : "Candidate scope";
}
