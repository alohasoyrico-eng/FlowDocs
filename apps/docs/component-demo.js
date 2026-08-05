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
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function demoSlug(value) {
  return String(value).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function reactIsland(component, props, state = "default", variant = "standard", fullWidth = false) {
  return `<span class="docs-react-island docs-package-demo" data-react-component="${component}" data-component-source="react" data-doc-component="${component}" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactButtonDemo(demo = {}) {
  const props = componentDemoProps("button", demo), state = props.state ?? demo.state ?? "default", variant = props.variant ?? demo.variant ?? "primary";
  return reactIsland("button", props, state, variant, props.fullWidth);
}
function reactAccordionDemo(demo = {}) {
  const props = componentDemoProps("accordion", demo), state = demo.state ?? "open", variant = demo.variant ?? "single";
  return reactIsland("accordion", props, state, variant, demo.fullWidth);
}

function reactAvatarDemo(demo = {}) {
  const props = componentDemoProps("avatar", demo), state = props.state ?? demo.state ?? "default", variant = demo.variant ?? (props.src ? "image" : props.status && props.status !== "none" ? "status" : "initials");
  return reactIsland("avatar", props, state, variant);
}

function reactBadgeDemo(demo = {}) {
  const props = componentDemoProps("badge", demo), state = props.state ?? demo.state ?? "default", variant = props.variant ?? demo.variant ?? "status";
  return reactIsland("badge", props, state, variant);
}

function reactBreadcrumbsDemo(demo = {}) {
  const props = componentDemoProps("breadcrumbs", demo), state = props.state ?? demo.state ?? "default", variant = props.variant ?? demo.variant ?? "standard";
  return reactIsland("breadcrumbs", props, state, variant, props.fullWidth);
}

function reactTagDemo(demo = {}) {
  const props = componentDemoProps("tag", demo), state = props.state ?? demo.state ?? "default", variant = props.variant ?? demo.variant ?? "metadata";
  return reactIsland("tag", props, state, variant);
}

function reactChipDemo(demo = {}) {
  const props = componentDemoProps("chip", demo), state = props.state ?? demo.state ?? "default", variant = props.variant ?? demo.variant ?? "filter";
  return reactIsland("chip", props, state, variant);
}

function reactComboboxDemo(demo = {}) {
  const props = componentDemoProps("combobox", demo), state = props.state ?? demo.state ?? "default";
  return reactIsland("combobox", props, state, "default", props.fullWidth);
}
function reactIconButtonDemo(demo = {}) {
  const props = componentDemoProps("icon-button", demo), state = demo.state ?? "default", variant = props.variant ?? demo.variant ?? "ghost";
  return reactIsland("icon-button", props, state, variant);
}

function reactInlineValidationDemo(demo = {}) {
  const props = componentDemoProps("inline-validation", demo);
  const state = props.state ?? demo.state ?? "default";
  return `<span class="docs-react-island docs-package-demo" data-react-component="inline-validation" data-component-source="react" data-doc-component="inline-validation" data-demo-variant="${escapeAttribute(state)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(state)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactInputDemo(demo = {}) {
  const props = componentDemoProps("input", demo);
  const state = props.state ?? demo.state ?? "default";
  const variant = props.variant ?? demo.variant ?? "text";
  return `<span class="docs-react-island docs-package-demo" data-react-component="input" data-component-source="react" data-doc-component="input" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactCardNumberInputDemo(demo = {}) {
  const props = componentDemoProps("card-number-input", demo);
  const state = props.state ?? demo.state ?? "default";
  return `<span class="docs-react-island docs-package-demo" data-react-component="card-number-input" data-component-source="react" data-doc-component="card-number-input" data-demo-variant="default" data-demo-state="${escapeAttribute(state)}" data-variant="default" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactCardExpiryInputDemo(demo = {}) {
  const props = componentDemoProps("card-expiry-input", demo);
  const state = props.state ?? demo.state ?? "default";
  return `<span class="docs-react-island docs-package-demo" data-react-component="card-expiry-input" data-component-source="react" data-doc-component="card-expiry-input" data-demo-variant="default" data-demo-state="${escapeAttribute(state)}" data-variant="default" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactCardSecurityCodeInputDemo(demo = {}) {
  const props = componentDemoProps("card-security-code-input", demo);
  const state = props.state ?? demo.state ?? "default";
  return `<span class="docs-react-island docs-package-demo" data-react-component="card-security-code-input" data-component-source="react" data-doc-component="card-security-code-input" data-demo-variant="default" data-demo-state="${escapeAttribute(state)}" data-variant="default" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactSelectDemo(demo = {}) {
  const props = componentDemoProps("select", demo);
  const state = props.state ?? demo.state ?? "default";
  const variant = props.variant ?? demo.variant ?? "default";
  return `<span class="docs-react-island docs-package-demo" data-react-component="select" data-component-source="react" data-doc-component="select" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactSegmentedControlDemo(demo = {}) {
  const props = componentDemoProps("segmented-control", demo);
  const state = props.state ?? demo.state ?? "default";
  const variant = props.variant ?? demo.variant ?? "outlined";
  return `<span class="docs-react-island docs-package-demo" data-react-component="segmented-control" data-component-source="react" data-doc-component="segmented-control" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactSpinnerDemo(demo = {}) {
  const props = componentDemoProps("spinner", demo);
  const state = props.state ?? demo.state ?? "loading";
  const variant = props.tone ?? demo.tone ?? "accent";
  return `<span class="docs-react-island docs-package-demo" data-react-component="spinner" data-component-source="react" data-doc-component="spinner" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="false" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}
function reactStepperDemo(demo = {}) {
  const props = componentDemoProps("stepper", demo), state = demo.state ?? "active", variant = props.orientation ?? demo.variant ?? "horizontal";
  return reactIsland("stepper", props, state, variant, true);
}

function reactTabsDemo(demo = {}) {
  const props = componentDemoProps("tabs", demo), state = props.state ?? demo.state ?? "default", variant = props.variant ?? demo.variant ?? "default";
  return reactIsland("tabs", props, state, variant, demo.fullWidth);
}
function reactSkeletonDemo(demo = {}) {
  const props = componentDemoProps("skeleton", demo);
  const state = props.state ?? demo.state ?? "loading";
  const variant = props.variant ?? demo.variant ?? "text";
  return `<span class="docs-react-island docs-package-demo" data-react-component="skeleton" data-component-source="react" data-doc-component="skeleton" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(props.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactSliderDemo(demo = {}) {
  const props = componentDemoProps("slider", demo);
  const state = props.state ?? demo.state ?? "default";
  const variant = props.variant ?? demo.variant ?? "continuous";
  return `<span class="docs-react-island docs-package-demo" data-react-component="slider" data-component-source="react" data-doc-component="slider" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactCheckboxDemo(demo = {}) {
  const props = componentDemoProps("checkbox", demo);
  const state = props.state ?? demo.state ?? "unchecked";
  const variant = props.variant ?? demo.variant ?? "default";
  return `<span class="docs-react-island docs-package-demo" data-react-component="checkbox" data-component-source="react" data-doc-component="checkbox" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactCodeInputDemo(demo = {}) {
  const props = componentDemoProps("code-input", demo);
  const state = props.state ?? demo.state ?? "default";
  const variant = props.variant ?? demo.variant ?? "sms";
  return `<span class="docs-react-island docs-package-demo" data-react-component="code-input" data-component-source="react" data-doc-component="code-input" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactPhoneInputDemo(demo = {}) {
  const props = componentDemoProps("phone-input", demo);
  const state = props.state ?? demo.state ?? "default";
  const variant = props.variant ?? demo.variant ?? "country-code";
  return `<span class="docs-react-island docs-package-demo" data-react-component="phone-input" data-component-source="react" data-doc-component="phone-input" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="${String(Boolean(demo.fullWidth))}" data-react-props="${escapeAttribute(JSON.stringify(props))}"></span>`;
}

function reactPopoverDemo(demo = {}) {
  const props = componentDemoProps("popover", demo), state = props.state ?? demo.state ?? "closed", variant = props.variant ?? demo.variant ?? "information";
  return reactIsland("popover", props, state, variant, props.fullWidth);
}
function reactPaginationDemo(demo = {}) {
  const props = componentDemoProps("pagination", demo), state = props.state ?? demo.state ?? "default", variant = props.variant ?? demo.variant ?? "numbered";
  return reactIsland("pagination", props, state, variant, props.fullWidth);
}

function reactProgressIndicatorDemo(demo = {}) {
  const props = componentDemoProps("progress-indicator", demo), state = props.state ?? demo.state ?? "active", variant = props.indeterminate ? "indeterminate" : props.tone ?? demo.tone ?? "accent";
  return reactIsland("progress-indicator", props, state, variant, props.fullWidth);
}

function reactDatePickerDemo(demo = {}) {
  const props = componentDemoProps("date-picker", demo), state = props.state ?? demo.state ?? "default", variant = props.variant ?? demo.variant ?? "calendar";
  return reactIsland("date-picker", props, state, variant, props.fullWidth);
}

function reactDateRangePickerDemo(demo = {}) {
  const props = componentDemoProps("date-range-picker", demo), state = props.state ?? demo.state ?? "default", variant = props.variant ?? demo.variant ?? "calendar";
  return reactIsland("date-range-picker", props, state, variant, props.fullWidth);
}

function reactDialogDemo(demo = {}) {
  const props = componentDemoProps("dialog", demo), state = props.state ?? demo.state ?? "closed", variant = props.variant ?? demo.variant ?? "confirmation";
  return reactIsland("dialog", { ...props, open: Boolean(demo.open) }, state, variant, props.fullWidth);
}

function reactDrawerDemo(demo = {}) {
  const props = componentDemoProps("drawer", demo), state = props.state ?? demo.state ?? "closed", variant = props.variant ?? demo.variant ?? "side-sheet";
  return reactIsland("drawer", { ...props, open: Boolean(demo.open) }, state, variant, props.fullWidth);
}

function reactEmptyStateDemo(demo = {}) {
  const props = componentDemoProps("empty-state", demo), state = props.state ?? demo.state ?? "default", variant = props.variant ?? demo.variant ?? "first-use";
  return reactIsland("empty-state", props, state, variant, props.fullWidth);
}

function reactErrorPanelDemo(demo = {}) {
  const props = componentDemoProps("error-panel", demo), state = props.state ?? demo.state ?? "error", variant = props.variant ?? demo.variant ?? "panel";
  return reactIsland("error-panel", props, state, variant, props.fullWidth);
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

function reactTextAreaDemo(demo = {}) {
  const props = componentDemoProps("text-area", demo), state = props.state ?? demo.state ?? "default";
  return reactIsland("text-area", props, state, "default", props.fullWidth);
}

function reactTooltipDemo(demo = {}) {
  const props = componentDemoProps("tooltip", demo), state = props.state ?? demo.state ?? "default", variant = props.variant ?? demo.variant ?? "default";
  return reactIsland("tooltip", props, state, variant);
}

function reactToastDemo(demo = {}) {
  const props = componentDemoProps("toast", demo), state = props.state ?? demo.state ?? "visible", variant = props.variant ?? demo.variant ?? "status";
  return reactIsland("toast", props, state, variant);
}

export function componentDemo(component, demo = {}) {
  if (typeof document === "undefined" || typeof document.createTextNode !== "function") return "";
  if (component === "accordion") return reactAccordionDemo(demo);
  if (component === "avatar") return reactAvatarDemo(demo);
  if (component === "badge") return reactBadgeDemo(demo);
  if (component === "breadcrumbs") return reactBreadcrumbsDemo(demo);
  if (component === "button") return reactButtonDemo(demo);
  if (component === "card-expiry-input") return reactCardExpiryInputDemo(demo);
  if (component === "card-number-input") return reactCardNumberInputDemo(demo);
  if (component === "card-security-code-input") return reactCardSecurityCodeInputDemo(demo);
  if (component === "checkbox") return reactCheckboxDemo(demo);
  if (component === "chip") return reactChipDemo(demo);
  if (component === "code-input") return reactCodeInputDemo(demo);
  if (component === "combobox") return reactComboboxDemo(demo);
  if (component === "date-picker") return reactDatePickerDemo(demo);
  if (component === "date-range-picker") return reactDateRangePickerDemo(demo);
  if (component === "dialog") return reactDialogDemo(demo);
  if (component === "drawer") return reactDrawerDemo(demo);
  if (component === "empty-state") return reactEmptyStateDemo(demo);
  if (component === "error-panel") return reactErrorPanelDemo(demo);
  if (component === "icon-button") return reactIconButtonDemo(demo);
  if (component === "inline-validation") return reactInlineValidationDemo(demo);
  if (component === "input") return reactInputDemo(demo);
  if (component === "pagination") return reactPaginationDemo(demo);
  if (component === "phone-input") return reactPhoneInputDemo(demo);
  if (component === "popover") return reactPopoverDemo(demo);
  if (component === "progress-indicator") return reactProgressIndicatorDemo(demo);
  if (component === "radio-button") return reactRadioButtonDemo(demo);
  if (component === "select") return reactSelectDemo(demo);
  if (component === "segmented-control") return reactSegmentedControlDemo(demo);
  if (component === "skeleton") return reactSkeletonDemo(demo);
  if (component === "slider") return reactSliderDemo(demo);
  if (component === "spinner") return reactSpinnerDemo(demo);
  if (component === "stepper") return reactStepperDemo(demo);
  if (component === "switch") return reactSwitchDemo(demo);
  if (component === "tabs") return reactTabsDemo(demo);
  if (component === "tag") return reactTagDemo(demo);
  if (component === "toast") return reactToastDemo(demo);
  if (component === "text-area") return reactTextAreaDemo(demo);
  if (component === "tooltip") return reactTooltipDemo(demo);
  const node = renderComponentDemo(component, demo);
  persistNativeFieldState(node);
  node.className = [node.className, "docs-package-demo"].filter(Boolean).join(" ");
  markPackageControls(node);
  node.setAttribute("data-component-source", "package");
  node.setAttribute("data-doc-component", component);
  node.setAttribute("data-demo-variant", demo.variant ?? "standard");
  node.setAttribute("data-demo-state", demo.state ?? "default");
  const hasAttribute = (name) => Boolean(node.hasAttribute?.(name) || node.getAttribute?.(name) != null || node.attributes?.[name] != null);
  if (!hasAttribute("data-variant")) node.setAttribute("data-variant", demo.variant ?? "standard"); if (!hasAttribute("data-state")) node.setAttribute("data-state", demo.state ?? "default");
  node.setAttribute("data-full-width", String(Boolean(demo.fullWidth)));
  queueChartHydration();
  return node.outerHTML;
}
