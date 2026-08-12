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
  const languageToggle = document.querySelector("#languageToggle");
  if (languageToggle) {
    const languageCode = languageToggle.querySelector(".language-toggle__code");
    if (languageCode) languageCode.textContent = ui("shell.languageCurrent");
    languageToggle.dataset.locale = currentLocale();
    languageToggle.setAttribute("aria-label", ui("shell.languageToggle"));
  }
}

export function setupLanguageToggle() {
  document.querySelector("#languageToggle")?.addEventListener("click", () => {
    setCurrentLocale(currentLocale() === "en" ? "es" : "en");
    applyLocalizedChrome();
    render();
  });
}
