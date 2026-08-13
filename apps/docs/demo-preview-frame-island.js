function escapeAttribute(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function cleanAttrs(attrs = "") {
  return String(attrs ?? "").trim();
}

export function demoPreviewFrameIsland({
  label = "",
  description = "",
  previewHtml = "",
  controlsHtml = "",
  sourceHtml = "",
  className = "",
  kind = "demo",
  state = "default",
  density = "md",
  fullWidth = false,
  compact = false,
  attrs = "",
  source = "demoPreviewFrameIsland",
} = {}) {
  const props = {
    label,
    description,
    previewHtml,
    controlsHtml,
    sourceHtml,
    kind,
    state,
    density,
    fullWidth,
    compact,
    className,
    "aria-label": label || "Demo preview",
  };
  return `<div class="docs-react-island docs-demo-preview-frame-island" data-react-component="demo-preview-frame" data-component-source="react-pattern" data-doc-pattern="demo-preview-frame" data-flowdocs-boundary="demo-preview-frame" data-flowdocs-boundary-source="${escapeAttribute(source)}" ${cleanAttrs(attrs)} data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}
