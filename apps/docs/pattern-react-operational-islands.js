import React from "react";
import { DenseOperationalList } from "./generated/react/patterns/DenseOperationalList.js?v=1";
import { DriverAndVehicleAdministration } from "./generated/react/patterns/DriverAndVehicleAdministration.js?v=1";
import { KanbanBoard } from "./generated/react/patterns/KanbanBoard.js?v=1";
import { PaymentForm } from "./generated/react/patterns/PaymentForm.js?v=1";
import { StationDiscovery } from "./generated/react/patterns/StationDiscovery.js?v=1";
import { StatusFeedbackView } from "./generated/react/patterns/StatusFeedbackView.js?v=1";

export const operationalPatternReactComponents = {
  "dense-operational-list": DenseOperationalList,
  "driver-and-vehicle-administration": DriverAndVehicleAdministration,
  "kanban-board": KanbanBoard,
  "payment-form": PaymentForm,
  "station-discovery": StationDiscovery,
  "status-feedback-view": StatusFeedbackView,
};

function DriverAndVehicleAdministrationIsland({ initialProps }) {
  const [selectedKey, setSelectedKey] = React.useState(initialProps.selectedKey);
  const [actionRunning, setActionRunning] = React.useState(false);
  return React.createElement(DriverAndVehicleAdministration, {
    ...initialProps,
    selectedKey,
    actionRunning,
    state: actionRunning ? "action-running" : selectedKey ? "selected" : initialProps.state,
    onRowSelect: (key, event) => {
      setSelectedKey(key);
      initialProps.onRowSelect?.(key, event);
    },
    onAction: (key, event) => {
      if (key) {
        setActionRunning(true);
        window.setTimeout(() => setActionRunning(false), 350);
      }
      initialProps.onAction?.(key, event);
    },
  });
}

function StationDiscoveryIsland({ initialProps }) {
  const [query, setQuery] = React.useState(initialProps.query ?? "");
  const [selectedStationKey, setSelectedStationKey] = React.useState(initialProps.selectedStationKey);
  return React.createElement(StationDiscovery, {
    ...initialProps,
    query,
    selectedStationKey,
    state: selectedStationKey ? "selected" : query ? "nearby" : initialProps.state,
    search: initialProps.search ? { ...initialProps.search, query } : undefined,
    onQueryChange: (value, event) => {
      setQuery(value);
      initialProps.onQueryChange?.(value, event);
    },
    onStationSelect: (key, station, event) => {
      setSelectedStationKey(key);
      initialProps.onStationSelect?.(key, station, event);
    },
  });
}

function KanbanBoardIsland({ initialProps }) {
  const [selectedKey, setSelectedKey] = React.useState(initialProps.selectedKey);
  const [selectedColumnKey, setSelectedColumnKey] = React.useState(initialProps.selectedColumnKey);
  const [saving, setSaving] = React.useState(false);
  return React.createElement(KanbanBoard, {
    ...initialProps,
    selectedKey,
    selectedColumnKey,
    state: saving ? "saving" : initialProps.state,
    onCardSelect: (key, columnKey, event) => {
      setSelectedKey(key);
      setSelectedColumnKey(columnKey);
      initialProps.onCardSelect?.(key, columnKey, event);
    },
    onColumnAction: (key, event) => {
      if (key === "save") {
        setSaving(true);
        window.setTimeout(() => setSaving(false), 350);
      }
      initialProps.onColumnAction?.(key, event);
    },
  });
}

function StatusFeedbackViewIsland({ initialProps }) {
  const [open, setOpen] = React.useState(Boolean(initialProps.open));
  const [selectedKey, setSelectedKey] = React.useState(initialProps.selectedKey);
  return React.createElement(StatusFeedbackView, {
    ...initialProps,
    open,
    selectedKey,
    onOpenChange: (nextOpen, event) => {
      setOpen(Boolean(nextOpen));
      initialProps.onOpenChange?.(nextOpen, event);
    },
    onSelect: (key, event) => {
      setSelectedKey(key);
      initialProps.onSelect?.(key, event);
    },
    onAction: (key, event) => {
      setOpen(true);
      initialProps.onAction?.(key, event);
    },
  });
}

function PaymentFormIsland({ initialProps }) {
  const [state, setState] = React.useState(initialProps.state ?? "review");
  const [loading, setLoading] = React.useState(Boolean(initialProps.loading));
  return React.createElement(PaymentForm, {
    ...initialProps,
    state,
    loading,
    submitAction: { ...(initialProps.submitAction ?? {}), loading },
    onSubmit: (key, event) => {
      setLoading(true);
      window.setTimeout(() => {
        setLoading(false);
        setState("success");
      }, 400);
      initialProps.onSubmit?.(key, event);
    },
    onSecondaryAction: (key, event) => {
      setState("default");
      initialProps.onSecondaryAction?.(key, event);
    },
  });
}

function DenseOperationalListIsland({ initialProps }) {
  const [selectedKeys, setSelectedKeys] = React.useState(initialProps.selectedKeys ?? []);
  const [query, setQuery] = React.useState(initialProps.search?.query ?? "");
  return React.createElement(DenseOperationalList, {
    ...initialProps,
    selectedKeys,
    state: selectedKeys.length ? "selected" : query ? "filtered" : initialProps.state,
    search: initialProps.search ? { ...initialProps.search, query } : undefined,
    table: initialProps.table ? { ...initialProps.table, selectedKeys } : undefined,
    onSearchChange: (value, meta, event) => {
      setQuery(value);
      initialProps.onSearchChange?.(value, meta, event);
    },
    onRowSelect: (key, event) => {
      setSelectedKeys((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
      initialProps.onRowSelect?.(key, event);
    },
  });
}

export const operationalPatternReactIslandWrappers = {
  "dense-operational-list": DenseOperationalListIsland,
  "driver-and-vehicle-administration": DriverAndVehicleAdministrationIsland,
  "kanban-board": KanbanBoardIsland,
  "payment-form": PaymentFormIsland,
  "station-discovery": StationDiscoveryIsland,
  "status-feedback-view": StatusFeedbackViewIsland,
};
