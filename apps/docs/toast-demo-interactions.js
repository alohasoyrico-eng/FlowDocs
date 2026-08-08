export function setupToastDemos(root = document) {
  root.querySelectorAll('[data-doc-component="toast"]:not([data-demo-ready="true"]), .toast-demo:not([data-demo-ready="true"])').forEach((toast) => {
    toast.dataset.demoReady = "true";
  });
}
