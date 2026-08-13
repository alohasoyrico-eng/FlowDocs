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

const forbiddenShellSelectors = [
  "#menuButton",
  "#topbarSearch",
  "#topSearch",
  "#topSearchResults",
  "#gridToggle",
  "#themeToggle",
  "#languageToggle",
];

function lineOf(text, token) {
  const index = text.indexOf(token);
  return index === -1 ? 1 : text.slice(0, index).split("\n").length;
}

function checkNoObsoleteShellSelectors(file) {
  if (!fs.existsSync(file)) return;
  const text = read(file);
  for (const selector of forbiddenShellSelectors) {
    if (text.includes(selector)) {
      add("errors", file, lineOf(text, selector), `Docs shell must not reference obsolete shell selector ${selector}; use docs-shell-react.js and Flow React shell patterns.`);
    }
  }
}

function checkDocsShellBoundary() {
  const navigationFile = path.join(path.dirname(docsAppFile), "navigation.js");
  const docsAppDir = path.dirname(docsAppFile);
  const patternTabsFile = path.join(docsAppDir, "pattern-tabs.js");
  const patternFocusedDesignFile = path.join(docsAppDir, "pattern-focused-design.js");
  const patternShellReactDemosFile = path.join(docsAppDir, "pattern-shell-react-demos.js");
  const docsOnlySlotFiles = [
    "search-slot.js",
    "notification-panel-slot.js",
    "avatar-menu-slot.js",
    "styles/07-pattern-topbar-package-slots.css",
  ].map((file) => path.join(docsAppDir, file));
  const patternShellRenderersFile = path.join(docsAppDir, "pattern-shell-renderers.js");
  const templateDesktopDemosFile = path.join(docsAppDir, "template-desktop-demos.js");
  const docsStylesFile = path.join(docsAppDir, "styles.css");
  const forbiddenShellStyleFiles = [
    "styles/07-pattern-focused-demos.css",
    "styles/07-pattern-sidebar-slots.css",
    "styles/07-pattern-topbar-sections.css",
    "styles/07-pattern-sidebar-demo.css",
    "styles/07-pattern-foundations.css",
    "styles/07-pattern-motion.css",
    "styles/07-pattern-topbar.css",
    "styles/07-pattern-demo-responsive.css",
  ].map((file) => path.join(docsAppDir, file));
  const forbiddenDocsSelectors = [
    ".search-slot",
    ".pattern-command-demo,",
    ".pattern-command-demo__",
    ".pattern-notification-demo,",
    ".pattern-notification-demo__",
    ".pattern-notification-slot",
    ".pattern-avatar-menu-demo",
    ".pattern-confirmation-demo",
    ".pattern-action-sheet-demo",
    ".pattern-search-demo",
    ".pattern-autocomplete-demo",
  ];
  const responsiveShellStyleFiles = [
    "styles/06-responsive-01.css",
    "styles/06-responsive-02.css",
  ].map((file) => path.join(docsAppDir, file));
  if (fs.existsSync(navigationFile)) {
    add("errors", navigationFile, 1, "Obsolete navigation.js must not exist; docs shell navigation is owned by docs-shell-react.js and Flow React Topbar/Sidebar.");
  }
  if (fs.existsSync(patternShellRenderersFile)) {
    add("errors", patternShellRenderersFile, 1, "Manual shell renderers must not exist; templates and pattern pages must consume Flow React Topbar/Sidebar or template islands.");
  }
  for (const file of docsOnlySlotFiles) {
    if (fs.existsSync(file)) {
      add("errors", file, 1, "Docs-only slot helpers must not exist for Search, Notification Panel, or Avatar Menu; use Flow React patterns or pattern-package-demo.js for component snippets.");
    }
  }
  for (const file of forbiddenShellStyleFiles) {
    if (fs.existsSync(file)) {
      add("errors", file, 1, "Obsolete shell demo CSS must not exist without a Flow React owner.");
    }
  }

  const docsStyles = read(docsStylesFile);
  for (const forbiddenImport of [
    "07-pattern-focused-demos.css",
    "07-pattern-sidebar-slots.css",
    "07-pattern-topbar-sections.css",
    "07-pattern-topbar-package-slots.css",
    "07-pattern-sidebar-demo.css",
    "07-pattern-foundations.css",
    "07-pattern-motion.css",
    "07-pattern-topbar.css",
    "07-pattern-demo-responsive.css",
  ]) {
    if (docsStyles.includes(forbiddenImport)) {
      add("errors", docsStylesFile, lineOf(docsStyles, forbiddenImport), `Docs styles must not import obsolete shell demo CSS: ${forbiddenImport}.`);
    }
  }
  const styleFiles = [
    docsStylesFile,
    ...fs.readdirSync(path.join(docsAppDir, "styles"))
      .filter((file) => file.endsWith(".css"))
      .map((file) => path.join(docsAppDir, "styles", file)),
  ];
  for (const file of styleFiles) {
    const text = read(file);
    for (const selector of forbiddenDocsSelectors) {
      if (text.includes(selector)) {
        add("errors", file, lineOf(text, selector), `Docs CSS must not keep obsolete shell/pattern selector ${selector}; demos must consume Flow React boundaries.`);
      }
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
  if (index.includes('id="languageToggle"')) {
    add("errors", docsIndexFile, lineOf(index, 'id="languageToggle"'), "Docs shell must not keep a local language control; language is owned by the Flow Topbar action.");
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
    if (app.includes(forbidden)) add("errors", docsAppFile, lineOf(app, forbidden), `Docs app must not wire obsolete shell behavior: ${forbidden}.`);
  }

  const shell = read(docsShellReactFile);
  for (const required of [
    'from "./generated/react/patterns/Topbar.js',
    'from "./generated/react/patterns/Sidebar.js',
    '"data-doc-shell-consumer": "react-topbar"',
    '"data-doc-shell-consumer": "react-sidebar"',
    '"aria-expanded": String(navigationOpen)',
    '"aria-controls": "docsReactShellSidebar"',
    "drawer: false",
  ]) {
    if (!shell.includes(required)) add("errors", docsShellReactFile, 1, `Docs shell React boundary is missing Flow shell contract: ${required}.`);
  }
  for (const forbidden of [
    'drawer: { label: ui("shell.designNavigation")',
    'closeLabel: ui("shell.designNavigation")',
    '"aria-controls": "docs-shell-navigation"',
  ]) {
    if (shell.includes(forbidden)) {
      add("errors", docsShellReactFile, lineOf(shell, forbidden), `Docs shell must use the real sidebar mount and the topbar hamburger as the only mobile navigation control: ${forbidden}.`);
    }
  }

  for (const file of [docsIndexFile, docsChromeFile, docsLayoutFile, docsAppFile]) {
    checkNoObsoleteShellSelectors(file);
  }
  for (const file of responsiveShellStyleFiles) {
    const text = read(file);
    for (const forbidden of [
      ".sidebar {",
      'body[data-nav-open="true"] .sidebar {',
      ".sidebar a {",
    ]) {
      if (text.includes(forbidden)) {
        add("errors", file, lineOf(text, forbidden), `Responsive docs CSS must not target .sidebar globally because it overrides the Flow React Sidebar mount: ${forbidden}.`);
      }
    }
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
    "drawer: false",
  ]) {
    if (!reactPatternDemos.includes(required)) {
      add("errors", patternShellReactDemosFile, 1, `Shell pattern demos must consume generated Flow React patterns: ${required}.`);
    }
  }
  if (/patternReactDemo\("sidebar"[\s\S]*drawer:\s*\{/.test(reactPatternDemos)) {
    add("errors", patternShellReactDemosFile, lineOf(reactPatternDemos, 'patternReactDemo("sidebar"'), "Sidebar pattern demo must not mount a hidden Drawer; it must demonstrate the persistent Sidebar contract and leave responsive shell toggling to docs-shell-react.js.");
  }

  const generatedSidebar = read(path.join(docsAppDir, "generated/react/patterns/Sidebar.js"));
  const generatedTopbar = read(path.join(docsAppDir, "generated/react/patterns/Topbar.js"));
  const generatedDrawer = read(path.join(docsAppDir, "generated/react/Drawer.js"));
  for (const [file, text, required] of [
    [path.join(docsAppDir, "generated/react/patterns/Sidebar.js"), generatedSidebar, "const shouldRenderDrawer = drawer !== false"],
    [path.join(docsAppDir, "generated/react/patterns/Topbar.js"), generatedTopbar, "const shouldRenderDrawer = Boolean(sidebar) && sidebar?.drawer !== false"],
    [path.join(docsAppDir, "generated/react/patterns/Topbar.js"), generatedTopbar, '"aria-expanded": navigationAction?.["aria-expanded"]'],
    [path.join(docsAppDir, "generated/react/patterns/Topbar.js"), generatedTopbar, '"aria-controls": navigationAction?.["aria-controls"]'],
    [path.join(docsAppDir, "generated/react/patterns/Sidebar.js"), generatedSidebar, "showCloseButton: drawer?.showCloseButton ?? false"],
    [path.join(docsAppDir, "generated/react/patterns/Topbar.js"), generatedTopbar, "showCloseButton: sidebarDrawer?.showCloseButton ?? false"],
    [path.join(docsAppDir, "generated/react/Drawer.js"), generatedDrawer, "showCloseButton = true"],
    [path.join(docsAppDir, "generated/react/Drawer.js"), generatedDrawer, "showCloseButton && closeLabel"],
  ]) {
    if (!text.includes(required)) {
      add("errors", file, 1, `Generated Flow shell bridge must preserve governed drawer behavior: ${required}.`);
    }
  }
  for (const [file, text, forbidden] of [
    [path.join(docsAppDir, "generated/react/patterns/Sidebar.js"), generatedSidebar, "showCloseButton: drawer?.showCloseButton ?? true"],
    [path.join(docsAppDir, "generated/react/patterns/Topbar.js"), generatedTopbar, "showCloseButton: sidebarDrawer?.showCloseButton ?? true"],
  ]) {
    if (text.includes(forbidden)) {
      add("errors", file, lineOf(text, forbidden), `Generated Flow shell bridge must not reintroduce a parallel drawer close control: ${forbidden}.`);
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
}

module.exports = { checkDocsShellBoundary };
