import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "./generated/react/Button.js?v=1";
import { IconButton } from "./generated/react/IconButton.js?v=1";
import { Input } from "./generated/react/Input.js?v=1";
import { Select } from "./generated/react/Select.js?v=1";

const mounted = new WeakMap();
const reactComponents = {
  button: Button,
  "icon-button": IconButton,
  input: Input,
  select: Select,
};

function InputIsland({ initialProps }) {
  const [value, setValue] = React.useState(initialProps.value ?? "");
  return React.createElement(Input, {
    ...initialProps,
    value,
    onValueChange: setValue,
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
        : node.dataset.reactComponent === "select"
          ? React.createElement(SelectIsland, { initialProps: props })
        : React.createElement(Component, props),
    );
  }
}
