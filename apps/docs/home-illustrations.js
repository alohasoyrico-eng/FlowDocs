import { createIllustrationAsset } from "#design-system/components";

export function hydrateHomeHeroIllustration(root) {
  const slot = root.querySelector("[data-illustration-slot='home-intro']");
  if (!slot) return;
  const { assetNode } = createIllustrationAsset({
    id: slot.dataset.illustrationId,
    src: slot.dataset.src,
    darkSrc: slot.dataset.darkSrc,
    alt: slot.dataset.alt,
    purpose: slot.dataset.purpose,
    source: slot.dataset.source,
    density: "lg",
    theme: "auto",
    loading: "eager",
    fallbackText: "Intro illustration unavailable",
  });
  assetNode.classList.add("docs-intro-visual__asset");
  slot.replaceChildren(assetNode);
}
