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
  });
}

function setupTabsDemos(root = document) {
  root.querySelectorAll('[data-doc-component="tabs"]:not([data-stateful-ready="true"]), .detail-tablist:not([data-stateful-ready="true"])').forEach((tablist) => {
    tablist.dataset.statefulReady = "true";
  });
}

function setupSliderDemos(root = document) {
  root.querySelectorAll('[data-doc-component="slider"]:not([data-stateful-ready="true"]), .slider-demo:not([data-stateful-ready="true"])').forEach((slider) => {
    slider.dataset.statefulReady = "true";
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

function setupPaginationDemos(root = document) {
  root.querySelectorAll('[data-doc-component="pagination"]:not([data-stateful-ready="true"])').forEach((pagination) => {
    pagination.dataset.statefulReady = "true";
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
