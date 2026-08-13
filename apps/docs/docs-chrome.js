let currentLocale = () => "en";
let render = () => {};
let setCurrentLocale = () => {};
let ui = (key) => key;

export function configureDocsChrome(nextDeps) {
  currentLocale = nextDeps.currentLocale;
  render = nextDeps.render;
  setCurrentLocale = nextDeps.setCurrentLocale;
  ui = nextDeps.ui;
}

export function applyLocalizedChrome() {
  document.documentElement.lang = currentLocale();
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) skipLink.textContent = ui("shell.skipToContent");
  document.querySelector(".topbar")?.setAttribute("aria-label", ui("shell.primaryNavigation"));
  document.querySelector(".brand")?.setAttribute("aria-label", ui("shell.brandHome"));
}

export function setupLanguageToggle() {
  // Language is owned by the Flow Topbar action in docs-shell-react.js.
}
