import { artifactRoleGrid, html, ui } from "./detail-tabs-core.js?v=10";
import { documentationSectionIsland } from "./documentation-section-island.js?v=1";

export function patternBuildGatePanel(entry) {
  const gates = entry.id === "sidebar"
    ? [
        "Parent items are the only navigation rows with icons.",
        "Active child uses aria-current and a non-color-only marker.",
        "Drawer state keeps the current route discoverable.",
        "Footer utilities stay separate from navigation groups."
      ]
    : [
        "Each slot declares ownership before implementation.",
        "Search stays a slot until Search Input or Global Search is documented.",
        "Notification and account triggers use Badge, Avatar, and Menu contracts.",
        "Mobile fallback preserves navigation, search, and account access."
      ];
  return documentationSectionIsland({
    bodyHtml: html`
      <h2>${ui("build.qualityGates")}</h2>
      ${artifactRoleGrid({
        className: "checklist-grid",
        items: gates.map((gate) => ({ icon: "check_circle", title: gate, copy: "" })),
      })}
    `,
    className: "artifact-detail-surface wide pattern-build-gates",
    template: "artifact-detail",
    source: "patternBuildGatePanel",
  });
}
