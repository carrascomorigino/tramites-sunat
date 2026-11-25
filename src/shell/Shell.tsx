// Mapagino demo shell v1 (2026-11-25): header, footer and theme button.
// Copy of the hub repo shell (carrascomorigino.github.io, folder shell/), as React parts.
import { useState, type ReactNode } from 'react';
import logo from './logotipo.png';

const THEME_KEY = 'mapagino.theme'; // shared with the hub: same origin (demos.mapagino.com)
const ORDER = ['system', 'light', 'dark'] as const;
type Mode = (typeof ORDER)[number];
const LABEL: Record<Mode, string> = {
  system: 'Cambiar tema (actual: sistema)',
  light: 'Cambiar tema (actual: claro)',
  dark: 'Cambiar tema (actual: oscuro)',
};

function currentMode(): Mode {
  const t = document.documentElement.dataset.theme;
  return t === 'light' || t === 'dark' ? t : 'system';
}

function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(currentMode);
  function next() {
    const m = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    try {
      if (m === 'system') localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, m);
    } catch {
      /* storage blocked: the choice lasts for this page view only */
    }
    if (m === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = m;
    setMode(m);
  }
  return (
    <button type="button" className="theme-toggle" data-mode={mode} aria-label={LABEL[mode]} title={LABEL[mode]} onClick={next}>
      <svg className="icon icon-system" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-6v2h3a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h3v-2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v11h16V5H4z" />
      </svg>
      <svg className="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.1 22c-5.6 0-10.1-4.5-10.1-10.1 0-4.6 3-8.5 7.3-9.7.4-.1.8.1 1 .4.2.4.2.8-.1 1.1-.9 1.2-1.4 2.7-1.4 4.2 0 3.9 3.2 7.1 7.1 7.1 1.5 0 3-.5 4.2-1.4.3-.2.8-.3 1.1-.1.4.2.5.6.4 1-1.1 4.4-5 7.5-9.5 7.5z" />
      </svg>
      <svg className="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-13a1 1 0 0 1-1-1V1.5a1 1 0 1 1 2 0V3a1 1 0 0 1-1 1zm0 19.5a1 1 0 0 1-1-1V21a1 1 0 1 1 2 0v1.5a1 1 0 0 1-1 1zM4.2 5.6 3.1 4.5a1 1 0 0 1 1.4-1.4l1.1 1.1a1 1 0 0 1-1.4 1.4zm15.3 15.3-1.1-1.1a1 1 0 0 1 1.4-1.4l1.1 1.1a1 1 0 0 1-1.4 1.4zM3 13H1.5a1 1 0 1 1 0-2H3a1 1 0 1 1 0 2zm19.5 0H21a1 1 0 1 1 0-2h1.5a1 1 0 1 1 0 2zM4.5 20.9a1 1 0 0 1-.7-1.7l1.1-1.1a1 1 0 0 1 1.4 1.4l-1.1 1.1a1 1 0 0 1-.7.3zM18.4 6a1 1 0 0 1-.7-1.7l1.1-1.1a1 1 0 0 1 1.4 1.4l-1.1 1.1a1 1 0 0 1-.7.3z" />
      </svg>
    </button>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#contenido">Ir al contenido</a>
      <div className="site-header-inner">
        <div className="site-brand">
          <a href="https://mapagino.com" aria-label="Mapagino, ir a mapagino.com">
            <img src={logo} alt="Mapagino" className="site-logo" width={2301} height={705} />
          </a>
        </div>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="footer">
      <div className="footer-container">{children}</div>
      <p className="copyright">© 2025–2026 Mapagino. Demo: solo una demostración.</p>
    </footer>
  );
}
