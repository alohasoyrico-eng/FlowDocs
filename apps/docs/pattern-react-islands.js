import React from "react";
import { ActionSheet } from "./generated/react/patterns/ActionSheet.js?v=1";
import { AuthenticationLoginBiometricsAndOtp } from "./generated/react/patterns/AuthenticationLoginBiometricsAndOtp.js?v=1";
import { AvatarGroup } from "./generated/react/patterns/AvatarGroup.js?v=1";
import { CalendarView } from "./generated/react/patterns/CalendarView.js?v=1";
import { ChartLegendItem } from "./generated/react/patterns/ChartLegendItem.js?v=1";
import { CheckboxGroup } from "./generated/react/patterns/CheckboxGroup.js?v=1";
import { DragSortableList } from "./generated/react/patterns/DragSortableList.js?v=1";
import { GanttChart } from "./generated/react/patterns/GanttChart.js?v=1";
import { PolarChart } from "./generated/react/patterns/PolarChart.js?v=1";
import { PreferenceManagement } from "./generated/react/patterns/PreferenceManagement.js?v=1";
import { PullToRefresh } from "./generated/react/patterns/PullToRefresh.js?v=1";
import { RadioGroup } from "./generated/react/patterns/RadioGroup.js?v=1";
import { SnackbarProvider } from "./generated/react/patterns/SnackbarProvider.js?v=1";
import { Timeline } from "./generated/react/patterns/Timeline.js?v=1";
import { TransferList } from "./generated/react/patterns/TransferList.js?v=1";
import { WaterfallChart } from "./generated/react/patterns/WaterfallChart.js?v=1";

export const patternReactComponents = {
  "action-sheet": ActionSheet,
  "authentication-login-biometrics-and-otp": AuthenticationLoginBiometricsAndOtp,
  "avatar-group": AvatarGroup,
  "calendar-view": CalendarView,
  "chart-legend-item": ChartLegendItem,
  "checkbox-group": CheckboxGroup,
  "drag-sortable-list": DragSortableList,
  "gantt-chart": GanttChart,
  "polar-chart": PolarChart,
  "preference-management": PreferenceManagement,
  "pull-to-refresh": PullToRefresh,
  "radio-group": RadioGroup,
  "snackbar-provider": SnackbarProvider,
  timeline: Timeline,
  "transfer-list": TransferList,
  "waterfall-chart": WaterfallChart,
};

function AuthenticationLoginBiometricsAndOtpIsland({ initialProps }) {
  const [state, setState] = React.useState(initialProps.state ?? "idle");
  const primaryLabel = state === "otp-sent" ? "Verify code" : state === "biometric-prompt" ? "Confirm biometric" : "Send OTP";
  return React.createElement(AuthenticationLoginBiometricsAndOtp, {
    ...initialProps,
    state,
    otp: state === "otp-sent" ? { value: "184290", helper: "Code expires in 00:42." } : initialProps.otp,
    biometric: state === "biometric-prompt" ? { label: "Confirm it is you", description: "Use device biometrics or continue with OTP.", actionLabel: "Confirm biometric", fallback: "Use OTP instead" } : initialProps.biometric,
    validation: state === "recovered" ? { label: "Authentication status", message: "Sign-in verified.", state: "success" } : initialProps.validation,
    feedback: state === "recovered" ? { label: "Sign-in verified", description: "The session can continue.", tone: "success" } : initialProps.feedback,
    primaryAction: { ...(initialProps.primaryAction ?? {}), label: primaryLabel, icon: state === "recovered" ? "check_circle" : "verified_user" },
    secondaryAction: state === "idle"
      ? { label: "Use biometric", variant: "secondary", icon: "fingerprint", onClick: () => setState("biometric-prompt") }
      : { label: "Reset", variant: "secondary", icon: "refresh", onClick: () => setState("idle") },
    onSubmit: () => setState((current) => current === "idle" ? "otp-sent" : "recovered"),
  });
}

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

function ChartLegendItemIsland({ initialProps }) {
  const [hidden, setHidden] = React.useState(Boolean(initialProps.hidden));
  return React.createElement(ChartLegendItem, {
    ...initialProps,
    hidden,
    selected: !hidden && Boolean(initialProps.selected ?? true),
    onToggle: (checked, meta, event) => {
      setHidden(!checked);
      initialProps.onToggle?.(checked, meta, event);
    },
  });
}

function CheckboxGroupIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? initialProps.defaultValue ?? []);
  return React.createElement(CheckboxGroup, { ...initialProps, value, onValueChange: setValue, onClear: () => setValue([]) });
}

function RadioGroupIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? initialProps.defaultValue ?? "");
  return React.createElement(RadioGroup, { ...initialProps, value, onValueChange: setValue, onClear: () => setValue("") });
}

function SnackbarProviderIsland({ initialProps }) {
  const presets = initialProps.presets ?? [
    { key: "save", label: "View saved", description: "This dashboard view is available to your team.", tone: "success", actionLabel: "Undo" },
    { key: "retry", label: "Retry queued", description: "Sync will retry without blocking the task.", tone: "warning", actionLabel: "View" },
    { key: "export", label: "Export ready", description: "The report can be downloaded from activity.", tone: "info" },
  ];
  const [messages, setMessages] = React.useState(initialProps.messages ?? []);
  return React.createElement(SnackbarProvider, {
    ...initialProps,
    messages,
    action: initialProps.action ?? { label: "Queue feedback", icon: "add_alert" },
    onQueueAction: () => setMessages((current) => [...current, { ...presets[current.length % presets.length], key: `${presets[current.length % presets.length].key}-${current.length}` }]),
    onMessageDismiss: (key) => setMessages((current) => current.filter((message) => message.key !== key)),
  });
}

function PullToRefreshIsland({ initialProps }) {
  const [state, setState] = React.useState(initialProps.state ?? "idle");
  const progress = state === "complete" ? 100 : state === "refreshing" ? 72 : 0;
  return React.createElement(PullToRefresh, {
    ...initialProps,
    state,
    progress,
    refreshing: state === "refreshing",
    complete: state === "complete",
    feedback: state === "complete" ? { label: "Feed refreshed", description: "Latest movements are now visible.", tone: "success" } : initialProps.feedback,
    onRefresh: () => {
      setState("refreshing");
      window.setTimeout(() => setState("complete"), 350);
    },
  });
}

function TimelineIsland({ initialProps }) {
  const allEvents = Array.isArray(initialProps.events) ? initialProps.events : [];
  const [filter, setFilter] = React.useState(initialProps.initialFilter ?? "all");
  const [selectedKey, setSelectedKey] = React.useState(initialProps.selectedKey ?? "");
  const visibleEvents = filter === "warning" ? allEvents.filter((event) => event.state === "warning" || event.status === "warning" || event.tone === "warning") : allEvents;
  const filters = [
    { key: "all", label: "All", selected: filter === "all", removable: false, onClick: () => setFilter("all") },
    { key: "warning", label: "Warnings", selected: filter === "warning", removable: filter === "warning", onClick: () => setFilter("warning") },
  ];
  return React.createElement(Timeline, {
    ...initialProps,
    events: visibleEvents,
    filters,
    filtered: filter !== "all",
    selectedKey,
    status: { label: `${visibleEvents.length} ${visibleEvents.length === 1 ? "event" : "events"}`, tone: filter === "warning" ? "warning" : "neutral", variant: "standard" },
    recovery: { title: "No events match", description: "Clear filters to restore the timeline.", icon: "timeline" },
    clearAction: filter !== "all" ? { label: "Clear filters", variant: "secondary" } : undefined,
    onClear: () => setFilter("all"),
    onFilterRemove: () => setFilter("all"),
    onEventSelect: (key) => setSelectedKey(key),
  });
}

function TransferListIsland({ initialProps }) {
  const initialSource = initialProps.source ?? [
    { key: "jmx", label: "JMX-214-B", meta: "Ana Sosa", valueLabel: "Move", icon: "directions_car" },
    { key: "kld", label: "KLD-901-C", meta: "Luis Vera", valueLabel: "Move", icon: "directions_car" },
  ];
  const [source, setSource] = React.useState(initialSource);
  const [target, setTarget] = React.useState(initialProps.target ?? []);
  const selectedSourceKeys = source.filter((item) => item.selected).map((item) => item.key);
  const selectedTargetKeys = target.filter((item) => item.selected).map((item) => item.key);
  return React.createElement(TransferList, {
    ...initialProps,
    source,
    target,
    selectedSourceKeys,
    selectedTargetKeys,
    onItemCheckedChange: (side, key, checked) => {
      const update = (items) => items.map((item) => item.key === key ? { ...item, selected: checked } : item);
      side === "source" ? setSource(update) : setTarget(update);
    },
    moveToTargetAction: { ...(initialProps.moveToTargetAction ?? {}), onClick: () => { setTarget((current) => [...current, ...source.filter((item) => item.selected).map((item) => ({ ...item, selected: false, valueLabel: "Selected" }))]); setSource((current) => current.filter((item) => !item.selected)); } },
    moveToSourceAction: { ...(initialProps.moveToSourceAction ?? {}), onClick: () => { setSource((current) => [...current, ...target.filter((item) => item.selected).map((item) => ({ ...item, selected: false, valueLabel: "Move" }))]); setTarget((current) => current.filter((item) => !item.selected)); } },
    feedback: target.length ? { label: "Vehicle assigned", description: "Selected vehicles moved into the policy.", tone: "success" } : initialProps.feedback,
  });
}

function DragSortableListIsland({ initialProps }) {
  const initialItems = initialProps.items ?? [
    { key: "spend", label: "Spend overview", description: "Revenue and fuel deltas", icon: "dashboard" },
    { key: "exceptions", label: "Exceptions", description: "Open operational issues", icon: "report" },
    { key: "maintenance", label: "Maintenance", description: "Upcoming service windows", icon: "build" },
  ];
  const [items, setItems] = React.useState(initialItems);
  const [selectedKey, setSelectedKey] = React.useState(initialProps.selectedKey ?? initialItems[0]?.key ?? "");
  const [movingKey, setMovingKey] = React.useState("");
  const [state, setState] = React.useState(initialProps.state ?? "idle");

  const moveItem = (key, direction) => {
    setItems((current) => {
      const index = current.findIndex((item) => item.key === key);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
    setMovingKey(key);
    setSelectedKey(key);
    setState("dirty");
    window.setTimeout(() => setMovingKey((current) => current === key ? "" : current), 180);
  };

  return React.createElement(DragSortableList, {
    ...initialProps,
    items,
    selectedKey,
    movingKey,
    state,
    dirty: state === "dirty",
    feedback: state === "dirty"
      ? { label: "Order updated", description: "Dashboard module order changed.", tone: "success" }
      : state === "saved"
        ? { label: "Order saved", description: "The dashboard order is available to the team.", tone: "success" }
        : initialProps.feedback,
    onSelect: (key, event) => {
      setSelectedKey(key);
      initialProps.onSelect?.(key, event);
    },
    onMoveItem: (key, direction, event) => {
      moveItem(key, direction);
      initialProps.onMoveItem?.(key, direction, event);
    },
    onSave: (event) => {
      setState("saved");
      initialProps.onSave?.(event);
    },
    onUndo: (event) => {
      setItems(initialItems);
      setMovingKey("");
      setState("idle");
      initialProps.onUndo?.(event);
    },
    onReset: (event) => {
      setItems(initialItems);
      setSelectedKey(initialItems[0]?.key ?? "");
      setMovingKey("");
      setState("idle");
      initialProps.onReset?.(event);
    },
  });
}

function CalendarViewIsland({ initialProps }) {
  const initialEvents = initialProps.events ?? [
    { key: "brake", label: "Brake inspection", description: "JMX-214-B · 09:00", time: "09:00", owner: "Ana Sosa", icon: "event", status: "warning", statusLabel: "Due" },
    { key: "policy", label: "Policy renewal", description: "Fleet North · 14:00", time: "14:00", owner: "Luis Vera", icon: "event_available", status: "success", statusLabel: "Review" },
  ];
  const [selectedKey, setSelectedKey] = React.useState(initialProps.selectedKey ?? initialEvents[0]?.key ?? "");
  const [range, setRange] = React.useState(initialProps.dateControl?.value ?? { from: initialProps.selectedDate ?? "2026-07-18", to: initialProps.selectedDate ?? "2026-07-18" });
  const [state, setState] = React.useState(initialProps.state ?? "selected");
  const [detailOpen, setDetailOpen] = React.useState(Boolean(initialProps.detail?.open));
  const selectedEvent = initialEvents.find((event) => event.key === selectedKey);

  const setNextWindow = () => {
    setState("range-changing");
    window.setTimeout(() => {
      setRange({ from: "2026-07-19", to: "2026-07-20" });
      setState("selected");
    }, 220);
  };

  return React.createElement(CalendarView, {
    ...initialProps,
    state,
    events: initialEvents,
    selectedKey,
    selectedDate: range.from,
    rangeLabel: range.from === range.to ? "Jul 18" : "Jul 19-20",
    dateControl: {
      ...(initialProps.dateControl ?? {}),
      value: range,
      helper: "America/Mexico_City",
    },
    detail: {
      ...(initialProps.detail ?? {}),
      open: detailOpen,
      title: selectedEvent?.label ?? initialProps.detail?.title,
      description: selectedEvent?.description ?? initialProps.detail?.description,
      triggerLabel: "Review schedule",
      actions: [{ label: "Open route plan", icon: "open_in_new" }],
    },
    actions: [
      ...(initialProps.actions ?? []),
      { key: "next-window", label: "Next window", icon: "calendar_month", onClick: setNextWindow },
    ],
    onDateChange: (value, event) => {
      setRange(value);
      setState("selected");
      initialProps.onDateChange?.(value, event);
    },
    onEventSelect: (key, event) => {
      setSelectedKey(key);
      setDetailOpen(true);
      initialProps.onEventSelect?.(key, event);
    },
  });
}

export const patternReactIslandWrappers = {
  "action-sheet": ActionSheetIsland,
  "authentication-login-biometrics-and-otp": AuthenticationLoginBiometricsAndOtpIsland,
  "calendar-view": CalendarViewIsland,
  "chart-legend-item": ChartLegendItemIsland,
  "checkbox-group": CheckboxGroupIsland,
  "drag-sortable-list": DragSortableListIsland,
  "pull-to-refresh": PullToRefreshIsland,
  "radio-group": RadioGroupIsland,
  "snackbar-provider": SnackbarProviderIsland,
  timeline: TimelineIsland,
  "transfer-list": TransferListIsland,
};
