// The Mini App's only screen (for a connected account): greeting (+ theme
// toggle) → plan + limit bar → plan comparison (free trial only) → referral →
// dashboard link.
//
// There is no navigation and no second screen. Anything deeper — usage
// history, subscription management, account settings — lives in the web
// dashboard behind the button at the bottom.
import BalanceGauge from '@/components/BalanceGauge';
import Card from '@/components/Card';
import ExternalLinkButton from '@/components/ExternalLinkButton';
import PlanCards from '@/components/PlanCards';
import ReferralBlock from '@/components/ReferralBlock';
import ThemeToggle from '@/components/ThemeToggle';
import { greetingName } from '@/lib/greeting';

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export default function HomeScreen({ me, config, referral }) {
  // `fullName` is the name the student entered in the web dashboard and is the
  // preferred source. Telegram's own `firstName` is only a fallback for
  // accounts that have not completed the conversational profile step yet, and
  // it goes through the same first-token reduction.
  const name = greetingName(me.fullName) ?? greetingName(me.firstName);
  const expiresAt = me.isFreeTrial ? null : formatDate(me.subscriptionExpiresAt);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-3 px-1 pt-1">
        <h1 className="min-w-0 truncate text-xl font-bold tracking-tight text-[var(--text)]">
          {name ? `Привет, ${name}` : 'Привет'}
        </h1>
        <ThemeToggle />
      </header>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-[var(--text-secondary)]">Тариф</div>
            <div className="mt-0.5 text-base font-bold text-[var(--text)]">{me.tierLabel}</div>
          </div>
          {expiresAt && (
            <div className="text-right">
              <div className="text-xs text-[var(--text-secondary)]">Действует до</div>
              <div className="mt-0.5 text-sm font-semibold text-[var(--text)]">{expiresAt}</div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <BalanceGauge percent={me.balance?.percentOfAllowance} />
        </div>
      </Card>

      {me.isFreeTrial && <PlanCards paymentUrl={config?.paymentUrl} />}

      <ReferralBlock
        status={referral.status}
        referral={referral.data}
        error={referral.error}
      />

      <ExternalLinkButton
        variant="secondary"
        href={config?.appUrl}
        className="w-full px-5 py-3 text-sm"
      >
        Перейти в личный кабинет
      </ExternalLinkButton>
    </div>
  );
}
