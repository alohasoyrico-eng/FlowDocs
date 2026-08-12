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
  if (fs.existsSync(navigationFile)) {
    add("errors", navigationFile, 1, "Legacy navigation.js must not exist; docs shell navigation is owned by docs-shell-react.js and Flow React Topbar/Sidebar.");
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
}

module.exports = { checkDocsShellBoundary };
