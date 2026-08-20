const {
  fs,
  path,
  docsAppDir,
  docsAppFile,
  docsCatalogRenderersFile,
  docsChromeFile,
  docsContentSourcesFile,
  docsDetailTabsFile,
  docsDetailTabsModuleFiles,
  docsLayoutFile,
  docsStateFile,
  docsFamilyComponentDocsFile,
  docsFoundationExplorerFile,
  docsFoundationReferenceFile,
  docsFoundationVisualSectionsFile,
  docsGoldComponentDocsFile,
  docsGoldComponentModuleFiles,
  docsHomeStackRenderersFile,
  docsInteractionsFile,
  docsInteractionModuleFiles,
  docsIndexFile,
  docsShellReactFile,
  docsPrimitiveReferenceFile,
  docsReferenceLayoutFile,
  docsRuntimeAuditFile,
  docsShellControlsFile,
  docsVisualExamplesFile,
  patternCopyFile,
  specFile,
  templateBlueprintsFile,
  uiI18nFile,
  catalogFile,
  read,
  readJson,
  readSpec,
  result,
  add,
} = require("./audit-context.js");

function checkPatternDependencyLayering() {
  const patternContractTabsFile = path.join(docsAppDir, "pattern-contract-tabs.js");
  const patternTabsFile = path.join(docsAppDir, "pattern-tabs.js");
  const spec = readSpec();
  const patternCopy = readJson(patternCopyFile);
  const patternContractTabs = fs.existsSync(patternContractTabsFile) ? read(patternContractTabsFile) : "";
  const patternTabs = fs.existsSync(patternTabsFile) ? read(patternTabsFile) : "";
  const patterns = Object.keys(patternCopy?.patterns ?? {});

  if (!patterns.length) {
    add("errors", patternCopyFile, 1, "Pattern copy must declare pattern contracts for FlowDocs.");
  }
  for (const id of patterns) {
    const contract = spec?.artifacts?.patterns?.[id];
    if (!contract) {
      add("errors", patternCopyFile, 1, `Pattern copy ${id} is missing a machine-readable spec contract.`);
      continue;
    }
    for (const field of ["governingFoundations", "primitiveDependencies", "componentDependencies", "patternDependencies", "tokenDependencies"]) {
      if (!Array.isArray(contract[field])) {
        add("errors", specFile, 1, `Pattern contract ${id} must expose ${field} as an array for layered dependency rendering.`);
      }
    }
  }

  const requiredRuntimeGuards = [
    "const contract = artifactContract(entry)",
    "contract?.governingFoundations",
    "contract?.primitiveDependencies",
    "contract?.componentDependencies",
    "contract?.patternDependencies",
    "contract?.tokenDependencies",
    'dependencyGroup("Foundations"',
    'dependencyGroup("Primitives"',
    'dependencyGroup("Components"',
    "primitiveDependencySummary",
    "Primitive dependency owning structural slot",
  ];
  for (const guard of requiredRuntimeGuards) {
    if (!patternContractTabs.includes(guard)) {
      add("errors", patternContractTabsFile, 1, `Pattern dependency panel must render layered contract data, missing guard: ${guard}.`);
    }
  }
  if (!patternTabs.includes("pattern-contract-tabs.js?v=")) {
    add("errors", patternTabsFile, 1, "Pattern tabs must import the contract renderer with an explicit cache-busted module URL.");
  }
}

function checkTemplateBlueprints() {
  const appFile = docsAppFile;
  const app = read(appFile);
  const spec = readSpec();
  if (app.includes("const templateBlueprints = {")) {
    add("errors", appFile, 1, "Template blueprints must live in content/template-blueprints.json, not app.js.");
  }
  const contentSources = fs.existsSync(docsContentSourcesFile) ? read(docsContentSourcesFile) : "";
  if (!contentSources.includes("generated/docs-content.bundle.json") || !contentSources.includes("templateBlueprintContent")) {
    add("errors", appFile, 1, "App must load template blueprints from the generated docs content bundle.");
  }

  if (!fs.existsSync(templateBlueprintsFile)) {
    add("errors", templateBlueprintsFile, 1, "Template blueprints must live in content/template-blueprints.json.");
    return;
  }

  let blueprintContent = null;
  let blueprints = null;
  blueprintContent = readJson(templateBlueprintsFile);
  if (!blueprintContent) {
    add("errors", templateBlueprintsFile, 1, "Template blueprints JSON is invalid or unreadable.");
    return;
  }
  blueprints = blueprintContent.templates;
  for (const field of ["primary", "standard", "screenSystem", "informationArchitecture", "processDetail", "moduleDetail", "dataSources", "permissions", "states", "telemetry", "surfaces", "modules", "patternDependencies", "stateMatrixCopy", "dataPermissions"]) {
    if (!blueprintContent.fallbacks?.[field]) add("errors", templateBlueprintsFile, 1, `Template blueprint fallback missing field: ${field}.`);
  }

  const templateTitles = [...app.matchAll(/template\("([^"]+)"/g)].map((match) => match[1]);
  for (const title of templateTitles) {
    const blueprint = blueprints?.[title];
    if (!blueprint) {
      add("errors", templateBlueprintsFile, 1, `Template blueprint missing: ${title}.`);
      continue;
    }
    const templateId = slug(title);
    const contract = spec?.artifacts?.templates?.[templateId];
    if (!contract) {
      add("errors", specFile, 1, `Missing machine-readable template contract: artifacts.templates.${templateId}.`);
      continue;
    }
    const requiredContractFields = ["layer", "platform", "audiences", "purpose", "governingFoundations", "primitiveDependencies", "patternDependencies", "tokenDependencies", "densityContext", "modules", "dataSources", "permissions", "states", "surfaces", "telemetry", "qualityGates", "agentInstructions", "rejectIf"];
    for (const field of requiredContractFields) {
      const value = contract[field];
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      const isEmptyObject = value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0;
      if (value === undefined || value === "" || isEmptyArray || isEmptyObject) {
        add("errors", specFile, 1, `Template contract ${templateId} missing ${field}.`);
      }
    }
    if (contract.layer !== "Template") {
      add("errors", specFile, 1, `Template contract ${templateId} must declare layer Template.`);
    }
    for (const field of ["nav", "metrics", "modules", "moduleDetails", "standard", "screenSystem", "informationArchitecture", "primary", "permissions", "data", "states", "surfaces", "telemetry", "qualityGates"]) {
      const value = blueprint[field];
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      const isEmptyObject = value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0;
      if (value === undefined || value === "" || isEmptyArray || isEmptyObject) {
        add("errors", templateBlueprintsFile, 1, `Template blueprint ${title} missing ${field}.`);
      }
    }
    if (blueprint.processDetails) {
      add("errors", templateBlueprintsFile, 1, `Template blueprint ${title} must separate patternDetails and templateModuleDetails; processDetails is ambiguous.`);
    }
    for (const moduleName of blueprint.modules ?? []) {
      const detail = blueprint.moduleDetails?.[moduleName];
      if (!detail?.copy || !detail?.icon) {
        add("errors", templateBlueprintsFile, 1, `Template blueprint ${title} module missing detail: ${moduleName}.`);
      }
    }
    const catalogTemplate = readJson(catalogFile)?.templates?.find((entry) => entry.id === templateId);
    const patternNames = catalogTemplate?.patternsUsed ?? [];
    const templateModuleNames = catalogTemplate?.templateModulesUsed ?? [];
    if (patternNames.length && (!blueprint.patternDetails || !Object.keys(blueprint.patternDetails).length)) {
      add("errors", templateBlueprintsFile, 1, `Template blueprint ${title} missing patternDetails for consumed patterns.`);
    }
    for (const patternName of patternNames) {
      if (!blueprint.patternDetails?.[patternName]) {
        add("errors", templateBlueprintsFile, 1, `Template blueprint ${title} pattern missing detail: ${patternName}.`);
      }
    }
    for (const moduleName of templateModuleNames) {
      if (!blueprint.templateModuleDetails?.[moduleName]) {
        add("errors", templateBlueprintsFile, 1, `Template blueprint ${title} template module missing detail: ${moduleName}.`);
      }
    }
    const syncChecks = [
      ["modules", blueprint.modules, contract.modules],
      ["dataSources", blueprint.data, contract.dataSources],
      ["permissions", blueprint.permissions, contract.permissions],
      ["states", blueprint.states, contract.states],
      ["surfaces", blueprint.surfaces, contract.surfaces],
      ["telemetry", blueprint.telemetry, contract.telemetry],
      ["qualityGates", blueprint.qualityGates, contract.qualityGates],
      ["patternDependencies", patternNames, contract.patternDependencies],
      ["templateModuleDependencies", templateModuleNames, contract.templateModuleDependencies ?? []],
    ];
    for (const [field, sourceValue, contractValue] of syncChecks) {
      if (JSON.stringify(sourceValue ?? []) !== JSON.stringify(contractValue ?? [])) {
        add("errors", specFile, 1, `Template contract ${templateId} ${field} must stay synchronized with template-blueprints.json.`);
      }
    }
  }

  const templateRuntime = [
    app,
    fs.existsSync(docsDetailTabsFile) ? read(docsDetailTabsFile) : "",
    ...docsDetailTabsModuleFiles.map((file) => read(file)),
  ].join("\n");
  for (const rendererGuard of ["blueprint?.telemetry", "blueprint?.qualityGates", "blueprint?.surfaces", "blueprint?.standard", "blueprint?.screenSystem", "blueprint?.informationArchitecture", "specQualityGates(entry)"]) {
    if (!templateRuntime.includes(rendererGuard)) {
      add("errors", appFile, 1, `Template pages must render blueprint data instead of fixed generic copy: ${rendererGuard}.`);
    }
  }
  if (!templateRuntime.includes("patternDependencies: contract.patternDependencies")) {
    add("errors", appFile, 1, "Template MIEL and engineering contracts must expose patternDependencies from specs.");
  }
  if (!templateRuntime.includes('["pattern", "template"].includes(entry.type) && contract?.agentInstructions') || !templateRuntime.includes('["pattern", "template"].includes(entry.type) && contract?.rejectIf')) {
    add("errors", appFile, 1, "Template Guidelines must render agentInstructions and rejectIf from specs.");
  }
  for (const forbidden of ["module.toLowerCase().includes", "Persistent context, saved views", "Document purpose, states, permissions", "complete success, empty, loading", "A template is done only", "Templates need a system", "Core areas are organized", "Primary work area", "Owner, freshness, privacy", "Task completion, recovery", "Declared at the template surface", "Template cannot invent behavior"]) {
    if (templateRuntime.includes(forbidden)) {
      add("errors", appFile, 1, `Template module behavior must come from content/template-blueprints.json, not heuristics: ${forbidden}.`);
    }
  }
}

function countMatches(text, pattern) {
  return (text.match(pattern) ?? []).length;
}

function topMatches(files, pattern, limit = 12) {
  return files
    .map((file) => ({ file: path.relative(process.cwd(), file), count: countMatches(read(file), pattern) }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file))
    .slice(0, limit);
}

function stripAllowedComponentDetailControlBridges(text) {
  return text.replace(/<(?:input|select)\b(?=[^>]*data-doc-control-bridge="component-playground")[^>]*>/g, "");
}

function countComponentDetailRawControls(file, text) {
  const rawControlPattern = /<button\b|<input\b|<select\b|<textarea\b|role="tab"|role="dialog"|role="menu"/g;
  if (path.basename(file) === "gold-component-data.js" && text.includes('data-doc-control-bridge="component-playground"')) return 0;
  return countMatches(stripAllowedComponentDetailControlBridges(text), rawControlPattern);
}

function countComponentDetailControlBridgeMarkup(file, text) {
  if (path.basename(file) !== "gold-component-data.js") return 0;
  if (!text.includes('data-doc-control-bridge="component-playground"')) return 0;
  return countMatches(text, /<input\b|<select\b/g);
}

function countComponentDetailCardDebt(file, text) {
  const base = path.basename(file);
  const visualCardMarkupPattern = /class="[^"]*\bcard(?:-|")|cardLink\(/g;
  if (base === "gold-card-docs.js") return 0;
  return countMatches(text, visualCardMarkupPattern);
}

function countGovernedCardCompositionMarkup(file, text) {
  if (path.basename(file) !== "gold-card-docs.js") return 0;
  return countMatches(text, /class="[^"]*\bcard(?:-|")/g);
}

function componentDetailRendererId(file) {
  const base = path.basename(file);
  if (base === "family-component-docs.js") return "family-fallback";
  if (base === "candidate-component-docs.js") return "candidate-composition";
  return base.replace(/^gold-/, "").replace(/-docs\.js$/, "");
}

function componentDetailRendererKind(file, text, simpleGoldRenderers, customGoldRenderers) {
  const base = path.basename(file);
  const id = componentDetailRendererId(file);
  if (base === "family-component-docs.js") return "family-fallback";
  if (base === "candidate-component-docs.js") return "candidate-composition";
  if (base === "gold-simple-component-docs.js") return "shared-simple-template";
  if (base === "gold-component-core.js" || base === "gold-component-data.js") return "shared-support";
  if (simpleGoldRenderers.includes(id)) return "gold-shared";
  if (customGoldRenderers.includes(id)) return "gold-custom";
  if (/^gold-.*-docs\.js$/.test(base)) return "gold-unclassified";
  return text.includes("componentDetailSection(") ? "shared-support" : "support";
}

function componentDetailMigrationCategory(kind, id, governedCustomRenderers) {
  if (kind === "gold-shared" || kind === "shared-simple-template") return "template-ready";
  if (kind === "gold-custom" && governedCustomRenderers.includes(id)) return "custom-slot-governed";
  if (kind === "gold-custom") return "custom-slot-needs-governance";
  if (kind === "family-fallback" || kind === "candidate-composition") return "template-gap";
  if (kind === "shared-support") return "support";
  return "needs-classification";
}

function checkDetailShellTemplateReadiness() {
  const docsLayout = read(docsLayoutFile);
  const appRuntime = read(docsAppFile);
  const templateIslandsFile = path.join(docsAppDir, "template-react-islands.js");
  const templateIslands = read(templateIslandsFile);
  const reactIslandsFile = path.join(docsAppDir, "react-component-islands.js");
  const reactIslands = read(reactIslandsFile);
  const requiredTemplateMarkers = [
    'data-react-component="docs-artifact-detail-template"',
    'data-component-source="react-template"',
    'data-doc-template="artifact-detail"',
    'data-flowdocs-boundary="docs-artifact-detail-template"',
    "ui(\"shell.sections\")",
    "tabs: tabs.map",
  ];
  const missingTemplateMarkers = requiredTemplateMarkers.filter((marker) => !docsLayout.includes(marker));
  const detailShellStart = docsLayout.indexOf("function docsArtifactDetailTemplateIsland");
  const detailShellEnd = docsLayout.indexOf("function componentImplementationLabel");
  const detailShellRuntime = detailShellStart >= 0 && detailShellEnd > detailShellStart
    ? docsLayout.slice(detailShellStart, detailShellEnd)
    : docsLayout;
  const rawDetailTabShellMatches = countMatches(detailShellRuntime, /class="tabs|class="tabs__|role="tablist"|role="tab"|<button\b/g);
  const templateWrapperReady = templateIslands.includes("function DocsArtifactDetailTemplateIsland")
    && templateIslands.includes('"docs-artifact-detail-template": DocsArtifactDetailTemplateIsland')
    && templateIslands.includes("React.createElement(DocsArtifactDetailTemplate");
  const templateOwnsTabBody = templateIslands.includes("tabBodiesHtml")
    && templateIslands.includes("selectedBodyHtml")
    && templateIslands.includes("data-legacy-html-slot")
    && templateIslands.includes("typed-react-tab-children");

  result.inventory.detailShellTemplateReadiness = {
    consumesFlowTabsReactIsland: missingTemplateMarkers.length === 0 && templateWrapperReady,
    missingShellMarkers: missingTemplateMarkers,
    rawDetailTabShellMatches,
    wrapperReady: templateWrapperReady,
    templateOwnsTabBody,
  };

  if (missingTemplateMarkers.length) {
    add("warnings", docsLayoutFile, 1, `Detail shell must mount the Flow DocsArtifactDetailTemplate with contract markers: ${missingTemplateMarkers.join(", ")}.`);
  }
  if (rawDetailTabShellMatches) {
    add("warnings", docsLayoutFile, 1, "Detail shell still authors raw tablist controls or package classes; route them through the Flow DocsArtifactDetailTemplate.");
  }
  if (!templateWrapperReady) {
    add("warnings", templateIslandsFile, 1, "Detail shell must have a React island wrapper around Flow DocsArtifactDetailTemplate.");
  }
  if (!templateOwnsTabBody) {
    add("warnings", templateIslandsFile, 1, "DocsArtifactDetailTemplate island must own selected tab body while the legacy HTML tab slot is quarantined.");
  }
}

function checkArtifactDetailSurfaceReadiness() {
  const artifactDetailFiles = [
    docsDetailTabsFile.replace(/detail-tabs\.js$/, "detail-tabs-core.js"),
    path.join(docsAppDir, "pattern-tabs.js"),
    path.join(docsAppDir, "pattern-contract-tabs.js"),
    path.join(docsAppDir, "template-tabs.js"),
    path.join(docsAppDir, "pattern-build-gates.js"),
    path.join(docsAppDir, "pattern-candidate-demos.js"),
    path.join(docsAppDir, "pattern-design-lead.js"),
    path.join(docsAppDir, "pattern-desktop-demos.js"),
    path.join(docsAppDir, "pattern-desktop-react-demos.js"),
    path.join(docsAppDir, "pattern-focused-design.js"),
    path.join(docsAppDir, "pattern-journey-demos.js"),
    path.join(docsAppDir, "pattern-journey-react-demos.js"),
    path.join(docsAppDir, "pattern-miel-tabs.js"),
    path.join(docsAppDir, "pattern-mobile-demos.js"),
    path.join(docsAppDir, "pattern-mobile-react-demos.js"),
    path.join(docsAppDir, "pattern-operational-demos.js"),
    path.join(docsAppDir, "pattern-operational-react-demos.js"),
    path.join(docsAppDir, "pattern-shell-react-demos.js"),
    path.join(docsAppDir, "pattern-utility-demos.js"),
    path.join(docsAppDir, "template-desktop-demos.js"),
    path.join(docsAppDir, "template-react-demos.js"),
  ].filter((file) => fs.existsSync(file));
  const docPanelBoundaryPattern = /(?:\.(?:doc-panel|docs-panel)\b|class=["'`][^"'`]*(?:^|\s)(?:doc-panel|docs-panel)(?:\s|$))/g;
  const panelHotspots = artifactDetailFiles
    .map((file) => ({ file: path.relative(process.cwd(), file), count: countMatches(read(file), docPanelBoundaryPattern) }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));
  const artifactSectionBoundaryPattern = /documentationSectionIsland\(\{[\s\S]*?template:\s*"artifact-detail"/g;
  const migratedSurfaceSections = artifactDetailFiles.reduce((total, file) => total + countMatches(read(file), artifactSectionBoundaryPattern), 0);
  const missingSurfaceBoundary = artifactDetailFiles
    .map((file) => {
      const text = read(file);
      const surfaces = countMatches(text, artifactSectionBoundaryPattern);
      const roles = surfaces;
      return { file: path.relative(process.cwd(), file), surfaces, roles };
    })
    .filter((entry) => entry.surfaces !== entry.roles);
  const sharedHelperBoundaries = [
    {
      file: path.join(docsAppDir, "component-foundation-trace.js"),
      helper: "artifactFoundationTracePanel",
      ready: /export function artifactFoundationTracePanel[\s\S]*?documentationSectionIsland\(\{[\s\S]*?template:\s*"artifact-detail"[\s\S]*?source:\s*"artifactFoundationTracePanel"/.test(
        read(path.join(docsAppDir, "component-foundation-trace.js")),
      ),
    },
    {
      file: path.join(docsAppDir, "visual-examples.js"),
      helper: "examplePanel",
      ready: /export function examplePanel[\s\S]*?documentationSectionIsland\(\{[\s\S]*?template:\s*"artifact-detail"[\s\S]*?source:\s*"examplePanel"/.test(
        read(path.join(docsAppDir, "visual-examples.js")),
      ),
    },
  ];
  const missingSharedHelperBoundaries = sharedHelperBoundaries
    .filter((entry) => !entry.ready)
    .map((entry) => ({ file: path.relative(process.cwd(), entry.file), helper: entry.helper }));

  result.inventory.artifactDetailSurfaceReadiness = {
    files: artifactDetailFiles.map((file) => path.relative(process.cwd(), file)),
    migratedSurfaceSections,
    rawDocPanelHotspots: panelHotspots,
    missingSurfaceBoundary,
    sharedHelperBoundaries: sharedHelperBoundaries.map((entry) => ({
      file: path.relative(process.cwd(), entry.file),
      helper: entry.helper,
      ready: entry.ready,
    })),
  };

  if (panelHotspots.length) {
    add("warnings", docsAppDir, 1, `Artifact detail tabs still use doc-panel instead of DocumentationSection: ${panelHotspots.map((entry) => `${entry.file} (${entry.count})`).join(", ")}.`);
  }
  if (missingSurfaceBoundary.length) {
    add("warnings", docsAppDir, 1, `Artifact detail Surface sections must declare data-surface-role="section": ${missingSurfaceBoundary.map((entry) => entry.file).join(", ")}.`);
  }
  if (missingSharedHelperBoundaries.length) {
    add("warnings", docsAppDir, 1, `Artifact detail shared helpers must render through Surface boundaries: ${missingSharedHelperBoundaries.map((entry) => `${entry.file}#${entry.helper}`).join(", ")}.`);
  }
}

function checkFoundationPrimitiveDetailSurfaceReadiness() {
  const detailFiles = [
    path.join(docsAppDir, "foundation-tabs.js"),
    path.join(docsAppDir, "primitive-tabs.js"),
  ].filter((file) => fs.existsSync(file));
  const docPanelBoundaryPattern = /(?:\.(?:doc-panel|docs-panel)\b|class=["'`][^"'`]*(?:^|\s)(?:doc-panel|docs-panel)(?:\s|$))/g;
  const panelHotspots = detailFiles
    .map((file) => ({ file: path.relative(process.cwd(), file), count: countMatches(read(file), docPanelBoundaryPattern) }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));
  const foundationPrimitiveBoundaryPattern = /documentationSectionIsland\(\{[\s\S]*?template:\s*"foundation-primitive-detail"/g;
  const migratedSurfaceSections = detailFiles.reduce((total, file) => total + countMatches(read(file), foundationPrimitiveBoundaryPattern), 0);
  const missingSurfaceBoundary = detailFiles
    .map((file) => {
      const text = read(file);
      const surfaces = countMatches(text, foundationPrimitiveBoundaryPattern);
      const roles = surfaces;
      return { file: path.relative(process.cwd(), file), surfaces, roles };
    })
    .filter((entry) => entry.surfaces !== entry.roles);
  const visualExamples = fs.existsSync(docsVisualExamplesFile) ? read(docsVisualExamplesFile) : "";
  const visualPanelReady = /export function visualPanel[\s\S]*?documentationSectionIsland\(\{[\s\S]*?template:\s*"foundation-primitive-detail"[\s\S]*?source:\s*"visualPanel"/.test(
    visualExamples,
  );
  const referenceLayoutFile = path.join(docsAppDir, "reference-layout.js");
  const referenceLayout = fs.existsSync(referenceLayoutFile) ? read(referenceLayoutFile) : "";
  const referenceSectionReady = /export function referenceSection[\s\S]*?documentationSectionIsland\(\{[\s\S]*?template:\s*"foundation-primitive-detail"[\s\S]*?source:\s*"referenceSection"/.test(
    referenceLayout,
  );

  result.inventory.foundationPrimitiveDetailSurfaceReadiness = {
    files: detailFiles.map((file) => path.relative(process.cwd(), file)),
    migratedSurfaceSections,
    rawDocPanelHotspots: panelHotspots,
    missingSurfaceBoundary,
    sharedHelperBoundaries: [
      {
        file: path.relative(process.cwd(), docsVisualExamplesFile),
        helper: "visualPanel",
        ready: visualPanelReady,
      },
      {
        file: path.relative(process.cwd(), referenceLayoutFile),
        helper: "referenceSection",
        ready: referenceSectionReady,
      },
    ],
  };

  if (panelHotspots.length) {
    add("warnings", docsAppDir, 1, `Foundation/Primitive detail tabs still use doc-panel instead of DocumentationSection: ${panelHotspots.map((entry) => `${entry.file} (${entry.count})`).join(", ")}.`);
  }
  if (missingSurfaceBoundary.length) {
    add("warnings", docsAppDir, 1, `Foundation/Primitive detail Surface sections must declare data-surface-role="section": ${missingSurfaceBoundary.map((entry) => entry.file).join(", ")}.`);
  }
  if (!visualPanelReady) {
    add("warnings", docsVisualExamplesFile, 1, "Foundation/Primitive visualPanel must render through a Flow Surface boundary.");
  }
  if (!referenceSectionReady) {
    add("warnings", referenceLayoutFile, 1, "Foundation/Primitive referenceSection must render through a Flow Surface boundary.");
  }
}

function checkComponentDetailTemplateReadiness() {
  const componentModuleFiles = docsGoldComponentModuleFiles
    .filter((file) => !file.endsWith("gold-component-docs.js"))
    .sort();
  const componentModules = componentModuleFiles.map((file) => ({
    file,
    text: read(file),
  }));
  const componentRuntime = componentModules.map((entry) => entry.text).join("\n");
  const componentRuntimeWithoutBridges = componentModules
    .filter((entry) => !(path.basename(entry.file) === "gold-component-data.js" && entry.text.includes('data-doc-control-bridge="component-playground"')))
    .map((entry) => stripAllowedComponentDetailControlBridges(entry.text))
    .join("\n");
  const simpleRenderer = fs.existsSync(path.join(docsAppDir, "gold-simple-component-docs.js"))
    ? read(path.join(docsAppDir, "gold-simple-component-docs.js"))
    : "";
  const reactIslandsFile = path.join(docsAppDir, "react-component-islands.js");
  const reactIslands = fs.existsSync(reactIslandsFile) ? read(reactIslandsFile) : "";

  const templateSectionIds = [
    "operational-example",
    "anatomy",
    "accessibility",
    "variants",
    "states",
    "variant-state-behavior",
    "full-width",
    "responsive-layout-patterns",
    "viewport-organization",
    "playground",
    "api-foundations",
    "guidelines",
    "tests-rejection-rules",
    "miel",
  ];
  const simpleRendererSections = templateSectionIds.filter((section) => simpleRenderer.includes(`${section}`));
  const docPanelBoundaryPattern = /(?:\.(?:doc-panel|docs-panel)\b|class=["'`][^"'`]*(?:^|\s)(?:doc-panel|docs-panel)(?:\s|$))/g;
  const componentDocPanelMatches = topMatches(componentModuleFiles, docPanelBoundaryPattern, 16);
  const componentRawControlMatches = componentModuleFiles
    .map((file) => ({ file: path.relative(process.cwd(), file), count: countComponentDetailRawControls(file, read(file)) }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file))
    .slice(0, 16);
  const componentControlBridgeMatches = componentModuleFiles
    .map((file) => ({ file: path.relative(process.cwd(), file), count: countComponentDetailControlBridgeMarkup(file, read(file)) }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));
  const componentOwnSurfaceMatches = topMatches(componentModuleFiles, /class="surface|template-module-surface|(?:\.(?:doc-panel|docs-panel)\b|class=["'`][^"'`]*(?:^|\s)(?:doc-panel|docs-panel)(?:\s|$))/g, 16);
  const customGoldRenderers = componentModules
    .filter((entry) => !/renderSimpleGoldSection\(entry,\s*section/.test(entry.text) && /export function render[A-Za-z0-9]+GoldSection/.test(entry.text))
    .map((entry) => path.basename(entry.file).replace(/^gold-/, "").replace(/-docs\.js$/, ""))
    .sort();
  const simpleGoldRenderers = componentModules
    .filter((entry) => /renderSimpleGoldSection\(entry,\s*section/.test(entry.text))
    .map((entry) => path.basename(entry.file).replace(/^gold-/, "").replace(/-docs\.js$/, ""))
    .sort();
  const customRendererGovernanceFile = path.join(docsAppDir, "component-detail-renderer-governance.json");
  const customRendererGovernance = readJson(customRendererGovernanceFile) ?? {};
  const governedCustomRenderers = Object.keys(customRendererGovernance.customRenderers ?? {}).sort();
  const ungovernedCustomRenderers = customGoldRenderers.filter((id) => !governedCustomRenderers.includes(id));
  const governanceOnlyCustomRenderers = governedCustomRenderers.filter((id) => !customGoldRenderers.includes(id));
  const invalidCustomRendererGovernance = governedCustomRenderers.filter((id) => {
    const entry = customRendererGovernance.customRenderers?.[id] ?? {};
    return entry.status !== "intentional-custom" || !entry.reason || !entry.migrationRule;
  });
  const customRendererBoundaryGaps = componentModules
    .filter((entry) => customGoldRenderers.includes(path.basename(entry.file).replace(/^gold-/, "").replace(/-docs\.js$/, "")))
    .filter((entry) => !entry.text.includes("componentDetailSection(") && !entry.text.includes("componentDetailSectionAttrs(") && !entry.text.includes("component-detail-surface") && !entry.text.includes("renderSimpleGoldSection"))
    .map((entry) => path.basename(entry.file).replace(/^gold-/, "").replace(/-docs\.js$/, ""))
    .sort();
  const repeatedContentHotspots = componentModules
    .filter((entry) => path.basename(entry.file) !== "gold-component-core.js")
    .map((entry) => {
      const checks = [
        ["props-table", /props-table/g],
        ["state-precedence-copy", /State precedence:/g],
        ["tests-list", /tests\.mustTest/g],
        ["guidelines-grid-markup", /<div class="guidelines-grid"/g],
      ];
      const matches = checks
        .map(([label, pattern]) => ({ label, count: countMatches(entry.text, pattern) }))
        .filter((match) => match.count > 0);
      return {
        file: path.relative(process.cwd(), entry.file),
        matches,
      };
    })
    .filter((entry) => entry.matches.length)
    .sort((a, b) => a.file.localeCompare(b.file));
  const componentDetailAuditFiles = [
    ...componentModuleFiles,
    path.join(docsAppDir, "family-component-docs.js"),
    path.join(docsAppDir, "candidate-component-docs.js"),
  ].filter((file) => fs.existsSync(file));
  const componentCardDebtMatches = componentDetailAuditFiles
    .map((file) => ({ file: path.relative(process.cwd(), file), count: countComponentDetailCardDebt(file, read(file)) }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));
  const componentGovernedCardCompositionMatches = componentDetailAuditFiles
    .map((file) => ({ file: path.relative(process.cwd(), file), count: countGovernedCardCompositionMarkup(file, read(file)) }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));
  const componentDetailRendererInventory = componentDetailAuditFiles
    .map((file) => {
      const text = read(file);
      const id = componentDetailRendererId(file);
      const kind = componentDetailRendererKind(file, text, simpleGoldRenderers, customGoldRenderers);
      const sectionCoverage = templateSectionIds.filter((section) => text.includes(section));
      const docPanels = countMatches(text, docPanelBoundaryPattern);
      const rawControls = countComponentDetailRawControls(file, text);
      const propsTables = countMatches(text, /props-table/g);
      const demoGrids = countMatches(text, /docs-demo-matrix|demoCell\(/g);
      const usesSharedSection = text.includes("componentDetailSection(") || text.includes("componentDetailSectionAttrs(") || text.includes("renderSimpleGoldSection(");
      const hasTemplateHotspots = docPanels || rawControls || propsTables || demoGrids;
      const migrationCategory = (kind === "family-fallback" || kind === "candidate-composition") && usesSharedSection && !hasTemplateHotspots
        ? "template-ready"
        : componentDetailMigrationCategory(kind, id, governedCustomRenderers);
      return {
        id,
        file: path.relative(process.cwd(), file),
        kind,
        migrationCategory,
        sectionCoverage,
        sectionCoverageCount: sectionCoverage.length,
        surfaceSections: countMatches(text, /component-detail-surface/g),
        docPanels,
        rawControls,
        playgroundBridges: countMatches(text, /data-doc-control-bridge="component-playground"|data-component-playground|data-button-playground/g),
        propsTables,
        demoGrids,
        cardLikeMarkup: countComponentDetailCardDebt(file, text),
        governedCardCompositionMarkup: countGovernedCardCompositionMarkup(file, text),
        usesFlowDemo: countMatches(text, /Demo(?:FromData)?\(|componentDemo\(/g),
        usesSharedSection,
      };
    })
    .sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id));
  const templateGaps = componentDetailRendererInventory
    .filter((entry) => entry.migrationCategory === "template-gap" || entry.docPanels || entry.rawControls)
    .map(({ id, file, kind, migrationCategory, docPanels, rawControls, propsTables, demoGrids }) => ({
      id,
      file,
      kind,
      migrationCategory,
      docPanels,
      rawControls,
      propsTables,
      demoGrids,
    }));
  const customRendererSharedBoundaryIds = componentDetailRendererInventory
    .filter((entry) => entry.kind === "gold-custom" && entry.usesSharedSection && entry.surfaceSections === 0)
    .map((entry) => entry.id)
    .sort();
  const customRendererOwnSurfaceIds = componentDetailRendererInventory
    .filter((entry) => entry.kind === "gold-custom" && entry.surfaceSections > 0)
    .map((entry) => entry.id)
    .sort();
  const requiredPilotSharedBoundaryIds = ["button", "card", "checkbox", "combobox", "icon-button", "input", "radio-button", "select", "switch", "text-area"];
  const pilotSharedBoundaryGaps = requiredPilotSharedBoundaryIds.filter((id) => {
    const entry = componentDetailRendererInventory.find((item) => item.id === id);
    return !entry || !entry.usesSharedSection || entry.surfaceSections > 0 || entry.docPanels || entry.rawControls;
  });
  const rendererKindSummary = componentDetailRendererInventory.reduce((summary, entry) => {
    summary[entry.kind] = (summary[entry.kind] ?? 0) + 1;
    return summary;
  }, {});
  const migrationCategorySummary = componentDetailRendererInventory.reduce((summary, entry) => {
    summary[entry.migrationCategory] = (summary[entry.migrationCategory] ?? 0) + 1;
    return summary;
  }, {});

  result.inventory.componentDetailTemplateReadiness = {
    componentDetailModules: componentModuleFiles.length,
    simpleGoldRenderers: simpleGoldRenderers.length,
    customGoldRenderers: customGoldRenderers.length,
    customGoldRendererIds: customGoldRenderers,
    governedCustomGoldRenderers: governedCustomRenderers.length,
    ungovernedCustomGoldRenderers: ungovernedCustomRenderers,
    governanceOnlyCustomGoldRenderers: governanceOnlyCustomRenderers,
    invalidCustomRendererGovernance,
    customRendererBoundaryGaps,
    sharedSimpleRendererSections: simpleRendererSections,
    rawDocPanelMatches: countMatches(componentRuntime, docPanelBoundaryPattern),
    rawInteractiveMatches: countMatches(componentRuntimeWithoutBridges, /<button\b|<input\b|<select\b|<textarea\b|role="tab"|role="dialog"|role="menu"/g),
    rawControlBridgeMatches: componentControlBridgeMatches.reduce((total, entry) => total + entry.count, 0),
    rawCardMatches: componentCardDebtMatches.reduce((total, entry) => total + entry.count, 0),
    governedCardCompositionMatches: componentGovernedCardCompositionMatches.reduce((total, entry) => total + entry.count, 0),
    componentDocPanelHotspots: componentDocPanelMatches,
    componentRawControlHotspots: componentRawControlMatches,
    componentAllowedControlBridgeHotspots: componentControlBridgeMatches,
    componentCardDebtHotspots: componentCardDebtMatches,
    componentGovernedCardCompositionHotspots: componentGovernedCardCompositionMatches,
    componentSurfaceHotspots: componentOwnSurfaceMatches,
    rendererKindSummary,
    migrationCategorySummary,
    customRendererSharedBoundaryIds,
    customRendererOwnSurfaceIds,
    customRendererSharedBoundaryProgress: {
      migrated: customRendererSharedBoundaryIds.length,
      remaining: customRendererOwnSurfaceIds.length,
      total: customRendererSharedBoundaryIds.length + customRendererOwnSurfaceIds.length,
    },
    repeatedContentHotspots,
    requiredPilotSharedBoundaryIds,
    pilotSharedBoundaryGaps,
    rendererInventory: componentDetailRendererInventory,
    templateGaps,
    requiredFlowBuildingBlocks: ["Surface", "Card", "Tabs", "Table", "Button", "IconButton", "Input", "Select", "Switch"],
  };

  if (!reactIslands.includes("import { Surface }") || !reactIslands.includes("surface: Surface")) {
    add("errors", reactIslandsFile, 1, "Component detail templates must be able to mount the Flow Surface primitive through React islands.");
  }
  if (simpleRendererSections.length < templateSectionIds.length) {
    add("warnings", path.join(docsAppDir, "gold-simple-component-docs.js"), 1, `Shared component detail renderer is missing expected sections: ${templateSectionIds.filter((section) => !simpleRendererSections.includes(section)).join(", ")}.`);
  }
  if (ungovernedCustomRenderers.length) {
    add("warnings", customRendererGovernanceFile, 1, `Component detail custom renderers need explicit governance entries: ${ungovernedCustomRenderers.join(", ")}.`);
  }
  if (governanceOnlyCustomRenderers.length) {
    add("warnings", customRendererGovernanceFile, 1, `Component detail renderer governance contains entries that are no longer custom renderers: ${governanceOnlyCustomRenderers.join(", ")}.`);
  }
  if (invalidCustomRendererGovernance.length) {
    add("warnings", customRendererGovernanceFile, 1, `Component detail renderer governance entries need status, reason, and migrationRule: ${invalidCustomRendererGovernance.join(", ")}.`);
  }
  if (customRendererBoundaryGaps.length) {
    add("warnings", docsAppDir, 1, `Component detail custom renderers must delegate to renderSimpleGoldSection or wrap sections with componentDetailSection: ${customRendererBoundaryGaps.join(", ")}.`);
  }
  if (repeatedContentHotspots.length) {
    add("errors", docsAppDir, 1, `Component detail repeated content must render through gold-component-core helpers: ${repeatedContentHotspots.map((entry) => `${entry.file} (${entry.matches.map((match) => `${match.label}:${match.count}`).join(", ")})`).join("; ")}.`);
  }
  if (countMatches(componentRuntime, docPanelBoundaryPattern)) {
    add("warnings", docsAppDir, 1, "Component detail still uses doc-panel surfaces; migrate shared and custom renderers to a Flow Surface-backed ComponentDetailTemplate.");
  }
  if (countMatches(componentRuntimeWithoutBridges, /<button\b|<input\b|<select\b|<textarea\b|role="tab"|role="dialog"|role="menu"/g)) {
    add("warnings", docsAppDir, 1, "Component detail still contains raw controls or overlay roles; migrate controls through Flow React components or justified template slots.");
  }
  if (templateGaps.length) {
    add("errors", docsAppDir, 1, `Component detail template gaps must stay closed for family and candidate renderers: ${templateGaps.map((entry) => `${entry.file}#${entry.id}`).join(", ")}.`);
  }
  if (pilotSharedBoundaryGaps.length) {
    add("errors", docsAppDir, 1, `Component detail shared Surface pilot regressed: ${pilotSharedBoundaryGaps.join(", ")}.`);
  }
}

function checkFlowDocsV2PagesReadiness() {
  const docsContentBundleFile = path.join(docsAppDir, "generated/docs-content.bundle.json");
  const docsContentBundle = readJson(docsContentBundleFile) ?? {};
  const catalog = docsContentBundle.catalog ?? {};
  const docsApp = read(docsAppFile);
  const docsLayout = read(docsLayoutFile);
  const docsHome = read(docsHomeStackRenderersFile);
  const docsIndex = read(docsIndexFile);
  const docsShellReact = read(docsShellReactFile);
  const docsContentSources = read(docsContentSourcesFile);
  const docsStyleFiles = [
    path.join(docsAppDir, "styles.css"),
    ...fs.readdirSync(path.join(docsAppDir, "styles"))
      .filter((file) => file.endsWith(".css"))
      .map((file) => path.join(docsAppDir, "styles", file)),
  ];
  const docsRuntimeFiles = fs.readdirSync(docsAppDir)
    .filter((file) => file.endsWith(".js"))
    .map((file) => path.join(docsAppDir, file));
  const scriptFiles = fs.readdirSync(path.join(process.cwd(), "scripts"))
    .filter((file) => file.endsWith(".mjs") || file.endsWith(".js"))
    .map((file) => path.join(process.cwd(), "scripts", file));
  const componentDetailRuntime = fs.existsSync(path.join(docsAppDir, "gold-component-core.js"))
    ? read(path.join(docsAppDir, "gold-component-core.js"))
    : "";
  const foundationPrimitiveRuntime = [
    path.join(docsAppDir, "foundation-tabs.js"),
    path.join(docsAppDir, "primitive-tabs.js"),
    docsReferenceLayoutFile,
  ].filter((file) => fs.existsSync(file)).map((file) => read(file)).join("\n");
  const appAndLayout = `${docsApp}\n${docsLayout}`;

  const collectionCounts = {
    foundations: catalog.foundations?.length ?? 0,
    primitives: catalog.primitives?.length ?? 0,
    components: catalog.components?.length ?? 0,
    patterns: catalog.patterns?.length ?? 0,
    templates: catalog.templates?.length ?? 0,
  };
  const expectedCounts = {
    foundations: 11,
    primitives: 24,
    components: 62,
    patterns: 63,
    templates: 17,
  };
  const detailRoutes = Object.values(collectionCounts).reduce((total, count) => total + count, 0);
  const expectedDetailRoutes = Object.values(expectedCounts).reduce((total, count) => total + count, 0);

  const homeContentKeys = [
    "home.hero",
    "home.coverage",
    "home.documentationStatus",
    "home.visualMigration",
    "home.architecture",
    "home.fastPaths",
  ];
  const missingHomeKeys = homeContentKeys.filter((key) => !docsHome.includes(key));
  const shellMarkers = [
    { id: "singleAppMount", ready: docsIndex.includes('<main id="app"') },
    { id: "docsShellTemplateConsumer", ready: docsShellReact.includes('"data-doc-shell-consumer": "docs-shell-template"') },
    { id: "docsShellTemplateRuntime", ready: docsShellReact.includes("React.createElement(DocsShellTemplate") },
    { id: "pageSlotBridge", ready: docsShellReact.includes("function LegacyHtmlPageSlot") && docsShellReact.includes('"data-legacy-html-slot": "page"') },
    { id: "mobileToggleOwnsSidebar", ready: docsShellReact.includes('"aria-controls": "docs-shell-sidebar-nav"') },
  ];
  const detailPageMarkers = [
    { id: "artifactDetailShell", ready: docsLayout.includes('data-react-component="docs-artifact-detail-template"') },
    { id: "componentPatternTemplateDetailTabs", ready: docsLayout.includes('data-doc-template="artifact-detail"') && docsLayout.includes("tabs: tabs.map") },
    { id: "componentTemplateSections", ready: componentDetailRuntime.includes('template: "component-detail"') || componentDetailRuntime.includes('data-doc-template="component-detail"') },
    { id: "artifactTemplateSections", ready: appAndLayout.includes('template: "artifact-detail"') || appAndLayout.includes('data-doc-template="artifact-detail"') },
    { id: "foundationDetailPage", ready: appAndLayout.includes('referencePageMarker: "foundation-reference-page"') || appAndLayout.includes('data-doc-reference-page="foundation-reference-page"') },
    { id: "primitiveDetailPage", ready: appAndLayout.includes('referencePageMarker: "primitive-reference-page"') || appAndLayout.includes('data-doc-reference-page="primitive-reference-page"') },
    {
      id: "foundationPrimitiveTemplateSections",
      ready: foundationPrimitiveRuntime.includes('data-doc-template="foundation-primitive-detail"')
        || (foundationPrimitiveRuntime.includes("documentationSectionIsland") && foundationPrimitiveRuntime.includes('template: "foundation-primitive-detail"')),
    },
  ];
  const flowContentOwned = docsContentSources.includes("generated/docs-content.bundle.json")
    && docsContentSources.includes("homeContent")
    && docsContentSources.includes("catalog")
    && docsApp.includes("homeContent")
    && docsApp.includes("collections");
  const docPanelBoundaryPattern = /(?:\.(?:doc-panel|docs-panel)\b|class=["'`][^"'`]*(?:^|\s)(?:doc-panel|docs-panel)(?:\s|$))/g;
  const docPanelCssMatches = docsStyleFiles
    .map((file) => ({
      file: path.relative(process.cwd(), file),
      count: countMatches(read(file), docPanelBoundaryPattern),
    }))
    .filter((entry) => entry.count > 0);
  const docPanelRuntimeMatches = docsRuntimeFiles
    .map((file) => ({
      file: path.relative(process.cwd(), file),
      count: countMatches(read(file), docPanelBoundaryPattern),
    }))
    .filter((entry) => entry.count > 0);
  const legacyScriptIdentifierMatches = scriptFiles
    .map((file) => ({
      file: path.relative(process.cwd(), file),
      count: (read(file).match(/legacy[A-Z][A-Za-z0-9]*/g) ?? []).length,
    }))
    .filter((entry) => entry.count > 0);

  const componentReadiness = result.inventory.componentDetailTemplateReadiness ?? {};
  const artifactReadiness = result.inventory.artifactDetailSurfaceReadiness ?? {};
  const foundationPrimitiveReadiness = result.inventory.foundationPrimitiveDetailSurfaceReadiness ?? {};
  const detailShellReadiness = result.inventory.detailShellTemplateReadiness ?? {};
  const visualDebt = result.inventory.docsVisualDebt ?? [];
  const pageDebt = [
    ...shellMarkers.filter((entry) => !entry.ready).map((entry) => `shell:${entry.id}`),
    ...detailPageMarkers.filter((entry) => !entry.ready).map((entry) => `detail:${entry.id}`),
    ...missingHomeKeys.map((key) => `home:${key}`),
    ...Object.entries(expectedCounts)
      .filter(([key, expected]) => collectionCounts[key] !== expected)
      .map(([key, expected]) => `catalog:${key}:${collectionCounts[key]}/${expected}`),
    ...(detailRoutes === expectedDetailRoutes ? [] : [`routes:${detailRoutes}/${expectedDetailRoutes}`]),
    ...(flowContentOwned ? [] : ["content:generated-bundle"]),
    ...(detailShellReadiness.wrapperReady ? [] : ["detail-shell:react-tabs-wrapper"]),
    ...((artifactReadiness.rawDocPanelHotspots?.length ?? 0) ? ["artifact-detail:doc-panel-hotspots"] : []),
    ...((foundationPrimitiveReadiness.rawDocPanelHotspots?.length ?? 0) ? ["foundation-primitive-detail:doc-panel-hotspots"] : []),
    ...((componentReadiness.ungovernedCustomGoldRenderers?.length ?? 0) ? ["component-detail:ungoverned-custom-renderers"] : []),
    ...((componentReadiness.rawDocPanelMatches ?? 0) ? ["component-detail:raw-doc-panel"] : []),
    ...((componentReadiness.rawInteractiveMatches ?? 0) ? ["component-detail:raw-interactive"] : []),
    ...((componentReadiness.rawCardMatches ?? 0) ? ["component-detail:raw-card"] : []),
    ...visualDebt.filter((entry) => entry.total > 0).map((entry) => `visual-debt:${entry.id}:${entry.total}`),
    ...docPanelCssMatches.map((entry) => `release:doc-panel-css:${entry.file}:${entry.count}`),
    ...docPanelRuntimeMatches.map((entry) => `release:doc-panel-runtime:${entry.file}:${entry.count}`),
    ...legacyScriptIdentifierMatches.map((entry) => `release:legacy-script-identifier:${entry.file}:${entry.count}`),
  ];

  result.inventory.flowDocsV2Pages = {
    collectionCounts,
    expectedCounts,
    detailRoutes,
    expectedDetailRoutes,
    flowContentOwned,
    shellReady: shellMarkers.every((entry) => entry.ready),
    shellMarkers,
    homeContentOwned: missingHomeKeys.length === 0,
    missingHomeKeys,
    detailPagesReady: detailPageMarkers.every((entry) => entry.ready),
    detailPageMarkers,
    inheritedReadiness: {
      detailShellWrapperReady: detailShellReadiness.wrapperReady ?? false,
      artifactDocPanelHotspots: artifactReadiness.rawDocPanelHotspots?.length ?? 0,
      foundationPrimitiveDocPanelHotspots: foundationPrimitiveReadiness.rawDocPanelHotspots?.length ?? 0,
      componentUngovernedCustomRenderers: componentReadiness.ungovernedCustomGoldRenderers?.length ?? 0,
      componentRawDocPanelMatches: componentReadiness.rawDocPanelMatches ?? 0,
      componentRawInteractiveMatches: componentReadiness.rawInteractiveMatches ?? 0,
      componentRawCardMatches: componentReadiness.rawCardMatches ?? 0,
      visualDebtCategories: visualDebt.filter((entry) => entry.total > 0).length,
    },
    releaseReadiness: {
      docPanelCssMatches,
      docPanelRuntimeMatches,
      legacyScriptIdentifierMatches,
      ready: docPanelCssMatches.length === 0 && docPanelRuntimeMatches.length === 0 && legacyScriptIdentifierMatches.length === 0,
    },
    pageDebt,
  };

  if (pageDebt.length) {
    add("errors", docsAppDir, 1, `FlowDocs v2 pages are not ready: ${pageDebt.join(", ")}.`);
  }
}

function checkI18nReadiness() {
  const appFile = docsAppFile;
  const app = read(appFile);
  const uiCopy = readJson(uiI18nFile);
  if (!uiCopy) {
    add("errors", uiI18nFile, 1, "UI i18n copy must live in packages/content/content/i18n/ui.json.");
    return;
  }
  if (uiCopy.defaultLocale !== "en") {
    add("errors", uiI18nFile, 1, "UI i18n defaultLocale must be en until localization rollout is explicit.");
  }
  const requiredKeys = [
    "shell.skipToContent",
    "shell.primaryNavigation",
    "shell.designNavigation",
    "shell.searchLabel",
    "shell.searchPlaceholder",
    "shell.searchResults",
    "shell.noSearchResults",
    "shell.openNavigation",
    "shell.closeNavigation",
    "shell.showGrid",
    "shell.hideGrid",
    "shell.toggleContrast",
    "shell.languageToggle",
    "shell.languageCurrent",
    "shell.breadcrumbs",
    "shell.artifactMetadata",
    "shell.sections",
    "shell.detailNavigation",
    "shell.brandHome",
    "grid.desktop",
    "grid.tablet",
    "grid.mobile",
    "grid.pageGrid",
    "grid.column",
    "grid.columns",
    "grid.gutter",
    "tabs.overview",
    "tabs.design",
    "tabs.build",
    "overview.whyItExists",
    "overview.intentCopy",
    "overview.platform",
    "overview.publicTokens",
    "build.engineeringContract",
    "build.specAndApi",
    "build.specIntro",
    "build.qualityGates",
    "build.apiAndFoundations",
    "contract.pattern",
    "contract.template",
    "contract.api",
    "table.name",
    "table.prop",
    "table.field",
    "table.type",
    "table.required",
    "table.notes",
    "table.default",
    "table.rule",
    "table.contract",
    "table.meaning",
    "table.prevents",
    "table.layer",
    "table.expectation",
    "table.foundation",
    "table.evidence",
    "guidelines.title",
    "guidelines.do",
    "guidelines.doNot",
    "guidelines.notes",
    "tests.title",
    "tests.required",
    "tests.mustTest",
    "tests.rejectIf",
    "component.operationalExample",
    "component.anatomy",
    "component.accessibility",
    "component.viewportOrganization",
    "component.playground",
    "component.states",
    "component.variants",
    "component.variantStateBehavior",
    "component.fullWidth",
    "component.responsiveLayoutPatterns",
    "playground.buttonControls",
    "playground.selectControls",
    "playground.cardControls",
    "select.currentSelection",
    "reference.rules",
    "reference.decisionTree",
    "reference.tokenModel",
    "reference.overview",
    "reference.semanticRoleGroups",
    "reference.architecture",
    "reference.visualExplanation",
    "reference.foundationContract",
    "reference.primitiveOverview",
    "reference.coordinatorRole",
    "reference.densityDecision",
    "reference.liveDemo",
    "reference.responsibilities",
    "reference.tokenChain",
    "reference.primitiveApi",
    "reference.purpose",
    "reference.apiReference",
    "reference.specificationMatrix",
    "reference.specificationMatrixIntro",
    "reference.tokenReference",
    "reference.tokenReferenceIntro",
    "reference.usageRules",
    "reference.requiredStates",
    "reference.anatomy",
    "reference.accessibilityContract",
    "reference.screensComponents",
    "reference.successMetrics",
    "reference.operationalScenario",
    "reference.mustProve",
    "reference.groupDemo",
    "reference.stateMatrix",
    "reference.responsiveBehavior",
    "reference.componentTestingContract",
    "reference.foundationTrace",
    "reference.howFoundationsGovern",
    "reference.demoMatrix",
    "reference.visualExample",
    "reference.realExample",
    "reference.semanticContract",
    "reference.researchQuestions",
    "reference.failureModes",
    "reference.patternStandard",
    "reference.templateStandard",
    "reference.productContext",
    "reference.screenSystem",
    "reference.templateStateMatrix",
    "reference.informationArchitecture",
    "reference.coreProcesses",
    "reference.templateModules",
    "reference.dataPermissions",
    "miel.title",
    "miel.intro",
    "miel.briefAgent",
    "miel.agentCanDecide",
    "miel.agentMustAsk",
    "miel.rejectIf",
    "miel.handoff",
    "miel.humanReview",
    "miel.machineContract",
    "collections.foundations",
    "collections.primitives",
    "collections.components",
    "collections.patterns",
    "collections.templates",
    "artifact.foundation",
    "artifact.primitive",
    "artifact.component",
    "artifact.pattern",
    "artifact.template",
  ];
  for (const locale of ["en", "es"]) {
    const localeCopy = uiCopy.locales?.[locale];
    if (!localeCopy) {
      add("errors", uiI18nFile, 1, `UI i18n missing locale: ${locale}.`);
      continue;
    }
    for (const key of requiredKeys) {
      if (!localeCopy[key]) {
        add("errors", uiI18nFile, 1, `UI i18n locale ${locale} missing key: ${key}.`);
      }
    }
  }
  const docsRuntime = [
    app,
    fs.existsSync(docsCatalogRenderersFile) ? read(docsCatalogRenderersFile) : "",
    fs.existsSync(docsContentSourcesFile) ? read(docsContentSourcesFile) : "",
    fs.existsSync(docsChromeFile) ? read(docsChromeFile) : "",
    fs.existsSync(docsDetailTabsFile) ? read(docsDetailTabsFile) : "",
    ...docsDetailTabsModuleFiles.map((file) => read(file)),
    fs.existsSync(docsLayoutFile) ? read(docsLayoutFile) : "",
    fs.existsSync(docsStateFile) ? read(docsStateFile) : "",
    fs.existsSync(path.join(docsAppDir, "component-foundation-trace.js")) ? read(path.join(docsAppDir, "component-foundation-trace.js")) : "",
    fs.existsSync(docsFamilyComponentDocsFile) ? read(docsFamilyComponentDocsFile) : "",
    fs.existsSync(docsFoundationExplorerFile) ? read(docsFoundationExplorerFile) : "",
    fs.existsSync(docsFoundationReferenceFile) ? read(docsFoundationReferenceFile) : "",
    fs.existsSync(docsFoundationVisualSectionsFile) ? read(docsFoundationVisualSectionsFile) : "",
    fs.existsSync(docsGoldComponentDocsFile) ? read(docsGoldComponentDocsFile) : "",
    ...docsGoldComponentModuleFiles.map((file) => read(file)),
    fs.existsSync(docsHomeStackRenderersFile) ? read(docsHomeStackRenderersFile) : "",
    fs.existsSync(docsInteractionsFile) ? read(docsInteractionsFile) : "",
    ...docsInteractionModuleFiles.map((file) => read(file)),
    fs.existsSync(docsShellReactFile) ? read(docsShellReactFile) : "",
    fs.existsSync(docsPrimitiveReferenceFile) ? read(docsPrimitiveReferenceFile) : "",
    fs.existsSync(docsReferenceLayoutFile) ? read(docsReferenceLayoutFile) : "",
    fs.existsSync(docsShellControlsFile) ? read(docsShellControlsFile) : "",
    fs.existsSync(docsVisualExamplesFile) ? read(docsVisualExamplesFile) : "",
  ].join("\n");
  for (const required of ["loadDocsContent", "function ui(", "applyLocalizedChrome", "setupLanguageToggle", "localStorage.setItem(\"system.locale\"", "ui(\"tabs.overview\")", "ui(\"overview.whyItExists\")", "ui(\"overview.publicTokens\")", "ui(\"build.specAndApi\")", "ui(\"build.qualityGates\")", "ui(\"build.apiAndFoundations\")", "ui(\"contract.pattern\")", "ui(\"contract.template\")", "ui(\"contract.api\")", "ui(\"table.name\")", "ui(\"table.prop\")", "ui(\"table.field\")", "ui(\"table.default\")", "ui(\"table.contract\")", "ui(\"table.layer\")", "ui(\"guidelines.title\")", "ui(\"guidelines.notes\")", "ui(\"tests.title\")", "ui(\"tests.required\")", "ui(\"tests.mustTest\")", "ui(\"component.operationalExample\")", "ui(\"component.variantStateBehavior\")", "ui(\"component.responsiveLayoutPatterns\")", "ui(\"playground.buttonControls\")", "ui(\"playground.selectControls\")", "ui(\"playground.cardControls\")", "ui(\"reference.tokenModel\")", "ui(\"reference.foundationContract\")", "ui(\"reference.primitiveApi\")", "ui(\"reference.purpose\")", "ui(\"reference.apiReference\")", "ui(\"reference.specificationMatrix\")", "ui(\"reference.tokenReference\")", "ui(\"reference.decisionTree\")", "ui(\"reference.screenSystem\")", "ui(\"reference.dataPermissions\")", "ui(\"reference.operationalScenario\")", "ui(\"reference.componentTestingContract\")", "ui(\"reference.foundationTrace\")", "ui(\"reference.semanticContract\")", "ui(\"miel.title\")", "ui(\"miel.briefAgent\")", "ui(\"miel.rejectIf\")", "ui(\"miel.handoff\")", "ui(\"miel.machineContract\")", "ui(\"shell.searchResults\")", "ui(\"shell.noSearchResults\")", "ui(\"shell.breadcrumbs\")", "ui(\"shell.sections\")", "ui(\"shell.detailNavigation\")", "ui(\"shell.brandHome\")", "grid.pageGrid", "ui(`collections.${key}`)", "function artifactTypeLabel"]) {
    if (!docsRuntime.includes(required)) {
      add("errors", appFile, 1, `Docs app must use i18n UI readiness helper: ${required}.`);
    }
  }
  const shell = read(docsShellReactFile);
  for (const required of [
    'key: "language"',
    'label: ui("shell.languageToggle")',
    "setCurrentLocale(currentLocale() === \"en\" ? \"es\" : \"en\")",
  ]) {
    if (!shell.includes(required)) {
      add("errors", docsShellReactFile, 1, `Docs app must expose i18n through the Flow Topbar language action: ${required}.`);
    }
  }
}

function checkDemoQualityInventory() {
  const catalog = readJson(catalogFile);
  const spec = readSpec();
  const patternCopy = readJson(patternCopyFile);
  const patternCopyIds = new Set(Object.keys(patternCopy?.patterns ?? {}));
  const patternSpecs = spec?.artifacts?.patterns ?? {};
  const documentationPatternSpecIds = Object.entries(patternSpecs)
    .filter(([, contract]) => contract?.patternKind === "Documentation")
    .map(([id]) => id)
    .sort();
  const productPatternSpecIds = Object.entries(patternSpecs)
    .filter(([, contract]) => contract?.patternKind !== "Documentation")
    .map(([id]) => id);
  const patternSpecIds = new Set(productPatternSpecIds);
  const templateSpecIds = new Set(Object.keys(spec?.artifacts?.templates ?? {}));
  const patternDemoFiles = [
    "pattern-candidate-demos.js",
    "pattern-desktop-react-demos.js",
    "pattern-desktop-demos.js",
    "pattern-mobile-react-demos.js",
    "pattern-mobile-demos.js",
    "pattern-utility-demos.js",
    "pattern-journey-react-demos.js",
    "pattern-journey-demos.js",
    "pattern-operational-react-demos.js",
    "pattern-operational-demos.js",
    "pattern-shell-react-demos.js",
    "pattern-contract-tabs.js",
    "pattern-focused-design.js",
    "pattern-business-renderers.js",
  ].map((file) => path.join(docsAppDir, file));
  const patternDemoRuntime = patternDemoFiles
    .filter((file) => fs.existsSync(file))
    .map((file) => read(file))
    .join("\n");
  const templateDesktopDemoFiles = ["template-desktop-demos.js", "template-react-demos.js"].map((file) => path.join(docsAppDir, file));
  const templateDesktopDemos = templateDesktopDemoFiles
    .filter((file) => fs.existsSync(file))
    .map((file) => read(file))
    .join("\n");
  const componentDemoFile = path.join(docsAppDir, "component-demo.js");
  const componentDemoRuntime = fs.existsSync(componentDemoFile) ? read(componentDemoFile) : "";
  const reactIslandsFile = path.join(docsAppDir, "react-component-islands.js");
  const reactIslands = fs.existsSync(reactIslandsFile) ? read(reactIslandsFile) : "";
  const patternReactIslandsFile = path.join(docsAppDir, "pattern-react-islands.js");
  const patternReactIslands = fs.existsSync(patternReactIslandsFile) ? read(patternReactIslandsFile) : "";
  const templateReactIslandsFile = path.join(docsAppDir, "template-react-islands.js");
  const templateReactIslands = fs.existsSync(templateReactIslandsFile) ? read(templateReactIslandsFile) : "";
  const desktopPatternReactIslandsFile = path.join(docsAppDir, "pattern-react-desktop-islands.js");
  const desktopPatternReactIslands = fs.existsSync(desktopPatternReactIslandsFile) ? read(desktopPatternReactIslandsFile) : "";
  const journeyPatternReactIslandsFile = path.join(docsAppDir, "pattern-react-journey-islands.js");
  const journeyPatternReactIslands = fs.existsSync(journeyPatternReactIslandsFile) ? read(journeyPatternReactIslandsFile) : "";
  const mobilePatternReactIslandsFile = path.join(docsAppDir, "pattern-react-mobile-islands.js");
  const mobilePatternReactIslands = fs.existsSync(mobilePatternReactIslandsFile) ? read(mobilePatternReactIslandsFile) : "";
  const operationalPatternReactIslandsFile = path.join(docsAppDir, "pattern-react-operational-islands.js");
  const operationalPatternReactIslands = fs.existsSync(operationalPatternReactIslandsFile) ? read(operationalPatternReactIslandsFile) : "";
  const shellPatternReactIslandsFile = path.join(docsAppDir, "pattern-react-shell-islands.js");
  const shellPatternReactIslands = fs.existsSync(shellPatternReactIslandsFile) ? read(shellPatternReactIslandsFile) : "";
  const candidatePatternReactIslandsFile = path.join(docsAppDir, "pattern-react-candidate-islands.js");
  const candidatePatternReactIslands = fs.existsSync(candidatePatternReactIslandsFile) ? read(candidatePatternReactIslandsFile) : "";
  const reactComponentsBlock = reactIslands.match(/const reactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const patternReactComponentsBlock = patternReactIslands.match(/const patternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const templateReactComponentsBlock = templateReactIslands.match(/const templateReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const desktopPatternReactComponentsBlock = desktopPatternReactIslands.match(/const desktopPatternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const journeyPatternReactComponentsBlock = journeyPatternReactIslands.match(/const journeyPatternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const mobilePatternReactComponentsBlock = mobilePatternReactIslands.match(/const mobilePatternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const operationalPatternReactComponentsBlock = operationalPatternReactIslands.match(/const operationalPatternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const shellPatternReactComponentsBlock = shellPatternReactIslands.match(/const shellPatternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const candidatePatternReactComponentsBlock = candidatePatternReactIslands.match(/const candidatePatternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const reactComponentKeys = new Set(
    [...`${reactComponentsBlock}\n${patternReactComponentsBlock}\n${templateReactComponentsBlock}\n${desktopPatternReactComponentsBlock}\n${journeyPatternReactComponentsBlock}\n${mobilePatternReactComponentsBlock}\n${operationalPatternReactComponentsBlock}\n${shellPatternReactComponentsBlock}\n${candidatePatternReactComponentsBlock}`.matchAll(/(?:"([a-z0-9-]+)"|\b([a-z][a-z0-9-]*))\s*:/g)].map((match) => match[1] ?? match[2]),
  );

  const components = catalog?.components ?? [];
  const patterns = catalog?.patterns ?? [];
  const templates = catalog?.templates ?? [];
  const componentIds = new Set(components.map((entry) => entry.id));
  const patternIds = new Set(patterns.map((entry) => entry.id));
  const templateIds = new Set(templates.map((entry) => entry.id));
  const componentDemosMissingRegistration = components
    .filter((entry) => componentDemoRuntime.includes(`component === "${entry.id}"`) && !reactComponentKeys.has(entry.id))
    .map((entry) => entry.id);
  const componentRegistryNotCatalog = [...reactComponentKeys].filter((id) => componentDemoRuntime.includes(`component === "${id}"`) && !componentIds.has(id)).sort();
  const patternsMissingCopy = patterns.filter((entry) => !patternCopyIds.has(entry.id)).map((entry) => entry.id);
  const patternsMissingSpec = patterns.filter((entry) => !patternSpecIds.has(entry.id)).map((entry) => entry.id);
  const patternCopyNotCatalog = [...patternCopyIds].filter((id) => !patternIds.has(id)).sort();
  const patternSpecNotCatalog = [...patternSpecIds].filter((id) => !patternIds.has(id)).sort();
  const templatesMissingSpec = templates.filter((entry) => !templateSpecIds.has(entry.id)).map((entry) => entry.id);
  const reactPatternDemoIds = [...new Set([...patternDemoRuntime.matchAll(/patternReactDemo\("([a-z0-9-]+)"/g)].map((match) => match[1]))].sort();
  const reactPatternDemosMissingRegistration = reactPatternDemoIds.filter((id) => !reactComponentKeys.has(id));
  const reactTemplateDemoIds = [...new Set([
    ...[...templateDesktopDemos.matchAll(/templateReactDemo\("([a-z0-9-]+)"/g)].map((match) => match[1]),
    ...[...templateDesktopDemos.matchAll(/component:\s*"([a-z0-9-]+)"/g)].map((match) => match[1]),
  ])].sort();
  const reactTemplateDemosMissingRegistration = reactTemplateDemoIds.filter((id) => !reactComponentKeys.has(id));
  const patternsMissingDedicatedDemo = patterns
    .filter((entry) => !patternDemoRuntime.includes(`"${entry.id}"`) && !patternDemoRuntime.includes(`'${entry.id}'`))
    .map((entry) => entry.id);
  const templatesMissingDesktopDemo = templates
    .filter((entry) => !templateDesktopDemos.includes(`"${entry.id}"`))
    .map((entry) => entry.id);

  result.inventory.demoQuality = {
    foundations: catalog?.foundations?.length ?? 0,
    primitives: catalog?.primitives?.length ?? 0,
    components: components.length,
    patterns: patterns.length,
    templates: templates.length,
    componentDemosMissingRegistration,
    componentRegistryNotCatalog,
    patternsMissingCopy,
    patternsMissingSpec,
    patternCopyNotCatalog,
    patternSpecNotCatalog,
    documentationPatternSpecIds,
    patternsMissingDedicatedDemo,
    reactPatternDemoIds,
    reactPatternDemosMissingRegistration,
    reactTemplateDemoIds,
    reactTemplateDemosMissingRegistration,
    templatesMissingSpec,
    templatesMissingDesktopDemo,
  };

  if (patternsMissingCopy.length) {
    add("warnings", patternCopyFile, 1, `Pattern catalog entries missing copy contracts: ${patternsMissingCopy.join(", ")}.`);
  }
  if (componentDemosMissingRegistration.length) {
    add("errors", reactIslandsFile, 1, `Component demos must mount through react-component-islands.js: ${componentDemosMissingRegistration.join(", ")}.`);
  }
  if (componentRegistryNotCatalog.length) {
    add("warnings", reactIslandsFile, 1, `Component demo registry includes non-catalog component demos: ${componentRegistryNotCatalog.join(", ")}.`);
  }
  if (patternsMissingSpec.length) {
    add("warnings", specFile, 1, `Pattern catalog entries missing machine-readable specs: ${patternsMissingSpec.join(", ")}.`);
  }
  if (patternCopyNotCatalog.length || patternSpecNotCatalog.length) {
    add("warnings", catalogFile, 1, `Pattern taxonomy drift: copy-only ${patternCopyNotCatalog.join(", ") || "none"}; spec-only ${patternSpecNotCatalog.join(", ") || "none"}.`);
  }
  if (patternsMissingDedicatedDemo.length) {
    add("warnings", docsAppDir, 1, `Patterns without a dedicated overview demo renderer: ${patternsMissingDedicatedDemo.join(", ")}.`);
  }
  if (reactPatternDemosMissingRegistration.length) {
    add("errors", reactIslandsFile, 1, `React pattern demos must mount through react-component-islands.js: ${reactPatternDemosMissingRegistration.join(", ")}.`);
  }
  if (reactTemplateDemosMissingRegistration.length) {
    add("errors", reactIslandsFile, 1, `React template demos must mount through react-component-islands.js: ${reactTemplateDemosMissingRegistration.join(", ")}.`);
  }
  if (templatesMissingSpec.length) {
    add("warnings", specFile, 1, `Template catalog entries missing machine-readable specs: ${templatesMissingSpec.join(", ")}.`);
  }
  if (templatesMissingDesktopDemo.length) {
    add("warnings", path.join(docsAppDir, "template-desktop-demos.js"), 1, `Templates without a dedicated desktop demo renderer: ${templatesMissingDesktopDemo.join(", ")}.`);
  }
}

module.exports = {
  checkPatternDependencyLayering,
  checkTemplateBlueprints,
  checkDemoQualityInventory,
  checkDetailShellTemplateReadiness,
  checkArtifactDetailSurfaceReadiness,
  checkFoundationPrimitiveDetailSurfaceReadiness,
  checkComponentDetailTemplateReadiness,
  checkFlowDocsV2PagesReadiness,
  checkI18nReadiness,
};
