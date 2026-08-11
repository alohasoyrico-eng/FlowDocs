import React from "react";
import { Toolbar } from "./generated/react/patterns/Toolbar.js?v=1";

export function ToolbarIsland({ initialProps }) {
  const [query, setQuery] = React.useState(initialProps.search?.input?.value ?? initialProps.search?.query ?? "");
  const [filters, setFilters] = React.useState(initialProps.filters ?? []);
  const [overflowOpen, setOverflowOpen] = React.useState(Boolean(initialProps.overflow?.open));
  const [feedback, setFeedback] = React.useState(initialProps.feedback);
  const [loadingAction, setLoadingAction] = React.useState("");
  const activeFilterCount = filters.length;
  const resolvedState = loadingAction ? "loading" : overflowOpen ? "overflow" : activeFilterCount ? "filter-active" : query ? "dense" : initialProps.state;

  const runAction = (key) => {
    setLoadingAction(key);
    setFeedback(undefined);
    window.setTimeout(() => {
      setLoadingAction("");
      setFeedback({
        label: key === "export" ? "Export started" : "Toolbar action queued",
        description: key === "export" ? "Vehicle export is being prepared." : "The local action is ready for the table.",
        tone: "success",
        state: "visible",
      });
    }, 320);
  };

  return React.createElement(Toolbar, {
    ...initialProps,
    state: resolvedState,
    search: {
      ...(initialProps.search ?? {}),
      query,
      input: {
        ...(initialProps.search?.input ?? {}),
        value: query,
        onValueChange: (value, meta, event) => {
          setQuery(value);
          setFeedback(undefined);
          initialProps.search?.input?.onValueChange?.(value, meta, event);
        },
      },
      delegate: initialProps.search?.delegate
        ? {
          ...initialProps.search.delegate,
          query,
          results: query ? initialProps.search.delegate.results : [],
        }
        : undefined,
    },
    filters: filters.map((filter) => ({
      ...filter,
      onRemove: (event) => {
        setFilters((currentFilters) => currentFilters.filter((item) => (item.key ?? item.label) !== (filter.key ?? filter.label)));
        setFeedback({ label: "Filter removed", description: `${filter.label} was removed from this toolbar.`, tone: "info", state: "visible" });
        filter.onRemove?.(event);
      },
    })),
    badges: activeFilterCount
      ? [{ key: "filters", label: `${activeFilterCount} ${activeFilterCount === 1 ? "filter" : "filters"}`, tone: "info", variant: "standard", live: true }]
      : initialProps.badges,
    actions: (initialProps.actions ?? []).map((action) => ({
      ...action,
      loading: loadingAction === (action.key ?? action.label),
      onClick: (event) => {
        action.onClick?.(event);
        if (event.defaultPrevented) return;
        runAction(action.key ?? action.label);
      },
    })),
    overflow: initialProps.overflow
      ? {
        ...initialProps.overflow,
        open: overflowOpen,
        onOpenChange: (nextOpen, event) => {
          setOverflowOpen(Boolean(nextOpen));
          initialProps.overflow?.onOpenChange?.(nextOpen, event);
        },
        onSelect: (item, event) => {
          setOverflowOpen(false);
          setFeedback({ label: "Toolbar menu action", description: `${item.label} selected.`, tone: "success", state: "visible" });
          initialProps.overflow?.onSelect?.(item, event);
        },
      }
      : undefined,
    feedback,
  });
}
