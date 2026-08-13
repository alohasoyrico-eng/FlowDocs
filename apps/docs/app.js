import { artifactCard, artifactTypeLabel, docsLinkCard, configureCatalogRenderers, groupCollection, label } from "./catalog-renderers.js";
import { loadDocsContent } from "./content-sources.js?v=203";
import { accessibilityPanel, agentPanel, configureDetailTabs, detailTabs, guidelinesPanel, listPanel, specPanel, threeTabs } from "./detail-tabs.js?v=58";
import { setupDocumentationInteractions, setupGlobalDocumentInteractions } from "./doc-interactions.js?v=295";
import { applyLocalizedChrome, configureDocsChrome, setupLanguageToggle } from "./docs-chrome.js?v=2";
import { renderCollectionContent, renderDetailContent, renderShell } from "./docs-layout.js?v=225";
import {
  applyDocsContent,
  artifactContract,
  collectionMeta,
  collections,
  componentAgentSpec,
  componentCopy,
  componentDocs,
  componentImplementationStatus,
  configureDocsState,
  currentLocale,
  findAny,
  findComponent,
  findPattern,
  foundationCopy,
  homeContent,
  patternCopy,
  primitiveCopy,
  referenceCopy,
  searchIndex,
  setCurrentLocale,
  stack,
  templateBlueprintFallbacks,
  templateBlueprints,
  ui,
} from "./docs-state.js";
import { artifactFoundationTracePanel, configureFamilyComponentDocs, familyComponentTabs } from "./family-component-docs.js?v=4";
import { configureFoundationReference, foundationReferenceContent, foundationRoles, foundationSubtitle } from "./foundation-reference.js?v=1";
import { accordionDemo, auditEventDemo, avatarDemo, badgeDemo, biometricPromptDemo, breadcrumbsDemo, buttonDemo, cardDemo, cardExpiryInputDemo, cardNumberInputDemo, cardSecurityCodeInputDemo, cardSummaryDemo, checkboxDemo, chipDemo, comboboxDemo, configureGoldComponentDocs, countrySelectorDemo, demoCell, dialogDemo, drawerDemo, emptyStateDemo, errorPanelDemo, floatingActionButtonDemo, goldComponentDocumentationTabs, iconButtonDemo, inlineValidationDemo, animatedMomentDemo, menuDemo, motionBoundaryDemo, movementRowDemo, paginationDemo, popoverDemo, progressIndicatorDemo, quickActionDemo, radioButtonDemo, selectDemo, skeletonDemo, spinnerDemo, sliderDemo, stepperDemo, switchDemo, tableDemo, tabsDemo, tabsDemoFromData, tagDemo, textAreaDemo, inputDemo, toastDemo, tooltipDemo, treeViewDemo } from "./gold-component-docs.js?v=325";
import { hydrateHomeHeroIllustration } from "./home-illustrations.js?v=1";
import { renderHomeContent, renderStackContent } from "./home-stack-renderers.js?v=3";
import { collectionIcon, configureIconSystem, icon, iconFor, tabIcon } from "./icon-system.js?v=199";
import { configureDocsShell, renderDocsShell } from "./docs-shell-react.js?v=2";
import {
  configurePrimitiveReference,
  primitiveApiReferenceSection,
  primitiveLiveDemoSection,
  primitivePurposeSection,
  primitiveResponsibilitiesReferenceSection,
  primitiveSpecMatrixSection,
  primitiveTokenReferenceSection,
} from "./primitive-reference.js?v=1";
import {
  configureReferenceLayout,
  referenceCallout,
  referenceCodeBlock,
  referenceDivider,
  referenceHeader,
  referencePeerNav,
  referenceSection,
} from "./reference-layout.js?v=1";
import { setupContrastToggle, setupGridOverlay, toggleContrastState, toggleGridOverlay, updateGridOverlay } from "./shell-controls.js?v=2";
import { escapeHtml, html, interpolateList, referenceTemplate, slug } from "./utils.js";
import { configureVisualExamples, examplePanel, foundationExample, journeyCopy, primitiveExample, visualPanel } from "./visual-examples.js?v=2";

const $ = (selector) => document.querySelector(selector);
const app = $("#app");
window.__systemBoot = { status: "starting" };

function route() {
  const hash = window.location.hash || "#/home";
  const [collection, id] = hash.replace("#/", "").split("/");
  return { collection: collection || "home", id };
}

function render() {
  configureLocalizedRenderers();
  const current = route();
  delete document.body.dataset.navOpen;
  if (current.collection === "home") renderHome();
  else if (current.collection === "stack") renderStack();
  else if (current.collection === "foundations" && !current.id) {
    window.location.hash = "#/foundations/energy";
    return;
  } else if (current.collection === "primitives" && !current.id) {
    window.location.hash = "#/primitives/color";
    return;
  }
  else if (collections[current.collection] && current.id) renderDetail(current.collection, current.id);
  else if (collections[current.collection]) renderCollection(current.collection);
  else renderHome();
  renderDocsShell(current);
  app.focus({ preventScroll: true });
  requestAnimationFrame(() => requestAnimationFrame(updateGridOverlay));
}

function configureLocalizedRenderers() {
  configureCatalogRenderers(catalogRendererDeps());
  configureReferenceLayout(referenceLayoutDeps());
  configureFoundationReference(foundationReferenceDeps());
  configureGoldComponentDocs(goldComponentDocsDeps());
  configureDetailTabs(detailTabsDeps());
  configureFamilyComponentDocs(familyComponentDocsDeps());
  configurePrimitiveReference(primitiveReferenceDeps());
  configureVisualExamples(visualExampleDeps());
}

function shell(content, active = "") {
  return renderShell({ active, collectionIcon, collections, content, current: route(), html, icon, iconFor, label, ui });
}

function renderHome() {
  app.innerHTML = shell(renderHomeContent({ docsLinkCard, collections, findAny, homeContent, html, icon, slug, stack, ui }), "home");
  hydrateHomeHeroIllustration(app);
}

function renderCollection(collection) {
  const meta = collectionMeta[collection];
  if (!meta || !collections[collection]) {
    renderHome();
    return;
  }
  app.innerHTML = shell(renderCollectionContent({ artifactCard, collection, collections, collectionMeta, groupCollection, html, label }), collection);
}

function renderDetail(collection, id) {
  if (!collections[collection]) {
    renderHome();
    return;
  }
  const routeAliases = {
    foundations: { motion: "momentum" },
    components: { "otp-input": "code-input" },
  };
  const normalizedId = routeAliases[collection]?.[id] ?? id;
  if (normalizedId !== id) {
    window.location.hash = `#/${collection}/${normalizedId}`;
    return;
  }
  const entry = collections[collection].find((candidate) => candidate.id === normalizedId);
  if (!entry) return renderCollection(collection);
  if (collection === "foundations") return renderFoundationDetail(entry);
  if (collection === "primitives") return renderPrimitiveDetail(entry);
  const tabs = detailTabs(collection, entry);
  app.innerHTML = shell(renderDetailContent({ artifactTypeLabel, collection, componentImplementationStatus, entry, html, icon, id, label, tabIcon, tabs, ui }), collection);

  const tabShell = document.querySelector('[data-react-component="detail-shell-tabs"]');
  const activateTab = (tabId) => {
    const selected = tabs.find((tab) => tab.id === tabId);
    if (!selected) return;
    $("#tabPanel").innerHTML = selected.body;
    setupDocumentationInteractions(interactionDeps());
  };
  tabShell?.addEventListener("docs-detail-tab-change", (event) => activateTab(event.detail?.tabId));
  setupDocumentationInteractions(interactionDeps());
}

function renderFoundationDetail(entry) {
  app.innerHTML = shell(
    html`
      <article class="reference-doc foundation-deep-dive" data-doc-primitive="foundation-reference-page" data-detail="foundations:${entry.id}">
        <div class="reference-main">
          ${referenceHeader("foundations", entry, { chapter: "Foundation Deep Dive", subtitle: foundationSubtitle(entry) })}
          ${referenceDivider()}
          <div class="reference-stack">
            ${foundationReferenceContent(entry)}
          </div>
        </div>
      </article>
    `,
    "foundations",
  );
  setupDocumentationInteractions(interactionDeps());
}

function renderPrimitiveDetail(entry) {
  app.innerHTML = shell(
    html`
      <article class="reference-doc primitive-deep-dive" data-doc-primitive="primitive-reference-page" data-detail="primitives:${entry.id}">
        <div class="reference-main">
          ${referenceHeader("primitives", entry, { chapter: "Primitive Deep Dive", subtitle: "L2 implementation primitive" })}
          ${referenceDivider()}
          <div class="reference-stack">
            ${primitivePurposeSection(entry)}
            ${referenceDivider()}
            ${primitiveLiveDemoSection(entry)}
            ${primitiveResponsibilitiesReferenceSection(entry)}
            ${primitiveApiReferenceSection(entry)}
            ${primitiveSpecMatrixSection(entry)}
            ${primitiveTokenReferenceSection(entry)}
          </div>
        </div>
      </article>
    `,
    "primitives",
  );
  setupDocumentationInteractions(interactionDeps());
}

function renderStack() {
  app.innerHTML = shell(renderStackContent({ html, referenceCopy, stack }), "stack");
}


function visualExampleDeps() {
  return {
    html,
    icon,
    iconButtonDemo,
    iconFor,
    interpolateList,
    referenceCopy,
    referenceTemplate,
    templateBlueprintFallbacks,
    templateBlueprints,
    ui,
  };
}

function referenceLayoutDeps() {
  return {
    collections,
    escapeHtml,
    html,
    icon,
    iconFor,
    label,
    ui,
  };
}

function catalogRendererDeps() {
  return {
    collectionMeta,
    componentImplementationStatus,
    html,
    icon,
    iconFor,
    ui,
  };
}

function foundationReferenceDeps() {
  return {
    artifactContract,
    foundationCopy,
    foundationExample,
    html,
    icon,
    iconFor,
    referenceCopy,
    referenceTemplate,
    ui,
  };
}

function primitiveReferenceDeps() {
  return {
    artifactContract,
    buttonDemo,
    html,
    icon,
    iconButtonDemo,
    primitiveCopy,
    ui,
  };
}

function goldComponentDocsDeps() {
  return {
    artifactContract,
    componentAgentSpec,
    componentCopy,
    componentDocs,
    html,
    icon,
    referenceCopy,
    slug,
    ui,
  };
}

function familyComponentDocsDeps() {
  return {
    accessibilityPanel,
    agentPanel,
    artifactContract,
    componentCopy,
    demoCell,
    guidelinesPanel,
    html,
    icon,
    iconFor,
    interpolateList,
    listPanel,
    referenceCopy,
    referenceTemplate,
    selectDemo,
    specPanel,
    threeTabs,
    ui,
  };
}

function detailTabsDeps() {
  return {
    artifactContract,
    artifactFoundationTracePanel,
    docsLinkCard,
    componentDocs,
    componentAgentSpec,
    componentCopy,
    patternCopy,
    examplePanel,
    familyComponentTabs,
    findComponent,
    findPattern,
    foundationExample,
    foundationRoles,
    goldComponentDocumentationTabs,
    html,
    icon,
    iconFor,
    interpolateList,
    journeyCopy,
    primitiveExample,
    referenceCopy,
    referenceTemplate,
    slug,
    templateBlueprintFallbacks,
    templateBlueprints,
    ui,
    visualPanel,
  };
}

function interactionDeps() {
  return {
    accordionDemo, avatarDemo, buttonDemo, badgeDemo, cardDemo, chipDemo, dialogDemo, drawerDemo, emptyStateDemo,
    componentSectionData: (componentId, sectionId) => componentCopy?.components?.[componentId]?.[sectionId] ?? {},
    escapeHtml,
    foundationCopy,
    icon,
    primitiveCopy,
    comboboxDemo, countrySelectorDemo, iconButtonDemo, inlineValidationDemo, menuDemo, progressIndicatorDemo, radioButtonDemo, selectDemo,
    skeletonDemo, spinnerDemo, sliderDemo, stepperDemo, switchDemo, tableDemo, tagDemo, tabsDemo, tabsDemoFromData, tooltipDemo, toastDemo, textAreaDemo, inputDemo, cardNumberInputDemo, cardExpiryInputDemo, cardSecurityCodeInputDemo, checkboxDemo,
  };
}

async function boot() {
  try {
    window.__systemBoot.status = "loading-content";
    configureDocsState({ configureIconSystem, slug });
    applyDocsContent(await loadDocsContent());
    window.__systemBoot.status = "configuring";
    configureDocsChrome({ currentLocale: () => currentLocale, render, setCurrentLocale, ui });
    configureDocsShell({
      currentLocale: () => currentLocale,
      render,
      setCurrentLocale,
      ui,
      collections,
      collectionIcon,
      iconFor,
      label,
      searchIndex,
      toggleContrastState,
      toggleGridOverlay,
    });
    configureLocalizedRenderers();
    applyLocalizedChrome();
    setupContrastToggle();
    setupGridOverlay({ ui });
    setupGlobalDocumentInteractions();
    setupLanguageToggle();
    renderDocsShell(route());
    window.__systemBoot.status = "rendering";
    render();
    window.__systemBoot.status = "ready";
  } catch (error) {
    window.__systemBoot = { status: "failed", message: error?.message ?? String(error), stack: error?.stack ?? "" };
    console.error(ui("shell.bootFailedLog"), error);
    app.innerHTML = `<main class="section"><section class="surface docs-section-surface detail-section-surface wide" data-surface-role="section" data-surface-elevation="none" data-surface-tone="default" data-doc-template="artifact-detail"><h1>${ui("shell.bootFailedTitle")}</h1><p>${escapeHtml(window.__systemBoot.message)}</p></section></main>`;
  }
}

window.addEventListener("hashchange", render);
boot();
