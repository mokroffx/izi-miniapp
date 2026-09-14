// Applies the active light/dark decision to the document as a `.dark` class —
// the same variant hook the web dashboard's CSS uses.
//
// Two sources, in priority order:
//   1. A manual override stored by the header toggle (src/lib/themePreference).
//      An explicit choice wins and is never overridden by Telegram afterwards.
//   2. Telegram's themeParams, followed live for the rest of the session.
//
// themeParams is preferred over prefers-color-scheme because the Telegram
// client can run a dark app theme on a light OS (and the reverse), and this app
// normally only ever renders inside that client.
import { isDarkSignal, isInsideTelegram, readIsDark } from '@/telegram/sdk';
import { getStoredThemePreference, setStoredThemePreference } from '@/lib/themePreference';

// Non-null only while we are following Telegram's live theme signal.
let unsubscribeTelegramTheme = null;

// Components that need to stay in sync with the applied theme (currently just
// the header toggle's icon) subscribe here. This fires on EVERY setDark() call
// — a manual tap, the initial load, or a live Telegram theme_changed event —
// so nothing can go stale by only listening to the tap handler.
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

// Subscribe to every applied-theme change (not just manual ones). Returns an
// unsubscribe function.
export function subscribeToAppliedTheme(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function stopFollowingTelegram() {
  if (typeof unsubscribeTelegramTheme !== 'function') {
    unsubscribeTelegramTheme = null;
    return;
  }
  try {
    unsubscribeTelegramTheme();
  } catch {
    // Already detached — nothing to do.
  }
  unsubscribeTelegramTheme = null;
}

// The theme actually applied to the document right now, which is what the
// toggle's icon must reflect (a manual override may already have changed it
// away from Telegram's raw signal).
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

export function applyTelegramTheme() {
  const stored = getStoredThemePreference();
  if (stored) {
    // Explicit student choice — apply it and never subscribe, so a later
    // `theme_changed` from Telegram cannot silently override it.
    setDark(stored === 'dark');
    return;
  }

  if (!isInsideTelegram()) return;

  setDark(readIsDark());

  // themeParams emits on `theme_changed`, so the signal keeps the class in sync
  // if the student switches theme while the Mini App is open.
  try {
    unsubscribeTelegramTheme = isDarkSignal.sub((dark) => setDark(dark));
  } catch {
    // Signal unavailable outside Telegram — the initial value above is enough.
    unsubscribeTelegramTheme = null;
  }
}

// Called by the header toggle. Pins the choice for this session and future
// loads, and detaches from Telegram's live signal if we were still following it.
export function setManualTheme(dark) {
  stopFollowingTelegram();
  setDark(dark);
  setStoredThemePreference(dark ? 'dark' : 'light');
}
