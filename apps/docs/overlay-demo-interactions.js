export function setupOverlayDemos(root = document) {
  root.querySelectorAll('[data-doc-component="dialog"]:not([data-demo-ready="true"]), [data-doc-component="drawer"]:not([data-demo-ready="true"])').forEach((demo) => {
    demo.dataset.demoReady = "true";
  });
}

export function setupMenuDemos(root = document) {
  root.querySelectorAll('[data-doc-component="menu"]:not([data-demo-ready="true"]), .menu-demo:not([data-demo-ready="true"])').forEach((demo) => {
    demo.dataset.demoReady = "true";
  });
}
