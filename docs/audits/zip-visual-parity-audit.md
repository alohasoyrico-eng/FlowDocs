# ZIP Visual Parity Audit

This is an evidence map, not a parity certificate. Every listed artifact remains `not-certified` until it has side-by-side screenshots and a written gap classification.

## Baselines
- Flow ZIP: /Users/r1c0/Desktop/Design system multiplataforma desde cero.zip
- Docs ZIP: /Users/r1c0/Desktop/Docs-para-design-system-multiplataforma-desde-cero.zip
- FlowDocs commit: 35a3c74
- Flow commit: b49a06c7

## Counts
- Current: 11 foundations, 24 primitives, 60 components, 63 patterns, 9 templates.
- ZIP baseline: 46 component registry entries, 14 pattern entries, 7 template entries, 59 demos, 34 UI kit files, 5 handoff screenshots.
- Review matrix entries: 132.

## Evidence Status
- baseline-demo-blocked-current-captured: 1
- no-baseline-match-found: 60
- source-mapped-visual-review-pending: 71

## Risk Categories
- visual-parity-unverified: 132
- motion-parity: 110
- surface-card-variant-parity: 73
- form-control-parity: 61
- data-density-parity: 47
- shell-navigation-parity: 36
- mobile-interaction-parity: 26
- map-spatial-parity: 21
- dark-theme-parity: 2

## Required One-by-One Protocol
1. Capture the current FlowDocs route in desktop and mobile when applicable.
2. Capture the ZIP baseline source: demo HTML, UI kit, registry source, or handoff screenshot.
3. Compare layout, spacing, radius, shadows, typography, color, density, dark mode, interaction and motion.
4. Classify the gap as Flow token, Flow component, Flow pattern, Flow template, or docs-content gap.
5. Document the required improvement before implementation.

## Review Batches
### batch-01-shell-and-docs-surface
Topbar/sidebar/docs shell failures were already observed by the user.

- patterns/topbar
- patterns/sidebar
- patterns/search
- patterns/fleet-manager-onboarding-desktop
- patterns/settings
- patterns/email-template-layout
- patterns/agent-conversation
- templates/driver-mobile-app
- templates/fleet-manager-desktop
- templates/driver-card-wallet
- templates/routes-and-stations
- templates/fleet-dashboard-suite
- templates/configuration-console
- templates/agent-workspace
- templates/internal-operations-console
- templates/settings-workspace

### batch-02-mobile-domain-patterns
Mobile/domain flows depend on multiple components and have high visual/interaction variance.

- components/card-number-input
- components/card-expiry-input
- components/card-security-code-input
- components/card-summary
- components/station-pin
- components/card
- patterns/kpi-card
- patterns/authentication-login-biometrics-and-otp
- patterns/driver-onboarding-mobile
- patterns/fleet-manager-onboarding-desktop
- patterns/station-discovery
- templates/driver-mobile-app
- templates/driver-card-wallet
- templates/routes-and-stations

### batch-03-card-surface-data-components
Card variants, tables and dashboards are likely parity hotspots.

- components/card-number-input
- components/card-expiry-input
- components/card-security-code-input
- components/card-summary
- components/kpi-tile
- components/chart-panel
- components/card
- components/table
- patterns/kpi-card
- patterns/virtual-data-table
- patterns/drag-sortable-list
- patterns/chart-wrapper
- patterns/gantt-chart
- patterns/waterfall-chart
- patterns/polar-chart
- patterns/timeline
- patterns/chart-legend-item
- patterns/kanban-board
- patterns/filterable-editable-table
- patterns/expandable-detail-table
- templates/driver-card-wallet
- templates/fleet-dashboard-suite

### batch-04-forms-controls
Controls need exact field density, state and motion parity.

- components/input
- components/input-amount
- components/card-number-input
- components/card-expiry-input
- components/card-security-code-input
- components/code-input
- components/checkbox
- components/radio-button
- components/switch
- components/select
- components/combobox
- components/slider
- components/text-area
- components/phone-input
- components/country-selector
- components/date-picker
- components/stepper
- components/inline-validation
- components/dialog
- components/popover
- components/accordion
- components/card
- components/chip
- components/animated-moment
- patterns/topbar
- patterns/search
- patterns/autocomplete
- patterns/select-option-layer
- patterns/checkbox-group
- patterns/radio-group
- patterns/multi-select
- patterns/kpi-card
- patterns/command-palette
- patterns/fullscreen-sheet
- patterns/form-section
- patterns/toolbar
- patterns/swipe-actions
- patterns/drawer-adapter
- patterns/virtual-data-table
- patterns/advanced-filters
- ... 21 more in JSON

### batch-05-rest-and-certification
Everything else still requires visual certification before claiming parity.

- components/button
- components/icon-button
- components/input-amount
- components/code-input
- components/checkbox
- components/radio-button
- components/combobox
- components/country-selector
- components/movement-row
- components/progress-indicator
- components/spinner
- components/inline-validation
- components/chat-thread
- components/list
- components/chip
- components/tag
- components/badge
- components/avatar
- components/motion-boundary
- patterns/autocomplete
- patterns/avatar-menu
- patterns/checkbox-group
- patterns/radio-group
- patterns/file-upload
- patterns/snackbar-provider
- patterns/avatar-group
- patterns/filter-chip-group

## First Visual Evidence: patterns/sidebar
- Current capture: /private/tmp/flow-zip-baselines/current-pattern-sidebar-http.png
- ZIP baseline capture: /private/tmp/flow-zip-baselines/baseline-sidebar-topbar-http.png
- Result: blocked, not certified. The ZIP demo renders `bundle no cargado` because the expected `window.Flow.Sidebar` export is not present at runtime.
- Required follow-up: locate an executable baseline or use a trusted ZIP handoff screenshot, then document actual differences for active item width, right clipping, top spacing, close/hamburger behavior and content column sizing.

## Files
- Machine matrix: /Users/r1c0/Documents/Un DS/repo-split-output/FlowDocs/docs/audits/zip-visual-parity-audit.json

