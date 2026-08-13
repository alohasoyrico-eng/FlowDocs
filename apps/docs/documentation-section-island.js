function escapeAttribute(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function documentationSectionIsland({
  title,
  description,
  bodyHtml = "",
  className = "",
  template = "documentation",
  layout = "stack",
  state = "default",
  density,
  tone = "default",
  attrs = "",
  source = "shared-helper",
} = {}) {
  const props = {
    title,
    description,
    bodyHtml,
    className,
    layout,
    state,
    density,
    tone,
    "data-doc-template": template,
    "data-flowdocs-section-source": source,
  };
  return `<div class="docs-react-island docs-documentation-section-island" data-react-component="documentation-section" data-component-source="react-pattern" data-doc-pattern="documentation-section" data-flowdocs-boundary="documentation-section" data-doc-template="${escapeAttribute(template)}" ${attrs} data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}
