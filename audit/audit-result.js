const { result } = require("./audit-context.js");

function summarizeInventory(inventory) {
  const demoQuality = inventory.demoQuality ?? {};
  const componentReadiness = inventory.componentDetailTemplateReadiness ?? {};
  const artifactReadiness = inventory.artifactDetailSurfaceReadiness ?? {};
  const foundationPrimitiveReadiness = inventory.foundationPrimitiveDetailSurfaceReadiness ?? {};
  const flowDocsV2Pages = inventory.flowDocsV2Pages ?? {};
  const visualDebt = inventory.docsVisualDebt ?? [];
  return {
    demoQuality: {
      foundations: demoQuality.foundations ?? 0,
      primitives: demoQuality.primitives ?? 0,
      components: demoQuality.components ?? 0,
      patterns: demoQuality.patterns ?? 0,
      templates: demoQuality.templates ?? 0,
      missingRegistrations:
        (demoQuality.componentDemosMissingRegistration?.length ?? 0) +
        (demoQuality.reactPatternDemosMissingRegistration?.length ?? 0) +
        (demoQuality.reactTemplateDemosMissingRegistration?.length ?? 0),
    },
    detailSurfaces: {
      shellWrapperReady: inventory.detailShellTemplateReadiness?.wrapperReady ?? false,
      artifactSurfaceSections: artifactReadiness.migratedSurfaceSections ?? 0,
      foundationPrimitiveSurfaceSections: foundationPrimitiveReadiness.migratedSurfaceSections ?? 0,
      artifactDocPanelHotspots: artifactReadiness.rawDocPanelHotspots?.length ?? 0,
      foundationPrimitiveDocPanelHotspots: foundationPrimitiveReadiness.rawDocPanelHotspots?.length ?? 0,
    },
    componentDetailTemplate: {
      modules: componentReadiness.componentDetailModules ?? 0,
      templateReady: componentReadiness.migrationCategorySummary?.["template-ready"] ?? 0,
      customSlotGoverned: componentReadiness.migrationCategorySummary?.["custom-slot-governed"] ?? 0,
      ungovernedCustomRenderers: componentReadiness.ungovernedCustomGoldRenderers?.length ?? 0,
      rawDocPanelMatches: componentReadiness.rawDocPanelMatches ?? 0,
      rawInteractiveMatches: componentReadiness.rawInteractiveMatches ?? 0,
      allowedControlBridgeMatches: componentReadiness.rawControlBridgeMatches ?? 0,
      rawCardMatches: componentReadiness.rawCardMatches ?? 0,
      governedCardCompositionMatches: componentReadiness.governedCardCompositionMatches ?? 0,
    },
    flowDocsV2Pages: {
      detailRoutes: flowDocsV2Pages.detailRoutes ?? 0,
      expectedDetailRoutes: flowDocsV2Pages.expectedDetailRoutes ?? 0,
      collectionCounts: flowDocsV2Pages.collectionCounts ?? {},
      flowContentOwned: flowDocsV2Pages.flowContentOwned ?? false,
      shellReady: flowDocsV2Pages.shellReady ?? false,
      homeContentOwned: flowDocsV2Pages.homeContentOwned ?? false,
      detailPagesReady: flowDocsV2Pages.detailPagesReady ?? false,
      pageDebt: flowDocsV2Pages.pageDebt?.length ?? 0,
    },
    docsVisualDebt: visualDebt.map((entry) => ({
      id: entry.id,
      total: entry.total,
      files: entry.files,
    })),
  };
}

function finishAudit() {
  const fullOutput = process.argv.includes("--full") || process.argv.includes("--json");
  if (result.errors.length) result.status = "fail";
  console.log(JSON.stringify(fullOutput ? result : {
    status: result.status,
    errors: result.errors,
    warnings: result.warnings,
    info: result.info,
    inventorySummary: summarizeInventory(result.inventory),
  }, null, 2));
  if (result.errors.length) process.exitCode = 1;
}

module.exports = { finishAudit };
