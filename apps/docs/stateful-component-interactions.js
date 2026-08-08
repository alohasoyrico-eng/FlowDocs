export function setupStatefulComponentDemos(root = document) {
  setupComboboxDemos(root);
  setupChipDemos(root);
  setupTabsDemos(root);
  setupSliderDemos(root);
  setupSegmentedControlDemos(root);
  setupPaginationDemos(root);
  setupPopoverDemos(root);
  setupCodeInputDemos(root);
  setupPhoneInputDemos(root);
  setupCardNumberInputDemos(root);
  setupCardExpiryInputDemos(root);
  setupCardSecurityCodeInputDemos(root);
  setupDatePickerDemos(root);
  setupDateRangePickerDemos(root);
  setupTreeViewDemos(root);
}

function setupCardNumberInputDemos(root = document) {
  root.querySelectorAll('[data-doc-component="card-number-input"]:not([data-stateful-ready="true"])').forEach((demo) => {
    demo.dataset.statefulReady = "true";
  });
}

function setupCardExpiryInputDemos(root = document) {
  root.querySelectorAll('[data-doc-component="card-expiry-input"]:not([data-stateful-ready="true"])').forEach((demo) => {
    demo.dataset.statefulReady = "true";
  });
}

function setupCardSecurityCodeInputDemos(root = document) {
  root.querySelectorAll('[data-doc-component="card-security-code-input"]:not([data-stateful-ready="true"])').forEach((demo) => {
    demo.dataset.statefulReady = "true";
  });
}

function setupComboboxDemos(root = document) {
  root.querySelectorAll('[data-doc-component="combobox"]:not([data-stateful-ready="true"])').forEach((demo) => {
    demo.dataset.statefulReady = "true";
  });
}

function setupChipDemos(root = document) {
  root.querySelectorAll('[data-doc-component="chip"]:not([data-stateful-ready="true"])').forEach((chip) => {
    chip.dataset.statefulReady = "true";
    if (chip.tagName !== "BUTTON") return;
    chip.addEventListener("click", () => {
      if (chip.disabled) return;
      if (chip.getAttribute("data-chip-remove") === "true" || chip.querySelector("[data-chip-remove]")) {
        chip.remove();
        return;
      }
      const selected = chip.getAttribute("aria-pressed") === "true";
      chip.setAttribute("aria-pressed", String(!selected));
      chip.dataset.selected = String(!selected);
      chip.dataset.state = selected ? "default" : "selected";
    });
  });
}

function setupTabsDemos(root = document) {
  root.querySelectorAll('[data-doc-component="tabs"]:not([data-stateful-ready="true"]), .detail-tablist:not([data-stateful-ready="true"])').forEach((tablist) => {
    tablist.dataset.statefulReady = "true";
    const tabs = [...tablist.querySelectorAll("[data-tabs-item], [role='tab']")];
    const updateIndicator = (tab) => {
      if (!tab) return;
      tablist.style.setProperty("--comp-tabs-indicator-left", `${tab.offsetLeft}px`);
      tablist.style.setProperty("--comp-tabs-indicator-width", `${tab.offsetWidth}px`);
    };
    const activateTab = (tab) => {
      tabs.forEach((item) => {
        item.setAttribute("aria-selected", String(item === tab));
        item.tabIndex = item === tab ? 0 : -1;
      });
      updateIndicator(tab);
    };
    updateIndicator(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") ?? tabs[0]);
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab));
      tab.addEventListener("keydown", (event) => {
        const nextTab = horizontalItemForKey(event.key, tabs, index);
        if (!nextTab) return;
        event.preventDefault();
        nextTab.focus();
        activateTab(nextTab);
      });
    });
    window.addEventListener("resize", () => updateIndicator(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") ?? tabs[0]));
  });
}

function setupSliderDemos(root = document) {
  root.querySelectorAll('[data-doc-component="slider"]:not([data-stateful-ready="true"]), .slider-demo:not([data-stateful-ready="true"])').forEach((slider) => {
    slider.dataset.statefulReady = "true";
    const input = slider.querySelector("[data-slider-input], input[type='range']");
    const output = slider.querySelector("[data-slider-output], output");
    if (!input) return;
    const initialText = output?.textContent ?? "";
    const match = initialText.match(/^(.*?)(-?\d+(?:\.\d+)?)(.*)$/);
    const prefix = match?.[1] ?? "";
    const suffix = match?.[3] ?? "";
    const update = () => {
      const min = Number(input.min || 0);
      const max = Number(input.max || 100);
      const value = Number(input.value || 0);
      const pct = max === min ? 0 : Math.round(((value - min) / (max - min)) * 100);
      slider.dataset.value = String(value);
      slider.dataset.pct = String(Math.max(0, Math.min(100, pct)));
      if (output) output.textContent = `${prefix}${value}${suffix}`;
    };
    input.addEventListener("input", update);
    input.addEventListener("change", update);
    input.addEventListener("pointerdown", () => {
      slider.dataset.dragging = "true";
    });
    input.addEventListener("pointerup", () => {
      slider.dataset.dragging = "false";
    });
    input.addEventListener("pointercancel", () => {
      slider.dataset.dragging = "false";
    });
    input.addEventListener("blur", () => {
      slider.dataset.dragging = "false";
    });
    update();
  });
}

function setupSegmentedControlDemos(root = document) {
  root.querySelectorAll('[data-doc-component="segmented-control"]:not([data-stateful-ready="true"])').forEach((control) => {
    control.dataset.statefulReady = "true";
  });
}

function setupTreeViewDemos(root = document) {
  root.querySelectorAll('[data-doc-component="tree-view"]:not([data-stateful-ready="true"])').forEach((tree) => {
    tree.dataset.statefulReady = "true";
  });
}

function horizontalItemForKey(key, items, index) {
  const keyActions = {
    ArrowLeft: () => items[(index - 1 + items.length) % items.length],
    ArrowRight: () => items[(index + 1) % items.length],
    Home: () => items[0],
    End: () => items[items.length - 1],
  };
  return keyActions[key]?.();
}

function setupPaginationDemos(root = document) {
  root.querySelectorAll('[data-doc-component="pagination"]:not([data-stateful-ready="true"])').forEach((pagination) => {
    pagination.dataset.statefulReady = "true";
    const buttons = [...pagination.querySelectorAll("button")];
    const pageButtons = buttons.filter((button) => button.dataset.kind === "page");
    const pageCount = Number(pagination.dataset.pageCount || pageButtons[pageButtons.length - 1]?.dataset.page || 1);
    const setPage = (page) => {
      const nextPage = Math.max(1, Math.min(Number(page) || 1, pageCount));
      pagination.dataset.page = String(nextPage);
      pageButtons.forEach((button) => {
        const selected = Number(button.dataset.page) === nextPage;
        if (selected) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
        button.dataset.state = selected ? "selected" : "default";
      });
      const [prev] = buttons;
      const next = buttons[buttons.length - 1];
      if (prev) prev.disabled = nextPage <= 1;
      if (next) next.disabled = nextPage >= pageCount;
    };
    const current = Number(pageButtons.find((button) => button.getAttribute("aria-current") === "page")?.dataset.page ?? pagination.dataset.page ?? 1);
    setPage(current);
    pageButtons.forEach((button) => button.addEventListener("click", () => setPage(Number(button.dataset.page))));
    buttons[0]?.addEventListener("click", () => {
      const active = Number(pagination.dataset.page || 1);
      setPage(Math.max(1, active - 1));
    });
    buttons[buttons.length - 1]?.addEventListener("click", () => {
      const active = Number(pagination.dataset.page || 1);
      setPage(Math.min(pageCount, active + 1));
    });
  });
}

function setupPopoverDemos(root = document) {
  root.querySelectorAll('[data-doc-component="popover"]:not([data-stateful-ready="true"])').forEach((popover) => {
    popover.dataset.statefulReady = "true";
  });
}

function setupCodeInputDemos(root = document) {
  root.querySelectorAll('[data-doc-component="code-input"]:not([data-stateful-ready="true"]), .code-input-demo:not([data-stateful-ready="true"])').forEach((otp) => {
    otp.dataset.statefulReady = "true";
  });
}

function setupPhoneInputDemos(root = document) {
  root.querySelectorAll('[data-doc-component="phone-input"]:not([data-stateful-ready="true"]), .phone-input-demo:not([data-stateful-ready="true"])').forEach((phoneInput) => {
    phoneInput.dataset.statefulReady = "true";
  });
}

function setupDatePickerDemos(root = document) {
  root.querySelectorAll('[data-doc-component="date-picker"]:not([data-stateful-ready="true"])').forEach((picker) => {
    picker.dataset.statefulReady = "true";
  });
}

function setupDateRangePickerDemos(root = document) {
  root.querySelectorAll('[data-doc-component="date-range-picker"]:not([data-stateful-ready="true"])').forEach((picker) => {
    picker.dataset.statefulReady = "true";
  });
}
