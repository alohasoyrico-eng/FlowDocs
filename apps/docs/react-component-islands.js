import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "./generated/react/Button.js?v=1";
import { CardExpiryInput } from "./generated/react/CardExpiryInput.js?v=1";
import { CardNumberInput } from "./generated/react/CardNumberInput.js?v=1";
import { Checkbox } from "./generated/react/Checkbox.js?v=1";
import { IconButton } from "./generated/react/IconButton.js?v=1";
import { Input } from "./generated/react/Input.js?v=1";
import { RadioButton } from "./generated/react/RadioButton.js?v=1";
import { Select } from "./generated/react/Select.js?v=1";
import { Switch } from "./generated/react/Switch.js?v=1";
import { TextArea } from "./generated/react/TextArea.js?v=1";

const mounted = new WeakMap();
const reactComponents = {
  button: Button,
  "card-expiry-input": CardExpiryInput,
  "card-number-input": CardNumberInput,
  checkbox: Checkbox,
  "icon-button": IconButton,
  input: Input,
  "radio-button": RadioButton,
  select: Select,
  switch: Switch,
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

function CheckboxIsland({ initialProps }) {
  const [checked, setChecked] = React.useState(Boolean(initialProps.checked));
  return React.createElement(Checkbox, {
    ...initialProps,
    checked,
    onCheckedChange: setChecked,
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
        : node.dataset.reactComponent === "checkbox"
          ? React.createElement(CheckboxIsland, { initialProps: props })
        : node.dataset.reactComponent === "select"
          ? React.createElement(SelectIsland, { initialProps: props })
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
