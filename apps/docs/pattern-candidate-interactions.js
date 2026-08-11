export function setupCandidatePatternInteractions() {
  document.addEventListener("click", handleCandidatePatternClick);
}

function handleCandidatePatternClick(event) {
  const selectLayerChoose = event.target.closest("[data-select-layer-choose]");
  if (selectLayerChoose) return chooseSelectLayerOption(selectLayerChoose.closest("[data-select-layer-demo]"), selectLayerChoose.dataset.selectLayerChoose);

  const selectLayerBlocked = event.target.closest("[data-select-layer-blocked]");
  if (selectLayerBlocked) return showSelectLayerValidation(selectLayerBlocked.closest("[data-select-layer-demo]"));

  const multiSelectApply = event.target.closest("[data-multi-select-apply]");
  if (multiSelectApply) return applyMultiSelect(multiSelectApply.closest("[data-multi-select-demo]"));
}

document.addEventListener("change", (event) => {
  const multiSelectOption = event.target.closest("[data-multi-select-option]");
  if (multiSelectOption) return updateMultiSelect(multiSelectOption.closest("[data-multi-select-demo]"));
});

function chooseSelectLayerOption(demo, key) {
  if (!demo) return;
  demo.querySelectorAll("[data-select-layer-option]").forEach((option) => {
    option.dataset.selected = String(option.dataset.selectLayerOption === key);
  });
  const select = demo.querySelector("[data-select-layer-field] select");
  if (select) select.value = key;
  const validation = demo.querySelector("[data-select-layer-validation]");
  if (validation) validation.hidden = true;
}

function showSelectLayerValidation(demo) {
  const validation = demo?.querySelector("[data-select-layer-validation]");
  if (validation) validation.hidden = false;
}

function updateMultiSelect(demo) {
  if (!demo) return;
  const checkedControls = Array.from(demo.querySelectorAll("[data-multi-select-option]")).filter((control) => control.querySelector("input")?.checked);
  const checkedIds = checkedControls.map((control) => control.dataset.multiSelectOption);
  const max = Number(demo.dataset.max ?? 2);
  demo.querySelectorAll("[data-multi-select-chip]").forEach((chip) => {
    chip.hidden = !checkedIds.includes(chip.dataset.multiSelectChip);
  });
  const empty = demo.querySelector("[data-multi-select-empty]");
  if (empty) empty.hidden = checkedIds.length > 0;
  const validation = demo.querySelector("[data-multi-select-validation]");
  if (validation) validation.hidden = checkedIds.length <= max;
  const count = demo.querySelector("[data-multi-select-count]");
  if (count) {
    count.textContent = `${checkedIds.length} selected`;
    count.setAttribute("aria-label", `${checkedIds.length} filters selected`);
  }
}

function applyMultiSelect(demo) {
  if (!demo) return;
  updateMultiSelect(demo);
  const count = demo.querySelectorAll("[data-multi-select-option] input:checked").length;
  const toast = demo.querySelector("[data-multi-select-toast]");
  const copy = toast?.querySelector("[data-pattern-toast] p");
  if (copy) copy.textContent = `${count} ${count === 1 ? "filter is" : "filters are"} active.`;
  if (toast) toast.hidden = false;
}
