// Client for the Mini App backend under /api/miniapp.
//
// Auth model: there is no cookie and no session. Every authenticated call sends
// `Authorization: tma <raw initData>` and the backend re-verifies Telegram's
// HMAC on each request. The raw string comes from the SDK — never from
// anything the page itself constructs.

import { getRawInitData } from '@/telegram/sdk';

// Deploy-time configuration. Never hardcode localhost here: the built bundle is
// served from miniapp.izichat.ru and must reach the public API origin.
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://api.izichat.ru';

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

async function request(path, { method = 'GET', auth = true, errorCode = 'request_failed' } = {}) {
  const headers = {};

  if (auth) {
    const initData = getRawInitData();
    if (!initData) {
      throw Object.assign(new Error('no_init_data'), { status: 401 });
    }
    headers.Authorization = `tma ${initData}`;
  }

  const res = await fetch(apiUrl(path), { method, headers });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw Object.assign(new Error(data?.error || errorCode), { status: res.status });
  }
  return data;
}

// GET /api/miniapp/config — public. { appUrl, paymentUrl, botUsername }
export function getConfig() {
  return request('/api/miniapp/config', { auth: false, errorCode: 'config_failed' });
}

// GET /api/miniapp/me — { connected: false } or the full profile/balance shape.
export function getMe() {
  return request('/api/miniapp/me', { errorCode: 'me_failed' });
}

// GET /api/miniapp/referral — { referralCode, referralLink, totalSignups, convertedCount }
export function getReferral() {
  return request('/api/miniapp/referral', { errorCode: 'referral_failed' });
}

// GET /api/miniapp/skills — public static catalog. The backend is the single
// source of truth for this list; the frontend only renders what it returns.
export function getSkills() {
  return request('/api/miniapp/skills', { auth: false, errorCode: 'skills_failed' });
}

// GET /api/miniapp/usage — 30-day skill breakdown.
export function getUsage() {
  return request('/api/miniapp/usage', { errorCode: 'usage_failed' });
}

// POST /api/miniapp/subscription/cancel — returns the new balance shape.
export function cancelSubscription() {
  return request('/api/miniapp/subscription/cancel', {
    method: 'POST',
    errorCode: 'cancel_failed',
  });
}

export function friendlyError(err) {
  if (err?.status === 401 || err?.message === 'no_init_data') {
    return 'Откройте приложение из Telegram — не удалось подтвердить вход.';
  }
  if (err?.status === 404 || err?.message === 'not_connected') {
    return 'Аккаунт ИзиЧат не привязан к этому Telegram.';
  }
  if (err?.message === 'not_subscribed') {
    return 'Активной подписки нет.';
  }
  if (err?.status >= 500) {
    return 'Сервис временно недоступен. Попробуйте позже.';
  }
  return 'Что-то пошло не так. Попробуйте ещё раз.';
}
