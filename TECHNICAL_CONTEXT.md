# HealthyPixel - Technical Context & Setup

## Tech Stack Deep Dive

### Frontend Framework: React 18 + Vite

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

### State Management: Zustand

**Why Zustand?**
- Minimal boilerplate (~30 lines for a full store).
- No provider wrapper hell.
- Built-in persistence (easy to sync with IndexedDB).
- Perfect for single-user, simple apps.

Alternative: Context API (if you want zero dependencies).
Avoid: Redux (overkill for PWA).

### Local Storage: IndexedDB + Dexie.js

**Why IndexedDB?**
- Stores 50MB+ per origin (vs localStorage's ~5MB).
- Handles 10+ years of daily readings easily.
- Supports complex queries (e.g., "get all readings from Jan").
- Sync with Zustand for reactive updates.

**Why Dexie.js?**
- Simple, clean API wrapper around IndexedDB.
- Handles migrations automatically.
- Free, MIT-licensed, well-maintained.

### Charts: Recharts

**Why Recharts?**
- React-first, composable components.
- Beautiful by default.
- Responsive on mobile.
- Easy animations and interactions.

Alternative: Chart.js (simpler, but less React-native).

### Styling: Tailwind CSS

**Why Tailwind?**
- Utility-first, rapid mobile UI development.
- Mobile-first by default.
- Minimal CSS overhead.
- Great component libraries (Headless UI, Radix UI).

### PWA Setup: Vite PWA Plugin

**What it automates:**
- Generates service worker (caching strategy).
- Creates manifest.json.
- Handles icons and splash screens.
- Offline support out-of-the-box.

---

## Project Setup Instructions

### Prerequisites
- Node.js 18+ (download from nodejs.org)
- Git (download from git-scm.com)
- GitHub account (github.com)
- VS Code (optional, but recommended)

### Step 1: Create Vite + React Project Locally

```bash
# Create project
npm create vite@latest healthy-pixel -- --template react-ts

# Navigate into project
cd healthy-pixel

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

### Step 3: Configure Vite + PWA

**File: `vite.config.js`**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/healthy-pixel/', // Change to your repo name
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'HealthyPixel',
        short_name: 'HealthyPixel',
        description: 'Track health readings with minimal clicks. Private. Free. Offline.',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/healthy-pixel/',
        start_url: '/healthy-pixel/',
        icons: [
          {
            src: '/healthy-pixel/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/healthy-pixel/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/healthy-pixel/icon-maskable-192.png',
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
            url: '/healthy-pixel/?shortcut=reading',
            icons: [{ src: '/healthy-pixel/icon-reading.png', sizes: '192x192' }],
          },
          {
            name: 'View Charts',
            short_name: 'Charts',
            description: 'View your health graphs',
            url: '/healthy-pixel/?shortcut=charts',
            icons: [{ src: '/healthy-pixel/icon-charts.png', sizes: '192x192' }],
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
})
```

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

export const db = new Dexie('HealthyPixelDB');

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
    <title>HealthyPixel - Free Health Tracker PWA | Track Vitals Offline</title>
    <meta name="description" content="HealthyPixel: Currently free health tracker PWA. Record blood pressure, weight, heart rate with minimal clicks. Works offline on Android/iOS. No backend, no data collection. Install on your home screen.">
    <meta name="keywords" content="health tracker, vital signs, blood pressure tracker, heart rate monitor, weight tracker, health app, offline app, PWA, progressive web app, free health app">
    
    <!-- Open Graph (Social Media) -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://yourusername.github.io/healthy-pixel/">
    <meta property="og:title" content="HealthyPixel - Free Health Tracker">
    <meta property="og:description" content="Track health readings with minimal clicks. Free, offline, installable on Android.">
    <meta property="og:image" content="https://yourusername.github.io/healthy-pixel/og-image.png">
    
    <!-- Canonical -->
    <link rel="canonical" href="https://yourusername.github.io/healthy-pixel/">
    
    <!-- Favicon & PWA -->
    <link rel="icon" type="image/svg+xml" href="/healthy-pixel/favicon.svg">
    <link rel="manifest" href="/healthy-pixel/manifest.json">
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
          cname: healthypixel.example.com # Optional: custom domain
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
git clone https://github.com/yourusername/healthy-pixel.git
cd healthy-pixel

# 3. Install dependencies
npm install

# 4. Test build locally
npm run build

# 5. Push to GitHub
git add .
git commit -m "Initial commit: HealthyPixel PWA setup"
git push -u origin main

# 6. GitHub Actions builds & deploys automatically (~2 minutes)
```

### Verify Deployment
- Site live at: `https://yourusername.github.io/healthy-pixel/`
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
