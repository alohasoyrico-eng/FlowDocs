import React from "react";
import { DocsCollectionTemplate } from "./generated/react/templates/DocsCollectionTemplate.js?v=1";
import { DocsHomeTemplate } from "./generated/react/templates/DocsHomeTemplate.js?v=1";

function LegacyHtmlContentSlot({ markup = "", slot = "content", exit = "typed-react-children" }) {
  return React.createElement("div", {
    "data-legacy-html-slot": slot,
    "data-legacy-html-owner": "FlowDocs",
    "data-legacy-html-exit": exit,
    "data-legacy-html-slot-status": "active",
    dangerouslySetInnerHTML: { __html: markup },
  });
}

function DocsHomeTemplateIsland({ initialProps }) {
  const { coverageHtml = "", heroVisualHtml = "", statusHtml = "", childrenHtml = "", ...props } = initialProps;
  return React.createElement(DocsHomeTemplate, {
    ...props,
    heroVisual: heroVisualHtml
      ? React.createElement(LegacyHtmlContentSlot, {
        markup: heroVisualHtml,
        slot: "home-hero-visual",
        exit: "typed-docs-home-hero-visual",
      })
      : undefined,
    coverage: React.createElement(LegacyHtmlContentSlot, {
      markup: coverageHtml,
      slot: "home-coverage",
      exit: "typed-docs-home-coverage",
    }),
    status: React.createElement(LegacyHtmlContentSlot, {
      markup: statusHtml,
      slot: "home-status",
      exit: "typed-docs-home-status",
    }),
  }, childrenHtml
    ? React.createElement(LegacyHtmlContentSlot, {
      markup: childrenHtml,
      slot: "home-sections",
      exit: "typed-docs-home-sections",
    })
    : null);
}

function DocsCollectionTemplateIsland({ initialProps }) {
  const { childrenHtml = "", ...props } = initialProps;
  return React.createElement(DocsCollectionTemplate, props, React.createElement(LegacyHtmlContentSlot, {
    markup: childrenHtml,
    slot: "collection-grid",
    exit: "typed-docs-collection-grid",
  }));
}

export const docsTemplateReactComponents = {
  "docs-collection-template": DocsCollectionTemplate,
  "docs-home-template": DocsHomeTemplate,
};

export const docsTemplateReactIslandWrappers = {
  "docs-collection-template": DocsCollectionTemplateIsland,
  "docs-home-template": DocsHomeTemplateIsland,
};
