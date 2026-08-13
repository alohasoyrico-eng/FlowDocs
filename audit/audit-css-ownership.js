const { fs, path, docsAppDir, docsCssFile, resolveBoundaryPath, read, readDocsCss, add, result } = require("./audit-context.js");

const docsAllowedComponentMarkupAuthors = new Set([
  "apps/docs/component-demo.js",
  "apps/docs/react-component-islands.js",
]);

const docsAllowedPackageClassTokens = new Map([
  ["apps/docs/docs-layout.js", new Set(["tag"])],
]);

const packageComponentClassRoots = new Set([
  "accordion",
  "animated-moment",
  "audit-event",
  "avatar",
  "badge",
  "biometric-prompt",
  "breadcrumbs",
  "button",
  "card",
  "card-expiry-input",
  "card-number-input",
  "card-security-code-input",
  "card-summary",
  "chart-panel",
  "checkbox",
  "chip",
  "code-input",
  "combobox",
  "country-flag",
  "country-selector",
  "date-picker",
  "date-range-picker",
  "dialog",
  "drawer",
  "empty-state",
  "error-panel",
  "fab",
  "field",
  "icon-button",
  "inline-validation",
  "input",
  "kpi-tile",
  "list",
  "menu",
  "motion-boundary",
  "movement-row",
  "pagination",
  "phone-input",
  "popover",
  "progress",
  "quick-action",
  "radio",
  "route-summary",
  "segmented-control",
  "select",
  "select-control",
  "skeleton",
  "slider",
  "spinner",
  "station-pin",
  "stepper",
  "switch",
  "table",
  "tabs",
  "tag",
  "text-area",
  "toast",
  "tooltip",
  "tree-view",
]);

function checkDocsComponentCssOwnership() {
  const cssIndex = read(docsCssFile);
  const removedDemoFiles = [
    path.join(docsAppDir, "gold-final-keep-component-demos.js"),
    path.join(docsAppDir, "styles/05q-final-keep-components-docs.css"),
  ];
  for (const file of removedDemoFiles) {
    if (fs.existsSync(file)) {
      add("errors", file, 1, "Removed docs-owned component demo implementation must not exist; render package components through component-demo.js and the package registry.");
    }
  }
  if (/05q-final-keep-components-docs\.css/.test(cssIndex)) {
    add("errors", docsCssFile, 1, "Removed docs-owned component CSS import must not return; component anatomy belongs to packages/components.");
  }

  const cssText = readDocsCss();
  const removedSelectors = [".biometric-prompt-demo", ".breadcrumbs-demo", ".pagination-demo", ".audit-event-demo", ".error-panel-demo", ".tree-view-demo", ".motion-boundary-demo", ".animated-moment-demo", ".progress-indicator-demo"];
  for (const selector of removedSelectors) {
    if (cssText.includes(selector)) add("errors", docsCssFile, 1, `Docs CSS must not own package component selector ${selector}.`);
  }

  const docsInputCss = path.join(docsAppDir, "styles/04c-input-docs.css");
  if (fs.existsSync(docsInputCss) && /--comp-input-/.test(read(docsInputCss))) {
    add("errors", docsInputCss, 1, "Input docs CSS must not declare component anatomy tokens; Input anatomy belongs to packages/components.");
  }

  for (const file of walkFiles(path.join(docsAppDir, "styles"), (candidate) => /\.css$/.test(candidate))) {
    const text = read(file);
    const broadButtonSelector = /(^|})\s*\.button(?::not\(\.docs-package-demo\)|[\s.#:[,{>+~])/gm;
    let match;
    while ((match = broadButtonSelector.exec(text))) {
      add("errors", file, lineForIndex(text, match.index + match[1].length), "Docs CSS must not style .button directly; Button anatomy belongs to packages/components and docs may only compose package Button demos.");
    }
    const buttonAnatomyToken = /--comp-button-[a-z0-9-]+/g;
    while ((match = buttonAnatomyToken.exec(text))) {
      add("errors", file, lineForIndex(text, match.index), "Docs CSS must not declare Button component anatomy tokens; Button anatomy belongs to packages/components.");
    }
  }

  for (const file of walkFiles(docsAppDir, (candidate) => /\.css$/.test(candidate))) {
    const text = read(file);
    const customSpinnerIndex = text.search(/(?:__spinner|@keyframes\s+[a-z0-9-]*spin|border-block-start-color:\s*transparent)/i);
    if (customSpinnerIndex >= 0) {
      add("errors", file, lineForIndex(text, customSpinnerIndex), "Docs must not define custom loading spinner anatomy; use the package Spinner component.");
    }
  }
}

function checkDocsPackageMarkupOwnership() {
  for (const file of walkFiles(docsAppDir, (candidate) => /\.(?:html|js)$/.test(candidate))) {
    const relativeFile = normalize(path.relative(process.cwd(), file));
    if (docsAllowedComponentMarkupAuthors.has(relativeFile)) continue;
    const source = read(file);
    const classStrings = [...source.matchAll(/\bclass(?:Name)?\s*[:=]\s*["'`]([^"'`]+)["'`]/g)];
    for (const match of classStrings) {
      const tokens = match[1].split(/\s+/).filter(Boolean);
      for (const token of tokens) {
        const rootToken = packageRootForClassToken(token);
        if (!rootToken) continue;
        if (docsAllowedPackageClassTokens.get(relativeFile)?.has(rootToken)) continue;
        add(
          "errors",
          file,
          lineForIndex(source, match.index),
          `Docs must not author Package component class "${token}" directly; compose ${rootToken} through componentDemo(), packageDemo(), or a React island.`
        );
      }
    }
  }
}

function checkPatternComponentBoundaryOwnership() {
  const bottomSheetCss = path.join(docsAppDir, "styles/05d-bottom-sheet-docs.css");
  if (fs.existsSync(bottomSheetCss)) {
    add("errors", bottomSheetCss, 1, "FlowDocs must not own Bottom Sheet CSS; compose the Flow React pattern or package components instead.");
  }

  for (const file of walkFiles(docsAppDir, (candidate) => /\.(?:css|js)$/.test(candidate))) {
    const text = read(file);
    const forbidden = [
      {
        pattern: /--(?:comp|pattern)-bottom-sheet-[a-z0-9-]+/g,
        message: "Bottom Sheet tokens must not be declared in FlowDocs; the pattern boundary belongs to Flow.",
      },
      {
        pattern: /\.bottom-sheet-demo(?:__|[\s,{.#:[>])/g,
        message: "FlowDocs must not render or style the legacy Bottom Sheet demo; use the Flow React pattern island.",
      },
      {
        pattern: /data-pattern-sheet=["']bottom-sheet["']/g,
        message: "FlowDocs must not publish a parallel Bottom Sheet demo API; use data-flow-pattern from the Flow React pattern.",
      },
    ];
    for (const check of forbidden) {
      let match;
      while ((match = check.pattern.exec(text))) {
        add("errors", file, lineForIndex(text, match.index), check.message);
      }
    }
  }

  const mobileInteractions = path.join(docsAppDir, "pattern-mobile-interactions.js");
  if (fs.existsSync(mobileInteractions)) {
    const text = read(mobileInteractions);
    const staleSelector = text.indexOf(".bottom-sheet__scrim");
    if (staleSelector >= 0) {
      add("errors", mobileInteractions, lineForIndex(text, staleSelector), "Bottom Sheet pattern interactions must target pattern markup, not removed package Bottom Sheet classes.");
    }
  }
}

function walkFiles(dir, matcher, output = []) {
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "generated" || entry.name === "node_modules" || entry.name === "vendor") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, matcher, output);
      continue;
    }
    if (matcher(fullPath)) output.push(fullPath);
  }
  return output;
}

function lineForIndex(text, index) {
  return text.slice(0, index).split("\n").length;
}

function countMatches(text, pattern) {
  pattern.lastIndex = 0;
  return [...text.matchAll(pattern)].length;
}

function countMatchesByLine(text, pattern, shouldCountLine = () => true) {
  return text.split("\n").reduce((total, line) => {
    if (!shouldCountLine(line)) return total;
    pattern.lastIndex = 0;
    return total + [...line.matchAll(pattern)].length;
  }, 0);
}

function countRoleGridDebt(text, file) {
  const roleGridClassToken = /(?:^|[^A-Za-z0-9_-])role-grid(?![A-Za-z0-9_-])/g;
  if (!/\.js$/.test(file)) return countMatches(text, roleGridClassToken);
  return countMatchesByLine(text, roleGridClassToken, (line) => !line.includes("data-doc-primitive=") && !line.includes("const classes ="));
}

function countDocsPrimitiveDebt(text, file, pattern) {
  if (!/\.js$/.test(file)) return countMatches(text, pattern);
  return countMatchesByLine(text, pattern, (line) => !line.includes("data-doc-primitive=") && !line.includes("const classes ="));
}

function countCardLikeDocDebt(text) {
  return countMatchesByLine(
    text,
    /<article\b|class="[^"]*(?:doc-card|docs-card|info-card|variant-card|card-like)/g,
    (line) => !line.includes("data-doc-primitive="),
  );
}

function countLinkCardDebt(text) {
  return countMatchesByLine(
    text,
    /cardLink\(/g,
    (line) => !line.includes("data-doc-primitive="),
  );
}

function checkPublicClassNamespaceOwnership() {
  const sourceFiles = [
    ...walkFiles(docsAppDir, (file) => /\.(css|html|js)$/.test(file)),
    ...walkFiles(path.dirname(resolveBoundaryPath("#design-system/components", "packages/components/src/index.js")), (file) => /\.js$/.test(file)),
    ...walkFiles(path.dirname(resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css")), (file) => /\.css$/.test(file)),
  ];
  const checks = [
    {
      pattern: /(^|[,{]\s*)\.system-[a-z0-9_-]+/gim,
      message: "Public CSS classes must not use the system- prefix; reserve Design System naming for packages and token namespaces.",
    },
    {
      pattern: /class(?:Name)?\s*[:=]\s*["'`][^"'`]*\bf[l]ow-[a-z0-9_-]+/gim,
      message: `Public markup classes must not use the ${"fl" + "ow-"} prefix; use the component or primitive class name instead.`,
    },
    {
      pattern: /classList\.(?:add|remove|toggle)\(\s*["'`]system-[a-z0-9_-]+/gim,
      message: "Runtime class mutations must not use the system- prefix; use the component or primitive class name instead.",
    },
  ];
  for (const file of sourceFiles) {
    const text = read(file);
    for (const check of checks) {
      check.pattern.lastIndex = 0;
      let match;
      while ((match = check.pattern.exec(text))) {
        add("errors", file, lineForIndex(text, match.index), check.message);
      }
    }
  }
}

function packageRootForClassToken(token) {
  for (const rootToken of packageComponentClassRoots) {
    if (token === rootToken || token.startsWith(`${rootToken}__`) || token.startsWith(`${rootToken}--`)) return rootToken;
  }
  return "";
}

function normalize(value) {
  return value.split(path.sep).join("/");
}

function checkDocsPackageImportBoundary() {
  const docsJsFiles = walkFiles(docsAppDir, (file) => /\.js$/.test(file));
  const forbiddenComponentImport = /from\s+["'](?:\.\.\/)+packages\/components\/src\//;
  const forbiddenContentSource = /(?:\.\.\/)+packages\/system-(?:content|specs)\//;
  for (const file of docsJsFiles) {
    const text = read(file);
    const match = forbiddenComponentImport.exec(text);
    if (match) {
      add("errors", file, lineForIndex(text, match.index), "Docs must consume Package components through #design-system/components, not package source paths.");
    }
    const contentMatch = forbiddenContentSource.exec(text);
    if (contentMatch) {
      add("errors", file, lineForIndex(text, contentMatch.index), "Docs runtime must consume generated content bundles, not Design System content/spec source paths.");
    }
  }

  const indexFile = path.join(docsAppDir, "index.html");
  const indexText = read(indexFile);
  if (!indexText.includes('"#design-system/components"')) {
    add("errors", indexFile, 1, "Docs must declare a #design-system/components import map entry while running in the monorepo browser.");
  }
  if (indexText.includes("../../packages/")) {
    add("errors", indexFile, 1, "Docs browser import maps must target generated assets, not package source paths.");
  }
  if (!indexText.includes("./generated/components/index.js")) {
    add("errors", indexFile, 1, "Docs browser import map must target the generated Package component JS bridge.");
  }

  const docsCss = read(docsCssFile);
  if (docsCss.includes("../../packages/components/styles/")) {
    add("errors", docsCssFile, 1, "Docs CSS must consume the generated Package component CSS asset, not package source paths.");
  }
  if (docsCss.includes("./generated/package-components.css") || docsCss.includes("./generated/system-tokens.css")) {
    add("errors", docsCssFile, 1, "Docs CSS generated asset imports must use generic names, not prefixed file names.");
  }
  if (!docsCss.includes("./generated/components.css")) {
    add("errors", docsCssFile, 1, "Docs CSS must import the generated Package component CSS asset.");
  }

  const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
  const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
  const componentModuleDir = path.dirname(resolveBoundaryPath("#design-system/components", "packages/components/src/index.js"));
  const generatedComponentModuleDir = path.join(docsAppDir, "generated/components");
  const generatedCssFile = path.join(docsAppDir, "generated/components.css");
  const generatedTokenCssFile = path.join(docsAppDir, "generated/tokens.css");
  if (!fs.existsSync(path.join(generatedComponentModuleDir, "index.js"))) {
    add("errors", generatedComponentModuleDir, 1, "Generated Package component JS bridge is missing; run npm run build:docs-assets.");
    return;
  }
  if (!fs.existsSync(generatedCssFile)) {
    add("errors", generatedCssFile, 1, "Generated Package component CSS asset is missing; run npm run build:docs-assets.");
    return;
  }
  if (!fs.existsSync(generatedTokenCssFile)) {
    add("errors", generatedTokenCssFile, 1, "Generated Design System token CSS asset is missing; run npm run build:docs-assets.");
    return;
  }
  const stripHeader = (text) => text.replace(/^\/\* Generated by scripts\/build-docs-assets\.mjs\.\n\s+Source: [^\n]+\n\s+Do not edit this file by hand\. \*\/\n/, "");
  const generatedCss = stripHeader(read(generatedCssFile));
  const componentCss = read(componentCssFile).replace(
    /@import "\.\.\/\.\.\/tokens\/styles\/tokens\.css\?v=\d+";/,
    '@import "./tokens.css?v=1";'
  );
  if (generatedCss !== componentCss) {
    add("errors", generatedCssFile, 1, "Generated Package component CSS asset is stale; run npm run build:docs-assets.");
  }
  if (stripHeader(read(generatedTokenCssFile)) !== read(tokenCssFile)) {
    add("errors", generatedTokenCssFile, 1, "Generated Design System token CSS asset is stale; run npm run build:docs-assets.");
  }

  for (const sourceFile of walkFiles(componentModuleDir, (file) => /\.js$/.test(file))) {
    const relativeFile = path.relative(componentModuleDir, sourceFile);
    const generatedFile = path.join(generatedComponentModuleDir, relativeFile);
    if (!fs.existsSync(generatedFile) || read(generatedFile) !== read(sourceFile)) {
      add("errors", generatedComponentModuleDir, 1, "Generated Package component JS bridge is stale; run npm run build:docs-assets.");
      break;
    }
  }
}

function checkDocsVisualDebtInventory() {
  const jsFiles = walkFiles(docsAppDir, (file) => /\.js$/.test(file));
  const cssFiles = walkFiles(path.join(docsAppDir, "styles"), (file) => /\.css$/.test(file));
  const trackedFamilies = [
    {
      id: "decorative-backgrounds",
      description: "Gradients, masks, and page textures authored in FlowDocs CSS instead of a governed Flow primitive/foundation.",
      pattern: /(?:radial-gradient|linear-gradient|mask-image|background-size:\s*var\(--sys-frame-doc-grid)/g,
      files: cssFiles,
    },
    {
      id: "standard-chip",
      description: "Docs-owned chip-like markup that should be evaluated against Chip/Badge/Tag or an editorial primitive.",
      pattern: /standard-chip/g,
      files: [...jsFiles, ...cssFiles],
    },
    {
      id: "role-grid",
      description: "Docs-owned repeated card grid used across detail pages; excludes JS callsites already marked as governed docs primitives.",
      pattern: /(?:^|[^A-Za-z0-9_-])role-grid(?![A-Za-z0-9_-])/g,
      files: [...jsFiles, ...cssFiles],
      count: countRoleGridDebt,
    },
    {
      id: "props-table",
      description: "Docs-owned property table layout used as contract/API table; candidate for Table or docs data primitive boundary.",
      pattern: /props-table/g,
      files: [...jsFiles, ...cssFiles],
      count: (text, file) => countDocsPrimitiveDebt(text, file, /props-table/g),
    },
    {
      id: "card-like-doc-markup",
      description: "Docs-authored article/card class patterns that need ownership review against Card/Surface; governed docs primitives are excluded.",
      pattern: /<article\b|class="[^"]*(?:doc-card|docs-card|info-card|variant-card|card-like)/g,
      files: jsFiles,
      count: countCardLikeDocDebt,
    },
    {
      id: "link-card-markup",
      description: "Docs-owned navigable card-link helper/calls without a Flow LinkCard/actionable Card contract; these remain explicit debt until the system owns the pattern.",
      pattern: /cardLink\(/g,
      files: jsFiles,
      count: countLinkCardDebt,
    },
  ];

  result.inventory.docsVisualDebt = trackedFamilies.map((family) => {
    const hotspots = family.files
      .map((file) => {
        const text = read(file);
        return {
          file: normalize(path.relative(process.cwd(), file)),
          count: family.count ? family.count(text, file) : countMatches(text, family.pattern),
        };
      })
      .filter((entry) => entry.count > 0)
      .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));
    return {
      id: family.id,
      description: family.description,
      total: hotspots.reduce((sum, entry) => sum + entry.count, 0),
      files: hotspots.length,
      hotspots: hotspots.slice(0, 12),
    };
  });
}

module.exports = {
  checkDocsComponentCssOwnership,
  checkDocsPackageMarkupOwnership,
  checkPatternComponentBoundaryOwnership,
  checkPublicClassNamespaceOwnership,
  checkDocsPackageImportBoundary,
  checkDocsVisualDebtInventory,
};
