import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AboutPage } from './pages/AboutPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { TestsPage } from './pages/TestsPage';
import './styles.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DocumentationPage />} />
        <Route path="/help" element={<DocumentationPage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
