import React from "react";
import { BottomSheet } from "./generated/react/patterns/BottomSheet.js?v=1";
import { DrawerAdapter } from "./generated/react/patterns/DrawerAdapter.js?v=1";
import { FullscreenSheet } from "./generated/react/patterns/FullscreenSheet.js?v=1";
import { QuickActionsGrid } from "./generated/react/patterns/QuickActionsGrid.js?v=1";
import { SwipeActions } from "./generated/react/patterns/SwipeActions.js?v=1";

export const mobilePatternReactComponents = {
  "bottom-sheet": BottomSheet,
  "drawer-adapter": DrawerAdapter,
  "fullscreen-sheet": FullscreenSheet,
  "quick-actions-grid": QuickActionsGrid,
  "swipe-actions": SwipeActions,
};

function BottomSheetIsland({ initialProps }) {
  const [open, setOpen] = React.useState(Boolean(initialProps.open));
  const [state, setState] = React.useState(initialProps.state ?? "open");
  return React.createElement(BottomSheet, {
    ...initialProps,
    open,
    state: open ? state : "closed",
    onOpenChange: (nextOpen, event) => {
      setOpen(Boolean(nextOpen));
      setState(nextOpen ? "open" : "closed");
      initialProps.onOpenChange?.(nextOpen, event);
    },
    onAction: (key, event) => {
      if (key === "close") setOpen(false);
      if (key === "dispute") setState("destructive");
      initialProps.onAction?.(key, event);
    },
  });
}

function FullscreenSheetIsland({ initialProps }) {
  const [saving, setSaving] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(initialProps.currentStep ?? 0);
  return React.createElement(FullscreenSheet, {
    ...initialProps,
    saving,
    currentStep,
    state: saving ? "saving" : initialProps.state,
    primaryAction: {
      ...(initialProps.primaryAction ?? {}),
      loading: saving,
      onClick: (event) => {
        if (currentStep < (initialProps.steps?.length ?? 1) - 1) setCurrentStep(currentStep + 1);
        else {
          setSaving(true);
          window.setTimeout(() => setSaving(false), 400);
        }
        initialProps.primaryAction?.onClick?.(event);
      },
    },
    secondaryAction: {
      ...(initialProps.secondaryAction ?? {}),
      onClick: (event) => {
        setCurrentStep((step) => Math.max(0, step - 1));
        initialProps.secondaryAction?.onClick?.(event);
      },
    },
  });
}

function SwipeActionsIsland({ initialProps }) {
  const [revealed, setRevealed] = React.useState(Boolean(initialProps.revealed));
  const [committed, setCommitted] = React.useState(Boolean(initialProps.committed));
  return React.createElement(SwipeActions, {
    ...initialProps,
    revealed,
    committed,
    state: committed ? "committed" : revealed ? "revealed" : "closed",
    onAction: (key, action, event) => {
      setRevealed(true);
      setCommitted(key === "dispute");
      initialProps.onAction?.(key, action, event);
    },
  });
}

function QuickActionsGridIsland({ initialProps }) {
  const [completed, setCompleted] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  return React.createElement(QuickActionsGrid, {
    ...initialProps,
    completed,
    confirming,
    state: confirming ? "confirming" : completed ? "completed" : initialProps.state,
    feedback: completed ? { label: "Shortcut applied", description: "Action completed from the React pattern.", tone: "success" } : initialProps.feedback,
    onAction: (key, action, event) => {
      if (key === "freeze") setConfirming(true);
      else setCompleted(true);
      initialProps.onAction?.(key, action, event);
    },
  });
}

function DrawerAdapterIsland({ initialProps }) {
  const [open, setOpen] = React.useState(Boolean(initialProps.open));
  const [feedback, setFeedback] = React.useState(initialProps.feedback);
  return React.createElement(DrawerAdapter, {
    ...initialProps,
    open,
    feedback,
    state: open ? initialProps.state : "closed",
    onOpenChange: (nextOpen, event) => {
      setOpen(Boolean(nextOpen));
      initialProps.onOpenChange?.(nextOpen, event);
    },
    onAction: (key, event) => {
      if (key === "close") setOpen(false);
      if (key === "risk") setFeedback({ label: "Risk review opened", description: "Drawer action stayed inside Flow.", tone: "info" });
      initialProps.onAction?.(key, event);
    },
  });
}

export const mobilePatternReactIslandWrappers = {
  "bottom-sheet": BottomSheetIsland,
  "drawer-adapter": DrawerAdapterIsland,
  "fullscreen-sheet": FullscreenSheetIsland,
  "quick-actions-grid": QuickActionsGridIsland,
  "swipe-actions": SwipeActionsIsland,
};
