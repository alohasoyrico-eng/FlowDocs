export function setupAccordionDemos(root = document) {
  root.querySelectorAll('[data-doc-component="accordion"]:not([data-demo-ready="true"])').forEach((accordion) => {
    accordion.dataset.demoReady = "true";
  });
}

export function setupTableDemos(root = document) {
  root.querySelectorAll('[data-doc-component="table"]:not([data-demo-ready="true"])').forEach((table) => {
    table.dataset.demoReady = "true";
  });
}

export function setupListDemos(root = document) {
  root.querySelectorAll('[data-doc-component="list"]:not([data-demo-ready="true"])').forEach((list) => {
    list.dataset.demoReady = "true";
    const items = [...list.querySelectorAll("button.list__item")];
    items.forEach((item) => item.addEventListener("click", () => {
      items.forEach((candidate) => {
        candidate.dataset.state = candidate.dataset.state === "disabled" ? "disabled" : "default";
        candidate.removeAttribute("aria-current");
      });
      item.dataset.state = "selected";
      item.setAttribute("aria-current", "true");
    }));
  });
}
