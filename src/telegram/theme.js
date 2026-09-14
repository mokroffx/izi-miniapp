// Applies Telegram's light/dark decision to the document as a `.dark` class —
// the same variant hook the web dashboard's CSS uses.
//
// Driven by themeParams rather than prefers-color-scheme because the Telegram
// client can run a dark app theme on a light OS (and the reverse), and this app
// only ever renders inside that client.
import { isDarkSignal, isInsideTelegram, readIsDark } from '@/telegram/sdk';

function setDark(dark) {
  document.documentElement.classList.toggle('dark', Boolean(dark));
  // Pin the attribute too, so the prefers-color-scheme fallback in index.css
  // stops applying once Telegram has told us what it wants. Outside Telegram
  // nothing is pinned and that fallback stays in charge.
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

export function applyTelegramTheme() {
  if (!isInsideTelegram()) return;

  setDark(readIsDark());

  // themeParams emits on `theme_changed`, so the signal keeps the class in sync
  // if the student switches theme while the Mini App is open.
  try {
    isDarkSignal.sub((dark) => setDark(dark));
  } catch {
    // Signal unavailable outside Telegram — the initial value above is enough.
  }
}
