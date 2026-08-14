import { reactTemplateDemo } from "./template-react-demos.js?v=5";

const desktopTemplateRenderers = {
  "docs-shell-template": docsShellTemplateDesktopDemo,
  "docs-home-template": docsHomeTemplateDesktopDemo,
  "docs-collection-template": docsCollectionTemplateDesktopDemo,
  "component-detail-template": componentDetailTemplateDesktopDemo,
  "docs-artifact-detail-template": docsArtifactDetailTemplateDesktopDemo,
  "pattern-detail-template": patternDetailTemplateDesktopDemo,
  "reference-detail-template": referenceDetailTemplateDesktopDemo,
  "template-detail-template": templateDetailTemplateDesktopDemo,
};

function renderTemplateDesktopDemo(entry, blueprint) {
  return reactTemplateDemo(entry, blueprint);
}

function docsShellTemplateDesktopDemo(entry, blueprint) {
  return renderTemplateDesktopDemo(entry, blueprint);
}

function docsHomeTemplateDesktopDemo(entry, blueprint) {
  return renderTemplateDesktopDemo(entry, blueprint);
}

function docsCollectionTemplateDesktopDemo(entry, blueprint) {
  return renderTemplateDesktopDemo(entry, blueprint);
}

function componentDetailTemplateDesktopDemo(entry, blueprint) {
  return renderTemplateDesktopDemo(entry, blueprint);
}

function docsArtifactDetailTemplateDesktopDemo(entry, blueprint) {
  return renderTemplateDesktopDemo(entry, blueprint);
}

function patternDetailTemplateDesktopDemo(entry, blueprint) {
  return renderTemplateDesktopDemo(entry, blueprint);
}

function referenceDetailTemplateDesktopDemo(entry, blueprint) {
  return renderTemplateDesktopDemo(entry, blueprint);
}

function templateDetailTemplateDesktopDemo(entry, blueprint) {
  return renderTemplateDesktopDemo(entry, blueprint);
}

export function desktopTemplateDemo(entry, blueprint) {
  return (desktopTemplateRenderers[entry?.id] ?? renderTemplateDesktopDemo)(entry, blueprint);
}
