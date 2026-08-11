import React from "react";
import { SectionHeader } from "./generated/react/patterns/SectionHeader.js?v=1";
import { Settings } from "./generated/react/patterns/Settings.js?v=1";
import { Sidebar } from "./generated/react/patterns/Sidebar.js?v=1";
import { Topbar } from "./generated/react/patterns/Topbar.js?v=1";

export const shellPatternReactComponents = {
  "section-header": SectionHeader,
  settings: Settings,
  sidebar: Sidebar,
  topbar: Topbar,
};

function SidebarIsland({ initialProps }) {
  const [collapsed, setCollapsed] = React.useState(Boolean(initialProps.collapsed));
  const [activeKey, setActiveKey] = React.useState(initialProps.activeKey ?? "overview");
  const [drawerOpen, setDrawerOpen] = React.useState(Boolean(initialProps.drawerOpen));
  return React.createElement(Sidebar, {
    ...initialProps,
    collapsed,
    activeKey,
    drawerOpen,
    onCollapse: (nextCollapsed, event) => {
      setCollapsed(Boolean(nextCollapsed));
      initialProps.onCollapse?.(nextCollapsed, event);
    },
    onDrawerOpenChange: (nextOpen, event) => {
      setDrawerOpen(Boolean(nextOpen));
      initialProps.onDrawerOpenChange?.(nextOpen, event);
    },
    onRouteSelect: (key, route, event) => {
      setActiveKey(key);
      initialProps.onRouteSelect?.(key, route, event);
    },
  });
}

function TopbarIsland({ initialProps }) {
  const [query, setQuery] = React.useState(initialProps.search?.query ?? "");
  const [drawerOpen, setDrawerOpen] = React.useState(Boolean(initialProps.sidebar?.drawerOpen));
  const [accountOpen, setAccountOpen] = React.useState(Boolean(initialProps.account?.open));
  return React.createElement(Topbar, {
    ...initialProps,
    search: initialProps.search ? {
      ...initialProps.search,
      query,
      onQueryChange: (value, meta, event) => {
        setQuery(value);
        initialProps.search?.onQueryChange?.(value, meta, event);
      },
    } : undefined,
    sidebar: initialProps.sidebar ? {
      ...initialProps.sidebar,
      drawerOpen,
      onDrawerOpenChange: (nextOpen, event) => {
        setDrawerOpen(Boolean(nextOpen));
        initialProps.sidebar?.onDrawerOpenChange?.(nextOpen, event);
      },
    } : undefined,
    account: initialProps.account ? {
      ...initialProps.account,
      open: accountOpen,
      onOpenChange: (nextOpen, event) => {
        setAccountOpen(Boolean(nextOpen));
        initialProps.account?.onOpenChange?.(nextOpen, event);
      },
    } : undefined,
    navigationAction: {
      ...(initialProps.navigationAction ?? {}),
      onClick: (event) => {
        setDrawerOpen((current) => !current);
        initialProps.navigationAction?.onClick?.(event);
      },
    },
  });
}

function SettingsIsland({ initialProps }) {
  const [dirty, setDirty] = React.useState(Boolean(initialProps.dirty));
  const [saving, setSaving] = React.useState(Boolean(initialProps.saving));
  const [feedback, setFeedback] = React.useState(initialProps.feedback);
  return React.createElement(Settings, {
    ...initialProps,
    dirty,
    saving,
    feedback,
    onControlChange: (key, value, meta, event) => {
      setDirty(true);
      setFeedback(undefined);
      initialProps.onControlChange?.(key, value, meta, event);
    },
    onSave: (event) => {
      setSaving(true);
      window.setTimeout(() => {
        setSaving(false);
        setDirty(false);
        setFeedback({ label: "Settings saved", description: "Workspace preferences are up to date.", tone: "success" });
      }, 350);
      initialProps.onSave?.(event);
    },
    onReset: (event) => {
      setDirty(false);
      setFeedback({ label: "Settings reset", description: "Preference controls returned to their saved values.", tone: "info" });
      initialProps.onReset?.(event);
    },
  });
}

export const shellPatternReactIslandWrappers = {
  settings: SettingsIsland,
  sidebar: SidebarIsland,
  topbar: TopbarIsland,
};
