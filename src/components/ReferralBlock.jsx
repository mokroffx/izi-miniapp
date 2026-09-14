// Referral block, shown on Home for every connected student.
//
// The heading copy is fixed by spec. The link itself comes from
// GET /api/miniapp/referral, which reuses the exact same summary helper the web
// dashboard's /api/web/earn/summary uses — the two surfaces can never drift.
import Card from '@/components/Card';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function ReferralBlock({ status, referral, error }) {
  const { copied, copy } = useCopyToClipboard();
  const link = referral?.referralLink ?? '';

  return (
    <Card>
      <h2 className="text-base font-bold text-[var(--text)]">
        Пригласи друга — получи месяц бесплатно
      </h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Отправьте другу свою ссылку — мы считаем переходы и оплаты приглашённых.
      </p>

      {status === 'loading' && (
        <div className="mt-4 space-y-3" aria-hidden="true">
          <div className="h-11 animate-pulse rounded-xl bg-[var(--surface-2)]" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-[68px] animate-pulse rounded-2xl bg-[var(--surface-2)]" />
            <div className="h-[68px] animate-pulse rounded-2xl bg-[var(--surface-2)]" />
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 text-sm text-[var(--text-secondary)]">{error}</div>
      )}

      {status === 'loaded' && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.target.select()}
              aria-label="Ваша реферальная ссылка"
              className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-2.5 font-mono text-xs text-[var(--text)] outline-none"
            />
            <button
              type="button"
              onClick={() => copy(link)}
              aria-label={copied ? 'Скопировано' : 'Скопировать ссылку'}
              className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-2.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
            >
              {copied ? 'Скопировано' : 'Копировать'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Переходов по ссылке" value={referral?.totalSignups ?? 0} />
            <StatTile label="Оплативших подписку" value={referral?.convertedCount ?? 0} />
          </div>
        </div>
      )}
    </Card>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3.5">
      <div className="text-xl font-bold tracking-tight text-[var(--text)]">{value}</div>
      <div className="mt-1 text-[11px] text-[var(--text-secondary)]">{label}</div>
    </div>
  );
}
