import { simpleDemo, renderSimpleGoldSection } from "./gold-simple-component-docs.js?v=255";

export function countrySelectorDemo(value = "MX", state = "default", inline = false) {
  return simpleDemo("country-selector", { value, state, inline });
}
export function countrySelectorDemoFromData(demo = {}) { return simpleDemo("country-selector", demo); }

export function renderCountrySelectorGoldSection(entry, section) {
  return renderSimpleGoldSection(entry, section, countrySelectorDemoFromData);
}
