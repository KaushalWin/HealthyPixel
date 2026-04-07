import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { APP_NAME, BRANDING_KEYS, BRANDING_UI } from '../lib/branding';
import { safeLocalStorageGet, safeLocalStorageSet } from '../lib/platform';

type Theme = 'light' | 'dark';

function resolveInitialTheme(): Theme {
  const saved = safeLocalStorageGet(BRANDING_KEYS.theme);
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

const NAV_SECTIONS = [
  {
    title: 'Help',
    links: [
      { to: '/', label: 'Documentation', activeOn: ['/', '/help'] },
      { to: '/about', label: 'About Us' },
      { to: '/tests', label: 'Tests' }
    ]
  },
  {
    title: 'Sugar',
    links: [
      { to: '/sugar/add', label: 'Add Sugar' },
      { to: '/sugar/list', label: 'Sugar List' },
      { to: '/sugar/chart', label: 'Charts' }
    ]
  },
  {
    title: 'Settings',
    links: [
      { to: '/settings', label: 'Settings' },
      { to: '/settings/tags', label: 'Tag Settings' },
      { to: '/settings/chart', label: 'Chart Settings' }
    ]
  }
] as const;

function NavLink({
  to,
  activeOn,
  children,
  onNavigate
}: {
  to: string;
  activeOn?: string[];
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const matchPaths = activeOn ?? [to];
  const isActive = matchPaths.includes(location.pathname);

  return (
    <Link
      to={to}
      className={isActive ? 'nav-link active' : 'nav-link'}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}

export function SiteShell({ title, subtitle, children }: SiteShellProps) {
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>(resolveInitialTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    safeLocalStorageSet(BRANDING_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    document.title = `${title} | ${APP_NAME}`;
  }, [title]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsQuickActionsOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="page-bg">
      <header className="top-bar" role="banner">
        <div className="brand-wrap">
          <div className="brand-mark" aria-hidden="true">
            {BRANDING_UI.mark}
          </div>
          <div>
            <p className="brand-name">{APP_NAME}</p>
            <p className="brand-tag">Privacy-first and mobile compact.</p>
          </div>
        </div>

        <div className="top-controls">
          <div className="quick-popover-wrap">
            <button
              type="button"
              className="icon-button"
              aria-expanded={isQuickActionsOpen}
              aria-label="Open quick actions"
              onClick={() => setIsQuickActionsOpen((current) => !current)}
              title="Quick actions"
            >
              +
            </button>
            {isQuickActionsOpen ? (
              <div className="quick-popover" role="menu" aria-label="Quick actions">
                <Link
                  to="/sugar/add"
                  className="quick-action-link primary"
                  role="menuitem"
                  onClick={() => setIsQuickActionsOpen(false)}
                >
                  Add Sugar
                </Link>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={theme === 'dark'}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>

          <button
            type="button"
            className="icon-button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-controls="main-menu-panel"
          >
            Menu
          </button>
        </div>
      </header>

      {isMenuOpen ? (
        <nav id="main-menu-panel" className="main-menu" aria-label="Main menu">
          {NAV_SECTIONS.map((section) => (
            <section key={section.title} className="main-menu__section">
              <p className="main-menu__section-title">{section.title}</p>
              <div className="main-menu__links">
                {section.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    activeOn={'activeOn' in link ? [...link.activeOn] : undefined}
                    onNavigate={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>
      ) : null}

      <main className="content" id="main-content">
        <section className="hero compact" aria-labelledby="page-title">
          <h1 id="page-title">{title}</h1>
          <p>{subtitle}</p>
        </section>
        {children}
      </main>
    </div>
  );
}
