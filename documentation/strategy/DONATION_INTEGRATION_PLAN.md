# PixieTrack Donation Integration Plan

## Executive Summary

**Current Decision:**
- **Live now:** GitHub Sponsors card and profile link shown app-wide
- **Phase 1 (Immediate):** UPI QR code for India-first users
- **Phase 2 (Optional backup):** Ko-fi external link if another low-maintenance support channel is needed

**Rationale:** keep support flows low-maintenance, privacy-friendly, and compatible with a static-hosted app without introducing payment-provider SDK complexity.

---

## Alternatives Evaluated

### 1. GitHub Sponsors
| Aspect | Details |
|---|---|
| **Setup Time** | ~5-10 mins |
| **Cost** | Platform takes a small cut via payout processors |
| **International** | Yes |
| **India Support** | Limited by payout availability |
| **Pros** | Professional, appears on GitHub repo page automatically, already live in-app |
| **Cons** | May not be the best primary channel for all creator locations |
| **Status** | ✓ Active baseline |

### 2. Ko-fi
| Aspect | Details |
|---|---|
| **Setup Time** | ~5 mins |
| **Cost** | 5-7% platform fee |
| **International** | ✓ Yes |
| **India Support** | ✓ Yes |
| **Pros** | Zero code needed, familiar donation flow, privacy-friendly external redirect |
| **Cons** | Higher fees, redirects users away from the app |
| **Status** | ⏸ Backup option |

### 3. Direct UPI QR Code
| Aspect | Details |
|---|---|
| **Setup Time** | ~5 mins |
| **Cost** | 0% (direct to bank account) |
| **International** | ❌ India-only |
| **India Support** | ✓ Yes |
| **Pros** | Zero fees, instant to bank, low maintenance |
| **Cons** | India-only, manual verification, less universal than external donation platforms |
| **Status** | ✓ Planned immediate next support channel |

### 4. Open Collective
| Aspect | Details |
|---|---|
| **Setup Time** | 10-15 mins |
| **Cost** | ~7-8% total |
| **International** | ✓ Yes |
| **India Support** | ✓ Yes |
| **Pros** | Transparent expense tracking |
| **Cons** | Overkill for a lightweight donation flow |
| **Status** | ⏸ Future option only if transparency tooling becomes a project need |

---

## Current Plan of Action

### Baseline: GitHub Sponsors (Live)
**Goal:** Keep one immediate support option visible without blocking core health tracking flows.

**Implementation:**
1. Reusable monetization component in [src/components/MonetizationPanel.tsx](../../src/components/MonetizationPanel.tsx)
2. Rendered globally via [src/components/SiteShell.tsx](../../src/components/SiteShell.tsx)
3. Centralized links in [src/lib/monetization.ts](../../src/lib/monetization.ts)

**Status:** ✓ Implemented

### Phase 1: UPI QR Code (Immediate)
**Goal:** Provide a friction-light support path for India-first users without adding payment SDKs.

**Implementation:**
1. Generate UPI QR code from creator's UPI ID
2. Add a support section to [src/pages/AboutPage.tsx](../../src/pages/AboutPage.tsx)
3. Display the QR image with short support copy
4. Optionally add a subtle support link to About or documentation surfaces

**Timeline:** Ready once the UPI ID is available

### Phase 2: Ko-fi Backup (Optional)
**Goal:** Add a second low-maintenance support link only if the current channels are not enough.

**Implementation:**
1. Create Ko-fi account
2. Add a Ko-fi external link to the support surface

**Timeline:** Only if needed after GitHub Sponsors + UPI QR are in use

---

## Placement Rules (Per Monetization Policy)

### Allowed Locations
- About page support section
- Footer or support panel links
- Documentation support section

### Not Allowed
- Blocking popups on app load
- Forced banners in core workflows
- Aggressive donation prompts
- Tracking or analytics tied to donations

---

## Next Steps

1. Provide a UPI ID and add the QR-based support section.
2. Verify the current GitHub Sponsors panel and any new UPI support surface on mobile and desktop.
3. Add Ko-fi only if a second lightweight support channel is still needed.

---

## Files to Modify / Create

For Phase 1 (UPI QR):
- [src/pages/AboutPage.tsx](../../src/pages/AboutPage.tsx) — add support section + QR image
- `public/upi-qr-code.png` — generated QR image

For Phase 2 (Ko-fi backup):
- [src/lib/monetization.ts](../../src/lib/monetization.ts) — add Ko-fi link if activated
- [src/components/MonetizationPanel.tsx](../../src/components/MonetizationPanel.tsx) — expose backup link if activated

---

## Summary Table

| Method | Phase | Cost | Setup | Reach | Status |
|---|---|---|---|---|---|
| GitHub Sponsors | Baseline | Processor fees | Live | Global | ✓ Active |
| UPI QR | 1 | 0% | Ready | India | ✓ Planned |
| Ko-fi | 2 | 5-7% | 5 min | Global | ⏸ Backup |
| Open Collective | Future | ~7-8% | 10-15 min | Global | ⏸ Optional |
