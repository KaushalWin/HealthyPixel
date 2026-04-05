# HealthyPixel - Technical Principles of Software Development

## Purpose

This document defines engineering principles for HealthyPixel so decisions stay aligned with:

- low cost
- low maintenance
- reusable architecture
- lightweight delivery
- fast and accessible user experience
- local-first privacy

These principles are non-negotiable defaults unless an exception is documented with clear trade-offs.

---

## Core Principles

### 1. Low Cost First

- Prefer static hosting and local-first architecture.
- Avoid recurring infrastructure cost unless there is a strong product need.
- Every paid dependency/service must include a no-cost fallback strategy.

### 2. Low Maintenance by Design

- Keep dependencies minimal and mature.
- Prefer simple, boring, stable solutions over complex stacks.
- Reduce custom build/deploy complexity.
- Every new dependency must justify long-term maintenance impact.

### 3. Reusable Architecture

- Build common UI components first, compose features from shared building blocks.
- Keep single-use code to a minimum and isolate it when unavoidable.
- Share business logic through reusable hooks/services/utils.
- Separate UI, state, storage, and domain logic cleanly.

### 4. Lightweight App Delivery

- Keep bundle and runtime footprint small.
- No heavy local assets by default.
- Prefer text, CSS, and vector assets over large images.
- If images are needed, use external links only when reliability/privacy trade-offs are acceptable and documented.
- Lazy-load non-critical features.

### 5. GitHub Pages Compatibility

- All core functionality must work on static hosting.
- Avoid server-required features in the free core app.
- PWA manifest, start URL, scope, and base path must stay compatible with repository subpath hosting.

### 6. Privacy and Data Locality

- User health data stays on the user device.
- No health-data analytics, profiling, or resale.
- No mandatory account for core app usage.
- Export/import must remain available so users retain control.

---

## Performance Principles

### 7. Fast by Default

- Critical flows must feel instant on mid-range phones.
- Record-reading flow should require minimal interaction and render quickly.
- Optimize first input, route transitions, and chart interaction responsiveness.

### 8. Performance Budgets

- Define and maintain bundle-size and load-time budgets.
- Track regressions and block changes that exceed budget without explicit approval.
- Run performance checks before release.

---

## Accessibility and Usability Principles

### 9. Minimal Click/Tap UX

- Core user actions should take as few taps as possible.
- Avoid unnecessary confirmation steps for non-destructive actions.
- Design shortcuts for repeat tasks.

### 10. PWA Quick Actions and Long-Press Support

- Provide app shortcut actions via PWA manifest.
- Support multiple shortcut entry points for frequent tasks (for example quick reading, open charts, open settings/help).
- Long-press icon behavior should be documented for supported platforms.
- Provide in-app fallback quick actions for platforms with limited launcher support.

### 11. Accessibility Baseline

- Keyboard navigation support for key flows.
- Semantic markup and proper labels for all form controls.
- Screen-reader friendly names, roles, and states.
- Adequate color contrast and touch target sizes.
- Motion and animation must respect reduced-motion preferences.

### 12. UI Ease and Modernization Standards

- UI should feel current, clear, and intentional while staying lightweight.
- Every screen should optimize readability, tap comfort, and action clarity before visual decoration.
- Support dark mode and a token-based theme system so future themes can be added without refactoring component logic.
- Prefer semantic design tokens (surface, text, border, focus, accent) over hardcoded colors.
- Keep interactions smooth and subtle; avoid distracting animation or heavy visual effects.

---

## In-App Documentation Principles

### 13. User Guidance Inside the App

In-app documentation is a required feature, not an afterthought.

At minimum, include:

- How to install the PWA (Android/iOS steps)
- How to use app icon long-press quick actions
- What each quick action does
- Privacy summary (local-only data handling)
- Export/import usage guide
- "What's New" notes for new features and behavior changes
- Troubleshooting basics (offline, install, data recovery)

Guidance should be:

- easy to find from settings/help
- short and action-oriented
- updated in the same release as feature changes

---

## Engineering Process Principles

### 14. Decision Gate for New Features

Before accepting a feature, verify:

- Cost impact is acceptable
- Maintenance burden is acceptable
- Reusability is planned
- Performance impact is acceptable
- Accessibility impact is addressed
- GitHub Pages compatibility is preserved
- Privacy/local-data guarantees are preserved

### 15. Quality Gates Before Release

- Mobile performance check
- Accessibility check for critical flows
- Offline behavior check
- Export/import reliability check
- PWA install and shortcut behavior check
- In-app documentation updated for all user-facing changes

### 16. Documentation Integrity

- Docs must reflect actual implementation, not aspirational plans.
- Any technical change that affects architecture, UX, or deployment must update docs in the same pull request.

### 17. Current and Best-Suited Technology Baseline

- Prefer latest stable/LTS runtimes and toolchains when they are production-ready and compatible with project goals.
- Pin CI and local development guidance to current LTS Node.js by default.
- Upgrade dependencies regularly, but only after compatibility checks for performance, accessibility, and maintenance impact.
- "Latest" is not automatic by itself; choose the best-suited stable option for HealthyPixel when trade-offs exist.

---

## Summary

HealthyPixel development prioritizes:

- low cost
- low maintenance
- reusable architecture
- fast and accessible experiences
- static-hosting compatibility
- local-first privacy
- clear in-app user guidance

These principles are the default standard for all future technical decisions.