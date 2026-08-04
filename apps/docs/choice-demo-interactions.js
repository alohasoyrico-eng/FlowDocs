export function setupChoiceDemos(root = document) {
  root.querySelectorAll(".checkbox.docs-package-demo:not([data-demo-ready='true'])").forEach((label) => {
    const input = label.querySelector("input");
    if (!input) return;
    label.dataset.demoReady = "true";
    input.indeterminate = label.dataset.indeterminate === "true";
    input.setAttribute("aria-checked", input.indeterminate ? "mixed" : String(input.checked));
    if (input.disabled) return;
    input.addEventListener("change", () => {
      input.indeterminate = false;
      label.dataset.indeterminate = "false";
      label.dataset.checked = String(input.checked);
      label.dataset.state = input.checked ? "checked" : "unchecked";
      input.setAttribute("aria-checked", String(input.checked));
      const indicator = label.querySelector(".choice__indicator");
      if (indicator) indicator.textContent = "check";
    });
  });
}

export function setupRadioButtonDemos(root = document) {
  root.querySelectorAll(".radio.docs-package-demo:not([data-demo-ready='true'])").forEach((label) => {
    const input = label.querySelector("input");
    if (!input) return;
    label.dataset.demoReady = "true";
    if (input.disabled) return;
    input.addEventListener("change", () => {
      const name = input.getAttribute("name");
      if (name) {
        root.querySelectorAll(`.radio.docs-package-demo input[name="${CSS.escape(name)}"]`).forEach((otherInput) => {
          const otherLabel = otherInput.closest(".radio.docs-package-demo");
          if (!otherLabel) return;
          otherLabel.dataset.checked = String(otherInput.checked);
          if (!["disabled", "error"].includes(otherLabel.dataset.state)) {
            otherLabel.dataset.state = otherInput.checked ? "selected" : "unselected";
          }
        });
      }
      label.dataset.checked = String(input.checked);
      if (!["disabled", "error"].includes(label.dataset.state)) {
        label.dataset.state = input.checked ? "selected" : "unselected";
      }
    });
  });
}

export function setupSwitchDemos(root = document) {
  root.querySelectorAll(".switch.docs-package-demo:not([data-demo-ready='true'])").forEach((label) => {
    const input = label.querySelector("input");
    if (!input) return;
    label.dataset.demoReady = "true";
    const syncSwitch = () => {
      label.dataset.checked = String(input.checked);
      if (!["disabled", "error", "focus", "pressed"].includes(label.dataset.state)) {
        label.dataset.state = input.checked ? "on" : "off";
      }
      input.setAttribute("aria-checked", String(input.checked));
    };
    if (input.disabled) return;
    const toggleSwitch = (event) => {
      event.preventDefault();
      event.stopPropagation();
      input.checked = !input.checked;
      syncSwitch();
      input.dispatchEvent(new Event("change", { bubbles: true }));
    };
    input.addEventListener("change", syncSwitch);
    input.addEventListener("input", syncSwitch);
    input.addEventListener("click", toggleSwitch);
    label.addEventListener("click", (event) => {
      if (event.target === input) return;
      toggleSwitch(event);
    });
    label.addEventListener("keyup", () => requestAnimationFrame(syncSwitch));
  });
}
