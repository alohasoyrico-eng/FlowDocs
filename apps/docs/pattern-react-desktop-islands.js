import React from "react";
import { AdvancedFilters } from "./generated/react/patterns/AdvancedFilters.js?v=1";
import { BulkActions } from "./generated/react/patterns/BulkActions.js?v=1";
import { ChartWrapper } from "./generated/react/patterns/ChartWrapper.js?v=1";
import { ColumnConfigurator } from "./generated/react/patterns/ColumnConfigurator.js?v=1";
import { KpiCard } from "./generated/react/patterns/KpiCard.js?v=1";
import { RolesAndPermissions } from "./generated/react/patterns/RolesAndPermissions.js?v=1";
import { VirtualDataTable } from "./generated/react/patterns/VirtualDataTable.js?v=1";

export const desktopPatternReactComponents = {
  "advanced-filters": AdvancedFilters,
  "bulk-actions": BulkActions,
  "chart-wrapper": ChartWrapper,
  "column-configurator": ColumnConfigurator,
  "kpi-card": KpiCard,
  "roles-and-permissions": RolesAndPermissions,
  "virtual-data-table": VirtualDataTable,
};

function VirtualDataTableIsland({ initialProps }) {
  const [sortKey, setSortKey] = React.useState(initialProps.sortKey ?? "plate");
  const [sortDir, setSortDir] = React.useState(initialProps.sortDir ?? "ascending");
  const [selectedKeys, setSelectedKeys] = React.useState(initialProps.selectedKeys ?? []);
  const [page, setPage] = React.useState(initialProps.page ?? 1);
  return React.createElement(VirtualDataTable, {
    ...initialProps,
    selectedKeys,
    sortKey,
    sortDir,
    page,
    state: selectedKeys.length ? "selected" : initialProps.state,
    onSortChange: (sort, event) => {
      setSortKey(sort.key);
      setSortDir(sort.direction);
      initialProps.onSortChange?.(sort, event);
    },
    onRowSelect: (key, event) => {
      setSelectedKeys((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
      initialProps.onRowSelect?.(key, event);
    },
    onPageChange: (nextPage, event) => {
      setPage(nextPage);
      initialProps.onPageChange?.(nextPage, event);
    },
  });
}

function AdvancedFiltersIsland({ initialProps }) {
  const [open, setOpen] = React.useState(Boolean(initialProps.open));
  const [dirty, setDirty] = React.useState(Boolean(initialProps.dirty));
  const [applying, setApplying] = React.useState(false);
  return React.createElement(AdvancedFilters, {
    ...initialProps,
    open,
    dirty,
    applying,
    state: applying ? "applying" : dirty ? "dirty" : open ? "open" : "closed",
    applyAction: { ...(initialProps.applyAction ?? {}), loading: applying },
    drawer: initialProps.drawer ? { ...initialProps.drawer, open, onOpenChange: setOpen } : undefined,
    onOpenChange: (nextOpen, event) => {
      setOpen(Boolean(nextOpen));
      initialProps.onOpenChange?.(nextOpen, event);
    },
    onFieldChange: (key, value, meta, event) => {
      setDirty(true);
      initialProps.onFieldChange?.(key, value, meta, event);
    },
    onAction: (key, event) => {
      if (key === "apply") {
        setApplying(true);
        window.setTimeout(() => {
          setApplying(false);
          setDirty(false);
        }, 350);
      }
      if (key === "reset") setDirty(false);
      initialProps.onAction?.(key, event);
    },
  });
}

function ColumnConfiguratorIsland({ initialProps }) {
  const [open, setOpen] = React.useState(Boolean(initialProps.open));
  const [visibleKeys, setVisibleKeys] = React.useState(initialProps.visibleKeys ?? []);
  const [saving, setSaving] = React.useState(false);
  return React.createElement(ColumnConfigurator, {
    ...initialProps,
    open,
    saving,
    visibleKeys,
    state: saving ? "saving" : "dirty",
    onOpenChange: (nextOpen, event) => {
      setOpen(Boolean(nextOpen));
      initialProps.onOpenChange?.(nextOpen, event);
    },
    onColumnVisibilityChange: (key, checked, meta, event) => {
      setVisibleKeys((current) => checked ? [...new Set([...current, key])] : current.filter((item) => item !== key));
      initialProps.onColumnVisibilityChange?.(key, checked, meta, event);
    },
    onAction: (key, event) => {
      if (key === "apply") {
        setSaving(true);
        window.setTimeout(() => setSaving(false), 350);
      }
      if (key === "reset") setVisibleKeys(initialProps.defaultVisibleKeys ?? ["plate", "driver", "status", "spend"]);
      initialProps.onAction?.(key, event);
    },
  });
}

function RolesAndPermissionsIsland({ initialProps }) {
  const [values, setValues] = React.useState(initialProps.values ?? {});
  const [saving, setSaving] = React.useState(false);
  return React.createElement(RolesAndPermissions, {
    ...initialProps,
    values,
    saving,
    state: saving ? "saving" : "dirty",
    actions: (initialProps.actions ?? []).map((action) => ({ ...action, loading: action.key === "save" && saving })),
    onPermissionChange: (roleKey, permissionKey, checked, meta, event) => {
      setValues((current) => ({ ...current, [roleKey]: { ...(current[roleKey] ?? {}), [permissionKey]: checked } }));
      initialProps.onPermissionChange?.(roleKey, permissionKey, checked, meta, event);
    },
    onAction: (key, event) => {
      if (key === "save") {
        setSaving(true);
        window.setTimeout(() => setSaving(false), 350);
      }
      initialProps.onAction?.(key, event);
    },
  });
}

function BulkActionsIsland({ initialProps }) {
  const [running, setRunning] = React.useState(false);
  return React.createElement(BulkActions, {
    ...initialProps,
    state: running ? "running" : initialProps.state,
    progress: running ? { label: "Applying bulk action", value: 64 } : initialProps.progress,
    actions: (initialProps.actions ?? []).map((action) => ({
      ...action,
      loading: running && action.key === "review",
      onClick: (event) => {
        setRunning(true);
        window.setTimeout(() => setRunning(false), 450);
        action.onClick?.(event);
      },
    })),
  });
}

export const desktopPatternReactIslandWrappers = {
  "advanced-filters": AdvancedFiltersIsland,
  "bulk-actions": BulkActionsIsland,
  "column-configurator": ColumnConfiguratorIsland,
  "roles-and-permissions": RolesAndPermissionsIsland,
  "virtual-data-table": VirtualDataTableIsland,
};
