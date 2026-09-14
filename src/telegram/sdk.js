// Single place where the app touches @telegram-apps/sdk-react.
//
// Everything here is defensive: the bundle must still load (and `npm run build`
// must still be testable in a plain browser) when it is opened outside
// Telegram, where every SDK entry point throws LaunchParamsRetrieveError. In
// that case the app simply has no init data, the backend answers 401, and the
// UI shows its "open from Telegram" state instead of a blank screen.

import {
  init as initSdk,
  isThemeParamsDark,
  miniAppReady,
  mountMiniAppSync,
  mountThemeParamsSync,
  retrieveRawInitData,
  closeMiniApp,
  openLink as sdkOpenLink,
  openTelegramLink as sdkOpenTelegramLink,
} from '@telegram-apps/sdk-react';

let rawInitData = null;
let insideTelegram = false;

// Called once from main.jsx before the React tree mounts.
export function initTelegram() {
  try {
    initSdk();
    insideTelegram = true;
  } catch {
    // Not running inside a Telegram WebView — leave everything unmounted.
    return;
  }

  try {
    rawInitData = retrieveRawInitData() ?? null;
  } catch {
    rawInitData = null;
  }

  try {
    if (mountThemeParamsSync.isAvailable()) mountThemeParamsSync();
  } catch {
    // Theme params unavailable — the CSS falls back to prefers-color-scheme.
  }

  try {
    if (mountMiniAppSync.isAvailable()) mountMiniAppSync();
  } catch {
    // Non-fatal: only affects header/background colour syncing.
  }

  try {
    if (miniAppReady.isAvailable()) miniAppReady();
  } catch {
    // Non-fatal: Telegram just keeps its own loading placeholder a bit longer.
  }
}

export function isInsideTelegram() {
  return insideTelegram;
}

// Raw `initData` query string, sent verbatim as `Authorization: tma <initData>`
// on every authenticated backend call. The backend re-verifies its HMAC.
export function getRawInitData() {
  return rawInitData;
}

// Telegram's own dark/light decision, read from themeParams. Exported as the
// signal itself so components can subscribe to it via `useSignal`.
export const isDarkSignal = isThemeParamsDark;

export function readIsDark() {
  try {
    return Boolean(isThemeParamsDark());
  } catch {
    return false;
  }
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

// Opens a t.me link inside the Telegram client itself, then closes the Mini
// App. `close()` is called right after because on several clients
// `openTelegramLink` alone does not dismiss the WebView, which would leave the
// student staring at the Mini App instead of the pre-filled compose box.
export function openTelegramChat(url) {
  if (!url) return;
  let opened = false;
  try {
    if (sdkOpenTelegramLink.isAvailable()) {
      sdkOpenTelegramLink(url);
      opened = true;
    }
  } catch {
    opened = false;
  }

  if (!opened) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  try {
    if (closeMiniApp.isAvailable()) closeMiniApp();
  } catch {
    // Nothing else to do — the chat is already open on top of the Mini App.
  }
}
