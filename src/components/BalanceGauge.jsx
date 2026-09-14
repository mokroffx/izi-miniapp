// Percentage-based "how much is left" bar.
//
// Deliberately renders ONLY `percentOfAllowance` — never the raw credit count
// (the numbers are large and meaningless to students) and never a countdown or
// any "days left" framing. This is a fullness gauge, not a timer.
export default function BalanceGauge({ percent, label = 'Осталось лимита' }) {
  const value = Math.max(0, Math.min(100, Number(percent ?? 0)));

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-[var(--text-secondary)]">{label}</span>
        <span className="text-sm font-semibold text-[var(--text)]">{value}%</span>
      </div>
      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-2)]"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-[var(--primary-bg)] transition-[width] duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
