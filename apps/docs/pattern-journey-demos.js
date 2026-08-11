import { html } from "./detail-tabs-core.js?v=3";
import { componentDemo } from "./component-demo.js?v=60";
import { journeyReactPatternOverviewDemo } from "./pattern-journey-react-demos.js?v=1";

function packageDemo(component, demo = {}, attrs = {}) {
  const markup = componentDemo(component, demo);
  if (!markup) return "";
  const attrText = Object.entries({ "data-pattern-component": component, ...attrs })
    .map(([key, value]) => value === "" ? key : `${key}="${String(value).replace(/"/g, "&quot;")}"`)
    .join(" ");
  return markup.replace(/^<([a-z0-9-]+)/i, `<$1 ${attrText}`);
}

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function patternReactDemo(pattern, props, state = "default", variant = "standard") {
  return `<div class="docs-react-island docs-pattern-demo" data-react-component="${pattern}" data-component-source="react-pattern" data-doc-pattern="${pattern}" data-demo-variant="${escapeAttribute(variant)}" data-demo-state="${escapeAttribute(state)}" data-variant="${escapeAttribute(variant)}" data-state="${escapeAttribute(state)}" data-full-width="true" data-react-props="${escapeAttribute(JSON.stringify(props))}"></div>`;
}

export function journeyPatternOverviewDemo(patternId) {
  const reactDemo = journeyReactPatternOverviewDemo(patternId);
  if (reactDemo) return reactDemo;
  if (patternId === "authentication-login-biometrics-and-otp") return authJourneyDemoPanel();
  if (patternId === "driver-onboarding-mobile") return driverOnboardingDemoPanel();
  if (patternId === "fleet-manager-onboarding-desktop") return fleetManagerOnboardingDemoPanel();
  return "";
}

function authJourneyDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-journey-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Recoverable sign-in</h2>
      ${patternReactDemo("authentication-login-biometrics-and-otp", {
        label: "Recoverable sign-in",
        description: "Used for OTP and account recovery.",
        density: "md",
        phone: { label: "Phone number", value: "55 1842 9011", helper: "Used for OTP and account recovery." },
        validation: { label: "Authentication status", message: "Send a code or use biometrics to continue.", state: "info" },
        recovery: { label: "Authentication needs review", description: "Retry OTP or use account recovery before continuing.", action: { label: "Review recovery" } },
        "data-pattern-demo": "authentication-login-biometrics-and-otp",
      })}
    </section>
  `;
}

function driverOnboardingDemoPanel() {
  return html`
    <section class="doc-panel wide pattern-journey-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Driver mobile setup</h2>
      <div class="pattern-driver-onboarding pattern-journey-demo pattern-journey-demo--mobile" data-driver-onboarding-demo data-journey-step="0">
        <div data-journey-stepper>
          ${packageDemo("stepper", { current: 0, steps: [{ label: "Identity", description: "Phone" }, { label: "Trust", description: "Device" }, { label: "Ready", description: "Start" }] })}
        </div>
        <div class="pattern-journey-step" data-journey-panel="0">
          ${packageDemo("phone-input", { label: "Driver phone", value: "55 1030 4481", helper: "Used for dispatch and verification." })}
          <div data-driver-validation hidden>${packageDemo("inline-validation", { label: "Driver phone", message: "Phone verification is required before device setup.", state: "warning" })}</div>
        </div>
        <div class="pattern-journey-step" data-journey-panel="1" hidden>
          ${packageDemo("code-input", { label: "Verification code", value: "", helper: "Enter the SMS code before enabling biometrics." })}
          ${packageDemo("biometric-prompt", { label: "Enable quick access", description: "Let the driver unlock trip tools faster on this device.", actionLabel: "Enable", fallback: "Skip for now" })}
        </div>
        <div class="pattern-journey-step pattern-journey-step--summary" data-journey-panel="2" hidden>
          ${packageDemo("animated-moment", { label: "Setup ready", state: "idle", meta: "Driver can start after confirmation.", icon: "check_circle" })}
          ${packageDemo("card-summary", { label: "Driver readiness", description: "Phone verified, device trust optional, support fallback available.", meta: "3 of 3 setup checks" })}
        </div>
        <footer class="pattern-journey-actions pattern-journey-actions--split">
          ${packageDemo("button", { label: "Back", variant: "secondary" }, { "data-driver-back": "", hidden: "" })}
          ${packageDemo("button", { label: "Continue", icon: "arrow_forward" }, { "data-driver-next": "" })}
        </footer>
        <div data-driver-toast hidden>${packageDemo("toast", { label: "Driver setup complete", description: "Mobile onboarding is ready for first use.", tone: "success" })}</div>
      </div>
    </section>
  `;
}

function fleetManagerOnboardingDemoPanel() {
  const rows = [
    { id: "jmx-214-b", plate: "JMX-214-B", driver: "Ana Sosa", status: "Ready", spend: "$842" },
    { id: "kld-901-c", plate: "KLD-901-C", driver: "Luis Vera", status: "Needs role", spend: "$631" },
  ];
  return html`
    <section class="doc-panel wide pattern-journey-panel">
      <span class="eyebrow">Interactive demo</span>
      <h2>Fleet manager workspace setup</h2>
      <div class="pattern-fleet-onboarding pattern-journey-demo" data-fleet-onboarding-demo data-journey-step="0">
        <div data-journey-stepper>
          ${packageDemo("stepper", { current: 0, steps: [{ label: "Workspace", description: "Profile" }, { label: "Fleet", description: "Import" }, { label: "Access", description: "Roles" }] })}
        </div>
        <div class="pattern-fleet-onboarding__layout">
          <div class="pattern-journey-step" data-journey-panel="0">
            ${packageDemo("input", { label: "Workspace name", value: "North fleet operations" }, { "data-fleet-field": "workspace" })}
            ${packageDemo("select", { label: "Operating region", value: "mx", options: [{ label: "Mexico", value: "mx" }, { label: "Colombia", value: "co" }, { label: "Brazil", value: "br" }] })}
          </div>
          <div class="pattern-journey-step" data-journey-panel="1" hidden>
            <div class="pattern-fleet-onboarding__metrics">
              ${packageDemo("kpi-tile", { label: "Vehicles", value: "42", trend: "12 ready", tone: "info", icon: "directions_car" })}
              ${packageDemo("kpi-tile", { label: "Policies", value: "8", trend: "2 need review", tone: "warning", icon: "rule" })}
            </div>
            ${packageDemo("table", { label: "Import preview", rows }, { "data-fleet-import-table": "" })}
          </div>
          <div class="pattern-journey-step" data-journey-panel="2" hidden>
            ${packageDemo("checkbox", { label: "Invite operations owner", description: "Can approve limits and review exceptions.", value: "ops-owner" }, { "data-fleet-permission": "" })}
            ${packageDemo("checkbox", { label: "Invite finance reviewer", description: "Can review spend and export reports.", value: "finance" }, { "data-fleet-permission": "" })}
            ${packageDemo("badge", { label: "2 roles pending", tone: "warning", variant: "standard" }, { "data-fleet-role-count": "" })}
          </div>
          <aside class="pattern-fleet-onboarding__aside">
            ${packageDemo("empty-state", { label: "Setup stays in draft", description: "Save when workspace, fleet data, and access are reviewed.", icon: "inventory" })}
            <div data-fleet-validation hidden>${packageDemo("inline-validation", { label: "Workspace setup", message: "Review each setup stage before finishing.", state: "warning" })}</div>
          </aside>
        </div>
        <footer class="pattern-journey-actions pattern-journey-actions--split">
          ${packageDemo("button", { label: "Back", variant: "secondary" }, { "data-fleet-back": "", hidden: "" })}
          ${packageDemo("button", { label: "Continue setup", icon: "arrow_forward" }, { "data-fleet-next": "" })}
        </footer>
        <div data-fleet-toast hidden>${packageDemo("toast", { label: "Workspace setup saved", description: "The fleet manager can continue into templates.", tone: "success" })}</div>
      </div>
    </section>
  `;
}
