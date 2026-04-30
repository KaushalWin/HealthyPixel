# PixieTrack - Technical Context & Setup

See [TECHNICAL_PRINCIPLES.md](./TECHNICAL_PRINCIPLES.md) for mandatory software engineering principles used by this project.

## Current Implementation Status

Current repository implementation contains local-first workflows for sugar, weight, height, blood pressure, food, and supporting routes:

- In-App Documentation page (`/#/`)
- AI Health Chat page (`/#/ai-chat`)
- Add Sugar page (`/#/sugar/add`)
- Add Food page (`/#/food/add`)
- Sugar List page (`/#/sugar/list`)
- Food List page (`/#/food/list`)
- Sugar Chart page (`/#/sugar/chart`)
- Food Chart page (`/#/food/chart`)
- Settings page (`/#/settings`)
- Tests page (`/#/tests`)
- About Us page (`/#/about`)

All data stays local to the browser. The app currently supports reusable entry, editing, filtering, charting, category-aware tag management, and chart settings without any backend.

AI Health Chat is client-side only and uses memory-only React state by default for provider selection, API keys, and chat history. Users can explicitly save a provider key in browser localStorage on their device, but PixieTrack still does not persist those keys or transcripts on any server. Typed chat content is sent directly from the browser to the selected provider when the user sends a message.

UI behavior for current stage:

- One collapsible main menu in the header (with grouped sub-sections).
- A compact quick-action popup (plus button) for primary action access.
- Mobile-first compact spacing so most primary tasks fit with minimal scrolling.

The Tests page is the shared proving ground for reusable components. New demos should be added to the top of the `testEntries` array in `src/pages/TestsPage.tsx`, then kept there as a lightweight regression harness after the component ships elsewhere.

## Tech Stack Deep Dive

### Frontend Framework: React 19 + Vite

**Why React?**
- Large ecosystem for UI components.
- Great mobile component libraries.
- Strong PWA support.
- Excellent TypeScript integration.
- Active community with many health app examples.

**Why Vite?**
- 10-100x faster dev server than Create React App.
- Lightning-fast HMR (hot module reload).
- Smaller bundle size (critical for mobile).
- GitHub Pages-friendly output.

### Stack Selection Principles (Ownership + Future Monetization)

- Prefer permissive-license dependencies (MIT/ISC/Apache-2.0).
- Avoid copyleft dependencies that can complicate proprietary distribution.
- Keep architecture frontend-first now (GitHub Pages), with optional API boundaries documented for future expansion.
- Avoid vendor lock-in for core features (storage, charts, auth, billing).

### State Management: React Context + Hooks

**Why React Context + hooks?**
- Keeps dependencies minimal.
- Fits the current app size and local-only feature scope.
- Keeps storage, settings, and routing logic centralized without introducing a separate state library.
- Makes immediate settings propagation straightforward across pages.

Avoid: Redux or heavier state tooling for the current feature scope.

### Local Storage: Browser localStorage

**Why localStorage right now?**
- Zero-backend and zero-service complexity.
- Enough for the current sugar-reading scope.
- Easy bootstrap/reset behavior for tags and settings.
- Simple to inspect and migrate while the schema is still evolving.

Future migration to IndexedDB can still happen later if data volume or query complexity outgrows the current approach.

**Current tag-category model:**
- Sugar, Weight, and Blood Pressure tags now store a category alongside the existing tag label and range metadata.
- Food keeps its existing tag-category model.
- Height remains flat-tag only for now.
- Legacy saved tags and older export files are normalized on load/import so built-in tags recover their inferred category and old custom tags land in a visible `general` bucket.

**Export/import compatibility:**
- Browser localStorage keys remain on the existing `v1` names for tracker data.
- App export payloads now emit version 2.
- Import supports older payloads and upgrades missing category metadata during parsing.

### Charts: Recharts

**Why Recharts?**
- React-first, composable components.
- Beautiful by default.
- Responsive on mobile.
- Easy animations and interactions.

Alternative: Chart.js (simpler, but less React-native).

### Styling: Token-Based CSS

**Why custom token-based CSS?**
- Lightweight for a static-hosted app.
- Keeps the visual language app-specific.
- Supports theming without an extra styling dependency.
- Reduces build and dependency complexity.

### PWA Setup: Manifest + Service Worker

**What is currently implemented:**
- `manifest.webmanifest` with install metadata and shortcuts for Dashboard, Add Sugar, Add Weight, Add Height, Add BP, and Add Food.
- Service worker for basic shell caching on production hosts (GitHub Pages).
- Localhost and LAN hosts skip service-worker registration and unregister existing ones to avoid stale-cache issues during testing.
- Hash-route compatibility for GitHub Pages hosting.

---

## Project Setup Instructions

### Prerequisites
- Node.js 24+ (download from nodejs.org)
- Git (download from git-scm.com)
- GitHub account (github.com)
- VS Code (optional, but recommended)

### Step 1: Create Vite + React Project Locally

```bash
# Create project
npm create vite@latest pixie-track -- --template react-ts

# Navigate into project
cd pixie-track

# Install dependencies
npm install
```

### Step 2: Install Additional Dependencies

```bash
# PWA
npm install -D vite-plugin-pwa

# State management
npm install zustand

# Storage (IndexedDB wrapper)
npm install dexie

# Charts
npm install recharts

# UI components (optional, but recommended)
npm install @radix-ui/react-dialog @radix-ui/react-tabs

# Utilities
npm install clsx
```

---

## Implementation Requirements (From Technical Principles)

### Performance and Interaction Speed

- Keep critical flows extremely fast, especially adding a reading and viewing recent history.
- Minimize taps/clicks for high-frequency actions.
- Add performance budgets (bundle size and first-load targets) and validate before release.

### Accessibility Baseline

- Use semantic markup and labeled inputs for all health entry forms.
- Ensure keyboard navigation works for major app flows.
- Keep contrast and touch target sizing mobile-friendly.
- Respect reduced-motion preferences.

### Quick Actions and Long-Press Behavior

- Provide multiple PWA app shortcuts through manifest shortcuts.
- Support long-press icon quick actions on platforms that expose launcher shortcuts.
- Provide in-app quick action fallback where launcher shortcuts are not supported.

### In-App User Documentation

- Add an in-app Help section accessible from Settings.
- Document how to install the PWA (Android/iOS).
- Document how to use icon long-press quick actions.
- Document each major feature and keep a "What's New" section updated every release.
- Include a privacy summary and data export/import instructions.

### Step 3: Configure Vite + PWA

**File: `vite.config.js`**

```javascript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

function normalizeBasePath(value) {
  if (!value) return '/'
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const repositoryName = env.GITHUB_REPOSITORY?.split('/')[1]
  const base = normalizeBasePath(
    env.PIXIETRACK_BASE_PATH ??
      (env.GITHUB_ACTIONS === 'true' && repositoryName ? `/${repositoryName}/` : undefined)
  )

  return {
    base,
    plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PixieTrack',
        short_name: 'PixieTrack',
        description: 'Track health readings with minimal clicks. Private. Free. Offline.',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        scope: './',
        start_url: './',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Quick Reading',
            short_name: 'Reading',
            description: 'Record a new health reading',
            url: './?shortcut=reading',
            icons: [{ src: 'icon-reading.png', sizes: '192x192' }],
          },
          {
            name: 'View Charts',
            short_name: 'Charts',
            description: 'View your health graphs',
            url: './?shortcut=charts',
            icons: [{ src: 'icon-charts.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ['recharts'],
        },
      },
    },
  },
  }
})
```

### Base Path Rule

- `PIXIETRACK_BASE_PATH` is the single source of truth for the deployed asset base.
- On GitHub Pages project sites, set it to `/<repo-name>/`.
- On root hosting, set it to `/`.
- Always include both leading and trailing `/` when setting it manually.
- Keep PWA URLs relative where possible so manifest and service worker stay portable across hosts.

### GitHub Actions Deployment Note

The GitHub Pages workflow should export `PIXIETRACK_BASE_PATH` from the repository name so repo renames do not require source edits.

### Step 4: Setup Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**File: `tailwind.config.js`**

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        secondary: '#059669',
      },
    },
  },
  plugins: [],
}
```

**File: `src/styles/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Step 5: Create IndexedDB Storage Layer

**File: `src/utils/storage.ts`**

```javascript
import Dexie from 'dexie';

export const db = new Dexie('PixieTrackDB');

db.version(1).stores({
  readings: '++id, timestamp, type, date',
});

export const addReading = async (reading) => {
  return db.readings.add({
    ...reading,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
  });
};

export const getReadings = async () => {
  return db.readings.toArray();
};

export const getReadingsByDateRange = async (startDate, endDate) => {
  return db.readings
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray();
};

export const deleteReading = async (id) => {
  return db.readings.delete(id);
};

export const clearAllData = async () => {
  return db.readings.clear();
};
```

### Step 6: Create Zustand Store

**File: `src/hooks/useReadingStore.ts`**

```javascript
import { create } from 'zustand';
import { addReading, getReadings } from '../utils/storage';

export const useReadingStore = create((set) => ({
  readings: [],
  isLoading: false,

  // Fetch all readings
  loadReadings: async () => {
    set({ isLoading: true });
    try {
      const data = await getReadings();
      set({ readings: data });
    } finally {
      set({ isLoading: false });
    }
  },

  // Add a new reading
  addReading: async (reading) => {
    try {
      const id = await addReading(reading);
      set((state) => ({
        readings: [...state.readings, { ...reading, id }],
      }));
      return id;
    } catch (error) {
      console.error('Error adding reading:', error);
    }
  },

  // Get readings by type (BP, HR, Weight, etc.)
  getReadingsByType: (type) => {
    return useReadingStore.getState().readings.filter((r) => r.type === type);
  },
}));
```

### Step 7: Create Component Structure

**`src/components/ReadingInput.jsx`**
- Form to input BP, HR, Weight, notes
- Auto-focus, minimal clicks

**`src/components/ReadingsList.jsx`**
- Displays recent readings
- Sortable, filterable

**`src/components/Charts.jsx`**
- Recharts line/bar charts
- Time-range filters
- Trend analysis

**`src/components/Settings.jsx`**
- Unit preferences (kg/lbs, Celsius/F)
- Dark mode toggle
- Data export/import
- Clear data warning

**`src/components/Navigation.jsx`**
- Bottom nav or sidebar
- App shortcuts

### Step 8: Create index.html with Meta Tags

**File: `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Title & Description -->
    <title>PixieTrack - Free Health Tracker PWA | Track Vitals Offline</title>
    <meta name="description" content="PixieTrack: Currently free health tracker PWA. Record blood pressure, weight, heart rate with minimal clicks. Works offline on Android/iOS. No backend, no data collection. Install on your home screen.">
    <meta name="keywords" content="health tracker, vital signs, blood pressure tracker, heart rate monitor, weight tracker, health app, offline app, PWA, progressive web app, free health app">
    
    <!-- Open Graph (Social Media) -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{DEPLOYED_BASE_URL}}/">
    <meta property="og:title" content="PixieTrack - Free Health Tracker">
    <meta property="og:description" content="Track health readings with minimal clicks. Free, offline, installable on Android.">
    <meta property="og:image" content="{{DEPLOYED_BASE_URL}}/og-image.png">
    
    <!-- Canonical -->
    <link rel="canonical" href="{{DEPLOYED_BASE_URL}}/">
    
    <!-- Favicon & PWA -->
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <link rel="manifest" href="manifest.webmanifest">
    <meta name="theme-color" content="#10b981">
    
    <!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Replace `{{DEPLOYED_BASE_URL}}` with the real public site URL for the current host.

### Step 9: GitHub Actions Workflow

**File: `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: pixietrack.example.com # Optional: custom domain
```

### Step 10: Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "zustand": "^4.0.0",
    "dexie": "^3.0.0",
    "recharts": "^2.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.0.0",
    "vite-plugin-pwa": "^0.17.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  }
}
```

---

## Data Model

### Reading Schema (IndexedDB)

```javascript
{
  id: 1,                           // Auto-increment ID
  type: 'blood_pressure',          // 'bp', 'heart_rate', 'weight', etc.
  value: { systolic: 120, diastolic: 80 }, // Type-specific value
  notes: 'After exercise',         // Optional notes
  timestamp: '2026-03-30T10:30:00Z', // ISO timestamp
  date: '2026-03-30',              // Date string for range queries
  unit: 'mmHg',                    // Unit of measurement
}
```

### Supported Metrics

| Type | Value Format | Unit | Example |
|------|-------------|------|---------|
| `bp` | `{ systolic, diastolic }` | mmHg | `{ systolic: 120, diastolic: 80 }` |
| `hr` | `{ value }` | bpm | `{ value: 72 }` |
| `weight` | `{ value }` | kg or lbs | `{ value: 70.5 }` |
| `notes` | `{ text }` | - | `{ text: "Felt dizzy today" }` |

---

## Offline Strategy

### Service Worker Caching
- **App Shell**: Cache all HTML/CSS/JS on install.
- **Fonts**: Cache Google Fonts for 1 year.
- **API Calls**: N/A (no API, all local).
- **User Data**: Stored in IndexedDB (local, not cached).

### Offline Behavior
- ✅ App loads fully offline.
- ✅ All data remains accessible.
- ✅ Input form works offline (queued until online, but all data is local anyway).
- ✅ No errors or warnings for missing connectivity.

---

## Performance Optimization

### Bundle Size Targets
- **App Bundle**: <300KB (gzipped <100KB)
- **Recharts**: ~200KB (most data-heavy dependency)
- **Initial Load**: <2 seconds on 4G

### Optimizations
1. **Code Splitting**: Lazy-load charts, settings components.
2. **Image Optimization**: Use SVG for icons, PNG for screenshots.
3. **Tree Shaking**: Remove unused Recharts components.
4. **Minification**: Vite auto-minifies on build.

---

## Database Migrations

If you need to update schema (add new fields, new metric types):

```javascript
db.version(2).stores({
  readings: '++id, timestamp, type, date',
  // Add new stores here
});

db.on('populate', (tx) => {
  // Migration logic if needed
});
```

---

## Testing Strategy

### Manual Testing Checklist
- [ ] Input form works on mobile (Android + iOS)
- [ ] Charts render correctly
- [ ] Export JSON/CSV is valid
- [ ] Offline mode works (disable internet, refresh)
- [ ] App installs on home screen (Android + iOS)
- [ ] PWA shortcuts work
- [ ] Data persists after refresh
- [ ] Storage doesn't exceed 50MB (test with 10 years of daily data)

### Browser Compatibility
- Chrome/Edge 88+
- Safari 14+
- Firefox 87+
- Samsung Internet 14+

---

## Deployment to GitHub Pages

### Local Setup

```bash
# 1. Create GitHub repo (public)
# 2. Clone locally
git clone https://github.com/yourusername/pixie-track.git
cd pixie-track

# 3. Install dependencies
npm install

# 4. Test build locally
npm run build

# 5. Push to GitHub
git add .
git commit -m "Initial commit: PixieTrack PWA setup"
git push -u origin main

# 6. GitHub Actions builds & deploys automatically (~2 minutes)
```

### Verify Deployment
- Site live at the configured deployed URL for the current host and base path.
- Check Actions tab to see build status.

---

## Maintenance & Updates

### Regular Tasks
- Monitor GitHub issues for bugs.
- Update dependencies monthly (`npm outdated`).
- Test on new OS versions.
- Review user feedback.

### Deployment Updates
- Push to main → GitHub Actions auto-builds → deployed in 2 minutes.
- No manual steps needed.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **PWA won't install** | Check manifest.json, ensure HTTPS, test on real device |
| **Data not persisting** | Check IndexedDB quota, clear browser cache, verify Dexie setup |
| **Charts not rendering** | Verify Recharts import, check console for errors |
| **Deploy fails** | Check GitHub Actions logs, verify build runs locally |
| **Offline mode broken** | Verify service worker registration, check `cacheStorage` in DevTools |
