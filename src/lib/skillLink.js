// The ONE mechanism a quick action uses.
//
// There is no "launch skill" API. Tapping a skill only opens a normal Telegram
// chat with the bot and a PRE-FILLED, UNSENT message. The student presses Send
// themselves, which makes it an ordinary incoming Telegram message that goes
// through the exact same before_agent_run → classifier → credit reservation
// pipeline as anything they type by hand. No parallel billing path exists.

import { openTelegramChat } from '@/telegram/sdk';

export function buildSkillDeepLink(botUsername, template) {
  if (!botUsername || !template) return null;
  const handle = String(botUsername).replace(/^@/, '');
  return `https://t.me/${handle}?text=${encodeURIComponent(template)}`;
}

// Opens the deep link, then closes the Mini App (see openTelegramChat).
export function launchSkill(botUsername, skill) {
  const url = buildSkillDeepLink(botUsername, skill?.template);
  if (!url) return;
  openTelegramChat(url);
}

// Shared by HomeScreen and QuickActionsScreen so a future rule change can't
// be applied to one screen and missed on the other.
export function isSkillLocked(me, skill) {
  return Boolean(me?.isFreeTrial && skill?.paidOnly);
}
