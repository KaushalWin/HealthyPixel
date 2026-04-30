# PixieTrack - Planning & Roadmap

## Project Vision

**Goal**: Create a currently free, privacy-first health tracker PWA that respects user autonomy and data privacy.

**Core Values**:
- ⭐ **Quality First**: Reliability, attention to detail, user experience.
- 🔒 **Privacy**: No data collection, no backends, no tracking.
- 🎯 **Minimal Friction**: Record readings in <5 seconds.
- 🌐 **Community-Driven**: Community-friendly, trust-based, open to contributions.
- 📱 **Mobile-First**: Native install on Android/iOS, works offline.

**Current implementation note:** The app already includes food tracking with calorie-aware charts and grouped meal tags, plus AI Health Chat keys that stay in memory by default and can optionally be saved in browser-local storage per provider.

See [TECHNICAL_PRINCIPLES.md](../technical/TECHNICAL_PRINCIPLES.md) for software engineering principles and technical decision gates.

---

## Phase 1: MVP (Minimum Viable Product) - Weeks 1-3

### Goals
- Launch a working PWA on GitHub Pages.
- Users can record, view, and export basic health readings.
- Installable on Android/iOS home screen.
- 100% offline-capable.

### Features
- **Input Form**: Record blood pressure, glucose, weight, height, notes.
- **Readings List**: View all recorded readings with timestamps.
- **Simple Chart**: Line chart showing trends (e.g., blood pressure over time).
- **Export**: Download data as JSON/CSV.
- **PWA Setup**: Manifest, service worker, offline caching.
- **Responsive UI**: Mobile-optimized, Tailwind CSS.
- **In-App Help**: Install guide, quick actions guide, privacy summary, and feature documentation.

### Deliverables
- GitHub repo (public, with LICENSE file).
- Live site at `yourusername.github.io/pixie-track`.
- Working PWA with offline support.
- No mandatory telemetry in-app.

### Timeline
- Week 1: Setup & components (input form, readings list).
- Week 2: Storage (IndexedDB), charts, export.
- Week 3: PWA setup, deploy, testing.

---

## Phase 2: Polish & Launch - Weeks 4-6

### Goals
- Production-ready launch on Product Hunt.
- Community engagement (Reddit, social media).
- Optimize for SEO.
- Set up monetization channels.
- Establish legal governance (CLA, issue templates).

### Features
- **Advanced Charts**: Multiple metrics, time-range filters, trends.
- **Settings**: Customize units (kg/lbs, Celsius/Fahrenheit), dark mode.
- **Import**: Upload previous data for migration.
- **Share Local Graph**: Generate PNG/SVG for sharing (no data leaves device).
- **PWA Shortcuts**: Start with Add Sugar, then expand only if repeated actions justify more launcher entries.
- **Notifications**: Browser reminders to log readings (optional).
- **Quick Interaction UX**: Minimize clicks/taps for critical actions.
- **Accessibility Baseline**: Labels, keyboard navigation, contrast, touch targets, reduced motion support.

### Marketing/Launch
- GitHub Sponsors setup.
- Ko-fi donation link (footer).
- Product Hunt launch preparation.
- Reddit posts (r/privacy, r/androidapps, r/health).
- SEO optimization (meta tags, sitemap, structured data).
- Google Search Console submission.

### Legal & Governance
- Verify LICENSE clarity and completeness.
- Set up GitHub issue templates (bug, feature request).
- Set up GitHub pull request template with CLA requirements.
- Plan CLA bot integration (optional but recommended).
- Create contributor onboarding documentation.
- Establish contribution review process.

### Timeline
- Week 4: Advanced features (charts, settings, import).
- Week 5: Testing, optimization, marketing prep.
- Week 6: Product Hunt launch, social media blitz.

---

## Phase 3: Growth & Community - Months 2-3

### Goals
- Build community (GitHub issues, discussions).
- Gather user feedback.
- Re-evaluate sustainability options only if needed.
- Scale to 1,000-5,000/month users.

### Features
- **Multiple Metrics**: Glucose, oxygen, temperature, symptoms, medications.
- **Data Analysis**: Weekly/monthly summaries, insights (e.g., "Average BP trending down").
- **Optional Cloud Sync** (non-essential): Via Dropbox/Google Drive API (user-controlled).
- **API Export**: Structured JSON endpoint for third-party apps (optional).

### Business (Optional)
- Future options may include donations and/or optional paid features, but no commitment is made now.
- Current commitment: app remains fully free at this stage.
- Donations are always allowed via voluntary support channels.

### Timeline
- Month 2: User feedback, iteration, metric expansion.
- Month 3: Sustainability planning, community building.

---

## Phase 4: Scale & Maintenance - Ongoing

### Goals
- Sustain 5,000-10,000+/month active users.
- Maintain code quality.
- Respond to community needs.

### Potential Directions
- Mobile app (React Native) using same data store.
- Desktop app (Electron) for bulk entry.
- Wearable integration (Apple Health, Google Fit APIs).
- Anonymous research dataset (opt-in, fully anonymized).

---

## Governance & Legal Strategy

### Contribution Ownership
PixieTrack maintains full ownership of all contributions. This ensures the Creator retains control over the project's future direction, licensing, and monetization.

**Key Principles**:
- All code contributions become the exclusive property of the Creator upon merge
- Contributors assign all copyright and intellectual property rights
- Contributions may be modified, relicensed, or commercialized without further notice
- Contributors may be credited (optional) but retain no ownership rights

### Contributor License Agreement (CLA)
The LICENSE file establishes the baseline legal framework. For scalability:

**Phase 1**: LICENSE file + CONTRIBUTING.md (written agreement via repo)
**Phase 2**: CLA bot integration (automated enforcement)
**Phase 3**: Formal CLA templates for corporate/large contributors

### GitHub Governance Setup
- Issue templates (bug, feature) with acknowledgment checkboxes
- Pull request template with explicit CLA requirement
- Branch protection rules (require 1 review before merge)
- Code of Conduct (if needed)

### Legal Protections Implemented
1. **Explicit Ownership Assignment**: License Section 2 clearly states rights are ASSIGNED, not licensed
2. **Moral Rights Waiver**: Includes EU-compliant language for inalienable rights
3. **Corporate Protection**: Requires employer approval for corporate contributions
4. **CLA Framework**: Ready for bot integration or formal CLAs
5. **Merger Clause**: License terms are the complete agreement

---

## Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | React + Vite | Fast dev, mobile-friendly, PWA-ready |
| **Storage** | IndexedDB (Dexie.js) | Scalable, handles years of data, offline-first |
| **Hosting** | GitHub Pages | Free, zero maintenance, HTTPS included |
| **Deployment** | GitHub Actions | Automated, seamless CI/CD |
| **License** | Proprietary (All Rights Reserved) | Legal clarity, ability to monetize |
| **Monetization** | Free + donations | Ko-fi, GitHub Sponsors, future Stripe |
| **Privacy** | 100% local storage | No backend = max privacy |
| **Name** | PixieTrack | Witty, memorable, brand-friendly |
| **Metrics (MVP)** | BP, Glucose, Weight, Height, Notes | Matches core launch scope |

---

## Success Metrics

### Phase 1 Success
- ✅ Live on GitHub Pages
- ✅ Installable on Android/iOS
- ✅ 0 errors on offline load
- ✅ <2 second input time
- ✅ Export functionality works

### Phase 2 Success
- ✅ 500+ GitHub stars
- ✅ 2,000+ Product Hunt upvotes
- ✅ 1,000-5,000/month unique visitors
- ✅ 10+ GitHub issues (community engagement)
- ✅ Donations channel available without affecting core free usage

### Phase 3 Success
- ✅ 5,000-10,000+/month active users
- ✅ 50+ GitHub stars
- ✅ Community-driven feature requests
- ✅ Strong community contributions and engagement

---

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| **Low traffic** | Targeted Reddit/PH launch, SEO optimization, build in public |
| **Storage deletion** | Warn users to export regularly, provide import tool |
| **Browser compatibility** | Test on Chrome, Safari, Firefox, Samsung Internet |
| **Android installability** | PWA standards + manual testing on real devices |
| **User trust** | Source-available codebase, clear privacy policy, easy export |
| **Monetization fails** | Free model is sustainable (no backend costs) |

---

## Future (Post-MVP, Optional)

- **Wearable syncing**: Integration with Apple Watch, Fitbit, Garmin.
- **Social features**: Private sharing circles, family health tracking (fully encrypted).
- **ML insights**: Simple trend prediction (running on-device, no data sent).
- **Accessibility**: Voice input, high contrast modes, screen reader support.
- **Internationalization**: Multiple languages, regional health metrics.

---

## Stakeholders & Roles

| Role | Responsibility |
|------|----------------|
| **Developer (You)** | Code, design, deployment, community management |
| **Users** | Feedback, bug reports, feature requests |
| **Community** | Testing, bug hunting, documentation improvements |

---

## Notes

- **MVP Launch Target**: 3 weeks from project start.
- **Full Launch Target**: 6 weeks (Product Hunt + marketing).
- **Cost Model**: No backend infrastructure required for core app operation.
- **Long-term Goal**: 10,000+ monthly active users within 6 months.

## Data Handling Rule

- PixieTrack does not use user health data for analytics, ads, profiling, or resale.
- User health data remains stored locally on the user's device.

## Technical Decision Rule

- Every new feature should pass technical-principle checks for cost, maintenance, performance, accessibility, reusability, static-host compatibility, and privacy.
