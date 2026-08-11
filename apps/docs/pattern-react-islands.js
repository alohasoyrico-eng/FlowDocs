import React from "react";
import { AuthenticationLoginBiometricsAndOtp } from "./generated/react/patterns/AuthenticationLoginBiometricsAndOtp.js?v=1";
import { ChartLegendItem } from "./generated/react/patterns/ChartLegendItem.js?v=1";
import { CheckboxGroup } from "./generated/react/patterns/CheckboxGroup.js?v=1";
import { GanttChart } from "./generated/react/patterns/GanttChart.js?v=1";
import { PolarChart } from "./generated/react/patterns/PolarChart.js?v=1";
import { PreferenceManagement } from "./generated/react/patterns/PreferenceManagement.js?v=1";
import { RadioGroup } from "./generated/react/patterns/RadioGroup.js?v=1";
import { SnackbarProvider } from "./generated/react/patterns/SnackbarProvider.js?v=1";
import { Timeline } from "./generated/react/patterns/Timeline.js?v=1";
import { WaterfallChart } from "./generated/react/patterns/WaterfallChart.js?v=1";

export const patternReactComponents = {
  "authentication-login-biometrics-and-otp": AuthenticationLoginBiometricsAndOtp,
  "chart-legend-item": ChartLegendItem,
  "checkbox-group": CheckboxGroup,
  "gantt-chart": GanttChart,
  "polar-chart": PolarChart,
  "preference-management": PreferenceManagement,
  "radio-group": RadioGroup,
  "snackbar-provider": SnackbarProvider,
  timeline: Timeline,
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

export const patternReactIslandWrappers = {
  "authentication-login-biometrics-and-otp": AuthenticationLoginBiometricsAndOtpIsland,
  "chart-legend-item": ChartLegendItemIsland,
  "checkbox-group": CheckboxGroupIsland,
  "radio-group": RadioGroupIsland,
  "snackbar-provider": SnackbarProviderIsland,
  timeline: TimelineIsland,
};
