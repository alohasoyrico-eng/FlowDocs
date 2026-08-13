import type { ButtonProps } from "../generated/react/Button.js";
import type { SurfaceProps } from "../generated/react/Surface.js";
import type { BottomSheetProps } from "../generated/react/patterns/BottomSheet.js";
import type { DriverOnboardingMobileProps } from "../generated/react/patterns/DriverOnboardingMobile.js";
import type { SidebarProps } from "../generated/react/patterns/Sidebar.js";
import type { TopbarProps } from "../generated/react/patterns/Topbar.js";

type DocsFlowShellContract = {
  topbar: TopbarProps;
  sidebar: SidebarProps;
  surface: SurfaceProps;
};

type DocsFlowPatternContract = {
  bottomSheet: BottomSheetProps;
  driverOnboardingMobile: DriverOnboardingMobileProps;
};

export type DocsFlowBoundaryContract = DocsFlowShellContract & DocsFlowPatternContract;

export const docsFlowBoundaryContract: DocsFlowBoundaryContract = {
  topbar: {
    label: "Flow documentation",
    density: "md",
    state: "default",
    search: {
      label: "Search documentation",
      placeholder: "Search foundations, components, patterns...",
    },
    navigationAction: {
      label: "Open navigation",
      icon: "menu",
      "aria-controls": "docs-sidebar",
      "aria-expanded": false,
    },
  },
  sidebar: {
    label: "Documentation navigation",
    density: "md",
    state: "expanded",
    groups: [
      {
        key: "patterns",
        title: "Patterns",
        icon: "conversion_path",
        routes: [{ key: "driver-onboarding-mobile", label: "Driver onboarding mobile", active: true }],
      },
    ],
  },
  surface: {
    surfaceRole: "section",
    density: "md",
    elevation: "none",
    tone: "default",
  },
  bottomSheet: {
    label: "Fuel purchase actions",
    description: "Mobile contextual actions are delegated to Flow pattern contracts.",
    density: "md",
    state: "open",
    open: true,
    triggerLabel: "Open purchase actions",
    items: [{ key: "receipt", label: "Open receipt" }],
    actions: [{ key: "close", label: "Close", variant: "secondary" }],
  },
  driverOnboardingMobile: {
    label: "Driver onboarding",
    description: "Mobile onboarding flow composed from Flow primitives, components, and patterns.",
    density: "md",
    state: "in-progress",
    steps: [
      { id: "identity", label: "Identity" },
      { id: "phone", label: "Phone" },
      { id: "verify", label: "Verify" },
    ],
    currentStep: 1,
    primaryAction: { label: "Continue", variant: "primary" } satisfies ButtonProps,
    secondaryAction: { label: "Back", variant: "secondary" } satisfies ButtonProps,
  },
};
