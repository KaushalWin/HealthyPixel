# HealthyPixel Copilot Instructions

Use this file as the default repository guidance for all Copilot-assisted edits.

## Read First

- [README.md](../README.md): Current stage and user-facing behavior.
- [TECHNICAL_PRINCIPLES.md](../TECHNICAL_PRINCIPLES.md): Mandatory engineering principles.
- [TECHNICAL_CONTEXT.md](../TECHNICAL_CONTEXT.md): Stack and setup context.
- [PLANNING.md](../PLANNING.md): Roadmap and scope progression.
- [PROJECT_CHECKLIST.md](../PROJECT_CHECKLIST.md): Release and quality checklist.
- [MONETIZATION_STRATEGY.md](../MONETIZATION_STRATEGY.md): Donation and monetization rules.

## Non-Negotiable Rules

- Keep naming consistent: "HealthyPixel" for product name, "healthy-pixel" for repo/path.
- Preserve privacy-first policy: no tracking, no analytics, no health data usage.
- Keep static-host compatibility for GitHub Pages and treat `HEALTHYPIXEL_BASE_PATH` as the single deployment-path source of truth.
- Keep core UX fast and minimal-tap; avoid unnecessary complexity.
- Prioritize reusable components and low-maintenance implementation.

## Current Scope

- Foundation stage currently includes two primary pages and support routes.
- Do not introduce unrelated feature creep without updating planning/checklist/docs in the same change.

## PWA and Quick Actions

- Keep PWA installability intact (manifest + service worker + valid icons).
- Maintain launcher shortcuts, including direct Help/Documentation access.
- If platform limitations exist (for example iOS launcher behavior), provide in-app fallback quick actions.

## Documentation Integrity

- Any architecture, UX, routing, deployment, or PWA behavior change must update docs in the same PR.
- Prefer implementation-accurate docs over aspirational wording.