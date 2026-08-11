import React from "react";
import { createRoot } from "react-dom/client";
import { Accordion } from "./generated/react/Accordion.js?v=1";
import { AnimatedMoment } from "./generated/react/AnimatedMoment.js?v=1";
import { AuditEvent } from "./generated/react/AuditEvent.js?v=1";
import { Avatar } from "./generated/react/Avatar.js?v=1";
import { Badge } from "./generated/react/Badge.js?v=1";
import { BiometricPrompt } from "./generated/react/BiometricPrompt.js?v=1";
import { Breadcrumbs } from "./generated/react/Breadcrumbs.js?v=1";
import { Button } from "./generated/react/Button.js?v=1";
import { Card } from "./generated/react/Card.js?v=1";
import { CardExpiryInput } from "./generated/react/CardExpiryInput.js?v=1";
import { CardNumberInput } from "./generated/react/CardNumberInput.js?v=1";
import { CardSecurityCodeInput } from "./generated/react/CardSecurityCodeInput.js?v=1";
import { CardSummary } from "./generated/react/CardSummary.js?v=1";
import { ChartPanel } from "./generated/react/ChartPanel.js?v=1";
import { Checkbox } from "./generated/react/Checkbox.js?v=1";
import { Chip } from "./generated/react/Chip.js?v=1";
import { CodeInput } from "./generated/react/CodeInput.js?v=1";
import { Combobox } from "./generated/react/Combobox.js?v=1";
import { CountrySelector } from "./generated/react/CountrySelector.js?v=1";
import { DatePicker } from "./generated/react/DatePicker.js?v=1";
import { DateRangePicker } from "./generated/react/DateRangePicker.js?v=1";
import { Dialog } from "./generated/react/Dialog.js?v=1";
import { Drawer } from "./generated/react/Drawer.js?v=1";
import { EmptyState } from "./generated/react/EmptyState.js?v=1";
import { ErrorPanel } from "./generated/react/ErrorPanel.js?v=1";
import { FloatingActionButton } from "./generated/react/FloatingActionButton.js?v=1";
import { IconButton } from "./generated/react/IconButton.js?v=1";
import { InlineValidation } from "./generated/react/InlineValidation.js?v=1";
import { Input } from "./generated/react/Input.js?v=1";
import { KpiTile } from "./generated/react/KpiTile.js?v=1";
import { List } from "./generated/react/List.js?v=1";
import { Menu } from "./generated/react/Menu.js?v=1";
import { MotionBoundary } from "./generated/react/MotionBoundary.js?v=1";
import { MovementRow } from "./generated/react/MovementRow.js?v=1";
import { Pagination } from "./generated/react/Pagination.js?v=1";
import { PhoneInput } from "./generated/react/PhoneInput.js?v=1";
import { Popover } from "./generated/react/Popover.js?v=1";
import { ProgressIndicator } from "./generated/react/ProgressIndicator.js?v=1";
import { QuickAction } from "./generated/react/QuickAction.js?v=1";
import { RadioButton } from "./generated/react/RadioButton.js?v=1";
import { RouteSummary } from "./generated/react/RouteSummary.js?v=1";
import { Select } from "./generated/react/Select.js?v=1";
import { SegmentedControl } from "./generated/react/SegmentedControl.js?v=1";
import { Skeleton } from "./generated/react/Skeleton.js?v=1";
import { Slider } from "./generated/react/Slider.js?v=1";
import { Spinner } from "./generated/react/Spinner.js?v=1";
import { StationPin } from "./generated/react/StationPin.js?v=1";
import { Stepper } from "./generated/react/Stepper.js?v=1";
import { Switch } from "./generated/react/Switch.js?v=1";
import { Tabs } from "./generated/react/Tabs.js?v=1";
import { Table } from "./generated/react/Table.js?v=1";
import { Tag } from "./generated/react/Tag.js?v=1";
import { Toast } from "./generated/react/Toast.js?v=1";
import { Tooltip } from "./generated/react/Tooltip.js?v=1";
import { TreeView } from "./generated/react/TreeView.js?v=1";
import { TextArea } from "./generated/react/TextArea.js?v=1";
import { patternReactComponents, patternReactIslandWrappers } from "./pattern-react-islands.js?v=10";

const mounted = new WeakMap(); const reactComponents = {
  accordion: Accordion,
  "animated-moment": AnimatedMoment,
  "audit-event": AuditEvent,
  avatar: Avatar,
  badge: Badge,
  "biometric-prompt": BiometricPrompt,
  breadcrumbs: Breadcrumbs,
  button: Button,
  card: Card,
  "card-expiry-input": CardExpiryInput,
  "card-number-input": CardNumberInput,
  "card-security-code-input": CardSecurityCodeInput,
  "card-summary": CardSummary,
  "chart-panel": ChartPanel,
  checkbox: Checkbox,
  chip: Chip,
  "code-input": CodeInput,
  combobox: Combobox,
  "country-selector": CountrySelector,
  "date-picker": DatePicker,
  "date-range-picker": DateRangePicker,
  dialog: Dialog,
  drawer: Drawer,
  "empty-state": EmptyState,
  "error-panel": ErrorPanel,
  "floating-action-button": FloatingActionButton,
  "icon-button": IconButton,
  "inline-validation": InlineValidation,
  input: Input,
  "kpi-tile": KpiTile,
  list: List,
  menu: Menu,
  "motion-boundary": MotionBoundary,
  "movement-row": MovementRow,
  pagination: Pagination,
  "phone-input": PhoneInput,
  popover: Popover,
  "progress-indicator": ProgressIndicator,
  "quick-action": QuickAction,
  "radio-button": RadioButton,
  "route-summary": RouteSummary,
  select: Select,
  "segmented-control": SegmentedControl,
  skeleton: Skeleton,
  slider: Slider,
  spinner: Spinner,
  "station-pin": StationPin,
  stepper: Stepper,
  switch: Switch,
  tabs: Tabs,
  table: Table,
  tag: Tag,
  toast: Toast,
  tooltip: Tooltip,
  "tree-view": TreeView,
  "text-area": TextArea,
  ...patternReactComponents,
};

function InputIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "");
  return React.createElement(Input, {
    ...initialProps,
    value,
    onValueChange: setValue,
  });
}

function CardExpiryInputIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "");
  return React.createElement(CardExpiryInput, {
    ...initialProps,
    value,
    onValueChange: setValue,
  });
}

function CardNumberInputIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "");
  return React.createElement(CardNumberInput, {
    ...initialProps,
    value,
    onValueChange: setValue,
  });
}

function CardSecurityCodeInputIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "");
  return React.createElement(CardSecurityCodeInput, {
    ...initialProps,
    value,
    onValueChange: setValue,
  });
}

function CheckboxIsland({ initialProps }) {
  const [checked, setChecked] = React.useState(Boolean(initialProps.checked));
  return React.createElement(Checkbox, {
    ...initialProps,
    checked,
    onCheckedChange: setChecked,
  });
}
function CodeInputIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "");
  return React.createElement(CodeInput, {
    ...initialProps,
    value,
    onValueChange: setValue,
  });
}

function ComboboxIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "");
  return React.createElement(Combobox, {
    ...initialProps,
    value,
    onValueChange: setValue,
  });
}

function CountrySelectorIsland({ initialProps }) {
  const [country, setCountry] = React.useState(initialProps.country ?? initialProps.value ?? "MX");
  return React.createElement(CountrySelector, {
    ...initialProps,
    country,
    value: country,
    onValueChange: setCountry,
  });
}

function DatePickerIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "");
  return React.createElement(DatePicker, {
    ...initialProps,
    value,
    onValueChange: setValue,
  });
}

function DateRangePickerIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? {});
  return React.createElement(DateRangePicker, {
    ...initialProps,
    value,
    onValueChange: setValue,
  });
}

function PhoneInputIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "");
  const [country, setCountry] = React.useState(initialProps.country ?? "MX");
  return React.createElement(PhoneInput, {
    ...initialProps,
    value,
    country,
    onValueChange: (nationalNumber, meta) => {
      setValue(nationalNumber);
      if (meta?.country) setCountry(meta.country);
    },
  });
}

function PaginationIsland({ initialProps }) {
  const [page, setPage] = React.useState(initialProps.page ?? 1);
  return React.createElement(Pagination, {
    ...initialProps,
    page,
    onPageChange: setPage,
  });
}

function SelectIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "");
  return React.createElement(Select, {
    ...initialProps,
    value,
    onValueChange: setValue,
  });
}

function SegmentedControlIsland({ initialProps }) {
  const fallbackKey = initialProps.items?.find?.((item) => item.selected)?.key
    ?? initialProps.items?.find?.((item) => item.selected)?.value
    ?? initialProps.items?.[0]?.key
    ?? initialProps.items?.[0]?.value
    ?? "";
  const [selectedKey, setSelectedKey] = React.useState(initialProps.selectedKey ?? fallbackKey);
  return React.createElement(SegmentedControl, {
    ...initialProps,
    selectedKey,
    onValueChange: setSelectedKey,
  });
}

function RadioButtonIsland({ initialProps }) {
  const [checked, setChecked] = React.useState(Boolean(initialProps.checked));
  return React.createElement(RadioButton, {
    ...initialProps,
    checked,
    onCheckedChange: setChecked,
  });
}
function SwitchIsland({ initialProps }) {
  const [checked, setChecked] = React.useState(Boolean(initialProps.checked));
  return React.createElement(Switch, {
    ...initialProps,
    checked,
    onCheckedChange: setChecked,
  });
}

function TabsIsland({ initialProps }) {
  const fallbackKey = initialProps.items?.find?.((item) => item.selected)?.key
    ?? initialProps.items?.find?.((item) => item.selected)?.value
    ?? initialProps.items?.[0]?.key
    ?? initialProps.items?.[0]?.value
    ?? "";
  const [selectedKey, setSelectedKey] = React.useState(initialProps.selectedKey ?? fallbackKey);
  return React.createElement(Tabs, {
    ...initialProps,
    selectedKey,
    onValueChange: setSelectedKey,
  });
}

function SliderIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? 0);
  return React.createElement(Slider, {
    ...initialProps,
    value,
    onValueChange: setValue,
  });
}

function TextAreaIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "");
  return React.createElement(TextArea, {
    ...initialProps,
    value,
    onChange: setValue,
  });
}

const reactIslandWrappers = {
  input: InputIsland, "card-expiry-input": CardExpiryInputIsland,
  "card-number-input": CardNumberInputIsland, "card-security-code-input": CardSecurityCodeInputIsland,
  checkbox: CheckboxIsland,
  "code-input": CodeInputIsland, combobox: ComboboxIsland,
  "country-selector": CountrySelectorIsland, "date-picker": DatePickerIsland, "date-range-picker": DateRangePickerIsland,
  "phone-input": PhoneInputIsland, pagination: PaginationIsland, select: SelectIsland,
  "segmented-control": SegmentedControlIsland, "radio-button": RadioButtonIsland,
  switch: SwitchIsland, tabs: TabsIsland, slider: SliderIsland,
  "text-area": TextAreaIsland,
  ...patternReactIslandWrappers,
};

function parseProps(node) { try { return JSON.parse(node.dataset.reactProps ?? "{}"); } catch { return {}; } }

export function setupReactComponentIslands(root = document) {
  for (const node of Array.from(root.querySelectorAll?.("[data-react-component]:not([data-react-mounted='true'])") ?? [])) {
    const Component = reactComponents[node.dataset.reactComponent];
    if (!Component) continue;
    const reactRoot = mounted.get(node) ?? createRoot(node);
    mounted.set(node, reactRoot);
    node.dataset.reactMounted = "true";
    const props = parseProps(node);
    const Island = reactIslandWrappers[node.dataset.reactComponent];
    reactRoot.render(Island ? React.createElement(Island, { initialProps: props }) : React.createElement(Component, props));
  }
}
