# HealthyPixel Launch Audit

Status: April 29, 2026

Update: the previous export/import blocker, the food-tag uniqueness inconsistency, and the outdated About page scope were resolved in the April 29, 2026 implementation pass. Treat any older blocker wording below for those items as historical context only.

## Scope Used For This Audit

This audit is grounded in the current implementation and public-facing docs, not roadmap copy alone.

Primary inputs:

- [README.md](../../README.md)
- [documentation/project/PLANNING.md](../project/PLANNING.md)
- [documentation/project/PROJECT_CHECKLIST.md](../project/PROJECT_CHECKLIST.md)
- [documentation/technical/TECHNICAL_CONTEXT.md](../technical/TECHNICAL_CONTEXT.md)
- [documentation/features](../features)
- [index.html](../../index.html)
- [public/manifest.webmanifest](../../public/manifest.webmanifest)
- [public/sw.js](../../public/sw.js)
- [src/context/AppDataContext.tsx](../../src/context/AppDataContext.tsx)
- [src/pages](../../src/pages)
- [src/components](../../src/components)
- [src/lib](../../src/lib)

## Launch Recommendation

Current recommendation: do not treat this build as launch-ready until the P0 blockers below are resolved.

The biggest immediate risks are:

1. Automated coverage is still too narrow for a multi-module local-first app.
2. Privacy positioning is strong, but the app still lacks a dedicated privacy surface.
3. SEO and trust signals are weaker than the product quality now deserves.
4. Real-device PWA and offline validation are still not evidenced.

## Top 15 Highest-Impact Gaps Before Launch

### Bugs

| Priority | Gap | Evidence | Why It Matters | Recommended Fix |
|---|---|---|---|---|
| P1 | Public-facing trust content is still fragmented | Privacy, backup/restore, and launch positioning are spread across [README.md](../../README.md), [src/pages/DocumentationPage.tsx](../../src/pages/DocumentationPage.tsx), and [src/pages/AboutPage.tsx](../../src/pages/AboutPage.tsx) without a dedicated privacy page | Users still need one simple trust surface they can review and share | Add a dedicated privacy page or a focused privacy section reachable from the main help surfaces |

### Missing Tests

| Priority | Gap | Evidence | Why It Matters | Recommended Fix |
|---|---|---|---|---|
| P0 | No broad CRUD coverage for sugar, weight, height, BP, and food page flows | Current automated coverage is concentrated in [src/lib/aiChat.test.ts](../../src/lib/aiChat.test.ts), [src/lib/foodUtils.test.ts](../../src/lib/foodUtils.test.ts), and [src/pages/AiHealthChatPage.test.tsx](../../src/pages/AiHealthChatPage.test.tsx) | A local-first app can silently regress in persistence, filtering, or navigation without server-side safety nets | Add page and context tests for add, edit, list, and chart flows across all vital modules |
| P0 | AppDataContext persistence and corruption behavior is untested | [src/context/AppDataContext.tsx](../../src/context/AppDataContext.tsx) is the storage backbone, but there is no dedicated test surface for storage hydration, reset, malformed JSON, or tag-stat syncing | This is the single highest-risk failure area for user data loss or silent corruption | Add integration tests around localStorage hydration, malformed data fallback, reset, and cross-module tag updates |
| P0 | PWA installability and offline behavior are effectively unverified | [public/manifest.webmanifest](../../public/manifest.webmanifest) and [public/sw.js](../../public/sw.js) exist, but there is no automated or documented real-device validation evidence | PWA/offline is a core part of the product promise | Add a manual launch checklist plus targeted offline and manifest validation before any public launch |

### UX Polish

| Priority | Gap | Evidence | Why It Matters | Recommended Fix |
|---|---|---|---|---|
| P1 | Food sample data is auto-seeded into first-run state without explicit user intent | [src/lib/defaults.ts](../../src/lib/defaults.ts) seeds sample food entries and [src/context/AppDataContext.tsx](../../src/context/AppDataContext.tsx) hydrates them when no stored food data exists | New users may think the app imported someone else’s meals or leaked prior data | Replace auto-seed with an explicit “Load sample food data” action or a dismissible first-run explanation |
| P1 | The entry route is documentation-heavy, not launch-oriented | [src/pages/DocumentationPage.tsx](../../src/pages/DocumentationPage.tsx) is useful but reads more like product docs than a launch landing page | First-time users need faster trust and value framing than a long instruction page provides | Add tighter landing copy or a hero block with value, privacy, and install CTA before deep feature docs |
| P2 | Food filter power is high, but the mental model is still heavy for first-time users | [src/components/food/FoodFilterPanel.tsx](../../src/components/food/FoodFilterPanel.tsx) exposes AND/OR controls for tags, categories, and combined results | Strong capability can still feel hard to use without examples or recommended defaults | Add one-line examples, a “recommended mode” note, or saved presets for common filter patterns |

### Accessibility

| Priority | Gap | Evidence | Why It Matters | Recommended Fix |
|---|---|---|---|---|
| P1 | Keyboard and screen-reader coverage is not evidenced for the main flows | The app has accessibility-oriented structure, but there is no documented test evidence for menu navigation, forms, filters, charts, or settings | Accessibility claims should be backed by verification, especially before public launch | Add manual accessibility checks and prioritized UI tests for menu, form errors, filters, and primary actions |
| P1 | Site shell lacks an explicit skip-to-content affordance | [src/components/SiteShell.tsx](../../src/components/SiteShell.tsx) defines `main-content` but does not expose a visible skip link | This slows keyboard and assistive-tech navigation on a menu-heavy layout | Add a skip-to-content link that becomes visible on focus |

### Privacy

| Priority | Gap | Evidence | Why It Matters | Recommended Fix |
|---|---|---|---|---|
| P1 | AI key local save is clearly warned, but still has no expiry or trusted-device safeguard | [src/components/ai/ApiKeyInput.tsx](../../src/components/ai/ApiKeyInput.tsx) warns users, and [src/pages/AiHealthChatPage.tsx](../../src/pages/AiHealthChatPage.tsx) stores keys in browser-local storage by provider | A shared-device user can still leave credentials behind accidentally | Add a “shared device” warning variant, optional auto-clear guidance, or a session-only reminder near save |
| P1 | Privacy stance is strong, but there is no dedicated in-app privacy page | Public trust currently relies on README and documentation copy rather than a clear product-level privacy surface | Launch audiences expect a simple privacy page they can share and review quickly | Add a dedicated privacy page or a prominent privacy section in the app navigation before launch |

### SEO

| Priority | Gap | Evidence | Why It Matters | Recommended Fix |
|---|---|---|---|---|
| P0 | Canonical and OG URLs likely use the wrong deployment casing | [index.html](../../index.html) uses `https://kaushalwin.github.io/PixieTrack/`, while the repository and path conventions use `pixie-track` | Wrong canonical URLs can weaken discoverability and create sharing inconsistencies | Standardize the deployed public URL and update canonical, OG, and Twitter metadata accordingly |
| P1 | Hash routing means the launch story depends heavily on one indexable page, but supporting trust pages are missing | The app uses hash-based routing and currently lacks separate FAQ/privacy launch surfaces | If only one crawlable page exists, that page and its supporting content have to do more work | Add launch-facing FAQ/privacy content and strengthen the home page metadata and copy |

## P0 Launch Blockers

Resolve these before any public launch push:

1. Add minimum regression coverage for module CRUD plus AppDataContext persistence.
2. Perform and document real-device PWA/offline validation.
3. Confirm public metadata and the deployed GitHub Pages URL stay aligned in production.

## P1 Launch Polish

These are not necessarily blockers, but they materially affect trust and conversion:

1. Update About page scope and public-facing messaging.
2. Rework food sample data onboarding.
3. Add a privacy page.
4. Add an accessibility check pass and skip link.
5. Add clearer onboarding around food filters, JSON backup/restore, and AI key local save.

## Suggested Order Of Work

1. Fix public claim mismatches.
2. Add minimum launch-critical tests.
3. Validate PWA/offline behavior manually.
4. Update trust surfaces: About, privacy, FAQ, metadata.
5. Only then produce final launch content for Product Hunt, Reddit, and SEO.