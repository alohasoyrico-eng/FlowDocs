import { artifactRoleGrid, html } from "./detail-tabs-core.js?v=10";
import { documentationSectionIsland } from "./documentation-section-island.js?v=1";

export function patternDesignLeadPanel(entry) {
  if (entry.id === "sidebar") return sidebarDesignLeadPanel();
  if (entry.id === "topbar") return topbarDesignLeadPanel();
  return "";
}

function sidebarDesignLeadPanel() {
  const rules = [
    ["Structure", "Persistent shell navigation; parent groups own icons and disclosure."],
    ["Depth", "Two visible levels max. Third level moves to local navigation or Tree View."],
    ["State", "Current route uses aria-current plus a non-color-only marker."],
    ["Responsive", "Desktop stays persistent; mobile opens as drawer from Topbar."]
  ];
  return designLeadPanel("Sidebar layout rules", "Use Sidebar to orient the product shell, not to host processs or dense content.", rules);
}

function topbarDesignLeadPanel() {
  const rules = [
    ["Slots", "Leading, brand, nav, search, actions, and account have explicit ownership."],
    ["Priority", "Brand and critical access stay visible before optional utilities."],
    ["Search", "Search is a slot until Search Input or Global Search owns behavior."],
    ["Responsive", "Mobile preserves nav, search, and account through Sidebar or drawer fallback."]
  ];
  return designLeadPanel("Topbar layout rules", "Use Topbar as the horizontal shell coordinator, not as a container for arbitrary tools.", rules);
}

function designLeadPanel(title, copy, rules) {
  return documentationSectionIsland({
    bodyHtml: html`
      <span class="eyebrow">Design</span>
      <h2>${title}</h2>
      <p>${copy}</p>
      ${artifactRoleGrid({
        className: "pattern-design-lead-grid",
        items: rules.map(([name, rule]) => ({ icon: "rule", title: name, copy: rule })),
      })}
    `,
    className: "artifact-detail-surface wide pattern-design-lead",
    template: "artifact-detail",
    source: "patternDesignLeadPanel",
  });
}
