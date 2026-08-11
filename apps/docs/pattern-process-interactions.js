export function setupProcessPatternInteractions() {
  document.addEventListener("click", handleProcessPatternClick);
}

function handleProcessPatternClick(event) {
  const fileChoose = event.target.closest("[data-file-upload-choose]");
  if (fileChoose) return chooseUploadFile(fileChoose.closest("[data-file-upload-demo]"));

  const fileRemove = event.target.closest("[data-file-upload-remove]");
  if (fileRemove) return removeUploadFile(fileRemove.closest("[data-file-upload-demo]"));
}

function chooseUploadFile(demo) {
  if (!demo) return;
  demo.dataset.fileState = "uploading";
  demo.querySelector("[data-file-upload-empty]")?.setAttribute("hidden", "");
  demo.querySelector("[data-file-upload-summary]")?.removeAttribute("hidden");
  demo.querySelector("[data-file-upload-progress]")?.removeAttribute("hidden");
  demo.querySelector("[data-file-upload-validation]")?.setAttribute("hidden", "");
  demo.querySelector("[data-file-upload-remove]")?.removeAttribute("hidden");
  showProcessToast(demo, "[data-file-upload-toast]");
}

function removeUploadFile(demo) {
  if (!demo) return;
  demo.dataset.fileState = "empty";
  demo.querySelector("[data-file-upload-empty]")?.removeAttribute("hidden");
  demo.querySelector("[data-file-upload-summary]")?.setAttribute("hidden", "");
  demo.querySelector("[data-file-upload-progress]")?.setAttribute("hidden", "");
  demo.querySelector("[data-file-upload-toast]")?.setAttribute("hidden", "");
  demo.querySelector("[data-file-upload-remove]")?.setAttribute("hidden", "");
}

function showProcessToast(demo, selector) {
  const toast = demo?.querySelector(selector);
  if (toast) toast.hidden = false;
}
