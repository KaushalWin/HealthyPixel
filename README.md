# HealthyPixel - Health Tracker PWA

## Mission

**HealthyPixel** is a quality-first health tracker PWA. Record vital signs with minimal clicks, view instant insights, and maintain complete control over your personal health data, without any backend or account. Designed for reliability, privacy, and user control.

## Overview

HealthyPixel is currently in **Foundation Stage**. The first implementation includes exactly two pages:

- In-App Documentation page
- About Us page

This stage is focused on professional setup, deploy pipeline, and baseline UX quality before adding health-tracking features.

## Current Features (Stage 1)

- 📘 **In-App Documentation**: Installation, quick actions, accessibility, and usage guidance.
- ℹ️ **About Us**: Mission, principles, and scope explanation.
- ⚡ **Fast Static App**: Lightweight React + TypeScript + Vite foundation.
- 📱 **GitHub Pages Ready**: Base path and deployment workflow configured.
- ♿ **Accessibility-First Shell**: Keyboard-aware navigation and readable layout.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | React 18 + Vite | Fast, lightweight, mobile-friendly |
| State | Zustand | Minimal boilerplate, easy to learn |
| Storage | IndexedDB (Dexie.js) | Scalable, handles years of health data |
| Charts | Recharts | Beautiful, responsive, React-friendly |
| Styling | Tailwind CSS | Rapid development, mobile-first |
| PWA | Vite PWA Plugin | Automated service workers, offline support |
| Language | TypeScript | Type safety, better DX |
| Hosting | GitHub Pages | Free, zero maintenance |
| Deployment | GitHub Actions | Auto-deploy on push |

## Project Structure

```
healthy-pixel/
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
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── styles.css
│   ├── components/
│   │   └── SiteShell.tsx
│   └── pages/
│       ├── DocumentationPage.tsx
│       └── AboutPage.tsx
└── .github/
    └── workflows/
        └── deploy.yml
```

## Quick Start

See [TECHNICAL_CONTEXT.md](TECHNICAL_CONTEXT.md) for detailed setup instructions.
See [TECHNICAL_PRINCIPLES.md](TECHNICAL_PRINCIPLES.md) for engineering principles and technical decision standards.

```bash
# Clone repo
git clone https://github.com/yourusername/healthy-pixel.git
cd healthy-pixel

# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Deploy (GitHub Actions handles this automatically)
git push origin main
```

## Hosting and Test Plan (Current Stage)

1. Push to `main` so [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publishes to GitHub Pages.
2. Open `https://yourusername.github.io/healthy-pixel/`.
3. Verify two pages load:
   - `/#/` Documentation page
   - `/#/about` About Us page
4. Check mobile layout and keyboard navigation.
5. Continue feature development only after this baseline passes.

## Stage Scope

Current implementation scope is intentionally limited to two pages for initial hosting and testing:

- Documentation page (default route)
- About Us page

Health metric tracking features are planned for next stages after hosting validation.

## Data Privacy

✅ **Completely Local Storage**: All data stored in your browser using IndexedDB.  
✅ **No Backend**: No servers collect or store your data.  
✅ **No Account**: Use without login or registration.  
✅ **No Tracking**: No analytics, no ads, no data collection.  
✅ **No Data Usage by Us**: We do not use your health data for any internal or external purpose.  
✅ **Data Export**: Download all your data anytime as JSON/CSV.  
✅ **Auditable**: Source-available repository; you can review exactly what happens.

## Monetization Strategy

HealthyPixel is fully free. Donations are always allowed and optional. The future model is intentionally undecided and may evolve only if it helps sustainability without compromising privacy and user control.

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