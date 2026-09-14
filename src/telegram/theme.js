// Applies the active light/dark decision to the document as a `.dark` class —
// the same variant hook the web dashboard's CSS uses.
//
// Two sources, in priority order:
//   1. A manual override stored by the header toggle (src/lib/themePreference).
//      An explicit choice wins for good — nothing overrides it afterwards.
//   2. No stored choice yet: dark, unconditionally. This is a first-run
//      default only, independent of Telegram's own theme — a student who has
//      never touched the header toggle always opens into dark mode.
import { getStoredThemePreference, setStoredThemePreference } from '@/lib/themePreference';

// Components that need to stay in sync with the applied theme (currently just
// the header toggle's icon) subscribe here. This fires on every setDark()
// call — the initial load or a manual tap — so nothing can go stale by only
// listening to the tap handler.
const listeners = new Set();

function setDark(dark) {
  const value = Boolean(dark);
  document.documentElement.classList.toggle('dark', value);
  // Pin the attribute too, so the prefers-color-scheme fallback in index.css
  // stops applying once a theme has been decided. With nothing pinned that
  // fallback stays in charge.
  document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light');
  listeners.forEach((fn) => fn(value));
}

// Subscribe to every applied-theme change. Returns an unsubscribe function.
export function subscribeToAppliedTheme(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// The theme actually applied to the document right now, which is what the
// toggle's icon must reflect.
export function isDarkApplied() {
  const root = document.documentElement;
  const pinned = root.getAttribute('data-theme');
  if (pinned === 'dark') return true;
  if (pinned === 'light') return false;
  if (root.classList.contains('dark')) return true;
  // Nothing pinned: index.css falls back to prefers-color-scheme.
  try {
    return Boolean(window.matchMedia?.('(prefers-color-scheme: dark)')?.matches);
  } catch {
    return false;
  }
}

// Called once from main.jsx before the React tree mounts.
export function applyInitialTheme() {
  const stored = getStoredThemePreference();
  setDark(stored ? stored === 'dark' : true);
}

// Called by the header toggle. Pins the choice for this session and future
// loads.
export function setManualTheme(dark) {
  setDark(dark);
  setStoredThemePreference(dark ? 'dark' : 'light');
}
