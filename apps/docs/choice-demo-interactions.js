export function setupChoiceDemos(root = document) {
  root.querySelectorAll(".checkbox.docs-package-demo:not([data-demo-ready='true'])").forEach((label) => {
    label.dataset.demoReady = "true";
  });
}

export function setupRadioButtonDemos(root = document) {
  root.querySelectorAll(".radio.docs-package-demo:not([data-demo-ready='true'])").forEach((label) => {
    label.dataset.demoReady = "true";
  });
}

export function setupSwitchDemos(root = document) {
  root.querySelectorAll(".switch.docs-package-demo:not([data-demo-ready='true'])").forEach((label) => {
    label.dataset.demoReady = "true";
  });
}
