# ИзиЧат Mini App

Telegram Mini App for ИзиЧат, deployed as a static bundle at
`miniapp.izichat.ru`. Vite + React (JSX, no TypeScript) + `@telegram-apps/sdk-react`,
matching the `izichat-dashboard` repo's conventions (same Tailwind v4 setup,
same `oxlint` config, same `@/` alias).

This is **not** the web dashboard. The dashboard is a standalone Vite SPA at
`~/izichat-dashboard`; this repo is the Telegram-native surface only.

## What it does

Three tabs (shown only once the Telegram account is linked to an ИзиЧат
account): `Главная`, `Быстрые действия`, `Профиль`. An unlinked account sees a
single welcome screen with login/signup links and no navigation.

Quick actions never call the backend to "start" anything. Tapping one opens
`https://t.me/<bot>?text=<template>` via the SDK's `openTelegramLink()` and then
closes the Mini App. The message is **pre-filled but unsent** — the student
presses Send, so the request enters the bot through the exact same
`before_agent_run` → classifier → credit-reservation pipeline as a hand-typed
message. There is deliberately no alternative "launch skill" API.

## Backend

All calls go to `/api/miniapp/*` on the backend. Authenticated calls send
`Authorization: tma <raw initData>`; the backend re-verifies Telegram's HMAC on
every request. There is no cookie and no session.

| Endpoint | Auth | Used by |
|---|---|---|
| `GET /api/miniapp/config` | no | bootstrap (appUrl, paymentUrl, botUsername) |
| `GET /api/miniapp/me` | yes | bootstrap, profile, post-cancel refresh |
| `GET /api/miniapp/skills` | no | quick-action catalog |
| `GET /api/miniapp/referral` | yes | Home referral block |
| `GET /api/miniapp/usage` | yes | Profile "Последние задачи" |
| `POST /api/miniapp/subscription/cancel` | yes | Profile cancel button |

The backend origin must be listed in the backend's `CORS_ORIGINS`
(`https://miniapp.izichat.ru`).

## Environment variables

| Variable | Required | Default | Notes |
|---|---|---|---|
| `VITE_API_BASE_URL` | at build time | `https://api.izichat.ru` | Origin of `izichat-backend`. Baked into the bundle by Vite, so it must be set **before** `npm run build`, not at runtime. Never point this at `localhost` for a deployed build. |

Create `.env.production` (git-ignored) for deploys:

```
VITE_API_BASE_URL=https://api.izichat.ru
```

Everything else the app needs (dashboard URL, payment/checkout URL, bot
username) is served at runtime by `GET /api/miniapp/config`, so no domain other
than the API origin is baked into the bundle.

## Development

```bash
npm install
npm run dev      # port 5174; Telegram only loads https, so expose it via a tunnel
npm run lint     # oxlint
npm run build    # → dist/
```

Opened in a plain browser (outside Telegram) the SDK has no init data, so
authenticated calls 401 and the app shows its error state — that is expected.

## Design

Strictly monochrome. The `--bg / --surface / --surface-2 / --border / --text /
--text-secondary / --input-bg / --hover` tokens in `src/index.css` are the
dashboard's own hueless `--cc-*` values; `--primary-bg` / `--primary-text`
replace the dashboard's violet button fill. Shapes match the dashboard:
`rounded-full` semibold buttons, `rounded-2xl` cards with a 1px `--border`,
`rounded-xl` inputs, the same system font stack. No accent hue is used
anywhere. Light/dark is driven by Telegram's `themeParams`, applied as a
`.dark` class on `<html>`.
