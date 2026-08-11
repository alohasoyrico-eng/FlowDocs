import React from "react";
import { DriverOnboardingMobile } from "./generated/react/patterns/DriverOnboardingMobile.js?v=1";
import { FleetManagerOnboardingDesktop } from "./generated/react/patterns/FleetManagerOnboardingDesktop.js?v=1";
import { HelpCenter } from "./generated/react/patterns/HelpCenter.js?v=1";
import { MultiStepForm } from "./generated/react/patterns/MultiStepForm.js?v=1";

export const journeyPatternReactComponents = {
  "driver-onboarding-mobile": DriverOnboardingMobile,
  "fleet-manager-onboarding-desktop": FleetManagerOnboardingDesktop,
  "help-center": HelpCenter,
  "multi-step-form": MultiStepForm,
};

function nextStep(current, total) {
  return Math.min(current + 1, Math.max(0, total - 1));
}

function DriverOnboardingMobileIsland({ initialProps }) {
  const [currentStep, setCurrentStep] = React.useState(initialProps.currentStep ?? 0);
  const [complete, setComplete] = React.useState(Boolean(initialProps.complete));
  return React.createElement(DriverOnboardingMobile, {
    ...initialProps,
    currentStep,
    complete,
    state: complete ? "complete" : currentStep === 1 ? "verifying" : "in-progress",
    primaryAction: {
      ...(initialProps.primaryAction ?? {}),
      onClick: (event) => {
        if (currentStep >= (initialProps.steps?.length ?? 1) - 1) setComplete(true);
        else setCurrentStep((step) => nextStep(step, initialProps.steps?.length ?? 1));
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

function FleetManagerOnboardingDesktopIsland({ initialProps }) {
  const [currentStep, setCurrentStep] = React.useState(initialProps.currentStep ?? 0);
  const [tasks, setTasks] = React.useState(initialProps.tasks ?? []);
  const [complete, setComplete] = React.useState(Boolean(initialProps.complete));
  return React.createElement(FleetManagerOnboardingDesktop, {
    ...initialProps,
    currentStep,
    tasks,
    complete,
    state: complete ? "complete" : "in-progress",
    onTaskChange: (key, checked, meta, event) => {
      setTasks((current) => current.map((task) => task.key === key ? { ...task, checked } : task));
      initialProps.onTaskChange?.(key, checked, meta, event);
    },
    onAction: (key, event) => {
      if (key === "continue") {
        if (currentStep >= (initialProps.steps?.length ?? 1) - 1) setComplete(true);
        else setCurrentStep((step) => nextStep(step, initialProps.steps?.length ?? 1));
      }
      if (key === "back") setCurrentStep((step) => Math.max(0, step - 1));
      initialProps.onAction?.(key, event);
    },
  });
}

function MultiStepFormIsland({ initialProps }) {
  const [currentStep, setCurrentStep] = React.useState(initialProps.currentStep ?? 0);
  const [saving, setSaving] = React.useState(false);
  const [complete, setComplete] = React.useState(Boolean(initialProps.complete));
  return React.createElement(MultiStepForm, {
    ...initialProps,
    currentStep,
    saving,
    complete,
    state: saving ? "saving" : complete ? "complete" : initialProps.state,
    primaryAction: {
      ...(initialProps.primaryAction ?? {}),
      onClick: (event) => {
        if (currentStep >= (initialProps.steps?.length ?? 1) - 1) setComplete(true);
        else setCurrentStep((step) => nextStep(step, initialProps.steps?.length ?? 1));
        initialProps.primaryAction?.onClick?.(event);
      },
    },
    backAction: {
      ...(initialProps.backAction ?? {}),
      onClick: (event) => {
        setCurrentStep((step) => Math.max(0, step - 1));
        initialProps.backAction?.onClick?.(event);
      },
    },
    saveAction: {
      ...(initialProps.saveAction ?? {}),
      loading: saving,
      onClick: (event) => {
        setSaving(true);
        window.setTimeout(() => setSaving(false), 350);
        initialProps.saveAction?.onClick?.(event);
      },
    },
  });
}

function HelpCenterIsland({ initialProps }) {
  const [query, setQuery] = React.useState(initialProps.query ?? "");
  const [selectedTopicKey, setSelectedTopicKey] = React.useState(initialProps.selectedTopicKey);
  const [open, setOpen] = React.useState(Boolean(initialProps.open));
  return React.createElement(HelpCenter, {
    ...initialProps,
    query,
    selectedTopicKey,
    open,
    state: query ? "results" : open ? "open" : "closed",
    search: initialProps.search ? { ...initialProps.search, query } : undefined,
    onQueryChange: (value, meta, event) => {
      setQuery(value);
      initialProps.onQueryChange?.(value, meta, event);
    },
    onTopicSelect: (key, topic, event) => {
      setSelectedTopicKey(key);
      initialProps.onTopicSelect?.(key, topic, event);
    },
    onDrawerOpenChange: (nextOpen, event) => {
      setOpen(Boolean(nextOpen));
      initialProps.onDrawerOpenChange?.(nextOpen, event);
    },
  });
}

export const journeyPatternReactIslandWrappers = {
  "driver-onboarding-mobile": DriverOnboardingMobileIsland,
  "fleet-manager-onboarding-desktop": FleetManagerOnboardingDesktopIsland,
  "help-center": HelpCenterIsland,
  "multi-step-form": MultiStepFormIsland,
};
