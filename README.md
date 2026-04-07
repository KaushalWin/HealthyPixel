# PixieTrack - Health Tracker PWA

## Mission

**PixieTrack** is a quality-first health tracker PWA. Record vital signs with minimal clicks, view instant insights, and maintain complete control over your personal health data, without any backend or account. Designed for reliability, privacy, and user control.

## Overview

PixieTrack is currently in **Foundation Stage**. The app now includes the first complete sugar-tracking workflow and supporting pages:

- In-App Documentation page
- Add Sugar page
- Sugar List page
- Sugar Chart page
- Settings pages
- Tests page for reusable component and feature validation
- About Us page

This stage is focused on reusable local-first architecture, fast daily entry flows, and disciplined feature growth through shared components.

## Current Features (Stage 1)

- 📘 **In-App Documentation**: Installation, quick actions, accessibility, and usage guidance.
- 🩸 **Sugar Entry**: Numeric readings, default-now date-time, multiple tags, and note support.
- 📋 **Sugar List**: Descending reading history with date/tag filtering and editing.
- 📈 **Sugar Chart**: Straight-line chart with points, area fill, tag-aware range coloring, and metrics.
- ⚙️ **Settings**: Tag management, chart defaults, color settings, and local reset.
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
├── PLANNING.md
├── TECHNICAL_CONTEXT.md
├── TECHNICAL_PRINCIPLES.md
├── MONETIZATION_STRATEGY.md
├── SEO_MARKETING.md
├── PROJECT_CHECKLIST.md
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
└── .github/
    └── workflows/
        └── deploy.yml
```

## Quick Start

See [TECHNICAL_CONTEXT.md](TECHNICAL_CONTEXT.md) for detailed setup instructions.
See [TECHNICAL_PRINCIPLES.md](TECHNICAL_PRINCIPLES.md) for engineering principles and technical decision standards.

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
2. Open `https://kaushalwin.github.io/pixie-track/`.
3. Verify the key routes load:
   - `/#/` Documentation page
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

Current implementation scope includes the first sugar-reading workflow with local settings, charting, reusable tests, and in-app guidance. Broader health-metric expansion remains a next-stage concern.

## Data Privacy

✅ **Completely Local Storage**: All data stored in your browser using IndexedDB.  
✅ **No Backend**: No servers collect or store your data.  
✅ **No Account**: Use without login or registration.  
✅ **No Tracking**: No analytics, no ads, no data collection.  
✅ **No Data Usage by Us**: We do not use your health data for any internal or external purpose.  
✅ **Data Export**: Download all your data anytime as JSON/CSV.  
✅ **Auditable**: Source-available repository; you can review exactly what happens.

## Monetization Strategy

PixieTrack is fully free. Donations are always allowed and optional. The future model is intentionally undecided and may evolve only if it helps sustainability without compromising privacy and user control.

**Support Project Development** (optional):
- **GitHub Sponsors**: github.com/yourusername (recurring support)
- **Ko-fi**: ko-fi.com/yourname (one-time contributions)

See [MONETIZATION_STRATEGY.md](MONETIZATION_STRATEGY.md) for details.

## Roadmap

See [PLANNING.md](PLANNING.md) for full roadmap, phases, and timeline estimates.

**Phase 1 (MVP - Weeks 1-3)**
- Basic UI: Input form, readings list, simple chart
- IndexedDB storage
- Export/import functionality
- PWA setup (manifest, service worker)
- Deploy to GitHub Pages

**Phase 2 (Polish - Weeks 4-6)**
- Advanced charts (trends, analytics)
- Mobile optimizations
- Offline notifications
- GitHub Sponsors setup
- Marketing/Product Hunt launch

**Phase 3 (Growth - Months 2-3)**
- Multiple health metrics
- Data sync (optional via Dropbox/Google Drive)
- Community feedback implementation
- Re-evaluate sustainability options only if necessary

## SEO & Traffic Strategy

See [SEO_MARKETING.md](SEO_MARKETING.md) for detailed traffic plan.

**Quick wins**:
1. Reddit posts (r/privacy, r/androidapps, r/health)
2. Product Hunt launch
3. Google Search Console setup
4. Backlinks from dev communities

Focus: consistent discoverability through privacy-first messaging and clear product documentation.

## Getting Started / Development Roadmap

See [PROJECT_CHECKLIST.md](PROJECT_CHECKLIST.md) for action items and setup steps.

## License

Proprietary License. All rights reserved to the creator. See LICENSE file for full terms.

## Support & Contributions

**Report Issues**: GitHub issues (for bugs/features)  
**Donate**: [GitHub Sponsors](https://github.com/yourusername) or [Ko-fi](https://ko-fi.com/yourname)  
**Feedback**: Use GitHub discussions

## FAQ

**Q: Will my data be synced across devices?**  
A: Not in MVP. Future versions may offer optional cloud sync via Dropbox/Google Drive (you control it).

**Q: Is this HIPAA compliant?**  
A: No, not for official medical use. This is a personal health tracker, not a medical device.

**Q: Can I use this on iPhone?**  
A: Yes! iOS supports PWAs. Add to home screen via Safari's "Add to Home Screen."

**Q: What if I lose my phone?**  
A: Export your data regularly (JSON/CSV download). Reinstall on new device, import data.

**Q: Why no backend?**  
A: No backend = zero server costs, instant offline support, and your data never leaves your device. Win-win.

---

**Next Steps**: See [PROJECT_CHECKLIST.md](PROJECT_CHECKLIST.md) to begin dev work or [TECHNICAL_CONTEXT.md](TECHNICAL_CONTEXT.md) for architecture details.