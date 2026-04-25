import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { APP_NAME } from './lib/branding';
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
const AiHealthChatPage = React.lazy(() =>
  import('./pages/AiHealthChatPage').then((module) => ({ default: module.AiHealthChatPage }))
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
const AddWeightReadingPage = React.lazy(() =>
  import('./pages/AddWeightReadingPage').then((module) => ({ default: module.AddWeightReadingPage }))
);
const EditWeightReadingPage = React.lazy(() =>
  import('./pages/EditWeightReadingPage').then((module) => ({ default: module.EditWeightReadingPage }))
);
const WeightReadingsPage = React.lazy(() =>
  import('./pages/WeightReadingsPage').then((module) => ({ default: module.WeightReadingsPage }))
);
const WeightChartPage = React.lazy(() =>
  import('./pages/WeightChartPage').then((module) => ({ default: module.WeightChartPage }))
);
const AddHeightReadingPage = React.lazy(() =>
  import('./pages/AddHeightReadingPage').then((module) => ({ default: module.AddHeightReadingPage }))
);
const EditHeightReadingPage = React.lazy(() =>
  import('./pages/EditHeightReadingPage').then((module) => ({ default: module.EditHeightReadingPage }))
);
const HeightReadingsPage = React.lazy(() =>
  import('./pages/HeightReadingsPage').then((module) => ({ default: module.HeightReadingsPage }))
);
const HeightChartPage = React.lazy(() =>
  import('./pages/HeightChartPage').then((module) => ({ default: module.HeightChartPage }))
);
const AddBpReadingPage = React.lazy(() =>
  import('./pages/AddBpReadingPage').then((module) => ({ default: module.AddBpReadingPage }))
);
const EditBpReadingPage = React.lazy(() =>
  import('./pages/EditBpReadingPage').then((module) => ({ default: module.EditBpReadingPage }))
);
const BpReadingsPage = React.lazy(() =>
  import('./pages/BpReadingsPage').then((module) => ({ default: module.BpReadingsPage }))
);
const BpChartPage = React.lazy(() =>
  import('./pages/BpChartPage').then((module) => ({ default: module.BpChartPage }))
);
const AnalysisPage = React.lazy(() =>
  import('./pages/AnalysisPage').then((module) => ({ default: module.AnalysisPage }))
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
                <p>{`Loading ${APP_NAME}...`}</p>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<DocumentationPage />} />
            <Route path="/help" element={<DocumentationPage />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/ai-chat" element={<AiHealthChatPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/sugar/add" element={<AddSugarReadingPage />} />
            <Route path="/sugar/list" element={<SugarReadingsPage />} />
            <Route path="/sugar/edit/:readingId" element={<EditSugarReadingPage />} />
            <Route path="/sugar/chart" element={<SugarChartPage />} />
            <Route path="/weight/add" element={<AddWeightReadingPage />} />
            <Route path="/weight/list" element={<WeightReadingsPage />} />
            <Route path="/weight/edit/:readingId" element={<EditWeightReadingPage />} />
            <Route path="/weight/chart" element={<WeightChartPage />} />
            <Route path="/height/add" element={<AddHeightReadingPage />} />
            <Route path="/height/list" element={<HeightReadingsPage />} />
            <Route path="/height/edit/:readingId" element={<EditHeightReadingPage />} />
            <Route path="/height/chart" element={<HeightChartPage />} />
            <Route path="/bp/add" element={<AddBpReadingPage />} />
            <Route path="/bp/list" element={<BpReadingsPage />} />
            <Route path="/bp/edit/:readingId" element={<EditBpReadingPage />} />
            <Route path="/bp/chart" element={<BpChartPage />} />
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
