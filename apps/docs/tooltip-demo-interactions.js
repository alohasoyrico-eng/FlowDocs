export function setupTooltipDemos(root = document) {
  root.querySelectorAll('[data-doc-component="tooltip"]:not([data-demo-ready="true"]), .tooltip-demo:not([data-demo-ready="true"])').forEach((tooltip) => {
    tooltip.dataset.demoReady = "true";
  });
}
