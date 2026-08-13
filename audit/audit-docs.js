#!/usr/bin/env node

const {
  checkStaticHygiene,
  checkDocsModuleBoundaries,
  checkCssBalance,
} = require("./audit-css.js");
const { checkFrameLayoutContract } = require("./audit-frame-contracts.js");
const {
  checkFoundationRoutesAndContent,
  checkPrimitiveRoutesAndContent,
} = require("./audit-routes.js");
const {
  checkPatternDependencyLayering,
  checkTemplateBlueprints,
  checkDemoQualityInventory,
  checkDetailShellTemplateReadiness,
  checkArtifactDetailSurfaceReadiness,
  checkFoundationPrimitiveDetailSurfaceReadiness,
  checkComponentDetailTemplateReadiness,
  checkFlowDocsV2PagesReadiness,
  checkI18nReadiness,
} = require("./audit-docs-content.js");
const {
  checkHomeContentOwnership,
  checkFoundationCopyOwnership,
  checkPrimitiveCopyOwnership,
  checkReferenceCopyOwnership,
  checkDocsContentOwnership,
} = require("./audit-content-ownership.js");
const {
  checkDocsComponentCssOwnership,
  checkDocsPackageMarkupOwnership,
  checkPatternComponentBoundaryOwnership,
  checkDocsPackageImportBoundary,
  checkPublicClassNamespaceOwnership,
  checkDocsVisualDebtInventory,
} = require("./audit-css-ownership.js");
const { checkFoundationCascadeContracts } = require("./audit-foundation-cascade-contracts.js");
const { checkDocsShellBoundary } = require("./audit-docs-shell-boundary.js");
const { finishAudit } = require("./audit-result.js");

checkStaticHygiene();
checkDocsModuleBoundaries();
checkCssBalance();
checkFrameLayoutContract();
checkFoundationRoutesAndContent();
checkPrimitiveRoutesAndContent();
checkPatternDependencyLayering();
checkTemplateBlueprints();
checkDemoQualityInventory();
checkDetailShellTemplateReadiness();
checkArtifactDetailSurfaceReadiness();
checkFoundationPrimitiveDetailSurfaceReadiness();
checkComponentDetailTemplateReadiness();
checkI18nReadiness();
checkHomeContentOwnership();
checkFoundationCopyOwnership();
checkPrimitiveCopyOwnership();
checkReferenceCopyOwnership();
checkDocsContentOwnership();
checkFoundationCascadeContracts();
checkDocsShellBoundary();
checkDocsComponentCssOwnership();
checkDocsPackageMarkupOwnership();
checkPatternComponentBoundaryOwnership();
checkDocsPackageImportBoundary();
checkPublicClassNamespaceOwnership();
checkDocsVisualDebtInventory();
checkFlowDocsV2PagesReadiness();

finishAudit();
