// Manual light/dark override, persisted per device.
//
// By default the Mini App follows Telegram's own theme (see
// src/telegram/theme.js). Once the student taps the toggle in the header we
// store their explicit choice here and stop following Telegram, so switching
// the client theme later does not silently undo it.
//
// localStorage can throw outright (Safari private mode, WebViews with storage
// disabled), so every access is guarded and failure simply degrades to "no
// stored preference" — never to a crash.
const STORAGE_KEY = 'izichat:theme';

export function getStoredThemePreference() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function setStoredThemePreference(value) {
  try {
    if (value === 'light' || value === 'dark') {
      window.localStorage.setItem(STORAGE_KEY, value);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage unavailable — the theme still applies for this session, it just
    // will not survive a reload.
  }
}
