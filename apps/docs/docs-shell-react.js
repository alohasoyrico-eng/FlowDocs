import React from "react";
import { createRoot } from "react-dom/client";
import { DocsShellTemplate } from "./generated/react/templates/DocsShellTemplate.js?v=2";

let currentLocale = () => "en";
let render = () => {};
let setCurrentLocale = () => {};
let ui = (key) => key;
let collections = {};
let collectionIcon = () => "circle";
let iconFor = () => ({ icon: "circle" });
let label = (key) => key;
let searchIndex = () => [];
let toggleContrastState = () => false;
let toggleGridOverlay = () => false;

let shellRoot;
let lastPageMarkup = "";
let lastAfterRender = () => {};
let lastCurrentRoute = {};
const state = {
  searchQuery: "",
  searchOpen: false,
};

export function configureDocsShell(nextDeps) {
  currentLocale = nextDeps.currentLocale;
  render = nextDeps.render;
  setCurrentLocale = nextDeps.setCurrentLocale;
  ui = nextDeps.ui;
  collections = nextDeps.collections;
  collectionIcon = nextDeps.collectionIcon;
  iconFor = nextDeps.iconFor;
  label = nextDeps.label;
  searchIndex = nextDeps.searchIndex;
  toggleContrastState = nextDeps.toggleContrastState;
  toggleGridOverlay = nextDeps.toggleGridOverlay;
}

export function renderDocsShell(current, options = {}) {
  const mount = document.querySelector("#app");
  if (!mount) return;
  lastCurrentRoute = current;
  if (typeof options.pageMarkup === "string") lastPageMarkup = options.pageMarkup;
  if (typeof options.afterRender === "function") lastAfterRender = options.afterRender;
  if (mount.nodeType !== 1) {
    mount.innerHTML = lastPageMarkup;
    lastAfterRender(mount);
    return;
  }
  ensureSearchKeyboard();
  shellRoot ||= createRoot(mount);
  shellRoot.render(React.createElement(DocsShellTemplate, docsShellProps(current), React.createElement(DocsPageSlot, {
    markup: lastPageMarkup,
    onRendered: lastAfterRender,
  })));
}

function topbarProps(current) {
  const contrastEnabled = document.body.dataset.contrast === "quiet";
  const gridVisible = !document.querySelector("#docsGridOverlay")?.hidden;
  const results = searchResults(state.searchQuery);
  const resultItems = results.map(({ href, ...item }) => item);
  const navigationOpen = document.body.dataset.navOpen === "true";
  return {
    label: ui("shell.primaryNavigation"),
    density: "md",
    className: "docs-react-shell-topbar",
    navigationAction: {
      label: navigationOpen ? ui("shell.closeNavigation") : ui("shell.openNavigation"),
      ariaLabel: navigationOpen ? ui("shell.closeNavigation") : ui("shell.openNavigation"),
      icon: "menu",
      "aria-expanded": String(navigationOpen),
      "aria-controls": "docs-shell-sidebar-nav",
      "data-doc-shell-slot": "navigation-action",
      onClick: () => toggleNavigation(),
    },
    search: {
      label: ui("shell.searchLabel"),
      triggerLabel: ui("shell.searchLabel"),
      placeholder: ui("shell.searchPlaceholder"),
      query: state.searchQuery,
      active: state.searchOpen,
      "data-doc-shell-slot": "search-field",
      onQueryChange: (value) => {
        state.searchQuery = value;
        state.searchOpen = Boolean(value);
        renderDocsShell(current);
      },
      results: state.searchOpen ? resultItems : [],
      resultsLabel: ui("shell.searchResults"),
      resultsClassName: "docs-react-shell-search-results",
      empty: state.searchOpen
        ? {
          title: ui("shell.noSearchResults"),
          description: ui("shell.searchPlaceholder"),
          icon: "search_off",
        }
        : undefined,
      onResultSelect: (key) => {
        const match = results.find((result) => result.key === key);
        if (!match?.href) return;
        state.searchQuery = "";
        state.searchOpen = false;
        window.location.hash = match.href.replace(/^#/, "");
        renderDocsShell(current);
      },
    },
    actions: [
      {
        key: "language",
        label: ui("shell.languageToggle"),
        ariaLabel: ui("shell.languageToggle"),
        icon: "language",
        className: "docs-react-shell-topbar__action",
        "data-doc-shell-action": "language",
        onClick: () => {
          setCurrentLocale(currentLocale() === "en" ? "es" : "en");
          render();
        },
      },
      {
        key: "grid",
        label: gridVisible ? ui("shell.hideGrid") : ui("shell.showGrid"),
        ariaLabel: gridVisible ? ui("shell.hideGrid") : ui("shell.showGrid"),
        icon: gridVisible ? "grid_on" : "grid_off",
        selected: gridVisible,
        className: "docs-react-shell-topbar__action",
        "data-doc-shell-action": "grid",
        onClick: () => {
          toggleGridOverlay();
          renderDocsShell(current);
        },
      },
      {
        key: "theme",
        label: ui("shell.toggleContrast"),
        ariaLabel: ui("shell.toggleContrast"),
        icon: "contrast",
        selected: contrastEnabled,
        className: "docs-react-shell-topbar__action",
        "data-doc-shell-action": "contrast",
        onClick: () => {
          toggleContrastState();
          renderDocsShell(current);
        },
      },
    ],
    "data-doc-shell-consumer": "react-topbar",
  };
}

function sidebarProps(current) {
  const navigationOpen = document.body.dataset.navOpen === "true";
  return {
    label: ui("shell.designNavigation"),
    density: "md",
    className: "docs-react-shell-sidebar-mount",
    id: "docs-shell-sidebar-nav",
    activeKey: activeRouteKey(current),
    groups: sidebarGroups(current),
    drawer: false,
    drawerOpen: navigationOpen,
    mobileDrawer: navigationOpen,
    onRouteSelect: (key, route) => {
      if (!route?.href) return;
      window.location.hash = route.href.replace(/^#/, "");
      closeNavigation();
    },
    "data-doc-shell-consumer": "react-sidebar",
  };
}

let searchKeyboardBound = false;

function ensureSearchKeyboard() {
  if (searchKeyboardBound) return;
  searchKeyboardBound = true;
  document.addEventListener("keydown", (event) => {
    if (!state.searchOpen) return;
    const active = document.activeElement;
    const searchInput = document.querySelector(".docs-react-shell-topbar [data-doc-shell-slot=\"search-field\"] input");
    const resultButtons = [...document.querySelectorAll(".docs-react-shell-topbar [data-flow-slot=\"search-results\"] [data-key]")];
    const isSearchInput = active === searchInput;
    const activeResultIndex = resultButtons.indexOf(active);
    const isResult = activeResultIndex >= 0;
    if (!isSearchInput && !isResult) return;
    if (event.key === "Escape") {
      state.searchQuery = "";
      state.searchOpen = false;
      event.preventDefault();
      renderDocsShell(lastCurrentRoute);
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    if (!resultButtons.length) return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = isSearchInput
      ? direction > 0 ? 0 : resultButtons.length - 1
      : (activeResultIndex + direction + resultButtons.length) % resultButtons.length;
    resultButtons[nextIndex]?.focus();
  });
}

function docsShellProps(current) {
  const navigationOpen = document.body.dataset.navOpen === "true";
  const contrastEnabled = document.body.dataset.contrast === "quiet";
  return {
    label: ui("shell.primaryNavigation"),
    density: "md",
    theme: contrastEnabled ? "dark" : "light",
    state: state.searchOpen ? "search-open" : navigationOpen ? "sidebar-open" : "desktop",
    mobile: window.matchMedia?.("(max-width: 991px)")?.matches ?? false,
    sidebarOpen: navigationOpen,
    brand: React.createElement("a", {
      className: "brand",
      href: "#/home",
      "aria-label": ui("shell.home"),
    }, React.createElement("img", {
      src: "./assets/logo.svg",
      "data-quiet-src": "./assets/logo-dark.svg",
      alt: "Design System",
    })),
    topbar: topbarProps(current),
    sidebar: sidebarProps(current),
    pageLabel: label(current.collection ?? "home"),
    skipLinkLabel: ui("shell.skipToContent"),
    className: "docs-react-shell-template",
    contentClassName: "docs-react-shell-page",
    "data-doc-shell-consumer": "docs-shell-template",
  };
}

function DocsPageSlot({ markup, onRendered }) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== markup) ref.current.innerHTML = markup;
    onRendered?.(ref.current);
  }, [markup, onRendered]);
  return React.createElement("div", {
    ref,
    className: "content-shell density-responsive",
    "data-flow-slot": "page-content",
    "data-doc-shell-page-mount": "",
  });
}

function sidebarGroups(current) {
  const groups = Object.entries(collections).map(([key, values]) => ({
    key,
    title: label(key),
    icon: collectionIcon(key),
    badge: String(values.length),
    open: current.collection === key || key === "patterns",
    routes: values.map((item) => ({
      key: `${key}:${item.id}`,
      label: item.title,
      icon: iconName(iconFor(item)),
      href: `#/${key}/${item.id}`,
      active: current.collection === key && current.id === item.id,
    })),
  }));
  groups.push({
    key: "stack",
    title: ui("shell.stack"),
    icon: collectionIcon("stack"),
    open: current.collection === "stack",
    routes: [{ key: "stack", label: ui("shell.stack"), icon: collectionIcon("stack"), href: "#/stack", active: current.collection === "stack" }],
  });
  return groups;
}

function searchResults(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return searchIndex()
    .filter((entry) => `${entry.title} ${entry.summary} ${entry.platform} ${entry.category ?? ""}`.toLowerCase().includes(normalized))
    .slice(0, 12)
    .map((entry) => ({
      key: `${entry.collection}:${entry.id}`,
      label: entry.title,
      meta: `${label(entry.collection)} - ${entry.platform ?? entry.category}`,
      href: entry.collection === "stack" ? "#/stack" : `#/${entry.collection}/${entry.id}`,
      icon: collectionIcon(entry.collection),
    }));
}

function activeRouteKey(current) {
  if (current.collection === "stack") return "stack";
  return current.id ? `${current.collection}:${current.id}` : "";
}

function iconName(value) {
  if (typeof value === "string") return value;
  return value?.icon ?? value?.name ?? "circle";
}

function toggleNavigation() {
  const isOpen = document.body.dataset.navOpen === "true";
  if (isOpen) closeNavigation();
  else document.body.dataset.navOpen = "true";
  renderDocsShell(route());
}

function closeNavigation() {
  delete document.body.dataset.navOpen;
  renderDocsShell(route());
}

function route() {
  const hash = window.location.hash || "#/home";
  const [collection, id] = hash.replace("#/", "").split("/");
  return { collection: collection || "home", id };
}
