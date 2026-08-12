const {
  docsAppFile,
  docsChromeFile,
  docsIndexFile,
  docsLayoutFile,
  docsShellReactFile,
  fs,
  path,
  read,
  add,
} = require("./audit-context.js");

const legacyShellSelectors = [
  "#menuButton",
  "#topbarSearch",
  "#topSearch",
  "#topSearchResults",
  "#gridToggle",
  "#themeToggle",
];

function lineOf(text, token) {
  const index = text.indexOf(token);
  return index === -1 ? 1 : text.slice(0, index).split("\n").length;
}

function checkNoLegacyShellSelectors(file) {
  if (!fs.existsSync(file)) return;
  const text = read(file);
  for (const selector of legacyShellSelectors) {
    if (text.includes(selector)) {
      add("errors", file, lineOf(text, selector), `Docs shell must not reference legacy shell selector ${selector}; use docs-shell-react.js and Flow React shell patterns.`);
    }
  }
}

function checkDocsShellBoundary() {
  const navigationFile = path.join(path.dirname(docsAppFile), "navigation.js");
  const docsAppDir = path.dirname(docsAppFile);
  const patternTabsFile = path.join(docsAppDir, "pattern-tabs.js");
  const patternFocusedDesignFile = path.join(docsAppDir, "pattern-focused-design.js");
  const patternShellReactDemosFile = path.join(docsAppDir, "pattern-shell-react-demos.js");
  const patternShellRenderersFile = path.join(docsAppDir, "pattern-shell-renderers.js");
  const templateDesktopDemosFile = path.join(docsAppDir, "template-desktop-demos.js");
  const docsStylesFile = path.join(docsAppDir, "styles.css");
  const legacyShellStyleFiles = [
    "styles/07-pattern-focused-demos.css",
    "styles/07-pattern-sidebar-slots.css",
    "styles/07-pattern-topbar-sections.css",
  ].map((file) => path.join(docsAppDir, file));
  if (fs.existsSync(navigationFile)) {
    add("errors", navigationFile, 1, "Legacy navigation.js must not exist; docs shell navigation is owned by docs-shell-react.js and Flow React Topbar/Sidebar.");
  }
  if (fs.existsSync(patternShellRenderersFile)) {
    add("errors", patternShellRenderersFile, 1, "Manual shell renderers must not exist; templates and pattern pages must consume Flow React Topbar/Sidebar or template islands.");
  }
  for (const file of legacyShellStyleFiles) {
    if (fs.existsSync(file)) {
      add("errors", file, 1, "Legacy shell demo CSS must not exist without a Flow React owner.");
    }
  }

  const docsStyles = read(docsStylesFile);
  for (const forbiddenImport of [
    "07-pattern-focused-demos.css",
    "07-pattern-sidebar-slots.css",
    "07-pattern-topbar-sections.css",
  ]) {
    if (docsStyles.includes(forbiddenImport)) {
      add("errors", docsStylesFile, lineOf(docsStyles, forbiddenImport), `Docs styles must not import legacy shell demo CSS: ${forbiddenImport}.`);
    }
  }

  const index = read(docsIndexFile);
  for (const required of [
    'id="docsReactShellTopbar"',
    'data-doc-shell-boundary="react-topbar"',
    'data-doc-shell-boundary="topbar"',
  ]) {
    if (!index.includes(required)) add("errors", docsIndexFile, 1, `Docs index is missing React shell mount: ${required}.`);
  }

  const layout = read(docsLayoutFile);
  for (const required of [
    'id="docsReactShellSidebar"',
    'data-doc-shell-boundary="react-sidebar"',
  ]) {
    if (!layout.includes(required)) add("errors", docsLayoutFile, 1, `Docs layout is missing React shell mount: ${required}.`);
  }
  if (/<details class="sidebar-group"|<a class="[^"]*active[^"]*" href="#\//.test(layout)) {
    add("errors", docsLayoutFile, 1, "Docs layout must not author a manual sidebar tree; route groups through Flow React Sidebar.");
  }

  const app = read(docsAppFile);
  for (const required of [
    "configureDocsShell",
    "renderDocsShell(current)",
    "./docs-shell-react.js",
  ]) {
    if (!app.includes(required)) add("errors", docsAppFile, 1, `Docs app is missing shell React integration: ${required}.`);
  }
  for (const forbidden of ["setupCommand", "setupMenu", "setupTopNav", "./navigation.js"]) {
    if (app.includes(forbidden)) add("errors", docsAppFile, lineOf(app, forbidden), `Docs app must not wire legacy shell behavior: ${forbidden}.`);
  }

  const shell = read(docsShellReactFile);
  for (const required of [
    'from "./generated/react/patterns/Topbar.js',
    'from "./generated/react/patterns/Sidebar.js',
    '"data-doc-shell-consumer": "react-topbar"',
    '"data-doc-shell-consumer": "react-sidebar"',
  ]) {
    if (!shell.includes(required)) add("errors", docsShellReactFile, 1, `Docs shell React boundary is missing Flow shell contract: ${required}.`);
  }

  for (const file of [docsIndexFile, docsChromeFile, docsLayoutFile, docsAppFile]) {
    checkNoLegacyShellSelectors(file);
  }

  const patternTabs = read(patternTabsFile);
  for (const forbidden of [
    "topbarMarkup",
    "sidebarPatternPanel",
    "topbarPatternPanel",
    "pattern-stage--real-shell",
    'class="sidebar"',
    'class="sidebar-group"',
  ]) {
    if (patternTabs.includes(forbidden)) {
      add("errors", patternTabsFile, lineOf(patternTabs, forbidden), `Topbar/Sidebar pattern detail pages must not render shell markup manually: ${forbidden}. Use Flow React pattern islands.`);
    }
  }
  for (const required of [
    'shellPatternOverviewDemo(entry.id)',
    'entry.id === "topbar" || entry.id === "sidebar"',
  ]) {
    if (!patternTabs.includes(required)) {
      add("errors", patternTabsFile, 1, `Topbar/Sidebar pattern pages must route examples through the React shell demo: ${required}.`);
    }
  }

  const focusedDesign = read(patternFocusedDesignFile);
  for (const forbidden of [
    "topbarMarkup",
    "sidebarMarkup",
    "pattern-design-shell-demo",
    "top-actions",
    "sidebar-group",
    "searchSlotMarkup",
    "avatarMenuMarkup",
    "notificationPanelMarkup",
  ]) {
    if (focusedDesign.includes(forbidden)) {
      add("errors", patternFocusedDesignFile, lineOf(focusedDesign, forbidden), `Focused Topbar/Sidebar design docs must not create local shell renderers: ${forbidden}. Mark unsupported variants as Candidate until Flow exposes them.`);
    }
  }

  const reactPatternDemos = read(patternShellReactDemosFile);
  for (const required of [
    'patternReactDemo("topbar"',
    'patternReactDemo("sidebar"',
    'data-component-source="react-pattern"',
  ]) {
    if (!reactPatternDemos.includes(required)) {
      add("errors", patternShellReactDemosFile, 1, `Shell pattern demos must consume generated Flow React patterns: ${required}.`);
    }
  }

  const templateDesktopDemos = read(templateDesktopDemosFile);
  for (const forbidden of [
    "renderSidebarPattern",
    "renderTopbarPattern",
    "./pattern-shell-renderers.js",
    'class="sidebar"',
    'class="topbar"',
    "sidebar-group",
    "top-actions",
  ]) {
    if (templateDesktopDemos.includes(forbidden)) {
      add("errors", templateDesktopDemosFile, lineOf(templateDesktopDemos, forbidden), `Template demos must not render shell patterns manually: ${forbidden}. Use React template islands.`);
    }
  }
  if (!templateDesktopDemos.includes("reactTemplateDemo(entry, blueprint)")) {
    add("errors", templateDesktopDemosFile, 1, "Template desktop demo entry point must delegate to React template islands.");
  }

  const searchSlotStylesFile = path.join(docsAppDir, "styles/07-pattern-topbar-package-slots.css");
  const searchSlotStyles = read(searchSlotStylesFile);
  for (const forbidden of [
    ".pattern-design-shell-demo",
    ".pattern-stage--real-shell",
    ".pattern-topbar-action",
  ]) {
    if (searchSlotStyles.includes(forbidden)) {
      add("errors", searchSlotStylesFile, lineOf(searchSlotStyles, forbidden), `Search slot CSS must not target removed manual shell demos: ${forbidden}.`);
    }
  }
}

module.exports = { checkDocsShellBoundary };
