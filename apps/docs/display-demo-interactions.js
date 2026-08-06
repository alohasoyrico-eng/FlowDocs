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
  });
}
