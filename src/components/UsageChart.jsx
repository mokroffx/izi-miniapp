// Daily credit usage as a compact bar chart.
//
// Input is `dailyHistory` from GET /api/miniapp/usage — the backend's own
// pre-bucketed `[{ date: 'YYYY-MM-DD', credits_used: number }]` series
// (buildDailySeries() in chargeCredits.js), already zero-filled and UTC-keyed.
// This component used to re-derive the same series client-side from the raw
// per-skill `history` rows, keyed by LOCAL calendar day — which had quietly
// drifted from the web dashboard's own independent re-derivation of the same
// data (keyed by UTC day), so the two surfaces could show different totals
// for the same account. Both now render the one series the backend computes.
//
// Single series, single hue (`--accent`) — no legend, no gridlines, no axis
// labels. This renders at ~340px inside a phone WebView, so the only affordance
// is TAP-to-reveal: tapping a bar shows that day's date and value above the
// chart, tapping it again clears it. There is no hover state on purpose.
//
// No charting library — plain divs and CSS heights. Adding one to this repo for
// fourteen rectangles is not worth the bundle.
import { useMemo, useState } from 'react';

const BAR_AREA_PX = 96;
// A non-zero day must stay visible even when it is a rounding speck next to the
// max, otherwise "used something" and "used nothing" look identical.
const MIN_VISIBLE_PCT = 6;

// UTC-pinned so the label always names the same calendar day the backend
// bucketed into, regardless of the viewer's own timezone offset.
const dayLabelFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

function pluralCredits(n) {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return 'кредитов';
  if (last > 1 && last < 5) return 'кредита';
  if (last === 1) return 'кредит';
  return 'кредитов';
}

function toBars(dailyHistory) {
  return (dailyHistory ?? []).map((row) => ({
    key: row.date,
    date: new Date(`${row.date}T00:00:00Z`),
    value: Math.round(Number(row.credits_used) || 0),
  }));
}

export default function UsageChart({ dailyHistory = [] }) {
  const bars = useMemo(() => toBars(dailyHistory), [dailyHistory]);
  const [selected, setSelected] = useState(null);

  const max = bars.reduce((acc, b) => Math.max(acc, b.value), 0);
  const total = bars.reduce((acc, b) => acc + b.value, 0);

  // Pre-launch there is usually nothing here at all — an all-zero chart would
  // read as a bug rather than as "no usage yet".
  if (total <= 0) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">Пока нет данных об использовании</p>
    );
  }

  const active = selected == null ? null : bars.find((b) => b.key === selected);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-xs">
        {active ? (
          <span className="truncate font-semibold text-[var(--text)]">
            {dayLabelFormat.format(active.date)} — {active.value} {pluralCredits(active.value)}
          </span>
        ) : (
          <span className="text-[var(--text-secondary)]">Нажмите на столбец</span>
        )}
        <span className="shrink-0 text-[var(--text-secondary)]">макс. {max}</span>
      </div>

      <div
        // `group` rather than `img`: the bars are real buttons, and an `img`
        // role would hide them from assistive tech entirely.
        role="group"
        aria-label={`Использование за последние ${bars.length} дней, всего ${total} ${pluralCredits(total)}`}
        className="mt-3 flex items-end gap-1"
        style={{ height: `${BAR_AREA_PX}px` }}
      >
        {bars.map((bar) => {
          const pct =
            bar.value <= 0 ? 0 : Math.max(MIN_VISIBLE_PCT, (bar.value / max) * 100);
          const isActive = active?.key === bar.key;
          return (
            <button
              key={bar.key}
              type="button"
              onClick={() => setSelected((prev) => (prev === bar.key ? null : bar.key))}
              aria-label={`${dayLabelFormat.format(bar.date)}: ${bar.value} ${pluralCredits(bar.value)}`}
              aria-pressed={isActive}
              className="flex h-full flex-1 items-end"
            >
              <span
                className={`w-full rounded-t-[4px] transition-[height,opacity] duration-200 ${
                  bar.value <= 0
                    ? 'bg-[var(--surface-2)]'
                    : `bg-[var(--accent)] ${isActive ? '' : 'opacity-80'}`
                }`}
                style={{ height: bar.value <= 0 ? '2px' : `${pct}%` }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
