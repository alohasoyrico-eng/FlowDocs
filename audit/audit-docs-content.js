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
  docsNavigationFile,
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
    fs.existsSync(docsFamilyComponentDocsFile) ? read(docsFamilyComponentDocsFile) : "",
    fs.existsSync(docsFoundationExplorerFile) ? read(docsFoundationExplorerFile) : "",
    fs.existsSync(docsFoundationReferenceFile) ? read(docsFoundationReferenceFile) : "",
    fs.existsSync(docsFoundationVisualSectionsFile) ? read(docsFoundationVisualSectionsFile) : "",
    fs.existsSync(docsGoldComponentDocsFile) ? read(docsGoldComponentDocsFile) : "",
    ...docsGoldComponentModuleFiles.map((file) => read(file)),
    fs.existsSync(docsHomeStackRenderersFile) ? read(docsHomeStackRenderersFile) : "",
    fs.existsSync(docsInteractionsFile) ? read(docsInteractionsFile) : "",
    ...docsInteractionModuleFiles.map((file) => read(file)),
    fs.existsSync(docsNavigationFile) ? read(docsNavigationFile) : "",
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
  const index = read(docsIndexFile);
  if (!index.includes('id="languageToggle"')) {
    add("errors", docsIndexFile, 1, "Docs app must expose a language toggle for i18n readiness.");
  }
}

function checkDemoQualityInventory() {
  const catalog = readJson(catalogFile);
  const spec = readSpec();
  const patternCopy = readJson(patternCopyFile);
  const patternCopyIds = new Set(Object.keys(patternCopy?.patterns ?? {}));
  const patternSpecIds = new Set(Object.keys(spec?.artifacts?.patterns ?? {}));
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
  const templateDesktopDemoFiles = ["template-desktop-demos.js", "template-domain-demos.js"].map((file) => path.join(docsAppDir, file));
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
  const desktopPatternReactIslandsFile = path.join(docsAppDir, "pattern-react-desktop-islands.js");
  const desktopPatternReactIslands = fs.existsSync(desktopPatternReactIslandsFile) ? read(desktopPatternReactIslandsFile) : "";
  const journeyPatternReactIslandsFile = path.join(docsAppDir, "pattern-react-journey-islands.js");
  const journeyPatternReactIslands = fs.existsSync(journeyPatternReactIslandsFile) ? read(journeyPatternReactIslandsFile) : "";
  const mobilePatternReactIslandsFile = path.join(docsAppDir, "pattern-react-mobile-islands.js");
  const mobilePatternReactIslands = fs.existsSync(mobilePatternReactIslandsFile) ? read(mobilePatternReactIslandsFile) : "";
  const shellPatternReactIslandsFile = path.join(docsAppDir, "pattern-react-shell-islands.js");
  const shellPatternReactIslands = fs.existsSync(shellPatternReactIslandsFile) ? read(shellPatternReactIslandsFile) : "";
  const candidatePatternReactIslandsFile = path.join(docsAppDir, "pattern-react-candidate-islands.js");
  const candidatePatternReactIslands = fs.existsSync(candidatePatternReactIslandsFile) ? read(candidatePatternReactIslandsFile) : "";
  const reactComponentsBlock = reactIslands.match(/const reactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const patternReactComponentsBlock = patternReactIslands.match(/const patternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const desktopPatternReactComponentsBlock = desktopPatternReactIslands.match(/const desktopPatternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const journeyPatternReactComponentsBlock = journeyPatternReactIslands.match(/const journeyPatternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const mobilePatternReactComponentsBlock = mobilePatternReactIslands.match(/const mobilePatternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const shellPatternReactComponentsBlock = shellPatternReactIslands.match(/const shellPatternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const candidatePatternReactComponentsBlock = candidatePatternReactIslands.match(/const candidatePatternReactComponents = \{([\s\S]*?)\n\};/)?.[1] ?? "";
  const reactComponentKeys = new Set(
    [...`${reactComponentsBlock}\n${patternReactComponentsBlock}\n${desktopPatternReactComponentsBlock}\n${journeyPatternReactComponentsBlock}\n${mobilePatternReactComponentsBlock}\n${shellPatternReactComponentsBlock}\n${candidatePatternReactComponentsBlock}`.matchAll(/(?:"([a-z0-9-]+)"|\b([a-z][a-z0-9-]*))\s*:/g)].map((match) => match[1] ?? match[2]),
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
  const patternsMissingDedicatedDemo = patterns
    .filter((entry) => !patternDemoRuntime.includes(`"${entry.id}"`) && !patternDemoRuntime.includes(`'${entry.id}'`))
    .map((entry) => entry.id);
  const templatesMissingDesktopDemo = templates
    .filter((entry) => !templateDesktopDemos.includes(`entry.id === "${entry.id}"`))
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
    patternsMissingDedicatedDemo,
    reactPatternDemoIds,
    reactPatternDemosMissingRegistration,
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
  checkI18nReadiness,
};
