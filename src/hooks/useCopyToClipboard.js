// "Copy text, show a brief confirmation" state machine, mirroring the web
// dashboard's hook of the same name — plus a document.execCommand('copy')
// fallback, which older Telegram WebViews (and any insecure context) still
// need because navigator.clipboard is missing there.
import { useEffect, useState } from 'react';

const FEEDBACK_MS = 1500;

function legacyCopy(text) {
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, el.value.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), FEEDBACK_MS);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy(text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      return;
    } catch {
      // Clipboard API unavailable or denied — try the legacy path below.
    }
    if (legacyCopy(text)) setCopied(true);
  }

  return { copied, copy };
}

export default useCopyToClipboard;
