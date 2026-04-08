# PixieTrack Copilot Instructions

Use this file as the default repository guidance for all Copilot-assisted edits.

## Read First

- [README.md](../README.md): Current stage and user-facing behavior.
- [TECHNICAL_PRINCIPLES.md](../documentation/technical/TECHNICAL_PRINCIPLES.md): Mandatory engineering principles.
- [TECHNICAL_CONTEXT.md](../documentation/technical/TECHNICAL_CONTEXT.md): Stack and setup context.
- [PLANNING.md](../documentation/project/PLANNING.md): Roadmap and scope progression.
- [PROJECT_CHECKLIST.md](../documentation/project/PROJECT_CHECKLIST.md): Release and quality checklist.
- [MONETIZATION_STRATEGY.md](../documentation/strategy/MONETIZATION_STRATEGY.md): Donation and monetization rules.

## Non-Negotiable Rules

- Keep naming consistent: "PixieTrack" for product name, "pixie-track" for repo/path.
- Preserve privacy-first policy: no tracking, no analytics, no health data usage.
- Keep static-host compatibility for GitHub Pages and treat `PIXIETRACK_BASE_PATH` as the single deployment-path source of truth.
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

## SEO — When Adding New Features or Pages

The app uses hash-based routing, so Google only indexes one URL. The sitemap (`public/sitemap.xml`) does **not** need new entries for new pages.

However, **update `index.html` in the same PR as any significant new feature:**

1. **`featureList`** in the `<script type="application/ld+json">` structured data block — add the new feature as a list item (e.g. `"Weight tracking"`, `"Blood pressure logging"`).
2. **`meta name="description"`** — if the new feature is a headline capability, rewrite the description to mention it. Keep it under 160 characters.
3. **`meta name="keywords"`** — add relevant search terms for the new feature.
4. **Open Graph / Twitter `og:description` / `twitter:description`** — keep in sync with the meta description if it changes.

Do **not** add new `<url>` entries to `sitemap.xml` for hash routes — they will return 404 to crawlers.