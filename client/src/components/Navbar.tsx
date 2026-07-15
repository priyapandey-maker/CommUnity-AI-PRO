import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks';

// ── Theme helpers ─────────────────────────────────────────

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
}

// ── Icons ─────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const { user, logout } = useAuth();

  // Apply theme on mount and whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const navLinks = [
    { to: '/ledger', label: 'Decision Ledger', show: true },
    { to: '/submit', label: 'Report Incident', show: !!user },
    { to: '/my-reports', label: 'My Reports', show: !!user && user.role === 'CITIZEN' },
    { to: '/portal', label: 'Dashboard', show: !!user && user.role === 'CITIZEN' },
    { to: '/authority', label: 'Authority Dashboard', show: !!user && (user.role === 'AUTHORITY' || user.role === 'ADMIN') },
  ].filter(link => link.show);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 border-b transition-colors duration-200"
      style={{
        backgroundColor: 'var(--nav-bg)',
        borderColor: 'var(--nav-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <nav
        className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <NavLink
          to="/"
          id="nav-brand"
          className="flex items-center gap-2.5 text-sm font-bold tracking-tight hover:opacity-80 transition-opacity duration-150 focus-ring rounded"
          style={{ color: 'var(--text-primary)' }}
        >
          {/* Civic icon — document with checkmark */}
          <span
            className="w-7 h-7 rounded-md bg-primary-600 flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm3 9a1 1 0 00-.707 1.707l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L11 12.586l-1.293-1.293A1 1 0 009 11z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span>CommUnity AI</span>
        </NavLink>

        {/* Links + Theme toggle */}
        <div className="flex items-center gap-2">
          <ul className="flex items-center gap-1" role="list">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={({ isActive }) =>
                    [
                      'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 border focus-ring',
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950 dark:text-primary-300 dark:border-primary-900'
                        : 'border-transparent text-secondary hover:bg-slate-100 dark:hover:bg-slate-800',
                    ].join(' ')
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <span
            className="mx-1.5 h-4 w-px bg-line-strong"
            aria-hidden="true"
          />

          {/* Auth Actions */}
          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Divider */}
          <span
            className="mx-1.5 h-4 w-px bg-line-strong"
            aria-hidden="true"
          />

          {/* Theme toggle */}
          <button
            id="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 focus-ring"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </nav>
    </header>
  );
}
