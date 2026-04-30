# PixieTrack - Health Tracker PWA

## Mission

**PixieTrack** is a quality-first health tracker PWA. Record vital signs with minimal clicks, view instant insights, and maintain complete control over your personal health data, without any backend or account. Designed for reliability, privacy, and user control.

## Overview

PixieTrack is currently in **Foundation Stage**. The app now includes full local-first tracking workflows for sugar, weight, height, blood pressure, food, and supporting pages:

- In-App Documentation page
- AI Health Chat page
- Add Sugar page
- Add Food page
- Sugar List page
- Food List page
- Sugar Chart page
- Food Chart page
- Settings pages
- Tests page for reusable component and feature validation
- About Us page

This stage is focused on reusable local-first architecture, fast daily entry flows, and disciplined feature growth through shared components.

## Current Features (Stage 1)

- 📘 **In-App Documentation**: Installation, quick actions, accessibility, and usage guidance.
- AI **AI Health Chat**: Client-side wellness brainstorming with your own OpenAI or DeepSeek API key, kept in memory by default with optional per-provider browser save.
- 🩸 **Sugar Entry**: Numeric readings, default-now date-time, grouped tag categories, optional no-tag save, and note support.
- ⚖️ **Weight Tracking**: Add, edit, list, and chart weight readings with grouped tag categories and category-aware filters.
- ❤️ **Blood Pressure Tracking**: Add, edit, list, and chart systolic/diastolic readings with grouped tag categories and category-aware filters.
- 🍽️ **Food Tracking**: Meal name, calories, four tag categories, flexible AND/OR filtering, and multi-chart insights.
- 📋 **Sugar List**: Descending reading history with date, tag, and category filtering plus editing.
- 📋 **Food List**: Meal history with date, tag, and category filtering plus mix-and-match AND/OR logic.
- 📈 **Sugar Chart**: Straight-line chart with points, area fill, tag-aware range coloring, category-aware filters, and top-tag breakdown insights.
- 📈 **Weight Chart**: Straight-line chart with range-aware coloring plus category-aware filters.
- 📈 **BP Chart**: Dual-line chart with category-aware filters and top-tag breakdown insights.
- 📊 **Food Insights**: Calorie trend chart, top tag breakdown chart, and category summary cards.
- ⚙️ **Settings**: Category-aware tag management, chart defaults, color settings, full-app JSON export/import, and local reset.
- 🧪 **Tests Page**: Safe place to trial shared components and new UI features before production use.
- ℹ️ **About Us**: Mission, principles, and scope explanation.
- ⚡ **Fast Static App**: Lightweight React + TypeScript + Vite foundation.
- 📱 **GitHub Pages Ready**: Base path and deployment workflow configured.
- ♿ **Accessibility-First Shell**: Keyboard-aware navigation and readable layout.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | React 19 + Vite | Fast, lightweight, mobile-friendly |
| Routing | React Router 7 | Hash-route compatibility for GitHub Pages |
| State | React Context + hooks | Minimal dependencies and app-specific local-first logic |
| Storage | localStorage | Zero-backend persistence for current feature scope |
| Charts | Recharts | Beautiful, responsive, React-friendly |
| Styling | Token-based CSS | Lightweight custom UI without a design-system dependency |
| PWA | Manifest + service worker | Static-host compatible installability and offline shell |
| Language | TypeScript | Type safety, better DX |
| Hosting | GitHub Pages | Free, zero maintenance |
| Deployment | GitHub Actions | Auto-deploy on push |

## Project Structure

```
pixie-track/
├── README.md
├── LICENSE
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── index.html
├── public/
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   └── sw.js
├── src/
│   ├── context/
│   ├── lib/
│   ├── main.tsx
│   ├── styles.css
│   ├── components/
│   │   ├── SiteShell.tsx
│   │   └── sugar/
│   └── pages/
│       ├── AddSugarReadingPage.tsx
│       ├── EditSugarReadingPage.tsx
│       ├── SugarChartPage.tsx
│       ├── SugarReadingsPage.tsx
│       ├── DocumentationPage.tsx
│       ├── AboutPage.tsx
│       ├── TestsPage.tsx
│       └── settings/
├── documentation/
│   ├── technical/
│   │   ├── TECHNICAL_CONTEXT.md
│   │   └── TECHNICAL_PRINCIPLES.md
│   ├── project/
│   │   ├── PLANNING.md
│   │   └── PROJECT_CHECKLIST.md
│   ├── strategy/
│   │   ├── MONETIZATION_STRATEGY.md
│   │   └── SEO_MARKETING.md
│   ├── governance/
│   │   └── GOVERNANCE_VERIFICATION.md
│   └── features/
└── .github/
    ├── CODE_OF_CONDUCT.md
    ├── CONTRIBUTING.md
    ├── CONTRIBUTORS.md
    └── workflows/
        └── deploy.yml
```

## Quick Start

See [documentation/technical/TECHNICAL_CONTEXT.md](documentation/technical/TECHNICAL_CONTEXT.md) for detailed setup instructions.
See [documentation/technical/TECHNICAL_PRINCIPLES.md](documentation/technical/TECHNICAL_PRINCIPLES.md) for engineering principles and technical decision standards.

The build base path is configurable through `PIXIETRACK_BASE_PATH`. For GitHub Pages, the workflow derives it automatically from the repository name. For root hosting or another subpath, set that variable before running `npm run build`.

```bash
# Clone repo
git clone https://github.com/KaushalWin/pixie-track.git
cd pixie-track

# Install dependencies
npm install

# Development (local only)
npm run dev

# Development on your LAN
npm start

# Build
npm run build

# Deploy (GitHub Actions handles this automatically)
git push origin main
```

## Hosting and Test Plan (Current Stage)

1. Push to `main` so [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publishes to GitHub Pages.
2. Open `https://kaushalwin.github.io/PixieTrack/`.
3. Verify the key routes load:
   - `/#/` Documentation page
    - `/#/ai-chat` AI Health Chat page
    - `/#/sugar/add` Add Sugar page
    - `/#/sugar/list` Sugar List page
    - `/#/sugar/chart` Sugar Chart page
    - `/#/settings` Settings page
    - `/#/tests` Tests page
   - `/#/about` About Us page
4. Check mobile layout and keyboard navigation.
5. Continue feature development only after this baseline passes.

## Tests Page Workflow

The Tests page is the staging area for new reusable UI work.

1. Build the shared component first.
2. Add its demo entry to the top of the `testEntries` array in `src/pages/TestsPage.tsx` so the newest test stays first.
3. Use the Tests page to validate interactions before moving the component into a production screen.
4. Keep the demo in place as a lightweight regression check when the component is reused elsewhere.

Current demos include the shared date-time picker, date-range picker, tag selector, sugar form, and sugar list.

## Hosting Path Configuration

PixieTrack does not require a hardcoded repository path in source anymore. The production asset base is controlled by `PIXIETRACK_BASE_PATH` at build time.

- GitHub Pages project site: the workflow sets `PIXIETRACK_BASE_PATH` to `/<repo-name>/` automatically.
- Root hosting (custom domain or user site): set `PIXIETRACK_BASE_PATH=/`.
- Custom subpath hosting: set `PIXIETRACK_BASE_PATH=/your-subpath/`.

Examples:

```powershell
$env:PIXIETRACK_BASE_PATH = '/pixie-track/'
npm run build
```

```bash
PIXIETRACK_BASE_PATH=/my-app/ npm run build
```

If the hosting path changes, update the build environment value instead of editing application source files.

## Stage Scope

Current implementation scope includes reusable local-first tracking flows, JSON export/import from Settings, in-app guidance, AI Health Chat with memory-only-by-default API keys plus optional local browser save, and the shared Tests page harness.

## Data Privacy

✅ **Local-First Tracking Data**: Readings, tags, settings, and chart preferences stay in your browser.  
✅ **No Backend**: No servers collect or store your data.  
✅ **No Account**: Use without login or registration.  
✅ **No Tracking**: No analytics, no ads, no data collection.  
✅ **No Data Usage by Us**: We do not use your health data for any internal or external purpose.  
✅ **AI Chat Keys Stay Local**: API keys stay in memory by default. If you explicitly save a key, it is stored only in your browser data on this device and never on PixieTrack servers. Chat transcripts are not persisted by PixieTrack.  
✅ **Data Portability**: Export or restore the full app data as JSON from Settings. Saved AI provider keys are excluded from export files and are not changed by import. Legacy tag exports are normalized on import so older data gains the current category model without manual cleanup.  
✅ **Auditable**: Source-available repository; you can review exactly what happens.

## Monetization Strategy

PixieTrack is fully free. Donations are always allowed and optional. The future model is intentionally undecided and may evolve only if it helps sustainability without compromising privacy and user control.

**Support Project Development** (optional):
- **GitHub Sponsors**: github.com/KaushalWin (recurring support)

See [documentation/strategy/MONETIZATION_STRATEGY.md](documentation/strategy/MONETIZATION_STRATEGY.md) for details.

## Roadmap

See [documentation/project/PLANNING.md](documentation/project/PLANNING.md) for full roadmap, phases, and timeline estimates.

Current pre-launch focus:

- launch-critical regression coverage
- PWA installability and offline validation
- trust surfaces such as About, privacy messaging, and FAQ clarity
- launch content that matches the deployed build exactly

Planned follow-up work still under consideration includes CSV export, optional user-controlled sync, and further UX improvements.

## Launch Prep

The launch-readiness artifacts live in:

- [documentation/launch/LAUNCH_AUDIT.md](documentation/launch/LAUNCH_AUDIT.md)
- [documentation/launch/TEST_PLAN.md](documentation/launch/TEST_PLAN.md)
- [documentation/launch/CONTENT_PACK.md](documentation/launch/CONTENT_PACK.md)

## SEO & Traffic Strategy

See [documentation/strategy/SEO_MARKETING.md](documentation/strategy/SEO_MARKETING.md) for detailed traffic plan.

**Quick wins**:
1. Reddit posts (r/privacy, r/androidapps, r/health)
2. Product Hunt launch
3. Google Search Console setup
4. Backlinks from dev communities

Focus: consistent discoverability through privacy-first messaging and clear product documentation.

## Getting Started / Development Roadmap

See [documentation/project/PROJECT_CHECKLIST.md](documentation/project/PROJECT_CHECKLIST.md) for action items and setup steps.

## License

Proprietary License. All rights reserved to the creator. See LICENSE file for full terms.

## Support & Contributions

**Report Issues**: GitHub issues (for bugs/features)  
**Donate**: [GitHub Sponsors](https://github.com/sponsors/KaushalWin)  
**Feedback**: Use GitHub discussions

## FAQ

**Q: Will my data be synced across devices?**  
A: Not in MVP. Future versions may offer optional cloud sync via Dropbox/Google Drive (you control it).

**Q: Is this HIPAA compliant?**  
A: No, not for official medical use. This is a personal health tracker, not a medical device.

**Q: Can I use this on iPhone?**  
A: Yes! iOS supports PWAs. Add to home screen via Safari's "Add to Home Screen."

**Q: What if I lose my phone?**  
A: Use Settings to export a JSON backup of your readings, tags, and settings. On a new device, open the app and import that JSON file to restore the local app data. Saved AI provider keys are intentionally not included.

**Q: Why no backend?**  
A: No backend = zero server costs, instant offline support, and your data never leaves your device. Win-win.

---

**Next Steps**: See [documentation/project/PROJECT_CHECKLIST.md](documentation/project/PROJECT_CHECKLIST.md) to begin dev work or [documentation/technical/TECHNICAL_CONTEXT.md](documentation/technical/TECHNICAL_CONTEXT.md) for architecture details.