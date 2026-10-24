import { useEffect, useState } from 'react';

const KEY = 'frontend-lab:theme';
const NEXT = { system: 'light', light: 'dark', dark: 'system' };
const LABEL = { system: 'Theme: system', light: 'Theme: light', dark: 'Theme: dark' };

function readTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    return 'system';
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const rootElement = document.documentElement;
    if (theme === 'system') delete rootElement.dataset.theme;
    else rootElement.dataset.theme = theme;
    try {
      if (theme === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, theme);
    } catch {
      // Storage can be unavailable (private windows); the theme still applies for this visit.
    }
  }, [theme]);

  return (
    <button type="button" className="theme-toggle" onClick={() => setTheme(NEXT[theme])} aria-label={`${LABEL[theme]}. Change theme`}>
      <span aria-hidden="true">{theme === 'dark' ? '☾' : theme === 'light' ? '☀' : '◐'}</span>
      <span className="theme-toggle__text">{LABEL[theme].replace('Theme: ', '')}</span>
    </button>
  );
}
