import { escapeHtml } from "./utils.js";

export function artifactMetadataBar(items = [], { ariaLabel = "Artifact metadata", className = "" } = {}) {
  const metadataItems = normalizeMetadataItems(items);
  if (!metadataItems.length) return "";
  const classes = ["docs-metadata-bar", className].filter(Boolean).join(" ");
  const props = {
    label: ariaLabel,
    items: metadataItems,
    className: classes,
    compact: className.includes("detail") ? false : true,
    density: "sm",
    "aria-label": ariaLabel,
  };
  return `
    <div class="docs-react-island docs-artifact-metadata-bar-island" data-react-component="artifact-metadata-bar" data-component-source="react-pattern" data-doc-pattern="artifact-metadata-bar" data-flowdocs-boundary="artifact-metadata-bar" aria-label="${escapeHtml(ariaLabel)}" data-react-props="${escapeHtml(JSON.stringify(props))}"></div>
  `;
}

function normalizeMetadataItems(items) {
  return (Array.isArray(items) ? items : [items])
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") return { label: item, kind: "tag", variant: "metadata", tone: "neutral" };
      if (typeof item === "object" && item.label) return item;
      return { label: String(item), kind: "tag", variant: "metadata", tone: "neutral" };
    })
    .filter(Boolean);
}
