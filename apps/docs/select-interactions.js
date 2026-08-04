import { hydrateTransitionalSelect } from "./generated/components/components/fields.js?v=21";

export function setupSelectDemos(root = document) {
  root.querySelectorAll('[data-doc-component="select"]:not([data-select-ready="true"])').forEach((demo) => {
    demo.dataset.selectReady = "true";
    hydrateTransitionalSelect(demo);
  });
}

export function closeSelect(root = document) {
  root.querySelectorAll('[data-select-control][data-open="true"]').forEach((control) => {
    control.dataset.open = "false";
    control.querySelector("[data-select-trigger]")?.setAttribute("aria-expanded", "false");
  });
}
