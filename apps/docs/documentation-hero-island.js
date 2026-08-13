function escapeAttribute(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function documentationHeroIsland({
  kicker,
  title,
  description,
  actions = [],
  metadata = [],
  visualHtml = "",
  className = "docs-intro",
  template = "documentation",
  background = "gradient-grid",
  tone = "brand",
  density = "md",
  attrs = "",
  source = "shared-helper",
} = {}) {
  const props = {
    kicker,
    title,
    description,
    actions,
    metadata,
    visualHtml,
    className,
    background,
    tone,
    density,
    "data-doc-template": template,
    "data-flowdocs-hero-source": source,
  };
  return `<div class="docs-react-island docs-documentation-hero-island" data-react-component="documentation-hero" data-component-source="react-pattern" data-doc-pattern="documentation-hero" data-flowdocs-boundary="documentation-hero" data-doc-template="${escapeAttribute(template)}" ${attrs} data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}
