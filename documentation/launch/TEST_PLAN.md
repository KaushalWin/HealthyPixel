# HealthyPixel Complete Test Plan

Status: April 29, 2026

## Purpose

This document defines the full launch test matrix for HealthyPixel across:

- sugar
- food
- blood pressure
- weight
- height
- settings
- AI health chat
- installability
- offline/PWA behavior

It covers unit, integration, UI, and manual testing with edge cases, invalid inputs, local storage corruption, offline behavior, and regression priorities.

## Scope Assumptions

Current implementation scope is based on the shipped code, not roadmap promises.

Important note:

- Export/import is now shipped as full-app JSON backup and replace-on-import restore from Settings. CSV export, merge import, and per-module portability are still out of scope for this slice.

Primary references:

- [README.md](../../README.md)
- [documentation/launch/LAUNCH_AUDIT.md](./LAUNCH_AUDIT.md)
- [src/context/AppDataContext.tsx](../../src/context/AppDataContext.tsx)
- [src/lib](../../src/lib)
- [src/pages](../../src/pages)
- [public/manifest.webmanifest](../../public/manifest.webmanifest)
- [public/sw.js](../../public/sw.js)

## Test Levels

### Unit Tests

Purpose: verify pure logic, validation, storage helpers, defaults, filtering, and metrics.

### Integration Tests

Purpose: verify AppDataContext, page-to-context behavior, local storage sync, navigation state, and cross-component flows.

### UI Tests

Purpose: verify rendered forms, filters, chart states, empty states, error messages, and interaction sequences.

### Manual Tests

Purpose: verify browser/device behavior, PWA installability, offline shell behavior, visual polish, accessibility, and trust surfaces.

## Environments

Minimum launch validation targets:

| Area | Minimum Target |
|---|---|
| Desktop browsers | Latest Chrome, Firefox, Edge |
| iOS | Safari on a recent iPhone |
| Android | Chrome on a recent Android device |
| Local validation | `npm run test`, `npm run build`, localhost dev run |
| Production validation | deployed GitHub Pages build with real manifest and service worker |

## Regression Priority Bands

| Priority | Meaning |
|---|---|
| P0 | Launch blocker or risk of data loss/trust break |
| P1 | High-value regression likely to affect real users |
| P2 | Important polish and resilience checks |
| P3 | Nice-to-have or future hardening |

## Automated Test Matrix

## 1. Unit Tests

### 1.1 Storage and Platform

| ID | Priority | Area | Test Case |
|---|---|---|---|
| U-PLAT-01 | P0 | platform | `safeLocalStorageGet` returns null on unavailable storage |
| U-PLAT-02 | P0 | platform | `safeLocalStorageSet` returns false on storage write failure |
| U-PLAT-03 | P1 | platform | `safeLocalStorageRemove` removes saved AI provider keys safely |
| U-PLAT-04 | P1 | platform | `isLocalOrPrivateHost` correctly identifies localhost and LAN hosts |

### 1.2 Defaults and Seeds

| ID | Priority | Area | Test Case |
|---|---|---|---|
| U-DEF-01 | P0 | defaults | sugar, weight, height, BP, and food storage keys are stable and unique |
| U-DEF-02 | P1 | defaults | food default tags include all four categories |
| U-DEF-03 | P1 | defaults | sample food readings generate valid ISO datetimes and valid tag IDs |
| U-DEF-04 | P1 | defaults | chart color defaults and dashboard module defaults hydrate correctly |

### 1.3 Shared Reading Utilities

| ID | Priority | Area | Test Case |
|---|---|---|---|
| U-READ-01 | P0 | readingUtils | `parseStoredJson` falls back cleanly on malformed JSON |
| U-READ-02 | P0 | readingUtils | `applyReadingFilters` correctly filters by date boundaries |
| U-READ-03 | P1 | readingUtils | `sortReadingsAscending` and `sortReadingsDescending` remain stable |
| U-READ-04 | P1 | readingUtils | `buildPresetDateRange` returns correct start and end dates for all presets |
| U-READ-05 | P1 | readingUtils | `syncTagStats` updates usage counts and last-used values correctly |

### 1.4 Sugar, Weight, Height, and BP Logic

| ID | Priority | Area | Test Case |
|---|---|---|---|
| U-SUGAR-01 | P0 | sugar ranges | sugar classification returns inside, outside, and neutral correctly |
| U-WEIGHT-01 | P1 | weight ranges | weight chart metrics compute min, max, and inside/outside counts correctly |
| U-HEIGHT-01 | P1 | height ranges | height draft and range logic stay valid at edge values |
| U-BP-01 | P0 | BP ranges | BP classification handles systolic in range + diastolic out of range correctly |
| U-BP-02 | P0 | BP validation | BP range resolution handles missing mins/maxes safely |

### 1.5 Food Logic

| ID | Priority | Area | Test Case |
|---|---|---|---|
| U-FOOD-01 | P0 | food filters | tag-only filters honor OR and AND correctly |
| U-FOOD-02 | P0 | food filters | category-only filters honor OR and AND correctly |
| U-FOOD-03 | P0 | food filters | combined tag + category matching honors `combinedMode` |
| U-FOOD-04 | P1 | food metrics | average, min, max, inside/outside counts compute correctly |
| U-FOOD-05 | P1 | food breakdown | top-tag and category breakdown data aggregate correctly |
| U-FOOD-06 | P1 | food classification | calorie classification stays neutral when no food tag ranges exist |

### 1.6 AI Chat Logic

| ID | Priority | Area | Test Case |
|---|---|---|---|
| U-AI-01 | P0 | aiChat | provider model list and API label resolution |
| U-AI-02 | P0 | aiChat | request builder includes fixed system prompt and provider URL |
| U-AI-03 | P1 | aiChat | response parser handles string and structured content |
| U-AI-04 | P1 | aiChat | error message helper maps provider errors and generic fallback correctly |

## 2. Integration Tests

### 2.1 AppDataContext Storage Lifecycle

| ID | Priority | Area | Test Case |
|---|---|---|---|
| I-CTX-01 | P0 | AppDataContext | loads clean defaults when local storage is empty |
| I-CTX-02 | P0 | AppDataContext | falls back safely when one or more storage keys contain malformed JSON |
| I-CTX-03 | P0 | AppDataContext | add, update, and remove reading flows persist back to local storage |
| I-CTX-04 | P0 | AppDataContext | resetAllData restores expected default tags/settings and food sample behavior |
| I-CTX-05 | P1 | AppDataContext | removing a tag removes that tag from all linked readings |
| I-CTX-06 | P1 | AppDataContext | tag usage stats update across add/edit/remove operations |

### 2.2 Settings and Cross-Module State

| ID | Priority | Area | Test Case |
|---|---|---|---|
| I-SET-01 | P1 | settings | dashboard module toggles persist and affect rendered dashboard modules |
| I-SET-02 | P1 | settings | chart color changes persist across reloads |
| I-SET-03 | P1 | tag settings | custom food tags save with category and usable ranges |
| I-SET-04 | P1 | tag settings | duplicate-tag rules behave consistently for create and edit |
| I-SET-05 | P0 | data portability | JSON export excludes saved AI keys and import replaces local readings, tags, and settings |

### 2.3 AI Key Persistence

| ID | Priority | Area | Test Case |
|---|---|---|---|
| I-AI-01 | P0 | AI chat | keys remain memory-only until Save is clicked |
| I-AI-02 | P0 | AI chat | saving stores a key only for the selected provider |
| I-AI-03 | P1 | AI chat | switching providers loads the correct saved provider key |
| I-AI-04 | P1 | AI chat | clearing a saved key removes it from local storage and UI state |

## 3. UI Tests

## 3.1 Sugar

| ID | Priority | Page | Test Case |
|---|---|---|---|
| UI-SUGAR-01 | P0 | add sugar | required value validation and successful save navigation |
| UI-SUGAR-02 | P1 | sugar list | date filter, tag filter, clear filter behavior |
| UI-SUGAR-03 | P1 | sugar chart | preset switching, empty state, filtered metrics |

## 3.2 Food

| ID | Priority | Page | Test Case |
|---|---|---|---|
| UI-FOOD-01 | P0 | add food | meal name and calories validation |
| UI-FOOD-02 | P0 | add food | grouped tag selection across all four categories |
| UI-FOOD-03 | P1 | food list | URL-backed filters survive reload via search params |
| UI-FOOD-04 | P1 | food list | clear filters resets dates, tags, categories, and match modes |
| UI-FOOD-05 | P1 | food chart | calorie trend and tag breakdown render with filtered data |
| UI-FOOD-06 | P1 | food chart | preset change keeps category/tag filters intact |

## 3.3 Weight, Height, and BP

| ID | Priority | Page | Test Case |
|---|---|---|---|
| UI-WEIGHT-01 | P1 | add/edit weight | validation and save flow |
| UI-HEIGHT-01 | P1 | add/edit height | validation and save flow |
| UI-BP-01 | P0 | add/edit BP | systolic/diastolic validation, including diastolic lower than systolic |
| UI-BP-02 | P1 | BP chart | both lines render and filtered metrics update |

## 3.4 Shared Pages

| ID | Priority | Page | Test Case |
|---|---|---|---|
| UI-ANALYSIS-01 | P1 | analysis | enabled dashboard modules render and disabled modules stay hidden |
| UI-DOC-01 | P2 | documentation | critical install/privacy/feature sections are present |
| UI-ABOUT-01 | P2 | about | current scope copy matches shipped modules |
| UI-SET-01 | P1 | settings | reset action prompts and clears data |
| UI-SET-02 | P0 | settings | export downloads JSON and import restores a valid exported file |
| UI-SHELL-01 | P1 | site shell | menu links, quick actions, and active route highlighting |

## 4. Manual Launch Test Matrix

## 4.1 Core Functional Pass

| ID | Priority | Scenario |
|---|---|---|
| M-CORE-01 | P0 | Fresh install: open app with empty browser data and verify the app loads without console errors |
| M-CORE-02 | P0 | Add one sugar, one food, one BP, one weight, and one height reading in a single session |
| M-CORE-03 | P0 | Reload the page and verify all saved readings persist |
| M-CORE-04 | P0 | Edit each saved reading and verify updates persist after reload |
| M-CORE-05 | P1 | Remove a custom tag and verify it disappears from linked readings |

## 4.2 Invalid Inputs and Edge Cases

| ID | Priority | Scenario |
|---|---|---|
| M-EDGE-01 | P0 | Enter blank required fields on all add forms |
| M-EDGE-02 | P0 | Enter out-of-range values: negative calories, extreme sugar, invalid BP combinations |
| M-EDGE-03 | P1 | Set start date after end date on all list/chart filters |
| M-EDGE-04 | P1 | Create multiple food filters with AND/OR mixes and verify results manually |
| M-EDGE-05 | P1 | Verify saved AI key warning is visible before saving |

## 4.3 Local Storage Corruption and Recovery

| ID | Priority | Scenario |
|---|---|---|
| M-STOR-01 | P0 | Manually corrupt one storage key in DevTools and reload |
| M-STOR-02 | P0 | Corrupt food tags only and verify the app still renders without crashing |
| M-STOR-03 | P1 | Corrupt settings and verify defaults rehydrate |
| M-STOR-04 | P1 | Use Delete all local data and verify keys clear/reseed as expected |

## 4.4 PWA and Offline

| ID | Priority | Scenario |
|---|---|---|
| M-PWA-01 | P0 | Deploy the production build and verify the manifest is valid |
| M-PWA-02 | P0 | Install on Android and verify Dashboard, Add Sugar, and Add Food shortcuts |
| M-PWA-03 | P0 | Load the app once, go offline, and verify the shell still opens |
| M-PWA-04 | P1 | Navigate between key routes offline and record which routes work after the shell is cached |
| M-PWA-05 | P1 | Verify service worker updates do not trap users on stale content |

## 4.5 Accessibility

| ID | Priority | Scenario |
|---|---|---|
| M-A11Y-01 | P1 | Navigate the header menu, quick actions, and primary forms using keyboard only |
| M-A11Y-02 | P1 | Verify focus order and visible focus states on interactive controls |
| M-A11Y-03 | P1 | Verify form errors are announced and visually clear |
| M-A11Y-04 | P2 | Check chart sections and summaries with a screen reader or accessibility tree inspection |
| M-A11Y-05 | P2 | Verify color-coded statuses still have readable text alternatives |

## 5. Feature-Specific Manual Scenarios

### Sugar

- Add fasting and post-meal readings with tags and verify chart colors.
- Filter sugar list by date and multiple tags.
- Edit a sugar reading and verify highlight query param behavior.

### Food

- Log meals with planned, actual, context, and behavior tags in a single entry.
- Compare results when `combinedMode` is `and` vs `or`.
- Verify the chart breakdown reflects filtered categories correctly.
- Confirm first-run sample data behavior is understood and not mistaken for leaked user data.

### BP

- Save valid and invalid systolic/diastolic pairs.
- Use BP tags with different systolic and diastolic ranges and confirm chart/list status behavior.

### Weight and Height

- Confirm quick entry works without opening More options.
- Confirm date-time overrides persist after edit.

### Settings

- Toggle dashboard modules on and off.
- Create and edit tags across all modules.
- Export JSON and import the same JSON on a fresh local state.
- Change chart colors and verify charts update.

### AI Health Chat

- Test memory-only mode without saving.
- Save an OpenAI key locally, switch to DeepSeek, and verify keys stay provider-specific.
- Clear a saved key and verify it disappears after reload.
- Trigger provider errors and invalid API keys.

## 6. Release Gate Checklist

Launch should be blocked until all of the following are green:

1. `npm run test` passes.
2. `npm run build` passes.
3. P0 automated tests exist for storage, CRUD, food filters, and BP validation.
4. Production deployment is manually tested for manifest, shortcuts, and offline shell behavior.
5. Public claims about export/import, privacy, and offline behavior match the validated product.

## 7. Suggested Implementation Order For Missing Tests

1. AppDataContext integration tests.
2. Sugar and BP launch-critical CRUD tests.
3. Food list/chart UI tests.
4. Weight and height CRUD tests.
5. Settings and dashboard tests.
6. Manual PWA/offline checklist execution.

## 8. Future Test Expansion

Once CSV export, merge import, or module-level portability exists, add:

- CSV export tests per module
- import conflict handling tests
- malformed import payload tests
- privacy verification that exports contain only local user data