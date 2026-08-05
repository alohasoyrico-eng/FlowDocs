import React from "react";
import { createRoot } from "react-dom/client";
import { Avatar } from "./generated/react/Avatar.js?v=1";
import { Badge } from "./generated/react/Badge.js?v=1";
import { Button } from "./generated/react/Button.js?v=1";
import { CardExpiryInput } from "./generated/react/CardExpiryInput.js?v=1";
import { CardNumberInput } from "./generated/react/CardNumberInput.js?v=1";
import { CardSecurityCodeInput } from "./generated/react/CardSecurityCodeInput.js?v=1";
import { Checkbox } from "./generated/react/Checkbox.js?v=1";
import { Chip } from "./generated/react/Chip.js?v=1";
import { CodeInput } from "./generated/react/CodeInput.js?v=1";
import { DatePicker } from "./generated/react/DatePicker.js?v=1";
import { DateRangePicker } from "./generated/react/DateRangePicker.js?v=1";
import { EmptyState } from "./generated/react/EmptyState.js?v=1";
import { ErrorPanel } from "./generated/react/ErrorPanel.js?v=1";
import { IconButton } from "./generated/react/IconButton.js?v=1";
import { InlineValidation } from "./generated/react/InlineValidation.js?v=1";
import { Input } from "./generated/react/Input.js?v=1";
import { PhoneInput } from "./generated/react/PhoneInput.js?v=1";
import { ProgressIndicator } from "./generated/react/ProgressIndicator.js?v=1";
import { RadioButton } from "./generated/react/RadioButton.js?v=1";
import { Select } from "./generated/react/Select.js?v=1";
import { SegmentedControl } from "./generated/react/SegmentedControl.js?v=1";
import { Skeleton } from "./generated/react/Skeleton.js?v=1";
import { Spinner } from "./generated/react/Spinner.js?v=1";
import { Switch } from "./generated/react/Switch.js?v=1";
import { Tag } from "./generated/react/Tag.js?v=1";
import { Tooltip } from "./generated/react/Tooltip.js?v=1";
import { TextArea } from "./generated/react/TextArea.js?v=1";

const mounted = new WeakMap();
const reactComponents = {
  avatar: Avatar,
  badge: Badge,
  button: Button,
  "card-expiry-input": CardExpiryInput,
  "card-number-input": CardNumberInput,
  "card-security-code-input": CardSecurityCodeInput,
  checkbox: Checkbox,
  chip: Chip,
  "code-input": CodeInput,
  "date-picker": DatePicker,
  "date-range-picker": DateRangePicker,
  "empty-state": EmptyState,
  "error-panel": ErrorPanel,
  "icon-button": IconButton,
  "inline-validation": InlineValidation,
  input: Input,
  "phone-input": PhoneInput,
  "progress-indicator": ProgressIndicator,
  "radio-button": RadioButton,
  select: Select,
  "segmented-control": SegmentedControl,
  skeleton: Skeleton,
  spinner: Spinner,
  switch: Switch,
  tag: Tag,
  tooltip: Tooltip,
  "text-area": TextArea,
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

function TextAreaIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "");
  return React.createElement(TextArea, {
    ...initialProps,
    value,
    onChange: setValue,
  });
}

function parseProps(node) {
  try {
    return JSON.parse(node.dataset.reactProps ?? "{}");
  } catch {
    return {};
  }
}

export function setupReactComponentIslands(root = document) {
  for (const node of Array.from(root.querySelectorAll?.("[data-react-component]:not([data-react-mounted='true'])") ?? [])) {
    const Component = reactComponents[node.dataset.reactComponent];
    if (!Component) continue;
    const reactRoot = mounted.get(node) ?? createRoot(node);
    mounted.set(node, reactRoot);
    node.dataset.reactMounted = "true";
    const props = parseProps(node);
    reactRoot.render(
      node.dataset.reactComponent === "input"
        ? React.createElement(InputIsland, { initialProps: props })
        : node.dataset.reactComponent === "card-expiry-input"
          ? React.createElement(CardExpiryInputIsland, { initialProps: props })
        : node.dataset.reactComponent === "card-number-input"
          ? React.createElement(CardNumberInputIsland, { initialProps: props })
        : node.dataset.reactComponent === "card-security-code-input"
          ? React.createElement(CardSecurityCodeInputIsland, { initialProps: props })
        : node.dataset.reactComponent === "checkbox"
          ? React.createElement(CheckboxIsland, { initialProps: props })
        : node.dataset.reactComponent === "code-input"
          ? React.createElement(CodeInputIsland, { initialProps: props })
        : node.dataset.reactComponent === "date-picker"
          ? React.createElement(DatePickerIsland, { initialProps: props })
        : node.dataset.reactComponent === "date-range-picker"
          ? React.createElement(DateRangePickerIsland, { initialProps: props })
        : node.dataset.reactComponent === "phone-input"
          ? React.createElement(PhoneInputIsland, { initialProps: props })
        : node.dataset.reactComponent === "select"
          ? React.createElement(SelectIsland, { initialProps: props })
        : node.dataset.reactComponent === "segmented-control"
          ? React.createElement(SegmentedControlIsland, { initialProps: props })
        : node.dataset.reactComponent === "radio-button"
          ? React.createElement(RadioButtonIsland, { initialProps: props })
        : node.dataset.reactComponent === "switch"
          ? React.createElement(SwitchIsland, { initialProps: props })
        : node.dataset.reactComponent === "text-area"
          ? React.createElement(TextAreaIsland, { initialProps: props })
        : React.createElement(Component, props),
    );
  }
}
