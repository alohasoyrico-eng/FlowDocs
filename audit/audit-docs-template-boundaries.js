const { fs, path, docsAppDir, read, add, result } = require("./audit-context.js");

const inventoryOnlyMode = process.env.FLOWDOCS_TEMPLATE_BOUNDARY_INVENTORY === "1";
const strictOwnerFilter = (process.env.FLOWDOCS_TEMPLATE_BOUNDARY_STRICT_OWNER ?? "")
  .split(",")
  .map((owner) => owner.trim())
  .filter(Boolean);
const strictOwnerSet = new Set(strictOwnerFilter);
const strictMode = !inventoryOnlyMode && (process.env.FLOWDOCS_TEMPLATE_BOUNDARY_STRICT === "1" || strictOwnerSet.size === 0);

const governedBoundaries = [
  {
    id: "docs-shell-layout",
    owner: "DocsShellTemplate + documentation-page-shell",
    severity: "shell",
    patterns: [
      { pattern: /layout-grid-overlay/g, label: "legacy layout-grid-overlay" },
      { pattern: /docs-shell-navigation/g, label: "legacy docs-shell-navigation" },
      { pattern: /docsReactShell(?:Topbar|Sidebar)/g, label: "docsReactShell mount" },
    ],
    strictPatterns: [
      { pattern: /class=["'`](?![^"'`]*docs-react-shell-sidebar-mount)(?=[^"'`]*(?:^|\s)sidebar(?:\s|$))[^"'`]*["'`]/g, label: "manual sidebar class" },
      { pattern: /id=["'`]docs-shell-navigation["'`]/g, label: "manual docs shell navigation id" },
    ],
  },
  {
    id: "documentation-hero",
    owner: "documentation-hero",
    severity: "page",
    patterns: [
      { pattern: /(?:class=["'`][^"'`]*(?:^|\s)(?:hero|page-hero|detail-hero|reference-hero|hero-copy|hero-actions|hero-action|hero-visual)(?:\s|$)[^"'`]*["'`]|(?<![A-Za-z0-9_])\.(?:hero|page-hero|detail-hero|reference-hero|hero-copy|hero-actions|hero-action|hero-visual)(?![A-Za-z0-9_-]))/g, label: "legacy docs hero class" },
      { pattern: /home-hero|data-illustration-slot=["'`]home-hero["'`]|data-illustration-id=["'`]home-hero["'`]/g, label: "legacy docs hero slot" },
      { pattern: /layout-grid-overlay|grid overlay/g, label: "legacy background/grid treatment" },
    ],
  },
  {
    id: "documentation-section",
    owner: "documentation-section",
    severity: "section",
    patterns: [
      { pattern: /docs-section-surface/g, label: "docs-section-surface" },
      { pattern: /detail-section-surface/g, label: "detail-section-surface" },
      { pattern: /(?:\.(?:doc-panel|docs-panel)\b|class=["'`][^"'`]*(?:^|\s)(?:doc-panel|docs-panel)(?:\s|$))/g, label: "docs panel wrapper" },
      { pattern: /(?:button-demo-grid|state-behavior-grid|viewport-doc-grid|(?:^|[^A-Za-z0-9_-])role-grid(?![A-Za-z0-9_-]))/g, label: "local docs matrix/grid" },
    ],
  },
  {
    id: "demo-preview-frame",
    owner: "demo-preview-frame",
    severity: "demo",
    patterns: [
      { pattern: /(?<![A-Za-z0-9_-])(?:docs-demo-layout|docs-template-demo|pattern-mobile-demo|simple-demo-row|simple-viewport-demo)(?![A-Za-z0-9_-])/g, label: "local demo frame" },
      { pattern: /(?<![A-Za-z0-9_-])(?:playground-layout|playground-preview)(?![A-Za-z0-9_-])/g, label: "local playground frame" },
      { pattern: /(?<![A-Za-z0-9_-])(?:data-component-preview|data-component-markup)(?![A-Za-z0-9_-])/g, label: "local demo preview/source slot" },
    ],
  },
  {
    id: "on-this-page-nav",
    owner: "on-this-page-nav",
    severity: "local-nav",
    patterns: [
      { pattern: /detail-tablist|tablist|on-this-page|toc-|table-of-contents/g, label: "local page navigation" },
      { pattern: /data-detail-tab|data-tab-target/g, label: "local tab state hook" },
    ],
  },
  {
    id: "artifact-metadata-bar",
    owner: "artifact-metadata-bar",
    severity: "metadata",
    patterns: [
      { pattern: /(?<![A-Za-z0-9_-])(?:card-meta-row|artifact-meta|docs-link-card|artifact-card|metadata-pill)(?![A-Za-z0-9_-])/g, label: "local artifact metadata/card wrapper" },
      { pattern: /class=["'`][^"'`]*(?:\bmeta\b|\bpill\b)[^"'`]*["'`]/g, label: "local meta/pill class" },
    ],
  },
  {
    id: "code-block",
    owner: "Code Block",
    severity: "source",
    allowedFiles: new Set(["apps/docs/docs-code-block.js"]),
    patterns: [
      { pattern: /<pre\b/g, label: "raw pre" },
      { pattern: /data-component-markup/g, label: "legacy component source slot" },
    ],
  },
  {
    id: "copy-button",
    owner: "Copy Button",
    severity: "source",
    patterns: [
      { pattern: /copyToClipboard|navigator\.clipboard|data-copy|copy-button|copyButton/g, label: "local copy control" },
    ],
  },
];

const allowedBoundaryConsumers = [
  {
    id: "on-this-page-nav",
    files: new Set(["apps/docs/stateful-component-interactions.js"]),
    patterns: [/\.docs-detail-tabs-nav/g, /\.detail-tablist/g],
  },
  {
    id: "artifact-metadata-bar",
    files: new Set(["apps/docs/catalog-renderers.js"]),
    patterns: [/artifactMetadataBar/g, /card-meta-row/g],
  },
  {
    id: "copy-button",
    files: new Set(["apps/docs/component-demo.js"]),
    patterns: [/componentDemoProps\("copy-button"/g, /reactIsland\("copy-button"/g, /component === "copy-button"/g],
  },
  {
    id: "copy-button",
    files: new Set(["apps/docs/react-component-islands.js"]),
    patterns: [/import \{ CopyButton \}/g, /"copy-button": CopyButton/g],
  },
];

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

function relative(file) {
  return path.relative(process.cwd(), file).replace(/\\/g, "/");
}

function isAllowedBoundaryConsumer(check, fileKey, text, match) {
  const allow = allowedBoundaryConsumers.find((entry) => entry.id === check.id && entry.files.has(fileKey));
  if (!allow) return false;
  const lineStart = text.lastIndexOf("\n", match.index) + 1;
  const lineEnd = text.indexOf("\n", match.index);
  const line = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd);
  return allow.patterns.some((pattern) => {
    pattern.lastIndex = 0;
    if (pattern.test(line)) return true;
    pattern.lastIndex = 0;
    let allowedMatch;
    while ((allowedMatch = pattern.exec(text))) {
      if (allowedMatch.index === match.index) return true;
    }
    return false;
  });
}

function collectMatches(file, text, check) {
  const matches = [];
  const fileKey = relative(file);
  for (const entry of check.patterns) {
    entry.pattern.lastIndex = 0;
    let match;
    while ((match = entry.pattern.exec(text))) {
      if (isAllowedBoundaryConsumer(check, fileKey, text, match)) continue;
      matches.push({
        label: entry.label,
        line: lineForIndex(text, match.index),
      });
    }
  }
  return matches;
}

function collectStrictMatches(file, text, check) {
  const matches = [];
  const fileKey = relative(file);
  for (const entry of check.strictPatterns ?? check.patterns) {
    entry.pattern.lastIndex = 0;
    let match;
    while ((match = entry.pattern.exec(text))) {
      if (isAllowedBoundaryConsumer(check, fileKey, text, match)) continue;
      matches.push({
        label: entry.label,
        line: lineForIndex(text, match.index),
      });
    }
  }
  return matches;
}

function summarizeBoundary(check, matchesByFile) {
  const files = Object.keys(matchesByFile).sort();
  const total = files.reduce((sum, file) => sum + matchesByFile[file].length, 0);
  const examples = files.slice(0, 8).map((file) => ({
    file,
    line: matchesByFile[file][0].line,
    label: matchesByFile[file][0].label,
  }));
  return {
    id: check.id,
    owner: check.owner,
    severity: check.severity,
    total,
    files: files.length,
    examples,
  };
}

function checkDocsTemplateBoundaries() {
  const sourceFiles = walkFiles(docsAppDir, (file) => /\.(?:js|html|css)$/.test(file));
  const inventory = [];
  const strictFindings = [];
  const strictEnabled = strictMode || strictOwnerSet.size > 0;

  for (const check of governedBoundaries) {
    const matchesByFile = {};
    const strictMatchesByFile = {};
    const checkStrict = strictMode || strictOwnerSet.has(check.id);

    for (const file of sourceFiles) {
      const text = read(file);
      const fileKey = relative(file);
      const matches = check.allowedFiles?.has(fileKey) ? [] : collectMatches(file, text, check);
      if (matches.length) matchesByFile[relative(file)] = matches;

      if (checkStrict) {
        const strictMatches = check.allowedFiles?.has(fileKey) ? [] : collectStrictMatches(file, text, check);
        if (strictMatches.length) strictMatchesByFile[relative(file)] = strictMatches;
      }
    }

    if (Object.keys(matchesByFile).length) inventory.push(summarizeBoundary(check, matchesByFile));
    if (Object.keys(strictMatchesByFile).length) {
      strictFindings.push(summarizeBoundary(check, strictMatchesByFile));
    }
  }

  result.inventory.docsTemplateBoundaryDebt = {
    mode: strictMode ? "strict" : strictOwnerSet.size ? "strict-owner" : "inventory",
    strictOwners: strictMode ? "all" : strictOwnerFilter,
    boundaries: inventory,
    strictFindings,
  };

  if (!strictEnabled) {
    result.info.push({
      check: "docs-template-boundaries",
      message: `Docs template boundary audit is in inventory mode. Found ${inventory.reduce((sum, entry) => sum + entry.total, 0)} local boundary signals across ${inventory.length} governed owners. Default mode is strict; set FLOWDOCS_TEMPLATE_BOUNDARY_INVENTORY=1 only for forensic inventory.`,
    });
    return;
  }

  if (strictOwnerSet.size) {
    const unknownOwners = strictOwnerFilter.filter((id) => !governedBoundaries.some((check) => check.id === id));
    for (const owner of unknownOwners) {
      add("errors", process.cwd(), 1, `Unknown FlowDocs template boundary strict owner: ${owner}.`);
    }
  }

  for (const finding of strictFindings) {
    for (const example of finding.examples) {
      add("errors", path.join(process.cwd(), example.file), example.line, `FlowDocs strict template boundary violation: ${example.label} is owned by ${finding.owner}.`);
    }
  }
}

module.exports = { checkDocsTemplateBoundaries };
