import React from "react";
import { ActionSheet } from "./generated/react/patterns/ActionSheet.js?v=1";
import { CommandPalette } from "./generated/react/patterns/CommandPalette.js?v=1";
import { ConfirmationDialog } from "./generated/react/patterns/ConfirmationDialog.js?v=1";
import { NotificationPanel } from "./generated/react/patterns/NotificationPanel.js?v=1";
import { Search } from "./generated/react/patterns/Search.js?v=1";

export const candidatePatternReactComponents = {
  "action-sheet": ActionSheet,
  "command-palette": CommandPalette,
  "confirmation-dialog": ConfirmationDialog,
  "notification-panel": NotificationPanel,
  search: Search,
};

function ActionSheetIsland({ initialProps }) {
  const [open, setOpen] = React.useState(Boolean(initialProps.open));
  const [feedback, setFeedback] = React.useState(initialProps.feedback);
  return React.createElement(ActionSheet, {
    ...initialProps,
    open,
    feedback,
    onOpenChange: (nextOpen, event) => {
      setOpen(Boolean(nextOpen));
      initialProps.onOpenChange?.(nextOpen, event);
    },
    onAction: (key, event) => {
      setOpen(false);
      if (key !== "cancel") setFeedback({ label: "Action selected", description: "Vehicle action is ready.", tone: "success" });
      initialProps.onAction?.(key, event);
    },
    cancelAction: {
      ...(initialProps.cancelAction ?? { label: "Cancel" }),
      onClick: (event) => {
        setOpen(false);
        initialProps.cancelAction?.onClick?.(event);
      },
    },
  });
}

function ConfirmationDialogIsland({ initialProps }) {
  const [open, setOpen] = React.useState(Boolean(initialProps.open));
  const [feedback, setFeedback] = React.useState(initialProps.feedback);
  const [validation, setValidation] = React.useState(initialProps.validation);
  return React.createElement(ConfirmationDialog, {
    ...initialProps,
    open,
    validation,
    feedback,
    onOpenChange: (nextOpen, event) => {
      setOpen(Boolean(nextOpen));
      if (nextOpen) setValidation(initialProps.validation);
      initialProps.onOpenChange?.(nextOpen, event);
    },
    onConfirm: (event) => {
      setOpen(false);
      setFeedback({ label: "Card frozen", description: "JMX-214-B was frozen and logged.", tone: "success" });
      initialProps.onConfirm?.(event);
    },
    onCancel: (event) => {
      setOpen(false);
      initialProps.onCancel?.(event);
    },
  });
}

function CommandPaletteIsland({ initialProps }) {
  const allCommands = initialProps.commands ?? [
    { key: "fleet", label: "Open fleet dashboard", group: "Navigation", icon: "dashboard", shortcut: "G F", reason: "dashboard fleet overview" },
    { key: "freeze", label: "Freeze selected card", group: "Action", icon: "block", shortcut: "F", reason: "card security block" },
    { key: "support", label: "Contact support", group: "Help", icon: "support_agent", shortcut: "?", reason: "help support ticket" },
  ];
  const [open, setOpen] = React.useState(Boolean(initialProps.open));
  const [query, setQuery] = React.useState(initialProps.query ?? "");
  const [feedback, setFeedback] = React.useState(initialProps.feedback);
  const filtered = allCommands.filter((command) => !query || `${command.label} ${command.group ?? ""} ${command.reason ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  return React.createElement(CommandPalette, {
    ...initialProps,
    open,
    query,
    commands: filtered,
    feedback,
    onOpenChange: (nextOpen, event) => { setOpen(Boolean(nextOpen)); initialProps.onOpenChange?.(nextOpen, event); },
    onQueryChange: (value, meta, event) => { setQuery(value); initialProps.onQueryChange?.(value, meta, event); },
    onCommandSelect: (command, event) => {
      setFeedback({ label: "Command ready", description: `${command.label ?? "Command"} is ready to run.`, tone: "success" });
      initialProps.onCommandSelect?.(command, event);
    },
  });
}

function NotificationPanelIsland({ initialProps }) {
  const initialItems = initialProps.notifications ?? [{ key: "approval", label: "Approval pending", description: "Fleet ops - 2 min", unread: true }, { key: "sync", label: "Sync issue", description: "Cards service - 12 min", unread: true }, { key: "fuel", label: "Fuel alert", description: "Station 24 - Today", unread: true }];
  const [notifications, setNotifications] = React.useState(initialItems);
  const [open, setOpen] = React.useState(Boolean(initialProps.open));
  const [selectedKey, setSelectedKey] = React.useState(initialProps.selectedKey ?? "");
  const [feedback, setFeedback] = React.useState(initialProps.feedback);
  return React.createElement(NotificationPanel, {
    ...initialProps, open, notifications, selectedKey, feedback,
    onOpenChange: (nextOpen, event) => { setOpen(Boolean(nextOpen)); initialProps.onOpenChange?.(nextOpen, event); },
    onSelect: (key, event) => { setSelectedKey(key); setFeedback({ label: "Notification selected", description: "The alert is ready for review.", tone: "info" }); initialProps.onSelect?.(key, event); },
    onMarkAll: (event) => { setNotifications((items) => items.map((item) => ({ ...item, unread: false }))); setFeedback({ label: "Notifications updated", description: "All items were marked as read.", tone: "success" }); initialProps.onMarkAll?.(event); },
    onDismiss: (key, event) => { setNotifications((items) => items.filter((item) => item.key !== key)); initialProps.onDismiss?.(key, event); },
  });
}

function SearchIsland({ initialProps }) {
  const allResults = initialProps.results ?? [];
  const [query, setQuery] = React.useState(initialProps.query ?? "");
  const [scope, setScope] = React.useState(initialProps.scopeValue ?? "all");
  const [selectedKey, setSelectedKey] = React.useState(initialProps.selectedKey ?? "");
  const normalizedQuery = query.trim().toLowerCase();
  const isIdle = !normalizedQuery && scope === "all";
  const isInvalid = normalizedQuery.length === 1;
  const filtered = isInvalid
    ? []
    : allResults.filter((result) => {
      const resultScope = result.scope ?? result.key;
      const haystack = `${result.label} ${result.meta ?? ""} ${result.keywords ?? ""}`.toLowerCase();
      return (scope === "all" || resultScope === scope) && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  const visibleResults = isIdle ? allResults.slice(0, 3) : filtered;
  const selectedLabel = visibleResults.find((result) => result.key === selectedKey)?.label;
  const resolvedState = selectedKey ? "selected" : isInvalid ? "invalid" : isIdle ? "idle" : filtered.length ? "results" : "empty";

  return React.createElement(Search, {
    ...initialProps,
    query,
    scopeValue: scope,
    results: visibleResults,
    selectedKey,
    state: resolvedState,
    resultCount: isIdle ? allResults.length : filtered.length,
    validation: isInvalid
      ? { label: "Search query", message: "Type at least two characters to search.", state: "error", live: true }
      : selectedKey
        ? { label: "Selected result", message: `${selectedLabel ?? "Result"} selected.`, state: "success", live: true }
        : initialProps.validation,
    onQueryChange: (value, meta, event) => {
      setQuery(value);
      setSelectedKey("");
      initialProps.onQueryChange?.(value, meta, event);
    },
    onScopeChange: (value, meta, event) => {
      setScope(value);
      setSelectedKey("");
      initialProps.onScopeChange?.(value, meta, event);
    },
    onResultSelect: (key, event) => {
      setSelectedKey(key);
      initialProps.onResultSelect?.(key, event);
    },
    onClear: (event) => {
      setQuery("");
      setScope("all");
      setSelectedKey("");
      initialProps.onClear?.(event);
    },
  });
}

export const candidatePatternReactIslandWrappers = {
  "action-sheet": ActionSheetIsland,
  "command-palette": CommandPaletteIsland,
  "confirmation-dialog": ConfirmationDialogIsland,
  "notification-panel": NotificationPanelIsland,
  search: SearchIsland,
};
