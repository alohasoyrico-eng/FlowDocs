import React from "react";
import { AccountOperations } from "./generated/react/patterns/AccountOperations.js?v=1";
import { AgentConversation } from "./generated/react/patterns/AgentConversation.js?v=1";
import { BackofficeApproval } from "./generated/react/patterns/BackofficeApproval.js?v=1";
import { CaseManagement } from "./generated/react/patterns/CaseManagement.js?v=1";
import { DenseOperationalList } from "./generated/react/patterns/DenseOperationalList.js?v=1";
import { DriverAndVehicleAdministration } from "./generated/react/patterns/DriverAndVehicleAdministration.js?v=1";
import { EmailTemplateLayout } from "./generated/react/patterns/EmailTemplateLayout.js?v=1";
import { ExpandableDetailTable } from "./generated/react/patterns/ExpandableDetailTable.js?v=1";
import { FilterableEditableTable } from "./generated/react/patterns/FilterableEditableTable.js?v=1";
import { KanbanBoard } from "./generated/react/patterns/KanbanBoard.js?v=1";
import { PaymentForm } from "./generated/react/patterns/PaymentForm.js?v=1";
import { PricingOperations } from "./generated/react/patterns/PricingOperations.js?v=1";
import { StationDiscovery } from "./generated/react/patterns/StationDiscovery.js?v=1";
import { StatusFeedbackView } from "./generated/react/patterns/StatusFeedbackView.js?v=1";
import { TicketQueue } from "./generated/react/patterns/TicketQueue.js?v=1";

export const operationalPatternReactComponents = {
  "account-operations": AccountOperations,
  "agent-conversation": AgentConversation,
  "backoffice-approval": BackofficeApproval,
  "case-management": CaseManagement,
  "dense-operational-list": DenseOperationalList,
  "driver-and-vehicle-administration": DriverAndVehicleAdministration,
  "email-template-layout": EmailTemplateLayout,
  "expandable-detail-table": ExpandableDetailTable,
  "filterable-editable-table": FilterableEditableTable,
  "kanban-board": KanbanBoard,
  "payment-form": PaymentForm,
  "pricing-operations": PricingOperations,
  "station-discovery": StationDiscovery,
  "status-feedback-view": StatusFeedbackView,
  "ticket-queue": TicketQueue,
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

function selectionDetailIsland(Component, keyName, openName, selectedState, defaultKey) {
  return function OperationalSelectionDetailIsland({ initialProps }) {
    const [selectedKey, setSelectedKey] = React.useState(initialProps[keyName] ?? defaultKey ?? "");
    const [detailOpen, setDetailOpen] = React.useState(Boolean(initialProps[openName]));
    const [busy, setBusy] = React.useState(false);
    return React.createElement(Component, {
      ...initialProps,
      [keyName]: selectedKey,
      [openName]: detailOpen,
      state: busy ? initialProps.busyState ?? "loading" : detailOpen ? "detail-open" : selectedKey ? selectedState : initialProps.state,
      onAccountSelect: (key, event) => { setSelectedKey(key); setDetailOpen(true); initialProps.onAccountSelect?.(key, event); },
      onTicketSelect: (key, event) => { setSelectedKey(key); setDetailOpen(true); initialProps.onTicketSelect?.(key, event); },
      onCaseSelect: (key, event) => { setSelectedKey(key); setDetailOpen(true); initialProps.onCaseSelect?.(key, event); },
      onDocumentSelect: (key, event) => { setSelectedKey(key); setDetailOpen(true); initialProps.onDocumentSelect?.(key, event); },
      onTableRowSelect: (key, event) => { setSelectedKey(key); setDetailOpen(true); initialProps.onTableRowSelect?.(key, event); },
      onDetailOpenChange: (open, event) => { setDetailOpen(Boolean(open)); initialProps.onDetailOpenChange?.(open, event); },
      onDetailAction: (key, event) => {
        setBusy(true);
        window.setTimeout(() => setBusy(false), 350);
        initialProps.onDetailAction?.(key, event);
      },
      onApprove: (key, event) => {
        setBusy(true);
        window.setTimeout(() => setBusy(false), 350);
        initialProps.onApprove?.(key, event);
      },
      onReject: (key, event) => {
        setBusy(true);
        window.setTimeout(() => setBusy(false), 350);
        initialProps.onReject?.(key, event);
      },
    });
  };
}

const AccountOperationsIsland = selectionDetailIsland(AccountOperations, "selectedAccountKey", "detailOpen", "account-selected", "acct-north");
const TicketQueueIsland = selectionDetailIsland(TicketQueue, "selectedTicketKey", "detailOpen", "ticket-selected", "acct-south");
const CaseManagementIsland = selectionDetailIsland(CaseManagement, "selectedCaseKey", "detailOpen", "case-selected", "acct-west");
const BackofficeApprovalIsland = selectionDetailIsland(BackofficeApproval, "selectedDocumentKey", "detailOpen", "document-selected", "doc-vehicle");
const ExpandableDetailTableIsland = selectionDetailIsland(ExpandableDetailTable, "expandedRowKey", "detailOpen", "expanded", "acct-north");

function FilterableEditableTableIsland({ initialProps }) {
  const [selectedRowKey, setSelectedRowKey] = React.useState(initialProps.selectedRowKey ?? "");
  const [editing, setEditing] = React.useState(Boolean(initialProps.editing));
  return React.createElement(FilterableEditableTable, {
    ...initialProps,
    selectedRowKey,
    editing,
    state: editing ? "editing" : selectedRowKey ? "selected" : initialProps.state,
    onTableRowSelect: (key, event) => {
      setSelectedRowKey(key);
      setEditing(true);
      initialProps.onTableRowSelect?.(key, event);
    },
    onEditorOpenChange: (open, event) => {
      setEditing(Boolean(open));
      initialProps.onEditorOpenChange?.(open, event);
    },
    onEditorAction: (key, event) => {
      setEditing(false);
      initialProps.onEditorAction?.(key, event);
    },
  });
}

function PricingOperationsIsland({ initialProps }) {
  const [selectedRuleKey, setSelectedRuleKey] = React.useState(initialProps.selectedRuleKey ?? "");
  const [editorOpen, setEditorOpen] = React.useState(Boolean(initialProps.editorOpen));
  const [submitting, setSubmitting] = React.useState(false);
  return React.createElement(PricingOperations, {
    ...initialProps,
    selectedRuleKey,
    editorOpen,
    submitting,
    state: submitting ? "submitting" : editorOpen ? "editing" : selectedRuleKey ? "rule-selected" : initialProps.state,
    onRuleSelect: (key, event) => {
      setSelectedRuleKey(key);
      setEditorOpen(true);
      initialProps.onRuleSelect?.(key, event);
    },
    onEditorOpenChange: (open) => {
      setEditorOpen(Boolean(open));
      initialProps.onEditorOpenChange?.(open);
    },
    onEditorAction: (key, event) => {
      setSubmitting(true);
      window.setTimeout(() => setSubmitting(false), 400);
      initialProps.onEditorAction?.(key, event);
    },
    onRuleSubmitForApproval: (key, event) => {
      setSubmitting(true);
      window.setTimeout(() => setSubmitting(false), 400);
      initialProps.onRuleSubmitForApproval?.(key, event);
    },
  });
}

function AgentConversationIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.composer?.value ?? "");
  const [sending, setSending] = React.useState(false);
  return React.createElement(AgentConversation, {
    ...initialProps,
    sending,
    state: sending ? "sending" : value ? "composing" : initialProps.state,
    composer: initialProps.composer ? { ...initialProps.composer, value } : undefined,
    onComposerChange: (nextValue, meta, event) => {
      setValue(nextValue);
      initialProps.onComposerChange?.(nextValue, meta, event);
    },
    onSend: (payload, event) => {
      setSending(true);
      window.setTimeout(() => {
        setSending(false);
        setValue("");
      }, 400);
      initialProps.onSend?.(payload, event);
    },
  });
}

export const operationalPatternReactIslandWrappers = {
  "account-operations": AccountOperationsIsland,
  "agent-conversation": AgentConversationIsland,
  "backoffice-approval": BackofficeApprovalIsland,
  "case-management": CaseManagementIsland,
  "dense-operational-list": DenseOperationalListIsland,
  "driver-and-vehicle-administration": DriverAndVehicleAdministrationIsland,
  "email-template-layout": EmailTemplateLayout,
  "expandable-detail-table": ExpandableDetailTableIsland,
  "filterable-editable-table": FilterableEditableTableIsland,
  "kanban-board": KanbanBoardIsland,
  "payment-form": PaymentFormIsland,
  "pricing-operations": PricingOperationsIsland,
  "station-discovery": StationDiscoveryIsland,
  "status-feedback-view": StatusFeedbackViewIsland,
  "ticket-queue": TicketQueueIsland,
};
