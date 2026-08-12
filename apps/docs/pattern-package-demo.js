import { componentDemo } from "./component-demo.js?v=60";

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

function attrsToText(attrs = {}) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => value === "" || value === true ? key : `${key}="${escapeAttr(value)}"`)
    .join(" ");
}

export function patternPackageDemo(component, demo = {}, attrs = {}) {
  const markup = componentDemo(component, demo);
  if (!markup) return "";
  const { class: className, ...restAttrs } = attrs;
  const withClass = className
    ? markup.replace(/class="([^"]*)"/, `class="$1 ${escapeAttr(className)}"`)
    : markup;
  const attrText = attrsToText({ "data-pattern-component": component, ...restAttrs });
  return withClass.replace(/^<([a-z0-9-]+)/i, `<$1 ${attrText}`);
}
