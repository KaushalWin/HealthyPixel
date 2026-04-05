import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

function resolveInitialTheme(): Theme {
  const saved = window.localStorage.getItem('healthy-pixel-theme');
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

type SiteShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

function NavLink({
  to,
  activeOn,
  children
}: {
  to: string;
  activeOn?: string[];
  children: ReactNode;
}) {
  const location = useLocation();
  const matchPaths = activeOn ?? [to];
  const isActive = matchPaths.includes(location.pathname);

  return (
    <Link
      to={to}
      className={isActive ? 'nav-link active' : 'nav-link'}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

export function SiteShell({ title, subtitle, children }: SiteShellProps) {
  const [theme, setTheme] = useState<Theme>(resolveInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('healthy-pixel-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="page-bg">
      <header className="top-bar" role="banner">
        <div className="brand-wrap">
          <div className="brand-mark" aria-hidden="true">
            HP
          </div>
          <div>
            <p className="brand-name">HealthyPixel</p>
            <p className="brand-tag">Privacy-first, local-only, lightweight.</p>
          </div>
        </div>
        <nav aria-label="Primary" className="top-nav">
          <NavLink to="/" activeOn={['/', '/help']}>
            Documentation
          </NavLink>
          <NavLink to="/about">About Us</NavLink>
        </nav>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-pressed={theme === 'dark'}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </header>

      <section className="quick-actions" aria-label="Quick Actions">
        <p className="quick-actions-title">Quick Actions</p>
        <div className="quick-actions-links">
          <Link to="/help" className="quick-action-link">
            Open Help / Documentation
          </Link>
          <Link to="/about" className="quick-action-link">
            Open About
          </Link>
        </div>
      </section>

      <main className="content" id="main-content">
        <section className="hero" aria-labelledby="page-title">
          <h1 id="page-title">{title}</h1>
          <p>{subtitle}</p>
        </section>
        {children}
      </main>
    </div>
  );
}
