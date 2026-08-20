import React from "react";
import { AgentWorkspace } from "./generated/react/templates/AgentWorkspace.js?v=1";
import { ConfigurationConsole } from "./generated/react/templates/ConfigurationConsole.js?v=1";
import { DriverCardWallet } from "./generated/react/templates/DriverCardWallet.js?v=1";
import { DriverMobileApp } from "./generated/react/templates/DriverMobileApp.js?v=1";
import { DocsArtifactDetailTemplate } from "./generated/react/templates/DocsArtifactDetailTemplate.js?v=1";
import { FleetDashboardSuite } from "./generated/react/templates/FleetDashboardSuite.js?v=1";
import { FleetManagerDesktop } from "./generated/react/templates/FleetManagerDesktop.js?v=1";
import { InternalOperationsConsole } from "./generated/react/templates/InternalOperationsConsole.js?v=1";
import { ReferenceDetailTemplate } from "./generated/react/templates/ReferenceDetailTemplate.js?v=1";
import { RoutesAndStations } from "./generated/react/templates/RoutesAndStations.js?v=1";
import { SettingsWorkspace } from "./generated/react/templates/SettingsWorkspace.js?v=1";

export const templateReactComponents = {
  "agent-workspace": AgentWorkspace,
  "configuration-console": ConfigurationConsole,
  "driver-card-wallet": DriverCardWallet,
  "driver-mobile-app": DriverMobileApp,
  "docs-artifact-detail-template": DocsArtifactDetailTemplate,
  "fleet-dashboard-suite": FleetDashboardSuite,
  "fleet-manager-desktop": FleetManagerDesktop,
  "internal-operations-console": InternalOperationsConsole,
  "reference-detail-template": ReferenceDetailTemplate,
  "routes-and-stations": RoutesAndStations,
  "settings-workspace": SettingsWorkspace,
};

function LegacyHtmlContentSlot({ markup = "", slot = "content", exit = "typed-react-children" }) {
  return React.createElement("div", {
    "data-legacy-html-slot": slot,
    "data-legacy-html-owner": "FlowDocs",
    "data-legacy-html-exit": exit,
    "data-legacy-html-slot-status": "active",
    dangerouslySetInnerHTML: { __html: markup },
  });
}

function selectableTemplateIsland(Component, propName, stateName = "loaded") {
  return function SelectableTemplateIsland({ initialProps }) {
    const [selected, setSelected] = React.useState(initialProps[propName] ?? initialProps[`default${propName[0].toUpperCase()}${propName.slice(1)}`]);
    const [drawerOpen, setDrawerOpen] = React.useState(Boolean(initialProps.drawerOpen ?? initialProps.defaultDrawerOpen));
    return React.createElement(Component, {
      ...initialProps,
      [propName]: selected,
      drawerOpen,
      state: initialProps.state ?? stateName,
      onSelectedDashboardChange: (key, route, event) => {
        setSelected(key);
        initialProps.onSelectedDashboardChange?.(key, route, event);
      },
      onSelectedModuleChange: (key, route, event) => {
        setSelected(key);
        initialProps.onSelectedModuleChange?.(key, route, event);
      },
      onSelectedTabChange: (key, event) => {
        setSelected(key);
        initialProps.onSelectedTabChange?.(key, event);
      },
      onSelectedSectionChange: (key, event) => {
        setSelected(key);
        initialProps.onSelectedSectionChange?.(key, event);
      },
      onDrawerOpenChange: (open, event) => {
        setDrawerOpen(Boolean(open));
        initialProps.onDrawerOpenChange?.(open, event);
      },
    });
  };
}

function RoutesAndStationsIsland({ initialProps }) {
  const [selectedStationKey, setSelectedStationKey] = React.useState(initialProps.selectedStationKey ?? initialProps.defaultSelectedStationKey ?? "");
  return React.createElement(RoutesAndStations, {
    ...initialProps,
    selectedStationKey,
    onSelectedStationChange: (key, station, event) => {
      setSelectedStationKey(key);
      initialProps.onSelectedStationChange?.(key, station, event);
    },
  });
}

function AgentWorkspaceIsland({ initialProps }) {
  const [selectedConversation, setSelectedConversation] = React.useState(initialProps.selectedConversation ?? initialProps.defaultSelectedConversation ?? "");
  const [composerValue, setComposerValue] = React.useState(initialProps.composer?.value ?? "");
  return React.createElement(AgentWorkspace, {
    ...initialProps,
    selectedConversation,
    state: initialProps.handoff ? "handoff" : composerValue ? "handoff" : initialProps.state,
    composer: initialProps.composer ? { ...initialProps.composer, value: composerValue } : undefined,
    onSelectedConversationChange: (key, conversation, event) => {
      setSelectedConversation(key);
      initialProps.onSelectedConversationChange?.(key, conversation, event);
    },
    onComposerChange: (value, meta, event) => {
      setComposerValue(value);
      initialProps.onComposerChange?.(value, meta, event);
    },
  });
}

function SettingsWorkspaceIsland({ initialProps }) {
  const [selectedSection, setSelectedSection] = React.useState(initialProps.selectedSection ?? initialProps.defaultSelectedSection ?? "profile");
  const [dirty, setDirty] = React.useState(Boolean(initialProps.dirty));
  const [saving, setSaving] = React.useState(false);
  return React.createElement(SettingsWorkspace, {
    ...initialProps,
    selectedSection,
    dirty,
    saving,
    state: saving ? "saving" : dirty ? "dirty" : initialProps.state,
    onSelectedSectionChange: (key, section, event) => {
      setSelectedSection(key);
      setDirty(true);
      initialProps.onSelectedSectionChange?.(key, section, event);
    },
    onPreferenceChange: (...args) => {
      setDirty(true);
      initialProps.onPreferenceChange?.(...args);
    },
    onSave: (...args) => {
      setSaving(true);
      window.setTimeout(() => {
        setSaving(false);
        setDirty(false);
      }, 400);
      initialProps.onSave?.(...args);
    },
  });
}

function DocsArtifactDetailTemplateIsland({ initialProps }) {
  const { bodyHtml = "", tabBodiesHtml = {}, ...props } = initialProps;
  const [selectedTabKey, setSelectedTabKey] = React.useState(initialProps.selectedTabKey ?? initialProps.tabs?.[0]?.key ?? "");
  const selectedBodyHtml = tabBodiesHtml[selectedTabKey] ?? bodyHtml;
  React.useEffect(() => {
    document.dispatchEvent(new CustomEvent("docs-react-slot-html-mounted", { bubbles: true }));
  }, [selectedBodyHtml]);
  return React.createElement(DocsArtifactDetailTemplate, {
    ...props,
    selectedTabKey,
    body: React.createElement("div", {
      "data-flowdocs-html-slot": "artifact-detail.body",
      "data-legacy-html-slot": "tab",
      "data-legacy-html-owner": "FlowDocs",
      "data-legacy-html-exit": "typed-react-tab-children",
      "data-legacy-html-slot-status": "active",
      dangerouslySetInnerHTML: { __html: selectedBodyHtml },
    }),
    onSelectedTabChange: (key, event) => {
      setSelectedTabKey(key);
      initialProps.onSelectedTabChange?.(key, event);
    },
  });
}

function ReferenceDetailTemplateIsland({ initialProps }) {
  const { bodyHtml = "", specimenHtml = "", ...props } = initialProps;
  React.useEffect(() => {
    document.dispatchEvent(new CustomEvent("docs-react-slot-html-mounted", { bubbles: true }));
  }, [bodyHtml, specimenHtml]);
  return React.createElement(ReferenceDetailTemplate, {
    ...props,
    specimen: specimenHtml
      ? React.createElement(LegacyHtmlContentSlot, {
        markup: specimenHtml,
        slot: "reference-specimen",
        exit: "typed-reference-specimen",
      })
      : undefined,
  }, React.createElement(LegacyHtmlContentSlot, {
    markup: bodyHtml,
    slot: "reference-body",
    exit: "typed-reference-sections",
  }));
}

export const templateReactIslandWrappers = {
  "agent-workspace": AgentWorkspaceIsland,
  "configuration-console": selectableTemplateIsland(ConfigurationConsole, "selectedModule"),
  "driver-card-wallet": selectableTemplateIsland(DriverCardWallet, "selectedSection"),
  "driver-mobile-app": selectableTemplateIsland(DriverMobileApp, "selectedTab"),
  "docs-artifact-detail-template": DocsArtifactDetailTemplateIsland,
  "fleet-dashboard-suite": selectableTemplateIsland(FleetDashboardSuite, "selectedDashboard"),
  "fleet-manager-desktop": selectableTemplateIsland(FleetManagerDesktop, "selectedDashboard"),
  "internal-operations-console": selectableTemplateIsland(InternalOperationsConsole, "selectedModule"),
  "reference-detail-template": ReferenceDetailTemplateIsland,
  "routes-and-stations": RoutesAndStationsIsland,
  "settings-workspace": SettingsWorkspaceIsland,
};
