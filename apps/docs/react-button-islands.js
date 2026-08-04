import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "./generated/react/Button.js?v=1";

const mounted = new WeakMap();

function parseProps(node) {
  try {
    return JSON.parse(node.dataset.reactProps ?? "{}");
  } catch {
    return {};
  }
}

export function setupReactButtonIslands(root = document) {
  for (const node of Array.from(root.querySelectorAll?.('[data-react-component="button"]:not([data-react-mounted="true"])') ?? [])) {
    const reactRoot = mounted.get(node) ?? createRoot(node);
    mounted.set(node, reactRoot);
    node.dataset.reactMounted = "true";
    reactRoot.render(React.createElement(Button, parseProps(node)));
  }
}
