import { escapeHtml } from "./utils.js";

export function docsCodeBlock(code, { className = "", attrs = "" } = {}) {
  const props = {
    code,
    variant: className.includes("source") ? "source" : "standard",
    density: "sm",
    className: ["docs-code-block", className].filter(Boolean).join(" "),
    wrap: true,
  };
  return `<span class="docs-react-island docs-code-block-island" data-react-component="code-block" data-component-source="react-component" data-doc-component="code-block" data-flowdocs-boundary="code-block" ${attrs} data-react-props="${escapeHtml(JSON.stringify(props))}"></span>`;
}

export function docsSourceMarkupSlot(code = "", attrs = "data-doc-playground-markup") {
  return docsCodeBlock(code, {
    className: "docs-code-block--source",
    attrs,
  });
}

export function docsInlineCode(value, attrs = "") {
  return `<code class="docs-inline-code" ${attrs}>${escapeHtml(value)}</code>`;
}
