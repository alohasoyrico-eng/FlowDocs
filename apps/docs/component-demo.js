import { componentDemoProps, hydrateChartPanel, renderComponentDemo } from "#design-system/components";

const chartLibrary = typeof window === "undefined"
  ? Promise.resolve(null)
  : import("./generated/vendor/echarts.esm.min.js?v=1").catch(() => null);

let chartHydrationQueued = false;

async function hydrateChartDemos(root = document) {
  const echarts = await chartLibrary;
  if (!echarts) return;
  const charts = Array.from(root.querySelectorAll?.('.chart-panel[data-chart-engine="echarts-option"]:not([data-hydrated="true"])') ?? []);
  for (const chart of charts) {
    hydrateChartPanel(chart, { echarts });
  }
}

function queueChartHydration() {
  if (chartHydrationQueued || typeof document === "undefined" || typeof window === "undefined") return;
  chartHydrationQueued = true;
  const schedule = globalThis.requestAnimationFrame ?? ((callback) => globalThis.setTimeout?.(callback, 0));
  schedule(() => {
    chartHydrationQueued = false;
    hydrateChartDemos(document);
  });
}

if (typeof window !== "undefined" && typeof MutationObserver !== "undefined") {
  const observer = new MutationObserver(queueChartHydration);
  const startObserver = () => {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true });
    queueChartHydration();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startObserver, { once: true });
  else startObserver();
}

function persistNativeFieldState(node) {
  for (const input of Array.from(node.querySelectorAll?.("input") ?? [])) {
    if (input.value) input.setAttribute("value", input.value);
    if (input.placeholder) input.setAttribute("placeholder", input.placeholder);
    if (input.checked) input.setAttribute("checked", "");
    if (input.disabled) input.setAttribute("disabled", "");
  }
  for (const select of Array.from(node.querySelectorAll?.("select") ?? [])) {
    for (const option of Array.from(select.options ?? [])) {
      if (option.selected) option.setAttribute("selected", "");
    }
    if (select.disabled) select.setAttribute("disabled", "");
  }
  for (const textarea of Array.from(node.querySelectorAll?.("textarea") ?? [])) {
    if (textarea.value) textarea.textContent = textarea.value;
    if (textarea.placeholder) textarea.setAttribute("placeholder", textarea.placeholder);
    if (textarea.disabled) textarea.setAttribute("disabled", "");
  }
}

const nestedPackageSelectors = [
  ".accordion",
  ".animated-moment",
  ".audit-event",
  ".avatar",
  ".badge",
  ".biometric-prompt",
  ".breadcrumbs",
  ".button",
  ".card",
  ".card-expiry-input",
  ".card-number-input",
  ".card-security-code-input",
  ".card-summary",
  ".chart-panel",
  ".checkbox",
  ".chip",
  ".code-input",
  ".combobox",
  ".country-selector",
  ".date-picker",
  ".date-range-picker",
  ".dialog",
  ".drawer",
  ".empty-state",
  ".error-panel",
  ".fab",
  ".icon-button",
  ".inline-validation",
  ".input",
  ".kpi-tile",
  ".list",
  ".menu",
  ".motion-boundary",
  ".movement-row",
  ".pagination",
  ".phone-input",
  ".popover",
  ".progress-indicator",
  ".quick-action",
  ".radio",
  ".route-summary",
  ".segmented-control",
  ".select-control",
  ".skeleton",
  ".slider",
  ".spinner",
  ".station-pin",
  ".stepper",
  ".switch",
  ".table",
  ".tag",
  ".text-area",
  ".toast",
  ".tooltip",
  ".tree-view",
];

function markPackageControls(node) {
  for (const control of Array.from(node.querySelectorAll?.(nestedPackageSelectors.join(",")) ?? [])) {
    control.classList?.add("docs-package-demo");
  }
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function demoSlug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function reactButtonDemo(demo = {}) {
  const props = componentDemoProps("button", demo);
  const state = props.state ?? demo.state ?? "default";
  const variant = props.variant ?? demo.variant ?? "primary";
  return `<span class="docs-react-island docs-package-demo" data-react-component="button" data-component-source="react" data-doc-component="button" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(props.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactIconButtonDemo(demo = {}) {
  const props = componentDemoProps("icon-button", demo);
  const state = demo.state ?? "default";
  const variant = props.variant ?? demo.variant ?? "ghost";
  return `<span class="docs-react-island docs-package-demo" data-react-component="icon-button" data-component-source="react" data-doc-component="icon-button" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="false" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactInputDemo(demo = {}) {
  const props = componentDemoProps("input", demo);
  const state = props.state ?? demo.state ?? "default";
  const variant = props.variant ?? demo.variant ?? "text";
  return `<span class="docs-react-island docs-package-demo" data-react-component="input" data-component-source="react" data-doc-component="input" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactSelectDemo(demo = {}) {
  const props = componentDemoProps("select", demo);
  const state = props.state ?? demo.state ?? "default";
  const variant = props.variant ?? demo.variant ?? "default";
  return `<span class="docs-react-island docs-package-demo" data-react-component="select" data-component-source="react" data-doc-component="select" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactCheckboxDemo(demo = {}) {
  const props = componentDemoProps("checkbox", demo);
  const state = props.state ?? demo.state ?? "unchecked";
  const variant = props.variant ?? demo.variant ?? "default";
  return `<span class="docs-react-island docs-package-demo" data-react-component="checkbox" data-component-source="react" data-doc-component="checkbox" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactRadioButtonDemo(demo = {}) {
  const props = componentDemoProps("radio-button", demo);
  props.name = `${props.name || "radio-button-demo"}-${demoSlug(`${props.label}-${props.value}-${props.state}-${props.variant}`)}`;
  const state = props.state ?? demo.state ?? "unselected";
  const variant = props.variant ?? demo.variant ?? "default";
  return `<span class="docs-react-island docs-package-demo" data-react-component="radio-button" data-component-source="react" data-doc-component="radio-button" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactSwitchDemo(demo = {}) {
  const props = componentDemoProps("switch", demo);
  const state = props.state ?? demo.state ?? "off";
  return `<span class="docs-react-island docs-package-demo" data-react-component="switch" data-component-source="react" data-doc-component="switch" data-demo-variant="default" data-demo-state="${escapeAttribute(state)}" data-variant="default" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

export function componentDemo(component, demo = {}) {
  if (typeof document === "undefined" || typeof document.createTextNode !== "function") return "";
  if (component === "button") return reactButtonDemo(demo);
  if (component === "checkbox") return reactCheckboxDemo(demo);
  if (component === "icon-button") return reactIconButtonDemo(demo);
  if (component === "input") return reactInputDemo(demo);
  if (component === "radio-button") return reactRadioButtonDemo(demo);
  if (component === "select") return reactSelectDemo(demo);
  if (component === "switch") return reactSwitchDemo(demo);
  const node = renderComponentDemo(component, demo);
  persistNativeFieldState(node);
  node.className = [node.className, "docs-package-demo"].filter(Boolean).join(" ");
  markPackageControls(node);
  node.setAttribute("data-component-source", "package");
  node.setAttribute("data-doc-component", component);
  node.setAttribute("data-demo-variant", demo.variant ?? "standard");
  node.setAttribute("data-demo-state", demo.state ?? "default");
  const hasAttribute = (name) => Boolean(node.hasAttribute?.(name) || node.getAttribute?.(name) != null || node.attributes?.[name] != null);
  if (!hasAttribute("data-variant")) node.setAttribute("data-variant", demo.variant ?? "standard");
  if (!hasAttribute("data-state")) node.setAttribute("data-state", demo.state ?? "default");
  node.setAttribute("data-full-width", String(Boolean(demo.fullWidth)));
  queueChartHydration();
  return node.outerHTML;
}
