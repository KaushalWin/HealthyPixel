import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { isLocalOrPrivateHost } from './lib/platform';
import './styles.css';

const DocumentationPage = React.lazy(() =>
  import('./pages/DocumentationPage').then((module) => ({ default: module.DocumentationPage }))
);
const AboutPage = React.lazy(() =>
  import('./pages/AboutPage').then((module) => ({ default: module.AboutPage }))
);
const TestsPage = React.lazy(() =>
  import('./pages/TestsPage').then((module) => ({ default: module.TestsPage }))
);
const AddSugarReadingPage = React.lazy(() =>
  import('./pages/AddSugarReadingPage').then((module) => ({ default: module.AddSugarReadingPage }))
);
const SugarReadingsPage = React.lazy(() =>
  import('./pages/SugarReadingsPage').then((module) => ({ default: module.SugarReadingsPage }))
);
const EditSugarReadingPage = React.lazy(() =>
  import('./pages/EditSugarReadingPage').then((module) => ({ default: module.EditSugarReadingPage }))
);
const SugarChartPage = React.lazy(() =>
  import('./pages/SugarChartPage').then((module) => ({ default: module.SugarChartPage }))
);
const SettingsPage = React.lazy(() =>
  import('./pages/settings/SettingsPage').then((module) => ({ default: module.SettingsPage }))
);
const TagManagementPage = React.lazy(() =>
  import('./pages/settings/TagManagementPage').then((module) => ({ default: module.TagManagementPage }))
);
const ChartSettingsPage = React.lazy(() =>
  import('./pages/settings/ChartSettingsPage').then((module) => ({ default: module.ChartSettingsPage }))
);

const currentHost = window.location.hostname;
const isLocalHost = isLocalOrPrivateHost(currentHost);

if (import.meta.env.PROD && !isLocalHost && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}

if (isLocalHost && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      void registration.unregister();
    }
  });
}

function App() {
  return (
    <AppDataProvider>
      <HashRouter>
        <Suspense
          fallback={
            <div className="route-loading-shell">
              <div className="route-loading-card">
                <p>Loading HealthyPixel…</p>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<DocumentationPage />} />
            <Route path="/help" element={<DocumentationPage />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/sugar/add" element={<AddSugarReadingPage />} />
            <Route path="/sugar/list" element={<SugarReadingsPage />} />
            <Route path="/sugar/edit/:readingId" element={<EditSugarReadingPage />} />
            <Route path="/sugar/chart" element={<SugarChartPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/tags" element={<TagManagementPage />} />
            <Route path="/settings/chart" element={<ChartSettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </AppDataProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
