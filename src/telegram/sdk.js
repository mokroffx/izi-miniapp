// Single place where the app touches @telegram-apps/sdk-react.
//
// Everything here is defensive: the bundle must still load (and `npm run build`
// must still be testable in a plain browser) when it is opened outside
// Telegram, where every SDK entry point throws LaunchParamsRetrieveError. In
// that case the app simply has no init data, the backend answers 401, and the
// UI shows its "open from Telegram" state instead of a blank screen.

import {
  init as initSdk,
  miniAppReady,
  mountMiniAppSync,
  mountThemeParamsSync,
  retrieveRawInitData,
  openLink as sdkOpenLink,
} from '@telegram-apps/sdk-react';

let rawInitData = null;

// Called once from main.jsx before the React tree mounts.
export function initTelegram() {
  try {
    initSdk();
  } catch {
    // Not running inside a Telegram WebView — leave everything unmounted.
    return;
  }

  try {
    rawInitData = retrieveRawInitData() ?? null;
  } catch {
    rawInitData = null;
  }

  // Each of these is independently non-fatal (theme falls back to
  // prefers-color-scheme; mini-app mounting only affects header/background
  // colour syncing; a skipped miniAppReady just keeps Telegram's own loading
  // placeholder a bit longer) — one guarded call covers all three.
  for (const fn of [mountThemeParamsSync, mountMiniAppSync, miniAppReady]) {
    try {
      if (fn.isAvailable()) fn();
    } catch {
      // ignored — see reasoning above
    }
  }
}

// Raw `initData` query string, sent verbatim as `Authorization: tma <initData>`
// on every authenticated backend call. The backend re-verifies its HMAC.
export function getRawInitData() {
  return rawInitData;
}

// External https link — opens in Telegram's in-app browser and deliberately
// does NOT close the Mini App. Falls back to a normal navigation outside
// Telegram so the same handler works in a desktop browser during development.
export function openExternalLink(url) {
  if (!url) return;
  try {
    if (sdkOpenLink.isAvailable()) {
      sdkOpenLink(url);
      return;
    }
  } catch {
    // fall through to the plain-browser path
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}
