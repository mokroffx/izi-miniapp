// Round icon button in the header that switches the app between light and dark
// and persists the choice (see src/telegram/theme.js + src/lib/themePreference).
//
// Icon polarity: the icon always shows the mode the tap would switch TO — a
// moon while the page is light, a sun while the page is dark.
//
// Inline SVG on purpose: this codebase has no icon library and one toggle does
// not justify adding a dependency.
import { useEffect, useState } from 'react';
import { isDarkApplied, setManualTheme, subscribeToAppliedTheme } from '@/telegram/theme';

export default function ThemeToggle() {
  // Seeded from the theme already applied to <html> by main.jsx, which runs
  // before React mounts, then kept in sync via subscription for the rest of
  // this component's life — including a live Telegram theme_changed event
  // that flips the document while no manual override has been set yet. A tap
  // only calls setManualTheme(); it does NOT set local state directly, so
  // there is exactly one source of truth for "what's currently applied".
  const [dark, setDark] = useState(() => isDarkApplied());

  useEffect(() => subscribeToAppliedTheme(setDark), []);

  const next = !dark;

  return (
    <button
      type="button"
      onClick={() => setManualTheme(next)}
      aria-label={next ? 'Включить тёмную тему' : 'Включить светлую тему'}
      className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-2.5 text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
