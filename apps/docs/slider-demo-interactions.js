export function setupSliderDemos(root = document) {
  root.querySelectorAll(".slider-demo:not([data-demo-ready='true'])").forEach((slider) => {
    slider.dataset.demoReady = "true";
  });
}
