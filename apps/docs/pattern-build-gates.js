import { artifactRoleGrid, html, ui } from "./detail-tabs-core.js?v=5";

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
  return html`
    <section class="surface docs-section-surface detail-section-surface wide pattern-build-gates" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail">
      <h2>${ui("build.qualityGates")}</h2>
      ${artifactRoleGrid({
        className: "checklist-grid",
        items: gates.map((gate) => ({ icon: "check_circle", title: gate, copy: "" })),
      })}
    </section>
  `;
}
