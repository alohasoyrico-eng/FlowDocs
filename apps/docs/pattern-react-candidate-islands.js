import React from "react";
import { ActionSheet } from "./generated/react/patterns/ActionSheet.js?v=1";
import { Autocomplete } from "./generated/react/patterns/Autocomplete.js?v=1";
import { AvatarMenu } from "./generated/react/patterns/AvatarMenu.js?v=1";
import { CommandPalette } from "./generated/react/patterns/CommandPalette.js?v=1";
import { ConfirmationDialog } from "./generated/react/patterns/ConfirmationDialog.js?v=1";
import { FormSection } from "./generated/react/patterns/FormSection.js?v=1";
import { MultiSelect } from "./generated/react/patterns/MultiSelect.js?v=1";
import { NotificationPanel } from "./generated/react/patterns/NotificationPanel.js?v=1";
import { Search } from "./generated/react/patterns/Search.js?v=1";
import { SelectOptionLayer } from "./generated/react/patterns/SelectOptionLayer.js?v=1";

export const candidatePatternReactComponents = {
  "action-sheet": ActionSheet,
  autocomplete: Autocomplete,
  "avatar-menu": AvatarMenu,
  "command-palette": CommandPalette,
  "confirmation-dialog": ConfirmationDialog,
  "form-section": FormSection,
  "multi-select": MultiSelect,
  "notification-panel": NotificationPanel,
  search: Search,
  "select-option-layer": SelectOptionLayer,
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

function AutocompleteIsland({ initialProps }) {
  const allSuggestions = initialProps.suggestions ?? [];
  const [query, setQuery] = React.useState(initialProps.value ?? "");
  const [selectedKey, setSelectedKey] = React.useState(initialProps.selectedKey ?? "");
  const [loading, setLoading] = React.useState(Boolean(initialProps.loading));
  const normalizedQuery = query.trim().toLowerCase();
  const filteredSuggestions = allSuggestions.filter((suggestion) => {
    const haystack = `${suggestion.label} ${suggestion.meta ?? ""} ${suggestion.keywords ?? ""}`.toLowerCase();
    return !normalizedQuery || haystack.includes(normalizedQuery);
  });
  const visibleSuggestions = normalizedQuery ? filteredSuggestions : allSuggestions.slice(0, 3);
  const resolvedState = loading
    ? "loading"
    : selectedKey
      ? "selected"
      : normalizedQuery && !filteredSuggestions.length
        ? "empty"
        : normalizedQuery
          ? "suggesting"
          : "idle";

  const queueLoadingPreview = (value) => {
    if (value.trim().length !== 1) return;
    setLoading(true);
    window.setTimeout(() => setLoading(false), 280);
  };

  return React.createElement(Autocomplete, {
    ...initialProps,
    value: query,
    selectedKey,
    loading,
    state: resolvedState,
    suggestions: loading ? [] : visibleSuggestions,
    "aria-busy": loading ? "true" : undefined,
    validation: selectedKey
      ? { label: "Selected entity", message: `${visibleSuggestions.find((suggestion) => suggestion.value === selectedKey || suggestion.key === selectedKey)?.label ?? "Entity"} selected.`, state: "success", live: true }
      : initialProps.validation,
    onValueChange: (value, meta, event) => {
      setQuery(value);
      setSelectedKey("");
      queueLoadingPreview(value);
      initialProps.onValueChange?.(value, meta, event);
    },
    onSuggestionSelect: (key, event) => {
      setSelectedKey(key);
      setQuery(allSuggestions.find((suggestion) => suggestion.value === key || suggestion.key === key)?.label ?? key);
      initialProps.onSuggestionSelect?.(key, event);
    },
  });
}

function AvatarMenuIsland({ initialProps }) {
  const [open, setOpen] = React.useState(Boolean(initialProps.open));
  const [state, setState] = React.useState(initialProps.state ?? "closed");
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const isSigningOut = state === "signing-out";
  return React.createElement(AvatarMenu, {
    ...initialProps,
    open,
    state: isSigningOut ? "signing-out" : open ? "open" : state,
    signingOut: isSigningOut,
    onOpenChange: (nextOpen, event) => {
      setOpen(Boolean(nextOpen));
      setState((current) => current === "signing-out" ? current : nextOpen ? "open" : "closed");
      initialProps.onOpenChange?.(nextOpen, event);
    },
    onSelect: (item, event) => {
      if (item?.key === "sign-out") {
        setOpen(false);
        setState("signing-out");
        window.setTimeout(() => setState("closed"), 600);
      } else {
        setSelectedLabel(item?.label ?? "");
        setOpen(false);
        setState("closed");
      }
      initialProps.onSelect?.(item, event);
    },
    "data-selected-action": selectedLabel || undefined,
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

function FormSectionIsland({ initialProps }) {
  const initialFields = initialProps.fields ?? [];
  const [fields, setFields] = React.useState(initialFields);
  const [state, setState] = React.useState(initialProps.state ?? "idle");
  const [feedback, setFeedback] = React.useState(initialProps.feedback);
  const [validation, setValidation] = React.useState(initialProps.validation);

  const updateFieldValue = (key, value) => {
    setFields((currentFields) => currentFields.map((field) => {
      if ((field.key ?? field.name ?? field.label) !== key) return field;
      return { ...field, value, error: undefined };
    }));
    setState("dirty");
    setFeedback(undefined);
    setValidation(undefined);
  };

  const saveSection = () => {
    const nameField = fields.find((field) => (field.key ?? field.name) === "name");
    if (!nameField?.value?.trim()) {
      setState("invalid");
      setValidation({ label: "Driver profile", message: "Driver name is required before saving.", state: "error", live: true });
      setFields((currentFields) => currentFields.map((field) => (field.key ?? field.name) === "name" ? { ...field, error: "Required" } : field));
      return;
    }
    setState("saving");
    window.setTimeout(() => {
      setState("saved");
      setFeedback({ label: "Driver profile saved", description: "Dispatch, compliance, and support can use the updated details.", tone: "success", state: "visible" });
    }, 350);
  };

  return React.createElement(FormSection, {
    ...initialProps,
    fields,
    state,
    feedback,
    validation,
    onFieldValueChange: (key, value, meta, event) => {
      updateFieldValue(key, value);
      initialProps.onFieldValueChange?.(key, value, meta, event);
    },
    onAction: (key, event) => {
      if (key === "save") saveSection();
      if (key === "reset") {
        setFields(initialFields);
        setState("idle");
        setFeedback(undefined);
        setValidation(initialProps.validation);
      }
      initialProps.onAction?.(key, event);
    },
  });
}

function MultiSelectIsland({ initialProps }) {
  const [open, setOpen] = React.useState(Boolean(initialProps.open));
  const [value, setValue] = React.useState(initialProps.value ?? []);
  const maxSelected = Number(initialProps.maxSelected ?? 2);
  const isInvalid = value.length > maxSelected;
  return React.createElement(MultiSelect, {
    ...initialProps,
    open,
    value,
    state: isInvalid ? "invalid" : open ? "open" : value.length ? "selected" : "closed",
    validation: isInvalid
      ? { label: "Filter limit", message: `Select no more than ${maxSelected} filters for this view.`, state: "warning", live: true }
      : value.length
        ? { label: "Selected filters", message: `${value.length} ${value.length === 1 ? "filter is" : "filters are"} active.`, state: "success", live: true }
        : initialProps.validation,
    onOpenChange: (nextOpen, event) => {
      setOpen(Boolean(nextOpen));
      initialProps.onOpenChange?.(nextOpen, event);
    },
    onValueChange: (nextValue, meta, event) => {
      setValue(nextValue);
      initialProps.onValueChange?.(nextValue, meta, event);
    },
    onRemove: (removedValue, event) => {
      setValue((current) => current.filter((item) => item !== removedValue));
      initialProps.onRemove?.(removedValue, event);
    },
    onClear: (event) => {
      setValue([]);
      initialProps.onClear?.(event);
    },
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

function SelectOptionLayerIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "standard");
  const [state, setState] = React.useState(initialProps.state ?? "closed");
  const [validation, setValidation] = React.useState(initialProps.validation);
  return React.createElement(SelectOptionLayer, {
    ...initialProps,
    value,
    state,
    validation,
    onOpenChange: (nextOpen, event) => {
      setState(nextOpen ? "open" : "closed");
      initialProps.onOpenChange?.(nextOpen, event);
    },
    onValueChange: (nextValue, meta, event) => {
      setValue(nextValue);
      setState("closed");
      setValidation({ label: "Selected policy", message: `${meta.label} selected.`, state: "success", live: true });
      initialProps.onValueChange?.(nextValue, meta, event);
    },
    onAction: (key, event) => {
      setState("permission-blocked");
      setValidation({ label: "International travel", message: "Finance approval is required before this option is available.", state: "warning", live: true });
      initialProps.onAction?.(key, event);
    },
  });
}

export const candidatePatternReactIslandWrappers = {
  "action-sheet": ActionSheetIsland,
  autocomplete: AutocompleteIsland,
  "avatar-menu": AvatarMenuIsland,
  "command-palette": CommandPaletteIsland,
  "confirmation-dialog": ConfirmationDialogIsland,
  "form-section": FormSectionIsland,
  "multi-select": MultiSelectIsland,
  "notification-panel": NotificationPanelIsland,
  search: SearchIsland,
  "select-option-layer": SelectOptionLayerIsland,
};
