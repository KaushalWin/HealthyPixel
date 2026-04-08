# PixieTrack Donation Integration Plan

## Executive Summary

**Current Decision:** 
- **Live now:** GitHub Sponsors card and profile link shown app-wide
- **Phase 1 (Immediate):** UPI QR code for India-first users
- **Phase 2 (Future):** Razorpay API integration for international support

**Rationale:** Lowest friction entry point (QR code requires zero setup), with scalable international path.

---

## Alternatives Evaluated

### 1. GitHub Sponsors
| Aspect | Details |
|---|---|
| **Setup Time** | ~5-10 mins |
| **Cost** | Platform takes small cut (Stripe payout) |
| **International** | Yes, but... |
| **India Support** | ❌ Stripe doesn't operate for Indian individuals |
| **Pros** | Professional, appears on GitHub repo page automatically |
| **Cons** | Won't work for creator's location; blocked by Stripe restrictions |
| **Status** | ❌ Rejected for this project |

### 2. Ko-fi
| Aspect | Details |
|---|---|
| **Setup Time** | 5 mins, no coding |
| **Cost** | 5-7% platform fee |
| **International** | ✓ Yes, 100+ countries |
| **India Support** | ✓ Yes, UPI + card |
| **Pros** | Zero code needed, instant, professional appearance, privacy-friendly |
| **Cons** | Higher fees (5-7%), adds external redirect |
| **Status** | ⏸ Viable backup if Razorpay integration stalls |

### 3. Razorpay (API Integration)
| Aspect | Details |
|---|---|
| **Setup Time** | 30 mins + coding |
| **Cost** | 2% UPI (India), 2-3% cards + international markup |
| **International** | ✓ Yes, 100+ countries |
| **India Support** | ✓ Yes, native UPI |
| **Pros** | Lowest fees, most professional, stays in-app, works globally |
| **Cons** | Requires API integration, maintenance |
| **Status** | ✓ Selected for Phase 2 (international) |

### 4. Instamojo
| Aspect | Details |
|---|---|
| **Setup Time** | 30 mins + coding |
| **Cost** | 1% UPI (India), higher internationally |
| **International** | ⚠ Limited/unstable outside India |
| **India Support** | ✓ Yes, cheapest UPI rate |
| **Pros** | Lowest cost in India (1%) |
| **Cons** | Not reliable for international users; complexity similar to Razorpay |
| **Status** | ❌ Rejected — international reach more important than 1% savings |

### 5. Direct UPI QR Code
| Aspect | Details |
|---|---|
| **Setup Time** | 5 mins, no coding |
| **Cost** | 0% (direct to bank account) |
| **International** | ❌ India-only |
| **India Support** | ✓ Yes, instant UPI transfers |
| **Pros** | Zero fees, instant to bank, high trust (direct UPI) |
| **Cons** | India-only, requires manual verification, less professional |
| **Status** | ✓ Selected for Phase 1 (immediate) |

### 6. Open Collective
| Aspect | Details |
|---|---|
| **Setup Time** | 10-15 mins |
| **Cost** | 4% platform + 3-4% processor = ~7-8% |
| **International** | ✓ Yes |
| **India Support** | ✓ Yes |
| **Pros** | Transparent expense tracking, community-friendly |
| **Cons** | Higher fees, overkill for simple donations |
| **Status** | ⏸ Viable for future transparency goals |

### 7. Direct Bank Transfer / NEFT
| Aspect | Details |
|---|---|
| **Setup Time** | 5 mins |
| **Cost** | 0% |
| **International** | ❌ Complex/expensive wire fees |
| **India Support** | ✓ Yes |
| **Pros** | No fees, direct |
| **Cons** | Poor UX, clunky, no automation |
| **Status** | ❌ Rejected — QR code is better UX |

---

## Current Plan of Action

### Baseline: GitHub Sponsors (Live)
**Goal:** Keep an immediate donation channel visible on all app pages.

**Implementation:**
1. Reusable monetization component in [src/components/MonetizationPanel.tsx](../../src/components/MonetizationPanel.tsx)
2. Rendered globally via [src/components/SiteShell.tsx](../../src/components/SiteShell.tsx)
3. Centralized links in [src/lib/monetization.ts](../../src/lib/monetization.ts)

**Status:** ✓ Implemented

### Phase 1: UPI QR Code (Immediate)
**Goal:** Fast, frictionless donation option for India-first user base.

**Implementation:**
1. Generate UPI QR code from creator's UPI ID
2. Add "Support" section to [AboutPage.tsx](../../src/pages/AboutPage.tsx)
3. Display QR code image with brief "Support this project" copy
4. Add footer link in [SiteShell.tsx](../../src/components/SiteShell.tsx) to About page

**Timeline:** ✓ Ready to implement once UPI ID provided

**User Flow:**
- User taps QR code or "Support" link → Opens UPI app → Sends donation → Done

---

### Phase 2: Razorpay Integration (Future)
**Goal:** Enable international donations with professional in-app experience.

**Implementation:**
1. Sign up for Razorpay account
2. Copy API key + merchant ID
3. Create `src/components/DonationModal.tsx` (donate form + Razorpay SDK)
4. Add "Donate" button to About page + footer
5. Handle payment success/failure callbacks

**Timeline:** TBD (when creator has Razorpay account ready)

**User Flow:**
- User taps "Donate" → Modal opens → Select amount → Pay via UPI/Card/International → Success callback

---

### Phase 3 (Optional): Ko-fi Backup
**Goal:** Secondary donation channel if both UPI + Razorpay are insufficient.

**Implementation:**
1. Create Ko-fi account
2. Add Ko-fi link to footer

**Timeline:** Only if needed after Phase 1 + 2 launch

---

## Placement Rules (Per Monetization Policy)

### ✓ Allowed Locations
- About page (section header)
- Footer link on every page (small, subtle)
- Support section in documentation

### ❌ Not Allowed
- Blocking popups on app load
- Forced banners in core workflows (sugar tracking, charts)
- Dark patterns or aggressive CTAs
- Tracking/analytics tied to donations

---

## Next Steps

1. **Immediate:** Provide UPI ID → implement Phase 1 (QR code in About page)
2. **Within 1-2 weeks:** Verify Phase 1 works in production
3. **Later:** Create Razorpay account → implement Phase 2 when ready

---

## Files to Modify / Create

For Phase 1 (UPI QR):
- [src/pages/AboutPage.tsx](../../src/pages/AboutPage.tsx) — add Support section + QR image
- [src/components/SiteShell.tsx](../../src/components/SiteShell.tsx) — add footer "Support" link
- `public/upi-qr-code.png` — generated QR image (to create)

For Phase 2 (Razorpay):
- `src/components/DonationModal.tsx` (new)
- [src/pages/AboutPage.tsx](../../src/pages/AboutPage.tsx) — add Donate button
- `src/lib/razorpay.ts` (new) — API helpers

---

## Summary Table

| Method | Phase | Cost | Setup | Reach | Status |
|---|---|---|---|---|---|
| UPI QR | 1 | 0% | Ready | India | ✓ Immediate |
| Razorpay | 2 | 2% | 30 min coding | Global | ✓ Planned |
| Ko-fi | 3 | 5-7% | 5 min | Global | ⏸ Backup |
| GitHub Sponsors | Never | — | — | — | ❌ Blocked |
| Instamojo | — | 1% | 30 min | Limited | ❌ Inferior |
