# HealthyPixels - Health Tracker PWA

## Mission

**HealthyPixels** is a quality-first health tracker PWA. Record vital signs with minimal clicks, view instant insights, and maintain complete control over your personal health data—all without any backend or account. Designed for reliability, privacy, and user control.

## Overview

A progressive web app (PWA) for tracking health readings. Designed to be installable on Android/iOS phones for quick access. Built with React + Vite for speed and performance.

## Key Features

- 🚀 **Minimal Clicks**: Record readings in <5 seconds.
- 📱 **Installable PWA**: Add to home screen on Android/iOS (no app store needed).
- 🔌 **Works Offline**: Full functionality without internet connection.
- 📊 **Instant Graphs**: Beautiful charts show trends immediately.
- 🔒 **100% Private**: All data stored locally. No backend, no database, no tracking.
- 💾 **Exportable Data**: Download your data as JSON/CSV for backup.
- 🎨 **Mobile-First UI**: Optimized for quick data entry on phones.
- ✨ **Quality-Focused**: Built with attention to detail, reliability, and user experience.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | React 18 + Vite | Fast, lightweight, mobile-friendly |
| State | Zustand | Minimal boilerplate, easy to learn |
| Storage | IndexedDB (Dexie.js) | Scalable, handles years of health data |
| Charts | Recharts | Beautiful, responsive, React-native |
| Styling | Tailwind CSS | Rapid development, mobile-first |
| PWA | Vite PWA Plugin | Automated service workers, offline support |
| Language | TypeScript | Type safety, better DX |
| Hosting | GitHub Pages | Free, zero maintenance |
| Deployment | GitHub Actions | Auto-deploy on push |

## Project Structure

```
health-tracker/
├── README.md
├── LICENSE
├── PLANNING.md
├── TECHNICAL_CONTEXT.md
├── MONETIZATION_STRATEGY.md
├── SEO_MARKETING.md
├── PROJECT_CHECKLIST.md
├── package.json
├── vite.config.js
├── tsconfig.json
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── ReadingInput.jsx
│   │   ├── Charts.jsx
│   │   ├── Settings.jsx
│   │   └── Navigation.jsx
│   ├── hooks/
│   │   └── useReadingStore.js
│   ├── utils/
│   │   ├── storage.js
│   │   └── dataExport.js
│   └── styles/
│       └── globals.css
├── public/
│   ├── manifest.json
│   ├── favicon.svg
│   └── icons/
├── .github/
│   └── workflows/
│       └── deploy.yml
└── .gitignore
```

## Quick Start

See [TECHNICAL_CONTEXT.md](TECHNICAL_CONTEXT.md) for detailed setup instructions.

```bash
# Clone repo
git clone https://github.com/yourusername/health-tracker.git
cd health-tracker

# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Deploy (GitHub Actions handles this automatically)
git push origin main
```

## Supported Health Metrics

Launch MVP tracks:
- Blood Pressure (systolic/diastolic)
- Blood Sugar/Glucose (mg/dL or mmol/L)
- Weight
- Height
- Custom Notes

Future additions: Oxygen, Temperature, Symptoms, Medications, Heart Rate.

## Data Privacy

✅ **Completely Local Storage**: All data stored in your browser using IndexedDB.  
✅ **No Backend**: No servers collect or store your data.  
✅ **No Account**: Use without login or registration.  
✅ **No Tracking**: No analytics, no ads, no data collection.  
✅ **Data Export**: Download all your data anytime as JSON/CSV.  
✅ **Auditable**: Open-source code—you can review exactly what happens.

## Monetization Strategy

HealthyPixels is built with quality and user value as the priority. While pricing models may evolve as the project grows, the focus remains on delivering an exceptional health tracking experience.

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
- Premium tier (optional)

## SEO & Traffic Strategy

See [SEO_MARKETING.md](SEO_MARKETING.md) for detailed traffic plan.

**Quick wins**:
1. Reddit posts (r/privacy, r/androidapps, r/health)
2. Product Hunt launch
3. Google Search Console setup
4. Backlinks from dev communities

Expected: 500-2,000/month organic traffic within 3 months.

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