import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "./generated/react/Button.js?v=1";
import { IconButton } from "./generated/react/IconButton.js?v=1";

const mounted = new WeakMap();
const reactComponents = {
  button: Button,
  "icon-button": IconButton,
};

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
    reactRoot.render(React.createElement(Component, parseProps(node)));
  }
}
