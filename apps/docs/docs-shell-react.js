import React from "react";
import { createRoot } from "react-dom/client";
import { Sidebar } from "./generated/react/patterns/Sidebar.js?v=2";
import { Topbar } from "./generated/react/patterns/Topbar.js?v=1";

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

let topbarRoot;
const sidebarRoots = new WeakMap();
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

export function renderDocsShell(current) {
  renderDocsTopbar(current);
  renderDocsSidebar(current);
}

function renderDocsTopbar(current) {
  const mount = document.querySelector("#docsReactShellTopbar");
  if (!mount) return;
  topbarRoot ||= createRoot(mount);
  topbarRoot.render(React.createElement(Topbar, topbarProps(current)));
}

function renderDocsSidebar(current) {
  const mount = document.querySelector("#docsReactShellSidebar");
  if (!mount) return;
  const root = sidebarRoots.get(mount) ?? createRoot(mount);
  sidebarRoots.set(mount, root);
  root.render(React.createElement(Sidebar, sidebarProps(current)));
}

function topbarProps(current) {
  const contrastEnabled = document.body.dataset.contrast === "quiet";
  const gridVisible = !document.querySelector("#layoutGridOverlay")?.hidden;
  const results = searchResults(state.searchQuery);
  return {
    label: ui("shell.primaryNavigation"),
    density: "md",
    className: "docs-react-shell-topbar",
    navigationAction: {
      label: ui("shell.openNavigation"),
      ariaLabel: ui("shell.openNavigation"),
      icon: document.body.dataset.navOpen === "true" ? "close" : "menu",
      onClick: () => toggleNavigation(),
    },
    search: {
      label: ui("shell.searchLabel"),
      triggerLabel: ui("shell.searchLabel"),
      placeholder: ui("shell.searchPlaceholder"),
      query: state.searchQuery,
      active: state.searchOpen,
      onQueryChange: (value) => {
        state.searchQuery = value;
        state.searchOpen = Boolean(value);
        renderDocsTopbar(current);
      },
      delegate: state.searchOpen
        ? {
          label: ui("shell.searchResults"),
          className: "docs-react-shell-search-results",
          query: state.searchQuery,
          results,
          empty: {
            title: ui("shell.noSearchResults"),
            description: ui("shell.searchPlaceholder"),
          },
          onResultSelect: (key) => {
            const match = results.find((result) => result.key === key);
            if (!match?.href) return;
            state.searchQuery = "";
            state.searchOpen = false;
            window.location.hash = match.href.replace(/^#/, "");
            renderDocsTopbar(current);
          },
        }
        : undefined,
    },
    actions: [
      {
        key: "language",
        label: ui("shell.languageToggle"),
        ariaLabel: ui("shell.languageToggle"),
        icon: "language",
        className: "docs-react-shell-topbar__action",
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
        onClick: () => {
          toggleGridOverlay();
          renderDocsTopbar(current);
        },
      },
      {
        key: "theme",
        label: ui("shell.toggleContrast"),
        ariaLabel: ui("shell.toggleContrast"),
        icon: "contrast",
        selected: contrastEnabled,
        className: "docs-react-shell-topbar__action",
        onClick: () => {
          toggleContrastState();
          renderDocsTopbar(current);
        },
      },
    ],
    "data-doc-shell-consumer": "react-topbar",
  };
}

function sidebarProps(current) {
  return {
    label: ui("shell.designNavigation"),
    density: "md",
    activeKey: activeRouteKey(current),
    groups: sidebarGroups(current),
    collapseAction: { label: ui("shell.designNavigation"), ariaLabel: ui("shell.designNavigation") },
    drawer: { label: ui("shell.designNavigation"), side: "left" },
    onRouteSelect: (key, route) => {
      if (!route?.href) return;
      window.location.hash = route.href.replace(/^#/, "");
      closeNavigation();
    },
    "data-doc-shell-consumer": "react-sidebar",
  };
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
  renderDocsTopbar(route());
}

function closeNavigation() {
  delete document.body.dataset.navOpen;
  renderDocsTopbar(route());
}

function route() {
  const hash = window.location.hash || "#/home";
  const [collection, id] = hash.replace("#/", "").split("/");
  return { collection: collection || "home", id };
}
