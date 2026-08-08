export function setupProgressIndicatorDemos(root = document) {
  root.querySelectorAll('[data-doc-component="progress-indicator"]:not([data-progress-ready="true"])').forEach((demo) => {
    demo.dataset.progressReady = "true";
  });
}

export function renderProgressIndicatorPreview(demo, deps) {
  const state = demo.state ?? "active";
  const variant = demo.variant ?? "linear";
  return {
    html: deps.progressIndicatorDemo(demo.label ?? "Card import", Number(demo.value ?? 68), variant, state, Boolean(demo.fullWidth)),
    markup: `<ProgressIndicator label="${deps.escapeHtml(demo.label ?? "Card import")}" value={${Number(demo.value ?? 68)}} variant="${deps.escapeHtml(variant)}" state="${deps.escapeHtml(state)}" />`,
  };
}
